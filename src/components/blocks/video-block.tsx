import type { VideoConfig } from "@/lib/blocks/video";

export function VideoBlock({ config, preview = false }: { config: VideoConfig; preview?: boolean }) {
  const { videoUrl, title, aspectRatio = "16:9", autoplay } = config;

  let embedUrl = videoUrl;
  let isEmbed = false;

  if (videoUrl) {
    const ytMatch = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
    if (ytMatch) {
      isEmbed = true;
      embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=${autoplay ? 1 : 0}&rel=0`;
    } else if (videoUrl.includes("vimeo.com")) {
      isEmbed = true;
      const videoId = videoUrl.split("vimeo.com/")[1]?.split("?")[0];
      if (videoId) embedUrl = `https://player.vimeo.com/video/${videoId}?autoplay=${autoplay ? 1 : 0}`;
    } else if (!videoUrl.match(/\.(mp4|webm|ogg)$/i)) {
      isEmbed = true; // generic fallback
    }
  }

  const isDirectVideo = videoUrl?.match(/\.(mp4|webm|ogg)$/i) !== null;

  const aspectRatioPadding = {
    "16:9": "56.25%",
    "4:3": "75%",
    "1:1": "100%",
  }[aspectRatio] || "56.25%";

  return (
    <div className="w-full bg-zinc-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {title && <h2 className="text-2xl font-bold text-white mb-6 text-center">{title}</h2>}
        
        <div 
          className="relative w-full rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800"
          style={{ paddingBottom: aspectRatioPadding }}
        >
          {!videoUrl ? (
            <div className="absolute inset-0 flex items-center justify-center text-zinc-500">
              <p>Enter a video URL to display here</p>
            </div>
          ) : isDirectVideo ? (
            <video 
              src={videoUrl} 
              autoPlay={autoplay} 
              controls 
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : isEmbed ? (
            <iframe
              src={embedUrl}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-zinc-500">
              <p>Unsupported video format.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
