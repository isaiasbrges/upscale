"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MoreHorizontal, ExternalLink, Pencil, Copy, Eye, Archive, ArchiveRestore, Trash2 } from "lucide-react";
import { deleteFunnelAction, duplicateFunnelAction, setFunnelStatusAction } from "@/actions/funnels";

export function FunnelRowMenu({
  funnelId,
  status,
  previewHref,
}: {
  funnelId: string;
  status: string;
  previewHref: string | null;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function withPending(fn: () => Promise<void>) {
    setPending(true);
    try {
      await fn();
      router.refresh();
    } finally {
      setPending(false);
      setOpen(false);
    }
  }

  return (
    <div ref={ref} className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={pending}
        className="flex h-8 w-8 items-center justify-center rounded-md text-foreground-muted hover:bg-surface-elevated hover:text-foreground transition-colors disabled:opacity-50"
        aria-label="Mais ações"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-1 w-48 rounded-md border border-border bg-surface-elevated shadow-floating py-1">
          <Link
            href={`/dashboard/funnels/${funnelId}`}
            className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-surface"
            onClick={() => setOpen(false)}
          >
            <ExternalLink className="h-4 w-4" /> Abrir
          </Link>
          <Link
            href={`/dashboard/funnels/${funnelId}?tab=configuracoes`}
            className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-surface"
            onClick={() => setOpen(false)}
          >
            <Pencil className="h-4 w-4" /> Editar
          </Link>
          <button
            type="button"
            disabled={pending}
            onClick={() => withPending(async () => { await duplicateFunnelAction(funnelId); })}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-surface text-left disabled:opacity-50"
          >
            <Copy className="h-4 w-4" /> Duplicar
          </button>
          {previewHref ? (
            <a
              href={previewHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-surface"
              onClick={() => setOpen(false)}
            >
              <Eye className="h-4 w-4" /> Preview
            </a>
          ) : (
            <span className="flex items-center gap-2 px-3 py-2 text-sm text-foreground-muted cursor-not-allowed">
              <Eye className="h-4 w-4" /> Preview
            </span>
          )}
          <button
            type="button"
            disabled={pending}
            onClick={() => withPending(async () => {
              await setFunnelStatusAction(funnelId, status === "ARCHIVED" ? "DRAFT" : "ARCHIVED");
            })}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-surface text-left disabled:opacity-50"
          >
            {status === "ARCHIVED" ? <ArchiveRestore className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
            {status === "ARCHIVED" ? "Restaurar" : "Arquivar"}
          </button>
          <div className="my-1 border-t border-border" />
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              if (window.confirm("Tem certeza que deseja excluir este funil? Essa ação não pode ser desfeita.")) {
                withPending(async () => { await deleteFunnelAction(funnelId); });
              }
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-danger/10 text-left disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" /> Excluir
          </button>
        </div>
      )}
    </div>
  );
}
