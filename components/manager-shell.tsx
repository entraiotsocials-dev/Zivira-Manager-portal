"use client";
import clsx from "clsx";
import { BarChart3, Bell, Grid3x3, Home, LogOut, MapPinned, Moon, PanelLeftClose, PanelLeftOpen, Receipt, ShieldAlert, Sun, Users, UsersRound } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiClient, clearToken } from "@/lib/api-client";

const nav = [
  { href: "/manager/dashboard",      title: "Dashboard",       icon: Home },
  { href: "/manager/dcrs",           title: "Team DCRs",        icon: BarChart3 },
  { href: "/manager/tour-plans",     title: "Tour Plans",       icon: MapPinned },
  { href: "/manager/expense-claims", title: "Expense Claims",   icon: Receipt },
  { href: "/manager/visit-coverage", title: "Visit Coverage",   icon: Grid3x3 },
  { href: "/manager/compliance",     title: "Compliance",       icon: ShieldAlert },
  { href: "/manager/rep-analysis",   title: "Rep Analysis",     icon: UsersRound },
  { href: "/manager/team",           title: "My Team",          icon: Users }
];

export function ManagerShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [theme, setTheme]       = useState<"light"|"dark">("light");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [managerName, setManagerName] = useState<string | null>(null);
  // Item 3 — a lightweight unread indicator on the topbar bell: true when
  // GET /manager/notices has anything newer than the last time this
  // manager opened /manager/notifications. Polled independently of the
  // notifications page itself so the dot shows up from anywhere in the app.
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    if (pathname === "/manager/login") return;
    if (pathname === "/manager/notifications") {
      window.localStorage.setItem("zivira.manager.notices.lastSeen", new Date().toISOString());
      setHasUnread(false);
      return;
    }
    let cancelled = false;
    const check = () => {
      apiClient.notices().then((r) => {
        if (cancelled || !r.data.length) return;
        const lastSeen = window.localStorage.getItem("zivira.manager.notices.lastSeen");
        const unread = !lastSeen || new Date(r.data[0].createdAt).getTime() > new Date(lastSeen).getTime();
        setHasUnread(unread);
      }).catch(() => {});
    };
    check();
    const interval = setInterval(check, 20000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [pathname]);

  useEffect(() => {
    const t = window.localStorage.getItem("zivira.manager.theme");
    if (t === "dark" || t === "light") setTheme(t);
    const s = window.localStorage.getItem("zivira.manager.sidebar");
    if (s === "closed") setSidebarOpen(false);
  }, []);

  // BUG FIXED: the topbar badge just said the literal word "Manager" — it
  // never showed who was actually signed in. Pull the real name from the
  // same dashboard call every manager page already makes.
  useEffect(() => {
    if (pathname === "/manager/login") return;
    apiClient.dashboard().then((r) => setManagerName(r.data.manager.name)).catch(() => {});
  }, [pathname]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("zivira.manager.theme", theme);
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem("zivira.manager.sidebar", sidebarOpen ? "open" : "closed");
  }, [sidebarOpen]);

  if (pathname === "/manager/login") return <>{children}</>;

  function signOut() { clearToken(); router.push("/manager/login"); }

  return (
    <div className="app-shell">
      <aside className={clsx("sidebar", !sidebarOpen && "sidebar-collapsed")}>
        <Link className="brand" href="/manager/dashboard">
          <span className="brand-mark">Z</span>
          {sidebarOpen && <span><p className="brand-title">Zivira Labs</p><p className="brand-subtitle">Manager Portal</p></span>}
        </Link>
        <nav>
          {nav.map(item => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link className={clsx("nav-link", active && "nav-link-active")} href={item.href} key={item.href} title={!sidebarOpen ? item.title : undefined}>
                <Icon size={18} />{sidebarOpen && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>
        {sidebarOpen && (
          <div className="theme-panel">
            <p className="nav-group-title">Theme</p>
            <div className="theme-toggle">
              <button className={clsx("theme-option", theme === "light" && "theme-option-active")} onClick={() => setTheme("light")} type="button"><Sun size={16} /> Light</button>
              <button className={clsx("theme-option", theme === "dark"  && "theme-option-active")} onClick={() => setTheme("dark")}  type="button"><Moon size={16} /> Dark</button>
            </div>
          </div>
        )}
        <button className="nav-signout" onClick={signOut} type="button" title={!sidebarOpen ? "Sign out" : undefined}>
          <LogOut size={16} />{sidebarOpen && "Sign out"}
        </button>
      </aside>
      <main className="main">
        <header className="topbar">
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <button className="button button-secondary sidebar-toggle-btn" onClick={() => setSidebarOpen(o => !o)} type="button" title={sidebarOpen ? "Collapse" : "Expand"}>
              {sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
            </button>
            <div><h1 className="topbar-title">Manager Portal</h1><p className="topbar-subtitle">Zivira Labs · Field Management</p></div>
          </div>
          <div className="topbar-actions" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link
              href="/manager/notifications"
              className="button button-secondary"
              style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
              title="Notifications"
            >
              <Bell size={16} />
              {hasUnread && (
                <span
                  style={{
                    position: "absolute", top: -2, right: -2, width: 8, height: 8,
                    borderRadius: "50%", background: "var(--red, #e53e3e)"
                  }}
                />
              )}
            </Link>
            <span className="badge"><Users size={15} /> {managerName ?? "Manager"}</span>
          </div>
        </header>
        <div className="content">{children}</div>
      </main>
    </div>
  );
}
