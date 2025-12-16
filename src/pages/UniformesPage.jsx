import React, { useState, useEffect } from 'react';
import { Award, Palette, Check, Maximize2, Copy, Shirt, Presentation, BadgeCheck, X } from 'lucide-react';
import Header from '../components/Header';

// Dados das Faixas
const RANKS = {
  white: { name: 'Faixa Branca', hex: '#FFFFFF', bg: '#ffffff', glow: 'rgba(255,255,255,0.15)' },
  blue: { name: 'Faixa Azul', hex: '#005CB9', bg: '#005CB9', glow: 'rgba(0, 92, 185, 0.4)', dark: true },
  purple: { name: 'Faixa Roxa', hex: '#440099', bg: '#440099', glow: 'rgba(68, 0, 153, 0.4)', dark: true },
  brown: { name: 'Faixa Marrom', hex: '#603F26', bg: '#603F26', glow: 'rgba(96, 63, 38, 0.4)', dark: true },
  black: { name: 'Faixa Preta', hex: '#000000', bg: '#151515', border: true, glow: 'rgba(220, 38, 38, 0.3)', dark: true }
};

// Dados Rashguard
const rashData = {
  adulto: {
    img: 'https://imgur.com/whsA9sn.png',
    badge: 'Competição Adulto',
    title: 'Rashguard Ranked Pro',
    spec1: 'Assimétrico',
    spec2: 'IBJJF Legal'
  },
  kids: {
    img: 'https://imgur.com/kVrQcYA.png',
    badge: 'Competição Kids',
    title: 'Rashguard Young',
    spec1: 'Design Adaptado',
    spec2: 'Conforto Extra'
  }
};

export default function UniformesPage() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const [rashguardType, setRashguardType] = useState('adulto');
  const [selectedRank, setSelectedRank] = useState('blue');
  const [copied, setCopied] = useState(false);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ESC para fechar lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && lightboxSrc) {
        setLightboxSrc(null);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [lightboxSrc]);

  // Bloquear scroll quando lightbox aberto
  useEffect(() => {
    if (lightboxSrc) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [lightboxSrc]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyColor = () => {
    const text = RANKS[selectedRank].hex;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const currentRashguard = rashData[rashguardType];
  const currentRank = RANKS[selectedRank];

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 antialiased overflow-x-hidden selection:bg-red-600 selection:text-white">
      {/* Unified Header */}
      <Header 
        showBackToTop={showBackToTop}
        onScrollToTop={scrollToTop}
      />

      {/* Lightbox */}
      {lightboxSrc && (
        <div 
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setLightboxSrc(null)}
        >
          <button 
            className="absolute top-6 right-6 z-50 p-2 text-white rounded-full transition-colors hover:text-red-500 bg-black/50"
            onClick={() => setLightboxSrc(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <img 
            src={lightboxSrc} 
            alt="Ampliação" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl select-none"
            draggable="false"
          />
        </div>
      )}

      <main className="pt-20">
        {/* Hero Section */}
        <section className="overflow-hidden relative py-20 md:py-32 lg:py-40">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-900/40 via-[#050505] to-[#050505] pointer-events-none"></div>
          
          <div className="relative z-10 px-6 mx-auto max-w-7xl text-center">
            <div className="inline-flex items-center gap-3 py-1.5 px-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
              <span className="flex relative w-2 h-2">
                <span className="inline-flex absolute w-full h-full bg-red-500 rounded-full opacity-75 animate-ping"></span>
                <span className="inline-flex relative w-2 h-2 bg-red-500 rounded-full"></span>
              </span>
              <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">Manual 2026</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
              Padrão de<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">Excelência</span>
            </h1>
            
            <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-400 md:text-xl">
              Guia oficial de uniformização da USGO. Conheça os padrões visuais que representam nossa equipe.
            </p>
          </div>
        </section>

        {/* Rashguard Section */}
        <section id="rashguard" className="py-20 md:py-32 bg-[#080808] border-t border-white/5 scroll-mt-20">
          <div className="px-6 mx-auto max-w-7xl">
            <div className="flex flex-col gap-12 items-center lg:flex-row lg:gap-24">
              {/* Image */}
              <div className="relative w-full lg:w-1/2">
                <div 
                  className="overflow-hidden relative rounded-3xl border shadow-2xl border-white/10 cursor-zoom-in group"
                  onClick={() => setLightboxSrc(currentRashguard.img)}
                >
                  <img 
                    src={currentRashguard.img} 
                    alt={currentRashguard.title}
                    className="object-cover w-full transition-transform duration-500 group-hover:scale-105"
                    draggable="false"
                  />
                  <div className="absolute top-4 right-4 p-2 rounded-full opacity-0 transition-opacity bg-black/70 group-hover:opacity-100">
                    <Maximize2 className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Type Selector */}
                <div className="flex gap-3 justify-center mt-6">
                  <button 
                    onClick={() => setRashguardType('adulto')}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                      rashguardType === 'adulto' 
                        ? 'bg-red-600 text-white' 
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    Adulto
                  </button>
                  <button 
                    onClick={() => setRashguardType('kids')}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                      rashguardType === 'kids' 
                        ? 'bg-red-600 text-white' 
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    Kids
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-8 w-full lg:w-1/2">
                <div>
                  <div className="inline-flex items-center gap-3 text-red-500 font-bold tracking-[0.2em] uppercase text-xs mb-4">
                    <span className="w-8 h-[1px] bg-red-600"></span>
                    {currentRashguard.badge}
                  </div>
                  <h2 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl">{currentRashguard.title}</h2>
                  <p className="text-lg leading-relaxed text-gray-400">
                    Design assimétrico com identificação de graduação por cor. Segue regulamento IBJJF para competições oficiais.
                  </p>
                </div>

                {/* Rank Selector */}
                <div className="bg-[rgba(18,18,18,0.7)] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6">
                  <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.25em] mb-4 flex items-center gap-3">
                    <Palette className="w-4 h-4" />
                    Selecione sua Faixa
                  </h3>
                  
                  <div className="flex flex-wrap gap-3 mb-6">
                    {Object.entries(RANKS).map(([key, rank]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedRank(key)}
                        className={`w-10 h-10 rounded-full transition-all ${
                          selectedRank === key ? 'ring-2 ring-red-500 ring-offset-2 ring-offset-[#121212] scale-110' : ''
                        } ${rank.border ? 'border-2 border-white/30' : ''}`}
                        style={{ backgroundColor: rank.bg }}
                        title={rank.name}
                      />
                    ))}
                  </div>

                  <div className="flex gap-4 items-center p-4 rounded-xl bg-black/30">
                    <div 
                      className="w-12 h-12 rounded-lg"
                      style={{ backgroundColor: currentRank.bg, boxShadow: `0 0 20px ${currentRank.glow}` }}
                    ></div>
                    <div className="flex-1">
                      <p className="font-bold text-white">{currentRank.name}</p>
                      <p className="text-sm text-gray-500">{currentRank.hex}</p>
                    </div>
                    <button 
                      onClick={copyColor}
                      className="p-2 rounded-lg transition-colors bg-white/5 hover:bg-white/10"
                    >
                      {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-gray-400" />}
                    </button>
                  </div>
                </div>

                {/* Specs */}
                <div className="flex gap-4">
                  <div className="flex-1 p-4 rounded-xl border bg-white/5 border-white/10">
                    <Award className="mb-2 w-6 h-6 text-red-500" />
                    <p className="font-bold text-white">{currentRashguard.spec1}</p>
                  </div>
                  <div className="flex-1 p-4 rounded-xl border bg-white/5 border-white/10">
                    <Check className="mb-2 w-6 h-6 text-green-500" />
                    <p className="font-bold text-white">{currentRashguard.spec2}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Kimono Section */}
        <section id="kimono" className="py-20 md:py-32 bg-[#0a0a0a] border-t border-white/5 scroll-mt-20">
          <div className="px-6 mx-auto max-w-7xl">
            <div className="flex flex-col gap-12 items-center lg:flex-row lg:gap-24">
              {/* Placeholder Image */}
              <div className="relative w-full lg:w-1/2">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-[#111] aspect-[4/5] flex flex-col items-center justify-center p-8 text-center">
                  <div className="flex justify-center items-center mb-6 w-24 h-24 rounded-full border-2 border-dashed bg-white/5 border-white/20">
                    <Shirt size={40} className="text-zinc-600" />
                  </div>
                  <h3 className="mb-2 text-2xl font-bold text-white">Kimono USGO</h3>
                  <p className="mb-4 text-sm text-zinc-500">Em desenvolvimento</p>
                  <span className="inline-flex gap-2 items-center px-4 py-2 text-xs font-bold tracking-wider text-red-500 uppercase rounded-full border bg-red-600/10 border-red-600/30">
                    <span className="flex relative w-2 h-2">
                      <span className="inline-flex absolute w-full h-full bg-red-500 rounded-full opacity-75 animate-ping"></span>
                      <span className="inline-flex relative w-2 h-2 bg-red-500 rounded-full"></span>
                    </span>
                    Em Breve
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-8 w-full lg:w-1/2">
                <div>
                  <div className="inline-flex items-center gap-3 text-red-500 font-bold tracking-[0.2em] uppercase text-xs mb-4">
                    <span className="w-8 h-[1px] bg-red-600"></span>
                    Gi Oficial
                  </div>
                  <h2 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl">Kimono USGO</h2>
                  <p className="text-lg leading-relaxed text-gray-400">
                    O kimono oficial da USGO está em desenvolvimento. Em breve você terá acesso às especificações técnicas.
                  </p>
                </div>

                {/* Color Preview */}
                <div className="bg-[rgba(18,18,18,0.7)] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6">
                  <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.25em] mb-4 flex items-center gap-3">
                    <Palette className="w-4 h-4" />
                    Cores Previstas
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 text-center bg-white rounded-xl">
                      <div className="mx-auto mb-2 w-8 h-8 bg-white rounded-full border border-zinc-300"></div>
                      <span className="text-[10px] font-bold text-zinc-800 uppercase">Branco</span>
                    </div>
                    <div className="p-4 bg-[#005CB9] rounded-xl text-center">
                      <div className="w-8 h-8 rounded-full bg-[#005CB9] border border-blue-400 mx-auto mb-2"></div>
                      <span className="text-[10px] font-bold text-white uppercase">Azul</span>
                    </div>
                    <div className="p-4 bg-[#151515] rounded-xl border border-zinc-700 text-center">
                      <div className="w-8 h-8 rounded-full bg-[#151515] border border-zinc-600 mx-auto mb-2"></div>
                      <span className="text-[10px] font-bold text-white uppercase">Preto</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Casual Section */}
        <section id="casual" className="py-20 md:py-32 bg-[#050505] border-t border-white/5 scroll-mt-20">
          <div className="px-6 mx-auto max-w-7xl">
            <div className="flex flex-col gap-12 items-center lg:flex-row-reverse lg:gap-24">
              {/* Image */}
              <div className="w-full lg:w-1/2">
                <div 
                  className="overflow-hidden relative rounded-3xl border shadow-2xl border-white/10 cursor-zoom-in group"
                  onClick={() => setLightboxSrc('https://i.imgur.com/6m4w1bY.jpeg')}
                >
                  <img 
                    src="https://i.imgur.com/6m4w1bY.jpeg" 
                    alt="Camiseta Casual USGO"
                    className="object-cover w-full transition-transform duration-500 group-hover:scale-105"
                    draggable="false"
                  />
                  <div className="absolute top-4 right-4 p-2 rounded-full opacity-0 transition-opacity bg-black/70 group-hover:opacity-100">
                    <Maximize2 className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-8 w-full lg:w-1/2">
                <div>
                  <div className="inline-flex items-center gap-3 text-red-500 font-bold tracking-[0.2em] uppercase text-xs mb-4">
                    <span className="w-8 h-[1px] bg-red-600"></span>
                    Uso Diário
                  </div>
                  <h2 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl">Linha Casual</h2>
                  <p className="text-lg leading-relaxed text-gray-400">
                    Camisetas e vestuário para uso no dia a dia. Represente a USGO com estilo fora dos tatames.
                  </p>
                </div>

                <ul className="space-y-4">
                  <li className="flex gap-4 p-4 rounded-xl border bg-white/5 border-white/10">
                    <Check className="w-6 h-6 text-green-500 shrink-0" />
                    <div>
                      <p className="font-bold text-white">Camiseta Básica</p>
                      <p className="text-sm text-gray-500">100% algodão, logo frontal bordado</p>
                    </div>
                  </li>
                  <li className="flex gap-4 p-4 rounded-xl border bg-white/5 border-white/10">
                    <Check className="w-6 h-6 text-green-500 shrink-0" />
                    <div>
                      <p className="font-bold text-white">Moletom</p>
                      <p className="text-sm text-gray-500">Capuz, bolso canguru, estampa costas</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Técnico Section */}
        <section id="tecnico" className="py-20 md:py-32 bg-[#0a0a0a] border-t border-white/5 scroll-mt-20">
          <div className="px-6 mx-auto max-w-7xl">
            <div className="flex flex-col gap-12 items-center lg:flex-row lg:gap-24">
              {/* Image */}
              <div className="w-full lg:w-1/2">
                <div 
                  className="overflow-hidden relative rounded-3xl border shadow-2xl border-white/10 cursor-zoom-in group"
                  onClick={() => setLightboxSrc('https://i.imgur.com/w98rIak.jpeg')}
                >
                  <img 
                    src="https://i.imgur.com/w98rIak.jpeg" 
                    alt="Uniforme Técnico USGO"
                    className="object-cover w-full transition-transform duration-500 group-hover:scale-105"
                    draggable="false"
                  />
                  <div className="absolute top-4 right-4 p-2 rounded-full opacity-0 transition-opacity bg-black/70 group-hover:opacity-100">
                    <Maximize2 className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-8 w-full lg:w-1/2">
                <div>
                  <div className="inline-flex items-center gap-3 text-red-500 font-bold tracking-[0.2em] uppercase text-xs mb-4">
                    <span className="w-8 h-[1px] bg-red-600"></span>
                    Staff & Professores
                  </div>
                  <h2 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl">Linha Técnica</h2>
                  <p className="text-lg leading-relaxed text-gray-400">
                    Uniformes exclusivos para professores e staff da equipe USGO.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-4 p-5 rounded-xl border bg-white/5 border-white/10">
                    <Presentation className="w-8 h-8 text-red-500 shrink-0" />
                    <div>
                      <p className="font-bold text-white">Polo Técnica</p>
                      <p className="text-sm text-gray-500">Dry-fit, logo bordado, identificação PROFESSOR</p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-5 rounded-xl border bg-white/5 border-white/10">
                    <BadgeCheck className="w-8 h-8 text-red-500 shrink-0" />
                    <div>
                      <p className="font-bold text-white">Uniforme Staff</p>
                      <p className="text-sm text-gray-500">Exclusivo para equipe de apoio</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-16 bg-black border-t border-white/10">
          <div className="flex flex-col gap-8 justify-between items-center px-6 mx-auto max-w-7xl md:flex-row">
            <div className="flex gap-4 items-center">
              <img 
                src="/logo-branca.webp" 
                alt="USGO Jiu-Jitsu" 
                className="object-contain w-auto h-12 opacity-70"
                draggable="false"
              />
              <div className="flex flex-col">
                <span className="text-xs font-bold tracking-widest text-white uppercase">USGO JIU-JITSU</span>
                <span className="text-[10px] text-gray-600 tracking-wider">Manual de Uniformização</span>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-xs tracking-wide text-gray-500">© 2026 USGO Jiu-Jitsu. Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
