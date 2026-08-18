"use client";

import { useState } from "react";
import { PageHeader } from "@/design-system/components/page-header";
import { Panel, PanelHeader, PanelContent, PanelFooter } from "@/design-system/components/panel";
import { Card, CardContent } from "@/design-system/components/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/design-system/components/badge";
import { User, Link as LinkIcon, Users, Save, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState<"perfil" | "integracoes" | "equipe">("perfil");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configurações"
        description="Ajustes da conta, faturamento e integrações do sistema."
      />

      <div className="flex items-center gap-2 border-b border-border pb-px">
        <button
          onClick={() => setActiveTab("perfil")}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
            activeTab === "perfil" ? "border-primary text-foreground" : "border-transparent text-foreground-secondary hover:text-foreground"
          )}
        >
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Perfil
          </div>
        </button>
        <button
          onClick={() => setActiveTab("integracoes")}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
            activeTab === "integracoes" ? "border-primary text-foreground" : "border-transparent text-foreground-secondary hover:text-foreground"
          )}
        >
          <div className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            Integrações
          </div>
        </button>
        <button
          onClick={() => setActiveTab("equipe")}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
            activeTab === "equipe" ? "border-primary text-foreground" : "border-transparent text-foreground-secondary hover:text-foreground"
          )}
        >
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Equipe
          </div>
        </button>
      </div>

      <div className="mt-6">
        {activeTab === "perfil" && (
          <Panel>
            <PanelHeader>
              <h3 className="font-semibold text-lg">Informações Pessoais</h3>
            </PanelHeader>
            <PanelContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome Completo</label>
                  <input type="text" defaultValue="João Silva" className="w-full flex h-10 rounded-md border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">E-mail</label>
                  <input type="email" defaultValue="joao@exemplo.com" className="w-full flex h-10 rounded-md border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Empresa</label>
                  <input type="text" defaultValue="UpScale Inc." className="w-full flex h-10 rounded-md border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                </div>
              </div>
            </PanelContent>
            <PanelFooter className="justify-end">
              <Button className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Salvar Alterações
              </Button>
            </PanelFooter>
          </Panel>
        )}

        {activeTab === "integracoes" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card variant="elevated" className="flex flex-col">
              <CardContent className="flex-1 p-6 flex flex-col items-start gap-4">
                <div className="h-12 w-12 bg-[#E1306C]/10 text-[#E1306C] rounded-lg flex items-center justify-center font-bold text-xl">
                  IG
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold">Instagram Ads</h4>
                  <p className="text-sm text-foreground-secondary">Sincronize campanhas e leads diretamente do Instagram.</p>
                </div>
                <Badge variant="success" className="mt-auto">Conectado</Badge>
              </CardContent>
            </Card>

            <Card variant="default" className="flex flex-col border-dashed bg-transparent">
              <CardContent className="flex-1 p-6 flex flex-col items-center justify-center text-center gap-2 min-h-[200px]">
                <div className="h-10 w-10 rounded-full bg-surface-elevated border border-border flex items-center justify-center mb-2 text-foreground-secondary">
                  <Plus className="h-5 w-5" />
                </div>
                <h4 className="font-semibold text-foreground">Nova Integração</h4>
                <p className="text-sm text-foreground-secondary">Adicione uma nova ferramenta ao seu ambiente.</p>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "equipe" && (
          <Panel>
            <PanelHeader>
              <h3 className="font-semibold text-lg">Membros da Equipe</h3>
              <Button size="sm" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Convidar
              </Button>
            </PanelHeader>
            <PanelContent className="p-0">
              <div className="divide-y divide-border">
                <div className="flex items-center justify-between p-4 hover:bg-surface-elevated/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary text-background flex items-center justify-center font-bold">
                      JS
                    </div>
                    <div>
                      <p className="font-medium">João Silva (Você)</p>
                      <p className="text-sm text-foreground-secondary">joao@exemplo.com</p>
                    </div>
                  </div>
                  <Badge variant="neutral">Admin</Badge>
                </div>
                <div className="flex items-center justify-between p-4 hover:bg-surface-elevated/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-surface-elevated border border-border flex items-center justify-center font-bold text-foreground-secondary">
                      MA
                    </div>
                    <div>
                      <p className="font-medium">Maria Almeida</p>
                      <p className="text-sm text-foreground-secondary">maria@exemplo.com</p>
                    </div>
                  </div>
                  <Badge variant="neutral">Editor</Badge>
                </div>
              </div>
            </PanelContent>
          </Panel>
        )}
      </div>
    </div>
  );
}
