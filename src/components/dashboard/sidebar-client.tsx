"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Megaphone, 
  Workflow, 
  Ticket,
  Globe,
  LayoutTemplate,
  Folder,
  BarChart3,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    label: "Geral",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Operação",
    items: [
      { href: "/dashboard/clients", label: "Clientes", icon: Users },
      { href: "/dashboard/campaigns", label: "Campanhas", icon: Megaphone },
      { href: "/dashboard/funnels", label: "Funis", icon: Workflow },
      { href: "/dashboard/scratch-cards", label: "Raspadinhas", icon: Ticket },
    ],
  },
  {
    label: "Ativos",
    items: [
      { href: "/dashboard/domains", label: "Domínios", icon: Globe },
      { href: "/dashboard/templates", label: "Templates", icon: LayoutTemplate },
      { href: "/dashboard/files", label: "Arquivos", icon: Folder },
    ],
  },
  {
    label: "Análise",
    items: [
      { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
      { href: "/dashboard/reports", label: "Relatórios", icon: FileText },
    ],
  },
  {
    label: "Sistema",
    items: [
      { href: "/dashboard/settings", label: "Configurações", icon: Settings },
    ],
  }
];

export function SidebarClient({ mobileOpen = false, onMobileClose }: { mobileOpen?: boolean; onMobileClose?: () => void }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (<>
    {mobileOpen && <button className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden" aria-label="Fechar menu" onClick={onMobileClose} />}
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-[min(86vw,300px)] flex-col border-r border-border bg-background shadow-2xl transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:shadow-none",
        mobileOpen ? "translate-x-0" : "-translate-x-full",
        isCollapsed ? "lg:w-[72px]" : "lg:w-[260px]"
      )}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 hidden h-6 w-6 items-center justify-center rounded-full border border-border bg-surface text-foreground-muted hover:text-foreground shadow-sm hover:shadow-md transition-all z-10 lg:flex"
      >
        {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>

      {/* Brand Header */}
      <div className={cn("flex h-16 shrink-0 items-center border-b border-border overflow-hidden", isCollapsed ? "lg:px-0 lg:justify-center" : "px-6")}> 
        {isCollapsed && !mobileOpen ? (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-background font-bold">
            U
          </div>
        ) : (
          <img src="/logo.png" alt="UpScale Funnels" className="h-7 w-auto object-contain" />
        )}
        <button onClick={onMobileClose} className="ml-auto flex h-10 w-10 items-center justify-center rounded-md text-foreground-muted hover:bg-surface lg:hidden" aria-label="Fechar menu"><X className="h-5 w-5" /></button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-6">
        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="flex flex-col space-y-1">
            {(!isCollapsed || mobileOpen) && group.label !== "Geral" && (
              <span className="px-3 text-xs font-semibold uppercase tracking-wider text-foreground-muted mb-1 mt-2">
                {group.label}
              </span>
            )}
            {isCollapsed && !mobileOpen && group.label !== "Geral" && (
              <div className="h-4 w-full flex items-center justify-center mt-2 mb-1">
                <div className="h-[1px] w-6 bg-border" />
              </div>
            )}
            
            {group.items.map((item) => {
              // Active if exact match, or if it's a subpath (e.g. /dashboard/clients matches /dashboard/clients/new)
              // But handle /dashboard carefully so it doesn't match everything
              const isActive = item.href === "/dashboard" 
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href) && item.href !== "#";

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                    isCollapsed && !mobileOpen ? "justify-center" : "gap-3",
                    isActive
                      ? "text-primary bg-[rgba(24,60,202,.08)]"
                      : "text-foreground-secondary hover:bg-[rgba(24,60,202,.08)] hover:text-primary"
                  )}
                  title={isCollapsed ? item.label : undefined}
                  onClick={onMobileClose}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-md bg-primary" />
                  )}
                  <item.icon
                    className={cn(
                      "shrink-0 transition-colors",
                      isCollapsed && !mobileOpen ? "h-5 w-5" : "h-4 w-4",
                      isActive ? "text-primary" : "text-foreground-muted group-hover:text-foreground"
                    )}
                  />
                  {(!isCollapsed || mobileOpen) && (
                    <span className="truncate">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  </>
  );
}
