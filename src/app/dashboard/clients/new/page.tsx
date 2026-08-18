import Link from "next/link";
import { ClientForm } from "@/components/clients/client-form";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/design-system/components/page-header";
import { ChevronLeft } from "lucide-react";

export default function NewClientPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Novo cliente"
        description="Crie um novo cliente para gerenciar suas campanhas de forma isolada na plataforma."
        breadcrumb={
          <Link href="/dashboard/clients" className="flex items-center text-foreground-muted hover:text-foreground hover:underline transition-colors w-fit">
            <ChevronLeft className="h-4 w-4 mr-1" /> Voltar para clientes
          </Link>
        }
      />
      <ClientForm mode="create" />
    </div>
  );
}
