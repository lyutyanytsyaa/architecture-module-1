import { formatMoney } from "../shared/money.js";

const TEMPLATE = "ORDER_CONFIRMATION_V1";
const DEFAULT_MAX_ATTEMPTS = 5;

/**
 * Notifications працює як outbox:
 *  - enqueueOrderConfirmation() лише ЗАПИСУЄ лист зі статусом PENDING (швидко, локально, без мережі);
 *  - dispatchPending() відправляє PENDING-листи і повторює невдалі спроби.
 *
 * Checkout викликає тільки enqueue, тому збій або повільність email-провайдера
 * більше не впливає на результат замовлення.
 *
 * Обмеження навчальної версії: сховище in-memory, тому черга не переживає перезапуск.
 * У реальній системі outbox має лежати в durable сховищі.
 */
export class NotificationService {
  #dispatching = false;

  constructor(database, provider, settings = {}) {
    this.database = database;
    this.provider = provider;
    this.maxAttempts = settings.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;
  }

  /** Ставить лист у чергу. Ідемпотентно: для одного замовлення створюється один запис. */
  enqueueOrderConfirmation(order) {
    const existing = this.database.notifications.find(
      (entry) => entry.orderId === order.id && entry.template === TEMPLATE
    );
    if (existing) return structuredClone(existing);

    const record = {
      id: this.database.nextId("notification"),
      orderId: order.id,
      channel: "EMAIL",
      template: TEMPLATE,
      status: "PENDING",
      attempts: 0,
      lastError: null,
      // Marketing edits this template often, but it ships with the whole application.
      message: {
        to: order.customer.email,
        subject: `Order ${order.id} confirmed`,
        body: `Thanks ${order.customer.name}. Your total is ${formatMoney(order.totalCents)}.`
      },
      createdAt: new Date().toISOString(),
      sentAt: null
    };
    this.database.notifications.push(record);
    return structuredClone(record);
  }

  /**
   * Одна «ітерація worker»: пробує відправити всі PENDING-листи.
   * Невдала спроба лишає лист у PENDING (буде повтор), а після maxAttempts
   * лист переходить у FAILED, щоб його було видно в звітах.
   */
  async dispatchPending() {
    if (this.#dispatching) return { processed: 0, sent: 0, failed: 0, skipped: true };
    this.#dispatching = true;
    const summary = { processed: 0, sent: 0, failed: 0, skipped: false };
    try {
      const pending = this.database.notifications.filter((entry) => entry.status === "PENDING");
      for (const record of pending) {
        summary.processed += 1;
        record.attempts += 1;
        try {
          const result = await this.provider.sendEmail(record.message);
          record.status = "SENT";
          record.providerMessageId = result.providerMessageId;
          record.latencyMs = result.latencyMs;
          record.sentAt = new Date().toISOString();
          record.lastError = null;
          summary.sent += 1;
        } catch (error) {
          record.lastError = error.message;
          if (record.attempts >= this.maxAttempts) {
            record.status = "FAILED";
            summary.failed += 1;
          }
        }
      }
    } finally {
      this.#dispatching = false;
    }
    return summary;
  }

  /** Фонова відправка. Повертає функцію зупинки. Таймер не тримає процес живим. */
  startWorker(intervalMs = 1000) {
    const timer = setInterval(() => {
      this.dispatchPending().catch((error) => console.error("Notification worker error:", error));
    }, intervalMs);
    timer.unref?.();
    return () => clearInterval(timer);
  }
}
