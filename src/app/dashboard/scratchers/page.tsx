import { PageHeader } from "@/design-system/components/page-header";
import { EmptyState } from "@/design-system/components/empty-state";
import { Ticket } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/design-system/components/card";
import { Badge } from "@/design-system/components/badge";
import { requireUser } from "@/lib/auth";

export default async function ScratchersPage() {
  const user = await requireUser();
  const scratchPlays = await prisma.scratchPlay.findMany({
    where: { scratchCard: { client: { members: { some: { userId: user.id } } } } },
    take: 50,
    include: { campaign: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Raspadinhas"
        description="Acompanhe as raspadinhas mais recentes jogadas pelos usuários em todas as campanhas."
      />

      {scratchPlays.length === 0 ? (
        <EmptyState
          icon={<Ticket className="h-12 w-12" />}
          title="Nenhuma raspadinha"
          description="Nenhum jogo foi registrado ainda nas campanhas ativas."
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-surface-elevated text-foreground-secondary border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-medium">Campanha</th>
                    <th className="px-6 py-4 font-medium">Visitante</th>
                    <th className="px-6 py-4 font-medium">Resultado</th>
                    <th className="px-6 py-4 font-medium">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {scratchPlays.map((play) => (
                    <tr key={play.id} className="hover:bg-surface-elevated/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">
                        {play.campaign?.name || "Desconhecida"}
                      </td>
                      <td className="px-6 py-4 text-foreground-secondary">{play.visitorId}</td>
                      <td className="px-6 py-4">
                        <Badge variant={play.resultType === "WIN" ? "success" : "neutral"}>
                          {play.resultType === "WIN" ? "Ganhou" : play.resultType === "LOSE" ? "Perdeu" : play.resultType}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-foreground-secondary whitespace-nowrap">
                        {new Date(play.createdAt).toLocaleString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
