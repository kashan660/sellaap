import { Hero } from "@/components/Hero";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle, ShoppingCart } from "lucide-react";
import { getFeaturedProducts } from "@/lib/products";
import { Price } from "@/components/Price";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  // const featuredProducts = await getFeaturedProducts();
  // const latestPosts = await prisma.post.findMany({
  //   take: 3,
  //   orderBy: { date: 'desc' }
  // });

  // Mock data for static test
  const featuredProducts = [
    {
        id: 1,
        slug: "test-product",
        name: "Test Product",
        description: "This is a static test product",
        price: 9.99,
        currency: "USD",
        fallbackImage: "https://placehold.co/600x400",
        image: "https://placehold.co/600x400"
    }
  ];

  const latestPosts = [
    {
        id: 1,
        slug: "test-post",
        title: "Test Post",
        excerpt: "This is a static test post",
        date: new Date(),
        category: "Test"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      
      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Why Choose Sellaap?</h2>
            <p className="mt-4 text-lg text-muted-foreground">The best digital goods and setup services in the market.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[
                { title: "Premium Quality", description: "Top-tier digital goods verified for performance." },
                { title: "24/7 Support", description: "Round-the-clock assistance for all your setup needs." },
                { title: "Instant Delivery", description: "Get your products and instructions immediately after purchase." }
             ].map((feature, index) => (
                <div key={index} className="bg-card p-6 rounded-lg shadow-sm border border-border">
                   <CheckCircle className="h-10 w-10 text-primary mb-4" />
                   <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                   <p className="text-muted-foreground">{feature.description}</p>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-foreground">Featured Products</h2>
              <Link href="/products" className="text-primary hover:text-primary/80 flex items-center font-medium">
                 View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                 <div key={product.id} className="group relative bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                    <div className="aspect-video bg-muted relative">
                       <Image 
                          src={product.image || product.fallbackImage} 
                          alt={product.name}
                          fill
                          unoptimized={!!(product.image?.startsWith('http') || product.fallbackImage.startsWith('http'))}
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                       />
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                       <h3 className="text-lg font-bold mb-2">
                          <Link href={`/products/${product.slug}`}>
                              <span aria-hidden="true" className="absolute inset-0" />
                              {product.name}
                          </Link>
                       </h3>
                       <p className="text-muted-foreground text-sm mb-4 flex-grow">{product.description}</p>
                       <div className="flex justify-between items-center mt-auto relative z-10">
                          <span className="text-xl font-bold text-primary">
                            <Price amount={product.price} baseCurrency={product.currency} />
                          </span>
                          <button className="text-sm font-medium text-primary hover:underline flex items-center gap-1 cursor-pointer">
                            Add to Cart <ShoppingCart size={14} />
                          </button>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-foreground">Latest from Our Blog</h2>
              <Link href="/blog" className="text-primary hover:text-primary/80 flex items-center font-medium">
                 Read More <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestPosts.map((post) => (
                 <div key={post.id} className="bg-card rounded-lg border border-border p-6 hover:shadow-md transition-shadow">
                    <span className="text-xs font-medium text-muted-foreground">
                      {new Date(post.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    <h3 className="text-xl font-bold mt-2 mb-3 group-hover:text-primary transition-colors">
                       <Link href={`/blog/${post.slug}`} className="hover:underline">{post.title}</Link>
                    </h3>
                    <p className="text-muted-foreground line-clamp-3">
                       {post.excerpt}
                    </p>
                 </div>
              ))}
           </div>
        </div>
      </section>
    </div>
  );
}
