import type { BoosterHeroConfig } from "@/lib/blocks/booster-hero";

export function BoosterHeroBlock({ config }: { config: BoosterHeroConfig }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes blk { 0%,100%{opacity:1} 50%{opacity:.1} }
        @keyframes shimmer { to {background-position:200% center;} }
        @keyframes playP { 0%{box-shadow:0 0 0 0 rgba(46,204,46,.5);} 70%{box-shadow:0 0 0 18px rgba(46,204,46,0);} 100%{box-shadow:0 0 0 0 rgba(46,204,46,0);} }
        @keyframes scan { to {background-position:200% center;} }
      `}} />
      <section className="bg-[#000000] text-center px-[16px] pt-[14px] pb-[10px] mx-auto w-full max-w-[480px]">
        <div className="inline-flex items-center gap-[5px] border border-[rgba(46,204,46,.25)] bg-[rgba(26,138,26,.07)] rounded-[20px] px-[10px] py-[3px] mb-[8px]">
          <span className="w-[5px] h-[5px] rounded-full bg-[#19A85A]" style={{ animation: 'blk .8s ease-in-out infinite' }}></span>
          <span className="text-[9px] font-bold uppercase tracking-[1.5px] text-[#19A85A]">{config.topBadge || 'Vantagem revelada após sua compra'}</span>
        </div>

        <h1 className="font-['Oswald',sans-serif] text-[clamp(26px,8vw,38px)] sm:text-[clamp(28px,8.5vw,50px)] font-bold uppercase leading-[0.98] mb-[7px]">
          <span className="block text-white">Seu Booster foi liberado.</span>
          <span className="block text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #F5C518, #fffde7, #F5C518)', backgroundSize: '200% auto', animation: 'shimmer 2.8s linear infinite' }}>
            {config.title || 'Entre 190X mais forte.'}
          </span>
        </h1>

        <p className="text-[13px] text-[#888] leading-[1.35] max-w-[360px] mx-auto mb-[9px]">
          Veja por que <strong className="text-[#ccc]">190X chances</strong> mudam sua força pra encontrar uma das 20 cotas premiadas com moto 0KM e disputar a Casa 100% Mobiliada.
        </p>

        <div className="w-full mx-auto mb-[9px] rounded-[10px] overflow-hidden border-2 border-[#1A2200] bg-[#0a0a0a] aspect-video relative flex flex-col items-center justify-center gap-[8px]" style={{ background: 'linear-gradient(160deg,#080F00,#0D1800)' }}>
          {config.videoUrl && (
             <iframe src={config.videoUrl} className="absolute inset-0 w-full h-full border-none z-10" allowFullScreen></iframe>
          )}
          <div className="w-[48px] h-[48px] rounded-full flex items-center justify-center text-[18px] relative z-20" style={{ background: 'linear-gradient(135deg, #00E028, #008516)', animation: 'playP 2s ease-in-out infinite' }}>
            ▶
          </div>
          <span className="font-['Oswald',sans-serif] text-[10px] font-semibold uppercase tracking-[1.5px] text-[#555] relative z-20">Toque para ver o vídeo</span>
        </div>

        <p className="text-[10.5px] text-[#727272] text-center mt-[7px] mb-[0]">
          <strong className="text-[#9b9b9b]">Assista ao vídeo acima</strong> e veja como funciona. Você decide somente depois de entender.
        </p>

        <div className="relative overflow-hidden rounded-[12px] p-[10px_12px] mt-[10px] mb-[0] text-center" style={{ background: 'linear-gradient(135deg,rgba(255,214,0,.07),rgba(46,204,46,.03))', border: '1.5px solid rgba(255,214,0,.28)' }}>
          <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, #0B6E3A, #FFD600, #19A85A)', backgroundSize: '200% auto', animation: 'scan 2s linear infinite' }}></div>
          <div className="text-[24px] mb-[2px]">🏠</div>
          <div className="text-[8px] text-[#666666] uppercase tracking-[2px] mb-[2px]">Ao ativar o Booster, você multiplica 190X chances para</div>
          <div className="font-['Oswald',sans-serif] text-[clamp(17px,5vw,22px)] font-bold text-[#FFD600] leading-[1.1] mb-[4px]">Casa 100% Mobiliada + 20 Veículos 0KM</div>
          <div className="flex flex-wrap gap-[4px] justify-center mt-[5px]">
            <span className="text-[9px] font-semibold text-[#19A85A] bg-[rgba(46,204,46,.08)] border border-[rgba(46,204,46,.18)] rounded-[5px] px-[5px] py-[2px]">🏠 Casa 100% Mobiliada</span>
            <span className="text-[9px] font-semibold text-[#19A85A] bg-[rgba(46,204,46,.08)] border border-[rgba(46,204,46,.18)] rounded-[5px] px-[5px] py-[2px]">🏍️ 10x Avelloz 0KM</span>
            <span className="text-[9px] font-semibold text-[#19A85A] bg-[rgba(46,204,46,.08)] border border-[rgba(46,204,46,.18)] rounded-[5px] px-[5px] py-[2px]">🛵 7x Honda Start</span>
            <span className="text-[9px] font-semibold text-[#19A85A] bg-[rgba(46,204,46,.08)] border border-[rgba(46,204,46,.18)] rounded-[5px] px-[5px] py-[2px]">🛵 3x Honda Biz</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-3 gap-[1px] bg-[#242424] border-t border-b border-[#242424] w-full">
        <div className="bg-[#0e0e0e] py-[10px] px-[5px] text-center">
          <strong className="block font-['Oswald',sans-serif] text-[14px] text-[#FFD600] leading-[1.1]">190X</strong>
          <span className="block text-[8px] text-[#888] uppercase tracking-[0.7px] mt-[3px]">chances</span>
        </div>
        <div className="bg-[#0e0e0e] py-[10px] px-[5px] text-center">
          <strong className="block font-['Oswald',sans-serif] text-[14px] text-[#FFD600] leading-[1.1]">20 veículos 0KM</strong>
          <span className="block text-[8px] text-[#888] uppercase tracking-[0.7px] mt-[3px]">em prêmios</span>
        </div>
        <div className="bg-[#0e0e0e] py-[10px] px-[5px] text-center">
          <strong className="block font-['Oswald',sans-serif] text-[14px] text-[#FFD600] leading-[1.1]">1 ativação</strong>
          <span className="block text-[8px] text-[#888] uppercase tracking-[0.7px] mt-[3px]">nesta etapa</span>
        </div>
      </div>
    </>
  );
}
