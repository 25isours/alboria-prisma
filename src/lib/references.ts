import data from "@/data/references.json";
import type { Reference } from "./types";

export const references: Reference[] = data;

export const categories: string[] = Array.from(
  new Set(references.map((r) => r.category)),
);
