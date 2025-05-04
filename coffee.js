const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
        
        // Update active link
        document.querySelectorAll('.nav-links a').forEach(item => {
            item.classList.remove('active');
        });
        link.classList.add('active');
    });
});

// Sticky header on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    header.classList.toggle('sticky', window.scrollY > 0);
});

// Shopping Cart Functionality
const cartIcon = document.getElementById('cart-icon');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.getElementById('close-cart');
const overlay = document.getElementById('overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalContainer = document.getElementById('cart-total');
const cartCount = document.querySelector('.cart-count');
const cartTotalAmount = document.getElementById('cart-total-amount');
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const checkoutBtn = document.querySelector('.checkout-btn');

let cart = [];

// Open cart modal
cartIcon.addEventListener('click', () => {
    cartModal.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
});

// Close cart modal
closeCart.addEventListener('click', () => {
    cartModal.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
});

overlay.addEventListener('click', () => {
    cartModal.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
});

// Add to cart functionality
addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        const parent = button.closest('.menu-item');
        const quantityInput = parent.querySelector('.quantity-input');
        const quantity = parseInt(quantityInput.value);
        const id = button.getAttribute('data-id');
        const name = button.getAttribute('data-name');
        const price = parseFloat(button.getAttribute('data-price'));
        const image = button.getAttribute('data-image');

        // Check if item already exists in cart
        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id,
                name,
                price,
                image,
                quantity
            });
        }

        updateCart();
        showAddedToCartAnimation(button);
    });
});

// Quantity buttons
document.querySelectorAll('.quantity-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const parent = e.target.closest('.item-quantity');
        const input = parent.querySelector('.quantity-input');
        let value = parseInt(input.value);

        if (e.target.classList.contains('plus')) {
            value++;
        } else if (e.target.classList.contains('minus')) {
            value = Math.max(1, value - 1);
        }

        input.value = value;
    });
});

// Update cart UI
function updateCart() {
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty</p>
                <i class="fas fa-coffee" style="font-size: 40px; margin-top: 10px;"></i>
            </div>
        `;
        cartTotalContainer.style.display = 'none';
        cartCount.textContent = '0';
        return;
    }

    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.name}</h4>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                <div class="cart-item-quantity">
                    <button class="cart-quantity-btn minus" data-id="${item.id}">-</button>
                    <input type="text" class="cart-quantity-input" value="${item.quantity}" readonly>
                    <button class="cart-quantity-btn plus" data-id="${item.id}">+</button>
                </div>
                <button class="cart-item-remove" data-id="${item.id}">Remove</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItemElement);
    });

    // Add event listeners to new cart buttons
    document.querySelectorAll('.cart-quantity-btn.minus').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            updateCartItemQuantity(id, -1);
        });
    });

    document.querySelectorAll('.cart-quantity-btn.plus').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            updateCartItemQuantity(id, 1);
        });
    });

    document.querySelectorAll('.cart-item-remove').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            removeCartItem(id);
        });
    });

    cartTotalAmount.textContent = `$${total.toFixed(2)}`;
    cartTotalContainer.style.display = 'block';
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Update cart item quantity
function updateCartItemQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(item => item.id !== id);
        }
        updateCart();
    }
}

// Remove item from cart
function removeCartItem(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

// Checkout button
checkoutBtn.addEventListener('click', () => {
    if (cart.length > 0) {
        alert('Thank you for your order!');
        cart = [];
        updateCart();
        cartModal.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Contact form submission
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    contactForm.reset();
});

// Newsletter form submission
const newsletterForm = document.querySelector('.newsletter-form');
newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = newsletterForm.querySelector('input[type="email"]');
    alert(`Thank you for subscribing with ${emailInput.value}!`);
    emailInput.value = '';
});

// Added to cart animation
function showAddedToCartAnimation(button) {
    const originalText = button.textContent;
    button.textContent = 'Added!';
    button.style.backgroundColor = '#4CAF50';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '';
    }, 1500);
}

// Scroll animations
const animateElements = document.querySelectorAll('.about-text p, .about-text .btn, .contact-info p, .contact-details div, .form-group');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

animateElements.forEach(element => {
    observer.observe(element);
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Set active nav link based on scroll position
const sections = document.querySelectorAll('section');
window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });
    
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});