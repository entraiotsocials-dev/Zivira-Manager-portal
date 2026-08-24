"use client";

import type { EmployeeComplianceRow, ComplianceSummary, PayrollStatusRecord, PayrollSummary } from "@zivira/types";
import { AlertTriangle, Check, IndianRupee, RefreshCw, X } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";

const WARNING_COLORS: Record<string, { bg: string; color: string }> = {
  NONE:   { bg: "#f3f4f6", color: "#6b7280" },
  LOW:    { bg: "#fef9c3", color: "#a16207" },
  MEDIUM: { bg: "#fed7aa", color: "#c2410c" },
  HIGH:   { bg: "#fee2e2", color: "#b91c1c" }
};

const PAYROLL_STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  RELEASED:              { bg: "#dcfce7", color: "#15803d" },
  HOLD:                  { bg: "#fee2e2", color: "#b91c1c" },
  EXPLANATION_SUBMITTED: { bg: "#fef9c3", color: "#a16207" }
};

// Zivira_Project_Basic.docx Topic 2 — Attendance & Compliance Analytics
// Topic 4 — Chronic Defaulter Detection (team-scoped)
export function ManagerCompliance() {
  const [rows, setRows] = useState<EmployeeComplianceRow[]>([]);
  const [summary, setSummary] = useState<ComplianceSummary | null>(null);
  const [payrollRows, setPayrollRows] = useState<PayrollStatusRecord[]>([]);
  const [payrollSummary, setPayrollSummary] = useState<PayrollSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actingId, setActingId] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  async function load() {
    setLoading(true); setError("");
    try {
      const [c, p] = await Promise.all([apiClient.compliance(), apiClient.payroll()]);
      setRows(c.data);
      setSummary(c.summary);
      setPayrollRows(p.data);
      setPayrollSummary(p.summary);
    } catch (e) { setError(e instanceof Error ? e.message : "Load failed"); }
    finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, []);

  async function approve(id: string) {
    setActingId(id); setError("");
    try { await apiClient.approvePayroll(id); await load(); }
    catch (e) { setError(e instanceof Error ? e.message : "Approval failed"); }
    finally { setActingId(null); }
  }

  async function reject() {
    if (!rejectId) return;
    setActingId(rejectId); setError("");
    try { await apiClient.rejectPayroll(rejectId, rejectReason); setRejectId(null); setRejectReason(""); await load(); }
    catch (e) { setError(e instanceof Error ? e.message : "Rejection failed"); }
    finally { setActingId(null); }
  }

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Compliance</p>
          <h2>Team DCR Compliance</h2>
          <p>Submission compliance and chronic-defaulter detection for your team — working days exclude Sundays.</p>
        </div>
        <button className="button button-secondary" onClick={load} type="button"><RefreshCw size={15} />{loading ? "Loading" : "Refresh"}</button>
      </div>
      {error && <p className="form-error">{error}</p>}

      {summary && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 16 }}>
          {[
            { label: "Submitted Today", value: summary.submittedToday },
            { label: "Pending DCR", value: summary.pendingDCR },
            { label: "Missed Yesterday", value: summary.missedYesterday },
            { label: "Chronic Defaulters", value: summary.chronicDefaulters },
            { label: "Avg. Compliance %", value: `${summary.avgCompliancePercent}%` }
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
            <tr>
              <th>Employee</th><th>Role</th><th>Today</th><th>Missed Wk</th><th>Missed Mo</th>
              <th>Compliance %</th><th>Missed (30d)</th><th>Warning</th><th>Salary Hold</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => {
              const wc = WARNING_COLORS[r.warningLevel] ?? WARNING_COLORS.NONE;
              return (
                <tr key={r.employeeCode} style={r.chronicDefaulter ? { background: "#fff5f5" } : undefined}>
                  <td><strong style={{ color: "var(--ink)" }}>{r.employeeName ?? r.employeeCode}</strong><span className="muted" style={{ fontSize: 11 }}> ({r.employeeCode})</span></td>
                  <td style={{ fontSize: 12, color: "var(--muted)" }}>{r.role ?? "—"}</td>
                  <td>
                    {r.submittedToday ? <span className="badge badge-success">Submitted</span> : r.pendingDCR ? <span className="badge badge-warning">Pending</span> : <span className="muted">—</span>}
                  </td>
                  <td>{r.missedThisWeek}</td>
                  <td>{r.missedThisMonth}</td>
                  <td>{r.compliancePercent}%</td>
                  <td>{r.missedLast30Days}</td>
                  <td>
                    <span style={{ ...wc, borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>
                      {r.chronicDefaulter && <AlertTriangle size={11} style={{ marginRight: 4, verticalAlign: "middle" }} />}
                      {r.warningLevel}
                    </span>
                  </td>
                  <td>{r.salaryHold ? <span className="badge badge-danger">Hold</span> : <span className="muted">—</span>}</td>
                </tr>
              );
            })}
            {!loading && rows.length === 0 && (
              <tr><td colSpan={9} style={{ textAlign: "center", color: "var(--muted)", padding: 40 }}>No team members found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Zivira_Project_Basic.docx Topic 3 — Salary Integration Engine.
          Workflow: Employee → No DCR → HR Notification → Employee
          Explanation → Manager Approval → Payroll Released. */}
      <div className="subdivision-head" style={{ marginTop: 28 }}>
        <div>
          <p className="subdivision-eyebrow">Payroll</p>
          <h2>Team Payroll Status</h2>
          <p>Approve a submitted explanation to release payroll, or send it back for more detail.</p>
        </div>
      </div>

      {rejectId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "var(--panel)", borderRadius: 16, padding: 28, maxWidth: 400, width: "90%", boxShadow: "0 20px 60px rgba(0,0,0,0.18)" }}>
            <h3 style={{ margin: "0 0 12px", color: "var(--ink)" }}>Send back for more detail</h3>
            <div className="field"><label>Reason</label><textarea rows={3} value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="What's missing from the explanation?" /></div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}>
              <button className="button button-secondary" onClick={() => setRejectId(null)} type="button">Cancel</button>
              <button onClick={reject} type="button" disabled={!rejectReason.trim()} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", borderRadius: 8, border: "none", background: "#ef4444", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
                <X size={14} /> Send Back
              </button>
            </div>
          </div>
        </div>
      )}

      {payrollSummary && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}>
          {[
            { label: "On Hold", value: payrollSummary.onHold },
            { label: "Pending My Approval", value: payrollSummary.pendingApproval },
            { label: "Released", value: payrollSummary.released }
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
            <tr><th>Employee</th><th>Hold Reason</th><th>Employee Explanation</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {payrollRows.map(p => (
              <tr key={p.id} style={p.status === "HOLD" ? { background: "#fff5f5" } : undefined}>
                <td><strong style={{ color: "var(--ink)" }}>{p.employeeName ?? p.employeeCode}</strong><span className="muted" style={{ fontSize: 11 }}> ({p.employeeCode})</span></td>
                <td style={{ fontSize: 12, color: "var(--muted)", maxWidth: 220 }}>{p.holdReason ?? "—"}</td>
                <td style={{ fontSize: 12, maxWidth: 220 }}>{p.employeeExplanation ?? "—"}</td>
                <td>
                  <span style={{ ...(PAYROLL_STATUS_COLORS[p.status] ?? PAYROLL_STATUS_COLORS.HOLD), borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>
                    {p.status.replace(/_/g, " ")}
                  </span>
                </td>
                <td>
                  {p.status === "EXPLANATION_SUBMITTED" ? (
                    <span style={{ display: "flex", gap: 6 }}>
                      <button disabled={actingId === p.id} onClick={() => approve(p.id)} title="Approve & Release" type="button"
                        style={{ background: "#16a34a", border: "none", borderRadius: 6, padding: "5px 8px", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", gap: 4 }}>
                        <Check size={13} /> <IndianRupee size={12} />
                      </button>
                      <button disabled={actingId === p.id} onClick={() => { setRejectId(p.id); setRejectReason(""); }} title="Send back" type="button"
                        style={{ background: "#ef4444", border: "none", borderRadius: 6, padding: "5px 8px", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center" }}>
                        <X size={13} />
                      </button>
                    </span>
                  ) : <span style={{ color: "var(--muted)", fontSize: 12 }}>—</span>}
                </td>
              </tr>
            ))}
            {!loading && payrollRows.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--muted)", padding: 40 }}>No payroll records for this month</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
