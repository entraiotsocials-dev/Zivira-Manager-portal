import { ModulePlaceholder } from "@/components/module-placeholder";

export default function AuditPage() {
  return (
    <ModulePlaceholder
      eyebrow="Compliance"
      title="Audit dashboard"
      description="Tenant action logs, compliance exceptions, HCP promotional caps, and regulatory export readiness."
      items={["User Actions", "Compliance Flags", "Gift Caps", "HCP Spend", "Exception Workflow", "Regulatory Export"]}
    />
  );
}
