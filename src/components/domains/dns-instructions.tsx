"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

function CopyValue({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1 font-mono text-xs text-foreground hover:bg-surface-elevated transition-colors"
      title="Copiar"
    >
      {value}
      {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3 text-foreground-muted" />}
    </button>
  );
}

export function DnsInstructions() {
  return (
    <div className="rounded-xl border border-info/20 bg-info/5 p-4 text-sm text-foreground-secondary space-y-3">
      <p className="font-semibold text-foreground">Configuração de DNS</p>
      <p>No provedor onde o domínio foi registrado, crie o registro abaixo conforme o tipo de domínio:</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-background/50 p-3 space-y-1.5">
          <p className="text-xs font-semibold text-foreground-muted uppercase tracking-wide">Subdomínio (ex: oferta.seucliente.com)</p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-foreground-muted">Tipo</span>
            <CopyValue value="CNAME" />
            <span className="text-xs text-foreground-muted">Valor</span>
            <CopyValue value="cname.vercel-dns.com" />
          </div>
        </div>
        <div className="rounded-lg border border-border bg-background/50 p-3 space-y-1.5">
          <p className="text-xs font-semibold text-foreground-muted uppercase tracking-wide">Domínio raiz (ex: seucliente.com)</p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-foreground-muted">Tipo</span>
            <CopyValue value="A" />
            <span className="text-xs text-foreground-muted">Valor</span>
            <CopyValue value="76.76.21.21" />
          </div>
        </div>
      </div>
      <p className="text-xs text-foreground-muted">Depois que o DNS propagar (pode levar alguns minutos a algumas horas), o sistema identifica o hostname automaticamente. Se a Vercel pedir um valor diferente destes ao cadastrar o domínio em Settings → Domains, use o valor exibido lá — ele tem prioridade sobre estes.</p>
    </div>
  );
}
