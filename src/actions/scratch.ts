"use server";

import { randomInt } from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const playSchema = z.object({
  scratchCardId: z.string().min(1),
  visitorId: z.string().trim().min(8).max(128),
});

function pick<T>(items: T[]): T {
  return items[randomInt(items.length)];
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function parseGrid(grid: string): string[] {
  try {
    const parsed = JSON.parse(grid);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export async function playScratchCard(
  scratchCardId: string,
  visitorId: string | undefined,
) {
  const parsed = playSchema.safeParse({ scratchCardId, visitorId });
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Dados de jogada inválidos.");
  }
  const input = parsed.data;

  return prisma.$transaction(async (tx) => {
    const existing = await tx.scratchPlay.findUnique({
      where: {
        scratchCardId_visitorId: {
          scratchCardId: input.scratchCardId,
          visitorId: input.visitorId,
        },
      },
      include: { scratchCard: { include: { prizes: true } } },
    });

    if (existing) {
      return {
        id: existing.id,
        resultType: existing.resultType,
        grid: parseGrid(existing.grid),
        prize: existing.scratchCard?.prizes.find(
          (prize) => prize.id === existing.winningPrizeId,
        ) ?? null,
      };
    }

    const card = await tx.scratchCard.findUnique({
      where: { id: input.scratchCardId },
      include: { prizes: { where: { active: true } } },
    });

    if (!card || card.status !== "PUBLISHED") {
      throw new Error("Raspadinha indisponível.");
    }

    const available = card.prizes.filter(
      (prize) => prize.quantityUsed < prize.quantity,
    );
    const configuredWinner = available.find(
      (prize) => prize.id === card.winningPrizeId,
    );
    const probability = configuredWinner
      ? Math.max(0, Math.min(100, configuredWinner.probability))
      : 0;
    const won = configuredWinner
      ? randomInt(1_000_000) < Math.round(probability * 10_000)
      : false;

    const fallbackIcons = ["lose-1", "lose-2", "lose-3", "lose-4"];
    const losingIcons = available
      .filter((prize) => prize.id !== configuredWinner?.id)
      .map((prize) => prize.icon || prize.imageUrl)
      .filter((icon): icon is string => Boolean(icon));
    const pool = losingIcons.length > 0 ? losingIcons : fallbackIcons;
    // Prêmios sem icon/imageUrl cadastrado ainda precisam de um símbolo para
    // desenhar a grade vencedora — sem isso a jogada era registrada como WIN
    // no banco (estoque decrementado) mas a grade renderizava um padrão de
    // derrota, já que não havia ícone nenhum para repetir 3x.
    const winnerIcon = configuredWinner?.icon || configuredWinner?.imageUrl || "🏆";
    const grid = won && configuredWinner
      ? shuffle([
          winnerIcon, winnerIcon, winnerIcon,
          ...Array.from({ length: 6 }, () => pick(pool)),
        ])
      : shuffle(Array.from({ length: 9 }, (_, index) => pool[index % pool.length]));

    if (won && configuredWinner) {
      await tx.prize.update({
        where: { id: configuredWinner.id },
        data: { quantityUsed: { increment: 1 } },
      });
    }

    const play = await tx.scratchPlay.create({
      data: {
        scratchCardId: card.id,
        campaignId: card.campaignId,
        visitorId: input.visitorId,
        winningPrizeId: won ? configuredWinner?.id : null,
        resultType: won ? "WIN" : "LOSE",
        grid: JSON.stringify(grid),
      },
    });

    return {
      id: play.id,
      resultType: play.resultType,
      grid,
      prize: won ? configuredWinner ?? null : null,
    };
  });
}
