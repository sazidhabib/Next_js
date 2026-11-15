import { notFound, redirect } from "next/navigation";
import { Product } from "../../../../models";

export default async function OldProductPage({ params }) {
  const { id } = await params;
  let product = null;

  try {
    if (Product) {
      const dbProduct = await Product.findByPk(id);
      if (dbProduct) {
        product = dbProduct.toJSON();
      }
    }
  } catch (e) {}

  if (!product) notFound();

  // Redirect to new slug-based URL
  redirect(`/${product.category}/${product.slug}`);
}
