import type { BoosterOfferConfig } from "@/lib/blocks/booster-offer";

export function BoosterOfferBlock({ config }: { config: BoosterOfferConfig }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes sh { 40%,100%{left:160%;} }
        @keyframes glGreen { 0%,100%{box-shadow:0 6px 30px rgba(0,224,40,.45);} 50%{box-shadow:0 6px 55px rgba(0,224,40,.8),0 0 0 8px rgba(0,224,40,.12);} }
      `}} />
      <section className="bg-[#000000] px-[16px] pt-[21px] w-full" id="revelacao" style={{ scrollMarginTop: '12px' }}>
        <div className="max-w-[480px] mx-auto w-full">
          <p className="font-['Oswald',sans-serif] text-[11px] font-semibold uppercase tracking-[3px] text-[#666666] text-center mb-[6px]">Você revelou. Agora falta ativar.</p>
          <h2 className="font-['Oswald',sans-serif] text-[clamp(20px,6vw,30px)] font-bold uppercase leading-[1.1] text-center text-white mb-[16px]">
            Mude o tamanho<br/>da sua <em className="text-[#FFD600] not-italic">participação.</em>
          </h2>

          <div className="max-w-[460px] mx-auto flex items-center justify-center gap-[8px] p-[10px_12px] border border-[rgba(255,214,0,.22)] rounded-[10px] bg-[rgba(255,214,0,.055)] text-[12px] text-[#bbb] text-center mb-[12px]">
            ⏳ <span>Seu Booster fica reservado por <strong className="text-[#FFD600]">05:00</strong> nesta compra.</span>
          </div>

          <div className="max-w-[460px] mx-auto mb-[14px] bg-[rgba(198,40,40,.05)] border border-[rgba(239,83,80,.18)] rounded-[10px] p-[12px_14px] text-center">
            <p className="text-[13px] text-[#C5C5C5] leading-[1.6] m-0">
              ⚠️ Esta condição foi liberada <em className="text-[#EF5350] font-bold not-italic">na etapa pós-compra.</em><br/>
              <strong className="text-white">Não abandone a vantagem que você acabou de revelar.</strong>
            </p>
          </div>

          <div className="max-w-[460px] mx-auto border-2 border-[#19A85A] rounded-[18px] p-[22px_18px] relative overflow-hidden shadow-[0_0_50px_rgba(46,204,46,.08)]" style={{ background: 'linear-gradient(150deg,#060F00,#0C1800)' }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% -10%,rgba(46,204,46,.06),transparent 55%)' }}></div>
            <div className="absolute top-[14px] right-[-26px] bg-[#FFD600] text-black font-['Oswald',sans-serif] text-[9px] font-bold uppercase tracking-[1px] px-[36px] py-[4px] rotate-[35deg]">
              EXCLUSIVO
            </div>

            <ul className="list-none mb-[18px] p-0">
              {config.includes && config.includes.length > 0 ? config.includes.map((item, i) => (
                <li key={i} className="flex items-center gap-[8px] py-[7px] border-b border-[rgba(255,255,255,.04)] text-[13px] text-[#C5C5C5] leading-[1.3] last:border-b-0">
                  <span className="text-[#19A85A] text-[14px] shrink-0">✅</span>
                  <span>{item}</span>
                </li>
              )) : (
                <>
                  <li className="flex items-center gap-[8px] py-[7px] border-b border-[rgba(255,255,255,.04)] text-[13px] text-[#C5C5C5] leading-[1.3]">
                    <span className="text-[#19A85A] text-[14px] shrink-0">✅</span>
                    <span><strong className="text-white">190X mais chances</strong> nas 10 cotas premiadas do Avelloz 0KM 2026</span>
                  </li>
                  <li className="flex items-center gap-[8px] py-[7px] border-b border-[rgba(255,255,255,.04)] text-[13px] text-[#C5C5C5] leading-[1.3]">
                    <span className="text-[#19A85A] text-[14px] shrink-0">✅</span>
                    <span><strong className="text-white">190X mais chances</strong> nas 10 cotas de Honda Start e Honda Biz 0KM</span>
                  </li>
                  <li className="flex items-center gap-[8px] py-[7px] border-b border-[rgba(255,255,255,.04)] text-[13px] text-[#C5C5C5] leading-[1.3]">
                    <span className="text-[#19A85A] text-[14px] shrink-0">✅</span>
                    <span><strong className="text-white">190X mais chances</strong> nas Roletas e Raspadinhas de R$ 100</span>
                  </li>
                  <li className="flex items-center gap-[8px] py-[7px] text-[13px] text-[#C5C5C5] leading-[1.3]">
                    <span className="text-[#19A85A] text-[14px] shrink-0">✅</span>
                    <span><strong className="text-white">Posição fortíssima</strong> na disputa pela Casa 100% Mobiliada</span>
                  </li>
                </>
              )}
            </ul>

            <div className="text-center mb-[16px] relative z-10">
              <div className="text-[12px] text-[#666666] uppercase tracking-[1px] mb-[6px]">Ative seu Booster 190X por</div>
              <div className="font-['Oswald',sans-serif] text-[48px] sm:text-[clamp(54px,14vw,70px)] font-bold text-[#FFD600] leading-[1] tracking-[-1px]" style={{ textShadow: '0 0 40px rgba(255,214,0,.2)' }}>
                {config.priceText || 'R$ 90'}
              </div>
              <div className="text-[12px] text-[#666666] mt-[5px] leading-[1.5]">Uma única ativação para colocar <strong className="text-[#19A85A]">190X chances trabalhando por você</strong> até o fim da campanha.</div>
              <div className="flex items-center justify-center gap-[6px] mt-[8px] text-[12px] text-[#888]">
                💡 Você já está na disputa. <em className="text-[#FFD600] font-bold not-italic">Agora decida com quanta força quer entrar.</em>
              </div>
            </div>

            <a href={(config as any).checkoutUrl || '#'} className="relative block w-full border-none cursor-pointer text-white font-['Oswald',sans-serif] text-[clamp(17px,5vw,22px)] font-bold uppercase p-[15px_16px] rounded-[12px] overflow-hidden text-center no-underline z-10" style={{ background: 'linear-gradient(135deg,#00E028,#008516)', animation: 'glGreen 2.5s ease-in-out infinite' }}>
              <span className="relative z-10">🚀 ATIVAR MEU BOOSTER 190X AGORA</span>
              <div className="absolute top-0 left-[-110%] w-[50%] h-full z-0" style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.28),transparent)', animation: 'sh 3s ease-in-out infinite' }}></div>
            </a>

            <div className="flex items-center justify-center gap-[7px] mt-[10px] text-[11.5px] text-[#aaa] leading-[1.4] text-center relative z-10">
              🔒 <span><b className="text-white">Pagamento confirmado, números adicionados automaticamente.</b><br/>Você poderá conferi-los na área do participante.</span>
            </div>
            <div className="flex justify-center flex-wrap gap-[7px] mt-[10px] relative z-10">
              <span className="text-[10px] text-[#888] border border-[#282828] rounded-[20px] p-[5px_8px] bg-[#0A0A0A]">✓ Ativação automática</span>
              <span className="text-[10px] text-[#888] border border-[#282828] rounded-[20px] p-[5px_8px] bg-[#0A0A0A]">✓ Compra protegida</span>
              <span className="text-[10px] text-[#888] border border-[#282828] rounded-[20px] p-[5px_8px] bg-[#0A0A0A]">✓ Acesso imediato</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#000000] p-[10px_16px] w-full">
        <div className="max-w-[480px] mx-auto border-[1.5px] border-[rgba(255,120,0,.22)] rounded-[11px] p-[12px] text-center" style={{ background: 'linear-gradient(135deg,#170500,#1C0800)' }}>
          <div className="font-['Oswald',sans-serif] text-[14px] font-bold uppercase text-[#FF9800] mb-[5px]">⏰ Não desperdice o que você desbloqueou</div>
          <p className="text-[12.5px] text-[#BDBDBD] leading-[1.55] m-0">
            <strong className="text-white">Sua compra já colocou você no jogo.</strong> O Booster existe para colocar sua participação em outro nível.
          </p>
        </div>
      </section>

      <section className="bg-[#000000] p-[20px_16px_calc(28px+env(safe-area-inset-bottom))] text-center w-full">
        <div className="max-w-[480px] mx-auto w-full">
          <h2 className="font-['Oswald',sans-serif] text-[clamp(24px,7.5vw,38px)] font-bold uppercase leading-[1.06] mb-[8px] text-white">
            Não deixa outro<br/>sair na sua <em className="text-[#FFD600] not-italic">frente.</em>
          </h2>
          <p className="text-[13px] text-[#ADADAD] leading-[1.55] max-w-[380px] mx-auto mb-[16px]">
            Você já tomou a decisão de participar.<br/>
            <strong className="text-white">Agora decida se vai apenas torcer ou colocar 190X chances a seu favor.</strong>
          </p>
          <a href={(config as any).checkoutUrl || '#'} className="relative block max-w-[440px] mx-auto w-full border-none cursor-pointer text-white font-['Oswald',sans-serif] text-[clamp(17px,5vw,22px)] font-bold uppercase p-[15px_16px] rounded-[12px] overflow-hidden text-center no-underline z-10 mb-[4px]" style={{ background: 'linear-gradient(135deg,#00E028,#008516)', animation: 'glGreen 2.5s ease-in-out infinite' }}>
            <span className="relative z-10">🚀 SIM — QUERO ENTRAR 190X MAIS FORTE</span>
            <div className="absolute top-0 left-[-110%] w-[50%] h-full z-0" style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.28),transparent)', animation: 'sh 3s ease-in-out infinite' }}></div>
          </a>
        </div>
      </section>
    </>
  );
}
