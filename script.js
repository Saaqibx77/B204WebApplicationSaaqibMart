/* ===== PRODUCT DATA (prices in EUR) ===== */
const products = [
  { id: 1, name: "iPhone 16 Pro",         price: 1199.00, emoji: "📱" },
  { id: 2, name: "Samsung Galaxy S25",    price: 899.00,  emoji: "📱" },
  { id: 3, name: "Google Pixel 9",        price: 749.00,  emoji: "📱" },
  { id: 4, name: "OnePlus 13",            price: 629.00,  emoji: "📱" },
  { id: 5, name: "Xiaomi 15 Ultra",       price: 549.00,  emoji: "📱" },
  { id: 6, name: "Samsung Galaxy A56",    price: 329.00,  emoji: "📱" },
  { id: 7, name: "iPhone SE 4",           price: 499.00,  emoji: "📱" },
  { id: 8, name: "Nothing Phone 3",       price: 399.00,  emoji: "📱" },
];

/* ===== CART STATE ===== */
let cart = []; // { product, qty }

/* ===== FORMAT EURO ===== */
function eur(n) {
  return "€" + n.toFixed(2);
}

/* ===== RENDER PRODUCT CARDS ===== */
function renderProducts() {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = products.map(p => `
    <div class="card fade-in" id="product-${p.id}">
      <div class="card-img">${p.emoji}</div>
      <div class="card-body">
        <h3>${p.name}</h3>
        <p class="price">${eur(p.price)}</p>
        <button class="add-btn" onclick="addToCart(${p.id})">Add to Cart</button>
      </div>
    </div>
  `).join("");
}

/* ===== ADD TO CART ===== */
function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(c => c.product.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ product, qty: 1 });
  }
  updateCartUI();
  showToast(`${product.name} added to cart!`);
}

/* ===== CHANGE QTY ===== */
function changeQty(id, delta) {
  const item = cart.find(c => c.product.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else updateCartUI();
}

/* ===== REMOVE FROM CART ===== */
function removeFromCart(id) {
  cart = cart.filter(c => c.product.id !== id);
  updateCartUI();
}

/* ===== CART TOTAL ===== */
function getTotal() {
  return cart.reduce((sum, c) => sum + c.product.price * c.qty, 0);
}

/* ===== UPDATE CART UI ===== */
function updateCartUI() {
  const totalItems = cart.reduce((s, c) => s + c.qty, 0);
  document.getElementById("cartCount").textContent = totalItems;

  const container = document.getElementById("cartItems");
  const emptyMsg = document.getElementById("cartEmpty");
  const footer = document.getElementById("cartFooter");

  if (cart.length === 0) {
    emptyMsg.style.display = "block";
    footer.style.display = "none";
    // clear item elements
    container.querySelectorAll(".cart-item").forEach(el => el.remove());
    return;
  }

  emptyMsg.style.display = "none";
  footer.style.display = "block";

  // render items
  let html = "";
  cart.forEach(c => {
    html += `
      <div class="cart-item">
        <div class="cart-item-emoji">${c.product.emoji}</div>
        <div class="cart-item-info">
          <h4>${c.product.name}</h4>
          <span class="ci-price">${eur(c.product.price)}</span>
        </div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="changeQty(${c.product.id}, -1)">−</button>
          <span class="qty-display">${c.qty}</span>
          <button class="qty-btn" onclick="changeQty(${c.product.id}, 1)">+</button>
          <button class="cart-item-remove" onclick="removeFromCart(${c.product.id})" title="Remove">🗑</button>
        </div>
      </div>`;
  });
  // keep empty msg element, replace the rest
  container.querySelectorAll(".cart-item").forEach(el => el.remove());
  container.insertAdjacentHTML("beforeend", html);

  document.getElementById("cartTotal").textContent = eur(getTotal());
}

/* ===== TOGGLE CART SIDEBAR ===== */
function toggleCart() {
  document.getElementById("cartSidebar").classList.toggle("open");
  document.getElementById("cartOverlay").classList.toggle("open");
}

/* ===== CHECKOUT MODAL ===== */
function openCheckout() {
  if (cart.length === 0) return;
  toggleCart(); // close cart sidebar
  // reset to shipping step
  showStep("stepShipping");
  document.getElementById("checkoutOverlay").classList.add("open");
  document.getElementById("checkoutModal").classList.add("open");
}
function closeCheckout() {
  document.getElementById("checkoutOverlay").classList.remove("open");
  document.getElementById("checkoutModal").classList.remove("open");
}

function showStep(id) {
  document.querySelectorAll(".checkout-step").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

/* ===== SHIPPING → PAYMENT ===== */
function goToPayment(e) {
  e.preventDefault();
  // build order summary
  let lines = "";
  cart.forEach(c => {
    lines += `<div class="os-line"><span>${c.product.name} × ${c.qty}</span><span>${eur(c.product.price * c.qty)}</span></div>`;
  });
  lines += `<div class="os-line total"><span>Total</span><span>${eur(getTotal())}</span></div>`;
  document.getElementById("orderSummary").innerHTML = lines;
  showStep("stepPayment");
}

function backToShipping() {
  showStep("stepShipping");
}

/* ===== PAYMENT METHOD SELECTION ===== */
function selectPayment(radio) {
  // highlight selected
  document.querySelectorAll(".payment-option").forEach(o => o.classList.remove("selected"));
  radio.closest(".payment-option").classList.add("selected");

  const val = radio.value;
  document.getElementById("cardFields").classList.toggle("hidden", val !== "card");
  document.getElementById("paypalFields").classList.toggle("hidden", val !== "paypal");
  document.getElementById("bankFields").classList.toggle("hidden", val !== "bank");

  // toggle required on card fields
  document.querySelectorAll("#cardFields input").forEach(i => i.required = (val === "card"));
  const pp = document.getElementById("paypalEmail");
  if (pp) pp.required = (val === "paypal");
}

/* ===== FORMAT HELPERS ===== */
function formatCard(input) {
  let v = input.value.replace(/\D/g, "").substring(0, 16);
  input.value = v.replace(/(.{4})/g, "$1 ").trim();
}
function formatExpiry(input) {
  let v = input.value.replace(/\D/g, "").substring(0, 4);
  if (v.length >= 3) v = v.substring(0, 2) + " / " + v.substring(2);
  input.value = v;
}

/* ===== PLACE ORDER ===== */
function placeOrder(e) {
  e.preventDefault();
  // generate order number
  const orderNum = "MM-" + Date.now().toString(36).toUpperCase();

  // collect order data
  const orderData = {
    orderNum: orderNum,
    total: getTotal(),
    items: cart.map(c => ({
      id: c.product.id,
      name: c.product.name,
      price: c.product.price,
      qty: c.qty,
      subtotal: c.product.price * c.qty
    })),
    shipping: {
      name: document.getElementById("shipName").value,
      email: document.getElementById("shipEmail").value,
      address: document.getElementById("shipAddress").value,
      city: document.getElementById("shipCity").value,
      zip: document.getElementById("shipZip").value,
      country: document.getElementById("shipCountry").value
    },
    paymentMethod: document.querySelector('input[name="payMethod"]:checked').value
  };

  // send to server
  fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData)
  })
  .then(res => res.json())
  .then(data => console.log("Order saved:", data))
  .catch(err => console.log("Server not available, order shown locally:", err));

  document.getElementById("confirmMessage").textContent =
    `Thank you! Your order of ${eur(getTotal())} has been placed successfully.`;
  document.getElementById("orderNumber").textContent = orderNum;

  showStep("stepConfirm");

  // clear cart
  cart = [];
  updateCartUI();

  // reset forms
  document.getElementById("shippingForm").reset();
  document.getElementById("paymentForm").reset();
}

/* ===== TOAST ===== */
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}

/* ===== CONTACT FORM ===== */
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  showToast("Message sent! We'll get back to you soon.");
  e.target.reset();
});

/* ===== MOBILE MENU ===== */
document.getElementById("menuToggle").addEventListener("click", () => {
  document.getElementById("navLinks").classList.toggle("open");
});

/* ===== INIT ===== */
renderProducts();
