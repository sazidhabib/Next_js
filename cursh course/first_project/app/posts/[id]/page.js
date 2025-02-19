import Comments from "@/app/components/Comments";
import getAllPosts from "@/lib/getAllPosts";
import getPost from "@/lib/getPost";
import getPostComment from "@/lib/getPostComment";
import React, { Suspense } from "react";

export async function generateMetadata({ params }) {
  const { id } = params;
  const post = await getPost(id);

  return {
    title: post.title,
    description: post.body,
  };
}

export default async function PostPage({ params }) {
  const { id } = params;
  // Fetch post and comments
  const postPromise = getPost(id);
  const commentsPromise = getPostComment(id);

  //waterfall pattern avoid here do it in parallel pattern
  //  const [post, comments] = await Promise.all([postPromise, commentsPromise]);
  //  console.log(post);

  //next js recommand to use this progessive pattern
  const post = await postPromise;

  return (
    <div className="mt-6">
      Post title:<h2 className="text-lg font-bold mb-3"> {post.title}</h2>
      Post description:
      <p> {post.body}</p>
      <hr />
      <Suspense fallback={<div>Loading comments...</div>}>
        <Comments promise={commentsPromise} />
      </Suspense>
    </div>
  );
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    id: post.id.toString(), // params object is always required
  }));
}
