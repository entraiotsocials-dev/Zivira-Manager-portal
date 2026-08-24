export function PageHeader({
  eyebrow,
  title,
  description,
  action
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="page-header">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="page-title">{title}</h2>
        <p className="page-description">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function MetricCard({ label, value, trend }: { label: string; value: string; trend: string }) {
  return (
    <article className="card">
      <p className="metric-label">{label}</p>
      <p className="metric-value">{value}</p>
      <p className="metric-trend">{trend}</p>
    </article>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const warning = ["PILOT", "SETUP", "DRAFT", "PENDING"].includes(status);

  return <span className={warning ? "badge badge-warning" : "badge"}>{status}</span>;
}
