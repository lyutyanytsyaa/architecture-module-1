export class CheckoutService {
  constructor({ orderService, inventoryService, paymentService, notificationService }) {
    this.orderService = orderService;
    this.inventoryService = inventoryService;
    this.paymentService = paymentService;
    this.notificationService = notificationService;
  }

  async checkout(command) {
    const startedAt = performance.now();
    let order = this.orderService.createDraft(command);
    let inventoryReserved = false;
    let payment;

    try {
      this.inventoryService.reserve(order);
      inventoryReserved = true;
      order = this.orderService.markInventoryReserved(order.id);

      payment = await this.paymentService.chargeOrder(order.id, command.paymentToken);
      order = this.orderService.markPaid(order.id, payment.id);
      order = this.orderService.complete(order.id);
    } catch (error) {
      if (inventoryReserved) this.inventoryService.release(order);
      this.orderService.fail(order.id, error.code ?? "UNEXPECTED_ERROR");
      throw error;
    }

    // Точка неповернення: замовлення оплачене й завершене. Лист лише ставиться в чергу
    // (локальний запис, без мережі) і відправляється окремо. Збій листа тут не може
    // змінити результат замовлення, тому цей виклик стоїть ПОЗА try/catch з відкатом.
    const notification = this.#queueConfirmation(order);

    return {
      order,
      payment,
      notification,
      durationMs: Math.round(performance.now() - startedAt)
    };
  }

  #queueConfirmation(order) {
    try {
      return this.notificationService.enqueueOrderConfirmation(order);
    } catch (error) {
      // Навіть збій постановки в чергу не має ламати оплачене замовлення.
      console.error(`Could not queue confirmation for ${order.id}:`, error);
      return { orderId: order.id, status: "NOT_QUEUED" };
    }
  }
}
