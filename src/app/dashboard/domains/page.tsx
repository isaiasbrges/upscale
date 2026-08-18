import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/design-system/components/page-header";
import { Badge } from "@/design-system/components/badge";
import { Globe, Trash2, ExternalLink } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { DomainForm } from "@/components/domains/domain-form";
import { deleteDomainAction } from "@/actions/domains";
import { Button } from "@/components/ui/button";

export default async function DomainsPage() {
  const user = await requireUser();
  const domains = await prisma.domain.findMany({
    where: { client: { members: { some: { userId: user.id } } } },
    include: { client: true, campaign: true },
    orderBy: { createdAt: "desc" }
  });
  const clients = await prisma.client.findMany({
    where: { members: { some: { userId: user.id } } },
    select: { id: true, name: true, campaigns: { where: { status: "PUBLISHED" }, select: { id: true, name: true }, orderBy: { name: "asc" } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Domínios"
        description="Gerencie domínios personalizados e certificados SSL globais."
      />
      <DomainForm clients={clients} />
      <div className="rounded-xl border border-info/20 bg-info/5 p-4 text-sm text-foreground-secondary"><strong className="text-foreground">Configuração de DNS:</strong> crie um registro CNAME apontando o domínio/subdomínio para o endereço da plataforma. Depois que o DNS propagar, o sistema identifica o hostname automaticamente.</div>
      <div className="grid gap-4 md:grid-cols-2">{domains.map(domain=><article key={domain.id} className="rounded-xl border border-border bg-surface p-5">
        <div className="flex items-start justify-between gap-3"><div className="min-w-0"><div className="flex items-center gap-2"><Globe className="h-4 w-4 text-primary"/><h3 className="truncate font-semibold">{domain.hostname}</h3></div><p className="mt-2 text-sm text-foreground-secondary">{domain.client.name} · {domain.campaign?.name || "Primeira campanha publicada"}</p></div><Badge variant="success">Ativo</Badge></div>
        <div className="mt-4 flex flex-wrap gap-2"><a href={`https://${domain.hostname}`} target="_blank" rel="noreferrer"><Button size="sm" variant="secondary"><ExternalLink className="mr-2 h-4 w-4"/>Abrir</Button></a><form action={deleteDomainAction.bind(null, domain.id)}><Button size="sm" variant="danger"><Trash2 className="mr-2 h-4 w-4"/>Remover</Button></form></div>
      </article>)}</div>
      {domains.length === 0 && <div className="rounded-xl border border-dashed border-border p-10 text-center text-foreground-muted"><Globe className="mx-auto mb-3 h-10 w-10"/>Nenhum domínio conectado.</div>}
    </div>
  );
}
