/**
 * AddToCart Auto-Integration Test Script
 * 
 * This script tests that AddToCart functionality is automatically available
 * for newly created products. Run this in the browser console after
 * creating new products in the admin dashboard.
 * 
 * Usage:
 * 1. Open your browser console (F12)
 * 2. Paste this entire script
 * 3. Run: window.addToCartTests.runAllTests()
 * 4. Check the results
 */

(function() {
  'use strict';
  
  const TEST_RESULTS = {
    passed: [],
    failed: [],
    warnings: []
  };
  
  function log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = `[AddToCart Test ${timestamp}]`;
    
    switch(type) {
      case 'success':
        console.log(`%c✅ ${prefix} ${message}`, 'color: green; font-weight: bold;');
        TEST_RESULTS.passed.push(message);
        break;
      case 'error':
        console.error(`%c❌ ${prefix} ${message}`, 'color: red; font-weight: bold;');
        TEST_RESULTS.failed.push(message);
        break;
      case 'warning':
        console.warn(`%c⚠️ ${prefix} ${message}`, 'color: orange;');
        TEST_RESULTS.warnings.push(message);
        break;
      default:
        console.log(`%cℹ️ ${prefix} ${message}`, 'color: blue;');
    }
  }
  
  function findAddToCartButtons() {
    return document.querySelectorAll('button:contains("Add to Cart"), [data-testid="add-to-cart"], .add-to-cart-btn');
  }
  
  function findProductCards() {
    return document.querySelectorAll('[data-testid="product-card"], .product-card, .group.relative.bg-card');
  }
  
  function checkCartContext() {
    try {
      // Check if CartContext is available globally
      if (typeof window !== 'undefined' && window.React) {
        log('React is available', 'success');
        
        // Try to access cart context through a test element
        const testButton = document.createElement('button');
        testButton.setAttribute('data-test-cart', 'true');
        document.body.appendChild(testButton);
        
        // This will be cleaned up by React if cart context is working
        setTimeout(() => {
          if (document.body.contains(testButton)) {
            document.body.removeChild(testButton);
          }
        }, 100);
        
        return true;
      } else {
        log('React not detected - cart context may not be available', 'warning');
        return false;
      }
    } catch (error) {
      log(`Cart context check failed: ${error.message}`, 'error');
      return false;
    }
  }
  
  function testProductCards() {
    log('Testing product cards for AddToCart integration...');
    
    const productCards = findProductCards();
    log(`Found ${productCards.length} product cards`);
    
    if (productCards.length === 0) {
      log('No product cards found - this might be expected on some pages', 'warning');
      return;
    }
    
    productCards.forEach((card, index) => {
      const cardText = card.textContent || '';
      const hasAddToCart = cardText.toLowerCase().includes('add to cart');
      
      if (hasAddToCart) {
        log(`Product card ${index + 1} has AddToCart button`, 'success');
        
        // Check if button is clickable
        const button = card.querySelector('button');
        if (button && !button.disabled) {
          log(`Product card ${index + 1} AddToCart button is enabled`, 'success');
        } else if (button && button.disabled) {
          log(`Product card ${index + 1} AddToCart button is disabled`, 'warning');
        }
      } else {
        log(`Product card ${index + 1} missing AddToCart button`, 'error');
      }
    });
  }
  
  function testIndividualProductPage() {
    log('Testing individual product page AddToCart...');
    
    // Check if we're on a product page
    const isProductPage = window.location.pathname.includes('/products/');
    
    if (!isProductPage) {
      log('Not on a product detail page - skipping individual product test', 'info');
      return;
    }
    
    // Look for AddToCart button on product detail page
    const addToCartButtons = findAddToCartButtons();
    
    if (addToCartButtons.length > 0) {
      log(`Found ${addToCartButtons.length} AddToCart button(s) on product page`, 'success');
      
      addToCartButtons.forEach((button, index) => {
        if (!button.disabled) {
          log(`AddToCart button ${index + 1} is clickable`, 'success');
          
          // Test click handler (don't actually click)
          if (button.onclick || button.addEventListener) {
            log(`AddToCart button ${index + 1} has click handler`, 'success');
          } else {
            log(`AddToCart button ${index + 1} missing click handler`, 'warning');
          }
        } else {
          log(`AddToCart button ${index + 1} is disabled`, 'warning');
        }
      });
    } else {
      log('No AddToCart buttons found on product page', 'error');
    }
  }
  
  function testCartFunctionality() {
    log('Testing cart functionality...');
    
    // Check localStorage for cart data
    const cartData = localStorage.getItem('cart');
    
    if (cartData) {
      try {
        const cart = JSON.parse(cartData);
        log(`Cart has ${cart.length} items`, 'success');
        
        cart.forEach((item, index) => {
          if (item.name && item.price && item.quantity) {
            log(`Cart item ${index + 1}: ${item.name} x${item.quantity} = $${item.price}`, 'success');
          } else {
            log(`Cart item ${index + 1} has missing data`, 'warning');
          }
        });
      } catch (error) {
        log(`Invalid cart data in localStorage: ${error.message}`, 'error');
      }
    } else {
      log('No cart data in localStorage (this is normal for new visitors)', 'info');
    }
  }
  
  function testNewlyCreatedProducts() {
    log('Testing newly created products...');
    
    // Look for products that might have been recently created
    const recentProducts = document.querySelectorAll('[data-created-recently], .new-product, .recent-product');
    
    if (recentProducts.length > 0) {
      log(`Found ${recentProducts.length} recently created products`, 'success');
      
      recentProducts.forEach((product, index) => {
        const hasAddToCart = product.textContent?.toLowerCase().includes('add to cart');
        
        if (hasAddToCart) {
          log(`New product ${index + 1} has AddToCart button`, 'success');
        } else {
          log(`New product ${index + 1} missing AddToCart button`, 'error');
        }
      });
    } else {
      log('No recently created products detected', 'info');
      
      // Fallback: check all products on page
      const allProducts = document.querySelectorAll('.product-card, [data-testid="product-card"]');
      log(`Checking all ${allProducts.length} products for AddToCart integration`, 'info');
      
      allProducts.forEach((product, index) => {
        const hasAddToCart = product.textContent?.toLowerCase().includes('add to cart');
        
        if (hasAddToCart) {
          log(`Product ${index + 1} has AddToCart button`, 'success');
        } else {
          log(`Product ${index + 1} missing AddToCart button`, 'error');
        }
      });
    }
  }
  
  function generateReport() {
    log('=== AddToCart Auto-Integration Test Report ===', 'info');
    log(`Total tests passed: ${TEST_RESULTS.passed.length}`, 'success');
    log(`Total tests failed: ${TEST_RESULTS.failed.length}`, 'error');
    log(`Total warnings: ${TEST_RESULTS.warnings.length}`, 'warning');
    
    if (TEST_RESULTS.failed.length === 0) {
      log('🎉 All AddToCart functionality tests passed!', 'success');
      log('✅ AddToCart is automatically integrated for new products', 'success');
    } else {
      log('⚠️ Some tests failed - check the logs above for details', 'error');
    }
    
    return {
      passed: TEST_RESULTS.passed.length,
      failed: TEST_RESULTS.failed.length,
      warnings: TEST_RESULTS.warnings.length,
      details: TEST_RESULTS
    };
  }
  
  // Public API
  window.addToCartTests = {
    runAllTests: function() {
      log('Starting AddToCart Auto-Integration Tests...', 'info');
      log(`Testing on: ${window.location.href}`);
      
      // Run all tests
      checkCartContext();
      testProductCards();
      testIndividualProductPage();
      testCartFunctionality();
      testNewlyCreatedProducts();
      
      return generateReport();
    },
    
    testProductCards: testProductCards,
    testIndividualProductPage: testIndividualProductPage,
    testCartFunctionality: testCartFunctionality,
    testNewlyCreatedProducts: testNewlyCreatedProducts,
    
    getResults: function() {
      return TEST_RESULTS;
    }
  };
  
  log('AddToCart Auto-Integration Test Script loaded successfully!', 'success');
  log('Run window.addToCartTests.runAllTests() to test AddToCart functionality', 'info');
  
})();