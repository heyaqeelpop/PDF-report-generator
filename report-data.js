const { DatabaseSync } = require("node:sqlite");

function getReportData() {
  const db = new DatabaseSync("report.db");

  const totals = db
    .prepare(
      "SELECT COUNT(*) AS total_orders, SUM(amount) AS total_revenue FROM orders"
    )
    .get();

  const topProducts = db
    .prepare(
      `SELECT product, SUM(amount) AS revenue, COUNT(*) AS orders
       FROM orders
       GROUP BY product
       ORDER BY revenue DESC
       LIMIT 5`
    )
    .all();

  // NEW: orders per day for the last 7 days
  const ordersPerDay = db
    .prepare(
      `SELECT created_at AS day, COUNT(*) AS orders
       FROM orders
       WHERE created_at >= date('now', '-6 days')
       GROUP BY created_at
       ORDER BY created_at`
    )
    .all();

  db.close();

  return {
    totalOrders: totals.total_orders,
    totalRevenue: Math.round(totals.total_revenue * 100) / 100,
    topProducts: topProducts.map((row) => ({
      product: row.product,
      revenue: Math.round(row.revenue * 100) / 100,
      orders: row.orders,
    })),
    // NEW
    ordersPerDay: ordersPerDay.map((row) => ({
      day: row.day,
      orders: row.orders,
    })),
  };
}



function getAllOrders() {
  const db = new DatabaseSync("report.db");

  const rows = db
    .prepare(
      "SELECT id, customer, product, amount, created_at FROM orders ORDER BY created_at, id"
    )
    .all();

  db.close();
  return rows;
}

module.exports = { getReportData, getAllOrders };