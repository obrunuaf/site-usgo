import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shirt, ArrowUp } from 'lucide-react';

export default function Header({ 
  onContactClick,
  scrollToSection,
  showBackToTop = false,
  onScrollToTop
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = useCallback((sectionId) => {
    setIsMobileMenuOpen(false);
    if (isHomePage && scrollToSection) {
      scrollToSection(sectionId);
    } else {
      // Navigate to home page with hash
      window.location.href = `/#${sectionId}`;
    }
  }, [isHomePage, scrollToSection]);

  const handleContactClick = useCallback(() => {
    setIsMobileMenuOpen(false);
    if (onContactClick) {
      onContactClick();
    }
  }, [onContactClick]);

  const navItems = [
    { id: 'inicio', label: 'Início' },
    { id: 'sobre', label: 'Sobre' },
    { id: 'escolas', label: 'Escolas' },
    { id: 'galeria', label: 'Galeria' },
    { id: 'faq', label: 'FAQ' },
  ];

  return (
    <>
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'py-3 border-b backdrop-blur-md bg-zinc-950/90 border-white/10' : 'py-5 bg-transparent'}`}>
        <div className="container flex justify-between items-center px-6 mx-auto">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex gap-3 items-center cursor-pointer group"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <img 
              src="/logo-branca.webp" 
              alt="USGO Logo" 
              className="h-10 md:h-12 w-auto object-contain drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://i.imgur.com/29dw1TX.png';
              }}
            />
            <div className="flex flex-col leading-none">
              <span className="text-xl md:text-2xl italic font-black tracking-tighter uppercase text-white group-hover:text-red-500 transition-colors">
                USGO <span className="text-red-600">Jiu-Jitsu</span>
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden gap-5 items-center text-[11px] font-bold tracking-wider uppercase xl:flex text-zinc-300">
            {navItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => handleNavClick(item.id)} 
                className="transition-colors hover:text-red-500"
              >
                {item.label}
              </button>
            ))}
            <Link 
              to="/uniformes" 
              className={`flex gap-1 items-center transition-colors hover:text-red-500 ${!isHomePage ? 'text-red-500' : ''}`}
            >
              <Shirt size={14} />
              Uniformes
            </Link>
            <button 
              onClick={handleContactClick}
              className="bg-white text-black px-5 py-2.5 hover:bg-red-600 hover:text-white transition-all duration-300 font-black skew-x-[-10deg]"
            >
              <span className="skew-x-[10deg] inline-block">Contato</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="text-white xl:hidden" 
            onClick={(e) => {
              e.stopPropagation();
              setIsMobileMenuOpen(!isMobileMenuOpen);
            }}
          >
            {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[200] xl:hidden">
          {/* Dark overlay */}
          <div 
            className="absolute inset-0 bg-black/80"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Menu panel */}
          <div 
            className="absolute top-0 right-0 left-0 shadow-2xl bg-zinc-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Menu header */}
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <div className="flex gap-3 items-center">
                <img 
                  src="/logo-branca.webp" 
                  alt="USGO Logo" 
                  className="object-contain w-auto h-10"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://i.imgur.com/29dw1TX.png';
                  }}
                />
                <span className="text-xl italic font-black tracking-tighter text-white uppercase">
                  USGO <span className="text-red-600">Jiu-Jitsu</span>
                </span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-white"
              >
                <X size={28} />
              </button>
            </div>
            {/* Menu items */}
            <div className="flex flex-col gap-4 p-6">
              {navItems.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => handleNavClick(item.id)} 
                  className="py-2 text-lg font-bold text-left text-zinc-300 hover:text-red-500"
                >
                  {item.label}
                </button>
              ))}
              <Link 
                to="/uniformes" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className={`py-2 text-lg font-bold text-left flex items-center gap-2 ${!isHomePage ? 'text-red-500' : 'text-zinc-300 hover:text-red-500'}`}
              >
                <Shirt size={18} />
                Uniformes
              </Link>
              <button 
                onClick={handleContactClick} 
                className="py-4 mt-4 w-full font-bold tracking-wider text-white uppercase bg-red-600 transition-colors hover:bg-red-700"
              >
                Contato
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-end gap-3">
        {/* WhatsApp Button */}
        <a
          href="https://wa.me/5564999999999?text=Olá!%20Gostaria%20de%20mais%20informações%20sobre%20as%20aulas."
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-14 h-14 bg-[#25d366] rounded-full text-white shadow-lg hover:scale-110 hover:shadow-xl transition-all cursor-pointer"
          aria-label="Contato via WhatsApp"
        >
          <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
        
        {/* Back to Top Button */}
        <button 
          onClick={onScrollToTop}
          className={`flex items-center justify-center w-14 h-14 bg-red-600 rounded-full text-white shadow-lg hover:bg-red-700 transition-all cursor-pointer ${
            showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
          aria-label="Voltar ao topo"
        >
          <ArrowUp size={24} />
        </button>
      </div>
    </>
  );
}
