"use client";
import type { VisitCoverageGrid } from "@zivira/types";
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";

function cellColor(count: number) {
  if (count === 0) return { bg: "#fee2e2", color: "#b91c1c" };   // GREEN in PRD terms = 0 visits, but red-flagged here as "needs attention"
  if (count <= 2) return { bg: "#fef9c3", color: "#a16207" };
  return { bg: "#d1fae5", color: "#065f46" };
}

export function ManagerVisitCoverage() {
  const [grid, setGrid] = useState<VisitCoverageGrid | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true); setError("");
    try { setGrid((await apiClient.visitCoverage()).data); }
    catch (e) { setError(e instanceof Error ? e.message : "Load failed"); }
    finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, []);

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div>
          <p className="subdivision-eyebrow">Coverage</p>
          <h2>Visit Coverage — {grid?.month ?? ""}</h2>
          <p>Rows = doctors, columns = your MRs. Cell shows visit count this month; under-visited doctors are highlighted.</p>
        </div>
        <button className="button button-secondary" onClick={load} type="button"><RefreshCw size={15} />{loading ? "Loading" : "Refresh"}</button>
      </div>
      {error && <p className="form-error">{error}</p>}

      <div className="subdivision-table-card" style={{ overflowX: "auto" }}>
        <table className="subdivision-table">
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Assigned MR</th>
              {grid?.mrs.map(mr => <th key={mr.employeeCode}>{mr.name}</th>)}
            </tr>
          </thead>
          <tbody>
            {grid?.rows.map(row => (
              <tr key={row.doctorId}>
                <td><strong style={{ color: "var(--ink)" }}>{row.doctorName}</strong></td>
                <td style={{ fontSize: 12, color: "var(--muted)" }}>{row.mappedEmployeeName ?? row.mappedEmployeeCode ?? "—"}</td>
                {row.cells.map(cell => {
                  const sc = cellColor(cell.visitCount);
                  return (
                    <td key={cell.employeeCode}>
                      <span style={{ ...sc, borderRadius: 6, padding: "2px 10px", fontSize: 12, fontWeight: 700 }}>{cell.visitCount}</span>
                    </td>
                  );
                })}
              </tr>
            ))}
            {!loading && (!grid || grid.rows.length === 0) && (
              <tr><td colSpan={10} style={{ textAlign: "center", color: "var(--muted)", padding: 40 }}>No doctors mapped to your team yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
