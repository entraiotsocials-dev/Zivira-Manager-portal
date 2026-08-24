import type { ApiEnvelope, CompanyDashboard, DcrExtended, Doctor, Employee, ManagerDashboard, Product, TourPlan, VisitCoverageGrid, ExpenseClaim, ComplianceResponse, EmployeeComplianceRow, PayrollResponse, PayrollStatusRecord, RepManagerTeamResponse, RepAnalysisRow } from "@zivira/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://zivira-labs-backend-1.onrender.com/api";
const TOKEN_KEY = "zivira.manager.token";

export function getToken()  { if (typeof window === "undefined") return null; return window.localStorage.getItem(TOKEN_KEY); }
export function setToken(t: string) { window.localStorage.setItem(TOKEN_KEY, t); }
export function clearToken() { window.localStorage.removeItem(TOKEN_KEY); }

async function request<T>(path: string, init: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...init.headers }
  });
  const payload = await res.json();
  if (!res.ok) throw new Error(payload?.error?.message ?? "API request failed");
  return payload as ApiEnvelope<T>;
}

export const apiClient = {
  login: (username: string, password: string) =>
    request<{ token: string }>("/auth/login", { method: "POST", body: JSON.stringify({ username, password, portal: "FIELD_FORCE" }) }),
  dashboard: () => request<ManagerDashboard>("/manager/dashboard"),
  team:      () => request<Employee[]>("/manager/team"),
  createTeamMember: (input: Omit<Employee, "id" | "tenantSlug" | "createdAt" | "updatedAt" | "reportingManager"> & { password?: string }) =>
    request<Employee & { demoPassword?: string }>("/manager/team", { method: "POST", body: JSON.stringify(input) }),
  dcrs:      () => request<DcrExtended[]>("/manager/dcrs"),
  approveDcr: (id: string) => request<DcrExtended>(`/manager/dcrs/${id}/approve`, { method: "POST" }),
  rejectDcr:  (id: string, reason?: string) => request<DcrExtended>(`/manager/dcrs/${id}/reject`, { method: "POST", body: JSON.stringify({ reason }) }),
  employees: () => request<Employee[]>("/company/employees"),
  createEmployee: (input: Omit<Employee, "id" | "tenantSlug" | "createdAt" | "updatedAt">) =>
    request<Employee>("/company/employees", { method: "POST", body: JSON.stringify(input) }),
  doctors: () => request<Doctor[]>("/company/doctors"),
  createDoctor: (input: Omit<Doctor, "id" | "tenantSlug" | "createdAt" | "updatedAt">) =>
    request<Doctor>("/company/doctors", { method: "POST", body: JSON.stringify(input) }),
  products: () => request<Product[]>("/company/products"),
  companyDashboard: () => request<CompanyDashboard>("/company/dashboard"),

  // PRD 12.1 — Tour Plan: cross-manager assignment & void/reassign
  tourPlans: () => request<TourPlan[]>("/manager/tour-plans"),
  tourPlansCrossTeam: () => request<TourPlan[]>("/manager/tour-plans/cross-team"),
  approveTourPlan: (tpId: string) => request<TourPlan>(`/manager/tour-plans/${tpId}/approve`, { method: "PATCH" }),
  rejectTourPlan: (tpId: string, reason?: string) => request<TourPlan>(`/manager/tour-plans/${tpId}/reject`, { method: "PATCH", body: JSON.stringify({ reason }) }),
  voidTourPlan: (tpId: string, reason: string) => request<TourPlan>(`/manager/tour-plans/${tpId}/void`, { method: "PATCH", body: JSON.stringify({ reason }) }),
  reassignTourPlan: (tpId: string, reason: string) =>
    request<{ original: TourPlan; created: TourPlan }>(`/manager/tour-plans/${tpId}/reassign`, { method: "POST", body: JSON.stringify({ reason }) }),

  // PRD 12.2 — Visit Coverage grid
  visitCoverage: (month?: string) => request<VisitCoverageGrid>(`/manager/visit-coverage${month ? `?month=${month}` : ""}`),

  // Zivira_Project_Basic.docx Topic 2/4 — Attendance & Compliance Analytics
  // / Chronic Defaulter Detection (team-scoped)
  compliance: (month?: string) =>
    request<EmployeeComplianceRow[]>(`/manager/analytics/compliance${month ? `?month=${month}` : ""}`) as Promise<ComplianceResponse>,

  // Zivira_Project_Basic.docx Topic 3 — Salary Integration Engine (team-scoped)
  payroll: (month?: string) =>
    request<PayrollStatusRecord[]>(`/manager/analytics/payroll${month ? `?month=${month}` : ""}`) as Promise<PayrollResponse>,
  approvePayroll: (id: string) => request<PayrollStatusRecord>(`/manager/analytics/payroll/${id}/approve`, { method: "PATCH" }),
  rejectPayroll: (id: string, reason: string) =>
    request<PayrollStatusRecord>(`/manager/analytics/payroll/${id}/reject`, { method: "PATCH", body: JSON.stringify({ reason }) }),

  // Zivira_Project_Basic.docx Topic 5/6 — Rep vs Manager / Joint Field Work (team-scoped)
  repManagerAnalysis: (month?: string) =>
    request<RepAnalysisRow[]>(`/manager/analytics/rep-manager${month ? `?month=${month}` : ""}`) as Promise<RepManagerTeamResponse>,

  // PRD 12.5 follow-up — Expense Claims linked to a Tour Plan's GST branch
  expenseClaims: () => request<ExpenseClaim[]>("/manager/expense-claims"),
  expenseClaimsCrossTeam: () => request<ExpenseClaim[]>("/manager/expense-claims/cross-team"),
  approveExpenseClaim: (claimId: string) => request<ExpenseClaim>(`/manager/expense-claims/${claimId}/approve`, { method: "PATCH" }),
  rejectExpenseClaim: (claimId: string, reason: string) =>
    request<ExpenseClaim>(`/manager/expense-claims/${claimId}/reject`, { method: "PATCH", body: JSON.stringify({ reason }) })
};
