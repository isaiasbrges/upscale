"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, Search, User } from "lucide-react";

type HeaderProps = {
  userName?: string | null;
  onMenuToggle?: () => void;
};

export function Header({ userName, onMenuToggle }: HeaderProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const destinations = [
    ["dashboard", "/dashboard"], ["clientes", "/dashboard/clients"],
    ["campanhas", "/dashboard/campaigns"], ["funis", "/dashboard/funnels"],
    ["raspadinhas", "/dashboard/scratch-cards"], ["domínios", "/dashboard/domains"],
    ["templates", "/dashboard/templates"], ["arquivos", "/dashboard/files"],
    ["analytics", "/dashboard/analytics"], ["relatórios", "/dashboard/reports"],
    ["configurações", "/dashboard/settings"],
  ] as const;

  function submitSearch(event: React.FormEvent) {
    event.preventDefault();
    const normalized = query.trim().toLocaleLowerCase("pt-BR");
    const match = destinations.find(([label]) => label.includes(normalized));
    if (match) {
      router.push(match[1]);
      setQuery("");
    }
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full shrink-0 items-center justify-between border-b border-border bg-background/90 px-3 backdrop-blur-md sm:px-4 lg:px-6">
      {/* Global Search (Mock) */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onMenuToggle} aria-label="Abrir menu" className="h-10 w-10 shrink-0 p-0 lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <form onSubmit={submitSearch} className="relative hidden w-full max-w-sm sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
          <Input 
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ir para clientes, campanhas..." 
            aria-label="Navegar pela plataforma"
            className="pl-9 h-9 bg-surface/50 border-transparent focus:border-primary focus:bg-surface"
          />
        </form>
      </div>

      {/* Actions & Profile */}
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
        <div className="flex items-center gap-2 border-l border-border pl-2 sm:gap-3 sm:pl-4">
          {userName && (
            <span className="text-sm font-medium text-foreground-secondary hidden md:block">
              {userName}
            </span>
          )}
          <div className="hidden h-8 w-8 items-center justify-center rounded-full bg-surface-elevated border border-border sm:flex">
            <User className="h-4 w-4 text-foreground-muted" />
          </div>
          <form action={logoutAction}>
            <Button type="submit" variant="ghost" size="sm" className="h-9 px-2 text-danger hover:bg-danger/10 hover:text-danger sm:px-3">
              Sair
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
