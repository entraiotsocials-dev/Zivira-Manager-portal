import { ModulePlaceholder } from "@/components/module-placeholder";

export default function DevicesPage() {
  return (
    <ModulePlaceholder
      eyebrow="Device & App Center"
      title="Device registry"
      description="Device registry, app version tracker, login history, inactive user alerts, telemetry, and crash analytics."
      items={["Device Registry", "App Versions", "Login History", "Inactive Users", "Telemetry", "Crash Analytics"]}
    />
  );
}
