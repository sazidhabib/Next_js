import getAllPosts from "@/lib/getAllPosts";
import React from "react";

export default async function Posts() {
  const posts = await getAllPosts();
  console.log(posts);

  return (
    <div className="mt-6">
      <h1>All Posts</h1>
      <div className="mt-4">
        {posts.map((post) => (
          <div key={post.id} className="border-b-2 border-gray-200 py-2">
            <h2 className="text-lg">{post.title}</h2>
            <p>{post.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
