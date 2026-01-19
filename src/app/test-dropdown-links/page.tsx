// Test script to verify dropdown links work
import Link from 'next/link';

export default function TestDropdownLinks() {
  const testCategories = [
    { id: 1, name: 'Blender 3D Models', slug: 'blender-3d-models' },
    { id: 2, name: 'Digital Products', slug: 'digital-products' },
    { id: 3, name: 'Software', slug: 'software' },
    { id: 4, name: 'Templates', slug: 'templates' }
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Dropdown Links</h1>
      <div className="space-y-2">
        {testCategories.map((category) => (
          <div key={category.id}>
            <Link 
              href={`/Products/${category.slug}`}
              className="text-blue-600 hover:text-blue-800 underline"
              onClick={() => console.log('Clicked:', category.name, 'URL:', `/Products/${category.slug}`)}
            >
              {category.name} - /Products/{category.slug}
            </Link>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h2 className="font-semibold mb-2">Direct Links to Test:</h2>
        <ul className="space-y-1">
          <li><a href="/Products/blender-3d-models" target="_blank" className="text-blue-600 hover:text-blue-800">/Products/blender-3d-models</a></li>
          <li><a href="/Products/digital-products" target="_blank" className="text-blue-600 hover:text-blue-800">/Products/digital-products</a></li>
          <li><a href="/Products/software" target="_blank" className="text-blue-600 hover:text-blue-800">/Products/software</a></li>
          <li><a href="/Products/templates" target="_blank" className="text-blue-600 hover:text-blue-800">/Products/templates</a></li>
        </ul>
      </div>
    </div>
  );
}