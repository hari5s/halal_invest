import { notFound } from "next/navigation";
import { AssetDetailClient } from "@/components/asset/AssetDetailClient";
import { assets, getAssetBySlug } from "@/data/assets";

export function generateStaticParams() {
  return assets.map(function (asset) {
    return { slug: asset.slug };
  });
}

export default async function AssetPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolved = await params;
  const asset = getAssetBySlug(resolved.slug);

  if (!asset) {
    notFound();
  }

  return <AssetDetailClient asset={asset} />;
}
