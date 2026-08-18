"use client";

import type { HeroConfig } from "@/lib/blocks/hero";

type HeroBlockProps = {
  config: HeroConfig;
  preview?: boolean;
};

export function HeroBlock({ config, preview = false }: HeroBlockProps) {
  const style: React.CSSProperties = {
    backgroundColor: config.backgroundColor,
    color: config.textColor,
    backgroundImage: config.backgroundImage
      ? `url(${config.backgroundImage})`
      : undefined,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  const renderTitle = () => {
    if (!config.highlightText || !config.title.includes(config.highlightText)) {
      return config.title;
    }
    const parts = config.title.split(config.highlightText);
    return (
      <>
        {parts.map((part, i) => (
          <span key={i}>
            {part}
            {i !== parts.length - 1 && (
              <span className="text-yellow-400">{config.highlightText}</span>
            )}
          </span>
        ))}
      </>
    );
  };

  let embedUrl = config.videoUrl;
  let isEmbed = false;
  
  if (config.videoUrl) {
    const ytMatch = config.videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
    if (ytMatch) {
      isEmbed = true;
      embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&rel=0`;
    } else if (config.videoUrl.includes("vimeo.com")) {
      isEmbed = true;
      const videoId = config.videoUrl.split("vimeo.com/")[1]?.split("?")[0];
      if (videoId) embedUrl = `https://player.vimeo.com/video/${videoId}?autoplay=0`;
    } else if (!config.videoUrl.match(/\.(mp4|webm|ogg)$/i)) {
      isEmbed = true; // generic iframe fallback
    }
  }

  return (
    <section
      className={`relative flex flex-col items-center justify-center px-4 py-12 ${
        preview ? "" : "rounded-xl border border-zinc-800"
      }`}
      style={style}
    >
      {config.backgroundImage && (
        <div className="absolute inset-0 bg-black/60 z-0" />
      )}
      
      <div className="relative z-10 w-full max-w-2xl text-center flex flex-col items-center">
        {config.topBadge && (
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1 text-xs font-bold text-green-500 tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            {config.topBadge.toUpperCase()}
          </div>
        )}

        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-6 leading-tight">
          {renderTitle()}
        </h1>

        {config.alertBadge && (
          <div className="mb-6 inline-flex w-full sm:w-auto justify-center items-center gap-2 rounded-md border border-red-900 bg-red-950/40 px-4 py-2 text-sm font-bold text-zinc-100 shadow-lg shadow-red-900/20">
            <span className="text-red-500">🚨</span>
            <span dangerouslySetInnerHTML={{ __html: config.alertBadge.replace(/R\$ [\d.,]+/g, '<span class="text-white">$&</span>') }} />
          </div>
        )}

        {config.subtitle && (
          <p className="mb-8 text-sm md:text-base font-medium text-zinc-300 max-w-xl mx-auto leading-relaxed">
            {config.subtitle}
          </p>
        )}

        {config.videoUrl && (
          <div className="w-full max-w-[320px] aspect-[9/16] mx-auto mb-8 rounded-2xl overflow-hidden border-4 border-zinc-800/50 shadow-2xl relative bg-zinc-900">
            {isEmbed ? (
              <iframe
                src={embedUrl}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video 
                src={config.videoUrl} 
                controls 
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </div>
        )}

        {config.ctaText && (
          <button
            onClick={() => { if (!preview && config.ctaUrl) window.location.href = config.ctaUrl; }}
            className="w-full max-w-[360px] mx-auto inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-8 py-5 text-lg font-black text-white shadow-[0_0_40px_-10px_rgba(22,163,74,0.5)] transition-all hover:bg-green-500 hover:scale-[1.02] active:scale-95"
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
          >
            <span className="text-yellow-400 text-xl">⚡</span>
            {config.ctaText.toUpperCase()}
          </button>
        )}
      </div>
    </section>
  );
}
