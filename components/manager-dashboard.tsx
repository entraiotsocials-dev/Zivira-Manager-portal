"use client";
import type { ManagerDashboard } from "@zivira/types";
import { RefreshCw, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";

export function ManagerDashboardPanel() {
  const [data, setData] = useState<ManagerDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true); setError("");
    try { setData((await apiClient.dashboard()).data); }
    catch (e) { setError(e instanceof Error ? e.message : "Load failed"); }
    finally { setLoading(false); }
  }
  useEffect(() => {
    void load();
    const timer = window.setInterval(() => { void load(); }, 60000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div><p className="subdivision-eyebrow">Manager Home</p><h2>Dashboard</h2><p>Your team&apos;s real-time field activity summary.</p></div>
        <button className="button button-secondary" onClick={load} type="button"><RefreshCw size={15} />{loading ? "Loading" : "Refresh"}</button>
      </div>
      {error && <p className="form-error">{error}</p>}
      <div className="subdivision-stats" style={{ marginBottom:24 }}>
        <article><span>Team Size</span><strong>{data?.stats.teamSize ?? "—"}</strong></article>
        <article><span>DCRs Today</span><strong>{data?.stats.totalDcrs ?? "—"}</strong></article>
        <article><span>Pending Approval</span><strong style={{ color: data?.stats.pendingApproval ? "#f59e0b" : undefined }}>{data?.stats.pendingApproval ?? "—"}</strong></article>
        <article><span>Approved Today</span><strong>{data?.stats.approvedToday ?? "—"}</strong></article>
      </div>
      <div className="subdivision-head" style={{ marginTop:24 }}><div><h3 style={{ fontSize:16, fontWeight:600 }}>My Team</h3></div></div>
      <div className="subdivision-table-card">
        <table className="subdivision-table">
          <thead><tr><th>S.No</th><th>Name</th><th>Code</th><th>Designation</th><th>Territory</th><th>Status</th></tr></thead>
          <tbody>
            {(data?.team ?? []).map((emp, i) => (
              <tr key={emp.id}>
                <td style={{ color:"var(--muted)" }}>{i+1}</td>
                <td><strong style={{ color:"var(--ink)" }}>{emp.name}</strong></td>
                <td style={{ fontFamily:"monospace", fontSize:12, color:"var(--brand)" }}>{emp.employeeCode}</td>
                <td><span style={{ background:"#eff6ff", borderRadius:6, padding:"2px 8px", fontSize:12, fontWeight:700, color:"#2563eb" }}>{emp.designation}</span></td>
                <td style={{ color:"var(--muted)" }}>{emp.territory}</td>
                <td><span style={{ background: emp.status==="ACTIVE" ? "#f0fdf4" : "#fef2f2", borderRadius:6, padding:"2px 8px", fontSize:12, fontWeight:600, color: emp.status==="ACTIVE" ? "#15803d" : "#ef4444" }}>{emp.status}</span></td>
              </tr>
            ))}
            {!data && !loading && <tr><td colSpan={6} style={{ textAlign:"center", color:"var(--muted)", padding:32 }}><Users size={28} style={{ margin:"0 auto 8px", display:"block", opacity:0.3 }} />No team data</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}
