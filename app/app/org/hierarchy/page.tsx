import { ModulePlaceholder } from "@/components/module-placeholder";

export default function HierarchyPage() {
  return (
    <ModulePlaceholder
      eyebrow="Organization"
      title="Hierarchy tree"
      description="Interactive reporting hierarchy from NBH through MR, including division and territory assignments."
      items={["Hierarchy Tree", "Division Management", "Territory Architecture", "Reporting Lines", "Designation Master", "Zone Setup"]}
    />
  );
}
