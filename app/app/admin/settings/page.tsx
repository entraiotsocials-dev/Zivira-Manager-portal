import { ModulePlaceholder } from "@/components/module-placeholder";

export default function AdminSettingsPage() {
  return (
    <ModulePlaceholder
      eyebrow="Admin Control"
      title="Company configuration"
      description="Tenant workflow configuration, approval chains, feature toggles, audit controls, and security settings."
      items={["Workflow Configurator", "Approval Chains", "Feature Toggles", "Security Settings", "Company Settings", "Audit Dashboard"]}
    />
  );
}
