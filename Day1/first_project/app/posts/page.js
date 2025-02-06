import getAllPosts from "@/lib/getAllPosts";
import Link from "next/link";
import React from "react";

export default async function Posts() {
  const posts = await getAllPosts();

  return (
    <div className="mt-6">
      <h1>All Posts</h1>
      <div className="mt-4">
        {posts.map((post) => (
          <div key={post.id} className="border-b-2 border-gray-200 py-2">
            <Link href={`/posts/${post.id}`} className="text-lg">
              {post.title}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
