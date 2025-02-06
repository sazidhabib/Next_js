export default async function getAllPosts() {
  const res = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_limit=10"
  );
  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }
  return res.json();
}
