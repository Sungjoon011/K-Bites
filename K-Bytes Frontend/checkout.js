let cart = JSON.parse(localStorage.getItem('cart')) || [];
let calculatedDeliveryFee = 0;
let finalDistance = 0;

const itemsContainer = document.getElementById('checkout-items-container');
const subtotalEl = document.getElementById('subtotal-price');
const deliveryFeeEl = document.getElementById('delivery-fee-display');
const finalTotalEl = document.getElementById('final-total-price');
const getLocationBtn = document.getElementById('get-location-btn');
const deliveryInfoEl = document.getElementById('delivery-info');
const proceedPaymongoBtn = document.getElementById('proceed-paymongo-btn');
const customerNameInput = document.getElementById('customer-name');

// Auto-fill customer name if logged in
const savedName = localStorage.getItem('userName');
if (savedName && customerNameInput) customerNameInput.value = savedName;

function renderCheckoutCart() {
    if (cart.length === 0) {
        itemsContainer.innerHTML = '<p style="color: #666; font-size: 14px;">Your cart is empty. <a href="menu-user.html" style="color: #000;">Return to menu</a></p>';
        subtotalEl.innerText = '₱0.00';
        finalTotalEl.innerText = '₱0.00';
        return;
    }

    itemsContainer.innerHTML = '';
    let subtotal = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        // Fallback image if item doesn't have one stored
        const imgUrl = item.image || 'https://images.unsplash.com/photo-1580651315530-69c8e0026377?q=80&w=200&auto=format&fit=crop';

        const row = document.createElement('div');
        row.className = 'cart-item-row';
        row.innerHTML = `
            <img src="${imgUrl}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
                <div class="title-price-row">
                    <span class="cart-item-title">${item.name}</span>
                    <span class="cart-item-price">₱${itemTotal.toFixed(2)}</span>
                </div>
                <div class="qty-control-wrapper">
                    <div class="qty-box">
                        <button onclick="changeQty(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="changeQty(${index}, 1)">+</button>
                    </div>
                    <button class="trash-btn" onclick="removeItem(${index})" title="Remove Item">🗑️</button>
                </div>
            </div>
        `;
        itemsContainer.appendChild(row);
    });

    subtotalEl.innerText = `₱${subtotal.toFixed(2)}`;
    updateGrandTotal(subtotal);
}

window.changeQty = function(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCheckoutCart();
};

window.removeItem = function(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCheckoutCart();
};

// Calculate Delivery Fee Logic
getLocationBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
        return;
    }

    getLocationBtn.innerText = 'Detecting...';
    
    navigator.geolocation.getCurrentPosition(async (position) => {
        const customerLat = position.coords.latitude;
        const customerLng = position.coords.longitude;

        try {
            const response = await fetch('http://localhost:3000/api/calculate-delivery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ customerLat, customerLng })
            });

            const data = await response.json();
            if (response.ok) {
                finalDistance = data.distanceKm;
                calculatedDeliveryFee = data.deliveryFee;

                getLocationBtn.innerText = '📍 Location Detected';
                getLocationBtn.style.borderColor = '#28a745';
                getLocationBtn.style.color = '#28a745';
                
                deliveryInfoEl.innerHTML = `Distance: <b>${finalDistance} km</b> from store.`;
                deliveryFeeEl.innerText = `₱${calculatedDeliveryFee.toFixed(2)}`;
                
                const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                updateGrandTotal(subtotal);

                proceedPaymongoBtn.disabled = false;
            } else {
                alert('❌ Failed to calculate delivery fee.');
                getLocationBtn.innerText = '📍 Detect My Location';
            }
        } catch (err) {
            console.error(err);
            alert('❌ Server error calculating delivery.');
            getLocationBtn.innerText = '📍 Detect My Location';
        }
    }, () => {
        alert('❌ Unable to retrieve your location. Please allow location permissions.');
        getLocationBtn.innerText = '📍 Detect My Location';
    });
});

function updateGrandTotal(subtotal) {
    const grandTotal = subtotal + calculatedDeliveryFee;
    finalTotalEl.innerText = `₱${grandTotal.toFixed(2)}`;
}

// PayMongo Redirect Logic
proceedPaymongoBtn.addEventListener('click', async () => {
    const customerName = customerNameInput.value.trim() || 'Customer';
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalAmount = subtotal + calculatedDeliveryFee;

    try {
        proceedPaymongoBtn.innerText = 'Redirecting...';
        proceedPaymongoBtn.disabled = true;

        const response = await fetch('http://localhost:3000/api/create-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                items: cart, 
                customerName, 
                deliveryFee: calculatedDeliveryFee 
            })
        });

        const data = await response.json();

        if (response.ok && data.checkoutUrl) {
            sessionStorage.setItem('pendingOrder', JSON.stringify({
                customerName,
                items: cart,
                totalAmount,
                deliveryFee: calculatedDeliveryFee
            }));

            window.location.href = data.checkoutUrl;
        } else {
            alert(`❌ Checkout failed: ${data.message || 'Unknown error'}`);
            proceedPaymongoBtn.innerText = 'Continue to Payment';
            proceedPaymongoBtn.disabled = false;
        }
    } catch (error) {
        console.error("Checkout error:", error);
        alert("❌ Server error connecting to payment gateway.");
        proceedPaymongoBtn.innerText = 'Continue to Payment';
        proceedPaymongoBtn.disabled = false;
    }
});

renderCheckoutCart();