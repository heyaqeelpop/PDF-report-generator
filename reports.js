const fs = require("fs");
const path = require("path");
const { DatabaseSync } = require("node:sqlite");
const { chromium } = require("playwright");
const { getReportData, getAllOrders } = require("./report-data");
const { buildHtml } = require("./report-html");

function openDb() {
  const db = new DatabaseSync("report.db");
  db.exec(`
    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY,
      path TEXT,
      created_at TEXT
    )
  `);
  return db;
}

async function generateReport() {
  const db = openDb();

  // 1. insert a row first, just to get an id
  const inserted = db
    .prepare("INSERT INTO reports (path, created_at) VALUES (?, ?)")
    .run("", new Date().toISOString());
  const id = Number(inserted.lastInsertRowid);
  const filePath = path.join("reports", `${id}.pdf`);

  try {
    // 2. query + render
    const html = buildHtml(getReportData(), getAllOrders());
    fs.mkdirSync("reports", { recursive: true });

    const browser = await chromium.launch();
    try {
      const page = await browser.newPage();
      await page.setContent(html);
      await page.pdf({ path: filePath, format: "A4", printBackground: true });
    } finally {
      await browser.close();
    }

    // 3. store the path in the database
    db.prepare("UPDATE reports SET path = ? WHERE id = ?").run(filePath, id);
  } catch (error) {
    // something failed: remove the half-made row, then pass the error on
    db.prepare("DELETE FROM reports WHERE id = ?").run(id);
    throw error;
  } finally {
    db.close();
  }

  return { id, file: `/reports/${id}/file` };
}

function getReport(id) {
  const db = openDb();
  const row = db
    .prepare("SELECT id, path, created_at FROM reports WHERE id = ?")
    .get(id);
  db.close();

  if (!row) return null;
  return {
    id: row.id,
    file: `/reports/${row.id}/file`,
    path: row.path,
    created_at: row.created_at,
  };
}

function findTodaysReport() {
  const db = openDb();
  const today = new Date().toISOString().slice(0, 10);

  const row = db
    .prepare(
      "SELECT id, path, created_at FROM reports WHERE created_at >= ? ORDER BY id DESC LIMIT 1"
    )
    .get(today);
  db.close();

  if (!row) return null;
  return {
    id: row.id,
    file: `/reports/${row.id}/file`,
    path: row.path,
    created_at: row.created_at,
  };
}

module.exports = { generateReport, getReport, findTodaysReport };