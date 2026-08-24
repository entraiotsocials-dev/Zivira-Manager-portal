import { EmployeeManager } from "@/components/employee-manager";
import { PageHeader } from "@/components/page-components";

export default function EmployeesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Organization"
        title="Employee management"
        description="Create and manage employee records, reporting roles, divisions, and territory assignments for the tenant."
      />
      <EmployeeManager />
    </>
  );
}
