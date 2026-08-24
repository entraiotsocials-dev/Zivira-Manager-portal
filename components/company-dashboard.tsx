"use client";

import type { CompanyDashboard } from "@zivira/types";
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { fallbackMetrics } from "@/lib/company-data";
import { MetricCard, StatusBadge } from "./page-components";

export function CompanyDashboardPanel() {
  const [dashboard, setDashboard] = useState<CompanyDashboard | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      const response = await apiClient.companyDashboard();
      setDashboard(response.data);
    } catch (dashboardError) {
      setError(dashboardError instanceof Error ? dashboardError.message : "Unable to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadDashboard();
  }, []);

  const metrics = dashboard
    ? [
        { label: "Employees", value: String(dashboard.metrics.employeeCount), trend: "Active employees" },
        { label: "Doctors", value: String(dashboard.metrics.doctorCount), trend: "Active doctor universe" },
        { label: "Products", value: String(dashboard.metrics.activeProductCount), trend: "Active catalog" },
        { label: "DCR Today", value: String(dashboard.metrics.dcrSubmittedToday), trend: "Submitted today" }
      ]
    : fallbackMetrics;

  return (
    <>
      <div className="toolbar">
        <button className="button button-secondary" onClick={loadDashboard} type="button">
          <RefreshCw size={17} />
          {loading ? "Refreshing" : "Refresh"}
        </button>
      </div>
      {error ? <p className="form-error">{error}</p> : null}
      <section className="grid grid-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>
      <section className="grid grid-2" style={{ marginTop: 16 }}>
        <article className="card">
          <h3 className="section-title">Recent Employees</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Code</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {(dashboard?.recentEmployees ?? []).map((employee) => (
                  <tr key={employee.id}>
                    <td>{employee.name}</td>
                    <td>{employee.employeeCode}</td>
                    <td>{employee.role}</td>
                    <td>
                      <StatusBadge status={employee.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
        <article className="card">
          <h3 className="section-title">Recent Doctors</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Specialty</th>
                  <th>Category</th>
                  <th>Territory</th>
                </tr>
              </thead>
              <tbody>
                {(dashboard?.recentDoctors ?? []).map((doctor) => (
                  <tr key={doctor.id}>
                    <td>{doctor.name}</td>
                    <td>{doctor.specialty}</td>
                    <td>
                      <StatusBadge status={doctor.category} />
                    </td>
                    <td>{doctor.territory}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </>
  );
}
