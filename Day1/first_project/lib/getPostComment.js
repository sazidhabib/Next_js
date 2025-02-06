export default async function getPostComment(id) {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}/comments`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }
  return res.json();
}
