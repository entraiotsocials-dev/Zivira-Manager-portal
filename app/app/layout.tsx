import { CompanyShell } from "@/components/company-shell";

export default function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <CompanyShell>{children}</CompanyShell>;
}
