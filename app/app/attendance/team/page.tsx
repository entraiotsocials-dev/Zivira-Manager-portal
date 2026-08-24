import { ModulePlaceholder } from "@/components/module-placeholder";

export default function AttendancePage() {
  return (
    <ModulePlaceholder
      eyebrow="Attendance"
      title="Team attendance"
      description="Attendance dashboard, leave approvals, absentee alerts, holiday master, and policy configuration."
      items={["Attendance Dashboard", "Approval Queue", "Absentee Alerts", "Leave Policy", "Holiday Master", "Shift Config"]}
    />
  );
}
