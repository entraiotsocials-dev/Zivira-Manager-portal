import { ModulePlaceholder } from "@/components/module-placeholder";

export default function SamplesPage() {
  return (
    <ModulePlaceholder
      eyebrow="Sample Management"
      title="Sample allocations"
      description="MR-wise allocation, issue workflow, consumption recording, balance tracking, and audit reports."
      items={["Sample Catalog", "MR Allocation", "Issuance Workflow", "Consumption", "E-signature", "Audit Reports"]}
    />
  );
}
