"use client";

import { useRouter } from "next/navigation";

type ClientOption = {
  id: string;
  name: string;
};

type ClientFilterProps = {
  clients: ClientOption[];
  selectedClientId: string | null;
};

export function ClientFilter({ clients, selectedClientId }: ClientFilterProps) {
  const router = useRouter();

  return (
    <select
      value={selectedClientId ?? ""}
      onChange={(e) => {
        const value = e.target.value;
        router.push(value ? `/dashboard?client=${value}` : "/dashboard");
      }}
      className="h-10 rounded-md border border-border bg-surface px-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
    >
      <option value="">Todos os clientes</option>
      {clients.map((client) => (
        <option key={client.id} value={client.id}>
          {client.name}
        </option>
      ))}
    </select>
  );
}
