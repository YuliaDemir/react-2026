import { HEADERS_FOR_SVC } from "@/constants";
import type { Product } from "@/types";

type CsvValue = string | number | null | undefined;

const escapeCsvValue = (value: CsvValue) => {
  const stringValue = value === null || value === undefined ? "" : String(value);

  return `"${stringValue.replace(/"/g, '""')}"`;
};

const getProductDetailsUrl = (productId: Product["id"]) => {
  const url = new URL("/products", window.location.origin);

  url.searchParams.set("details", String(productId));

  return url.toString();
};

export const downloadProductsAsCsv = (products: Product[]) => {
  if (products.length === 0) {
    return;
  }

  const rows = products.map((product) => [
    product.id,
    product.title,
    product.description,
    product.category,
    product.price,
    product.stock,
    product.image,
    getProductDetailsUrl(product.id),
  ]);

  const csvContent = [HEADERS_FOR_SVC, ...rows]
    .map((row) => row.map(escapeCsvValue).join(","))
    .join("\n");

  const blob = new Blob(["\uFEFF", csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = `${products.length}_items.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};