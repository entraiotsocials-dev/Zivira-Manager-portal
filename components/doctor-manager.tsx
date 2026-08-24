"use client";

import type { Doctor, Employee } from "@zivira/types";
import { Plus, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { StatusBadge } from "./page-components";

export function DoctorManager() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    specialty: "",
    category: "C" as Doctor["category"],
    state: "",
    city: "",
    territory: "",
    mappedEmployeeCode: "",
    status: "ACTIVE" as Doctor["status"]
  });

  async function loadDoctors() {
    setError("");

    try {
      const [docRes, empRes] = await Promise.all([apiClient.doctors(), apiClient.employees()]);
      setDoctors(docRes.data);
      setEmployees(empRes.data.filter((e) => e.role === "MR" || e.role === "SR_MR"));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load doctors");
    }
  }

  async function createDoctor(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      await apiClient.createDoctor(form);
      setShowForm(false);
      setForm({ ...form, name: "", specialty: "", state: "", city: "", territory: "", mappedEmployeeCode: "" });
      await loadDoctors();
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Unable to create doctor");
    }
  }

  useEffect(() => {
    void loadDoctors();
  }, []);

  return (
    <>
      <div className="toolbar">
        <button className="button button-secondary" onClick={loadDoctors} type="button">
          <RefreshCw size={17} />
          Refresh
        </button>
        <button className="button" onClick={() => setShowForm((value) => !value)} type="button">
          <Plus size={17} />
          Add doctor
        </button>
      </div>
      {error ? <p className="form-error">{error}</p> : null}
      {showForm ? (
        <form className="card form-grid" onSubmit={createDoctor}>
          <div className="field"><label>Name</label><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="field"><label>Specialty</label><input required value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} /></div>
          <div className="field">
            <label>Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Doctor["category"] })}>
              {["A", "B", "C", "D"].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="field"><label>State</label><input required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} /></div>
          <div className="field"><label>City</label><input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
          <div className="field"><label>Territory</label><input required value={form.territory} onChange={(e) => setForm({ ...form, territory: e.target.value })} /></div>
          <div className="field">
            <label>
              Assign MR
              <span style={{ marginLeft: 6, color: "var(--red)", fontSize: 11, fontWeight: 400 }}>
                — doctor won&apos;t appear in Field Force if unassigned
              </span>
            </label>
            <select value={form.mappedEmployeeCode} onChange={(e) => setForm({ ...form, mappedEmployeeCode: e.target.value })}>
              <option value="">— Leave unassigned —</option>
              {employees.map((emp) => (
                <option key={emp.employeeCode} value={emp.employeeCode}>
                  {emp.employeeCode} — {emp.name} ({emp.territory})
                </option>
              ))}
            </select>
          </div>
          <button className="button" type="submit">Create doctor</button>
        </form>
      ) : null}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Specialty</th>
              <th>Category</th>
              <th>City</th>
              <th>Territory</th>
              <th>MR</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor.id}>
                <td>{doctor.name}</td>
                <td>{doctor.specialty}</td>
                <td><StatusBadge status={doctor.category} /></td>
                <td>{doctor.city}</td>
                <td>{doctor.territory}</td>
                <td>
                  {doctor.mappedEmployeeCode
                    ? <span style={{ color: "var(--brand-strong)", fontWeight: 700 }}>{doctor.mappedEmployeeName ?? doctor.mappedEmployeeCode}</span>
                    : <span className="badge badge-danger">Unassigned</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
