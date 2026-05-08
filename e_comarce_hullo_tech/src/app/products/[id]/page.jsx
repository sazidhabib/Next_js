import { notFound, redirect } from "next/navigation";
import { products } from "../../../data/mockData";

export default async function OldProductPage({ params }) {
  const { id } = await params;
  const product = products.find((p) => p.id === parseInt(id));

  if (!product) notFound();

  // Redirect to new slug-based URL
  redirect(`/${product.category}/${product.slug}`);
}
