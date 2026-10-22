import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { BrandLogo } from './BrandLogo.tsx';

interface CurtainIntroProps {
  onComplete: () => void;
  isOpen: boolean;
}

// Royal sound synthesis using Web Audio API for zero-latency, no-asset palace chime
function playRoyalChime() {
  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    // Pentatonic royal Indian raga notes (Sa, Re, Ga, Pa, Dha - approx D major / Bhupali notes)
    const freqs = [146.83, 220.0, 293.66, 369.99, 440.0, 587.33, 739.99, 880.0];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Warm sitar/tambura timbre harmonics
      osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1800, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.045 / (idx + 1), now + idx * 0.12 + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 3.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 3.5);
    });
  } catch {
    // Ignore audio errors if blocked by browser policy
  }
}

export const CurtainIntro: React.FC<CurtainIntroProps> = ({ onComplete, isOpen }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    // Check url param ?autostart=1
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      setIsDone(true);
      onComplete();
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // Golden dust particle system on canvas
    const canvas = canvasRef.current;
    let animId: number;
    let particles: { x: number; y: number; size: number; speedY: number; speedX: number; opacity: number; pulse: number }[] = [];

    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const ctx = canvas.getContext('2d');

      for (let i = 0; i < 45; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2.2 + 0.6,
          speedY: -(Math.random() * 0.6 + 0.2),
          speedX: (Math.random() - 0.5) * 0.4,
          opacity: Math.random() * 0.7 + 0.2,
          pulse: Math.random() * Math.PI,
        });
      }

      const renderDust = () => {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p) => {
          p.y += p.speedY;
          p.x += p.speedX;
          p.pulse += 0.03;
          if (p.y < -10) p.y = canvas.height + 10;
          if (p.x < -10) p.x = canvas.width + 10;
          if (p.x > canvas.width + 10) p.x = -10;

          const currentOpacity = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(245, 215, 140, ${currentOpacity})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#e5c378';
          ctx.fill();
        });
        animId = requestAnimationFrame(renderDust);
      };
      renderDust();
    }

    // GSAP Timeline matching the authentic cinematic unveiling from mahira2.netlify.app
    const tl = gsap.timeline({
      onComplete: () => {
        setIsDone(true);
        onComplete();
      },
    });

    // Elements
    const flareLine = container.querySelector('.flare-line');
    const flareVert = container.querySelector('.flare-vert');
    const flareCore = container.querySelector('.flare-core');
    const centerEmblem = container.querySelector('.center-emblem');
    const curtainGlow = container.querySelector('.curtain-glow');
    const cLeft = container.querySelector('.c-left');
    const cRight = container.querySelector('.c-right');
    const foldsL = container.querySelectorAll('.c-left .folds i');
    const foldsR = container.querySelectorAll('.c-right .folds i');
    const shL = container.querySelector('.cs-left');
    const shR = container.querySelector('.cs-right');

    // 0.1s: Royal Emblem blooms with brilliant gold specular glow
    tl.fromTo(
      centerEmblem,
      { opacity: 0, scale: 0.88, filter: 'blur(6px)' },
      { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.9, ease: 'power2.out' },
      0.1
    );

    // 0.2s: Golden light flare ignition
    tl.fromTo(
      flareCore,
      { scale: 0.1, opacity: 0 },
      { scale: 1.3, opacity: 1, duration: 1.0, ease: 'power2.out' },
      0.2
    )
      .fromTo(
        flareLine,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 0.95, duration: 1.1, ease: 'power3.out' },
        0.3
      )
      .fromTo(
        flareVert,
        { scaleY: 0, opacity: 0 },
        { scaleY: 1, opacity: 0.85, duration: 1.1, ease: 'power3.out' },
        0.3
      );

    // 1.4s: The golden light crack blooms warmly between the velvet panels
    tl.fromTo(
      curtainGlow,
      { opacity: 0, scaleX: 0.05 },
      { opacity: 0.95, scaleX: 1.3, duration: 0.8, ease: 'power2.inOut' },
      1.3
    );

    // Sound chime trigger
    tl.add(() => {
      if (audioEnabled) playRoyalChime();
    }, 1.4);

    // 1.8s: Grand parting of the heavy velvet drapery with authentic decelerating curve
    tl.to(
      cLeft,
      { xPercent: -112, duration: 2.4, ease: 'power3.inOut' },
      1.8
    )
      .to(
        cRight,
        { xPercent: 112, duration: 2.4, ease: 'power3.inOut' },
        1.8
      )
      .to(
        foldsL,
        {
          scaleX: 0.55,
          duration: 2.2,
          stagger: { each: 0.045, from: 'end' },
          ease: 'power3.inOut',
          transformOrigin: '0% 50%',
        },
        1.8
      )
      .to(
        foldsR,
        {
          scaleX: 0.55,
          duration: 2.2,
          stagger: { each: 0.045, from: 'start' },
          ease: 'power3.inOut',
          transformOrigin: '100% 50%',
        },
        1.8
      )
      .to(
        [shL, shR],
        { opacity: 0, duration: 1.8, ease: 'power2.out' },
        2.0
      )
      .to(
        centerEmblem,
        {
          scale: 0.85,
          opacity: 0,
          y: -40,
          duration: 1.2,
          ease: 'power2.inOut',
        },
        1.9
      )
      .to(
        curtainGlow,
        { opacity: 0, scaleX: 3.5, duration: 1.5, ease: 'power2.out' },
        2.2
      )
      .to(
        container,
        { opacity: 0, duration: 0.8, ease: 'power1.out' },
        3.8
      );

    return () => {
      tl.kill();
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isOpen, onComplete, audioEnabled]);

  const handleSkip = () => {
    setIsDone(true);
    onComplete();
  };

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !audioEnabled;
    setAudioEnabled(next);
    if (next) {
      playRoyalChime();
    }
  };

  if (!isOpen || isDone) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] overflow-hidden pointer-events-auto bg-[#07150e] select-none"
      aria-label="Mahira Select Royal Curtain Unveil"
    >
      {/* Golden Dust Sparkles Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-30 pointer-events-none"
      />

      {/* Cinema Light Ignition / Optical Flare */}
      <div className="absolute inset-0 flex items-center justify-center z-25 pointer-events-none">
        <div className="cin-flare relative flex items-center justify-center">
          {/* Horizontal Flare Ray */}
          <span className="flare-line w-[65vw] h-[2px] bg-gradient-to-r from-transparent via-[#fae2b4] to-transparent shadow-[0_0_24px_#fae2b4] blur-[0.3px]" />
          {/* Vertical Flare Ray */}
          <span className="flare-vert absolute w-[2px] h-[35vh] bg-gradient-to-b from-transparent via-[#fae2b4] to-transparent shadow-[0_0_20px_#fae2b4] blur-[0.3px]" />
          {/* Glowing Radiant Core */}
          <span className="flare-core absolute w-6 h-6 rounded-full bg-gradient-to-r from-[#fffbf0] via-[#fae2b4] to-[#c5a880] shadow-[0_0_40px_12px_rgba(250,226,180,0.8),0_0_90px_35px_rgba(197,168,128,0.4)]" />
        </div>
      </div>

      {/* Central Royal Emblem */}
      <div className="center-emblem absolute inset-0 z-28 flex flex-col items-center justify-center pointer-events-none px-4">
        <div className="p-8 sm:p-10 rounded-full bg-[#07150e]/90 backdrop-blur-md border border-[#c5a880]/80 shadow-[0_0_80px_rgba(212,175,55,0.45)] flex flex-col items-center text-center">
          <BrandLogo size="xl" showSubtitle={true} />
          <p className="font-serif-luxury italic text-sm sm:text-base text-[#fae2b4] mt-3 tracking-widest drop-shadow-md">
            Tradition Meets Tomorrow
          </p>
        </div>
      </div>

      {/* Warm Golden Light Blooming through the curtain crack */}
      <div
        className="curtain-glow absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[28vw] h-[130vh] z-15 pointer-events-none opacity-0"
        style={{
          background:
            'radial-gradient(46% 50% at 50% 50%, rgba(255, 230, 175, 0.6) 0%, rgba(212, 175, 55, 0.25) 45%, transparent 75%)',
        }}
      />

      {/* CURTAINS — Deep Burgundy & Royal Emerald Velvet Panels with 7 Organic Folds */}
      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
        {/* Left Curtain Panel */}
        <div className="curtain c-left absolute -top-[4vh] -bottom-[4vh] -left-[1vw] w-[56vw] will-change-transform shadow-[12px_0_35px_rgba(0,0,0,0.85)]">
          <div className="folds absolute inset-0 flex">
            {/* 7 Organic Fabric Folds with Burgundy Velvet Chiaroscuro */}
            {[
              { grow: 1.18, gradient: 'from-[#170407] via-[#48141d] to-[#25070c]' },
              { grow: 0.88, gradient: 'from-[#22060b] via-[#5c1c27] to-[#2a090e]' },
              { grow: 1.06, gradient: 'from-[#1c0509] via-[#6d2430] to-[#2e0b11]' },
              { grow: 0.98, gradient: 'from-[#25070c] via-[#551a24] to-[#20070a]' },
              { grow: 1.24, gradient: 'from-[#1a0407] via-[#68212c] to-[#28090e]' },
              { grow: 0.90, gradient: 'from-[#24060b] via-[#4f1821] to-[#1d0508]' },
              { grow: 1.10, gradient: 'from-[#160306] via-[#3a1017] to-[#0f0204]' },
            ].map((f, idx) => (
              <i
                key={idx}
                style={{ flexGrow: f.grow }}
                className={`h-full bg-gradient-to-r ${f.gradient} block shadow-inner`}
              />
            ))}
          </div>

          {/* Velvet Specular Highlights & Texture Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(255,225,170,0.14)] via-transparent to-[rgba(10,2,4,0.7)] pointer-events-none" />

          {/* Ornate Gold Embroidered Border on Curtain Edge */}
          <div className="absolute top-0 bottom-0 right-0 w-3 bg-gradient-to-b from-[#b38f56] via-[#fae2b4] to-[#8c6d3b] shadow-[0_0_12px_rgba(250,226,180,0.6)] flex flex-col justify-around py-4">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 mx-auto rotate-45 border border-[#48141d] bg-[#fae2b4]" />
            ))}
          </div>

          {/* Heavy Hem Shadow */}
          <div className="absolute left-0 right-0 bottom-0 h-[18%] bg-gradient-to-t from-[rgba(8,1,3,0.85)] to-transparent pointer-events-none" />
          {/* Edge Shade */}
          <div className="absolute top-0 bottom-0 right-0 w-[10%] bg-gradient-to-l from-[rgba(5,0,1,0.85)] to-transparent pointer-events-none" />
        </div>

        {/* Right Curtain Panel */}
        <div className="curtain c-right absolute -top-[4vh] -bottom-[4vh] -right-[1vw] w-[56vw] will-change-transform shadow-[-12px_0_35px_rgba(0,0,0,0.85)]">
          <div className="folds absolute inset-0 flex">
            {/* 7 Organic Fabric Folds mirrored */}
            {[
              { grow: 1.10, gradient: 'from-[#0f0204] via-[#3a1017] to-[#160306]' },
              { grow: 0.90, gradient: 'from-[#1d0508] via-[#4f1821] to-[#24060b]' },
              { grow: 1.24, gradient: 'from-[#28090e] via-[#68212c] to-[#1a0407]' },
              { grow: 0.98, gradient: 'from-[#20070a] via-[#551a24] to-[#25070c]' },
              { grow: 1.06, gradient: 'from-[#2e0b11] via-[#6d2430] to-[#1c0509]' },
              { grow: 0.88, gradient: 'from-[#2a090e] via-[#5c1c27] to-[#22060b]' },
              { grow: 1.18, gradient: 'from-[#25070c] via-[#48141d] to-[#170407]' },
            ].map((f, idx) => (
              <i
                key={idx}
                style={{ flexGrow: f.grow }}
                className={`h-full bg-gradient-to-r ${f.gradient} block shadow-inner`}
              />
            ))}
          </div>

          {/* Velvet Specular Highlights & Texture Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(255,225,170,0.14)] via-transparent to-[rgba(10,2,4,0.7)] pointer-events-none" />

          {/* Ornate Gold Embroidered Border on Curtain Edge */}
          <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-b from-[#b38f56] via-[#fae2b4] to-[#8c6d3b] shadow-[0_0_12px_rgba(250,226,180,0.6)] flex flex-col justify-around py-4">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 mx-auto rotate-45 border border-[#48141d] bg-[#fae2b4]" />
            ))}
          </div>

          {/* Heavy Hem Shadow */}
          <div className="absolute left-0 right-0 bottom-0 h-[18%] bg-gradient-to-t from-[rgba(8,1,3,0.85)] to-transparent pointer-events-none" />
          {/* Edge Shade */}
          <div className="absolute top-0 bottom-0 left-0 w-[10%] bg-gradient-to-r from-[rgba(5,0,1,0.85)] to-transparent pointer-events-none" />
        </div>

        {/* Soft Ambient Curtain Shadows */}
        <div className="cs-left absolute top-0 bottom-0 left-[54vw] w-[14vw] bg-gradient-to-r from-[rgba(4,8,5,0.7)] to-transparent pointer-events-none" />
        <div className="cs-right absolute top-0 bottom-0 right-[54vw] w-[14vw] bg-gradient-to-l from-[rgba(4,8,5,0.7)] to-transparent pointer-events-none" />
      </div>

      {/* Top Floating Controls: Palace Sound Toggle & Skip Intro */}
      <div className="absolute top-6 left-6 right-6 z-40 flex items-center justify-between pointer-events-auto">
        <button
          onClick={toggleAudio}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#07150e]/80 border border-[#c5a880]/50 text-[#fae2b4] text-xs font-cinzel hover:bg-[#132d20] transition-colors shadow-lg cursor-pointer"
          aria-label={audioEnabled ? 'Palace Ambience Sound On' : 'Palace Ambience Sound Off'}
        >
          {audioEnabled ? <Volume2 className="w-4 h-4 text-[#fae2b4]" /> : <VolumeX className="w-4 h-4 text-[#c5a880]" />}
          <span className="hidden sm:inline">
            {audioEnabled ? 'Palace Audio: Active' : 'Palace Audio: Off'}
          </span>
        </button>

        <button
          onClick={handleSkip}
          className="flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#07150e]/80 border border-[#c5a880]/70 text-[#fae2b4] text-xs uppercase tracking-widest font-cinzel hover:bg-[#c5a880] hover:text-[#07150e] transition-all shadow-lg cursor-pointer"
        >
          <span>Skip Unveil</span>
          <Sparkles className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
