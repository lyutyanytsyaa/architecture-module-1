export class OrderRepository {
  constructor(database) {
    this.database = database;
  }

  create(orderData) {
    const order = {
      id: this.database.nextId("order"),
      status: "PENDING",
      paymentStatus: "NOT_STARTED",
      inventoryStatus: "NOT_RESERVED",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...structuredClone(orderData)
    };
    this.database.orders.set(order.id, order);
    return structuredClone(order);
  }

  findById(orderId) {
    const order = this.database.orders.get(orderId);
    return order ? structuredClone(order) : null;
  }

  save(order) {
    const updated = { ...structuredClone(order), updatedAt: new Date().toISOString() };
    this.database.orders.set(updated.id, updated);
    return structuredClone(updated);
  }

  list() {
    return [...this.database.orders.values()].map((order) => structuredClone(order));
  }
}
