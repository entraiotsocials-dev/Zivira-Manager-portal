"use client";
import type { DcrExtended } from "@zivira/types";
import { Check, RefreshCw, X } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  SUBMITTED:        { bg:"#fef9c3", color:"#a16207" },
  MANAGER_APPROVED: { bg:"#dcfce7", color:"#15803d" },
  APPROVED:         { bg:"#d1fae5", color:"#065f46" },
  REJECTED:         { bg:"#fee2e2", color:"#b91c1c" },
  DRAFT:            { bg:"#f3f4f6", color:"#6b7280" }
};

function getDoctorName(doctorId: DcrExtended["doctorId"]) {
  if (typeof doctorId === "object" && doctorId && "name" in doctorId) {
    return doctorId.name;
  }

  return "";
}

// Zivira_Project_Basic.docx Topic 1 — surfaces Visit Information + Doctor
// Feedback in the reviewer table without widening it: a compact badge plus
// a native tooltip carrying the full detail (hospital, check-in/out, notes).
const INTEREST_COLORS: Record<string, { bg: string; color: string }> = {
  HIGH:   { bg:"#dcfce7", color:"#15803d" },
  MEDIUM: { bg:"#fef9c3", color:"#a16207" },
  LOW:    { bg:"#fee2e2", color:"#b91c1c" },
  NONE:   { bg:"#f3f4f6", color:"#6b7280" }
};
function feedbackTitle(dcr: DcrExtended) {
  const parts: string[] = [];
  if (dcr.hospitalClinic) parts.push(`Hospital/Clinic: ${dcr.hospitalClinic}`);
  if (dcr.checkInTime || dcr.checkOutTime) parts.push(`Visit: ${dcr.checkInTime ?? "—"} to ${dcr.checkOutTime ?? "—"}${dcr.visitDurationMinutes ? ` (${dcr.visitDurationMinutes} min)` : ""}`);
  if (dcr.productFeedback) parts.push(`Feedback: ${dcr.productFeedback}`);
  if (dcr.competitorMentioned) parts.push(`Competitor mentioned: ${dcr.competitorMentioned}`);
  if (dcr.followUpRequired) parts.push(`Follow-up required${dcr.followUpDate ? ` by ${new Date(dcr.followUpDate).toLocaleDateString("en-IN")}` : ""}`);
  return parts.join("\n") || "No additional visit details captured";
}

export function ManagerDcrList() {
  const [dcrs, setDcrs]       = useState<DcrExtended[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [rejectId, setRejectId]   = useState<string|null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [acting, setActing] = useState<string|null>(null);

  async function load() {
    setLoading(true); setError("");
    try { setDcrs((await apiClient.dcrs()).data); }
    catch (e) { setError(e instanceof Error ? e.message : "Load failed"); }
    finally { setLoading(false); }
  }
  useEffect(() => {
    void load();
    const timer = window.setInterval(() => { void load(); }, 60000);
    return () => window.clearInterval(timer);
  }, []);

  async function approve(id: string) {
    setActing(id);
    try { await apiClient.approveDcr(id); await load(); }
    catch (e) { setError(e instanceof Error ? e.message : "Approval failed"); }
    finally { setActing(null); }
  }

  async function reject() {
    if (!rejectId) return;
    setActing(rejectId);
    try { await apiClient.rejectDcr(rejectId, rejectReason); setRejectId(null); setRejectReason(""); await load(); }
    catch (e) { setError(e instanceof Error ? e.message : "Rejection failed"); }
    finally { setActing(null); }
  }

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div><p className="subdivision-eyebrow">Team Activity</p><h2>Team DCRs</h2><p>Review and approve daily call reports submitted by your team.</p></div>
        <button className="button button-secondary" onClick={load} type="button"><RefreshCw size={15} />{loading ? "Loading" : "Refresh"}</button>
      </div>
      {error && <p className="form-error">{error}</p>}

      {/* Reject modal */}
      {rejectId && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ background:"var(--panel)", borderRadius:16, padding:28, maxWidth:400, width:"90%", boxShadow:"0 20px 60px rgba(0,0,0,0.18)" }}>
            <h3 style={{ margin:"0 0 12px", color:"var(--ink)" }}>Reject DCR</h3>
            <div className="field"><label>Reason (optional)</label><textarea rows={3} value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Explain the reason for rejection" /></div>
            <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:16 }}>
              <button className="button button-secondary" onClick={() => setRejectId(null)} type="button">Cancel</button>
              <button onClick={reject} type="button" style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 18px", borderRadius:8, border:"none", background:"#ef4444", color:"#fff", fontWeight:600, fontSize:14, cursor:"pointer" }}>
                <X size={14} /> Reject
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="subdivision-table-card">
        <table className="subdivision-table">
          <thead>
            <tr><th>S.No</th><th>Employee</th><th>Doctor</th><th>Session</th><th>Time</th><th>Products</th><th>Samples</th><th>Inputs</th><th>Joint Work</th><th>Feedback</th><th>Override</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {dcrs.map((dcr, i) => {
              const sc = STATUS_COLORS[dcr.status] ?? STATUS_COLORS["DRAFT"];
              const canAct = dcr.status === "SUBMITTED";
              return (
                <tr key={dcr.id} style={dcr.overVisitFlag ? { background: "#fff8e8" } : undefined}>
                  <td style={{ color:"var(--muted)" }}>{i+1}</td>
                  <td><strong style={{ color:"var(--ink)" }}>{dcr.employeeName ?? dcr.employeeCode}</strong>{dcr.employeeName ? <span className="muted" style={{ fontSize: 11 }}> ({dcr.employeeCode})</span> : null}</td>
                  <td style={{ color:"var(--muted)", fontSize:12 }}>{getDoctorName(dcr.doctorId) || "—"}</td>
                  <td><span style={{ fontSize:11, fontWeight:600, color:"var(--muted)" }}>{dcr.callSession ?? "—"}</span></td>
                  <td style={{ fontSize:12, color:"var(--muted)" }}>{dcr.callTime ?? "—"}</td>
                  <td style={{ fontSize:12, color:"var(--muted)", maxWidth:120 }}>{dcr.productsDetailed?.join(", ") || "—"}</td>
                  <td style={{ fontSize:12 }}>{dcr.samplesGiven?.length ? dcr.samplesGiven.map(s => `${s.productName}×${s.qty}`).join(", ") : "—"}</td>
                  <td style={{ fontSize:12 }}>{dcr.inputsGiven?.length ? dcr.inputsGiven.map(s => `${s.itemType ?? s.inputName}×${s.qty}`).join(", ") : "—"}</td>
                  <td style={{ fontSize:12 }}>{dcr.jointWork?.accompanyingManager ? `${dcr.jointWork.accompanyingManager} · ${dcr.jointWork.jointWorkType?.replace(/_/g," ")}` : "—"}</td>
                  <td title={feedbackTitle(dcr)}>
                    {dcr.prescriptionInterest ? (
                      <span style={{ ...(INTEREST_COLORS[dcr.prescriptionInterest] ?? INTEREST_COLORS.NONE), borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:700, cursor:"help" }}>
                        {dcr.prescriptionInterest}{dcr.followUpRequired ? " ·  FU" : ""}
                      </span>
                    ) : <span style={{ color:"var(--muted)", fontSize:12 }}>—</span>}
                  </td>
                  <td>
                    {dcr.overVisitFlag ? (
                      <span style={{ background: "#fef3c7", color: "#92400e", borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>
                        Visit #{dcr.overVisitCount ?? "4+"}
                      </span>
                    ) : <span style={{ color: "var(--muted)", fontSize: 12 }}>—</span>}
                  </td>
                  <td><span style={{ ...sc, borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:700 }}>{dcr.status.replace("_"," ")}</span></td>
                  <td>
                    {canAct ? (
                      <span style={{ display:"flex", gap:6 }}>
                        <button disabled={acting === dcr.id} onClick={() => approve(dcr.id)} title="Approve" type="button"
                          style={{ background:"#16a34a", border:"none", borderRadius:6, padding:"5px 8px", cursor:"pointer", color:"#fff", display:"flex", alignItems:"center" }}>
                          <Check size={13} />
                        </button>
                        <button disabled={acting === dcr.id} onClick={() => { setRejectId(dcr.id); setRejectReason(""); }} title="Reject" type="button"
                          style={{ background:"#ef4444", border:"none", borderRadius:6, padding:"5px 8px", cursor:"pointer", color:"#fff", display:"flex", alignItems:"center" }}>
                          <X size={13} />
                        </button>
                      </span>
                    ) : <span style={{ color:"var(--muted)", fontSize:12 }}>—</span>}
                  </td>
                </tr>
              );
            })}
            {!loading && dcrs.length === 0 && (
              <tr><td colSpan={13} style={{ textAlign:"center", color:"var(--muted)", padding:40 }}>No DCRs yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
