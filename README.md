# USGO Jiu-Jitsu - Website Oficial

Site institucional da academia USGO Jiu-Jitsu, liderada pelo Mestre Arthur Claudino.

![USGO Jiu-Jitsu](public/logo-branca.webp)

## 🥋 Sobre

Website moderno e responsivo para a academia USGO Jiu-Jitsu, com foco em:

- Apresentação institucional
- Informações sobre modalidades e treinos
- Localização das unidades
- Contato via WhatsApp e formulário

## 🚀 Tecnologias

- **React 18** - UI Library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Ícones
- **PWA** - Progressive Web App

## 📁 Estrutura do Projeto

```
site-usgo/
├── public/
│   ├── manifest.json    # PWA config
│   ├── sw.js            # Service Worker
│   ├── robots.txt       # SEO
│   ├── sitemap.xml      # SEO
│   └── *.webp           # Imagens otimizadas
├── src/
│   ├── App.jsx          # Componente principal
│   ├── index.css        # Estilos globais + animações
│   └── main.jsx         # Entry point
├── index.html           # HTML com SEO meta tags
├── tailwind.config.js   # Configuração Tailwind
└── vite.config.js       # Configuração Vite
```

## ✨ Features

### UX/UI

- ✅ Animações de scroll com Intersection Observer
- ✅ Loading skeleton para imagens
- ✅ Lightbox para galeria
- ✅ Botão voltar ao topo
- ✅ FAQ accordion animado
- ✅ Menu mobile com overlay

### Mobile

- ✅ Botão WhatsApp flutuante com balão
- ✅ Layout mobile-first
- ✅ Touch targets otimizados (44px)
- ✅ Safe-area para notch devices

### SEO & Performance

- ✅ Open Graph tags
- ✅ Twitter Cards
- ✅ Schema.org (SportsActivityLocation)
- ✅ PWA com Service Worker
- ✅ Lazy loading de imagens

### Acessibilidade

- ✅ ARIA labels e roles
- ✅ Focus-visible states
- ✅ Skip-to-content link

## 🛠️ Instalação

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 📱 Contato

Para mais informações sobre a USGO Jiu-Jitsu:

- 📍 Itumbiara - GO (Matriz)
- 📍 Uberlândia - MG
- 📍 São Paulo - SP

---

Desenvolvido com ❤️ para a família USGO
