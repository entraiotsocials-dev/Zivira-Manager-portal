import type { ZiviraTreeNode } from "@zivira/types";
import Link from "next/link";

function Card({ node, parentPath }: { node: ZiviraTreeNode; parentPath: string[] }) {
  const path = [...parentPath, node.slug];

  return (
    <Link className="card module-card" href={`/admin/workspace/${path.join("/")}`}>
      <div className="card-head">
        <div>
          <h3 className="section-title">{node.title}</h3>
          <p className="muted">{node.children?.length ? `${node.children.length} sub tabs` : "Ready module"}</p>
        </div>
      </div>
    </Link>
  );
}

export function AdminTabGrid({ node, path }: { node: ZiviraTreeNode; path: string[] }) {
  const children = node.children?.length ? node.children : [node];

  return (
    <div className="grid grid-3">
      {children.map((child) => (
        <Card key={`${child.slug}-${child.title}`} node={child} parentPath={path} />
      ))}
    </div>
  );
}
