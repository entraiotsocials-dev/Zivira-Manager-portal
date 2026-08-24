import { ModulePlaceholder } from "@/components/module-placeholder";

export default function TeamDcrPage() {
  return (
    <ModulePlaceholder
      eyebrow="DCR Intelligence"
      title="Team DCR"
      description="Team submissions, approval queues, anomaly alerts, productivity scores, and doctor coverage analytics."
      items={["Team Submissions", "Approval Queue", "Anomaly Alerts", "Productivity Scores", "Coverage Map", "Rules Engine"]}
    />
  );
}
