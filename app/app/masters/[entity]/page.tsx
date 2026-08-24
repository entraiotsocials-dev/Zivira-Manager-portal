import { ModulePlaceholder } from "@/components/module-placeholder";

export default async function MasterEntityPage({ params }: { params: Promise<{ entity: string }> }) {
  const { entity } = await params;

  return (
    <ModulePlaceholder
      eyebrow="Masters"
      title={`${entity} master`}
      description="Master data tables support full CRUD, import, export, validation, and audit history."
      items={["List View", "Create Record", "Bulk Import", "Export", "Validation Rules", "Audit History"]}
    />
  );
}
