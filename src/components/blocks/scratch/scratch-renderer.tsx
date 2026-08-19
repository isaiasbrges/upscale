"use client";

import React, { useState, useEffect } from "react";
import type { ScratchBlockConfig } from "@/blocks/scratch";
import { ScratchCell } from "./scratch-cell";
import { Trophy, X, Rocket } from "lucide-react";

// ÁUDIO INTERATIVO — sintetizado no navegador
let audioCtx: AudioContext | null = null;
const ensureAudio = () => {
  if (typeof window === 'undefined') return null;
  const AC = window.AudioContext || (window as any).webkitAudioContext;
  if (!AC) return null;
  if (!audioCtx) audioCtx = new AC();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
};

const tone = (freq: number, duration = 0.08, type: OscillatorType = 'sine', volume = 0.035, delay = 0) => {
  const ctx = ensureAudio();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const start = ctx.currentTime + delay;
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.03);
};

const soundScratch = () => tone(520, 0.045, 'triangle', 0.018);
const soundReveal = () => {
  tone(523, 0.2, 'sine', 0.04);
  tone(659, 0.22, 'sine', 0.04, 0.12);
  tone(784, 0.34, 'sine', 0.05, 0.24);
  tone(1047, 0.42, 'triangle', 0.035, 0.4);
};
const soundConfirm = () => {
  tone(660, 0.11, 'sine', 0.03);
  tone(990, 0.22, 'sine', 0.035, 0.1);
};

type ResultPrize = { name: string; description?: string | null; imageUrl?: string | null } | null;

export const ScratchRenderer: React.FC<
  ScratchBlockConfig & {
    gridItems?: string[];
    /** Quando definido, ativa o modo "resultado real" (raspadinha pública ligada a um ScratchCard de verdade). */
    resultWon?: boolean;
    resultPrize?: ResultPrize;
    /** Link para a próxima etapa do funil, exibido como CTA na tela de resultado. */
    continueHref?: string | null;
  }
> = ({
  eyebrow,
  title,
  subtitle,
  instruction,
  winText,
  loseText,
  scratchBackground,
  externalBackground,
  borderColor,
  borderRadius,
  maxWidth,
  gridSize = "3x3",
  gridGap,
  maskColor,
  maskTexture,
  centerIcon,
  maskOpacity,
  previewMode = false,
  gridItems,
  resultWon,
  resultPrize,
  continueHref,
}) => {
  const hasRealResult = resultWon !== undefined;
  const cols = parseInt(gridSize.charAt(0)) || 3;
  const rows = parseInt(gridSize.charAt(2)) || 3;
  const totalCells = cols * rows;

  const [revealedCount, setRevealedCount] = useState(0);
  const [isWinScreenVisible, setIsWinScreenVisible] = useState(false);
  const [isFlowCompleted, setIsFlowCompleted] = useState(false);

  // Mocking prizes
  const [mockPrizes] = useState(() => {
    if (gridItems && gridItems.length > 0) {
      return gridItems;
    }
    const prizes = Array(totalCells).fill(false);
    let winsPlaced = 0;
    while (winsPlaced < 3 && winsPlaced < totalCells) {
      const idx = Math.floor(Math.random() * totalCells);
      if (!prizes[idx]) {
        prizes[idx] = true;
        winsPlaced++;
      }
    }
    return prizes;
  });

  const handleReveal = () => {
    soundScratch();
    setRevealedCount(prev => {
      const next = prev + 1;
      if (next === totalCells) {
        setTimeout(() => {
          soundReveal();
          setIsWinScreenVisible(true);
        }, 600);
      }
      return next;
    });
  };

  const isGameOver = revealedCount === totalCells;

  const handleCloseWinScreen = () => {
    soundConfirm();
    setIsWinScreenVisible(false);
    setIsFlowCompleted(true);
  };

  // Setup global event to ensure audio can play
  useEffect(() => {
    const initAudio = () => ensureAudio();
    document.addEventListener("pointerdown", initAudio, { once: true, passive: true });
    return () => {
      document.removeEventListener("pointerdown", initAudio);
    };
  }, []);

  if (isFlowCompleted) {
    // Quando completado, o bloco pode sumir ou exibir um placeholder sutil, já que revelou a vantagem na página.
    // Vamos esconder o bloco em si, a página de baixo agora é visível.
    return null;
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        body > *:not(#scratch-flow-container) { display: none !important; }
        body { background: #000; overflow: hidden; margin: 0; }
        @keyframes iconPop { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes glGreen { 0%, 100% { box-shadow: 0 6px 30px rgba(0,224,40,0.45); } 50% { box-shadow: 0 6px 55px rgba(0,224,40,0.8), 0 0 0 8px rgba(0,224,40,0.12); } }
        @keyframes borderSpin { to { background-position: 300% center; } }
      `}} />

      <div id="scratch-flow-container" className="fixed inset-0 z-[9999] bg-black/95 flex flex-col items-center justify-center p-4">
        
        {/* SCRATCH CARD UI */}
        {!isWinScreenVisible && (
          <div 
            className="w-full relative shadow-[0_0_30px_rgba(74,222,128,0.1)] flex flex-col items-center pt-8 pb-4 px-6 sm:px-10"
            style={{ 
              maxWidth: `${maxWidth}px`, 
              backgroundColor: "#0a0a0a", 
              borderColor: "#22c55e", 
              borderWidth: "1px",
              borderRadius: "20px" 
            }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[95%] h-[4px] bg-gradient-to-r from-green-500/0 via-green-500 to-green-500/0 rounded-t-full" />

            <div className="text-center mb-8 w-full flex flex-col items-center">
              {eyebrow && (
                <p className="text-[11px] font-bold tracking-[0.25em] text-[#22c55e] uppercase mb-4 flex items-center justify-center gap-2">
                  <span className="text-yellow-400">⚡</span> {eyebrow}
                </p>
              )}
              {title && (
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-3 uppercase leading-none tracking-tight font-sans">
                  {title}
                </h2>
              )}
              {subtitle && <p className="text-gray-400 text-sm font-medium">{subtitle}</p>}
            </div>

            <div className="w-full flex-grow flex items-center justify-center">
              <div 
                className="grid w-full aspect-square max-h-[400px]"
                style={{ 
                  gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
                  gap: `${gridGap}px` 
                }}
              >
                {mockPrizes.map((isWin, i) => (
                  <div 
                    key={i} 
                    className="w-full h-full rounded-xl border overflow-hidden"
                    style={{ 
                      backgroundColor: "#171717",
                      borderColor: typeof isWin === 'string' && isWin === "win" ? "#22c55e" : "#262626"
                    }}
                  >
                    <ScratchCell
                      maskColor="#1f1f1f"
                      maskTexture={maskTexture}
                      centerIcon={centerIcon}
                      maskOpacity={maskOpacity}
                      onReveal={handleReveal}
                      prizeContent={
                        <div className="flex flex-col items-center justify-center h-full w-full">
                          {typeof isWin === 'string' ? (
                            <div className="text-xl font-bold">{isWin.startsWith('http') ? <img src={isWin} className="w-8 h-8 object-contain" alt="prize" /> : isWin}</div>
                          ) : isWin ? (
                            <Trophy className="w-8 h-8 text-yellow-500 mb-1" />
                          ) : (
                            <X className="w-8 h-8 text-gray-300 mb-1" />
                          )}
                        </div>
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            {instruction && (
              <div className="mt-8 text-center text-sm font-medium text-gray-500 flex items-center justify-center gap-2">
                <span className="text-xl">☝️</span> {instruction}
              </div>
            )}
          </div>
        )}

        {/* RESULT MODAL — legado (bloco decorativo, sem resultado real) sempre mostra "ganhou" */}
        {isWinScreenVisible && !hasRealResult && (
          <div className="fixed inset-0 z-[10000] bg-[radial-gradient(ellipse_at_50%_25%,#081600,#080808_65%)] flex items-center justify-center p-5">
            <div className="max-w-[360px] w-full text-center relative">
              <div className="bg-gradient-to-br from-[#0A1200] to-[#080808] rounded-[22px] p-6 relative overflow-hidden">
                <div
                  className="absolute inset-0 rounded-[22px] p-[2px] opacity-60"
                  style={{
                    background: "linear-gradient(135deg, #19A85A, #FFD600, #0B6E3A, #FFD600)",
                    backgroundSize: "300% auto",
                    animation: "borderSpin 3s linear infinite",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude"
                  }}
                />

                <span className="block text-[72px] mb-3 drop-shadow-[0_0_24px_rgba(255,214,0,0.7)]" style={{ animation: "iconPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards" }}>
                  <Rocket className="w-20 h-20 mx-auto text-yellow-400 fill-yellow-400" />
                </span>
                <p className="font-sans text-[10px] font-bold uppercase tracking-[2.4px] text-[#19A85A] mb-2">Vantagem revelada</p>
                <h2 className="font-sans text-[32px] font-bold uppercase text-[#FFD600] leading-[1.05] mb-2 drop-shadow-[0_0_30px_rgba(255,214,0,0.4)]">
                  Turbo 190X<br/>Desbloqueado!
                </h2>
                <div className="w-[76px] h-[2px] mx-auto mb-4" style={{ background: "linear-gradient(90deg, transparent, #FFD600, transparent)" }} />
                <p className="text-[14px] text-[#c8c8c8] leading-[1.55] max-w-[290px] mx-auto mb-6">
                  Sua compra liberou uma vantagem para <em className="text-[#FFD600] not-italic font-bold">multiplicar suas chances</em> nos 20 veículos 0KM e na Casa 100% Mobiliada.
                </p>

                <button
                  onClick={handleCloseWinScreen}
                  className="block w-full border-none cursor-pointer text-white font-sans text-[18px] font-bold uppercase py-4 px-5 rounded-xl relative overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #00E028, #008516)",
                    animation: "glGreen 2s ease-in-out infinite"
                  }}
                >
                  🔓 VER O QUE EU DESBLOQUEEI
                </button>
                <div className="text-[11px] text-[#555] mt-3">Vantagem exclusiva da etapa pós-compra</div>
              </div>
            </div>
          </div>
        )}

        {/* RESULT MODAL — raspadinha real (ScratchCard), usa o resultado de fato */}
        {isWinScreenVisible && hasRealResult && resultWon && (
          <div className="fixed inset-0 z-[10000] bg-[radial-gradient(ellipse_at_50%_25%,#081600,#080808_65%)] flex items-center justify-center p-5">
            <div className="max-w-[360px] w-full text-center relative">
              <div className="bg-gradient-to-br from-[#0A1200] to-[#080808] rounded-[22px] p-6 relative overflow-hidden">
                <div
                  className="absolute inset-0 rounded-[22px] p-[2px] opacity-60"
                  style={{
                    background: "linear-gradient(135deg, #19A85A, #FFD600, #0B6E3A, #FFD600)",
                    backgroundSize: "300% auto",
                    animation: "borderSpin 3s linear infinite",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude"
                  }}
                />
                {resultPrize?.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={resultPrize.imageUrl} alt={resultPrize.name} className="w-20 h-20 mx-auto mb-3 object-contain drop-shadow-[0_0_24px_rgba(255,214,0,0.5)]" />
                ) : (
                  <Trophy className="w-16 h-16 mx-auto mb-3 text-yellow-400 drop-shadow-[0_0_24px_rgba(255,214,0,0.7)]" />
                )}
                <p className="font-sans text-[10px] font-bold uppercase tracking-[2.4px] text-[#19A85A] mb-2">{winText || "Você ganhou!"}</p>
                <h2 className="font-sans text-[28px] font-bold uppercase text-[#FFD600] leading-[1.1] mb-2 drop-shadow-[0_0_30px_rgba(255,214,0,0.4)]">
                  {resultPrize?.name ?? "Prêmio liberado"}
                </h2>
                {resultPrize?.description && (
                  <p className="text-[14px] text-[#c8c8c8] leading-[1.55] max-w-[290px] mx-auto mb-6">{resultPrize.description}</p>
                )}
                {continueHref ? (
                  <a
                    href={continueHref}
                    className="block w-full border-none cursor-pointer text-white font-sans text-[18px] font-bold uppercase py-4 px-5 rounded-xl relative overflow-hidden text-center"
                    style={{ background: "linear-gradient(135deg, #00E028, #008516)", animation: "glGreen 2s ease-in-out infinite" }}
                  >
                    Continuar
                  </a>
                ) : (
                  <button
                    onClick={handleCloseWinScreen}
                    className="block w-full border-none cursor-pointer text-white font-sans text-[18px] font-bold uppercase py-4 px-5 rounded-xl relative overflow-hidden"
                    style={{ background: "linear-gradient(135deg, #00E028, #008516)", animation: "glGreen 2s ease-in-out infinite" }}
                  >
                    Continuar
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* RESULT MODAL — raspadinha real, resultado negativo */}
        {isWinScreenVisible && hasRealResult && !resultWon && (
          <div className="fixed inset-0 z-[10000] bg-[radial-gradient(ellipse_at_50%_25%,#080808_0%,#050505_65%)] flex items-center justify-center p-5">
            <div className="max-w-[360px] w-full text-center relative">
              <div className="bg-gradient-to-br from-[#0A0A0A] to-[#080808] rounded-[22px] p-6 border border-white/10">
                <X className="w-16 h-16 mx-auto mb-3 text-gray-500" />
                <h2 className="font-sans text-[24px] font-bold text-white leading-[1.1] mb-2">
                  {loseText || "Não foi dessa vez"}
                </h2>
                <p className="text-[14px] text-[#8a8a8a] leading-[1.55] max-w-[290px] mx-auto mb-6">
                  Fique de olho nas próximas oportunidades.
                </p>
                {continueHref ? (
                  <a
                    href={continueHref}
                    className="block w-full border border-white/15 cursor-pointer text-white font-sans text-[15px] font-bold uppercase py-3.5 px-5 rounded-xl text-center hover:bg-white/5 transition-colors"
                  >
                    Continuar
                  </a>
                ) : (
                  <button
                    onClick={handleCloseWinScreen}
                    className="block w-full border border-white/15 cursor-pointer text-white font-sans text-[15px] font-bold uppercase py-3.5 px-5 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    Continuar
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
