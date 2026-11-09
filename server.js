const express = require("express");
const path = require("path");
const { generateReport, getReport, findTodaysReport } = require("./reports");

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Door 1: make a report (slow: takes a few seconds)
app.post("/reports", async (req, res) => {
  const force = req.body && req.body.force === true;

  // Idempotency check: reuse today's report unless force is true
  if (!force) {
    const existing = findTodaysReport();
    if (existing) {
      return res.status(200).json({ id: existing.id, file: existing.file });
    }
  }

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

  if (!report.path) {
    return res
      .status(409)
      .json({ error: "Report is still being generated, try again shortly" });
  }

  res.sendFile(path.resolve(report.path));
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});