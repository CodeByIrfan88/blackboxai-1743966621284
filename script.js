// Cart Management
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCart() {
    // Update cart count in UI
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }

    // Update cart total
    const cartTotal = document.getElementById('cart-total');
    if (cartTotal) {
        cartTotal.textContent = cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    }
}

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({...product, quantity: 1});
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
    showNotification(`${product.name} added to cart`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
    renderCartItems();
}

// Notification System
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50 animate-fade-in';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('animate-fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Form Validation
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('border-red-500');
            isValid = false;
        } else {
            input.classList.remove('border-red-500');
        }
    });

    return isValid;
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Initialize cart
    updateCart();

    // Add event listeners to all forms
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            if (!validateForm(form)) {
                e.preventDefault();
                showNotification('Please fill in all required fields');
            }
        });
    });

    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const product = {
                id: button.dataset.productId,
                name: button.dataset.productName,
                price: parseFloat(button.dataset.productPrice),
                image: button.dataset.productImage
            };
            addToCart(product);
        });
    });

    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
});

// Cart Page Specific Functions
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="flex items-center border-b py-4">
                <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded">
                <div class="ml-4 flex-1">
                    <h3 class="font-medium">${item.name}</h3>
                    <p class="text-gray-600">$${item.price.toFixed(2)}</p>
                </div>
                <div class="flex items-center">
                    <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
                    <span class="mx-2">${item.quantity}</span>
                    <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
                    <button class="ml-4 text-red-500" data-id="${item.id}" data-action="remove">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        // Add event listeners to quantity buttons
        document.querySelectorAll('.quantity-btn').forEach(button => {
            button.addEventListener('click', () => {
                const productId = button.dataset.id;
                const action = button.dataset.action;
                const item = cart.find(i => i.id === productId);
                
                if (action === 'increase') {
                    item.quantity += 1;
                } else if (action === 'decrease' && item.quantity > 1) {
                    item.quantity -= 1;
                } else if (action === 'remove') {
                    removeFromCart(productId);
                    return;
                }
                
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCart();
                renderCartItems();
            });
        });
    }
}

// Initialize cart page if we're on the cart page
if (window.location.pathname.includes('cart.html')) {
    renderCartItems();
}