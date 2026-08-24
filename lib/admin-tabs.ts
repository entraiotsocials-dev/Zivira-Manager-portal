import type { ZiviraTreeNode } from "@zivira/types";
import { ziviraApplicationTree } from "@zivira/types";

const tabSlugMap: Record<string, string> = {
  home: "home",
  masters: "division-master",
  activities: "activities",
  "activity-reports": "activity-reports",
  "mis-reports": "mis-reports",
  options: "division-options"
};

function findNode(nodes: ZiviraTreeNode[], slug: string): ZiviraTreeNode | undefined {
  for (const item of nodes) {
    if (item.slug === slug) {
      return item;
    }

    const child = item.children ? findNode(item.children, slug) : undefined;

    if (child) {
      return child;
    }
  }

  return undefined;
}

export function getAdminTab(tab: string) {
  const slug = tabSlugMap[tab] ?? "home";
  return findNode(ziviraApplicationTree, slug);
}

export const adminTabMeta: Record<string, { eyebrow: string; title: string; description: string }> = {
  home: {
    eyebrow: "Home",
    title: "Command Center",
    description: "Welcome, Corporate HQ - Zivira Labs Pvt Ltd - Last sync 2 min ago"
  },
  masters: {
    eyebrow: "Masters",
    title: "Master setup",
    description: "SubDivision, Product, Field Force, Doctor, Input, Stockist, Expense, and personal information setup."
  },
  activities: {
    eyebrow: "Activities",
    title: "Operational activities",
    description: "Approvals, expenses, sample/input dispatch, login details, tasks, order booking, and manager missed calls."
  },
  "activity-reports": {
    eyebrow: "Activity Reports",
    title: "Activity reports",
    description: "Territory, survey, TP, DCR, and customized report surfaces."
  },
  "mis-reports": {
    eyebrow: "MIS Reports",
    title: "MIS reporting center",
    description: "Manager analysis, DCR analysis, visit details, product exposure, dumps, digital detailing, and summaries."
  },
  options: {
    eyebrow: "Options",
    title: "Admin options",
    description: "Dashboard, setup, access rights, upload tools, app setup, update/delete utilities, transfers, and quiz controls."
  }
};
