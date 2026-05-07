import { blogPosts } from "@/data/mockData";
import Image from "next/image";

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-star-light-gray text-star-text pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold mb-8">Tech News</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <div key={post.id} className="product-card overflow-hidden">
            <div className="aspect-video bg-star-light-gray relative">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
            <div className="p-4">
              <span className="text-sm text-star-blue font-medium">{post.category}</span>
              <h3 className="text-lg font-semibold mt-2 mb-2">{post.title}</h3>
              <p className="text-gray-500 text-sm">{post.date}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
