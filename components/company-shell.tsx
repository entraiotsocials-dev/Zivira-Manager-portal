"use client";

import clsx from "clsx";
import { Bell, LogOut, Moon, PanelLeftClose, PanelLeftOpen, Search, Sun, UserCircle } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { companyNav } from "@/lib/company-data";
import { clearToken } from "@/lib/api-client";

export function CompanyShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("zivira.admin.theme");
    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme);
    }
    const savedSidebar = window.localStorage.getItem("zivira.admin.sidebar");
    if (savedSidebar === "closed") setSidebarOpen(false);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("zivira.admin.theme", theme);
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem("zivira.admin.sidebar", sidebarOpen ? "open" : "closed");
  }, [sidebarOpen]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  function signOut() {
    clearToken();
    router.push("/admin/login");
  }

  return (
    <div className="app-shell">
      <aside className={clsx("sidebar", !sidebarOpen && "sidebar-collapsed")}>
        <Link className="brand" href="/admin/home">
          <span className="brand-mark">Z</span>
          {sidebarOpen && (
            <span>
              <p className="brand-title">Zivira Labs</p>
              <p className="brand-subtitle">Admin Portal</p>
            </span>
          )}
        </Link>

        <nav aria-label="Company Admin navigation">
          {companyNav.map((group) => (
            <div className="nav-group" key={group.title}>
              {sidebarOpen && <p className="nav-group-title">{group.title}</p>}
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    className={clsx("nav-link", active && "nav-link-active")}
                    href={item.href}
                    key={item.href}
                    title={!sidebarOpen ? item.title : undefined}
                  >
                    <Icon size={18} />
                    {sidebarOpen && <span>{item.title}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {sidebarOpen && (
          <div className="theme-panel">
            <p className="nav-group-title">Theme</p>
            <div className="theme-toggle" aria-label="Theme mode">
              <button
                className={clsx("theme-option", theme === "light" && "theme-option-active")}
                onClick={() => setTheme("light")}
                type="button"
              >
                <Sun size={16} />
                Light
              </button>
              <button
                className={clsx("theme-option", theme === "dark" && "theme-option-active")}
                onClick={() => setTheme("dark")}
                type="button"
              >
                <Moon size={16} />
                Dark
              </button>
            </div>
          </div>
        )}

        <button className="nav-signout" onClick={signOut} type="button" title={!sidebarOpen ? "Sign out" : undefined}>
          <LogOut size={16} />
          {sidebarOpen && "Sign out"}
        </button>
      </aside>

      <main className="main">
        <header className="topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              className="button button-secondary sidebar-toggle-btn"
              onClick={() => setSidebarOpen((o) => !o)}
              title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              type="button"
              aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
            </button>
            <div>
              <h1>Tenant Operations</h1>
              <p>Zivira Labs · platform tabs</p>
            </div>
          </div>
          <div className="topbar-actions">
            <button className="button button-secondary" title="Search" suppressHydrationWarning>
              <Search size={17} />
            </button>
            <button className="button button-secondary" title="Notifications" suppressHydrationWarning>
              <Bell size={17} />
            </button>
            <span className="badge">
              <UserCircle size={16} /> adminzivira
            </span>
          </div>
        </header>
        <div className="content">{children}</div>
      </main>
    </div>
  );
}
