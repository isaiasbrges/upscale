import { PageHeader } from "@/design-system/components/page-header";
import { Card, CardContent } from "@/design-system/components/card";
import { Badge } from "@/design-system/components/badge";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";

export default function RelatoriosPage() {
  const mockReports = [
    { id: 1, campaign: "Black Friday 2024", leads: 1240, revenue: "R$ 45.200,00", status: "Concluída" },
    { id: 2, campaign: "Lançamento Produto X", leads: 850, revenue: "R$ 23.400,00", status: "Ativa" },
    { id: 3, campaign: "Webinar de Vendas", leads: 430, revenue: "R$ 12.800,00", status: "Ativa" },
    { id: 4, campaign: "Promoção de Verão", leads: 2100, revenue: "R$ 89.000,00", status: "Concluída" },
    { id: 5, campaign: "Captação Contínua", leads: 320, revenue: "R$ 5.600,00", status: "Pausada" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Relatórios"
          description="Exporte relatórios detalhados de faturamento e leads."
        />
        <Button variant="secondary" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      <Card variant="elevated">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-surface-elevated text-foreground-secondary border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium">Campanha</th>
                  <th className="px-6 py-4 font-medium">Leads Gerados</th>
                  <th className="px-6 py-4 font-medium">Receita</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mockReports.map((report) => (
                  <tr key={report.id} className="hover:bg-surface-elevated/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground flex items-center gap-3">
                      <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      {report.campaign}
                    </td>
                    <td className="px-6 py-4 text-foreground-secondary">{report.leads.toLocaleString('pt-BR')}</td>
                    <td className="px-6 py-4 font-medium text-success">{report.revenue}</td>
                    <td className="px-6 py-4">
                      <Badge 
                        variant={
                          report.status === "Ativa" ? "success" : 
                          report.status === "Concluída" ? "neutral" : "warning"
                        }
                      >
                        {report.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
