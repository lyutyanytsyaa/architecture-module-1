export class ReportingService {
  constructor(database) {
    this.database = database;
  }

  buildSalesSummary({ from, to } = {}) {
    // Deliberate trade-off: reporting scans operational collections in-process.
    const start = from ? new Date(from).getTime() : Number.NEGATIVE_INFINITY;
    const end = to ? new Date(to).getTime() : Number.POSITIVE_INFINITY;
    const orders = [...this.database.orders.values()].filter((order) => {
      const timestamp = new Date(order.createdAt).getTime();
      return timestamp >= start && timestamp <= end;
    });

    const rows = orders.map((order) => {
      const payment = [...this.database.payments.values()].find(
        (entry) => entry.orderId === order.id
      );
      const notification = this.database.notifications.find(
        (entry) => entry.orderId === order.id
      );
      return {
        orderId: order.id,
        status: order.status,
        totalCents: order.totalCents,
        paymentStatus: payment?.status ?? "MISSING",
        notificationStatus: notification?.status ?? "MISSING",
        itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0)
      };
    });

    return {
      generatedAt: new Date().toISOString(),
      orderCount: rows.length,
      completedCount: rows.filter((row) => row.status === "COMPLETED").length,
      revenueCents: rows
        .filter((row) => row.paymentStatus === "CAPTURED")
        .reduce((sum, row) => sum + row.totalCents, 0),
      rows
    };
  }

  productPerformance() {
    const totals = new Map();
    for (const order of this.database.orders.values()) {
      for (const item of order.items) {
        const current = totals.get(item.sku) ?? { sku: item.sku, units: 0, revenueCents: 0 };
        const product = this.database.products.get(item.sku);
        current.units += item.quantity;
        current.revenueCents += (product?.priceCents ?? 0) * item.quantity;
        totals.set(item.sku, current);
      }
    }
    return [...totals.values()].sort((left, right) => right.revenueCents - left.revenueCents);
  }

  operationalHealth() {
    const payments = [...this.database.payments.values()];
    const captured = payments.filter((payment) => payment.status === "CAPTURED");
    const latencies = captured
      .map((payment) => payment.providerLatencyMs)
      .filter(Number.isFinite)
      .sort((left, right) => left - right);
    const percentileIndex = Math.max(0, Math.ceil(latencies.length * 0.95) - 1);

    return {
      generatedAt: new Date().toISOString(),
      payments: {
        total: payments.length,
        failed: payments.filter((payment) => payment.status === "FAILED").length,
        providerP95Ms: latencies[percentileIndex] ?? null
      },
      orders: {
        total: this.database.orders.size,
        failed: [...this.database.orders.values()].filter((order) => order.status === "FAILED").length
      },
      notifications: {
        sent: this.database.notifications.filter((entry) => entry.status === "SENT").length,
        pending: this.database.notifications.filter((entry) => entry.status === "PENDING").length,
        failed: this.database.notifications.filter((entry) => entry.status === "FAILED").length
      }
    };
  }
}
