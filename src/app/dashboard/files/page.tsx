import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/design-system/components/page-header";
import { EmptyState } from "@/design-system/components/empty-state";
import { Card } from "@/design-system/components/card";
import { Folder, FileText, Image as ImageIcon, Video, File } from "lucide-react";
import { requireUser } from "@/lib/auth";

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) return <ImageIcon className="h-10 w-10 text-primary" />;
  if (mimeType.startsWith("video/")) return <Video className="h-10 w-10 text-primary" />;
  if (mimeType.includes("pdf")) return <FileText className="h-10 w-10 text-danger" />;
  return <File className="h-10 w-10 text-foreground-secondary" />;
}

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export default async function FilesPage() {
  const user = await requireUser();
  const files = await prisma.fileAsset.findMany({
    where: { client: { members: { some: { userId: user.id } } } },
    include: { client: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Arquivos"
        description="Gerencie imagens, vídeos e mídias enviadas para a plataforma."
      />

      {files.length === 0 ? (
        <EmptyState
          icon={<Folder className="h-12 w-12" />}
          title="Nenhum arquivo encontrado"
          description="Ainda não há arquivos ou mídias enviadas para a plataforma."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {files.map((file) => (
            <Card key={file.id} className="p-4 flex flex-col gap-3 hover:border-primary/50 transition-colors cursor-pointer group">
              <div className="bg-surface-subtle rounded-lg aspect-video flex items-center justify-center group-hover:bg-surface-elevated transition-colors">
                {getFileIcon(file.mimeType)}
              </div>
              <div className="overflow-hidden">
                <p className="font-medium text-sm text-foreground truncate" title={file.name}>
                  {file.name}
                </p>
                <div className="flex items-center justify-between mt-1 text-xs text-foreground-secondary">
                  <span>{formatBytes(file.size)}</span>
                  <span className="truncate max-w-[100px] text-right" title={file.client.name}>{file.client.name}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
