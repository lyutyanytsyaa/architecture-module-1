import { createApplication } from "./app.js";

const instantProvider = {
  async charge(input) {
    return {
      ...input,
      provider: "DemoPay",
      providerPaymentId: "demo_payment",
      latencyMs: 0
    };
  }
};
const instantMail = {
  async sendEmail(input) {
    return { ...input, providerMessageId: "demo_mail", latencyMs: 0 };
  }
};

const app = createApplication({ paymentProvider: instantProvider, notificationProvider: instantMail });
const result = await app.services.checkout.checkout({
  customer: { name: "Ada", email: "ada@example.com" },
  items: [{ sku: "KEYBOARD", quantity: 1 }, { sku: "MOUSE", quantity: 2 }],
  paymentToken: "tok_demo_4242"
});

console.log("Checkout done. Confirmation is queued:", result.notification.status);
await app.services.notifications.dispatchPending();
result.notification = app.database.notifications[0];

console.log(JSON.stringify(result, null, 2));
