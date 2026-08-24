import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zivira Labs Company Admin",
  description: "Tenant administration portal for Zivira Labs"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
