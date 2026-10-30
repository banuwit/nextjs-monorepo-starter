import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailPage } from "@/features/product/components/product-detail-page";
import { products } from "@/mocks/product.mock";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function findProduct(id: string) {
  return products.find((product) => product.id === id);
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const product = findProduct((await params).id);
  return {
    title: `${product?.name ?? "Product"} | Dashboard`,
    description: product?.tagline ?? "View the details of a product.",
  };
}

export default async function Page({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { color } = await searchParams;
  const product = findProduct(id);
  if (!product) notFound();

  return (
    <ProductDetailPage
      key={id}
      product={product}
      initialColorId={typeof color === "string" ? color : undefined}
    />
  );
}
