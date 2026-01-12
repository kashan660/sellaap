import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Blog - Sellaap",
  description: "Read our latest guides on Firestick setup, IPTV, and digital goods for UK, USA, and Europe.",
  keywords: "Firestick setup guide, IPTV tutorial, best Firestick apps, UK TV on Firestick, digital goods blog",
};

export default async function BlogPage() {
  const blogPosts = await prisma.post.findMany({
    orderBy: { date: 'desc' }
  });

  return (
    <div className="bg-background py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">Sellaap Blog</h1>
          <p className="mt-4 max-w-2xl text-xl text-muted-foreground mx-auto">
            Latest news, guides, and reviews for digital enthusiasts.
          </p>
        </div>

        <div className="mt-12 grid gap-16 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-12">
          {blogPosts.map((post) => (
            <div key={post.id} className="bg-card p-6 rounded-lg border border-border hover:shadow-lg transition-all flex flex-col h-full">
               {post.imageUrl && (
                <div className="relative w-full h-48 mb-4 rounded-md overflow-hidden">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <p className="text-sm text-primary font-bold uppercase tracking-wider">
                {post.category}
              </p>
              <Link href={`/blog/${post.slug}`} className="mt-2 block group flex-1">
                <p className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">{post.title}</p>
                <p className="mt-3 text-base text-muted-foreground line-clamp-3">{post.excerpt}</p>
              </Link>
              <div className="mt-6 flex items-center justify-between">
                 <div className="flex-shrink-0">
                    <span className="text-sm text-muted-foreground">
                      {new Date(post.date).toLocaleDateString('en-US', {
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
