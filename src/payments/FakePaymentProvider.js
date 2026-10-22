import { ExternalDependencyError } from "../shared/errors.js";

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

function randomBetween(min, max, random) {
  return Math.round(min + (max - min) * random());
}

export class FakePaymentProvider {
  constructor(settings, random = Math.random) {
    this.settings = settings;
    this.random = random;
  }

  async charge({ amountCents, currency, reference, paymentToken }) {
    const slow = this.random() < this.settings.slowRate;
    const latencyMs = slow
      ? randomBetween(this.settings.slowMinMs, this.settings.slowMaxMs, this.random)
      : randomBetween(this.settings.normalMinMs, this.settings.normalMaxMs, this.random);
    await wait(latencyMs);

    if (this.random() < this.settings.failureRate) {
      throw new ExternalDependencyError(
        "Payment provider rejected the request",
        "FakePay"
      );
    }

    return {
      provider: "FakePay",
      providerPaymentId: `fp_${crypto.randomUUID()}`,
      reference,
      amountCents,
      currency,
      paymentTokenSuffix: paymentToken.slice(-4),
      latencyMs
    };
  }
}
