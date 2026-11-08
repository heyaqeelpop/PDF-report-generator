function money(n) {
  return "$" + n.toFixed(2);
}

function buildHtml(report, orders) {
  const today = new Date().toISOString().slice(0, 10);

  const topRows = report.topProducts
    .map(
      (p) =>
        `<tr><td>${p.product}</td><td>${p.orders}</td><td>${money(p.revenue)}</td></tr>`
    )
    .join("");

  const orderRows = orders
    .map(
      (o) =>
        `<tr><td>${o.id}</td><td>${o.created_at}</td><td>${o.customer}</td><td>${o.product}</td><td>${money(o.amount)}</td></tr>`
    )
    .join("");



    const dayRows = report.ordersPerDay
    .map((d) => `<tr><td>${d.day}</td><td>${d.orders}</td></tr>`)
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; color: #222; }
    h1 { margin-bottom: 4px; }
    .date { color: #666; margin-top: 0; }
    .totals { display: flex; gap: 24px; margin: 20px 0; }
    .card { border: 1px solid #ccc; padding: 12px 20px; border-radius: 6px; }
    .card .label { font-size: 12px; color: #666; }
    .card .value { font-size: 22px; font-weight: bold; }
    table { border-collapse: collapse; width: 100%; margin-bottom: 24px; }
    th, td { border: 1px solid #ddd; padding: 6px 10px; text-align: left; font-size: 13px; }
    th { background: #f0f0f0; }
    tr { break-inside: avoid; }
    thead { display: table-header-group; }
  </style>
</head>
<body>
  <h1>Sales Report</h1>
  <p class="date">Generated on ${today}</p>

  <div class="totals">
    <div class="card"><div class="label">Total orders</div><div class="value">${report.totalOrders}</div></div>
    <div class="card"><div class="label">Total revenue</div><div class="value">${money(report.totalRevenue)}</div></div>
  </div>

  <h2>Top 5 products by revenue</h2>
  <table>
    <tr><th>Product</th><th>Orders</th><th>Revenue</th></tr>
    ${topRows}
  </table>

    <h2>Orders per day (last 7 days)</h2>
  <table>
    <tr><th>Date</th><th>Orders</th></tr>
    ${dayRows}
  </table>

  <h2>All orders</h2>
  <table>
    <thead>
      <tr><th>ID</th><th>Date</th><th>Customer</th><th>Product</th><th>Amount</th></tr>
    </thead>
    <tbody>
      ${orderRows}
    </tbody>
  </table>
</body>
</html>`;
}

module.exports = { buildHtml };