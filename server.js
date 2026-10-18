// ==========================================
// 1. GLOBAL VARIABLES & DOM ELEMENTS
// ==========================================
const API_URL = 'http://localhost:3000/api/products';
let cart = [];

const cartBadge = document.querySelector('.cart-badge');
const cartNavBtn = document.querySelector('.cart-nav-btn');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCartBtn = document.getElementById('close-cart');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalPrice = document.getElementById('cart-total-price');
const clearCartBtn = document.getElementById('clear-cart-btn');
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
            const cardHTML = `
                <div class="compact-card">
                    <div class="compact-image-wrapper">
                        <img src="${dish.image || 'https://images.unsplash.com/photo-1580651315530-69c8e0026377?q=80&w=200&auto=format&fit=crop'}" alt="${dish.name}">
                    </div>
                    <div class="compact-content">
                        <h3>${dish.name}</h3>
                        <p>${dish.description || 'Authentic Korean street food.'}</p>
                        <div class="price-row">
                            <h4 class="compact-price">₱${Number(dish.price).toFixed(2)}</h4>
                            <button class="add-cart-btn">+</button>
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
        // If the DB fails, we can inject a friendly error message
        if(menuCarousel) menuCarousel.innerHTML = '<p style="padding: 20px;">Could not load menu. Is the server running?</p>';
    }
}

// ==========================================
// 3. HANDLE ADD TO CART CLICKS
// ==========================================
function attachCartListeners() {
    const addCartBtns = document.querySelectorAll('.add-cart-btn');
    
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
// 7. BOOT UP
// ==========================================
// Start fetching the dishes from MongoDB immediately when the script loads
loadDishes();