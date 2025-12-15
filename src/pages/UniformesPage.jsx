import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Award, Palette, Check, ArrowUp, Maximize2, Copy, Shirt, Presentation, BadgeCheck, ArrowDown } from 'lucide-react';

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const [rashguardType, setRashguardType] = useState('adulto');
  const [selectedRank, setSelectedRank] = useState('blue');
  const [copied, setCopied] = useState(false);
  const [isHexBoxDark, setIsHexBoxDark] = useState(false);

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenuAndNavigate = () => {
    setIsMenuOpen(false);
  };

  const copyColor = () => {
    const text = RANKS[selectedRank].hex;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleRankSelect = (key) => {
    setSelectedRank(key);
    setIsHexBoxDark(key === 'black');
  };

  const currentRashguard = rashData[rashguardType];
  const currentRank = RANKS[selectedRank];

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 antialiased overflow-x-hidden selection:bg-red-600 selection:text-white">
      {/* Disable right-click */}
      <div onContextMenu={(e) => e.preventDefault()}>
        
        {/* HEADER */}
        <header className="fixed w-full top-0 z-50 bg-[#050505]/90 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-center h-20">
              {/* Logo - Link to home */}
              <Link to="/" className="flex items-center gap-3 group opacity-90 hover:opacity-100 transition z-50">
                <img 
                  src="https://i.imgur.com/29dw1TX.png" 
                  alt="USGO Jiu-Jitsu" 
                  className="h-8 md:h-10 w-auto object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]"
                  draggable="false"
                />
              </Link>
              
              {/* Menu Desktop */}
              <nav className="hidden md:flex gap-10 text-xs font-bold uppercase tracking-widest">
                <a href="#rashguard" className="text-gray-400 hover:text-white transition-colors py-2 relative group">
                  Rashguard Ranked
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-red-600 transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a href="#casual" className="text-gray-400 hover:text-white transition-colors py-2 relative group">
                  Casual
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-red-600 transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a href="#tecnico" className="text-gray-400 hover:text-white transition-colors py-2 relative group">
                  Técnico
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-red-600 transition-all duration-300 group-hover:w-full"></span>
                </a>
              </nav>

              {/* Mobile Menu Button */}
              <button 
                onClick={toggleMenu}
                className="md:hidden text-white p-2 z-50 focus:outline-none"
                aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              >
                {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        <div 
          className={`fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden transition-transform duration-400 ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <nav className="flex flex-col items-center gap-8 text-xl font-bold uppercase tracking-widest">
            <a href="#rashguard" onClick={closeMenuAndNavigate} className="text-gray-300 hover:text-red-500 transition-colors">Rashguard Ranked</a>
            <a href="#casual" onClick={closeMenuAndNavigate} className="text-gray-300 hover:text-red-500 transition-colors">Casual</a>
            <a href="#tecnico" onClick={closeMenuAndNavigate} className="text-gray-300 hover:text-red-500 transition-colors">Técnico</a>
          </nav>
          <div className="absolute bottom-10 text-[10px] text-gray-600 tracking-widest uppercase">
            USGO Jiu-Jitsu • Identidade Visual
          </div>
        </div>

        {/* LIGHTBOX */}
        {lightboxSrc && (
          <div 
            className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
            onClick={() => setLightboxSrc(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white hover:text-red-500 transition-colors z-50 bg-black/50 rounded-full p-2"
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
            <p className="absolute bottom-10 text-gray-400 text-xs uppercase tracking-widest animate-pulse">
              Toque fora para fechar
            </p>
          </div>
        )}

        {/* BACK TO TOP */}
        <button 
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 z-40 bg-white/10 backdrop-blur-md border border-white/20 text-white p-3 rounded-full shadow-lg transition-all duration-500 hover:bg-red-600 hover:border-red-500 hover:scale-110 focus:outline-none group ${
            showBackToTop ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-10 pointer-events-none'
          }`}
        >
          <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform duration-300" />
        </button>

        <main className="pt-20">
          
          {/* HERO SECTION */}
          <section className="relative py-20 md:py-32 lg:py-48 overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-600/30 to-transparent z-10"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-900/40 via-[#050505] to-[#050505] pointer-events-none"></div>
            
            <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
              <div className="inline-flex items-center gap-3 py-1.5 px-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8 group cursor-default hover:border-red-500/30 transition duration-500">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="text-[10px] font-bold tracking-[0.2em] text-gray-300 uppercase group-hover:text-white transition">Identidade Visual 2026</span>
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-6 text-white leading-[0.95] md:leading-[0.9]">
                PADRÃO DE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-600" style={{ textShadow: '0 0 20px rgba(255, 255, 255, 0.1)' }}>EXCELÊNCIA</span>
              </h1>
              
              <p className="text-base md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-light mb-10 px-4">
                O guia definitivo de uniformização da USGO. <br className="hidden md:block" /> Performance, identidade e disciplina em cada detalhe.
              </p>
              
              <div className="flex justify-center">
                <a href="#rashguard" className="group bg-white text-black px-8 py-4 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-gray-200 transition-all transform hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.1)] flex items-center gap-3">
                  Explorar Manual 
                  <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                </a>
              </div>
            </div>
          </section>

          {/* SECTION 1: RASHGUARD RANKED */}
          <section id="rashguard" className="py-20 md:py-32 bg-[#080808] relative border-t border-white/5 scroll-mt-20">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
                
                {/* Visual Column */}
                <div className="w-full lg:w-1/2 relative lg:sticky lg:top-32">
                  
                  {/* Seletor Adulto/Kids */}
                  <div className="flex p-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl mb-6 w-full max-w-sm mx-auto lg:mx-0">
                    <button 
                      onClick={() => setRashguardType('adulto')}
                      className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                        rashguardType === 'adulto' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Adulto
                    </button>
                    <button 
                      onClick={() => setRashguardType('kids')}
                      className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                        rashguardType === 'kids' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Kids
                    </button>
                  </div>

                  <div 
                    className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-[#111] group aspect-[4/5] cursor-zoom-in transition-transform duration-500 hover:translate-y-[-8px] hover:scale-[1.01]"
                    onClick={() => setLightboxSrc(currentRashguard.img)}
                  >
                    <img 
                      src={currentRashguard.img} 
                      alt="Rashguard USGO" 
                      className="w-full h-full object-cover transition-opacity duration-500"
                      draggable="false"
                    />
                    
                    {/* Floating Tag */}
                    <div className="absolute top-6 right-6 bg-[rgba(18,18,18,0.7)] backdrop-blur-xl border border-white/20 px-4 py-2 rounded-full pointer-events-none shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
                      <span className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                        <Award className="w-3.5 h-3.5 text-yellow-500" />
                        {currentRashguard.badge}
                      </span>
                    </div>

                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/90 to-transparent p-6 md:p-10 pt-32 pointer-events-none">
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{currentRashguard.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-[10px] md:text-xs font-medium text-gray-400 uppercase tracking-wider">
                        <span>{currentRashguard.spec1}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                        <span>{currentRashguard.spec2}</span>
                      </div>
                    </div>
                    
                    {/* Zoom Icon */}
                    <div className="absolute bottom-6 right-6 text-white/50 opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none">
                      <Maximize2 className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                {/* Technical Column */}
                <div className="w-full lg:w-1/2 space-y-10 md:space-y-14">
                  <div>
                    <div className="inline-flex items-center gap-3 text-red-500 font-bold tracking-[0.2em] uppercase text-xs mb-4">
                      <span className="w-8 h-[1px] bg-red-600"></span>
                      Especificações Técnicas
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6 tracking-tight">Sistema de Graduação</h2>
                    <p className="text-gray-400 text-base md:text-lg leading-relaxed font-light">
                      Baseada no design <strong className="text-white font-semibold">Performance Assimétrico</strong>. A predominância do preto (Sobriedade) é obrigatória, com a cor da graduação restrita às áreas geométricas laterais e acabamentos.
                    </p>
                  </div>

                  {/* Color Selector */}
                  <div className="relative rounded-3xl p-6 md:p-8 overflow-hidden bg-[rgba(18,18,18,0.7)] backdrop-blur-xl border border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
                    <div 
                      className="absolute -top-24 -right-24 w-64 md:w-80 h-64 md:h-80 rounded-full blur-[100px] transition-colors duration-700"
                      style={{ backgroundColor: currentRank.glow }}
                    ></div>

                    <div className="relative z-10">
                      <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.25em] mb-6 md:mb-8 flex items-center gap-3">
                        <Palette className="w-4 h-4" />
                        Seletor de Faixa
                      </h3>
                      
                      <div className="flex flex-wrap gap-2 md:gap-3 mb-8 md:mb-10">
                        {Object.entries(RANKS).map(([key, data]) => (
                          <button
                            key={key}
                            onClick={() => handleRankSelect(key)}
                            className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl border bg-neutral-900/40 hover:bg-white/5 transition-all duration-300 hover:scale-105 hover:border-white/30 flex-grow md:flex-grow-0 justify-center ${
                              selectedRank === key 
                                ? 'bg-white/10 border-white/50 ring-1 ring-white/10' 
                                : data.border ? 'border-red-600' : 'border-white/10'
                            }`}
                          >
                            <span 
                              className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]" 
                              style={{ backgroundColor: data.bg, border: '1px solid rgba(255,255,255,0.1)' }}
                            ></span>
                            <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${
                              selectedRank === key || data.dark ? 'text-white' : 'text-gray-500 group-hover:text-white'
                            }`}>
                              {key}
                            </span>
                          </button>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-[#050505]/50 rounded-2xl p-4 md:p-5 border border-white/5 backdrop-blur-sm">
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1.5">Referência</p>
                          <p className="text-lg font-bold text-white tracking-wide">{currentRank.name}</p>
                        </div>
                        
                        {/* HEX Box */}
                        <div 
                          className={`rounded-2xl p-4 md:p-5 border flex flex-col justify-center transition-all duration-500 ${
                            isHexBoxDark 
                              ? 'bg-white/95 border-white' 
                              : 'bg-[#050505]/50 border-white/5 backdrop-blur-sm'
                          }`}
                        >
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1.5">Código HEX</p>
                          <div 
                            className="flex items-center justify-between group/code cursor-pointer" 
                            onClick={copyColor}
                          >
                            <code 
                              className="text-lg font-mono font-bold tracking-tight transition-colors"
                              style={{ color: currentRank.hex }}
                            >
                              {currentRank.hex}
                            </code>
                            <button 
                              className={`p-1.5 rounded-md transition ${
                                copied 
                                  ? 'bg-green-500/10' 
                                  : isHexBoxDark 
                                    ? 'text-gray-400 hover:text-black hover:bg-black/5' 
                                    : 'text-gray-600 group-hover/code:text-white hover:bg-white/10'
                              }`}
                            >
                              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Requirements Checklist */}
                  <div className="border-t border-white/10 pt-8">
                    <ul className="grid grid-cols-1 gap-6">
                      <li className="flex gap-5 group">
                        <div className="h-10 w-10 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center text-white shrink-0 group-hover:border-green-500/50 group-hover:text-green-500 transition duration-300">
                          <Check className="w-5 h-5" />
                        </div>
                        <div>
                          <h5 className="text-white font-bold text-sm mb-1">Base 100% Preta</h5>
                          <p className="text-gray-500 text-xs leading-relaxed">Frente e costas sem poluição visual. Fundos coloridos não são permitidos.</p>
                        </div>
                      </li>
                      <li className="flex gap-5 group">
                        <div className="h-10 w-10 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center text-white shrink-0 group-hover:border-green-500/50 group-hover:text-green-500 transition duration-300">
                          <Check className="w-5 h-5" />
                        </div>
                        <div>
                          <h5 className="text-white font-bold text-sm mb-1">Contraste Obrigatório</h5>
                          <p className="text-gray-500 text-xs leading-relaxed">Logos frontais apenas em Branco ou Prata Fosco.</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: CASUAL */}
          <section id="casual" className="py-20 md:py-32 bg-[#050505] border-t border-white/5 scroll-mt-20">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col lg:flex-row-reverse gap-12 lg:gap-24 items-center">
                
                <div className="w-full lg:w-1/2">
                  <div 
                    className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 group cursor-zoom-in transition-transform duration-500 hover:translate-y-[-8px] hover:scale-[1.01]"
                    onClick={() => setLightboxSrc('https://i.imgur.com/6m4w1bY.jpeg')}
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-red-900/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 z-10 pointer-events-none"></div>
                    <img 
                      src="https://i.imgur.com/6m4w1bY.jpeg" 
                      alt="Camiseta Casual USGO" 
                      className="w-full h-auto object-cover group-hover:scale-105 transition duration-700"
                      draggable="false"
                    />
                    
                    <div className="absolute bottom-6 right-6 text-white/50 opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none z-20">
                      <Maximize2 className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-1/2 space-y-10 md:space-y-12">
                  <div>
                    <div className="inline-flex items-center gap-3 text-gray-500 font-bold tracking-[0.2em] uppercase text-xs mb-4">
                      <span className="w-8 h-[1px] bg-gray-600"></span>
                      Lifestyle
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6 tracking-tight">Fora do Tatame</h2>
                    <p className="text-gray-400 text-base md:text-lg leading-relaxed font-light">
                      A identidade da equipe além do treino. Minimalismo, algodão premium e cortes modernos para o dia a dia.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-5">
                    <div className="p-6 md:p-8 bg-[#0a0a0a] rounded-2xl border border-white/5 hover:border-white/20 transition duration-300 group">
                      <Shirt className="w-8 h-8 text-white mb-4 md:mb-6 group-hover:scale-110 transition duration-300" />
                      <h4 className="text-white font-bold text-lg mb-2">Modelo Aluno</h4>
                      <p className="text-sm text-gray-500 leading-relaxed">Camiseta preta base com estampa frontal centralizada (Logo USGO ou Variação Bandeira).</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* SECTION 3: TÉCNICO */}
          <section id="tecnico" className="py-20 md:py-32 bg-[#080808] border-t border-white/5 scroll-mt-20">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
                
                <div className="w-full lg:w-1/2">
                  <div 
                    className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 group cursor-zoom-in transition-transform duration-500 hover:translate-y-[-8px] hover:scale-[1.01]"
                    onClick={() => setLightboxSrc('https://i.imgur.com/w98rIak.jpeg')}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 pointer-events-none"></div>
                    <img 
                      src="https://i.imgur.com/w98rIak.jpeg" 
                      alt="Uniforme Técnico USGO" 
                      className="w-full h-auto object-cover group-hover:scale-105 transition duration-700"
                      draggable="false"
                    />
                    
                    <div className="absolute bottom-6 right-6 text-white/50 opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none z-20">
                      <Maximize2 className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-1/2 space-y-10 md:space-y-12">
                  <div>
                    <div className="inline-flex items-center gap-3 text-blue-500 font-bold tracking-[0.2em] uppercase text-xs mb-4">
                      <span className="w-8 h-[1px] bg-blue-500"></span>
                      Comissão & Suporte
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6 tracking-tight">Uniforme Técnico</h2>
                    <p className="text-gray-400 text-base md:text-lg leading-relaxed font-light">
                      Traje oficial para Professores e Alunos em suporte. Projetado para quem comanda a equipe fora do tatame, garantindo identidade visual profissional e conforto durante eventos.
                    </p>
                  </div>

                  <div className="flex flex-col gap-4">
                    {/* Item: Corner */}
                    <div className="flex gap-4 md:gap-6 p-5 md:p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-blue-500/30 hover:bg-blue-900/5 transition duration-300 group cursor-default">
                      <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0 group-hover:scale-110 transition duration-300">
                        <Shirt className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-base md:text-lg group-hover:text-blue-400 transition-colors">Uniforme de Corner</h4>
                        <p className="text-sm text-gray-500 mt-1 leading-relaxed">Identificação visual para professores e staff que não estão competindo. Obrigatório na área técnica.</p>
                      </div>
                    </div>
                    
                    {/* Item: Apresentação */}
                    <div className="flex gap-4 md:gap-6 p-5 md:p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-blue-500/30 hover:bg-blue-900/5 transition duration-300 group cursor-default">
                      <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0 group-hover:scale-110 transition duration-300">
                        <Presentation className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-base md:text-lg group-hover:text-blue-400 transition-colors">Apresentação Oficial</h4>
                        <p className="text-sm text-gray-500 mt-1 leading-relaxed">Mantém o padrão profissional da equipe em pódios, entrevistas e eventos oficiais.</p>
                      </div>
                    </div>

                    {/* Item: Staff */}
                    <div className="relative flex gap-4 md:gap-6 p-5 md:p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition duration-300 group overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-white group-hover:bg-red-600 transition-colors duration-300"></div>
                      <div className="h-12 w-12 rounded-xl bg-neutral-800 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition duration-300">
                        <BadgeCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-base md:text-lg group-hover:text-red-500 transition-colors">Uniforme Staff</h4>
                        <p className="text-sm text-gray-400 mt-1 leading-relaxed">
                          Exclusivo. Assinatura dorsal em caixa alta branca: <strong className="text-white">"PROFESSOR"</strong> ou <strong className="text-white">"INSTRUTOR"</strong>.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="bg-black border-t border-white/10 py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10 opacity-80 hover:opacity-100 transition duration-500">
              <div className="flex items-center gap-4 grayscale hover:grayscale-0 transition duration-500">
                <img 
                  src="https://i.imgur.com/29dw1TX.png" 
                  alt="USGO Jiu-Jitsu" 
                  className="h-10 md:h-14 w-auto object-contain"
                  draggable="false"
                />
                <div className="h-8 w-[1px] bg-white/10"></div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white tracking-widest uppercase">USGO JIU-JITSU</span>
                  <span className="text-[10px] text-gray-600 tracking-wider">Manual Interno</span>
                </div>
              </div>
              
              <div className="text-center md:text-right">
                <p className="text-gray-500 text-xs tracking-wide">© 2026 USGO Jiu-Jitsu. Todos os direitos reservados.</p>
                <p className="text-neutral-700 text-[10px] mt-2 tracking-widest uppercase">Desenvolvido para padronização interna</p>
              </div>
            </div>
          </footer>

        </main>
      </div>
    </div>
  );
}
