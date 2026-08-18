import type { BoosterComparisonConfig } from "@/lib/blocks/booster-comparison";

export function BoosterComparisonBlock({ config }: { config: BoosterComparisonConfig }) {
  return (
    <div className="bg-[#000000] px-[16px] pt-[22px] w-full">
      <div className="max-w-[480px] mx-auto w-full">
        <p className="font-['Oswald',sans-serif] text-[10px] font-semibold uppercase tracking-[3px] text-[#666666] text-center mb-[5px]">Por que 190X muda tudo</p>
        <h2 className="font-['Oswald',sans-serif] text-[clamp(22px,6.5vw,34px)] font-bold uppercase leading-[1.06] text-center mb-[16px] text-white">
          Uma chance torce.<br/><em className="text-[#FFD600] not-italic">{config.title || '190X chances cercam.'}</em>
        </h2>

        <div className="mb-[14px] bg-[#0A0A0A] border border-[#2A2A2A] rounded-[14px] overflow-hidden">
          <div className="grid grid-cols-2 border-b border-[#2A2A2A]">
            <div className="p-[12px] text-center bg-[rgba(198,40,40,.04)]">
              <div className="font-['Oswald',sans-serif] text-[10px] font-bold uppercase tracking-[1.5px] mb-[6px] text-[#E53935]">❌ Sem Booster</div>
              <div className="font-['Oswald',sans-serif] text-[clamp(28px,8vw,38px)] font-bold leading-[1] text-[rgba(198,40,40,.4)]">{config.normalText || '1X'}</div>
              <div className="text-[11px] text-[#888] mt-[4px] leading-[1.35]">1 posição em jogo<br/><strong className="text-[#ccc]">tudo depende dela</strong></div>
            </div>
            <div className="p-[12px] text-center bg-[rgba(46,204,46,.04)]">
              <div className="font-['Oswald',sans-serif] text-[10px] font-bold uppercase tracking-[1.5px] mb-[6px] text-[#19A85A]">✅ Com Booster</div>
              <div className="font-['Oswald',sans-serif] text-[clamp(28px,8vw,38px)] font-bold leading-[1] text-[#FFD600]">{config.boosterText || '190X'}</div>
              <div className="text-[11px] text-[#888] mt-[4px] leading-[1.35]">190 posições em jogo<br/><strong className="text-[#ccc]">muito mais presença</strong></div>
            </div>
          </div>
          <div className="p-[12px_14px]">
            <div className="text-[13.5px] text-[#C5C5C5] leading-[1.6] text-center">
              O prêmio não terá apenas uma oportunidade de encontrar você. Com o Booster, terá <em className="text-[#FFD600] font-bold not-italic">190X chances</em> — <strong className="text-white">nos 20 veículos 0KM e na Casa 100% Mobiliada.</strong>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-[5px] mb-[6px]">
          <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-[10px] p-[12px_6px] text-center">
            <div className="text-[22px] mb-[5px]">🎯</div>
            <div className="font-['Oswald',sans-serif] text-[clamp(18px,5vw,24px)] font-bold text-[#FFD600] leading-[1] mb-[3px]">190X</div>
            <div className="text-[9.5px] text-[#888] leading-[1.3]">posições trabalhando por você</div>
          </div>
          <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-[10px] p-[12px_6px] text-center">
            <div className="text-[22px] mb-[5px]">💰</div>
            <div className="font-['Oswald',sans-serif] text-[clamp(18px,5vw,24px)] font-bold text-[#FFD600] leading-[1] mb-[3px]">20</div>
            <div className="text-[9.5px] text-[#888] leading-[1.3]">veículos 0KM premiados</div>
          </div>
          <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-[10px] p-[12px_6px] text-center">
            <div className="text-[22px] mb-[5px]">⚡</div>
            <div className="font-['Oswald',sans-serif] text-[clamp(18px,5vw,24px)] font-bold text-[#FFD600] leading-[1] mb-[3px]">1 clique</div>
            <div className="text-[9.5px] text-[#888] leading-[1.3]">ativação simples e automática</div>
          </div>
        </div>
      </div>
    </div>
  );
}
