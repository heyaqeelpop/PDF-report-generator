const fs = require("fs");
const { chromium } = require("playwright");
const { getReportData, getAllOrders } = require("./report-data");
const { buildHtml } = require("./report-html");

async function main() {
  const html = buildHtml(getReportData(), getAllOrders());

  fs.mkdirSync("reports", { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent(html);
  await page.pdf({
    path: "reports/test.pdf",
    format: "A4",
    printBackground: true,
  });
  await browser.close();

  console.log("Wrote reports/test.pdf");
}

main();