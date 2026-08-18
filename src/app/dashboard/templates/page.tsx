import { PageHeader } from "@/design-system/components/page-header";
import { Card } from "@/design-system/components/card";
import { Badge } from "@/design-system/components/badge";
import { Button } from "@/components/ui/button";
import { LayoutTemplate, Eye, Plus } from "lucide-react";

const fakeTemplates = [
  {
    id: "1",
    name: "Black Friday Explosão",
    category: "Sazonal",
    description: "Template focado em alta conversão para ofertas de Black Friday com cronômetro de escassez.",
    color: "bg-danger/10 text-danger",
    isNew: true,
  },
  {
    id: "2",
    name: "Sorteio de Natal",
    category: "Sorteios",
    description: "Ideal para captação de leads em época natalina com design festivo e roleta de prêmios.",
    color: "bg-success/10 text-success",
    isNew: false,
  },
  {
    id: "3",
    name: "Lançamento de Infoproduto",
    category: "Lançamentos",
    description: "Página de captura clássica com vídeo de vendas e formulário otimizado.",
    color: "bg-primary/10 text-primary",
    isNew: false,
  },
  {
    id: "4",
    name: "Webinário Automático",
    category: "Webinário",
    description: "Layout limpo focado em inscrições para webinários com prova social em destaque.",
    color: "bg-info/10 text-info",
    isNew: true,
  },
];

export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Templates"
        description="Crie campanhas rapidamente usando nossa biblioteca de templates pré-configurados."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {fakeTemplates.map((template) => (
          <Card key={template.id} className="overflow-hidden flex flex-col group p-0">
            <div className={`h-32 ${template.color} flex items-center justify-center relative`}>
              <LayoutTemplate className="h-12 w-12 opacity-50" />
              {template.isNew && (
                <div className="absolute top-3 right-3">
                  <Badge variant="info">Novo</Badge>
                </div>
              )}
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg text-foreground leading-tight">{template.name}</h3>
              </div>
              <Badge variant="neutral" className="w-fit mb-3">{template.category}</Badge>
              <p className="text-sm text-foreground-secondary flex-1 mb-6">
                {template.description}
              </p>
              
              <div className="flex gap-3 mt-auto">
                <Button variant="secondary" className="flex-1" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button variant="primary" className="flex-1" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Usar
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
