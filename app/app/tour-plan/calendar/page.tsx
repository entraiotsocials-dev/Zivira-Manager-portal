import { ModulePlaceholder } from "@/components/module-placeholder";

export default function TourPlanPage() {
  return (
    <ModulePlaceholder
      eyebrow="Tour Planning"
      title="Tour plan calendar"
      description="Drag-drop tour calendar, team approvals, deviation tracker, and AI route intelligence."
      items={["TP Calendar", "Pending Approvals", "Approved Plans", "Deviation Tracker", "Route Optimizer", "Coverage Gaps"]}
    />
  );
}
