"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Panel, PanelContent, PanelHeader, PanelFooter } from "@/design-system/components/panel";
import { PageHeader } from "@/design-system/components/page-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getClients, getCampaignsByClient, createScratchCard } from "../actions";

export default function NewScratchCardWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [clients, setClients] = useState<{ id: string, name: string }[]>([]);
  const [campaigns, setCampaigns] = useState<{ id: string, name: string }[]>([]);
  
  const [clientId, setClientId] = useState("");
  const [campaignId, setCampaignId] = useState("");
  const [template, setTemplate] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getClients().then(setClients);
  }, []);

  useEffect(() => {
    if (clientId) {
      getCampaignsByClient(clientId).then(setCampaigns);
      setCampaignId("");
    } else {
      setCampaigns([]);
    }
  }, [clientId]);

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const scratchCard = await createScratchCard({ name, clientId, campaignId, template });
      router.push(`/dashboard/scratch-cards/${scratchCard.id}/edit`);
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    if (step === 1) return !!clientId;
    if (step === 2) return !!campaignId;
    if (step === 3) return !!template;
    if (step === 4) return !!name.trim();
    return false;
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto py-8">
      <PageHeader 
        title="Nova Raspadinha" 
        description="Crie uma nova experiência de raspadinha em poucos passos." 
      />

      <Panel>
        <PanelHeader>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground-muted">Passo {step} de 4</span>
          </div>
        </PanelHeader>
        
        <PanelContent className="min-h-[300px]">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">1. Selecione o Cliente</h2>
              <div className="grid gap-3">
                {clients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => setClientId(client.id)}
                    className={`flex items-center justify-between p-4 rounded-lg border text-left transition-all ${
                      clientId === client.id 
                        ? "border-primary bg-primary/5 ring-1 ring-primary" 
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <span className="font-medium">{client.name}</span>
                  </button>
                ))}
                {clients.length === 0 && (
                  <p className="text-foreground-muted text-sm">Nenhum cliente encontrado.</p>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">2. Selecione a Campanha</h2>
              <div className="grid gap-3">
                {campaigns.map((campaign) => (
                  <button
                    key={campaign.id}
                    onClick={() => setCampaignId(campaign.id)}
                    className={`flex items-center justify-between p-4 rounded-lg border text-left transition-all ${
                      campaignId === campaign.id 
                        ? "border-primary bg-primary/5 ring-1 ring-primary" 
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <span className="font-medium">{campaign.name}</span>
                  </button>
                ))}
                {campaigns.length === 0 && (
                  <p className="text-foreground-muted text-sm">Nenhuma campanha encontrada para este cliente.</p>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">3. Escolha o Template</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setTemplate("vendedor-sincero")}
                  className={`flex flex-col p-4 rounded-lg border text-left transition-all ${
                    template === "vendedor-sincero" 
                      ? "border-primary bg-primary/5 ring-1 ring-primary" 
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="w-full h-32 bg-surface-elevated rounded-md mb-3 flex items-center justify-center">
                    <span className="text-2xl">😎</span>
                  </div>
                  <span className="font-medium">Vendedor Sincero</span>
                  <span className="text-xs text-foreground-muted mt-1">Layout 3x3 com prêmios focados em conversão.</span>
                </button>

                <button
                  disabled
                  className="flex flex-col p-4 rounded-lg border border-border bg-surface text-left opacity-50 cursor-not-allowed"
                >
                  <div className="w-full h-32 bg-surface-elevated rounded-md mb-3 flex items-center justify-center">
                    <span className="text-2xl">⏳</span>
                  </div>
                  <span className="font-medium">Sorteio Dinâmico (Em breve)</span>
                  <span className="text-xs text-foreground-muted mt-1">Roleta de prêmios interativa.</span>
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">4. Nome da Raspadinha</h2>
              <div className="space-y-2">
                <Label htmlFor="name">Nome interno</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Ex: Raspadinha Black Friday"
                />
              </div>
            </div>
          )}
        </PanelContent>

        <PanelFooter className="justify-between">
          <Button 
            variant="ghost" 
            onClick={handleBack} 
            disabled={step === 1 || isSubmitting}
          >
            Voltar
          </Button>
          
          {step < 4 ? (
            <Button 
              onClick={handleNext} 
              disabled={!isStepValid()}
            >
              Próximo
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={!isStepValid() || isSubmitting}
            >
              {isSubmitting ? "Criando..." : "Criar Raspadinha"}
            </Button>
          )}
        </PanelFooter>
      </Panel>
    </div>
  );
}
