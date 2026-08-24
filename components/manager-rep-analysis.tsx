"use client";

import type { RepAnalysisRow, TeamJointWorkSummary } from "@zivira/types";
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";

// Zivira_Project_Basic.docx Topic 5 — Representative vs Manager Analysis
// Topic 6 — Joint Field Work Analysis (team-scoped)
export function ManagerRepAnalysis() {
  const [reps, setReps] = useState<RepAnalysisRow[]>([]);
  const [summary, setSummary] = useState<TeamJointWorkSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true); setError("");
    try {
      const r = await apiClient.repManagerAnalysis();
      setReps(r.data);
      setSummary(r.teamSummary);
    } catch (e) { setError(e instanceof Error ? e.message : "Load failed"); }
    finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, []);

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Analytics</p>
          <h2>Rep Coverage &amp; Joint Field Work</h2>
          <p>How much time you&apos;re spending in the field with each rep, vs how many doctors they&apos;re covering on their own.</p>
        </div>
        <button className="button button-secondary" onClick={load} type="button"><RefreshCw size={15} />{loading ? "Loading" : "Refresh"}</button>
      </div>
      {error && <p className="form-error">{error}</p>}

      {summary && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
          {[
            { label: "Team Size", value: summary.teamSize },
            { label: "Total Joint Calls", value: summary.totalJointCalls },
            { label: "Avg Joint / Rep", value: summary.avgJointCallsPerRep },
            { label: "Joint Call %", value: `${summary.jointCallPercent}%` }
          ].map(m => (
            <div key={m.label} className="card" style={{ padding: 14 }}>
              <p className="muted" style={{ fontSize: 12, margin: 0 }}>{m.label}</p>
              <p style={{ fontSize: 22, fontWeight: 800, margin: "4px 0 0", color: "var(--ink)" }}>{m.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="subdivision-table-card" style={{ overflowX: "auto" }}>
        <table className="subdivision-table">
          <thead>
            <tr><th>Representative</th><th>Doctors Visited</th><th>Total Visits</th><th>Joint Visits (with you)</th><th>Joint Visit %</th></tr>
          </thead>
          <tbody>
            {reps.map(r => (
              <tr key={r.employeeCode} style={r.jointVisitPercent === 0 && r.totalVisits > 0 ? { background: "#fff8e8" } : undefined}>
                <td><strong style={{ color: "var(--ink)" }}>{r.employeeName ?? r.employeeCode}</strong><span className="muted" style={{ fontSize: 11 }}> ({r.employeeCode})</span></td>
                <td>{r.doctorsVisited}</td>
                <td>{r.totalVisits}</td>
                <td>{r.jointVisits}</td>
                <td>{r.jointVisitPercent}%</td>
              </tr>
            ))}
            {!loading && reps.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--muted)", padding: 40 }}>No team members found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
