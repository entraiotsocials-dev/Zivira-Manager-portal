import { ModulePlaceholder } from "@/components/module-placeholder";

export default function LiveMapPage() {
  return (
    <ModulePlaceholder
      eyebrow="Field Intelligence"
      title="Live field map"
      description="Live tracking, active reps view, real-time check-ins, route replay, and geo fence alerts."
      items={["Field Force Map", "Active Reps", "Real-time Check-ins", "Route Replay", "Distance Reports", "Geo Fence Alerts"]}
    />
  );
}
