"use client";

import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react"; // Assuming we have it, or we can use the same API as the HTML

interface GatekeeperProps {
  previewMode?: boolean;
}

type BlockReason = "desktop" | "emulador" | "devtools" | "token" | null;

export const Gatekeeper: React.FC<GatekeeperProps> = ({ previewMode = false }) => {
  const [blockedReason, setBlockedReason] = useState<BlockReason>(null);

  useEffect(() => {
    if (previewMode) return;

    // bots passes
    const ua = navigator.userAgent || "";
    const BOTS = /bot\b|crawler|spider|facebookexternalhit|facebot|Googlebot|AdsBot-Google|Mediapartners-Google|Google-InspectionTool|Storebot-Google|APIs-Google|bingbot|BingPreview|Slurp|DuckDuckBot|Baiduspider|YandexBot|Twitterbot|WhatsApp|TelegramBot|LinkedInBot|Pinterest|Applebot|Discordbot|SkypeUriPreview|Embedly|redditbot|Chrome-Lighthouse|PTST|GTmetrix|HeadlessChrome/i;
    if (BOTS.test(ua)) return;

    const qs = new URLSearchParams(window.location.search);
    if (qs.get("debug") === "1") return; // fallback for manual debug

    // 1. PORTEIRO: check device
    const checkPorteiro = (): BlockReason => {
      // Desktop
      const uaMobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Silk/i.test(ua);
      const iPadOS = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
      const temToque = ("ontouchstart" in window) || navigator.maxTouchPoints > 0;
      const telaPequena = Math.min(window.screen.width, window.screen.height) <= 950;
      const ehMobile = iPadOS || (uaMobile && (temToque || telaPequena));
      
      if (!ehMobile) return "desktop";

      // Emulator
      const ow = window.outerWidth || 0;
      const oh = window.outerHeight || 0;
      const sw = window.screen.width || 0;
      const sh = window.screen.height || 0;

      if (ow > 0 && sw > 0) {
        if (ow > sw * 1.35 || oh > sh * 1.5) return "emulador";
      }
      if (ow > 0 && (ow - window.innerWidth > 160 || oh - window.innerHeight > 220)) {
        return "emulador";
      }
      if (/iPhone|iPad|iPod/i.test(ua) && typeof window.TouchEvent === "undefined") {
        return "emulador";
      }

      return null;
    };

    const initialBlock = checkPorteiro();
    if (initialBlock) {
      setBlockedReason(initialBlock);
      return;
    }

    // 2. ANTICÓPIA
    const stop = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    const handleContextMenu = (e: Event) => stop(e);
    const handlePointerDown = (e: PointerEvent | MouseEvent) => {
      if (e.button === 2) stop(e);
    };
    const handleAuxClick = (e: MouseEvent) => {
      if (e.button === 2 || e.button === 1) stop(e);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const k = (e.key || "").toLowerCase();
      if (k === "f12") return stop(e);
      if (k === "contextmenu") return stop(e);
      if (e.shiftKey && k === "f10") return stop(e);
      if (e.ctrlKey && e.shiftKey && ["i", "j", "c", "k"].includes(k)) return stop(e);
      if ((e.ctrlKey || e.metaKey) && ["u", "s", "p", "c", "a", "x"].includes(k)) return stop(e);
    };

    const options = { capture: true, passive: false };
    document.addEventListener("contextmenu", handleContextMenu, options);
    window.addEventListener("contextmenu", handleContextMenu, options);
    document.addEventListener("pointerdown", handlePointerDown as EventListener, options);
    document.addEventListener("mousedown", handlePointerDown as EventListener, options);
    document.addEventListener("mouseup", handlePointerDown as EventListener, options);
    document.addEventListener("auxclick", handleAuxClick as EventListener, options);
    document.addEventListener("dragstart", handleContextMenu, options);
    document.addEventListener("copy", handleContextMenu, options);
    document.addEventListener("cut", handleContextMenu, options);
    
    const handleSelectStart = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest && target.closest("input,textarea")) return;
      return stop(e);
    };
    document.addEventListener("selectstart", handleSelectStart, options);
    document.addEventListener("keydown", handleKeyDown, options);

    // CSS for anticópia
    const css = document.createElement("style");
    css.id = "bs-anticopia";
    css.textContent = `
      * { -webkit-user-select: none !important; user-select: none !important; -webkit-touch-callout: none !important; }
      input, textarea { -webkit-user-select: text !important; user-select: text !important; }
      img { -webkit-user-drag: none; pointer-events: none; }
    `;
    document.head.appendChild(css);

    // 3. VIGIA
    const larguraInicial = window.screen.width;
    const alturaInicial = window.screen.height;
    let derrubado = false;

    const derrubar = () => {
      if (derrubado) return;
      derrubado = true;
      setBlockedReason("devtools");
    };

    const checar = () => {
      if (derrubado) return;
      const fendaX = window.outerWidth - window.innerWidth;
      const fendaY = window.outerHeight - window.innerHeight;
      if (window.outerWidth > 0 && (fendaX > 160 || fendaY > 220)) return derrubar();
      if (window.screen.width !== larguraInicial || window.screen.height !== alturaInicial) return derrubar();
      if (window.outerWidth > 0 && window.screen.width > 0 && window.outerWidth > window.screen.width * 1.35) return derrubar();
      
      const t = performance.now();
      // eslint-disable-next-line no-debugger
      debugger;
      if (performance.now() - t > 120) return derrubar();
    };

    const interval = setInterval(checar, 1000);
    window.addEventListener("resize", checar, { passive: true });

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu, options);
      window.removeEventListener("contextmenu", handleContextMenu, options);
      document.removeEventListener("pointerdown", handlePointerDown as EventListener, options);
      document.removeEventListener("mousedown", handlePointerDown as EventListener, options);
      document.removeEventListener("mouseup", handlePointerDown as EventListener, options);
      document.removeEventListener("auxclick", handleAuxClick as EventListener, options);
      document.removeEventListener("dragstart", handleContextMenu, options);
      document.removeEventListener("copy", handleContextMenu, options);
      document.removeEventListener("cut", handleContextMenu, options);
      document.removeEventListener("selectstart", handleSelectStart, options);
      document.removeEventListener("keydown", handleKeyDown, options);
      if (css.parentNode) document.head.removeChild(css);
      clearInterval(interval);
      window.removeEventListener("resize", checar);
    };
  }, [previewMode]);

  if (!blockedReason) return null;

  const isCelular = ["desktop", "emulador", "devtools"].includes(blockedReason);
  const title = isCelular ? "Abra no seu celular" : "Link inválido ou expirado";
  const desc = isCelular
    ? "Esta etapa da campanha funciona somente em smartphone. Aponte a câmera do seu celular para o código abaixo:"
    : "Este link não é válido. Use o link que você recebeu após confirmar sua compra.";
  const url = typeof window !== "undefined" ? window.location.href : "";
  const qrc = `https://api.qrserver.com/v1/create-qr-code/?size=210x210&margin=0&data=${encodeURIComponent(url)}`;

  return (
    <>
      <style>{`
        body > *:not(#bs-gatekeeper) { display: none !important; }
        body { background: #000; overflow: hidden; margin: 0; }
      `}</style>
      <div id="bs-gatekeeper" style={{
        position: 'fixed', inset: 0, minHeight: '100vh', display: 'flex', alignItems: 'center', 
        justifyContent: 'center', padding: '24px', background: '#000', 
        fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif', zIndex: 999999
      }}>
        <div style={{ maxWidth: '380px', width: '100%', textAlign: 'center', color: '#EBEBEB' }}>
          <div style={{ fontSize: '44px', marginBottom: '14px' }}>{isCelular ? '📱' : '🔒'}</div>
          <h1 style={{ fontSize: '24px', lineHeight: 1.15, margin: '0 0 10px', color: '#FFD600', textTransform: 'uppercase', letterSpacing: '.5px' }}>{title}</h1>
          <p style={{ fontSize: '14px', lineHeight: 1.5, color: '#9a9a9a', margin: '0 0 20px' }}>{desc}</p>
          {isCelular && (
            <div style={{ background: '#fff', padding: '12px', borderRadius: '14px', display: 'inline-block' }}>
              <img src={qrc} alt="QR Code" width="210" height="210" style={{ display: 'block' }} onError={(e) => { e.currentTarget.parentElement!.style.display = 'none'; }} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
