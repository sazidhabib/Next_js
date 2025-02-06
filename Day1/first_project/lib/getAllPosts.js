export default async function getAllPosts() {
  const res = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_limit=10",
    {
      next: {
        revalidate: 10, // revalidate every 10 seconds so that the data is always up to date
      },
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }
  return res.json();
}
