"use client";
import type { ExpenseClaim } from "@zivira/types";
import { Check, Receipt, RefreshCw, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  SUBMITTED: { bg: "#fef9c3", color: "#a16207" },
  APPROVED:  { bg: "#d1fae5", color: "#065f46" },
  REJECTED:  { bg: "#fee2e2", color: "#b91c1c" }
};

// PRD 12.5 follow-up — "how it should be redirect to the admin, manager, to
// claim their expenses ... create a linkage for this." This is that
// manager-side review queue: claims are routed here by the Tour Plan's
// assignedManager, and carry the Tour Plan's GST branch through for context.
export function ManagerExpenseClaims() {
  const [crossTeam, setCrossTeam] = useState(false);
  const [claims, setClaims] = useState<ExpenseClaim[]>([]);
  const [myEmployeeCode, setMyEmployeeCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rejectTarget, setRejectTarget] = useState<ExpenseClaim | null>(null);
  const [reason, setReason] = useState("");
  const [acting, setActing] = useState(false);

  useEffect(() => {
    apiClient.dashboard().then(r => setMyEmployeeCode(r.data.manager.employeeCode)).catch(() => {});
  }, []);

  async function load() {
    setLoading(true); setError("");
    try {
      const res = crossTeam ? await apiClient.expenseClaimsCrossTeam() : await apiClient.expenseClaims();
      setClaims(res.data);
    } catch (e) { setError(e instanceof Error ? e.message : "Load failed"); }
    finally { setLoading(false); }
  }

  useEffect(() => { void load(); }, [crossTeam]); // eslint-disable-line react-hooks/exhaustive-deps

  async function approve(claimId: string) {
    setActing(true);
    try { await apiClient.approveExpenseClaim(claimId); await load(); }
    catch (e) { setError(e instanceof Error ? e.message : "Approve failed"); }
    finally { setActing(false); }
  }

  async function runReject() {
    if (!rejectTarget) return;
    setActing(true); setError("");
    try {
      await apiClient.rejectExpenseClaim(rejectTarget.claimId, reason);
      setRejectTarget(null); setReason("");
      await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Reject failed"); }
    finally { setActing(false); }
  }

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Expense Claims</p>
          <h2>{crossTeam ? "Cross-Team Expense Claims" : "My Team's Expense Claims"}</h2>
          <p>Claims filed against Tour Plans, routed to you by GST branch linkage.</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className={`button ${crossTeam ? "" : "button-secondary"}`} onClick={() => setCrossTeam(v => !v)} type="button">
            <Users size={15} /> {crossTeam ? "Showing: Cross-Team" : "Show Cross-Team"}
          </button>
          <button className="button button-secondary" onClick={load} type="button"><RefreshCw size={15} />{loading ? "Loading" : "Refresh"}</button>
        </div>
      </div>
      {error && <p className="form-error">{error}</p>}

      {rejectTarget && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "var(--panel)", borderRadius: 16, padding: 28, maxWidth: 420, width: "90%", boxShadow: "0 20px 60px rgba(0,0,0,0.18)" }}>
            <h3 style={{ margin: "0 0 8px", color: "var(--ink)" }}>Reject {rejectTarget.claimId}</h3>
            <p style={{ color: "var(--muted)", fontSize: 13, margin: "0 0 12px" }}>
              {rejectTarget.employeeName ?? rejectTarget.employeeCode} — ₹{rejectTarget.amountRs.toLocaleString("en-IN")} ({rejectTarget.category})
            </p>
            <div className="field"><label>Reason (required)</label>
              <textarea rows={3} value={reason} onChange={e => setReason(e.target.value)} placeholder="Explain the reason" />
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}>
              <button className="button button-secondary" onClick={() => { setRejectTarget(null); setReason(""); }} type="button">Cancel</button>
              <button
                onClick={runReject}
                disabled={acting || !reason.trim()}
                type="button"
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", borderRadius: 8, border: "none", background: "#ef4444", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
              >
                <X size={14} /> Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="subdivision-table-card">
        <table className="subdivision-table">
          <thead>
            <tr><th>Claim ID</th><th>MR</th><th>Tour Plan</th><th>Category</th><th>Date</th><th>Amount</th><th>GST Branch</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {claims.map(c => {
              const sc = STATUS_COLORS[c.status] ?? STATUS_COLORS.SUBMITTED;
              const isMine = !myEmployeeCode || c.assignedManager === myEmployeeCode;
              const canAct = c.status === "SUBMITTED" && isMine;
              return (
                <tr key={c.id}>
                  <td><strong style={{ color: "var(--ink)" }}><Receipt size={13} /> {c.claimId}</strong></td>
                  <td>{c.employeeName ?? c.employeeCode}</td>
                  <td style={{ fontSize: 12, color: "var(--muted)" }}>{c.tpId}</td>
                  <td>{c.category}</td>
                  <td style={{ fontSize: 12 }}>{c.expenseDate}</td>
                  <td><strong>₹{c.amountRs.toLocaleString("en-IN")}</strong></td>
                  <td style={{ fontSize: 12, color: "var(--muted)" }}>{c.gstBranchName ?? "—"}</td>
                  <td><span style={{ ...sc, borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>{c.status}</span></td>
                  <td>
                    {canAct && (
                      <span style={{ display: "flex", gap: 6 }}>
                        <button disabled={acting} onClick={() => approve(c.claimId)} title="Approve" type="button"
                          style={{ background: "#16a34a", border: "none", borderRadius: 6, padding: "5px 8px", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center" }}>
                          <Check size={13} />
                        </button>
                        <button disabled={acting} onClick={() => { setRejectTarget(c); setReason(""); }} title="Reject" type="button"
                          style={{ background: "#ef4444", border: "none", borderRadius: 6, padding: "5px 8px", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center" }}>
                          <X size={13} />
                        </button>
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
            {!loading && claims.length === 0 && (
              <tr><td colSpan={9} style={{ textAlign: "center", color: "var(--muted)", padding: 40 }}>No expense claims yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
