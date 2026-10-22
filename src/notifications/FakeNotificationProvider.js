import { ExternalDependencyError } from "../shared/errors.js";

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export class FakeNotificationProvider {
  constructor(settings, random = Math.random) {
    this.settings = settings;
    this.random = random;
  }

  async sendEmail({ to, subject, body }) {
    const latencyMs = Math.round(
      this.settings.minMs + (this.settings.maxMs - this.settings.minMs) * this.random()
    );
    await wait(latencyMs);
    if (this.random() < this.settings.failureRate) {
      throw new ExternalDependencyError("Email delivery failed", "FakeMail");
    }
    return { providerMessageId: `mail_${crypto.randomUUID()}`, to, subject, body, latencyMs };
  }
}
