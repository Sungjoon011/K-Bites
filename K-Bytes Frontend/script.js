// 1. Array to hold cart items (now tracking quantity)
let cart = [];

// 2. Grab HTML elements
const cartBadge = document.querySelector('.cart-badge');
const cartNavBtn = document.querySelector('.cart-nav-btn');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCartBtn = document.getElementById('close-cart');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalPrice = document.getElementById('cart-total-price');
const addCartBtns = document.querySelectorAll('.add-cart-btn');
const clearCartBtn = document.getElementById('clear-cart-btn');

// 3. Toggle Cart Sidebar
function toggleCart(e) {
    if(e) e.preventDefault();
    cartSidebar.classList.toggle('open');
    cartOverlay.classList.toggle('show');
}

if(cartNavBtn) cartNavBtn.addEventListener('click', toggleCart);
if(closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);
if(cartOverlay) cartOverlay.addEventListener('click', toggleCart);

// 4. Handle clicking the "+" button on the food cards
addCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const card = e.target.closest('.compact-card');
        const name = card.querySelector('h3').innerText;
        const priceText = card.querySelector('.compact-price').innerText;
        const price = parseFloat(priceText.replace('₱', '').replace(',', ''));

        // Check if the item is already in the cart
        const existingItem = cart.find(item => item.name === name);
        
        if (existingItem) {
            existingItem.quantity += 1; // Increase quantity if it exists
        } else {
            cart.push({ name: name, price: price, quantity: 1 }); // Add new item
        }

        updateCartUI();
        
        // Visual feedback
        btn.style.backgroundColor = '#4CAF50'; 
        btn.innerText = '✓';
        setTimeout(() => {
            btn.style.backgroundColor = '#030303';
            btn.innerText = '+';
        }, 800);
    });
});

// 5. Handle clicks INSIDE the cart (+ / - buttons)
cartItemsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('plus-btn')) {
        const index = e.target.getAttribute('data-index');
        cart[index].quantity += 1;
        updateCartUI();
    } 
    else if (e.target.classList.contains('minus-btn')) {
        const index = e.target.getAttribute('data-index');
        cart[index].quantity -= 1;
        
        // If quantity drops to 0, remove the item from the array entirely
        if (cart[index].quantity === 0) {
            cart.splice(index, 1);
        }
        updateCartUI();
    }
});

// 6. Handle Clear Cart button
if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
        cart = []; // Empty the array
        updateCartUI();
    });
}

// 7. Core function to render the cart HTML
function updateCartUI() {
    // Update badge with total number of items (sum of all quantities)
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if(cartBadge) cartBadge.innerText = totalItems;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is empty.</p>';
        cartTotalPrice.innerText = '₱0.00';
    } else {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            
            // Inject the name, quantity controls, and total item price
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

        cartTotalPrice.innerText = `₱${total.toFixed(2)}`;
    }
}