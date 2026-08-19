"use client";

import { useEffect, useState } from "react";
import { playScratchCard } from "@/actions/scratch";
import { ScratchRenderer } from "./scratch-renderer";

const VISITOR_ID_KEY = "upscale_visitor_id";

function getVisitorId() {
  let id = window.localStorage.getItem(VISITOR_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(VISITOR_ID_KEY, id);
  }
  return id;
}

type Settings = {
  coverText?: string;
  backgroundColor?: string;
  cardColor?: string;
};

type PlayResult = {
  resultType: string;
  grid: string[];
  prize: { name: string; description: string | null; imageUrl: string | null } | null;
};

export function PublicScratchPlay({
  scratchCardId,
  settings,
  nextStepPath,
}: {
  scratchCardId: string;
  settings: Settings;
  nextStepPath: string | null;
}) {
  const [result, setResult] = useState<PlayResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    playScratchCard(scratchCardId, getVisitorId())
      .then((r) => setResult(r))
      .catch((e) => setError(e instanceof Error ? e.message : "Não foi possível carregar a raspadinha."));
  }, [scratchCardId]);

  if (error) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-black text-center p-6">
        <p className="text-white/70">{error}</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-black">
        <div className="h-8 w-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
      </div>
    );
  }

  return (
    <ScratchRenderer
      eyebrow="Raspe e descubra"
      title={settings.coverText || "Raspadinha da Sorte"}
      subtitle="Encontre 3 símbolos iguais para ganhar!"
      instruction="Raspe os campos abaixo."
      winText="Você ganhou!"
      loseText="Não foi dessa vez"
      scratchBackground={settings.cardColor || "#183cca"}
      externalBackground={settings.backgroundColor || "#f8fafc"}
      borderColor="#e2e8f0"
      borderRadius={12}
      maxWidth={400}
      gridSize="3x3"
      gridGap={8}
      maskColor={settings.cardColor || "#183cca"}
      maskTexture=""
      centerIcon="trophy"
      maskOpacity={1}
      previewMode={false}
      gridItems={result.grid}
      resultWon={result.resultType === "WIN"}
      resultPrize={result.prize}
      continueHref={nextStepPath}
    />
  );
}
