"use client";
import type { Employee } from "@zivira/types";
import { Plus, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";

export function ManagerTeamList() {
  const [team, setTeam] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [createdLogin, setCreatedLogin] = useState("");
  const [form, setForm] = useState({
    name: "",
    employeeCode: "",
    designation: "Medical Representative",
    division: "Cardio Diabetes",
    territory: "Chennai",
    role: "MR" as Employee["role"],
    status: "ACTIVE" as Employee["status"],
    password: "zivira123"
  });

  async function load() {
    setLoading(true); setError("");
    try { setTeam((await apiClient.team()).data); }
    catch (e) { setError(e instanceof Error ? e.message : "Load failed"); }
    finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, []);

  async function createTeamMember(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true); setError(""); setCreatedLogin("");
    try {
      const response = await apiClient.createTeamMember(form);
      setCreatedLogin(`Field login created: ${response.data.employeeCode.toLowerCase()} / ${response.data.demoPassword ?? form.password}`);
      setForm({ ...form, name: "", employeeCode: "" });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to create field employee");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="subdivision-console">
      <div className="subdivision-head">
        <div><p className="subdivision-eyebrow">Team Management</p><h2>My Team</h2><p>All field force members reporting to you.</p></div>
        <button className="button button-secondary" onClick={load} type="button"><RefreshCw size={15} />{loading ? "Loading" : "Refresh"}</button>
      </div>
      {error && <p className="form-error">{error}</p>}
      <div className="subdivision-stats" style={{ marginBottom:20 }}>
        <article><span>Total Members</span><strong>{team.length}</strong></article>
        <article><span>Active</span><strong>{team.filter(e => e.status==="ACTIVE").length}</strong></article>
        <article><span>Inactive</span><strong>{team.filter(e => e.status!=="ACTIVE").length}</strong></article>
      </div>
      <form className="card form-grid" onSubmit={createTeamMember} style={{ marginBottom:20 }}>
        <div className="field">
          <label>Name</label>
          <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="New MR name" />
        </div>
        <div className="field">
          <label>Employee code</label>
          <input required value={form.employeeCode} onChange={(event) => setForm({ ...form, employeeCode: event.target.value })} placeholder="MR-CHN-002" />
        </div>
        <div className="field">
          <label>Designation</label>
          <input required value={form.designation} onChange={(event) => setForm({ ...form, designation: event.target.value })} />
        </div>
        <div className="field">
          <label>Division</label>
          <input required value={form.division} onChange={(event) => setForm({ ...form, division: event.target.value })} />
        </div>
        <div className="field">
          <label>Territory</label>
          <input required value={form.territory} onChange={(event) => setForm({ ...form, territory: event.target.value })} />
        </div>
        <div className="field">
          <label>Temporary password</label>
          <input required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        </div>
        <button className="button" disabled={saving} type="submit"><Plus size={15} />{saving ? "Creating" : "Add field employee"}</button>
        {createdLogin && <p className="success-message">{createdLogin}</p>}
      </form>
      <div className="subdivision-table-card">
        <table className="subdivision-table">
          <thead><tr><th>S.No</th><th>Name</th><th>Code</th><th>Designation</th><th>Division</th><th>Territory</th><th>Status</th></tr></thead>
          <tbody>
            {team.map((emp, i) => (
              <tr key={emp.id}>
                <td style={{ color:"var(--muted)" }}>{i+1}</td>
                <td><strong style={{ color:"var(--ink)" }}>{emp.name}</strong></td>
                <td style={{ fontFamily:"monospace", fontSize:12, color:"var(--brand)" }}>{emp.employeeCode}</td>
                <td><span style={{ background:"#eff6ff", borderRadius:6, padding:"2px 8px", fontSize:12, fontWeight:700, color:"#2563eb" }}>{emp.designation}</span></td>
                <td style={{ color:"var(--muted)", fontSize:13 }}>{emp.division}</td>
                <td style={{ color:"var(--muted)", fontSize:13 }}>{emp.territory}</td>
                <td><span style={{ background: emp.status==="ACTIVE" ? "#f0fdf4" : "#fef2f2", borderRadius:6, padding:"2px 8px", fontSize:12, fontWeight:600, color: emp.status==="ACTIVE" ? "#15803d" : "#ef4444" }}>{emp.status}</span></td>
              </tr>
            ))}
            {!loading && team.length === 0 && <tr><td colSpan={7} style={{ textAlign:"center", color:"var(--muted)", padding:40 }}>No team members found</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}
