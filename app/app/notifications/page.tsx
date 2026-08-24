import { ModulePlaceholder } from "@/components/module-placeholder";

export default function NotificationsPage() {
  return (
    <ModulePlaceholder
      eyebrow="Notifications"
      title="Notification center"
      description="In-app, email, SMS, WhatsApp, and push notifications with alert rules and escalation chains."
      items={["Notification Center", "Alert Rules", "Broadcast Messages", "History", "Preferences", "Escalations"]}
    />
  );
}
