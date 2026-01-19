// Test AddToCart functionality
// This file can be used to test the AddToCart button manually

// Test 1: Check if CartContext is available
console.log('Testing CartContext availability...');
console.log('CartContext should be available in the browser console');

// Test 2: Check localStorage
console.log('localStorage cart data:', localStorage.getItem('cart'));

// Test 3: Check if AddToCart button exists
document.addEventListener('DOMContentLoaded', function() {
    const addToCartButton = document.querySelector('button[onclick*="addItem"]');
    if (addToCartButton) {
        console.log('✅ AddToCart button found');
        console.log('Button text:', addToCartButton.textContent);
    } else {
        console.log('❌ AddToCart button not found');
    }
});

// Test 4: Check if CartDrawer is mounted
setTimeout(() => {
    const cartDrawer = document.querySelector('.fixed.inset-0.z-\[100\]');
    if (cartDrawer) {
        console.log('✅ CartDrawer component found');
    } else {
        console.log('❌ CartDrawer component not found (may be hidden)');
    }
}, 2000);

console.log('AddToCart test script loaded successfully');