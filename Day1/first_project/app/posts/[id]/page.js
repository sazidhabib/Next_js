import getPost from "@/lib/getPost";
import React from "react";

export default async function PostPage({ params }) {
  const { id } = params;
  const post = await getPost(id);

  console.log(post);
  return (
    <div className="mt-6">
      Post title:<h2 className="text-lg font-bold mb-3"> {post.title}</h2>
      Post description:
      <p> {post.body}</p>
    </div>
  );
}
