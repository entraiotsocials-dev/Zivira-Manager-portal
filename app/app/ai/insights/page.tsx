import { ModulePlaceholder } from "@/components/module-placeholder";

export default function AiInsightsPage() {
  return (
    <ModulePlaceholder
      eyebrow="AI Intelligence"
      title="AI insights feed"
      description="Predictive analytics, smart recommendations, anomaly detection, and natural language analytics."
      items={["Sales Forecasting", "Doctor Churn Risk", "Visit Suggestions", "Fraud Alerts", "Geo Mismatch Flags", "Ask Zivira AI"]}
    />
  );
}
