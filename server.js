const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const ORDERS_FILE = path.join(__dirname, "orders.json");

app.use(express.json());
app.use(express.static(__dirname));

function loadOrders() {
  if (fs.existsSync(ORDERS_FILE)) {
    return JSON.parse(fs.readFileSync(ORDERS_FILE, "utf-8"));
  }
  return [];
}

function saveOrders(orders) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
}

app.post("/api/orders", (req, res) => {
  const order = req.body;

  if (!order || !order.orderNum || !order.items || order.items.length === 0) {
    return res.status(400).json({ error: "Invalid order data" });
  }

  order.createdAt = new Date().toISOString();

  const orders = loadOrders();
  orders.push(order);
  saveOrders(orders);

  console.log(
    `Order saved: ${order.orderNum} | €${order.total} | ${order.items.length} item(s)`,
  );
  res.json({ success: true, orderNum: order.orderNum });
});

app.get("/api/orders", (req, res) => {
  const orders = loadOrders();
  res.json(orders);
});

app.listen(PORT, () => {
  console.log(`MobiMart server running at http://localhost:${PORT}`);
});
