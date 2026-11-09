const express = require("express");
const path = require("path");
const { generateReport, getReport } = require("./reports");

const app = express();

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Door 1: make a report (slow: takes a few seconds)
app.post("/reports", async (req, res) => {
  try {
    const report = await generateReport();
    res.status(201).json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not generate report" });
  }
});

// Door 2: look up one report's record
app.get("/reports/:id", (req, res) => {
  const id = Number(req.params.id);
  const report = Number.isInteger(id) ? getReport(id) : null;

  if (!report) {
    return res.status(404).json({ error: "Report not found" });
  }

  res.json({
    id: report.id,
    file: report.file,
    created_at: report.created_at,
  });
});

// Door 3: download the PDF itself
app.get("/reports/:id/file", (req, res) => {
  const id = Number(req.params.id);
  const report = Number.isInteger(id) ? getReport(id) : null;

  if (!report) {
    return res.status(404).json({ error: "Report not found" });
  }

  res.sendFile(path.resolve(report.path));
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});