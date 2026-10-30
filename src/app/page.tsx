import { Gallery } from "@/components/Gallery";
import { categories, references } from "@/lib/references";

export default function Home() {
  return <Gallery items={references} categories={categories} />;
}
