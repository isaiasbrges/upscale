import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ScratchCardEditorClient } from "./editor-client";

export default async function ScratchCardEditPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;

  const scratchCard = await prisma.scratchCard.findUnique({
    where: { id },
  });

  if (!scratchCard) {
    notFound();
  }

  // Ensure user has access
  const member = await prisma.clientMember.findUnique({
    where: { userId_clientId: { userId: user.id, clientId: scratchCard.clientId } },
  });
  if (!member) {
    notFound();
  }

  const prizes = await prisma.prize.findMany({
    where: { scratchCardId: id },
    orderBy: { createdAt: "asc" },
  });

  return <ScratchCardEditorClient scratchCard={scratchCard} prizes={prizes} />;
}
