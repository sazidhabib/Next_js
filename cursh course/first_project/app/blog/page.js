import Link from "next/link";
import React from "react";

const Blogs = () => {
  const blogs = [
    {
      id: 1,
      title: "My first blog 1",
      content: "This is my first blog post. I hope you like it!",
    },
    {
      id: 2,
      title: "My second blog 2",
      content: "This is my second blog post. I hope you like it!",
    },
  ];
  return (
    <main className="flex flex-col gap-8 row-start-2  sm:items-start mt-10">
      <h1 className="text-4xl sm:text-left">Blog page content </h1>
      <ul>
        {blogs.map((blog, index) => (
          <li className="mt-4" key={blog.id}>
            <Link href={`/blog/${blog.id}`}>{blog.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default Blogs;
