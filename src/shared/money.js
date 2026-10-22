import { DomainError } from "./errors.js";

export function calculateOrderTotal(items, productsBySku) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new DomainError("Order must contain at least one item", "EMPTY_ORDER");
  }

  let totalCents = 0;
  for (const item of items) {
    const product = productsBySku.get(item.sku);
    if (!product) {
      throw new DomainError(`Unknown product: ${item.sku}`, "UNKNOWN_PRODUCT");
    }
    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      throw new DomainError("Quantity must be a positive integer", "INVALID_QUANTITY");
    }
    totalCents += product.priceCents * item.quantity;
  }

  return totalCents;
}

export function formatMoney(cents, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency
  }).format(cents / 100);
}
