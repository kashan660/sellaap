// Simple test to check if category pages exist
const testCategories = [
  { name: 'Blender 3D Models', slug: 'blender-3d-models' },
  { name: 'Digital Products', slug: 'digital-products' },
  { name: 'Software', slug: 'software' },
  { name: 'Templates', slug: 'templates' }
];

console.log('Testing category page URLs:');
testCategories.forEach(cat => {
  const url = `/Products/${cat.slug}`;
  console.log(`- ${cat.name}: ${url}`);
});

console.log('\nTo test these URLs:');
console.log('1. Open browser console (F12)');
console.log('2. Click Products dropdown');
console.log('3. Click any category');
console.log('4. Check console for navigation logs');

// Test direct navigation
console.log('\nDirect navigation test:');
console.log('window.location.href = "/Products/blender-3d-models"');