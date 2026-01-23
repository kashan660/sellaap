import { getPageBySlug } from "@/lib/actions/content";
import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function DatabasePage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  
  if (!page) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 to-primary/5 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {page.featuredImage && (
            <div className="relative h-64 w-full mb-8 rounded-lg overflow-hidden">
              <Image
                src={page.featuredImage.url}
                alt={page.featuredImage.alt || page.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {page.title}
          </h1>
          
          {page.excerpt && (
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {page.excerpt}
            </p>
          )}
          
          {/* Meta Information */}
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 mt-6">
            {page.author && (
              <span>By {page.author.name || page.author.email}</span>
            )}
            {page.publishedAt && (
              <span>Published {new Date(page.publishedAt).toLocaleDateString()}</span>
            )}
            {page.views > 0 && (
              <span>{page.views} views</span>
            )}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          <div 
            dangerouslySetInnerHTML={{ 
              __html: page.content 
            }} 
          />
        </div>
        
        {/* Additional Images Gallery */}
        {page.images && page.images.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Gallery</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {page.images.map((image: any) => (
                <div key={image.id} className="relative aspect-square rounded-lg overflow-hidden group">
                  <Image
                    src={image.url}
                    alt={image.alt || page.title}
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
        
        {/* Child Pages Navigation */}
        {page.children && page.children.length > 0 && (
          <div className="mt-12 border-t pt-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Pages</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {page.children.map((child: any) => (
                <a
                  key={child.id}
                  href={`/pages/${child.slug}`}
                  className="block p-6 border rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <h4 className="font-semibold text-gray-900 group-hover:text-primary mb-2">
                    {child.title}
                  </h4>
                  {child.excerpt && (
                    <p className="text-gray-600 text-sm">{child.excerpt}</p>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

// Generate static params for all published pages
export async function generateStaticParams() {
  const pages = await prisma.page.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true }
  });
  
  return pages.map((page: any) => ({
    slug: page.slug
  }));
}

// SEO Metadata
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  
  if (!page) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.'
    };
  }
  
  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription || page.excerpt || page.content.substring(0, 160),
    keywords: page.metaKeywords,
    openGraph: {
      title: page.metaTitle || page.title,
      description: page.metaDescription || page.excerpt || page.content.substring(0, 160),
      images: page.featuredImage ? [page.featuredImage.url] : [],
      type: 'article',
      publishedTime: page.publishedAt?.toISOString(),
      modifiedTime: page.updatedAt.toISOString(),
      authors: page.author ? [page.author.name || page.author.email] : []
    },
    twitter: {
      card: 'summary_large_image',
      title: page.metaTitle || page.title,
      description: page.metaDescription || page.excerpt || page.content.substring(0, 160),
      images: page.featuredImage ? [page.featuredImage.url] : []
    }
  };
}
