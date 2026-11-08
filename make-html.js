const fs = require("fs");
const { getReportData, getAllOrders } = require("./report-data");
const { buildHtml } = require("./report-html");

fs.mkdirSync("reports", { recursive: true });
fs.writeFileSync("reports/test.html", buildHtml(getReportData(), getAllOrders()));

console.log("Wrote reports/test.html");