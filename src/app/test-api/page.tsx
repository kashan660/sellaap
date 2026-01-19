// Test API endpoints
export default async function TestAPI() {
  try {
    const [categoriesRes, productsRes] = await Promise.all([
      fetch('http://localhost:3000/api/categories'),
      fetch('http://localhost:3000/api/products')
    ]);

    const categories = await categoriesRes.json();
    const products = await productsRes.json();

    return (
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">API Test Results</h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Categories API</h2>
          <div className="bg-gray-100 p-4 rounded">
            <p>Status: {categoriesRes.status}</p>
            <p>Data: {JSON.stringify(categories, null, 2)}</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Products API</h2>
          <div className="bg-gray-100 p-4 rounded">
            <p>Status: {productsRes.status}</p>
            <p>Count: {products.products?.length || 0}</p>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6 text-red-600">API Test Failed</h1>
        <p>Error: {error instanceof Error ? error.message : String(error)}</p>
      </div>
    );
  }
}