"use client";

// Item 3 — real notifications for the Manager portal: tenant-wide Admin
// broadcasts (e.g. a masters record added/updated/deactivated) plus
// notices targeted specifically at this manager (another manager
// voiding/reassigning one of their Tour Plans — see notifyManager() in the
// backend's utils/notify.ts). Polls GET /manager/notices every 20s — same
// approach used for the FieldRepo portal's Item 1 notifications page.
import { Bell, BellRing } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { apiClient, type ManagerNotice } from "@/lib/api-client";
import { PageHeader } from "./page-components";

const POLL_INTERVAL_MS = 20000;

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function ManagerNotifications() {
  const [notices, setNotices] = useState<ManagerNotice[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const latestSeenAt = useRef<string | null>(null);

  const load = useCallback(async (isPoll: boolean) => {
    try {
      const response = await apiClient.notices();
      setNotices(response.data);
      setError("");
      if (response.data.length > 0) latestSeenAt.current = response.data[0].createdAt;
    } catch (loadError) {
      if (!isPoll) setError(loadError instanceof Error ? loadError.message : "Unable to load notifications");
    } finally {
      if (!isPoll) setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(false);
    const interval = setInterval(() => load(true), POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [load]);

  return (
    <>
      <PageHeader
        eyebrow="Notifications"
        title="Alerts"
        description="Real-time updates whenever Admin changes a master record, or another manager voids/reassigns one of your Tour Plans."
      />
      {error && <p className="card" style={{ color: "var(--red, #c0392b)" }}>{error}</p>}
      {loading ? (
        <p className="muted">Loading notifications…</p>
      ) : notices.length === 0 ? (
        <article className="card">
          <p style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, marginBottom: 4 }}><Bell size={16} /> No notifications yet</p>
          <p className="muted">You&apos;ll see Admin changes and cross-manager Tour Plan actions here as they happen.</p>
        </article>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {notices.map((notice) => (
            <article className="card" key={notice.id}>
              <p style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, fontWeight: 800, marginBottom: 4 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <BellRing size={16} /> {notice.title}
                </span>
                {notice.priority === "URGENT" && <span className="badge badge-warning">Urgent</span>}
              </p>
              <p className="muted">{notice.message}</p>
              <p className="muted" style={{ fontSize: 12, marginTop: 4 }}>{timeAgo(notice.createdAt)}</p>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
