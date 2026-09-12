"use client";

import { useState, useRef, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { QrCode, Copy, Check, Download, ExternalLink, Sparkles, X, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  url?: string;
}

const COLOR_THEMES = [
  { name: "Cyan Cyber", fg: "#06b6d4", bg: "#090d16", border: "border-cyan-500/30", glow: "shadow-[0_0_25px_rgba(6,182,212,0.3)]" },
  { name: "Neon Emerald", fg: "#10b981", bg: "#061510", border: "border-emerald-500/30", glow: "shadow-[0_0_25px_rgba(16,185,129,0.3)]" },
  { name: "Violet Pulse", fg: "#a855f7", bg: "#13091f", border: "border-purple-500/30", glow: "shadow-[0_0_25px_rgba(168,85,247,0.3)]" },
  { name: "Monochrome", fg: "#ffffff", bg: "#09090b", border: "border-white/20", glow: "shadow-[0_0_25px_rgba(255,255,255,0.15)]" },
];

export function QrModal({ isOpen, onClose, url }: QrModalProps) {
  const [copied, setCopied] = useState(false);
  const [activeTheme, setActiveTheme] = useState(0);
  const [isScanning, setIsScanning] = useState(true);
  const [currentUrl, setCurrentUrl] = useState(url || "https://khecare.vercel.app/");
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (url) {
      setCurrentUrl(url);
    } else if (typeof window !== "undefined") {
      setCurrentUrl(window.location.origin + "/");
    }
  }, [url]);

  if (!isOpen) return null;

  const currentTheme = COLOR_THEMES[activeTheme];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };


  const handleDownloadPNG = () => {
    if (!qrRef.current) return;
    const svgElement = qrRef.current.querySelector("svg");
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = 1000;
      canvas.height = 1000;
      if (ctx) {
        // Fill background
        ctx.fillStyle = currentTheme.bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Draw SVG
        ctx.drawImage(img, 100, 100, 800, 800);

        // Download link
        const pngUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `landingpage-qr-${currentTheme.name.toLowerCase().replace(" ", "-")}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-zinc-950 border border-white/10 shadow-2xl p-6 sm:p-8 text-white transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Glow Background */}
        <div 
          className="absolute -top-24 -left-24 w-48 h-48 rounded-full blur-3xl opacity-40 transition-colors duration-500 pointer-events-none" 
          style={{ backgroundColor: currentTheme.fg }}
        />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div 
              className="p-2.5 rounded-2xl border transition-colors duration-300"
              style={{ backgroundColor: `${currentTheme.fg}15`, borderColor: `${currentTheme.fg}30` }}
            >
              <QrCode className="w-5 h-5" style={{ color: currentTheme.fg }} />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg flex items-center gap-1.5">
                Mã QR Website
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              </h3>
              <p className="text-xs text-zinc-400">Quét để truy cập nhanh trên điện thoại</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Display Card */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div 
            ref={qrRef}
            className={`relative p-5 rounded-3xl border transition-all duration-500 ${currentTheme.border} ${currentTheme.glow}`}
            style={{ backgroundColor: currentTheme.bg }}
          >
            {/* Cyber Corner Marks */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 rounded-tl" style={{ borderColor: currentTheme.fg }} />
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 rounded-tr" style={{ borderColor: currentTheme.fg }} />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 rounded-bl" style={{ borderColor: currentTheme.fg }} />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 rounded-br" style={{ borderColor: currentTheme.fg }} />

            {/* QR Code SVG */}
            <QRCodeSVG
              value={currentUrl}
              size={210}
              bgColor={currentTheme.bg}
              fgColor={currentTheme.fg}
              level="H"
              marginSize={1}
            />

            {/* Laser Scan Beam Animation */}
            {isScanning && (
              <div 
                className="absolute left-3 right-3 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#06b6d4] opacity-80 pointer-events-none animate-scan-beam"
                style={{
                  animation: "scanBeam 2.5s ease-in-out infinite alternate"
                }}
              />
            )}
          </div>

          {/* Toggle Scan Animation button */}
          <button
            onClick={() => setIsScanning(!isScanning)}
            className="mt-3 text-[11px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1 transition-colors"
          >
            <Smartphone className="w-3.5 h-3.5" />
            {isScanning ? "Tắt hiệu ứng quét Laser" : "Bật hiệu ứng quét Laser"}
          </button>
        </div>

        {/* Color Theme Selector */}
        <div className="mb-6">
          <label className="block text-xs text-zinc-400 font-medium mb-2.5">
            Chọn chủ đề màu sắc QR:
          </label>
          <div className="grid grid-cols-4 gap-2">
            {COLOR_THEMES.map((theme, index) => (
              <button
                key={theme.name}
                onClick={() => setActiveTheme(index)}
                className={`py-2 px-2 rounded-xl text-xs font-medium border transition-all duration-200 flex flex-col items-center gap-1.5 ${
                  activeTheme === index
                    ? "border-white text-white bg-white/10 shadow-lg scale-105"
                    : "border-white/10 text-zinc-400 hover:border-white/30 hover:text-white bg-zinc-900/50"
                }`}
              >
                <span 
                  className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                  style={{ backgroundColor: theme.fg }}
                />
                <span className="text-[10px] truncate max-w-full">{theme.name.split(" ")[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* URL Box */}
        <div className="p-3 bg-zinc-900/80 border border-white/10 rounded-2xl mb-6 flex items-center justify-between gap-2">
          <div className="truncate text-xs font-mono text-zinc-300 pl-1">
            {currentUrl}
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="h-8 px-3 text-xs bg-white/10 hover:bg-white/20 text-white rounded-xl flex items-center gap-1.5 shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Đã chép!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-300" />
                <span>Sao chép</span>
              </>
            )}
          </Button>
        </div>

        {/* Bottom Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={handleDownloadPNG}
            className="w-full bg-white hover:bg-zinc-200 text-black font-medium text-xs rounded-xl h-10 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Tải ảnh PNG
          </Button>

          <a 
            href={currentUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button
              variant="outline"
              className="w-full border-white/20 hover:bg-white/10 text-white font-medium text-xs rounded-xl h-10 flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Truy cập Link
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}

export function QrFloatingButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button at Bottom Right */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 bg-zinc-900/90 hover:bg-zinc-800 text-white border border-cyan-500/40 rounded-full shadow-[0_0_25px_rgba(6,182,212,0.35)] backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95"
          aria-label="Open QR Code Modal"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
          </span>

          <QrCode className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
          
          <span className="text-xs font-semibold tracking-wide pr-1">
            Quét QR Website
          </span>
        </button>
      </div>

      {/* Modal */}
      <QrModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
