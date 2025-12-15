import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, ChevronUp, MapPin, Phone, Mail, Instagram, ArrowRight, Search, Shield, Target, Globe, Navigation, ArrowUp, Send, CheckCircle, User, MessageSquare, MessageCircle, ChevronLeft, ChevronRight, Shirt } from 'lucide-react';

// ===== CUSTOM HOOKS =====

// Hook para detectar quando elemento entra na viewport
function useInView(options = {}) {
  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated) {
        setIsInView(true);
        setHasAnimated(true);
      }
    }, { threshold: 0.1, ...options });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated, options]);

  return [ref, isInView];
}

// Hook de debounce para otimizar a busca
function useDebounce(value, delay = 150) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// ===== COMPONENTS =====

// Componente de imagem com skeleton loader
function ImageWithLoader({ src, alt, className, onError, ...props }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-full h-full">
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 skeleton" />
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
        onLoad={() => setIsLoaded(true)}
        onError={(e) => {
          setHasError(true);
          setIsLoaded(true);
          if (onError) onError(e);
        }}
        {...props}
      />
    </div>
  );
}

// Componente de Lightbox para galeria
function Lightbox({ image, alt, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose}>
        <X size={24} />
      </button>
      <img src={image} alt={alt} className="lightbox-image" />
    </div>
  );
}

// Componente animado na scroll
function AnimatedSection({ children, className = '', animation = 'animate-fade-in-up', delay = '' }) {
  const [ref, isInView] = useInView();
  
  return (
    <div 
      ref={ref} 
      className={`${className} ${isInView ? `${animation} ${delay}` : 'opacity-0'}`}
      style={{ opacity: isInView ? undefined : 0 }}
    >
      {children}
    </div>
  );
}

// Componente FAQ com animação suave
function FaqItem({ question, answer, isOpen, onToggle }) {
  const contentRef = useRef(null);
  
  return (
    <div className="overflow-hidden border border-white/10 bg-zinc-950/50">
      <button 
        onClick={onToggle} 
        className="flex justify-between items-center p-6 w-full text-left transition-colors hover:bg-zinc-800"
      >
        <span className="text-lg font-bold text-zinc-200">{question}</span>
        <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown className={isOpen ? 'text-red-600' : 'text-zinc-500'} />
        </span>
      </button>
      <div 
        ref={contentRef}
        className={`faq-answer ${isOpen ? 'open' : ''}`}
        style={{ 
          maxHeight: isOpen ? contentRef.current?.scrollHeight + 'px' : '0' 
        }}
      >
        <div className="p-6 pt-0 leading-relaxed border-t text-zinc-400 border-white/5">
          {answer}
        </div>
      </div>
    </div>
  );
}

// Componente de formulário de contato
function ContactForm({ onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Mensagem é obrigatória';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simular envio (substituir por integração real)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    // Fechar após 2 segundos
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (isSuccess) {
    return (
      <div className="contact-modal-overlay" onClick={onClose}>
        <div className="p-8 text-center contact-modal" onClick={e => e.stopPropagation()}>
          <div className="flex justify-center items-center mx-auto mb-6 w-20 h-20 bg-green-600 rounded-full">
            <CheckCircle size={48} className="text-white" />
          </div>
          <h3 className="mb-2 text-2xl font-black text-white uppercase">Mensagem Enviada!</h3>
          <p className="text-zinc-400">Entraremos em contato em breve.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-modal-overlay" onClick={onClose}>
      <div className="contact-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="contact-title">
        <div className="flex justify-between items-center p-6 border-b border-zinc-800">
          <h2 id="contact-title" className="text-xl font-black text-white uppercase">Fale Conosco</h2>
          <button 
            onClick={onClose} 
            className="flex justify-center items-center w-10 h-10 transition-colors text-zinc-400 hover:text-white hover:bg-zinc-800"
            aria-label="Fechar formulário"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="name" className="form-label">Nome</label>
            <div className="relative">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="Seu nome completo"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            </div>
            {errors.name && <p id="name-error" className="form-error">{errors.name}</p>}
          </div>
          
          <div>
            <label htmlFor="email" className="form-label">Email</label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="seu@email.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            </div>
            {errors.email && <p id="email-error" className="form-error">{errors.email}</p>}
          </div>
          
          <div>
            <label htmlFor="phone" className="form-label">Telefone</label>
            <div className="relative">
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`form-input ${errors.phone ? 'error' : ''}`}
                placeholder="(00) 00000-0000"
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
              />
              <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            </div>
            {errors.phone && <p id="phone-error" className="form-error">{errors.phone}</p>}
          </div>
          
          <div>
            <label htmlFor="message" className="form-label">Mensagem</label>
            <div className="relative">
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className={`form-input resize-none ${errors.message ? 'error' : ''}`}
                placeholder="Como podemos ajudar?"
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? 'message-error' : undefined}
              />
              <MessageSquare size={18} className="absolute top-4 left-4 text-zinc-500" />
            </div>
            {errors.message && <p id="message-error" className="form-error">{errors.message}</p>}
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex gap-2 justify-center items-center py-4 w-full font-bold tracking-wider text-white uppercase bg-red-600 transition-colors hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 rounded-full border-2 animate-spin border-white/30 border-t-white"></div>
                Enviando...
              </>
            ) : (
              <>
                <Send size={18} />
                Enviar Mensagem
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showWhatsAppBubble, setShowWhatsAppBubble] = useState(true);
  
  // IMAGENS DA PASTA PUBLIC
  const images = {
    logo: "/logo-branca.webp",
    heroBg: "/MG_4085.webp",
    legacyCard: "/arthur-card.webp"
  };

  // Dados das Unidades com coordenadas
  const unitsData = [
    // GOIÁS
    { id: 1, name: "USGO Itumbiara - Centro", city: "Itumbiara", state: "GO", address: "Centro, Itumbiara - GO", phone: "(64) 99999-9999", mapQuery: "USGO Jiu Jitsu Itumbiara Centro GO", featured: true, lat: -18.4097, lng: -49.2181 },
    { id: 2, name: "USGO Itumbiara - N.S. Saúde", city: "Itumbiara", state: "GO", address: "Bairro Nossa Senhora da Saúde, Itumbiara - GO", phone: "(64) 99999-9999", mapQuery: "Nossa Senhora da Saude Itumbiara GO", featured: false, lat: -18.4150, lng: -49.2100 },
    { id: 3, name: "USGO Itumbiara - Paranaíba", city: "Itumbiara", state: "GO", address: "Bairro Paranaíba, Itumbiara - GO", phone: "(64) 99999-9999", mapQuery: "Bairro Paranaiba Itumbiara GO", featured: false, lat: -18.4050, lng: -49.2250 },
    { id: 4, name: "USGO Itumbiara", city: "Itumbiara", state: "GO", address: "Itumbiara - GO", phone: "(64) 99999-9999", mapQuery: "Itumbiara Goias", featured: false, lat: -18.4097, lng: -49.2181 },
    { id: 5, name: "USGO Aparecida - Pq. Rio das Pedras", city: "Aparecida de Goiânia", state: "GO", address: "Pq. Rio das Pedras, Aparecida de Goiânia - GO", phone: "(62) 99999-9999", mapQuery: "Parque Rio das Pedras Aparecida de Goiania GO", featured: false, lat: -16.8200, lng: -49.2450 },
    { id: 6, name: "USGO Aparecida - Construindo Campeões", city: "Aparecida de Goiânia", state: "GO", address: "Proj. Construindo Campeões, Aparecida de Goiânia - GO", phone: "(62) 99999-9999", mapQuery: "Aparecida de Goiania GO", featured: false, lat: -16.8230, lng: -49.2430 },
    { id: 7, name: "USGO Aparecida - Pq. Vera Cruz", city: "Aparecida de Goiânia", state: "GO", address: "Pq. Vera Cruz, Aparecida de Goiânia - GO", phone: "(62) 99999-9999", mapQuery: "Parque Vera Cruz Aparecida de Goiania GO", featured: false, lat: -16.8250, lng: -49.2480 },
    { id: 8, name: "USGO Bom Jesus", city: "Bom Jesus", state: "GO", address: "Bom Jesus - GO", phone: "(64) 99999-9999", mapQuery: "Bom Jesus Goias", featured: false, lat: -18.2167, lng: -49.7392 },
    { id: 9, name: "USGO Buriti Alegre", city: "Buriti Alegre", state: "GO", address: "Buriti Alegre - GO", phone: "(64) 99999-9999", mapQuery: "Buriti Alegre Goias", featured: false, lat: -18.1386, lng: -49.0403 },
    { id: 10, name: "USGO Caldas Novas - Serrinha", city: "Caldas Novas", state: "GO", address: "St. Serrinha, Caldas Novas - GO", phone: "(64) 99999-9999", mapQuery: "Setor Serrinha Caldas Novas GO", featured: false, lat: -17.7417, lng: -48.6253 },
    { id: 11, name: "USGO Caldas Novas - Nova Canaã", city: "Caldas Novas", state: "GO", address: "Res. Nova Canaã, Caldas Novas - GO", phone: "(64) 99999-9999", mapQuery: "Residencial Nova Canaa Caldas Novas GO", featured: false, lat: -17.7450, lng: -48.6280 },
    { id: 12, name: "USGO Caldas Novas - Jd. Tangará", city: "Caldas Novas", state: "GO", address: "Jd. Tangará, Caldas Novas - GO", phone: "(64) 99999-9999", mapQuery: "Jardim Tangara Caldas Novas GO", featured: false, lat: -17.7480, lng: -48.6220 },
    { id: 13, name: "USGO Joviânia", city: "Joviânia", state: "GO", address: "Joviânia - GO", phone: "(64) 99999-9999", mapQuery: "Joviania Goias", featured: false, lat: -17.8031, lng: -49.6117 },
    { id: 14, name: "USGO Morrinhos", city: "Morrinhos", state: "GO", address: "Morrinhos - GO", phone: "(64) 99999-9999", mapQuery: "Morrinhos Goias", featured: false, lat: -17.7319, lng: -49.1014 },
    { id: 15, name: "USGO Morrinhos - Assoc. IBI", city: "Morrinhos", state: "GO", address: "Associação Cultural e Educativa IBI, Morrinhos - GO", phone: "(64) 99999-9999", mapQuery: "Morrinhos Goias", featured: false, lat: -17.7350, lng: -49.0980 },
    { id: 16, name: "USGO Quirinópolis", city: "Quirinópolis", state: "GO", address: "Quirinópolis - GO", phone: "(64) 99999-9999", mapQuery: "Quirinopolis Goias", featured: false, lat: -18.4483, lng: -50.4514 },
    { id: 17, name: "USGO Rio Quente", city: "Rio Quente", state: "GO", address: "Rio Quente - GO", phone: "(64) 99999-9999", mapQuery: "Rio Quente Goias", featured: false, lat: -17.7756, lng: -48.7664 },
    { id: 18, name: "USGO Vianópolis", city: "Vianópolis", state: "GO", address: "Vianópolis - GO", phone: "(62) 99999-9999", mapQuery: "Vianopolis Goias", featured: false, lat: -16.7414, lng: -48.5164 },
    // MINAS GERAIS
    { id: 19, name: "USGO Uberlândia - Segismundo Pereira", city: "Uberlândia", state: "MG", address: "Bairro Segismundo Pereira, Uberlândia - MG", phone: "(34) 99999-9999", mapQuery: "Segismundo Pereira Uberlandia MG", featured: false, lat: -18.9186, lng: -48.2772 },
    { id: 20, name: "USGO Uberlândia - Marta Helena", city: "Uberlândia", state: "MG", address: "Bairro Marta Helena, Uberlândia - MG", phone: "(34) 99999-9999", mapQuery: "Marta Helena Uberlandia MG", featured: false, lat: -18.8850, lng: -48.2650 },
    // MATO GROSSO DO SUL
    { id: 21, name: "USGO Batayporã", city: "Batayporã", state: "MS", address: "Batayporã - MS", phone: "(67) 99999-9999", mapQuery: "Bataypora Mato Grosso do Sul", featured: false, lat: -22.2947, lng: -53.2697 },
    { id: 22, name: "USGO Nova Andradina", city: "Nova Andradina", state: "MS", address: "Nova Andradina - MS", phone: "(67) 99999-9999", mapQuery: "Nova Andradina Mato Grosso do Sul", featured: false, lat: -22.2353, lng: -53.3436 },
  ];

  const [selectedUnit, setSelectedUnit] = useState(unitsData[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const unitsListRef = useRef(null);

  // Calculate distance between two points (Haversine formula)
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Geolocation - find nearest unit
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Find nearest unit
          let nearestUnit = unitsData[0];
          let minDistance = Infinity;
          
          unitsData.forEach(unit => {
            const distance = calculateDistance(latitude, longitude, unit.lat, unit.lng);
            if (distance < minDistance) {
              minDistance = distance;
              nearestUnit = unit;
            }
          });
          
          setSelectedUnit(nearestUnit);
          
          // Scroll the units list to show the nearest unit card
          setTimeout(() => {
            // For desktop: scroll the container
            if (unitsListRef.current) {
              const container = unitsListRef.current;
              const unitCard = container.querySelector(`#unit-card-${nearestUnit.id}`);
              if (unitCard) {
                const containerRect = container.getBoundingClientRect();
                const cardRect = unitCard.getBoundingClientRect();
                const scrollOffset = cardRect.top - containerRect.top + container.scrollTop;
                const centerOffset = (containerRect.height / 2) - (cardRect.height / 2);
                container.scrollTo({ top: scrollOffset - centerOffset, behavior: 'smooth' });
              }
            }
            
            // For mobile: scroll horizontally
            const mobileCard = document.getElementById(`unit-card-${nearestUnit.id}`);
            if (mobileCard) {
              mobileCard.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }
          }, 800);
        },
        () => {
          // User denied or error - keep default selection
          console.log('Geolocation não disponível ou negada');
        },
        { timeout: 5000, enableHighAccuracy: false }
      );
    }
  }, []);

  // Scroll handlers
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = useCallback((id) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqData = [
    { question: "Qual a idade mínima para começar?", answer: "Nossa metodologia Kids aceita crianças a partir de 4 anos de idade, com foco em disciplina e coordenação motora." },
    { question: "Preciso ter experiência prévia?", answer: "Não. Temos turmas específicas para iniciantes onde ensinamos os fundamentos básicos com total segurança." },
    { question: "Quais são os horários de treino?", answer: "Oferecemos horários flexíveis de manhã, tarde e noite. Consulte a unidade mais próxima em 'Escolas' para a grade detalhada." },
    { question: "É obrigatório usar o kimono da equipe?", answer: "Sim. Para manter a padronização, disciplina e segurança, o uso do uniforme oficial USGO é obrigatório em todas as aulas." },
  ];

  const galleryImages = [
    { src: "/MG_4312.webp", alt: "Competição", className: "col-span-2 row-span-2" },
    { src: "kids.jpeg", alt: "Kids", className: "col-span-1 row-span-1" },
    { src: "dojo.jpeg", alt: "Dojo", className: "col-span-1 row-span-2" },
    { src: "MG_4085.webp", alt: "Detalhe", className: "col-span-1 row-span-1" },
  ];

  // Debounce search term for better performance
  const debouncedSearchTerm = useDebounce(searchTerm, 150);
  
  const filteredUnits = useMemo(() => {
    if (!debouncedSearchTerm) return unitsData;
    const search = debouncedSearchTerm.toLowerCase();
    return unitsData.filter(unit => 
      unit.name.toLowerCase().includes(search) ||
      unit.city.toLowerCase().includes(search)
    );
  }, [debouncedSearchTerm]);

  return (
    <div className="min-h-screen font-sans text-white bg-zinc-950 selection:bg-red-600 selection:text-white">
      
      {/* Lightbox */}
      {lightboxImage && (
        <Lightbox 
          image={lightboxImage.src} 
          alt={lightboxImage.alt} 
          onClose={() => setLightboxImage(null)} 
        />
      )}

      {/* Contact Form Modal */}
      {showContactForm && (
        <ContactForm onClose={() => setShowContactForm(false)} />
      )}



      {/* Floating Action Buttons Container */}
      <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-end gap-3">
        
        {/* WhatsApp Chat Bubble */}
        {showWhatsAppBubble && (
          <div className="flex gap-2 items-center animate-fade-in">
            <div className="relative bg-white text-zinc-800 px-4 py-3 rounded-xl shadow-xl max-w-[200px]">
              <button 
                onClick={() => setShowWhatsAppBubble(false)}
                className="flex absolute -top-2 -right-2 justify-center items-center w-6 h-6 text-xs font-bold rounded-full transition-colors bg-zinc-200 hover:bg-zinc-300 text-zinc-600"
                aria-label="Fechar"
              >
                ✕
              </button>
              <p className="text-sm font-semibold">👋 Olá! Precisa de ajuda?</p>
              <p className="mt-1 text-xs text-zinc-500">Fale conosco pelo WhatsApp</p>
              {/* Triangle pointer */}
              <div className="absolute -bottom-2 right-4 w-0 h-0 border-t-8 border-r-8 border-l-8 border-transparent border-t-white"></div>
            </div>
          </div>
        )}
        
        {/* WhatsApp Button with official icon */}
        <a
          href="https://wa.me/5564999999999?text=Olá!%20Gostaria%20de%20mais%20informações%20sobre%20as%20aulas."
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex items-center justify-center w-14 h-14 bg-[#25d366] rounded-full text-white shadow-lg hover:scale-110 hover:shadow-xl transition-all cursor-pointer"
          aria-label="Contato via WhatsApp"
        >
          {/* WhatsApp SVG Icon */}
          <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
        
        {/* Back to Top Button */}
        <button 
          onClick={scrollToTop}
          className={`flex items-center justify-center w-14 h-14 bg-red-600 rounded-full text-white shadow-lg hover:bg-red-700 transition-all cursor-pointer ${
            showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
          aria-label="Voltar ao topo"
        >
          <ArrowUp size={24} />
        </button>
      </div>

      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'py-4 border-b backdrop-blur-md bg-zinc-950/90 border-white/10' : 'py-6 bg-transparent'}`}>
        <div className="container flex justify-between items-center px-6 mx-auto">
          <div className="flex gap-3 items-center cursor-pointer" onClick={() => scrollToSection('inicio')}>
            <img 
              src={images.logo} 
              alt="USGO Logo" 
              className="h-12 w-auto object-contain drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden gap-2 items-center" style={{display: 'none'}}>
               <div className="flex justify-center items-center w-10 h-10 text-xl italic font-bold tracking-tighter bg-red-600 rounded-sm">US</div>
            </div>
            
            <div className="flex flex-col leading-none">
              <span className="text-2xl italic font-black tracking-tighter uppercase">
                USGO <span className="text-red-600">Jiu-Jitsu</span>
              </span>
            </div>
          </div>

          <div className="hidden gap-8 items-center text-xs font-bold tracking-widest uppercase lg:flex text-zinc-300">
            <button onClick={() => scrollToSection('inicio')} className="transition-colors hover:text-red-500" aria-label="Ir para início">Início</button>
            <button onClick={() => scrollToSection('sobre')} className="transition-colors hover:text-red-500" aria-label="Ir para sobre">Sobre</button>
            <button onClick={() => scrollToSection('escolas')} className="transition-colors hover:text-red-500" aria-label="Ir para escolas">Escolas</button>
            <button onClick={() => scrollToSection('filiacoes')} className="transition-colors hover:text-red-500" aria-label="Ir para filiações">Filiações</button>
            <button onClick={() => scrollToSection('galeria')} className="transition-colors hover:text-red-500" aria-label="Ir para galeria">Galeria</button>
            <button onClick={() => scrollToSection('faq')} className="transition-colors hover:text-red-500" aria-label="Ir para perguntas frequentes">Perguntas Frequentes</button>
            <Link to="/uniformes" className="flex gap-1 items-center transition-colors hover:text-red-500" aria-label="Ir para uniformes"><Shirt size={14} />Uniformes</Link>
            <button 
              onClick={() => setShowContactForm(true)}
              className="bg-white text-black px-6 py-3 hover:bg-red-600 hover:text-white transition-all duration-300 font-black skew-x-[-10deg]"
              aria-label="Abrir formulário de contato"
            >
              <span className="skew-x-[10deg] inline-block">Contato</span>
            </button>
          </div>

          <button 
            className="text-white lg:hidden" 
            onClick={(e) => {
              e.stopPropagation();
              setIsMobileMenuOpen(!isMobileMenuOpen);
            }}
          >
            {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu - Outside nav for proper z-index */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden">
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
            {/* Menu header with logo and close button */}
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <div className="flex gap-3 items-center">
                <img 
                  src={images.logo} 
                  alt="USGO Logo" 
                  className="object-contain w-auto h-10"
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
              <button onClick={() => scrollToSection('inicio')} className="py-2 text-lg font-bold text-left text-zinc-300 hover:text-red-500">Início</button>
              <button onClick={() => scrollToSection('sobre')} className="py-2 text-lg font-bold text-left text-zinc-300 hover:text-red-500">Sobre</button>
              <button onClick={() => scrollToSection('escolas')} className="py-2 text-lg font-bold text-left text-zinc-300 hover:text-red-500">Escolas</button>
              <button onClick={() => scrollToSection('filiacoes')} className="py-2 text-lg font-bold text-left text-zinc-300 hover:text-red-500">Filiações</button>
              <button onClick={() => scrollToSection('galeria')} className="py-2 text-lg font-bold text-left text-zinc-300 hover:text-red-500">Galeria</button>
              <button onClick={() => scrollToSection('faq')} className="py-2 text-lg font-bold text-left text-zinc-300 hover:text-red-500">Perguntas Frequentes</button>
              <Link to="/uniformes" onClick={() => setIsMobileMenuOpen(false)} className="flex gap-2 items-center py-2 text-lg font-bold text-left text-zinc-300 hover:text-red-500"><Shirt size={18} />Uniformes</Link>
              <button 
                onClick={() => { setIsMobileMenuOpen(false); setShowContactForm(true); }} 
                className="py-4 mt-4 w-full font-bold tracking-wider text-white uppercase bg-red-600 transition-colors hover:bg-red-700"
              >
                Contato
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section id="inicio" className="flex overflow-hidden relative justify-center items-center h-screen">
        <div className="absolute inset-0 z-0">
          <ImageWithLoader 
            src={images.heroBg} 
            alt="USGO Hero Background" 
            className="object-cover object-center w-full h-full"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=2070&auto=format&fit=crop'; }}
          />
          <div className="absolute inset-0 bg-zinc-950/80"></div>
          <div className="absolute inset-0 bg-gradient-to-r to-transparent from-zinc-950 via-zinc-950/50"></div>
        </div>

        <div className="container relative z-10 px-6 pt-20 mx-auto">
          <div className="max-w-5xl">
            <div className="inline-flex gap-3 items-center mb-6 animate-fade-in">
               <div className="h-[2px] w-12 bg-red-600"></div>
               <span className="text-red-500 font-bold uppercase tracking-[0.3em] text-sm">Brazilian Jiu-Jitsu</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-8 text-white animate-fade-in-up">
              Mais que um time,<br/>
              uma <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">Família.</span>
            </h1>
            <p className="py-2 pl-6 mb-12 max-w-2xl text-lg font-light border-l-4 delay-200 md:text-2xl text-zinc-300 border-white/20 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              Liderada por Arthur Claudino. Excelência técnica, valores inegociáveis e um ambiente forjado para o seu crescimento.
            </p>
            <div className="flex flex-col gap-5 delay-300 sm:flex-row animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <button onClick={() => scrollToSection('escolas')} className="bg-red-600 hover:bg-red-700 text-white px-10 py-5 text-sm font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(220,38,38,0.3)] hover:shadow-[0_15px_40px_rgba(220,38,38,0.4)] hover:-translate-y-1">
                <MapPin size={18} />
                Encontrar Escola
              </button>
              <button onClick={() => scrollToSection('sobre')} className="px-10 py-5 text-sm font-bold tracking-widest text-white uppercase border transition-all border-white/20 hover:bg-white hover:text-black hover:-translate-y-1">
                Conhecer a História
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator - hidden on mobile */}
        <div className="hidden scroll-indicator sm:flex" onClick={() => scrollToSection('sobre')}>
          <span>Scroll</span>
          <div className="scroll-indicator-arrow"></div>
        </div>
      </section>

      {/* Legacy Section */}
      <section id="sobre" className="relative py-24 bg-zinc-900">
        <div className="container px-6 mx-auto">
          <div className="grid gap-12 items-center lg:grid-cols-12">
            <AnimatedSection className="relative lg:col-span-5" animation="animate-slide-in-left">
              <div className="relative z-10 aspect-[3/4] rounded-sm overflow-hidden bg-zinc-800 transition-all duration-700 shadow-2xl image-hover-zoom">
                 <ImageWithLoader 
                    src={images.legacyCard} 
                    className="object-cover w-full h-full" 
                    alt="Arthur Claudino - Fundador USGO" 
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=2069&auto=format&fit=crop'; }}
                 />
                 <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t to-transparent from-black/90">
                    <h3 className="text-2xl italic font-black uppercase">Arthur Claudino</h3>
                    <p className="text-xs font-bold tracking-widest text-red-500 uppercase">Fundador & Head Coach</p>
                 </div>
              </div>
              <div className="hidden absolute -top-10 -left-10 z-0 w-full h-full border-2 border-red-600/20 lg:block"></div>
            </AnimatedSection>

            <AnimatedSection className="lg:col-span-7" animation="animate-slide-in-right">
              <h2 className="mb-4 text-sm font-bold tracking-widest text-red-600 uppercase">Sobre Nós</h2>
              <h3 className="mb-8 text-4xl font-black tracking-tighter leading-none text-white uppercase md:text-5xl">
                "Coragem e<br/> Paz Interior"
              </h3>
              <div className="space-y-6 text-lg leading-relaxed text-zinc-400">
                <p><span className="font-bold text-white">A USGO nasceu de um propósito claro:</span> utilizar o Jiu-Jitsu não apenas como defesa pessoal, mas como uma ferramenta poderosa de transformação humana.</p>
                <p>"Alguns chegam em nossas escolas em busca de desenvolver confiança, aptidão física e inteligência. Outros procuram gerar um senso de coragem e paz interior. Na USGO, entregamos tudo isso através de um método testado e aprovado."</p>
              </div>
              <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-3">
                 <div className="p-6 border transition-colors bg-zinc-950 border-zinc-800 hover:border-red-600/50 group">
                    <Target className="mb-3 text-red-600 transition-transform group-hover:scale-110" />
                    <h4 className="mb-2 text-sm font-bold uppercase">Metodologia</h4>
                    <p className="text-xs text-zinc-500">Ensino progressivo e seguro.</p>
                 </div>
                 <div className="p-6 border transition-colors bg-zinc-950 border-zinc-800 hover:border-red-600/50 group">
                    <Shield className="mb-3 text-red-600 transition-transform group-hover:scale-110" />
                    <h4 className="mb-2 text-sm font-bold uppercase">Ambiente</h4>
                    <p className="text-xs text-zinc-500">Respeito e disciplina acima de tudo.</p>
                 </div>
                 <div className="p-6 border transition-colors bg-zinc-950 border-zinc-800 hover:border-red-600/50 group">
                    <Globe className="mb-3 text-red-600 transition-transform group-hover:scale-110" />
                    <h4 className="mb-2 text-sm font-bold uppercase">Comunidade</h4>
                    <p className="text-xs text-zinc-500">Uma rede global de suporte.</p>
                 </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Filiações Section */}
      <section id="filiacoes" className="py-20 bg-zinc-950">
        <div className="container px-6 mx-auto">
          <AnimatedSection className="mb-12 text-center">
            <h2 className="text-4xl italic font-black tracking-tighter text-white uppercase md:text-5xl">
              Filiações
            </h2>
          </AnimatedSection>
          
          {/* Logos das Federações */}
          <AnimatedSection className="flex flex-wrap gap-8 justify-center items-center mb-8 md:gap-12" animation="animate-fade-in" delay="delay-200">
            <img src="/filiacoes/sport-jj-logo.webp" alt="Sport Jiu-Jitsu" className="object-contain h-14 opacity-80 transition-all md:h-20 hover:opacity-100 hover:scale-110" />
            <img src="/filiacoes/UAE.webp" alt="UAE JJF" className="object-contain h-24 opacity-80 transition-all md:h20 hover:opacity-100 hover:scale-110" />
            <img src="/filiacoes/Sjjsaf.webp" alt="SJJSAF" className="object-contain h-14 opacity-80 transition-all md:h-20 hover:opacity-100 hover:scale-110" />
            <div className="p-2 bg-white rounded-lg transition-transform hover:scale-110">
              <img src="/filiacoes/fsmjj.webp" alt="FSMJJ" className="object-contain h-10 md:h-16" />
            </div>
          </AnimatedSection>
          
          {/* Segunda linha de logos */}
          <AnimatedSection className="flex flex-wrap gap-8 justify-center items-center md:gap-12" animation="animate-fade-in" delay="delay-300">
            <img src="/filiacoes/IBJJF.webp" alt="IBJJF" className="object-contain h-14 opacity-80 transition-all md:h-20 hover:opacity-100 hover:scale-110" />
            <img src="/filiacoes/cbjj.webp" alt="CBJJ" className="object-contain h-14 opacity-80 transition-all md:h-20 hover:opacity-100 hover:scale-110" />
          </AnimatedSection>
        </div>
      </section>

      {/* Units Section */}
      <section id="escolas" className="relative py-16 bg-white md:py-24 text-zinc-950">
        <div className="container px-4 mx-auto md:px-6">
          <AnimatedSection className="mb-8 md:mb-12">
            <div className="text-center md:text-left">
              <h2 className="mb-2 text-sm font-bold tracking-widest text-red-600 uppercase">Nossas Unidades</h2>
              <h3 className="text-3xl font-black tracking-tighter uppercase md:text-5xl">Encontre sua Escola</h3>
            </div>
            <div className="mt-6 md:mt-4">
               <div className="relative w-full md:w-80 md:ml-auto">
                 <input 
                   type="text" 
                   placeholder="Buscar cidade..." 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="p-4 pr-12 w-full text-sm font-bold uppercase rounded-lg border-none transition-shadow outline-none bg-zinc-100 placeholder:text-zinc-400 focus:ring-2 focus:ring-red-600" 
                 />
                 <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
               </div>
            </div>
          </AnimatedSection>

          {/* Mobile: Horizontal scroll cards + Map below */}
          <div className="space-y-6 lg:hidden">
            {/* Horizontal scrolling cards */}
            <div className="flex overflow-x-auto gap-4 px-4 pb-4 -mx-4 snap-x snap-mandatory scrollbar-hide">
              {filteredUnits.length > 0 ? (
                filteredUnits.map((unit) => (
                  <div 
                    key={unit.id}
                    id={`unit-card-${unit.id}`}
                    onClick={() => setSelectedUnit(unit)}
                    className={`flex-shrink-0 w-[280px] p-5 rounded-xl border-2 transition-all cursor-pointer snap-start ${
                      selectedUnit.id === unit.id 
                        ? 'bg-zinc-900 text-white border-red-600 shadow-xl' 
                        : 'bg-zinc-50 border-zinc-200'
                    }`}
                  >
                    {unit.featured && (
                      <span className="inline-block text-[10px] bg-red-600 text-white px-2 py-1 font-bold uppercase rounded mb-2">Matriz</span>
                    )}
                    <h4 className="text-lg font-black leading-tight uppercase">{unit.name}</h4>
                    <div className="flex gap-2 items-center mt-2 text-xs font-semibold uppercase opacity-70">
                       <MapPin size={12} /> {unit.city} - {unit.state}
                    </div>
                    <p className={`text-sm mt-3 ${selectedUnit.id === unit.id ? 'text-zinc-400' : 'text-zinc-500'}`}>{unit.address}</p>
                    <div className={`mt-4 text-xs font-bold uppercase ${
                      selectedUnit.id === unit.id ? 'text-red-400' : 'text-red-600'
                    }`}>
                       {selectedUnit.id === unit.id ? '✓ Selecionado' : 'Selecionar →'}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 w-full text-center rounded-xl bg-zinc-100">
                  <p className="text-sm font-bold uppercase text-zinc-500">Nenhuma unidade encontrada.</p>
                </div>
              )}
            </div>
            
            {/* Mobile Map */}
            <div className="relative rounded-xl overflow-hidden shadow-lg border border-zinc-200 h-[300px]">
              <iframe 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                scrolling="no" 
                title={selectedUnit.name}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedUnit.mapQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                className="w-full h-full"
              ></iframe>
            </div>
            
            {/* Mobile action card */}
            <div className="p-5 text-white rounded-xl bg-zinc-900" key={selectedUnit.id}>
              <div className="flex gap-3 items-start mb-4">
                <div className="flex flex-shrink-0 justify-center items-center w-10 h-10 bg-red-600 rounded-lg">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="font-black uppercase">{selectedUnit.name}</h4>
                  <p className="text-sm text-zinc-400">{selectedUnit.address}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedUnit.mapQuery)}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex gap-2 justify-center items-center px-4 py-3 text-xs font-bold text-white uppercase bg-red-600 rounded-lg transition-colors hover:bg-red-700"
                >
                   <Navigation size={16} /> Rota
                </a>
                <a 
                  href={`tel:${selectedUnit.phone}`}
                  className="flex gap-2 justify-center items-center px-4 py-3 text-xs font-bold uppercase bg-white rounded-lg transition-colors text-zinc-900 hover:bg-zinc-100"
                >
                   <Phone size={16} /> Ligar
                </a>
              </div>
            </div>
          </div>

          {/* Desktop: Grid layout */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-8 h-[600px]">
             <div ref={unitsListRef} className="overflow-y-auto pr-2 space-y-4 lg:col-span-1 custom-scrollbar">
                {filteredUnits.length > 0 ? (
                  filteredUnits.map((unit, index) => (
                    <div 
                      key={unit.id}
                      id={`unit-card-${unit.id}`}
                      onClick={() => setSelectedUnit(unit)}
                      className={`p-6 border transition-all cursor-pointer group relative animate-fade-in-up ${
                        selectedUnit.id === unit.id 
                          ? 'bg-zinc-900 text-white border-zinc-900 shadow-xl scale-[1.02]' 
                          : 'bg-zinc-50 border-zinc-200 hover:border-red-600 hover:shadow-lg'
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {unit.featured && (
                        <span className="absolute top-4 right-4 text-[10px] bg-red-600 text-white px-2 py-1 font-bold uppercase rounded-sm">Matriz</span>
                      )}
                      <h4 className="mb-1 text-xl font-black uppercase">{unit.name}</h4>
                      <div className="flex gap-2 items-center mb-4 text-xs font-bold tracking-wider uppercase opacity-70">
                         <MapPin size={12} /> {unit.city} - {unit.state}
                      </div>
                      <p className={`text-sm mb-4 ${selectedUnit.id === unit.id ? 'text-zinc-400' : 'text-zinc-600'}`}>{unit.address}</p>
                      <div className={`flex items-center gap-2 text-xs font-bold uppercase ${
                        selectedUnit.id === unit.id ? 'text-red-500' : 'text-red-600'
                      }`}>
                         {selectedUnit.id === unit.id ? 'Visualizando no Mapa' : 'Ver no Mapa'} 
                         {selectedUnit.id !== unit.id && <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center bg-zinc-100">
                    <p className="text-sm font-bold uppercase text-zinc-500">Nenhuma unidade encontrada.</p>
                  </div>
                )}
             </div>

             <div className="relative border shadow-inner lg:col-span-2 bg-zinc-100 border-zinc-200">
                <iframe 
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  scrolling="no" 
                  marginHeight="0" 
                  marginWidth="0" 
                  title={selectedUnit.name}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedUnit.mapQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  className="w-full h-full"
                ></iframe>
                
                <div className="flex absolute right-6 bottom-6 left-6 flex-col gap-4 justify-between items-center p-6 bg-white border-l-4 border-red-600 shadow-2xl md:flex-row animate-scale-in" key={selectedUnit.id}>
                   <div>
                      <h4 className="text-lg font-black uppercase text-zinc-900">{selectedUnit.name}</h4>
                      <p className="text-sm text-zinc-500">{selectedUnit.address}</p>
                   </div>
                   <div className="flex gap-3 w-full md:w-auto">
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedUnit.mapQuery)}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 font-bold uppercase text-xs hover:bg-red-700 transition-all hover:-translate-y-0.5"
                      >
                         <Navigation size={16} /> Traçar Rota
                      </a>
                      <a 
                        href={`tel:${selectedUnit.phone}`}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-zinc-900 text-white px-6 py-3 font-bold uppercase text-xs hover:bg-black transition-all hover:-translate-y-0.5"
                      >
                         <Phone size={16} /> Ligar
                      </a>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="galeria" className="py-24 bg-zinc-950">
        <div className="container px-6 mx-auto">
          <AnimatedSection className="mb-12 text-center">
            <h2 className="mb-2 text-sm font-bold tracking-widest text-red-600 uppercase">Lifestyle</h2>
            <h3 className="text-4xl font-black tracking-tighter text-white uppercase">Galeria USGO</h3>
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 h-[600px]">
            {galleryImages.map((image, index) => (
              <div 
                key={index}
                className={`${image.className} relative group overflow-hidden cursor-pointer image-hover-zoom`}
                onClick={() => setLightboxImage(image)}
              >
                <ImageWithLoader 
                  src={image.src} 
                  alt={image.alt} 
                  className="object-cover w-full h-full opacity-70 transition-opacity duration-300 group-hover:opacity-100" 
                />
                <div className="flex absolute inset-0 items-end p-6 bg-gradient-to-t via-transparent to-transparent opacity-0 transition-opacity duration-300 from-black/80 group-hover:opacity-100">
                  <span className="font-bold tracking-widest text-white uppercase">{image.alt}</span>
                </div>
                <div className="flex absolute inset-0 justify-center items-center opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="p-3 text-white bg-red-600 rounded-full transition-transform duration-300 transform scale-0 group-hover:scale-100">
                    <Search size={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex gap-2 items-center pb-1 text-xs font-bold tracking-widest uppercase border-b border-transparent transition-all text-zinc-500 hover:text-white hover:border-white"
            >
              <Instagram size={16} />
              Ver Mais Fotos no Instagram
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 border-t bg-zinc-900 border-white/5">
         <div className="container px-6 mx-auto max-w-3xl">
            <AnimatedSection className="mb-16 text-center">
               <h2 className="mb-2 text-sm font-bold tracking-widest text-red-600 uppercase">Dúvidas</h2>
               <h3 className="text-4xl font-black tracking-tighter text-white uppercase">Perguntas Frequentes</h3>
            </AnimatedSection>
            <div className="space-y-4">
               {faqData.map((faq, index) => (
                  <AnimatedSection key={index} animation="animate-fade-in-up" delay={`delay-${(index + 1) * 100}`}>
                    <FaqItem 
                      question={faq.question}
                      answer={faq.answer}
                      isOpen={openFaqIndex === index}
                      onToggle={() => toggleFaq(index)}
                    />
                  </AnimatedSection>
               ))}
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black border-t border-zinc-900">
        <div className="container flex flex-col gap-6 items-center px-6 mx-auto">
           <div className="flex gap-4">
              <a href="#" className="flex justify-center items-center w-10 h-10 text-white transition-all bg-zinc-900 hover:bg-red-600 hover:scale-110"><Instagram size={18} /></a>
              <a href="#" className="flex justify-center items-center w-10 h-10 text-white transition-all bg-zinc-900 hover:bg-red-600 hover:scale-110"><Mail size={18} /></a>
           </div>
           <div className="text-center">
               <span className="text-2xl italic font-black tracking-tighter text-white uppercase">USGO<span className="text-red-600">Jiu-Jitsu</span></span>
               <Link to="/uniformes" className="block mt-2 text-xs tracking-widest uppercase transition-colors text-zinc-500 hover:text-red-500">Manual de Uniformes</Link>
               <p className="mt-1 text-xs tracking-widest uppercase text-zinc-600">© 2025 Todos os direitos reservados.</p>
           </div>
           
        </div>
      </footer>
    </div>
  );
}
