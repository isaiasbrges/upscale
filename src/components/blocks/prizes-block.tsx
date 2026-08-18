import type { PrizesConfig } from "@/lib/blocks/prizes";

export function PrizesBlock({ config, preview = false }: { config: PrizesConfig; preview?: boolean }) {
  const { title, subtitle, items = [], columns = 3 } = config;

  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  }[columns] || "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className="w-full bg-zinc-950 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          {title && <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>}
          {subtitle && <p className="text-lg text-zinc-400">{subtitle}</p>}
        </div>

        <div className={`grid ${gridCols} gap-6`}>
          {items.map((item, index) => (
            <div 
              key={index} 
              className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors group"
            >
              {item.imageUrl ? (
                <div className="w-full h-48 overflow-hidden bg-zinc-800">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
              ) : (
                <div className="w-full h-48 bg-zinc-800 flex items-center justify-center">
                  <svg className="w-12 h-12 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                {item.description && <p className="text-zinc-400 text-sm leading-relaxed">{item.description}</p>}
              </div>
            </div>
          ))}
        </div>
        
        {items.length === 0 && (
          <p className="text-center text-zinc-500">No prizes added yet.</p>
        )}
      </div>
    </div>
  );
}
