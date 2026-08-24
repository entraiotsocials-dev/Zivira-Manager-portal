"use client";

import type { ZiviraTreeNode } from "@zivira/types";
import Link from "next/link";
import { SubdivisionMaster, SubdivisionProductwise, SubdivisionFieldforcewise } from "@/components/subdivision-master";
import { ProductCategoryMaster } from "@/components/product-category-master";

export function AdminDrilldown({ node, path }: { node: ZiviraTreeNode; path: string[] }) {
  const pathStr = path.join("/");

  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/subdivision/entry") {
    return <SubdivisionMaster />;
  }

  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/subdivision/view-productwise") {
    return <SubdivisionProductwise />;
  }

  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/subdivision/view-field-forcewise") {
    return <SubdivisionFieldforcewise />;
  }

  if (pathStr === "division-dashboard/division-navigation-tabs/division-master/product/category") {
    return <ProductCategoryMaster />;
  }

  if (!node.children?.length) {
    return (
      <article className="card empty-module">
        <h3 className="section-title">{node.title}</h3>
        <p className="muted">This tab is ready for its form, table, report, or approval workflow.</p>
      </article>
    );
  }

  return (
    <div className="grid grid-3">
      {node.children.map((child) => {
        const childPath = [...path, child.slug];
        const href = `/admin/workspace/${childPath.join("/")}`;

        return (
          <Link className="card module-card" href={href} key={`${child.slug}-${child.title}`}>
            <div className="card-head">
              <div>
                <h3 className="section-title">{child.title}</h3>
                <p className="muted">{child.children?.length ? `${child.children.length} sub tabs` : child.title}</p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
