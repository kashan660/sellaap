import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPosts } from "@/lib/actions/content";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Blog - Latest Insights & Updates",
    description: "Discover the latest insights, tutorials, and updates about our products and services.",
    keywords: "blog, insights, tutorials, updates, digital products, firestick, iptv",
    openGraph: {
      title: "Blog - Latest Insights & Updates",
      description: "Discover the latest insights, tutorials, and updates about our products and services.",
      type: "website"
    }
  };
}

export default async function BlogPage() {
  const posts = await getPosts({
    status: 'PUBLISHED',
    limit: 10,
    orderBy: 'date'
  });

  // Handle both array (legacy/current) and object (future pagination) returns
  const blogPosts = Array.isArray(posts) ? posts : (posts as any).data || [];

  return (
    <div className="bg-background py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">Our Blog</h1>
          <p className="mt-4 max-w-2xl text-xl text-muted-foreground mx-auto">
            Latest news, guides, and reviews for digital enthusiasts.
          </p>
        </div>

        <div className="mt-12 grid gap-16 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-12">
          {blogPosts.map((post: any) => (
            <article key={post.id} className="bg-card p-6 rounded-lg border border-border hover:shadow-lg transition-all flex flex-col h-full">
               {post.featuredImage && (
                <div className="relative w-full h-48 mb-4 rounded-md overflow-hidden">
                  <Image
                    src={post.featuredImage.url}
                    alt={post.featuredImage.alt || post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  {post.author && (
                    <span>By {post.author.name || post.author.email}</span>
                  )}
                  {post.publishedAt && (
                    <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                  )}
                  {post.views > 0 && (
                    <span>{post.views} views</span>
                  )}
                </div>
                
                {post.featured && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                    Featured
                  </span>
                )}
              </div>
              
              <Link href={`/blog/${post.slug}`} className="mt-2 block group flex-1">
                <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">{post.title}</h2>
                <p className="mt-3 text-base text-muted-foreground line-clamp-3">{post.excerpt}</p>
              </Link>
              
              <div className="mt-6 flex items-center justify-between">
                 <div className="flex-shrink-0">
                    <span className="text-sm text-muted-foreground">
                      {new Date(post.publishedAt!).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                 </div>
                 <Link href={`/blog/${post.slug}`} className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center">
                  Read full story
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
