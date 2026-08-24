export * from "./zivira-tree";

export type PortalKind = "SUPER_ADMIN" | "COMPANY_ADMIN" | "FIELD_FORCE";

export type TenantStatus = "SETUP" | "SANDBOX" | "PILOT" | "LIVE" | "SUSPENDED";

export type SubscriptionPlan = "SANDBOX" | "GROWTH" | "ENTERPRISE";

export type Tenant = {
  id: string;
  name: string;
  slug: string;
  status: TenantStatus;
  subscriptionPlan: SubscriptionPlan;
  licenseLimit: number;
  activeUsers: number;
  enabledModuleKeys: string[];
  storageUsedMb: number;
  createdAt: string;
  updatedAt: string;
};

export type PlatformModule = {
  id: string;
  key: string;
  name: string;
  description: string;
  category: "CORE" | "FIELD" | "AI" | "REPORTING" | "ADMIN" | "COMPLIANCE";
  defaultEnabled: boolean;
  featureKeys: string[];
  createdAt: string;
  updatedAt: string;
};

export type FeatureFlag = {
  id: string;
  key: string;
  name: string;
  description: string;
  enabledGlobally: boolean;
  enabledTenantSlugs: string[];
  rolloutStage: "INTERNAL" | "BETA" | "GA" | "PAUSED";
  createdAt: string;
  updatedAt: string;
};

export type AuthUser = {
  id: string;
  username: string;
  displayName: string;
  role: "SUPER_ADMIN" | "COMPANY_ADMIN" | "NBH" | "ABM" | "MR";
  tenantSlug?: string;
  portal: PortalKind;
};

export type Employee = {
  id: string;
  tenantSlug: string;
  name: string;
  employeeCode: string;
  designation: string;
  division: string;
  reportingManager?: string;
  territory: string;
  role: "NBH" | "BH" | "RBM" | "ZBM" | "ABM" | "SR_MR" | "MR";
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
};

export type Doctor = {
  id: string;
  tenantSlug: string;
  name: string;
  specialty: string;
  category: "A" | "B" | "C" | "D";
  state: string;
  city: string;
  territory: string;
  mappedEmployeeCode?: string;
  mappedEmployeeName?: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
};

export type Product = {
  id: string;
  tenantSlug: string;
  name: string;
  code: string;
  category: string;
  division: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
};

export type Dcr = {
  id: string;
  tenantSlug: string;
  employeeCode: string;
  employeeName?: string;
  doctorId?: string | Doctor;
  visitDate: string;
  productsDetailed: string[];
  notes?: string;
  status: "DRAFT" | "SUBMITTED" | "MANAGER_APPROVED" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
};

export type Attendance = {
  id: string;
  tenantSlug: string;
  employeeCode: string;
  attendanceDate: string;
  status: "PRESENT" | "ABSENT" | "LEAVE";
  checkInAt?: string;
  checkOutAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type CompanyDashboard = {
  metrics: {
    employeeCount: number;
    doctorCount: number;
    activeProductCount: number;
    dcrSubmittedToday: number;
    attendanceMarkedToday: number;
  };
  recentDoctors: Doctor[];
  recentEmployees: Employee[];
};

export type FieldDashboard = {
  profile: Employee;
  today: {
    plannedVisits: number;
    completedDcrs: number;
    attendanceMarked: boolean;
  };
  doctors: Doctor[];
  recentDcrs: Dcr[];
};

export type ApiEnvelope<T> = {
  data: T;
};

// PRD 12.3A — productCode/batchNumber added; product picker only, no free text.
// Zivira_Project_Basic.docx Topic 1 — priority is per-product, not per-visit.
export type SampleGiven = { productName: string; productCode?: string; qty: number; batchNumber?: string; priority?: "HIGH" | "MEDIUM" | "LOW" };
// PRD 12.3B — itemType/valueRs added; itemType feeds the MCI gift-value compliance alert.
export type InputGiven  = { inputName: string; itemType?: string; qty: number; valueRs?: number };

export type JointWork = {
  accompanyingManager?: string;
  jointWorkType?: "FIELD_WORK" | "ON_JOB_TRAINING" | "PERFORMANCE_REVIEW";
  managerObservations?: string;
};

export type GpsLocation = { latitude?: number; longitude?: number; label?: string };

// Extended DCR (replaces old Dcr)
export type DcrExtended = Dcr & {
  callSession?: "MORNING" | "AFTERNOON" | "EVENING";
  callTime?: string;
  samplesGiven?: SampleGiven[];
  inputsGiven?: InputGiven[];
  jointWork?: JointWork;
  managerApprovedBy?: string;
  managerApprovedByName?: string;
  managerApprovedAt?: string;
  adminVisibleAt?: string;
  overVisitFlag?: boolean;
  overVisitCount?: number | null;
  // ── Zivira_Project_Basic.docx Topic 1 — DCR Management Module ──────────
  checkInTime?: string;
  checkOutTime?: string;
  gpsLocation?: GpsLocation;
  hospitalClinic?: string;
  visitDurationMinutes?: number;
  promotionalMaterialsShared?: string[];
  visualAidUsed?: boolean;
  prescriptionInterest?: "HIGH" | "MEDIUM" | "LOW" | "NONE";
  productFeedback?: string;
  competitorMentioned?: string;
  followUpRequired?: boolean;
  followUpDate?: string;
};

export type ManagerDashboard = {
  manager: Employee;
  team: Employee[];
  stats: { totalDcrs: number; pendingApproval: number; approvedToday: number; teamSize: number };
};

// ── Zivira_Project_Basic.docx Topic 2 — Attendance & Compliance Analytics
// Topic 4 — Chronic Defaulter Detection ─────────────────────────────────
export type ComplianceWarningLevel = "NONE" | "LOW" | "MEDIUM" | "HIGH";
export type EmployeeComplianceRow = {
  employeeCode: string;
  employeeName?: string;
  role?: string;
  submittedToday: boolean;
  pendingDCR: boolean;
  missedYesterday: boolean;
  missedThisWeek: number;
  missedThisMonth: number;
  expectedThisMonth: number;
  submittedThisMonth: number;
  compliancePercent: number;
  missedLast30Days: number;
  chronicDefaulter: boolean;
  warningLevel: ComplianceWarningLevel;
  salaryHold: boolean;
};
export type ComplianceSummary = {
  submittedToday: number;
  pendingDCR: number;
  missedYesterday: number;
  chronicDefaulters: number;
  avgCompliancePercent: number;
};
export type ComplianceResponse = { data: EmployeeComplianceRow[]; month: string; summary: ComplianceSummary };

// ── Zivira_Project_Basic.docx Topic 3 — Salary Integration Engine ──────
export type PayrollWorkflowStatus = "RELEASED" | "HOLD" | "EXPLANATION_SUBMITTED";
export type PayrollStatusRecord = {
  id: string;
  employeeCode: string;
  employeeName?: string;
  role?: string;
  month: string;
  status: PayrollWorkflowStatus;
  holdReason?: string | null;
  missedDaysSnapshot: number;
  employeeExplanation?: string | null;
  explanationSubmittedAt?: string | null;
  managerApprovedBy?: string | null;
  managerApprovedByName?: string | null;
  managerApprovedAt?: string | null;
  releasedAt?: string | null;
};
export type PayrollSummary = { onHold: number; pendingApproval: number; released: number };
export type PayrollResponse = { data: PayrollStatusRecord[]; month: string; summary: PayrollSummary };

// ── Zivira_Project_Basic.docx Topic 5 — Representative vs Manager Analysis
// Topic 6 — Joint Field Work Analysis ───────────────────────────────────
export type RepAnalysisRow = {
  employeeCode: string;
  employeeName?: string;
  reportingManager?: string | null;
  reportingManagerName?: string;
  doctorsVisited: number;
  totalVisits: number;
  jointVisits: number;
  jointVisitPercent: number;
};
export type TeamJointWorkSummary = {
  teamSize: number;
  totalJointCalls: number;
  avgJointCallsPerRep: number;
  jointCallPercent: number;
};
export type RepManagerTeamResponse = { data: RepAnalysisRow[]; month: string; teamSummary: TeamJointWorkSummary };

// ── PRD 12.2 — Visit Coverage grid ──────────────────────────────────────
export type VisitSummaryRow = {
  doctorId: string;
  doctorName: string;
  specialty?: string;
  visitCount: number;
  lastVisitDate: string | null;
  overVisitFlag: boolean;
  badge: "GREEN" | "YELLOW" | "RED";
};

export type VisitCoverageGrid = {
  month: string;
  mrs: { employeeCode: string; name: string }[];
  rows: {
    doctorId: string;
    doctorName: string;
    mappedEmployeeCode?: string;
    mappedEmployeeName?: string;
    cells: { employeeCode: string; visitCount: number }[];
  }[];
};

// ── PRD 12.5 — GST Multi-Branch ─────────────────────────────────────────
export type CompanyBranch = {
  id: string;
  tenantSlug: string;
  branchName: string;
  gstNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isHeadquarters: boolean;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
};

// ── PRD 12.1 — Tour Plan (cross-manager void/reassign) ──────────────────
export type TourPlanLocation = { date: string; area: string; town: string; purpose?: string };

export type TourPlanStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED" | "VOIDED";

export type TourPlan = {
  id: string;
  tenantSlug: string;
  tpId: string;
  employeeCode: string;
  employeeName?: string;
  primaryManager: string;
  assignedManager: string;
  month: string;
  locations: TourPlanLocation[];
  status: TourPlanStatus;
  rejectReason?: string;
  approvedBy?: string;
  approvedAt?: string;
  voidedBy?: string;
  voidedAt?: string;
  voidReason?: string;
  reassignedToTpId?: string;
  parentTpId?: string;
  gstBranchCode?: string;
  gstBranchName?: string;
  assignedManagerName?: string;
  voidedByName?: string;
  createdAt: string;
  updatedAt: string;
};

// ── PRD 12.5 follow-up — Expense Claims (GST Branch → claims linkage) ──
export type ExpenseClaimCategory = "Travel" | "Lodging" | "Food" | "Local Conveyance" | "Other";
export type ExpenseClaimStatus = "SUBMITTED" | "APPROVED" | "REJECTED";

export type ExpenseClaim = {
  id: string;
  tenantSlug: string;
  claimId: string;
  employeeCode: string;
  employeeName?: string;
  assignedManager: string;
  assignedManagerName?: string;
  tpId: string;
  month: string;
  gstBranchCode?: string;
  gstBranchName?: string;
  category: ExpenseClaimCategory;
  expenseDate: string;
  amountRs: number;
  description?: string;
  status: ExpenseClaimStatus;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectReason?: string;
  rejectedAt?: string;
  createdAt: string;
  updatedAt: string;
};
