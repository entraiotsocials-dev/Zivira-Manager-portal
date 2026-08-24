import type { ZiviraTreeNode } from "@zivira/types";
import { ziviraApplicationTree } from "@zivira/types";

export function findTreeNode(path: string[], nodes: ZiviraTreeNode[] = ziviraApplicationTree): ZiviraTreeNode | undefined {
  const [head, ...rest] = path;
  const match = nodes.find((item) => item.slug === head);

  if (!match) {
    return undefined;
  }

  if (rest.length === 0) {
    return match;
  }

  return findTreeNode(rest, match.children ?? []);
}
