const { generateReport, getReport } = require("./reports");

async function main() {
  const created = await generateReport();
  console.log("Created:", created);
  console.log("Looked up:", getReport(created.id));
}

main();