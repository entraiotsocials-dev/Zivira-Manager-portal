import { PageHeader } from "@/components/page-components";
import { ProductList } from "@/components/product-list";

export default function ProductsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Product Master"
        title="Product catalog"
        description="Tenant product catalog for divisions, categories, DCR detailing, campaigns, and reporting."
      />
      <ProductList />
    </>
  );
}
