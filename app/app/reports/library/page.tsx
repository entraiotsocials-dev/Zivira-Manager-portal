import { ModulePlaceholder } from "@/components/module-placeholder";

export default function ReportsPage() {
  return (
    <ModulePlaceholder
      eyebrow="Reporting Engine"
      title="Report library"
      description="Standard reports, custom report builder, analytics studio, export queue, scheduler, and sharing."
      items={["DCR Reports", "Doctor Reports", "TP Reports", "Attendance Reports", "Export Queue", "Report Scheduler"]}
    />
  );
}
