const { DatabaseSync } = require("node:sqlite");

const db = new DatabaseSync("report.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY,
    customer TEXT,
    product TEXT,
    amount REAL,
    created_at TEXT
  )
`);

// Step 1: remove old rows so running this twice never doubles the data
db.exec("DELETE FROM orders");

// Step 2: the lists we pick from
const customers = ["Asha", "Ravi", "Meera", "John", "Sara", "Kabir", "Priya", "Liam"];
const products = ["Laptop", "Headphones", "Keyboard", "Mouse", "Monitor", "Webcam"];

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function randomAmount() {
  return Math.round((5 + Math.random() * 195) * 100) / 100;
}

function randomDate() {
  const date = new Date();
  const daysAgo = Math.floor(Math.random() * 30);
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().slice(0, 10);
}

// Step 3: insert 200 random orders
const insert = db.prepare(
  "INSERT INTO orders (customer, product, amount, created_at) VALUES (?, ?, ?, ?)"
);

for (let i = 0; i < 200; i++) {
  insert.run(pick(customers), pick(products), randomAmount(), randomDate());
}

// Step 4: count the rows to prove it worked
const result = db.prepare("SELECT COUNT(*) AS total FROM orders").get();
console.log("Rows in orders:", result.total);



