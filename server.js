// ==========================================
// 1. GLOBAL VARIABLES & DOM ELEMENTS
// ==========================================
const API_URL = 'http://localhost:3000/api/products';
let cart = JSON.parse(localStorage.getItem('cart')) || [];

const cartBadge = document.querySelector('.cart-badge');
const cartNavBtn = document.querySelector('.cart-nav-btn');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCartBtn = document.getElementById('close-cart');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalPrice = document.getElementById('cart-total-price');
const clearCartBtn = document.getElementById('clear-cart-btn');
const checkoutBtn = document.getElementById('checkout-btn'); // Checkout button inside sidebar
const menuCarousel = document.getElementById('user-menu-carousel'); // Target container for dynamic dishes

// ==========================================
// 2. FETCH DATA FROM MONGODB & RENDER CARDS
// ==========================================
async function loadDishes() {
    try {
        const response = await fetch(API_URL);
        const dishes = await response.json();
        
        // Clear out the hardcoded HTML dummy cards
        if(menuCarousel) menuCarousel.innerHTML = '';
        
        // Loop through database items and build a card for each
        dishes.forEach(dish => {
            const isOutOfStock = dish.inStock === false;
            const buttonHTML = isOutOfStock 
                ? `<button class="add-cart-btn" disabled style="background-color: #ccc; cursor: not-allowed;">Out</button>`
                : `<button class="add-cart-btn">+</button>`;

            const cardHTML = `
                <div class="compact-card" style="${isOutOfStock ? 'opacity: 0.6;' : ''}">
                    <div class="compact-image-wrapper">
                        <img src="${dish.image || 'https://images.unsplash.com/photo-1580651315530-69c8e0026377?q=80&w=200&auto=format&fit=crop'}" alt="${dish.name}">
                    </div>
                    <div class="compact-content">
                        <h3>${dish.name}</h3>
                        <p>${dish.description || 'Authentic Korean street food.'}</p>
                        <div class="price-row">
                            <h4 class="compact-price">₱${Number(dish.price).toFixed(2)}</h4>
                            ${buttonHTML}
                        </div>
                    </div>
                </div>
            `;
            if(menuCarousel) menuCarousel.insertAdjacentHTML('beforeend', cardHTML);
        });

        // The new buttons exist now, so we attach the click listeners to them
        attachCartListeners(); 

    } catch (error) {
        console.error("Error fetching dishes from backend:", error);
        if(menuCarousel) menuCarousel.innerHTML = '<p style="padding: 20px;">Could not load menu. Is the server running?</p>';
    }
}

// ==========================================
// 3. HANDLE ADD TO CART CLICKS
// ==========================================
function attachCartListeners() {
    const addCartBtns = document.querySelectorAll('.add-cart-btn:not([disabled])');
    
    addCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.compact-card');
            const name = card.querySelector('h3').innerText;
            const priceText = card.querySelector('.compact-price').innerText;
            const price = parseFloat(priceText.replace('₱', '').replace(',', ''));

            // Check if item is already in cart
            const existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ name: name, price: price, quantity: 1 });
            }

            updateCartUI();
            
            // Button flash animation
            btn.style.backgroundColor = '#4CAF50'; 
            btn.innerText = '✓';
            setTimeout(() => {
                btn.style.backgroundColor = '#030303';
                btn.innerText = '+';
            }, 800);
        });
    });
}

// ==========================================
// 4. SIDEBAR TOGGLE LOGIC
// ==========================================
function toggleCart(e) {
    if(e) e.preventDefault();
    if(cartSidebar) cartSidebar.classList.toggle('open');
    if(cartOverlay) cartOverlay.classList.toggle('show');
}

if(cartNavBtn) cartNavBtn.addEventListener('click', toggleCart);
if(closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);
if(cartOverlay) cartOverlay.addEventListener('click', toggleCart);

// ==========================================
// 5. INSIDE CART ACTIONS (+, -, CLEAR)
// ==========================================
if(cartItemsContainer) {
    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('plus-btn')) {
            const index = e.target.getAttribute('data-index');
            cart[index].quantity += 1;
            updateCartUI();
        } 
        else if (e.target.classList.contains('minus-btn')) {
            const index = e.target.getAttribute('data-index');
            cart[index].quantity -= 1;
            if (cart[index].quantity === 0) cart.splice(index, 1);
            updateCartUI();
        }
    });
}

if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
        cart = []; 
        updateCartUI();
    });
}

// ==========================================
// 6. RENDER CART UI
// ==========================================
function updateCartUI() {
    // Save cart state across pages using localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if(cartBadge) cartBadge.innerText = totalItems;

    if (cart.length === 0) {
        if(cartItemsContainer) cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is empty.</p>';
        if(cartTotalPrice) cartTotalPrice.innerText = '₱0.00';
    } else {
        if(cartItemsContainer) cartItemsContainer.innerHTML = '';
        let total = 0;
        
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="cart-item-info">
                    <span class="cart-item-title">${item.name}</span>
                    <div class="qty-controls">
                        <button class="qty-btn minus-btn" data-index="${index}">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn plus-btn" data-index="${index}">+</button>
                    </div>
                </div>
                <span class="cart-item-price">₱${itemTotal.toFixed(2)}</span>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        if(cartTotalPrice) cartTotalPrice.innerText = `₱${total.toFixed(2)}`;
    }
}

// ==========================================
// 7. CHECKOUT REDIRECT LOGIC
// ==========================================
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        window.location.href = 'checkout.html'; // Redirects to the new dedicated checkout review page
    });
}

// ==========================================
// 8. BOOT UP & SUCCESS HANDLER
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Check if user returned successfully from PayMongo payment gateway
    if (urlParams.get('payment') === 'success') {
        alert('🎉 Payment successful! Thank you for your order.');
        
        const pendingOrderData = sessionStorage.getItem('pendingOrder');
        if (pendingOrderData) {
            try {
                const orderData = JSON.parse(pendingOrderData);
                
                // Save the verified paid order to MongoDB database
                await fetch('http://localhost:3000/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderData)
                });
                
                sessionStorage.removeItem('pendingOrder');
            } catch (err) {
                console.error('Error saving order post-payment:', err);
            }
        }

        cart = [];
        updateCartUI();
        localStorage.removeItem('cart');
        window.history.replaceState({}, document.title, window.location.pathname);
    } else if (urlParams.get('payment') === 'cancelled') {
        alert('⚠️ Payment was cancelled.');
        sessionStorage.removeItem('pendingOrder');
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});

// Start fetching the dishes from MongoDB immediately when the script loads
loadDishes();
updateCartUI();