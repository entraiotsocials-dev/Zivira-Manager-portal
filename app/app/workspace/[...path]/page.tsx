import { Plus, Trash2 } from "lucide-react";
import { notFound } from "next/navigation";
import { PageHeader, StatusBadge } from "@/components/page-components";
import { findTreeNode } from "@/lib/tree-lookup";

export default async function WorkspacePage({ params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const node = findTreeNode(path);

  if (!node) {
    notFound();
  }

  return (
    <>
      <PageHeader
        eyebrow={node.scope}
        title={node.title}
        description="Modern working surface for this exact legacy tab. CRUD controls are present here and can be wired to the matching MongoDB collection."
        action={
          <div className="toolbar">
            <button className="button"><Plus size={17} /> Add</button>
            <button className="button button-secondary"><Trash2 size={17} /> Delete</button>
          </div>
        }
      />
      <div className="grid grid-3">
        <article className="card">
          <h3 className="section-title">Module Path</h3>
          <p className="muted">/{path.join(" / ")}</p>
          <StatusBadge status="ACTIVE" />
        </article>
        <article className="card">
          <h3 className="section-title">Records</h3>
          <p className="metric-value">0</p>
          <p className="muted">Ready for tenant-scoped data.</p>
        </article>
        <article className="card">
          <h3 className="section-title">Controls</h3>
          <p className="muted">Add, delete, import, export, approve, and audit controls will attach here by module type.</p>
        </article>
      </div>
    </>
  );
}
