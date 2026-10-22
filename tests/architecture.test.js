// Fitness functions для OrderFlow. Покласти у tests/ і запустити: npm test
// FF2 зелений після виносу email (крок 2). FF1 позначений todo: він позеленіє після кроку 1 (Payments без OrderRepository).
import assert from "node:assert/strict";
import test from "node:test";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const read = (dir) =>
  readdirSync(join("src", dir)).filter((f) => f.endsWith(".js"))
    .map((f) => ({ file: `src/${dir}/${f}`, text: readFileSync(join("src", dir, f), "utf8") }));

// FF1: Payments не знає про внутрішню будову Orders.
test("Payments does not depend on Orders internals", { todo: "крок 1 плану: Payments отримує суму параметрами" }, () => {
  const forbidden = [/orderRepository/i, /database\.orders/, /from\s+["']\.\.\/orders\//];
  for (const { file, text } of read("payments")) {
    for (const rule of forbidden) {
      assert.doesNotMatch(text, rule, `${file} порушує межу Payments -> Orders (${rule})`);
    }
  }
});

// FF2: збій листа не ламає завершене й оплачене замовлення.
test("Notification failure does not fail a paid order", async () => {
  const { createApplication } = await import("../src/app.js");
  const { ExternalDependencyError } = await import("../src/shared/errors.js");
  const app = createApplication({
    paymentProvider: { async charge(i) { return { ...i, provider: "T", providerPaymentId: "p1", latencyMs: 1 }; } },
    notificationProvider: { async sendEmail() { throw new ExternalDependencyError("down", "FakeMail"); } }
  });
  await app.services.checkout.checkout({
    customer: { name: "Ada", email: "ada@example.com" },
    items: [{ sku: "KEYBOARD", quantity: 1 }],
    paymentToken: "tok_test_4242"
  });
  assert.equal(app.services.orders.requireOrder("order_0001").status, "COMPLETED");
});
