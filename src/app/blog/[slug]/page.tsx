import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostBySlug, getPosts } from "@/lib/actions/content";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getPosts('PUBLISHED');
  return posts.map((post: any) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.metaTitle || `${post.title} - Sellaap Blog`,
    description: post.metaDescription || post.excerpt,
    keywords: post.metaKeywords,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: post.author ? [post.author.name || post.author.email] : [],
      images: post.featuredImage ? [post.featuredImage.url] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      images: post.featuredImage ? [post.featuredImage.url] : []
    }
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Format Date
  const formattedDate = new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: post.author ? {
      "@type": "Person",
      name: post.author.name || post.author.email
    } : {
      "@type": "Organization",
      name: "Sellaap"
    },
    description: post.excerpt,
    image: post.featuredImage?.url,
    keywords: post.tags?.map((t: any) => t.tag.name).join(', ')
  };

  return (
    <div className="bg-background min-h-screen py-16 sm:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link 
          href="/blog" 
          className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Link>
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <article>
          <header className="mb-10">
             <div className="flex items-center gap-2 mb-4 flex-wrap">
                {post.category && (
                  <span className="text-sm font-bold text-primary uppercase tracking-wide bg-primary/10 px-3 py-1 rounded-full">
                    {post.category.name}
                  </span>
                )}
                <span className="text-sm text-muted-foreground">{formattedDate}</span>
                {post.featured && (
                  <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                    Featured
                  </span>
                )}
             </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-6">
              {post.title}
            </h1>
            
            {post.excerpt && (
              <p className="text-xl text-muted-foreground leading-relaxed mb-6">
                {post.excerpt}
              </p>
            )}
            
            {post.featuredImage && (
              <div className="relative w-full h-[400px] mb-8 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src={post.featuredImage.url}
                  alt={post.featuredImage.alt || post.title}
                  fill
                  className="object-cover"
                  priority
                />
                {post.featuredImage.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-3">
                    <p className="text-sm">{post.featuredImage.caption}</p>
                  </div>
                )}
              </div>
            )}

            {/* Author Info */}
            {post.author && (
              <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                  {post.author.name ? post.author.name.charAt(0).toUpperCase() : post.author.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{post.author.name || post.author.email}</p>
                  <p className="text-sm text-gray-500">Author</p>
                </div>
              </div>
            )}
          </header>

          {/* Main Content */}
          <div 
            className="prose prose-lg dark:prose-invert prose-primary max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-lg font-semibold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((t: any) => (
                  <Link
                    key={t.tag.id}
                    href={`/blog?tag=${t.tag.slug}`}
                    className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {t.tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Additional Images */}
          {post.images && post.images.length > 0 && (
            <div className="mt-12">
              <h3 className="text-2xl font-bold mb-6">Gallery</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {post.images.map((image: any) => (
                  <div key={image.id} className="relative aspect-video rounded-lg overflow-hidden group">
                    <Image
                      src={image.url}
                      alt={image.alt || post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {image.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-3">
                        <p className="text-sm">{image.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t">
            <div className="flex justify-between items-center">
              <div>
                {post.previousPost && (
                  <Link
                    href={`/blog/${post.previousPost.slug}`}
                    className="flex items-center text-primary hover:text-primary/80 transition-colors"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    <div>
                      <p className="text-sm text-gray-500">Previous Post</p>
                      <p className="font-medium">{post.previousPost.title}</p>
                    </div>
                  </Link>
                )}
              </div>
              
              <div>
                {post.nextPost && (
                  <Link
                    href={`/blog/${post.nextPost.slug}`}
                    className="flex items-center text-primary hover:text-primary/80 transition-colors text-right"
                  >
                    <div>
                      <p className="text-sm text-gray-500">Next Post</p>
                      <p className="font-medium">{post.nextPost.title}</p>
                    </div>
                    <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
