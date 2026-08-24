import { DoctorManager } from "@/components/doctor-manager";
import { PageHeader } from "@/components/page-components";

export default function DoctorsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Doctor CRM"
        title="Doctor universe"
        description="Maintain the central doctor database with specialty, category, territory, and MR mapping."
      />
      <DoctorManager />
    </>
  );
}
