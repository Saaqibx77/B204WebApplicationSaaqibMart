
Web Application developed using HTML, CSS, JavaScript, Json, NodeJs,expressJs

# MobiMart — Mobile Phone E-Commerce Website

A simple e-commerce web application for selling mobile phones, built with HTML, CSS, JavaScript, and Node.js with back end is maintained in simple json file

# Important Features

- *Product Listing* — Browse 8 popular smartphones with prices in EUR
- *Shopping Cart* — Add or remove items, adjust quantities, view running total
- *Multi-Step Checkout* — Shipping details → Payment selection → Order confirmation
- *Multiple Payment Methods* — Credit/Debit Card, PayPal, Bank Transfer
- *Order Persistence* — All placed orders are saved to `orders.json` via Node.js backend
- *Order History API* — View all saved orders at `GET /api/orders`
- *Contact Form* — Submit inquiries with toast confirmation
- *Responsive Design* — Works on desktop, tablet, and mobile
- *Minimal CSS* — Clean, lightweight styling with no frameworks

# Tech Stack

| Layer     | Technology             |
|-----------|------------------------|
| Front-end | HTML, CSS, JavaScript  |
| Back-end  | Node.js, Express.js    |
| Data      | JSON file (`orders.json`) |

# Project Structure

```
mobileee/
├── index.html      # Main HTML page
├── style.css       # Minimal stylesheet
├── script.js       # Front-end logic (cart, checkout, API calls)
├── server.js       # Express server (serves static files + order API)
├── package.json    # Node.js dependencies
├── orders.json     # Auto-created file storing all placed orders
└── README.md       # This file
```

# Setup & Installation

# Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)

# Steps

1. *Clone the repository*
   ```bash
   git clone https://github.com/yourusername/mobimart.git
   cd mobimart
   ```

2. *Install dependencies*
   ```bash
   npm install
   ```

3. *Start the server*
   ```bash
   npm start
   ```

4. *Open in browser*
   ```
   http://localhost:3000
   ```

# API Endpoints

# `POST /api/orders`

Saves a new order to `orders.json`.

*Request body:*
```json
{
  "orderNum": "MM-M5K2X8",
  "total": 1798,
  "items": [
    { "id": 1, "name": "iPhone 16 Pro", "price": 1199, "qty": 1, "subtotal": 1199 },
    { "id": 4, "name": "OnePlus 13", "price": 629, "qty": 1, "subtotal": 629 }
  ],
  "shipping": {
    "name": "John Doe",
    "email": "john@example.com",
    "address": "123 Main St",
    "city": "Berlin",
    "zip": "10115",
    "country": "Germany"
  },
  "paymentMethod": "card"
}
```

*Response:*
```json
{ "success": true, "orderNum": "MM-M5K2X8" }
```

# `GET /api/orders`

Returns all saved orders as a JSON array.

# How It Works

1. User browses phones and adds them to cart
2. User clicks "Proceed to Checkout" from the cart sidebar
3. User fills in shipping details and selects a payment method
4. On "Place Order", the front-end sends a `POST /api/orders` request to the server
5. The server saves the order (with items, shipping, payment method, and timestamp) to `orders.json`
6. User sees order confirmation with a unique order number

# Available Products

| #  | Phone              | Price     |
|----|--------------------|-----------|
| 1  | iPhone 16 Pro      | €1,199.00 |
| 2  | Samsung Galaxy S25 | €899.00   |
| 3  | Google Pixel 9     | €749.00   |
| 4  | OnePlus 13         | €629.00   |
| 5  | Xiaomi 15 Ultra    | €549.00   |
| 6  | Samsung Galaxy A56 | €329.00   |
| 7  | iPhone SE 4        | €499.00   |
| 8  | Nothing Phone 3    | €399.00   |


