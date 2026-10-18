const API_URL = 'http://localhost:3000/api/products';
let cart = [];
let allDishes = [];

// ==========================================
// DOM ELEMENTS
// ==========================================
const foodGrid = document.getElementById('food-grid'); 
const categoryDisplayTitle = document.getElementById('category-display-title');
const cartBadge = document.querySelector('.cart-badge');
const cartNavBtn = document.querySelector('.cart-nav-btn');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCartBtn = document.getElementById('close-cart');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalPrice = document.getElementById('cart-total-price');
const clearCartBtn = document.getElementById('clear-cart-btn');
const checkoutBtn = document.getElementById('checkout-btn'); 
const inventoryTableBody = document.getElementById('inventory-table-body'); 

// ==========================================
// 1. MENU & CATEGORY LOGIC
// ==========================================
async function loadDishes() {
    if (!foodGrid) return;
    try {
        const response = await fetch(API_URL);
        allDishes = await response.json();
        applyMenuFilters();
    } catch (error) {
        console.error("Error fetching menu:", error);
    }
}

function renderDishes(dishesToDisplay) {
    if (!foodGrid) return;
    foodGrid.innerHTML = '';
    
    dishesToDisplay.forEach(dish => {
        const isOutOfStock = dish.inStock === false;
        
        const buttonHTML = isOutOfStock 
            ? `<button class="add-cart-btn" disabled style="background-color: #ccc; cursor: not-allowed;">Out</button>`
            : `<button class="add-cart-btn">+</button>`;

        const cardHTML = `
            <div class="compact-card" style="${isOutOfStock ? 'opacity: 0.6;' : ''}">
                <div class="compact-image-wrapper">
                    <img src="${dish.image}" alt="${dish.name}">
                </div>
                <div class="compact-content">
                    <h3>${dish.name}</h3>
                    <p>${dish.description}</p>
                    <div class="price-row">
                        <h4 class="compact-price">₱${Number(dish.price).toFixed(2)}</h4>
                        ${buttonHTML}
                    </div>
                </div>
            </div>
        `;
        foodGrid.insertAdjacentHTML('beforeend', cardHTML);
    });

    attachCartListeners(); 
}

let selectedCategory = 'All';

function applyMenuFilters() {
    const searchBar = document.querySelector('.search-bar');
    const searchText = searchBar ? searchBar.value.trim().toLowerCase() : '';

    const filteredDishes = allDishes.filter(dish => {
        const matchesCategory = selectedCategory === 'All' || dish.category === selectedCategory;
        const matchesSearch = dish.name.toLowerCase().includes(searchText) || (dish.description || '').toLowerCase().includes(searchText);
        return matchesCategory && matchesSearch;
    });

    if (categoryDisplayTitle) {
        const activeButton = document.querySelector('.sidebar-btn.active');
        categoryDisplayTitle.innerText = searchText
            ? 'Search Results'
            : activeButton
                ? activeButton.innerText.replace(/^[^\w\s]+/, '').trim()
                : 'All Dishes';
    }

    renderDishes(filteredDishes);
}

const sidebarBtns = document.querySelectorAll('.sidebar-btn');
sidebarBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        sidebarBtns.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        selectedCategory = e.currentTarget.getAttribute('data-category');
        applyMenuFilters();
    });
});

const searchBar = document.querySelector('.search-bar');
if (searchBar) {
    searchBar.addEventListener('input', applyMenuFilters);
}

// ==========================================
// 2. CART UI & TOGGLE LOGIC
// ==========================================
function toggleCart(e) {
    if(e) e.preventDefault();
    if(cartSidebar) cartSidebar.classList.toggle('open');
    if(cartOverlay) cartOverlay.classList.toggle('show');
}

if(cartNavBtn) cartNavBtn.addEventListener('click', toggleCart);
if(closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);
if(cartOverlay) cartOverlay.addEventListener('click', toggleCart);

function attachCartListeners() {
    const addCartBtns = document.querySelectorAll('.add-cart-btn');
    addCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.compact-card');
            const name = card.querySelector('h3').innerText;
            const priceText = card.querySelector('.compact-price').innerText;
            const price = parseFloat(priceText.replace('₱', '').replace(',', ''));

            const existingItem = cart.find(item => item.name === name);
            if (existingItem) existingItem.quantity += 1;
            else cart.push({ name: name, price: price, quantity: 1 });

            updateCartUI();
            
            btn.style.backgroundColor = '#4CAF50';
            btn.innerText = '✓';
            setTimeout(() => {
                btn.style.backgroundColor = '#e60000';
                btn.innerText = '+';
            }, 800);
        });
    });
}

function updateCartUI() {
    if(!cartBadge || !cartItemsContainer) return;
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.innerText = totalItems;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is empty.</p>';
        if(cartTotalPrice) cartTotalPrice.innerText = '₱0.00';
    } else {
        cartItemsContainer.innerHTML = '';
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

if(cartItemsContainer) {
    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('plus-btn')) {
            const index = e.target.getAttribute('data-index');
            cart[index].quantity += 1;
            updateCartUI();
        } else if (e.target.classList.contains('minus-btn')) {
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
// 4. AUTHENTICATION (LOGIN & SIGNUP)
// ==========================================
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userRole', data.role);
                localStorage.setItem('userName', data.name);

                if (data.role === 'admin') {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'menu-user.html';
                }
            } else {
                alert(`❌ Login failed: ${data.message}`);
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('❌ Server error during login.');
        }
    });
}

const signupForm = document.getElementById('signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;

        try {
            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                alert('✅ Account created successfully! Please log in.');
                window.location.href = 'login.html';
            } else {
                alert(`❌ Signup failed: ${data.message}`);
            }
        } catch (error) {
            console.error('Signup error:', error);
            alert('❌ Server error during registration.');
        }
    });
}

// ==========================================
// 5. ADMIN DASHBOARD: INVENTORY, USERS & TRANSACTIONS
// ==========================================
async function loadAdminInventory() {
    if (!inventoryTableBody) return; 
    try {
        const response = await fetch(API_URL);
        const dishes = await response.json();
        inventoryTableBody.innerHTML = ''; 

        dishes.forEach(dish => {
            const row = document.createElement('tr');
            const isChecked = dish.inStock !== false ? 'checked' : ''; 
            
            row.innerHTML = `
                <td><img src="${dish.image}" class="admin-item-img" style="width: 50px; height: 50px; object-fit: cover;" alt="${dish.name}"></td>
                <td>${dish.name}</td>
                <td>${dish.category}</td>
                <td>₱${Number(dish.price).toFixed(2)}</td>
                <td>
                    <label class="switch">
                        <input type="checkbox" class="stock-toggle" data-id="${dish._id}" ${isChecked}>
                        <span class="slider round"></span>
                    </label>
                </td>
                <td><button class="btn delete-btn" style="background-color: #dc3545; color: white; padding: 5px 10px; border-radius: 4px;" data-id="${dish._id}">Delete</button></td>
            `;
            inventoryTableBody.appendChild(row);
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                if (confirm("Delete this dish?")) {
                    await fetch(`${API_URL}/${e.target.getAttribute('data-id')}`, { method: 'DELETE' });
                    loadAdminInventory();
                }
            });
        });

        document.querySelectorAll('.stock-toggle').forEach(toggle => {
            toggle.addEventListener('change', async (e) => {
                await fetch(`${API_URL}/${e.target.getAttribute('data-id')}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ inStock: e.target.checked })
                });
            });
        });
    } catch (error) {
        console.error("Error loading admin inventory:", error);
    }
}

// ==========================================
// SHOW / HIDE PASSWORD TOGGLE LOGIC
// ==========================================
const toggleLoginPasswordBtn = document.getElementById('toggle-login-password');
const loginPasswordInput = document.getElementById('login-password');

if (toggleLoginPasswordBtn && loginPasswordInput) {
    toggleLoginPasswordBtn.addEventListener('click', () => {
        if (loginPasswordInput.type === 'password') {
            loginPasswordInput.type = 'text';
            toggleLoginPasswordBtn.innerText = 'Hide';
        } else {
            loginPasswordInput.type = 'password';
            toggleLoginPasswordBtn.innerText = 'Show';
        }
    });
}

const toggleSignupPasswordBtn = document.getElementById('toggle-signup-password');
const signupPasswordInput = document.getElementById('signup-password');

if (toggleSignupPasswordBtn && signupPasswordInput) {
    toggleSignupPasswordBtn.addEventListener('click', () => {
        if (signupPasswordInput.type === 'password') {
            signupPasswordInput.type = 'text';
            toggleSignupPasswordBtn.innerText = 'Hide';
        } else {
            signupPasswordInput.type = 'password';
            toggleSignupPasswordBtn.innerText = 'Show';
        }
    });
}

const links = document.querySelectorAll('.sidebar-link[data-target]');
const sections = document.querySelectorAll('.admin-content-section');

links.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        links.forEach(l => l.classList.remove('active'));
        sections.forEach(s => s.style.display = 'none');

        link.classList.add('active');
        const targetId = link.getAttribute('data-target');
        document.getElementById(targetId).style.display = 'block';
    });
});

// Add Dish Form Listener on Admin Page
const addDishForm = document.getElementById('add-dish-form');
if (addDishForm) {
    addDishForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newDish = {
            name: document.getElementById('dish-name').value,
            category: document.getElementById('dish-category').value,
            price: Number(document.getElementById('dish-price').value),
            image: document.getElementById('dish-image').value,
            description: document.getElementById('dish-desc').value,
            inStock: true
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newDish)
            });

            if (response.ok) {
                alert('✅ Dish added successfully!');
                addDishForm.reset();
                loadAdminInventory();
            } else {
                alert('❌ Failed to add dish.');
            }
        } catch (err) {
            console.error('Error adding dish:', err);
        }
    });
}

async function loadAdminUsers() {
    const tbody = document.getElementById('users-tbody');
    if (!tbody) return;

    try {
        const response = await fetch('http://localhost:3000/api/users');
        const users = await response.json();

        tbody.innerHTML = ''; 

        users.forEach(user => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>
                    <select class="role-select" data-id="${user._id}">
                        <option value="customer" ${user.role === 'customer' ? 'selected' : ''}>Customer</option>
                        <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                    </select>
                </td>
                <td>
                    <button class="btn-update-role" data-id="${user._id}" style="background-color: #2ed573; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Save Role</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        document.querySelectorAll('.btn-update-role').forEach(button => {
            button.addEventListener('click', async (e) => {
                const userId = e.target.getAttribute('data-id');
                const selectElement = document.querySelector(`.role-select[data-id="${userId}"]`);
                const newRole = selectElement.value;

                try {
                    const updateRes = await fetch(`http://localhost:3000/api/users/${userId}/role`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ role: newRole })
                    });

                    const result = await updateRes.json();
                    if (updateRes.ok) {
                        alert(`✅ Role updated to ${newRole.toUpperCase()} for ${result.updatedUser.name}`);
                    } else {
                        alert(`❌ Error: ${result.message}`);
                    }
                } catch (err) {
                    console.error('Failed to update role:', err);
                    alert('❌ Server error while updating role.');
                }
            });
        });
    } catch (error) {
        console.error('Failed to load users:', error);
    }
}

async function loadAdminTransactions() {
    const tbody = document.getElementById('transactions-table-body');
    if (!tbody) return;

    try {
        const response = await fetch('http://localhost:3000/api/orders');
        const orders = await response.json();

        tbody.innerHTML = '';

        if (orders.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #777;">No recent transactions recorded yet.</td></tr>`;
            return;
        }

        orders.forEach(order => {
            const tr = document.createElement('tr');
            const itemsList = order.items.map(item => `${item.name} (x${item.quantity})`).join(', ');
            
            tr.innerHTML = `
                <td>#${order._id.slice(-6).toUpperCase()}</td>
                <td>${order.customerName || 'Customer'}</td>
                <td>${itemsList}</td>
                <td>₱${Number(order.totalAmount).toFixed(2)}</td>
                <td><span style="color: #2ed573; font-weight: bold;">Completed</span></td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Failed to load transactions:', error);
    }
}

// Global Logout Handler
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.clear();
        window.location.href = 'home.html';
    });
}

// ==========================================
// CHECKOUT LOGIC WITH PAYMONGO
// ==========================================
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', async () => {
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        const customerName = localStorage.getItem('userName') || 'Customer';
        const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        try {
            checkoutBtn.innerText = 'Processing...';
            checkoutBtn.disabled = true;

            const response = await fetch('http://localhost:3000/api/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: cart, customerName })
            });

            const data = await response.json();

            if (response.ok && data.checkoutUrl) {
                // Save pending order temporarily in sessionStorage before redirecting
                sessionStorage.setItem('pendingOrder', JSON.stringify({
                    customerName,
                    items: cart,
                    totalAmount
                }));

                window.location.href = data.checkoutUrl; 
            } else {
                alert(`❌ Checkout failed: ${data.message || 'Unknown error'}`);
                checkoutBtn.innerText = 'Proceed to Checkout';
                checkoutBtn.disabled = false;
            }
        } catch (error) {
            console.error("Checkout network error:", error);
            alert("❌ Server error connecting to payment gateway.");
            checkoutBtn.innerText = 'Proceed to Checkout';
            checkoutBtn.disabled = false;
        }
    });
}

// ==========================================
// BOOT UP ENGINE & SUCCESS HANDLER
// ==========================================

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.get('payment') === 'success') {
        alert('🎉 Payment successful! Thank you for your order.');
        
        const pendingOrderData = sessionStorage.getItem('pendingOrder');
        if (pendingOrderData) {
            try {
                const orderData = JSON.parse(pendingOrderData);
                
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
        window.history.replaceState({}, document.title, window.location.pathname);
    } else if (urlParams.get('payment') === 'cancelled') {
        alert('⚠️ Payment was cancelled.');
        sessionStorage.removeItem('pendingOrder');
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});

loadDishes();
loadAdminInventory();
updateCartUI();

if (window.location.pathname.includes('admin.html')) {
    loadAdminUsers();
    loadAdminTransactions();
}