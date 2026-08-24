"use client";

import type { ZiviraTreeNode } from "@zivira/types";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

function cloneWithAdd(nodes: ZiviraTreeNode[], slug: string, child: ZiviraTreeNode): ZiviraTreeNode[] {
  return nodes.map((item) =>
    item.slug === slug
      ? { ...item, children: [...(item.children ?? []), child] }
      : { ...item, children: item.children ? cloneWithAdd(item.children, slug, child) : undefined }
  );
}

function cloneWithout(nodes: ZiviraTreeNode[], slug: string): ZiviraTreeNode[] {
  return nodes
    .filter((item) => item.slug !== slug)
    .map((item) => ({ ...item, children: item.children ? cloneWithout(item.children, slug) : undefined }));
}

function TreeNodeView({ node, basePath, depth, pathSegments, onAdd, onDelete }: {
  node: ZiviraTreeNode;
  basePath: string;
  depth: number;
  pathSegments: string[];
  onAdd: (slug: string) => void;
  onDelete: (slug: string) => void;
}) {
  const path = [...pathSegments, node.slug];
  const href = `${basePath}/${path.join("/")}`;

  return (
    <li className="tree-node">
      <div className="tree-row" style={{ paddingLeft: 10 + depth * 18 }}>
        <span>
          <strong>{node.title}</strong>
          <small>{node.scope}</small>
        </span>
        <span className="tree-actions">
          <Link className="icon-button" href={href} title="Open">
            <ExternalLink size={15} />
          </Link>
          <button className="icon-button" onClick={() => onAdd(node.slug)} title="Add child" type="button">
            <Plus size={15} />
          </button>
          <button className="icon-button danger" onClick={() => onDelete(node.slug)} title="Delete" type="button">
            <Trash2 size={15} />
          </button>
        </span>
      </div>
      {node.children?.length ? (
        <ul className="tree-list">
          {node.children.map((child) => (
            <TreeNodeView key={`${child.scope}-${child.slug}-${child.title}`} node={child} basePath={basePath} depth={depth + 1} pathSegments={path} onAdd={onAdd} onDelete={onDelete} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function ZiviraTreeManager({ tree, basePath }: { tree: ZiviraTreeNode[]; basePath: string }) {
  const [nodes, setNodes] = useState(tree);

  function addChild(parentSlug: string) {
    const title = window.prompt("New tab name");

    if (!title?.trim()) {
      return;
    }

    const child: ZiviraTreeNode = {
      title: title.trim(),
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      scope: "division"
    };

    setNodes((current) => cloneWithAdd(current, parentSlug, child));
  }

  function deleteNode(slug: string) {
    setNodes((current) => cloneWithout(current, slug));
  }

  return (
    <div className="tree-shell">
      <ul className="tree-list">
        {nodes.map((item) => (
          <TreeNodeView key={`${item.scope}-${item.slug}`} node={item} basePath={basePath} depth={0} pathSegments={[]} onAdd={addChild} onDelete={deleteNode} />
        ))}
      </ul>
    </div>
  );
}
