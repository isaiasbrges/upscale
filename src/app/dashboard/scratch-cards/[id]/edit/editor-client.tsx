"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/design-system/components/page-header";
import { Panel, PanelContent, PanelHeader } from "@/design-system/components/panel";
import { Badge } from "@/design-system/components/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScratchPrizeForm } from "./prize-form";
import { playScratchCard } from "@/actions/scratch";
import { setWinningPrize, setScratchCardStatusAction, updateScratchCardAction } from "@/actions/scratch-cards";
import { ScratchRenderer } from "@/components/blocks/scratch/scratch-renderer";
import { useRouter } from "next/navigation";

export function ScratchCardEditorClient({ scratchCard, prizes }: { scratchCard: any, prizes: any[] }) {
  const router = useRouter();
  const [name, setName] = useState(scratchCard.name || "Raspadinha Black Friday");

  // Extract custom settings or default
  const settings = typeof scratchCard.settings === "object" && scratchCard.settings ? scratchCard.settings : {};
  const [coverText, setCoverText] = useState(settings.coverText || "Raspadinha da Sorte");
  const [backgroundColor, setBackgroundColor] = useState(settings.backgroundColor || "#f8fafc");
  const [cardColor, setCardColor] = useState(settings.cardColor || "#183cca");

  const [activeTab, setActiveTab] = useState<"settings" | "prizes">("settings");
  const [editingPrize, setEditingPrize] = useState<any>(null);

  const [winningPrizeId, setWinningPrizeId] = useState(scratchCard.winningPrizeId || "");
  const [isUpdatingWinner, setIsUpdatingWinner] = useState(false);
  const [gridItems, setGridItems] = useState<string[] | undefined>();

  const [status, setStatus] = useState<string>(scratchCard.status || "DRAFT");
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleWinnerChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setWinningPrizeId(val);
    setIsUpdatingWinner(true);
    try {
      await setWinningPrize(scratchCard.id, val || null);
    } finally {
      setIsUpdatingWinner(false);
      router.refresh();
    }
  };

  const handleToggleStatus = async () => {
    const next = status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    setIsTogglingStatus(true);
    try {
      await setScratchCardStatusAction(scratchCard.id, next);
      setStatus(next);
    } finally {
      setIsTogglingStatus(false);
      router.refresh();
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    const formData = new FormData();
    formData.set("name", name);
    formData.set("clientId", scratchCard.clientId);
    formData.set("campaignId", scratchCard.campaignId);
    formData.set("template", scratchCard.template || "vendedor-sincero");
    formData.set("status", status);
    formData.set("settings", JSON.stringify({ coverText, backgroundColor, cardColor }));
    const result = await updateScratchCardAction(scratchCard.id, {}, formData);
    setIsSaving(false);
    if (result?.error || result?.fieldErrors) {
      setSaveError(result.error ?? Object.values(result.fieldErrors ?? {})[0]?.[0] ?? "Não foi possível salvar.");
    }
  };

  const handleTestPlay = async () => {
    try {
      // Dummy test visitor
      const result = await playScratchCard(scratchCard.id, "preview-visitor-123");
      setGridItems(result.grid);
      alert("Simulação concluída! Veja as células atualizadas na raspadinha.");
    } catch (e: any) {
      alert("Erro ao jogar: " + e.message);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <PageHeader 
        title="Editor de Raspadinha" 
        description="Personalize a aparência e os detalhes da sua raspadinha."
        className="mb-4 pb-4 shrink-0"
        actions={
          <>
            <Badge variant={status === "PUBLISHED" ? "success" : "neutral"} className="self-center mr-1">
              {status === "PUBLISHED" ? "Publicado" : "Rascunho"}
            </Badge>
            <Button variant="secondary" onClick={handleToggleStatus} disabled={isTogglingStatus}>
              {isTogglingStatus ? "Aguarde..." : status === "PUBLISHED" ? "Tornar rascunho" : "Publicar"}
            </Button>
            <Button variant="secondary" onClick={() => router.back()}>Voltar</Button>
            <Button onClick={handleSave} disabled={isSaving}>{isSaving ? "Salvando..." : "Salvar Alterações"}</Button>
          </>
        }
      />
      {saveError && <p className="text-sm text-danger mb-3">{saveError}</p>}

      {/* Tabs */}
      <div className="flex gap-4 mb-4">
        <Button variant={activeTab === "settings" ? "primary" : "secondary"} onClick={() => setActiveTab("settings")}>Configurações</Button>
        <Button variant={activeTab === "prizes" ? "primary" : "secondary"} onClick={() => setActiveTab("prizes")}>Prêmios</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Left Column */}
        <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto">
          {activeTab === "settings" ? (
            <>
              <Panel>
                <PanelHeader>Informações Básicas</PanelHeader>
                <PanelContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome da Raspadinha</Label>
                    <Input 
                      id="name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="coverText">Texto da Capa</Label>
                    <Input 
                      id="coverText" 
                      value={coverText} 
                      onChange={(e) => setCoverText(e.target.value)} 
                    />
                  </div>
                </PanelContent>
              </Panel>
              
              <Panel>
                <PanelHeader>Propriedades Visuais</PanelHeader>
                <PanelContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bgColor">Cor de Fundo</Label>
                    <div className="flex gap-2">
                      <Input 
                        type="color" 
                        id="bgColor" 
                        value={backgroundColor} 
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-12 h-10 p-1"
                      />
                      <Input 
                        value={backgroundColor} 
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cardColor">Cor dos Cartões</Label>
                    <div className="flex gap-2">
                      <Input 
                        type="color" 
                        id="cardColor" 
                        value={cardColor} 
                        onChange={(e) => setCardColor(e.target.value)}
                        className="w-12 h-10 p-1"
                      />
                      <Input 
                        value={cardColor} 
                        onChange={(e) => setCardColor(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </PanelContent>
              </Panel>
            </>
          ) : (
            <div className="flex flex-col gap-4">
              <Panel>
                <PanelHeader>Configuração de Prêmios</PanelHeader>
                <PanelContent className="space-y-6">
                  
                  {/* Winning Prize Dropdown */}
                  <div className="space-y-2 p-4 bg-muted rounded-md border border-border">
                    <Label htmlFor="winningPrize" className="font-bold">Prêmio Vencedor (Obrigatório para Teste)</Label>
                    <select 
                      id="winningPrize" 
                      className="w-full p-2 rounded-md border bg-background"
                      value={winningPrizeId}
                      onChange={handleWinnerChange}
                      disabled={isUpdatingWinner}
                    >
                      <option value="">-- Selecione um Prêmio --</option>
                      {prizes.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    {isUpdatingWinner && <p className="text-xs text-muted-foreground mt-1">Salvando...</p>}
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-3">Prêmios Criados</h3>
                    {prizes.length === 0 ? (
                      <p className="text-sm text-muted-foreground mb-4">Nenhum prêmio criado ainda.</p>
                    ) : (
                      <div className="space-y-2 mb-4">
                        {prizes.map((p) => (
                          <div key={p.id} className="flex items-center justify-between p-2 border rounded-md">
                            <div>
                              <span className="font-medium text-sm">{p.name}</span>
                              {p.id === winningPrizeId && <span className="ml-2 text-xs bg-primary/20 text-primary px-1 py-0.5 rounded">Vencedor Fixo</span>}
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setEditingPrize(p)}>Editar</Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Create / Edit Form */}
                  {editingPrize ? (
                    <ScratchPrizeForm 
                      campaignId={scratchCard.campaignId} 
                      scratchCardId={scratchCard.id} 
                      initialData={editingPrize} 
                      onCancel={() => setEditingPrize(null)} 
                    />
                  ) : (
                    <ScratchPrizeForm 
                      campaignId={scratchCard.campaignId} 
                      scratchCardId={scratchCard.id} 
                    />
                  )}
                </PanelContent>
              </Panel>
            </div>
          )}
        </div>

        {/* Center Column: Preview */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center bg-surface-elevated border border-border rounded-lg relative overflow-hidden">
          <div className="absolute top-4 left-4 bg-background px-3 py-1 rounded-full text-xs font-medium text-foreground-muted shadow-sm flex items-center gap-2">
            Preview Interativo
            <Button size="sm" variant="secondary" className="h-6 text-xs px-2" onClick={handleTestPlay}>Simular Vitória</Button>
          </div>
          
          <div className="w-full flex justify-center items-center h-full max-h-[800px] overflow-auto">
             <ScratchRenderer
                eyebrow="Preview"
                title={coverText}
                subtitle="Encontre 3 prêmios iguais para ganhar!"
                instruction="Raspe os campos abaixo."
                winText="Parabéns! Você ganhou."
                loseText="Que pena, tente novamente."
                scratchBackground={cardColor}
                externalBackground={backgroundColor}
                borderColor="#e2e8f0"
                borderRadius={12}
                maxWidth={400}
                gridSize="3x3"
                gridGap={8}
                maskColor={cardColor}
                maskTexture=""
                centerIcon="trophy"
                maskOpacity={1}
                previewMode={false}
                gridItems={gridItems}
              />
          </div>
        </div>

      </div>
    </div>
  );
}
