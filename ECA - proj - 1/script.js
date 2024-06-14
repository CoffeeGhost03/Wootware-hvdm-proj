document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');

    darkModeToggle.addEventListener('click', () => {
        const currentMode = darkModeToggle.getAttribute('data-mode');
        const newMode = currentMode === 'light' ? 'dark' : 'light';

        document.body.classList.toggle('dark-mode');
        darkModeToggle.setAttribute('data-mode', newMode);
        localStorage.setItem('dark-mode', newMode);
    });

    const darkModePreference = localStorage.getItem('dark-mode');
    if (darkModePreference === 'dark') {
        document.body.classList.add('dark-mode');
        darkModeToggle.setAttribute('data-mode', 'dark');
    } else {
        document.body.classList.remove('dark-mode');
        darkModeToggle.setAttribute('data-mode', 'light');
    }

    const cartItemsContainer = document.getElementById('cart-items');
    if (cartItemsContainer) {
        renderCartItems();
    }
});

async function fetchProductPrice(productName) {
    const response = await fetch('get_product_price.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productName })
    });

    const data = await response.json();
    return data.price;
}

async function addToCart(productName) {
    const price = await fetchProductPrice(productName);

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({ productName, price });
    localStorage.setItem('cart', JSON.stringify(cart));

    alert(`${productName} has been added to your cart.`);
    renderCartItems();
}

function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    cartItemsContainer.innerHTML = '';
    let totalAmount = 0;

    cart.forEach((item, index) => {
        totalAmount += item.price;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <span>${item.productName} - $${item.price.toFixed(2)}</span>
            <button onclick="removeFromCart(${index})">Remove</button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    document.getElementById('total-amount').innerText = totalAmount.toFixed(2);

    const checkoutButton = document.getElementById('checkoutButton');
    if (cart.length > 0) {
        checkoutButton.disabled = false;
    } else {
        checkoutButton.disabled = true;
    }
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartItems();
}

function checkout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) return;

    const orderDetails = cart.map(item => item.productName).join(', ');
    const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);

    alert(`Your order is complete!\n\nOrder Details:\n${orderDetails}\n\nTotal Amount: $${totalAmount.toFixed(2)}`);

    fetch('save_order_details.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cart, totalAmount })
    });

    localStorage.removeItem('cart');
    renderCartItems();
    window.location.href = 'Wootware.html';
}
