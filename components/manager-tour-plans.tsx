"use client";
import type { TourPlan } from "@zivira/types";
import { Ban, Check, RefreshCw, Repeat, RotateCcw, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  SUBMITTED: { bg: "#fef9c3", color: "#a16207" },
  APPROVED:  { bg: "#d1fae5", color: "#065f46" },
  REJECTED:  { bg: "#fee2e2", color: "#b91c1c" },
  VOIDED:    { bg: "#f3f4f6", color: "#6b7280" },
  DRAFT:     { bg: "#e0e7ff", color: "#3730a3" }
};

type ActionKind = "void" | "reassign" | "reject" | "revoke";

export function ManagerTourPlans() {
  const [crossTeam, setCrossTeam] = useState(false);
  const [tps, setTps] = useState<TourPlan[]>([]);
  const [myEmployeeCode, setMyEmployeeCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionTarget, setActionTarget] = useState<{ tp: TourPlan; kind: ActionKind } | null>(null);
  const [reason, setReason] = useState("");
  const [acting, setActing] = useState(false);
  // Zivira_prompt.pdf item 13 — Tour Plan tab header gets a "Revoke" action.
  // Revoking an already-APPROVED Tour Plan reuses the existing void
  // endpoint (approved plans currently have no other way to be pulled
  // back once approved), surfaced here as a header-level picker since it
  // can target any approved plan, not just the row you're looking at.
  const [revokePickerOpen, setRevokePickerOpen] = useState(false);

  async function load() {
    setLoading(true); setError("");
    try {
      const res = crossTeam ? await apiClient.tourPlansCrossTeam() : await apiClient.tourPlans();
      setTps(res.data);
    } catch (e) { setError(e instanceof Error ? e.message : "Load failed"); }
    finally { setLoading(false); }
  }

  useEffect(() => {
    apiClient.dashboard().then(r => setMyEmployeeCode(r.data.manager.employeeCode)).catch(() => {});
  }, []);

  useEffect(() => { void load(); }, [crossTeam]); // eslint-disable-line react-hooks/exhaustive-deps

  async function approve(tpId: string) {
    setActing(true);
    try { await apiClient.approveTourPlan(tpId); await load(); }
    catch (e) { setError(e instanceof Error ? e.message : "Approve failed"); }
    finally { setActing(false); }
  }

  async function runAction() {
    if (!actionTarget) return;
    setActing(true); setError("");
    try {
      if (actionTarget.kind === "void" || actionTarget.kind === "revoke") await apiClient.voidTourPlan(actionTarget.tp.tpId, reason);
      else if (actionTarget.kind === "reassign") await apiClient.reassignTourPlan(actionTarget.tp.tpId, reason);
      else await apiClient.rejectTourPlan(actionTarget.tp.tpId, reason);
      setActionTarget(null); setReason("");
      await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Action failed"); }
    finally { setActing(false); }
  }

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Tour Plans</p>
          <h2>{crossTeam ? "Cross-Team Tour Plans" : "My Team's Tour Plans"}</h2>
          <p>{crossTeam ? "Every MR's Tour Plan across the tenant — void & reassign any of them to your team." : "Tour Plans submitted to you for approval."}</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className={`button ${crossTeam ? "" : "button-secondary"}`} onClick={() => setCrossTeam(v => !v)} type="button">
            <Users size={15} /> {crossTeam ? "Showing: Cross-Team" : "Show Cross-Team"}
          </button>
          <button className="button button-secondary" onClick={() => setRevokePickerOpen(true)} title="Revoke an approved Tour Plan" type="button">
            <RotateCcw size={15} /> Revoke
          </button>
          <button className="button button-secondary" onClick={load} type="button"><RefreshCw size={15} />{loading ? "Loading" : "Refresh"}</button>
        </div>
      </div>
      {error && <p className="form-error">{error}</p>}

      {revokePickerOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "var(--panel)", borderRadius: 16, padding: 28, maxWidth: 480, width: "90%", maxHeight: "70vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.18)" }}>
            <h3 style={{ margin: "0 0 8px", color: "var(--ink)" }}>Revoke a Tour Plan</h3>
            <p style={{ color: "var(--muted)", fontSize: 13, margin: "0 0 12px" }}>
              Pick an approved Tour Plan to revoke. This voids it — the MR will need a fresh plan approved to resume tour coverage.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {tps.filter(tp => tp.status === "APPROVED").length === 0 && (
                <p className="muted" style={{ fontSize: 13 }}>No approved Tour Plans available to revoke.</p>
              )}
              {tps.filter(tp => tp.status === "APPROVED").map(tp => (
                <button
                  key={tp.id}
                  type="button"
                  onClick={() => { setActionTarget({ tp, kind: "revoke" }); setReason(""); setRevokePickerOpen(false); }}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--line)", background: "none", cursor: "pointer", textAlign: "left" }}
                >
                  <span>
                    <strong style={{ color: "var(--ink)" }}>{tp.tpId}</strong>
                    <span className="muted" style={{ marginLeft: 8, fontSize: 12 }}>{tp.employeeName ?? tp.employeeCode} — {tp.month}</span>
                  </span>
                  <RotateCcw size={14} />
                </button>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
              <button className="button button-secondary" onClick={() => setRevokePickerOpen(false)} type="button">Close</button>
            </div>
          </div>
        </div>
      )}

      {actionTarget && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "var(--panel)", borderRadius: 16, padding: 28, maxWidth: 420, width: "90%", boxShadow: "0 20px 60px rgba(0,0,0,0.18)" }}>
            <h3 style={{ margin: "0 0 8px", color: "var(--ink)" }}>
              {actionTarget.kind === "void" && `Void ${actionTarget.tp.tpId}`}
              {actionTarget.kind === "revoke" && `Revoke ${actionTarget.tp.tpId}`}
              {actionTarget.kind === "reassign" && `Void & Reassign ${actionTarget.tp.tpId}`}
              {actionTarget.kind === "reject" && `Reject ${actionTarget.tp.tpId}`}
            </h3>
            <p style={{ color: "var(--muted)", fontSize: 13, margin: "0 0 12px" }}>
              {actionTarget.tp.employeeName ?? actionTarget.tp.employeeCode} — {actionTarget.tp.month}
              {actionTarget.kind === "reassign" && " — a brand-new Tour Plan will be created under your approval chain, linked back to this one."}
            </p>
            <div className="field"><label>Reason {actionTarget.kind !== "reject" && "(required)"}</label>
              <textarea rows={3} value={reason} onChange={e => setReason(e.target.value)} placeholder="Explain the reason" />
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}>
              <button className="button button-secondary" onClick={() => { setActionTarget(null); setReason(""); }} type="button">Cancel</button>
              <button
                onClick={runAction}
                disabled={acting || (actionTarget.kind !== "reject" && !reason.trim())}
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
            <tr><th>TP ID</th><th>MR</th><th>Month</th><th>Locations</th><th>Manager</th><th>Status</th><th>Notes</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {tps.map(tp => {
              const sc = STATUS_COLORS[tp.status] ?? STATUS_COLORS.DRAFT;
              // Only the assigned manager can approve/reject (matches the
              // backend's requireRole check) — in Cross-Team view that's not
              // always the manager viewing the screen, so gate on it here
              // too instead of showing a button that will just 403.
              const isMine = !myEmployeeCode || tp.assignedManager === myEmployeeCode;
              const canApprove = tp.status === "SUBMITTED" && isMine;
              const canVoid = tp.status !== "VOIDED";
              return (
                <tr key={tp.id}>
                  <td><strong style={{ color: "var(--ink)" }}>{tp.tpId}</strong></td>
                  <td>{tp.employeeName ?? tp.employeeCode}</td>
                  <td>{tp.month}</td>
                  <td style={{ fontSize: 12, color: "var(--muted)" }}>{tp.locations.length} location(s)</td>
                  <td style={{ fontSize: 12 }}>{tp.assignedManagerName ?? tp.assignedManager}{tp.assignedManagerName ? <span className="muted"> ({tp.assignedManager})</span> : null}</td>
                  <td><span style={{ ...sc, borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>{tp.status}</span></td>
                  <td style={{ fontSize: 12, color: "var(--muted)" }}>
                    {tp.status === "VOIDED" && `Voided by ${tp.voidedByName ?? tp.voidedBy}: ${tp.voidReason}${tp.reassignedToTpId ? ` → ${tp.reassignedToTpId}` : ""}`}
                    {tp.parentTpId && `Reassigned from ${tp.parentTpId}`}
                  </td>
                  <td>
                    <span style={{ display: "flex", gap: 6 }}>
                      {canApprove && (
                        <button disabled={acting} onClick={() => approve(tp.tpId)} title="Approve" type="button"
                          style={{ background: "#16a34a", border: "none", borderRadius: 6, padding: "5px 8px", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center" }}>
                          <Check size={13} />
                        </button>
                      )}
                      {canApprove && (
                        <button disabled={acting} onClick={() => { setActionTarget({ tp, kind: "reject" }); setReason(""); }} title="Reject" type="button"
                          style={{ background: "#f59e0b", border: "none", borderRadius: 6, padding: "5px 8px", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center" }}>
                          <X size={13} />
                        </button>
                      )}
                      {canVoid && (
                        <button disabled={acting} onClick={() => { setActionTarget({ tp, kind: "void" }); setReason(""); }} title="Void" type="button"
                          style={{ background: "#ef4444", border: "none", borderRadius: 6, padding: "5px 8px", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center" }}>
                          <Ban size={13} />
                        </button>
                      )}
                      {canVoid && (
                        <button disabled={acting} onClick={() => { setActionTarget({ tp, kind: "reassign" }); setReason(""); }} title="Void & Reassign to me" type="button"
                          style={{ background: "#7c3aed", border: "none", borderRadius: 6, padding: "5px 8px", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center" }}>
                          <Repeat size={13} />
                        </button>
                      )}
                    </span>
                  </td>
                </tr>
              );
            })}
            {!loading && tps.length === 0 && (
              <tr><td colSpan={8} style={{ textAlign: "center", color: "var(--muted)", padding: 40 }}>No Tour Plans yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
