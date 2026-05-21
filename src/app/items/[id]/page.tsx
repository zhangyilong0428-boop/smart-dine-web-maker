import { notFound } from "next/navigation";

import { getItem } from "@/lib/api/menu";
import { ItemDetail } from "@/components/menu/item-detail";

export const revalidate = 60;

interface Params {
  params: { id: string };
}

export default async function ItemPage({ params }: Params) {
  const item = await getItem(params.id);
  if (!item) notFound();
  return <ItemDetail item={item} />;
}

export async function generateMetadata({ params }: Params) {
  const item = await getItem(params.id);
  if (!item) return {};
  return {
    title: item.name,
    description: item.description ?? undefined,
    openGraph: {
      title: item.name,
      description: item.description ?? undefined,
      images: item.image_url ? [{ url: item.image_url }] : [],
    },
  };
}
