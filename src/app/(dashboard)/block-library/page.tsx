import { blockLibrary } from "@/blocks/registry";

export default function BlockLibraryPage() {
  return (
    <main className="min-h-screen bg-neutral-950 p-8 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="text-xs font-bold uppercase tracking-[.2em] text-violet-400">Upscale</div>
        <h1 className="mt-2 text-4xl font-black">Biblioteca de Blocos</h1>
        <p className="mt-3 text-white/45">Todos os modelos registrados no Builder.</p>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {blockLibrary.map((block) => (
            <div key={block.type} className="rounded-2xl border border-white/10 bg-white/[.03] p-5">
              <div className="text-xs font-bold uppercase tracking-wider text-violet-400">{block.category}</div>
              <div className="mt-2 text-xl font-black">{block.name}</div>
              <div className="mt-2 text-sm leading-6 text-white/45">{block.description}</div>
              <div className="mt-4 text-xs text-white/25">{block.type} · v{block.version}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
