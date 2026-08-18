import type { BoosterCotasConfig } from "@/lib/blocks/booster-cotas";

export function BoosterCotasBlock({ config }: { config: BoosterCotasConfig }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes blk { 0%,100%{opacity:1} 50%{opacity:.1} }
      `}} />
      <section className="bg-[#000000] px-[16px] py-[22px] w-full">
        <div className="max-w-[480px] mx-auto w-full">
          <p className="font-['Oswald',sans-serif] text-[10px] font-semibold uppercase tracking-[3px] text-[#666666] text-center mb-[5px]">O que está em jogo</p>
          <h2 className="font-['Oswald',sans-serif] text-[clamp(21px,6.5vw,36px)] font-bold uppercase leading-[1.06] text-center mb-[12px] text-white">
            {config.title || 'Prêmios'} <br/><em className="text-[#FFD600] not-italic">disponíveis agora.</em>
          </h2>

          <div className="flex items-center gap-[7px] bg-[rgba(198,40,40,.06)] border border-[rgba(239,83,80,.15)] rounded-[8px] py-[8px] px-[11px] mb-[14px]">
            <div className="w-[6px] h-[6px] rounded-full bg-[#EF5350] shrink-0" style={{ animation: 'blk .7s ease-in-out infinite' }}></div>
            <div className="text-[12px] text-[#EF5350] font-semibold leading-[1.35]">
              Você já entrou na campanha. <span className="text-white">Agora pode transformar uma participação comum em <strong className="text-white font-bold">190X chances</strong> a seu favor.</span>
            </div>
          </div>

          <div>
            {config.items && config.items.length > 0 ? config.items.map((item, i) => (
               <div key={i} className="flex items-center gap-[10px] py-[10px] px-[12px] rounded-[10px] mb-[6px] border-[1.5px] border-[#2A2A2A] relative overflow-hidden bg-[#0A0A0A]">
                 <div className="text-[24px] shrink-0">✨</div>
                 <div className="flex-1 min-w-0">
                   <div className="font-['Oswald',sans-serif] text-[clamp(13px,3.8vw,15px)] font-bold uppercase text-white leading-[1.2]">{item}</div>
                 </div>
                 <div className="shrink-0 font-['Oswald',sans-serif] text-[9.5px] font-bold uppercase px-[7px] py-[3px] rounded-[5px] bg-[rgba(46,204,46,.1)] text-[#19A85A] border border-[rgba(46,204,46,.22)]">Disponível</div>
               </div>
            )) : (
              <>
                <div className="flex items-center gap-[10px] py-[10px] px-[12px] rounded-[10px] mb-[6px] border-[1.5px] border-[#2A2A2A] relative overflow-hidden bg-[#0A0A0A]">
                  <div className="text-[24px] shrink-0">🏍️</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[8.5px] text-[#666666] font-semibold tracking-[0.6px] mb-[2px] overflow-hidden text-ellipsis whitespace-nowrap">#0960958 · #7102302 · #7411327 · #0107400</div>
                    <div className="font-['Oswald',sans-serif] text-[clamp(13px,3.8vw,15px)] font-bold uppercase text-white leading-[1.2]">10x Avelloz 0KM 2026</div>
                    <div className="text-[10.5px] mt-[1px] text-[#19A85A] font-bold">Cotas premiadas disponíveis — encontrou, levou</div>
                  </div>
                  <div className="shrink-0 font-['Oswald',sans-serif] text-[9.5px] font-bold uppercase px-[7px] py-[3px] rounded-[5px] bg-[rgba(46,204,46,.1)] text-[#19A85A] border border-[rgba(46,204,46,.22)]">Disponível</div>
                </div>

                <div className="flex items-center gap-[10px] py-[10px] px-[12px] rounded-[10px] mb-[6px] border-[1.5px] border-[#2A2A2A] relative overflow-hidden bg-[#0A0A0A]">
                  <div className="text-[24px] shrink-0">💰</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[8.5px] text-[#666666] font-semibold tracking-[0.6px] mb-[2px] overflow-hidden text-ellipsis whitespace-nowrap">Roletas e Raspadinhas Instantâneas</div>
                    <div className="font-['Oswald',sans-serif] text-[clamp(13px,3.8vw,15px)] font-bold uppercase text-white leading-[1.2]">PIX de R$ 100</div>
                    <div className="text-[10.5px] mt-[1px] text-[#FFD600] font-bold">Centenas disponíveis durante toda a campanha</div>
                  </div>
                  <div className="shrink-0 font-['Oswald',sans-serif] text-[9.5px] font-bold uppercase px-[7px] py-[3px] rounded-[5px] bg-[rgba(46,204,46,.1)] text-[#19A85A] border border-[rgba(46,204,46,.22)]">Disponível</div>
                </div>

                <div className="flex items-center gap-[10px] py-[10px] px-[12px] rounded-[10px] mb-[6px] border-[1.5px] border-[rgba(255,214,0,.35)] relative overflow-hidden bg-gradient-to-br from-[#100C00] to-[#181200]">
                  <div className="text-[24px] shrink-0">🏠</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[8.5px] text-[#666666] font-semibold tracking-[0.6px] mb-[2px] overflow-hidden text-ellipsis whitespace-nowrap">Prêmio Principal — Sorteio em breve</div>
                    <div className="font-['Oswald',sans-serif] text-[clamp(13px,3.8vw,15px)] font-bold uppercase text-white leading-[1.2]">Casa 100% Mobiliada</div>
                    <div className="text-[11px] mt-[1px] text-[#FFD600] font-semibold">7ª Edição — entregue pronta pra morar</div>
                  </div>
                  <div className="shrink-0 font-['Oswald',sans-serif] text-[9.5px] font-bold uppercase px-[7px] py-[3px] rounded-[5px] bg-[rgba(255,214,0,.09)] text-[#FFD600] border border-[rgba(255,214,0,.22)]">Em jogo</div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="bg-[#000000] px-[16px] py-[14px] w-full">
        <div className="max-w-[480px] mx-auto p-[14px_14px_14px_16px] rounded-[14px] bg-[#0A0A0A] border border-[rgba(255,255,255,.06)] border-l-[3px] border-l-[#FFD600] text-left">
          <p className="text-[13px] text-[#9A9A9A] leading-[1.55] m-0">
            <strong className="text-white text-[15px] font-bold block mb-[2px]">Você já está no jogo.</strong>
            Agora escolha: apenas torcer, ou colocar <em className="text-[#FFD600] font-bold not-italic">190X chances</em> trabalhando por você.
          </p>
        </div>
      </section>
    </>
  );
}
