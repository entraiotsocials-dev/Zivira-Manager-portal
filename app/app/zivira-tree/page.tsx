import { ziviraApplicationTree } from "@zivira/types";
import { PageHeader } from "@/components/page-components";
import { ZiviraTreeManager } from "@/components/zivira-tree-manager";

export default function ZiviraTreePage() {
  return (
    <>
      <PageHeader
        eyebrow="Exact SAN Tree"
        title="Zivira Labs application tree"
        description="The full legacy navigation structure is preserved here in modern form. Every row has Open, Add, and Delete actions."
      />
      <ZiviraTreeManager tree={ziviraApplicationTree} basePath="/app/workspace" />
    </>
  );
}
