import React, { useState, useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * HOROLOGIUM – The Encyclopedia of Fine Wristwatches
 * A premium luxury web experience.
 */

// --- CONSTANTS & DESIGN SYSTEM ---
const COLORS = {
  gold: 'var(--accent-primary)',
  background: 'var(--bg-primary)',
  surface: 'var(--bg-secondary)',
  text: 'var(--text-primary)',
  textDim: 'var(--text-secondary)',
  border: 'var(--border-color)',
  glow: 'var(--shadow-color)',
};

const TIERS = {
  HOLY_TRINITY: 'Holy Trinity',
  HAUTE_HORLOGERIE: 'Haute Horlogerie',
  LUXURY: 'Luxury',
  ACCESSIBLE_LUXURY: 'Accessible Luxury',
  HERITAGE: 'Heritage',
};

const BRANDS_DATA = [
  { name: 'Patek Philippe', country: 'Switzerland', founded: 1839, tier: TIERS.HOLY_TRINITY, tagline: 'You never actually own a Patek Philippe.', logo: '/logos/patek_philippe_logo.png', icon: '/icons/patek_philippe_icon.png' },
  { name: 'Audemars Piguet', country: 'Switzerland', founded: 1875, tier: TIERS.HOLY_TRINITY, tagline: 'To break the rules, you must first master them.', logo: '/logos/audemars_piguet.png', icon: '/icons/audemars_piguet_icon.jpeg' },
  { name: 'Vacheron Constantin', country: 'Switzerland', founded: 1755, tier: TIERS.HOLY_TRINITY, tagline: 'One of not many.', logo: '/logos/vacheron_constantin_logo.png', icon: '/icons/vacheron_constantin_icon.jpeg' },
  { name: 'A. Lange & Söhne', country: 'Germany', founded: 1845, tier: TIERS.HAUTE_HORLOGERIE, tagline: 'State-of-the-art tradition.', logo: '/logos/a_lange_sohne.png', icon: '/icons/a_lange_sohne_icon.jpeg' },
  { name: 'Rolex', country: 'Switzerland', founded: 1905, tier: TIERS.LUXURY, tagline: 'A crown for every achievement.', logo: '/logos/rolex_logo.png', icon: '/icons/rolex_icon.jpeg' },
  { name: 'Omega', country: 'Switzerland', founded: 1848, tier: TIERS.LUXURY, tagline: 'Omega. Exactly.', logo: '/logos/omega_logo.png', icon: '/icons/omega_icon.jpeg' },
  { name: 'Cartier', country: 'France', founded: 1847, tier: TIERS.LUXURY, tagline: 'The jeweler of kings and the king of jewelers.', logo: '/logos/cartier_logo.png', icon: '/icons/cartier_icon.jpeg' },
  { name: 'IWC Schaffhausen', country: 'Switzerland', founded: 1868, tier: TIERS.LUXURY, tagline: 'Engineered for men.', logo: '/logos/iwc_schaffhausen_logo.png', icon: '/icons/iwc_schaffhausen_icon.jpeg' },
  { name: 'Jaeger-LeCoultre', country: 'Switzerland', founded: 1833, tier: TIERS.HAUTE_HORLOGERIE, tagline: 'The watchmaker of watchmakers.', logo: '/logos/jaeger_lecoultre_logo.png', icon: '/icons/jaeger_lecoultre_icon.jpeg' },
  { name: 'Breitling', country: 'Switzerland', founded: 1884, tier: TIERS.LUXURY, tagline: 'Instruments for professionals.', logo: '/logos/breitling.png', icon: '/icons/breitling_icon.jpeg' },
  { name: 'Panerai', country: 'Italy', founded: 1860, tier: TIERS.LUXURY, tagline: 'Laboratorio di Idee.', logo: '/logos/panerai_logo.png', icon: '/icons/panerai_icon.jpeg' },
  { name: 'Hublot', country: 'Switzerland', founded: 1980, tier: TIERS.LUXURY, tagline: 'The art of fusion.', logo: '/logos/hublot_logo.png', icon: '/icons/hublot_icon.jpeg' },
  { name: 'Zenith', country: 'Switzerland', founded: 1865, tier: TIERS.HERITAGE, tagline: 'Time to reach your star.', logo: '/logos/zenith_logo.png', icon: '/icons/zenith_icon.jpeg' },
  { name: 'Bulgari', country: 'Italy', founded: 1884, tier: TIERS.LUXURY, tagline: 'Masters of jewelry and watches.', logo: '/logos/bulgari.png', icon: '/icons/bulgari_icon.jpeg' },
  { name: 'Chopard', country: 'Switzerland', founded: 1860, tier: TIERS.LUXURY, tagline: 'The Artisan of Emotions.', logo: '/logos/chopard_logo.png', icon: '/icons/chopard_icon.jpeg' },
  { name: 'TAG Heuer', country: 'Switzerland', founded: 1860, tier: TIERS.ACCESSIBLE_LUXURY, tagline: 'Don\'t crack under pressure.', logo: '/logos/tag_heuer_logo.png', icon: '/icons/tag_heuer_icon.jpeg' },
  { name: 'Tudor', country: 'Switzerland', founded: 1926, tier: TIERS.LUXURY, tagline: 'Born to dare.', logo: '/logos/tudor_logo.png', icon: '/icons/tudor_icon.png' },
  { name: 'Longines', country: 'Switzerland', founded: 1832, tier: TIERS.HERITAGE, tagline: 'Elegance is an attitude.', logo: '/logos/longines_logo.png', icon: '/icons/longines_icon.jpeg' },
  { name: 'Frederique Constant', country: 'Switzerland', founded: 1988, tier: TIERS.ACCESSIBLE_LUXURY, tagline: 'Live your passion.', logo: '/logos/frederique_constant_logo.png', icon: '/icons/frederique_constant_icon.jpeg' },
  { name: 'Grand Seiko', country: 'Japan', founded: 1960, tier: TIERS.LUXURY, tagline: 'The nature of time.', logo: '/logos/grand_seiko_logo.png', icon: '/icons/grand_seiko_icon.jpeg' },
  { name: 'Seiko', country: 'Japan', founded: 1881, tier: TIERS.HERITAGE, tagline: 'Always one step ahead of the rest.', logo: '/logos/seiko_logo.png', icon: '/icons/seiko_icon.jpeg' },
  { name: 'Citizen', country: 'Japan', founded: 1918, tier: TIERS.HERITAGE, tagline: 'Better Starts Now.', logo: '/logos/citizen_logo.png', icon: '/icons/citizen_icon.jpeg' },
  { name: 'Casio G-Shock', country: 'Japan', founded: 1983, tier: TIERS.HERITAGE, tagline: 'Absolute Toughness.', logo: '/logos/casio_logo.png', icon: '/icons/casio_icon.jpeg' },
  { name: 'Hamilton', country: 'USA', founded: 1892, tier: TIERS.HERITAGE, tagline: 'American Spirit, Swiss Precision.', logo: '/logos/hamilton_logo.png', icon: '/icons/hamilton_icon.jpeg' },
  { name: 'Richard Mille', country: 'Switzerland', founded: 2001, tier: TIERS.HAUTE_HORLOGERIE, tagline: 'A racing machine on the wrist.', logo: '/logos/richard_mille_logo.png', icon: '/icons/richard_mille_icon.jpeg' },
];

// --- STYLES (Inline) ---
const STYLES = {
  reset: `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Montserrat:wght@100;300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');

    :root {
      --bg-primary: #F5F5DC;
      --bg-secondary: #FAF0E6;
      --text-primary: #2F1B14;
      --text-secondary: #5D4037;
      --accent-primary: #8B4513;
      --accent-hover: #A0522D;
      --border-color: #E0CDA8;
      --shadow-color: rgba(139, 69, 19, 0.12);
      --logo-filter: none;
    }

    [data-theme="dark"] {
      --bg-primary: #121212;
      --bg-secondary: #1E1E1E;
      --text-primary: #F8F8F8;
      --text-secondary: #E0E0E0;
      --accent-primary: #DEB887;
      --accent-hover: #FAD5A5;
      --border-color: #404040;
      --shadow-color: rgba(0, 0, 0, 0.4);
      --logo-filter: invert(1) brightness(1.5);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body { 
      background: var(--bg-primary); 
      color: var(--text-primary); 
      font-family: 'Montserrat', sans-serif; 
      overflow-x: hidden; 
      -webkit-font-smoothing: antialiased;
      transition: background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1), color 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    h1, h2, h3, h4 { font-family: 'Playfair Display', serif; color: var(--accent-primary); }
    button { cursor: pointer; border: none; background: none; color: inherit; font-family: inherit; transition: opacity 0.3s; }
    button:hover { opacity: 0.8; }
    a { color: inherit; text-decoration: none; }
    img { max-width: 100%; height: auto; display: block; }

    .brand-logo {
      width: 100%;
      height: 60px;
      object-fit: contain;
      margin-bottom: 16px;
      filter: var(--logo-filter);
      transition: filter 0.4s ease;
    }

    .brand-icon-mini {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--accent-primary);
      position: absolute;
      top: -20px;
      right: 20px;
      background: var(--bg-secondary);
    }

    /* Luxury UI Components */
    .luxury-toggle {
      background: var(--accent-primary);
      color: #FFFFFF;
      border: none;
      padding: 8px 24px;
      border-radius: 40px;
      font-size: 12px;
      font-weight: 600;
      box-shadow: 0 4px 20px var(--shadow-color);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .back-btn {
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      color: var(--text-primary);
      padding: 8px 20px;
      border-radius: 40px;
      font-size: 12px;
      font-weight: 600;
      box-shadow: 0 2px 10px var(--shadow-color);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* Cinematic Hero Styles */
    .hero-section {
      position: relative;
      width: 100%;
      height: 100vh;
      min-height: 600px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      background: var(--bg-primary);
    }

    .video-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      overflow: hidden; /* Mask the cropped area */
    }

    .video-container video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      transform: scale(1.1); /* Zoom in to hide watermark */
    }

    .video-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        to bottom,
        rgba(245, 245, 220, 0.3) 0%,
        rgba(245, 245, 220, 0.1) 50%,
        rgba(245, 245, 220, 0.4) 100%
      );
      z-index: 2;
    }

    [data-theme="dark"] .video-overlay {
      background: linear-gradient(
        to bottom,
        rgba(18, 18, 18, 0.5) 0%,
        rgba(18, 18, 18, 0.2) 50%,
        rgba(18, 18, 18, 0.6) 100%
      );
    }

    .hero-content {
      position: relative;
      z-index: 3;
      text-align: center;
      padding: 2rem;
    }

    .hero-title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(3rem, 8vw, 6rem);
      letter-spacing: 0.3em;
      color: var(--accent-primary);
      margin-bottom: 1rem;
      text-shadow: 0 2px 15px var(--shadow-color);
    }

    .hero-subtitle {
      font-size: 1.2rem;
      color: var(--text-secondary);
      max-width: 600px;
      margin: 0 auto 2.5rem;
      line-height: 1.6;
      font-weight: 300;
    }

    .live-clock {
      font-family: 'Montserrat', sans-serif;
      font-size: 32px;
      letter-spacing: 12px;
      color: var(--accent-primary);
      margin-bottom: 2.5rem;
      font-weight: 300;
      opacity: 0.9;
      text-transform: uppercase;
    }

    .scroll-indicator {
      position: absolute;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      z-index: 3;
      color: var(--accent-primary);
      animation: bounce 2s infinite;
    }

    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
      40% { transform: translateX(-50%) translateY(-10px); }
      60% { transform: translateX(-50%) translateY(-5px); }
    }

    .back-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px var(--shadow-color);
      background: var(--accent-hover);
      color: #FFFFFF;
    }

    /* Luxury Brand Card Styles */
    .brand-card-luxury {
      position: relative;
      height: 450px;
      border-radius: 24px;
      overflow: hidden;
      background: #000;
      cursor: pointer;
      transform-style: preserve-3d;
      perspective: 1000px;
      transition: box-shadow 0.5s ease;
    }

    .brand-card-luxury:hover {
      box-shadow: 0 30px 60px rgba(0,0,0,0.4);
    }

    .card-bg-wrap {
      position: absolute;
      inset: 0;
      z-index: 1;
      transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      will-change: transform;
    }

    .brand-card-luxury:hover .card-bg-wrap {
      transform: scale(0.97) translateY(-10px);
    }

    .card-bg-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.6;
      transition: opacity 0.8s ease;
    }

    .brand-card-luxury:hover .card-bg-img {
      opacity: 0.4;
    }

    .card-vignette {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 40%, transparent 100%);
      z-index: 2;
      opacity: 0.8;
      transition: opacity 0.8s ease;
    }

    .brand-card-luxury:hover .card-vignette {
      opacity: 0.9;
    }

    .card-content-wrap {
      position: absolute;
      inset: 0;
      padding: 30px;
      z-index: 3;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center; 
      pointer-events: none;
    }

    .card-identity-group {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      text-align: center;
      padding: 20px;
      background: rgba(0,0,0,0.4);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border-radius: 20px;
      border: 1px solid rgba(255,255,255,0.1);
    }

    .card-title-reveal {
      font-size: 28px;
      color: var(--accent-primary);
      margin: 0;
      font-family: 'Playfair Display', serif;
      letter-spacing: 3px;
      text-transform: uppercase;
      text-shadow: 0 2px 10px rgba(0,0,0,0.5);
      font-weight: 700;
    }

    .card-subtitle-reveal {
      font-size: 11px;
      color: #FFFFFF;
      text-transform: uppercase;
      letter-spacing: 4px;
      margin-top: 8px;
      font-weight: 500;
      opacity: 0.9;
    }

    .card-logo-reveal {
      position: absolute;
      top: 30px;
      left: 30px;
      width: 70px;
      height: 70px;
      border-radius: 50%;
      background: #FFFFFF;
      padding: 12px;
      object-fit: contain;
      box-shadow: 0 8px 25px rgba(0,0,0,0.5);
      filter: none; 
      will-change: transform;
      z-index: 10;
    }

    /* Brand Detail Cover Animations */
    .brand-cover-luxury {
      width: 100%;
      height: 550px;
      border-radius: 24px;
      overflow: hidden;
      margin-bottom: 80px;
      position: relative;
      box-shadow: 0 20px 50px var(--shadow-color);
      background: #000;
      cursor: pointer;
    }

    .cover-bg-wrap {
      position: absolute;
      inset: 0;
      z-index: 1;
      transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .brand-cover-luxury:hover .cover-bg-wrap {
      opacity: 0.6;
      transform: scale(1.05);
      filter: blur(2px);
    }

    .cover-vignette {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%);
      z-index: 2;
      transition: opacity 0.8s ease;
    }

    .brand-cover-luxury:hover .cover-vignette {
      background: radial-gradient(circle at center, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.8) 100%);
    }

    .cover-logo-badge {
      position: absolute;
      top: 60px;
      left: 60px;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: #FFFFFF;
      padding: 15px;
      object-fit: contain;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      z-index: 10;
      will-change: transform;
    }

    /* Brand Detail Cover Animations */
    .brand-cover-luxury {
      width: 100%;
      height: clamp(400px, 60vh, 600px);
      border-radius: 24px;
      overflow: hidden;
      margin-bottom: clamp(40px, 8vh, 80px);
      position: relative;
      box-shadow: 0 20px 50px var(--shadow-color);
      background: #000;
      cursor: pointer;
    }

    .cover-bg-wrap {
      position: absolute;
      inset: 0;
      z-index: 1;
      transition: all 1s cubic-bezier(0.2, 1, 0.3, 1);
    }

    .brand-cover-luxury:hover .cover-bg-wrap {
      opacity: 0.5;
      transform: scale(1.03);
      filter: blur(4px);
    }

    .cover-vignette {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 50%, transparent 100%);
      z-index: 2;
      transition: all 0.8s ease;
    }

    .brand-cover-luxury:hover .cover-vignette {
      background: radial-gradient(circle at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.9) 100%);
    }

    .cover-logo-badge {
      position: absolute;
      top: clamp(30px, 5vw, 60px);
      left: clamp(30px, 5vw, 60px);
      width: clamp(60px, 8vw, 100px);
      height: clamp(60px, 8vw, 100px);
      border-radius: 50%;
      background: #FFFFFF;
      padding: 12px;
      object-fit: contain;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      z-index: 10;
      will-change: transform, top, left;
    }

    .cover-content-group {
      position: absolute;
      bottom: clamp(30px, 5vw, 60px);
      left: clamp(30px, 5vw, 60px);
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      will-change: transform, bottom, left;
      text-align: left;
      width: calc(100% - 120px);
      max-width: 900px;
    }

    .cover-title-reveal {
      font-size: clamp(32px, 8vw, 80px);
      color: #FFFFFF;
      margin: 0;
      font-family: 'Playfair Display', serif;
      letter-spacing: 2px;
      text-shadow: 0 4px 30px rgba(0,0,0,0.8);
      font-weight: 700;
      line-height: 1.1;
    }

    /* --- RESPONSIVENESS & GLOBAL REFINEMENTS --- */
    @media (max-width: 1024px) {
      .container { padding: 0 24px !important; }
      .hero-title { font-size: clamp(3rem, 12vw, 5rem); }
      .grid-2 { gap: 40px !important; grid-template-columns: 1fr !important; }
    }

    @media (max-width: 768px) {
      .brand-card-luxury { height: 400px; }
      .cover-content-group { left: 30px; bottom: 30px; width: calc(100% - 60px); }
      .cover-logo-badge { top: 30px; left: 30px; }
      .navbar .container { height: 70px; }
      .nav-links { gap: 30px !important; font-size: 11px; }
    }

    @media (max-width: 480px) {
      .brand-card-luxury { height: 350px; }
      .card-title-reveal { font-size: 22px; }
      .live-clock { font-size: 20px; letter-spacing: 6px; }
      .back-btn, .luxury-toggle { padding: 8px 16px; font-size: 10px; }
    }

    /* Shimmer Effect for Buttons */
    .shimmer-btn {
      position: relative;
      overflow: hidden;
    }
    .shimmer-btn::after {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(
        45deg,
        transparent,
        rgba(255, 255, 255, 0.1),
        transparent
      );
      transform: rotate(45deg);
      transition: all 0.6s;
      opacity: 0;
    }
    .shimmer-btn:hover::after {
      opacity: 1;
      left: 100%;
      top: 100%;
    }

    /* Advanced Search */
    .search-container {
      position: sticky;
      top: 100px;
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
      z-index: 900;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .search-container.focused {
      transform: scale(1.01);
    }
    .search-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--border-color);
      border-radius: 20px;
      padding: 10px 20px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
    }
    [data-theme="dark"] .search-input-wrapper {
      background: rgba(0, 0, 0, 0.3);
    }
    .search-input-wrapper:focus-within {
      box-shadow: 0 8px 32px var(--shadow-color), 0 0 0 2px var(--accent-primary);
      border-color: var(--accent-primary);
    }
    .search-input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      color: var(--text-primary);
      font-size: 18px;
      padding: 12px;
      font-family: inherit;
    }
    .search-dropdown {
      position: absolute;
      top: calc(100% + 12px);
      left: 0;
      right: 0;
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: 20px;
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.25);
      backdrop-filter: blur(30px);
      overflow-y: auto;
      max-height: 60vh;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .search-container.focused .search-dropdown {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    .backdrop-blur-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(12px);
      z-index: 899;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.5s ease;
    }
    .backdrop-blur-overlay.active {
      opacity: 1;
      pointer-events: auto;
    }
    .suggestion-item {
      padding: 14px 24px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 20px;
      transition: all 0.2s ease;
      animation: slideUpFade 0.4s cubic-bezier(0.4, 0, 0.2, 1) backwards;
    }
    .suggestion-item:active {
      transform: scale(0.97);
    }
    .suggestion-item.active, .suggestion-item:hover {
      background: rgba(139, 69, 19, 0.08);
      padding-left: 30px;
    }
    .match-highlight {
      color: var(--accent-primary);
      font-weight: 700;
    }

    @keyframes slideUpFade {
      from { opacity: 0; transform: translateY(15px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Custom Focus Ring */
    :focus-visible {
      outline: 2px solid var(--accent-primary);
      outline-offset: 4px;
    }

    /* Reduced Motion */
    @media (prefers-reduced-motion: reduce) {
      * { animation: none !important; transition: none !important; }
    }

    @media (max-width: 480px) {
      h1 { font-size: 40px !important; }
      .hero-buttons { flex-direction: column; width: 100%; align-items: center; }
      .hero-buttons button { width: 100%; max-width: 300px; }
    }
    
    @media (prefers-reduced-motion: reduce) {
      * { transition: none !important; }
    }

    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: var(--bg-primary); }
    ::-webkit-scrollbar-thumb { background: var(--accent-primary); border-radius: 3px; }
    
    /* Advanced Search */
    .search-container {
      position: sticky;
      top: 100px;
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
      z-index: 900;
      transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
    }
    .search-container.focused {
      transform: scale(1.02);
    }
    .search-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 8px 16px;
      transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
    }
    [data-theme="dark"] .search-input-wrapper {
      background: rgba(0, 0, 0, 0.2);
    }
    .search-input-wrapper:focus-within {
      box-shadow: 0 8px 32px var(--shadow-color), 0 0 0 2px var(--accent-primary);
      border-color: var(--accent-primary);
    }
    .search-input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      color: var(--text-primary);
      font-size: 18px;
      padding: 12px;
      font-family: inherit;
    }
    .search-input::placeholder {
      color: var(--text-secondary);
      opacity: 0.7;
    }
    .search-dropdown {
      position: absolute;
      top: calc(100% + 12px);
      left: 0;
      right: 0;
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(20px);
      overflow: hidden;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
    }
    .search-container.focused .search-dropdown {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    .backdrop-blur-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(8px);
      z-index: 899;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.4s ease;
    }
    .backdrop-blur-overlay.active {
      opacity: 1;
      pointer-events: auto;
    }
    .suggestion-item {
      padding: 16px 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 16px;
      transition: background-color 0.2s ease, transform 0.1s ease;
      animation: slideUpFade 0.3s cubic-bezier(0.25, 1, 0.5, 1) backwards;
    }
    .suggestion-item:active {
      transform: scale(0.98);
    }
    .suggestion-item.active, .suggestion-item:hover {
      background: rgba(139, 69, 19, 0.1);
    }
    @keyframes slideUpFade {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `,
  container: { maxWidth: '1400px', margin: '0 auto', padding: '0 40px' },
  glass: { background: 'var(--bg-secondary)', backdropFilter: 'blur(10px)', borderBottom: `1px solid var(--border-color)`, opacity: 0.8 },
  card: { background: 'var(--bg-secondary)', border: `1px solid var(--border-color)`, borderRadius: '12px', padding: '24px', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', height: '100%', display: 'flex', flexDirection: 'column' },
};


// --- UTILS ---
async function askClaude(system, user, context = {}) {
  if (user.includes("List the top iconic watches") || user.includes("watches for")) {
    const brandName = context.brandName || "";
    const brandToFileMap = {
      'Patek Philippe': 'patek_philippe.json',
      'Audemars Piguet': 'audemars_piguet.json',
      'Vacheron Constantin': 'vacheron_constantin.json',
      'A. Lange & Söhne': 'a_lange_sohne.json',
      'Rolex': 'rolex.json',
      'Omega': 'omega.json',
      'Cartier': 'cartier.json',
      'IWC Schaffhausen': 'iwc_schaffhausen.json',
      'Jaeger-LeCoultre': 'jaeger-lecoultre.json',
      'Breitling': 'breitling.json',
      'Panerai': 'panerai.json',
      'Hublot': 'hublot.json',
      'Zenith': 'zenith.json',
      'Bulgari': 'bulgari.json',
      'Chopard': 'chopard.json',
      'TAG Heuer': 'tag_heuer.json',
      'Tudor': 'tudor.json',
      'Longines': 'longines.json',
      'Frederique Constant': 'frederique_constant.json',
      'Grand Seiko': 'grand_seiko.json',
      'Seiko': 'seiko.json',
      'Citizen': 'citizen.json',
      'Casio G-Shock': 'casio_g-shock.json',
      'Hamilton': 'hamilton.json',
      'Richard Mille': 'richard_mille.json'
    };
    const fileName = brandToFileMap[brandName] || brandName.toLowerCase().replace(/ /g, '_').replace(/-/g, '_') + '.json';
    try {
      const response = await fetch(`/data/${fileName}`);
      if (!response.ok) throw new Error('Data not found');
      return await response.json();
    } catch (e) {
      console.error("Error fetching watch data:", e);
      return [];
    }
  }

  if (user.includes("story") || user.includes("history")) {
    await new Promise(r => setTimeout(r, 800));
    return {
      story: `A beacon of excellence in horological history, this Maison represents the pinnacle of craftsmanship, merging traditional artistry with modern technical precision.`,
      milestones: ["Heritage Foundation", "Innovation Patent", "Royal Appointment"]
    };
  }
  
  return { error: "No specific parser match" };
}

// --- COMPONENTS ---

const Spinner = ({ size = 40 }) => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: size + 'px', width: size + 'px' }}>
    <div style={{
      width: '100%', height: '100%', border: `3px solid var(--border-color)`, borderTop: `3px solid var(--accent-primary)`,
      borderRadius: '50%', animation: 'spin 1s linear infinite'
    }} />
    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
  </div>
);

const HighlightText = ({ text, highlight }) => {
  if (!highlight.trim()) return <span>{text}</span>;
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return (
    <span>
      {parts.map((part, i) => 
        part.toLowerCase() === highlight.toLowerCase() ? 
          <span key={i} className="match-highlight">{part}</span> : 
          part
      )}
    </span>
  );
};

const AdvancedSearch = ({ data, onSelectBrand, onSelectWatch, onSearchChange, currentSearch }) => {
  const [query, setQuery] = useState(currentSearch || '');
  const [debouncedQuery, setDebouncedQuery] = useState(currentSearch || '');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem('recentSearches');
    return saved ? JSON.parse(saved) : [];
  });
  const [isListening, setIsListening] = useState(false);
  const [globalModels, setGlobalModels] = useState([]);
  const [isIndexing, setIsIndexing] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Global Indexing System
  useEffect(() => {
    const indexData = async () => {
      setIsIndexing(true);
      const promises = BRANDS_DATA.map(async (brand) => {
        const brandToFileMap = {
          'Patek Philippe': 'patek_philippe.json',
          'Audemars Piguet': 'audemars_piguet.json',
          'Vacheron Constantin': 'vacheron_constantin.json',
          'A. Lange & Söhne': 'a_lange_sohne.json',
          'Rolex': 'rolex.json',
          'Omega': 'omega.json',
          'Cartier': 'cartier.json',
          'IWC Schaffhausen': 'iwc_schaffhausen.json',
          'Jaeger-LeCoultre': 'jaeger-lecoultre.json',
          'Breitling': 'breitling.json',
          'Panerai': 'panerai.json',
          'Hublot': 'hublot.json',
          'Zenith': 'zenith.json',
          'Bulgari': 'bulgari.json',
          'Chopard': 'chopard.json',
          'TAG Heuer': 'tag_heuer.json',
          'Tudor': 'tudor.json',
          'Longines': 'longines.json',
          'Frederique Constant': 'frederique_constant.json',
          'Grand Seiko': 'grand_seiko.json',
          'Seiko': 'seiko.json',
          'Citizen': 'citizen.json',
          'Casio G-Shock': 'casio_g-shock.json',
          'Hamilton': 'hamilton.json',
          'Richard Mille': 'richard_mille.json'
        };
        const fileName = brandToFileMap[brand.name] || brand.name.toLowerCase().replace(/ /g, '_').replace(/-/g, '_') + '.json';
        try {
          const res = await fetch(`/data/${fileName}`);
          if (res.ok) {
            const models = await res.json();
            return models.map(m => ({ ...m, brandData: brand }));
          }
        } catch (e) {}
        return [];
      });
      
      const allResults = await Promise.all(promises);
      setGlobalModels(allResults.flat());
      setIsIndexing(false);
    };
    indexData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      onSearchChange(query);
    }, 250);
    return () => clearTimeout(timer);
  }, [query, onSearchChange]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categorizedResults = useMemo(() => {
    if (!debouncedQuery.trim()) return { brands: [], models: [] };
    const lowerQuery = debouncedQuery.toLowerCase();
    
    const matchedBrands = data.filter(b => 
      b.name.toLowerCase().includes(lowerQuery) || 
      b.tier.toLowerCase().includes(lowerQuery)
    ).slice(0, 3);

    const matchedModels = globalModels.filter(m => 
      m.name.toLowerCase().includes(lowerQuery) || 
      m.collection?.toLowerCase().includes(lowerQuery) ||
      m.reference?.toLowerCase().includes(lowerQuery) ||
      m.caseMaterial?.toLowerCase().includes(lowerQuery)
    ).slice(0, 8);

    return { brands: matchedBrands, models: matchedModels };
  }, [debouncedQuery, data, globalModels]);

  const flatResults = [...categorizedResults.brands, ...categorizedResults.models];

  useEffect(() => {
    setSelectedIndex(-1);
  }, [debouncedQuery]);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsFocused(false);
      inputRef.current?.blur();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, flatResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = flatResults[selectedIndex] || flatResults[0];
      if (item) handleSelect(item);
    }
  };

  const handleSelect = (item) => {
    const itemName = item.brandData ? item.name : item.name;
    const newRecent = [itemName, ...recentSearches.filter(s => s !== itemName)].slice(0, 6);
    setRecentSearches(newRecent);
    localStorage.setItem('recentSearches', JSON.stringify(newRecent));
    
    setQuery('');
    setDebouncedQuery('');
    onSearchChange('');
    setIsFocused(false);
    
    if (item.brandData) {
      onSelectWatch(item, item.brandData);
    } else {
      onSelectBrand(item);
    }
  };

  const trending = ["Rolex Daytona", "Omega Speedmaster", "Patek Nautilus", "Royal Oak"];

  const startVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (e) => {
        setQuery(e.results[0][0].transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.start();
    }
  };

  return (
    <>
      <div className={`backdrop-blur-overlay ${isFocused ? 'active' : ''}`} />
      <div 
        ref={containerRef}
        className={`search-container ${isFocused ? 'focused' : ''}`}
      >
        <div className="search-input-wrapper">
          <div style={{ padding: '0 8px', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center' }}>
            {isIndexing || query !== debouncedQuery ? (
              <Spinner size={20} />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            )}
          </div>
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Search collections, models, or materials..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            role="search"
            aria-expanded={isFocused}
          />
          {query && (
            <button 
              onClick={() => { setQuery(''); onSearchChange(''); inputRef.current?.focus(); }}
              style={{ padding: '8px', color: 'var(--text-secondary)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
          <button 
            onClick={startVoiceSearch}
            style={{ padding: '8px', color: isListening ? '#ef4444' : 'var(--text-secondary)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="22"></line>
            </svg>
          </button>
        </div>

        <div className="search-dropdown">
          {!debouncedQuery.trim() ? (
            <div style={{ padding: '28px' }}>
              <h4 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Trending Maisons</h4>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '32px' }}>
                {trending.map(t => (
                  <button key={t} onClick={() => setQuery(t)} style={{ padding: '8px 20px', borderRadius: '30px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', fontSize: '13px' }}>{t}</button>
                ))}
              </div>
              
              {recentSearches.length > 0 && (
                 <>
                  <h4 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Recent</h4>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {recentSearches.map((s, i) => (
                      <div key={i} onClick={() => setQuery(s)} style={{ padding: '6px 16px', background: 'rgba(0,0,0,0.03)', borderRadius: '20px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                 </>
              )}
            </div>
          ) : flatResults.length > 0 ? (
            <div>
              {categorizedResults.brands.length > 0 && (
                <>
                  <div style={{ padding: '12px 24px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)' }}>Maisons</div>
                  {categorizedResults.brands.map((item, i) => (
                    <div key={item.name} className={`suggestion-item ${selectedIndex === i ? 'active' : ''}`} onClick={() => handleSelect(item)} style={{ animationDelay: `${i * 40}ms` }}>
                      <div style={{ width: '40px', height: '40px', background: 'var(--bg-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <img src={item.logo} alt="" style={{ maxWidth: '28px', maxHeight: '28px', filter: 'var(--logo-filter)' }} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}><HighlightText text={item.name} highlight={debouncedQuery} /></div>
                        <div style={{ fontSize: '11px', opacity: 0.6 }}>{item.tier}</div>
                      </div>
                    </div>
                  ))}
                </>
              )}
              {categorizedResults.models.length > 0 && (
                <>
                  <div style={{ padding: '12px 24px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)', marginTop: '8px' }}>Timepieces</div>
                  {categorizedResults.models.map((item, i) => {
                    const idx = categorizedResults.brands.length + i;
                    return (
                      <div key={i} className={`suggestion-item ${selectedIndex === idx ? 'active' : ''}`} onClick={() => handleSelect(item)} style={{ animationDelay: `${idx * 40}ms` }}>
                         <div style={{ width: '50px', height: '50px', background: '#000', borderRadius: '8px', overflow: 'hidden' }}>
                            <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.src = `https://placehold.co/100x100/transparent/8B4513.png?text=Watch`; }} />
                         </div>
                         <div>
                            <div style={{ fontWeight: 600, fontSize: '15px' }}><HighlightText text={item.name} highlight={debouncedQuery} /></div>
                            <div style={{ fontSize: '11px', opacity: 0.6 }}>{item.brandData.name} • {item.collection}</div>
                            <div style={{ fontSize: '12px', color: 'var(--accent-primary)', marginTop: '2px' }}>{item.priceRange}</div>
                         </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          ) : (
            <div style={{ padding: '60px 40px', textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>⌛</div>
              <h3 style={{ fontSize: '18px' }}>No timepieces found</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px' }}>We couldn't find a match for "{debouncedQuery}".<br/>Try searching for iconic collections like "Speedmaster" or "Nautilus".</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};


const WatchFace = ({ size = 300 }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = time.getSeconds() * 6;
  const minutes = time.getMinutes() * 6;
  const hours = (time.getHours() % 12) * 30 + (time.getMinutes() / 60) * 30;

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 10px var(--shadow-color))` }}>
      <circle cx="50" cy="50" r="48" fill="var(--bg-secondary)" stroke="var(--accent-primary)" strokeWidth="1" />
      {[...Array(12)].map((_, i) => (
        <line key={i} x1="50" y1="5" x2="50" y2="10" transform={`rotate(${i * 30} 50 50)`} stroke="var(--accent-primary)" strokeWidth="1" />
      ))}
      <line x1="50" y1="50" x2="50" y2="25" transform={`rotate(${hours} 50 50)`} stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" />
      <line x1="50" y1="50" x2="50" y2="15" transform={`rotate(${minutes} 50 50)`} stroke="var(--accent-primary)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="50" y1="50" x2="50" y2="12" transform={`rotate(${seconds} 50 50)`} stroke="#ff4d4d" strokeWidth="0.5" strokeLinecap="round" />
      <circle cx="50" cy="50" r="1.5" fill="var(--accent-primary)" />
    </svg>
  );
};

const TiltCard = ({ children, style = {}, onClick }) => {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        ...STYLES.card,
        ...style,
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        boxShadow: tilt.x !== 0 ? `0 20px 40px rgba(0,0,0,0.5), 0 0 20px var(--shadow-color)` : 'none'
      }}
    >
      {children}
    </div>
  );
};

const Navbar = ({ onViewChange, currentView }) => (
  <nav style={{ ...STYLES.glass, position: 'sticky', top: 0, zIndex: 1000 }}>
    <div className="container" style={{ ...STYLES.container, display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px' }}>
      <div 
        onClick={() => onViewChange('home')}
        style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '4px', cursor: 'pointer', color: 'var(--accent-primary)', fontFamily: 'Cormorant Garamond' }}
      >
        HOROLOGIUM
      </div>
      <div className="nav-links" style={{ display: 'flex', gap: '60px', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>
        {['brands', 'guide'].map((view) => (
          <button 
            key={view}
            onClick={() => onViewChange(view)}
            style={{ 
              opacity: currentView === view ? 1 : 0.6, 
              color: currentView === view ? 'var(--accent-primary)' : 'var(--text-primary)',
              borderBottom: currentView === view ? `1px solid var(--accent-primary)` : 'none',
              paddingBottom: '4px',
              transition: 'all 0.3s'
            }}
          >
            {view}
          </button>
        ))}
      </div>
    </div>
  </nav>
);

// --- VIEWS ---

const LiveClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const format = (num) => String(num).padStart(2, '0');

  return (
    <div className="live-clock">
      {format(time.getHours())}:{format(time.getMinutes())}:{format(time.getSeconds())}
    </div>
  );
};

const HomeView = ({ onNavigate }) => {
  const heroRef = useRef(null);
  const videoRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    // Parallax effect on video
    gsap.fromTo(videoRef.current, 
      { scale: 1.1, y: 0 },
      {
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        },
        y: 150,
        scale: 1.2,
        opacity: 0.5
      }
    );

    // Fade out content on scroll
    gsap.to(contentRef.current, {
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "50% top",
        scrub: true
      },
      y: -50,
      opacity: 0
    });
  }, []);

  const handleMouseEnter = () => {
    if (videoRef.current) videoRef.current.playbackRate = 1.5;
  };

  const handleMouseLeave = () => {
    if (videoRef.current) videoRef.current.playbackRate = 1.0;
  };

  return (
    <div>
      <section 
        id="hero" 
        className="hero-section" 
        ref={heroRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="video-container">
          <video 
            ref={videoRef}
            id="hero-video"
            autoplay="autoplay"
            muted 
            loop 
            playsinline
            preload="auto"
          >
            <source src="/horologium-hero.mp4" type="video/mp4" />
          </video>
          <div className="video-overlay"></div>
        </div>
        
        <div className="hero-content" ref={contentRef}>
          <LiveClock />
          <h1 className="hero-title">HOROLOGIUM</h1>
          <p className="hero-subtitle">
            Welcome to the ultimate digital sanctuary for horological enthusiasts. 
            Explore the mechanics, history, and investment value of the world's most prestigious timepieces.
          </p>
          <div className="hero-buttons" style={{ display: 'flex', gap: '32px', justifyContent: 'center' }}>
            <button 
              onClick={() => onNavigate('brands')}
              style={{ padding: '15px 40px', background: 'var(--accent-primary)', color: '#FFFFFF', fontWeight: 600, borderRadius: '4px', transition: 'transform 0.3s' }}
            >
              EXPLORE BRANDS
            </button>
            <button 
              onClick={() => onNavigate('guide')}
              style={{ padding: '15px 40px', border: `1px solid var(--accent-primary)`, color: 'var(--accent-primary)', fontWeight: 600, borderRadius: '4px' }}
            >
              BEGINNER GUIDE
            </button>
          </div>
        </div>

        <div className="scroll-indicator">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
          </svg>
        </div>
      </section>

      <section className="container" style={{ ...STYLES.container, padding: '100px 40px' }}>
        <h2 style={{ fontSize: '48px', marginBottom: '60px', textAlign: 'center' }}>THE TIERS OF EXCELLENCE</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
          {Object.values(TIERS).map((tier) => (
            <TiltCard key={tier}>
              <h3 style={{ fontSize: '24px', marginBottom: '16px' }}>{tier}</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                The highest standards of craftsmanship and history in the world of watchmaking.
              </p>
            </TiltCard>
          ))}
        </div>
      </section>
    </div>
  );
};

const LuxuryBrandCard = ({ brand, onClick }) => {
  const cardRef = useRef(null);
  const logoRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation based on mouse position (max 10 degrees)
    const rotateX = (y - centerY) / (rect.height / 20);
    const rotateY = (centerX - x) / (rect.width / 20);

    gsap.to(cardRef.current, {
      rotateX: rotateX,
      rotateY: rotateY,
      duration: 0.5,
      ease: "power2.out",
      overwrite: "auto"
    });
  };

  const handleMouseEnter = () => {
    if (!logoRef.current) return;
    gsap.to(logoRef.current, {
      scale: 1.15,
      duration: 0.5,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = () => {
    if (!logoRef.current || !cardRef.current) return;
    
    // Reset rotation
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: "power2.inOut"
    });

    // Reset logo scale
    gsap.to(logoRef.current, {
      scale: 1,
      duration: 0.4,
      ease: "power2.inOut"
    });
  };

  return (
    <div 
      className="brand-card-luxury" 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <div className="card-bg-wrap">
        <img src={brand.icon} alt="" className="card-bg-img" onError={(e) => e.target.src = "https://placehold.co/600x600/000/FFF?text=Luxury"} />
        <div className="card-vignette" />
      </div>
      
      <img src={brand.logo} alt="" className="card-logo-reveal" ref={logoRef} />

      <div className="card-content-wrap">
        <div className="card-identity-group">
          <h3 className="card-title-reveal">{brand.name}</h3>
          <div className="card-subtitle-reveal">
            {brand.country} • EST. {brand.founded}
          </div>
        </div>
      </div>
    </div>
  );
};

const BrandsView = ({ onSelectBrand, onSelectWatch }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filteredBrands = useMemo(() => {
    return BRANDS_DATA.filter(b => 
      b.name.toLowerCase().includes(search.toLowerCase()) && 
      (filter === 'All' || b.tier === filter)
    );
  }, [search, filter]);

  return (
    <div className="container" style={{ ...STYLES.container, padding: '40px 40px 120px' }}>
      <div style={{ marginBottom: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ fontSize: '100px', marginBottom: '60px', textAlign: 'center', letterSpacing: '-2px' }}>THE MAISONS</h1>
        <div style={{ width: '100%', maxWidth: '850px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <AdvancedSearch 
            data={BRANDS_DATA} 
            onSelectBrand={onSelectBrand} 
            onSelectWatch={onSelectWatch}
            onSearchChange={setSearch} 
            currentSearch={search} 
          />
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ padding: '16px 32px', background: 'var(--bg-secondary)', border: `1px solid var(--border-color)`, color: 'var(--text-primary)', borderRadius: '40px', outline: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '14px', letterSpacing: '1px', fontWeight: 600 }}
            >
              <option value="All">ALL TIERS</option>
              {Object.values(TIERS).map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '40px' }}>
        {filteredBrands.map((brand) => (
          <LuxuryBrandCard 
            key={brand.name} 
            brand={brand} 
            onClick={() => onSelectBrand(brand)} 
          />
        ))}
      </div>
    </div>
  );
};

const BrandDetailView = ({ brand, onSelectWatch, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const coverRef = useRef(null);
  const logoRef = useRef(null);
  const groupRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [story, watches] = await Promise.all([
        askClaude("", `Tell me story for ${brand.name}`, { brandName: brand.name }),
        askClaude("", `List the top iconic watches for ${brand.name}`, { brandName: brand.name })
      ]);
      setData({ story, watches });
      setLoading(false);
    };
    fetchData();
  }, [brand]);

  const handleMouseEnter = () => {
    if (!logoRef.current || !groupRef.current || !coverRef.current) return;

    // Use absolute centering for rock-solid stability
    gsap.to(logoRef.current, {
      top: "50%",
      left: "50%",
      xPercent: -50,
      yPercent: -120, 
      scale: 1.4,
      duration: 1.2,
      ease: "expo.out",
      force3D: true
    });

    gsap.to(groupRef.current, {
      top: "50%",
      bottom: "auto",
      left: "50%",
      xPercent: -50,
      yPercent: 40,
      scale: 1.05,
      alignItems: "center",
      textAlign: "center",
      duration: 1.2,
      ease: "expo.out",
      force3D: true
    });
  };

  const handleMouseLeave = () => {
    if (!logoRef.current || !groupRef.current) return;

    const isMobile = window.innerWidth <= 768;
    const offset = isMobile ? "30px" : "60px";

    gsap.to(logoRef.current, {
      top: offset,
      left: offset,
      xPercent: 0,
      yPercent: 0,
      scale: 1,
      duration: 0.8,
      ease: "power3.inOut"
    });

    gsap.to(groupRef.current, {
      top: "auto",
      bottom: offset,
      left: offset,
      xPercent: 0,
      yPercent: 0,
      scale: 1,
      alignItems: "flex-start",
      textAlign: "left",
      duration: 0.8,
      ease: "power3.inOut"
    });
  };

  if (loading) return <Spinner />;

  return (
    <div className="container" style={{ ...STYLES.container, padding: '40px 40px 100px' }}>
      <div 
        className="brand-cover-luxury" 
        ref={coverRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="cover-bg-wrap">
          <img src={brand.icon} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div className="cover-vignette" />
        </div>
        
        <img src={brand.logo} alt="" className="cover-logo-badge" ref={logoRef} />
        
        <div className="cover-content-group" ref={groupRef}>
          <h1 className="cover-title-reveal">{brand.name}</h1>
          <div style={{ color: 'rgba(255,255,255,0.6)', letterSpacing: '4px', textTransform: 'uppercase', fontSize: '14px', marginTop: '12px' }}>
            {brand.country} • SINCE {brand.founded}
          </div>
        </div>
      </div>
      
      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', marginBottom: '120px' }}>
        <div>
          <h2 style={{ fontSize: '32px', marginBottom: '32px' }}>THE HERITAGE</h2>
          <p style={{ fontSize: '20px', lineHeight: 1.8, color: 'var(--text-secondary)', fontFamily: 'Cormorant Garamond' }}>
            {data.story.story}
          </p>
        </div>
        <div style={{ background: 'var(--bg-secondary)', padding: '40px', borderRadius: '12px', border: `1px solid var(--accent-primary)` }}>
          <h3 style={{ marginBottom: '24px' }}>MILESTONES</h3>
          {data.story.milestones.map((m, i) => (
            <div key={i} style={{ marginBottom: '16px', borderLeft: `2px solid var(--accent-primary)`, paddingLeft: '20px' }}>{m}</div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '60px' }}>
        <h2 style={{ fontSize: '48px' }}>COLLECTIONS</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '40px' }}>
        {data.watches.map((watch, idx) => (
          <div key={idx} onClick={() => onSelectWatch(watch)} style={{ cursor: 'pointer' }}>
            <TiltCard>
              <div style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#000', marginBottom: '20px', borderRadius: '8px', overflow: 'hidden' }}>
                 <img src={watch.image} alt={watch.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} onError={(e) => { e.target.src = `https://placehold.co/300x300/transparent/8B4513.png?text=Luxury+Watch`; }} />
              </div>
              <h3 style={{ fontSize: '24px', marginBottom: '8px', minHeight: '60px' }}>{watch.name}</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px', height: '40px', overflow: 'hidden' }}>{watch.description}</p>
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', color: 'var(--accent-primary)' }}>
                <span>{watch.priceRange || `$${watch.priceUSD?.toLocaleString()}`}</span>
                <span style={{ fontSize: '12px', opacity: 0.6 }}>{watch.class}</span>
              </div>
            </TiltCard>
          </div>
        ))}
      </div>
    </div>
  );
};


const WatchDetailView = ({ watch, brand, onBack }) => {
  const handleEnquiry = () => {
    const domain = brand.logo.split('/').pop().replace('logo.clearbit.com/', '');
    window.open(`https://www.${domain}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="container" style={{ ...STYLES.container, padding: '40px 40px 120px' }}>
      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '100px' }}>
        <div>
          <div style={{ position: 'sticky', top: '120px' }}>
             <img src={watch.image} alt={watch.name} style={{ width: '100%', height: 'auto', borderRadius: '12px', filter: `drop-shadow(0 0 20px var(--shadow-color))` }} onError={(e) => { e.target.src = `https://placehold.co/600x600/transparent/8B4513.png?text=Luxury+Timepiece`; }} />
            <h1 style={{ fontSize: '72px', marginTop: '60px', lineHeight: 1.1 }}>{watch.name}</h1>
            <p style={{ color: 'var(--accent-primary)', fontSize: '28px', fontWeight: 600, marginTop: '20px' }}>{watch.priceRange || `$${watch.priceUSD?.toLocaleString()}`}</p>
            <p style={{ color: 'var(--text-secondary)', marginTop: '10px', fontSize: '14px', letterSpacing: '1px' }}>REF: {watch.reference}</p>
          </div>
        </div>
        
        <div>
          <section style={{ marginBottom: '80px' }}>
            <h2 style={{ fontSize: '32px', marginBottom: '24px' }}>IDENTITY</h2>
            <p style={{ lineHeight: 1.9, color: 'var(--text-secondary)', fontSize: '20px', fontWeight: 300 }}>{watch.description}</p>
          </section>

          <section style={{ marginBottom: '80px' }}>
            <h2 style={{ fontSize: '32px', marginBottom: '24px' }}>TECHNICAL SPECS</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '30px' }}>
              {[
                { label: 'Collection', value: watch.collection },
                { label: 'Category', value: watch.class },
                { label: 'Movement', value: watch.movement },
                { label: 'Case Material', value: watch.caseMaterial },
                { label: 'Diameter', value: watch.caseSize },
                { label: 'Power Reserve', value: watch.powerReserve },
                { label: 'Water Resistance', value: watch.waterResistance },
                { label: 'Release Year', value: watch.year }
              ].map(spec => (
                <div key={spec.label} style={{ padding: '24px', background: 'var(--bg-secondary)', border: `1px solid var(--border-color)`, borderRadius: '8px' }}>
                  <div style={{ fontSize: '10px', color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' }}>{spec.label}</div>
                  <div style={{ fontSize: '15px', fontWeight: 500 }}>{spec.value || 'N/A'}</div>
                </div>
              ))}
            </div>
          </section>

          <section style={{ marginBottom: '80px', padding: '40px', background: 'var(--bg-secondary)', border: `1px solid var(--accent-primary)`, borderRadius: '12px' }}>
            <h2 style={{ fontSize: '28px', marginBottom: '16px' }}>INVESTMENT INSIGHT</h2>
            <p style={{ color: 'var(--text-primary)', fontWeight: 300, fontSize: '16px', lineHeight: 1.7 }}>
              Based on historical data for the {watch.collection} collection, this timepiece represents a significant horological asset with strong secondary market stability and heritage value.
            </p>
          </section>

          <div style={{ marginTop: '60px' }}>
             <button 
               onClick={handleEnquiry}
               className="shimmer-btn"
               style={{ width: '100%', padding: '28px', background: 'var(--accent-primary)', color: '#FFFFFF', fontWeight: 700, borderRadius: '8px', fontSize: '16px', letterSpacing: '2px', cursor: 'pointer', transition: 'all 0.2s' }}
             >
               ENQUIRE ON OFFICIAL SITE
             </button>
             <div style={{ textAlign: 'center', marginTop: '16px', color: 'var(--text-secondary)', fontSize: '12px' }}>
               Redirecting to {brand.logo.split('/').pop()}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const GuideView = () => (
  <div className="container" style={{ ...STYLES.container, padding: '40px 40px 100px', maxWidth: '800px' }}>
    <h1 style={{ fontSize: '72px', marginBottom: '60px', textAlign: 'center' }}>THE GENTLEMAN'S GUIDE</h1>
    <div style={{ lineHeight: 1.8, fontSize: '18px', color: 'var(--text-secondary)' }}>
      <h2 style={{ fontSize: '36px', color: 'var(--accent-primary)', marginTop: '40px', marginBottom: '20px' }}>1. The Movement</h2>
      <p>Mechanical watches are powered by a mainspring, not a battery. Automatic watches wind themselves via the motion of your wrist, while manual-wind watches require a daily ritual of turning the crown.</p>
      
      <h2 style={{ fontSize: '36px', color: 'var(--accent-primary)', marginTop: '40px', marginBottom: '20px' }}>2. Complications</h2>
      <p>A "complication" is any function beyond simple timekeeping. Examples include chronographs (stopwatch), perpetual calendars (date adjustment for leap years), and the prestigious tourbillon (gravity compensation).</p>

      <h2 style={{ fontSize: '36px', color: 'var(--accent-primary)', marginTop: '40px', marginBottom: '20px' }}>3. Choosing Your First</h2>
      <p>Look for versatility. A "one-watch collection" usually consists of a steel sports watch that can transition from the boardroom to the beach. Think Omega Seamaster, Tudor Black Bay, or the IWC Pilot.</p>
    </div>
  </div>
);

// --- MAIN APP ---

const App = () => {
  const [view, setView] = useState('home');
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedWatch, setSelectedWatch] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [history, setHistory] = useState(['home']);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const navigate = (newView, brand = null, watch = null) => {
    setView(newView);
    setSelectedBrand(brand);
    setSelectedWatch(watch);
    setHistory(prev => [...prev, newView]);
    window.scrollTo(0, 0);
  };

  const goBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop(); // remove current
      const prevView = newHistory[newHistory.length - 1];
      
      // Basic heuristic for restoration of state
      if (prevView === 'brands' || prevView === 'guide' || prevView === 'home') {
        setSelectedBrand(null);
        setSelectedWatch(null);
      } else if (prevView === 'brandDetail') {
        setSelectedWatch(null);
      }
      
      setView(prevView);
      setHistory(newHistory);
      window.scrollTo(0, 0);
    } else {
      navigate('home');
    }
  };

  return (
    <>
      <style>{STYLES.reset}</style>

      <Navbar onViewChange={(v) => navigate(v)} currentView={view} />
      
      <main style={{ minHeight: 'calc(100vh - 80px)' }}>
        {view !== 'home' && (
          <div className="container" style={{ ...STYLES.container, paddingTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button 
              className="back-btn" 
              onClick={goBack}
              aria-label="Go back to previous page"
            >
              ← BACK TO PREVIOUS
            </button>

            <button 
              className="luxury-toggle" 
              onClick={toggleTheme}
              aria-label="Toggle light/dark theme"
            >
              {theme === 'dark' ? '🌙 DARK' : '☀️ LIGHT'}
            </button>
          </div>
        )}

        {view === 'home' && (
          <div style={{ position: 'fixed', top: '100px', right: '40px', zIndex: 1001 }}>
            <button 
              className="luxury-toggle" 
              onClick={toggleTheme}
              aria-label="Toggle light/dark theme"
            >
              {theme === 'dark' ? '🌙 DARK' : '☀️ LIGHT'}
            </button>
          </div>
        )}

        {view === 'home' && <HomeView onNavigate={navigate} />}
        {view === 'brands' && (
          <BrandsView 
            onSelectBrand={(b) => navigate('brandDetail', b)} 
            onSelectWatch={(w, b) => navigate('watchDetail', b, w)}
          />
        )}
        {view === 'brandDetail' && (
          <BrandDetailView 
            brand={selectedBrand} 
            onSelectWatch={(w) => navigate('watchDetail', selectedBrand, w)} 
            onBack={() => goBack()} 
          />
        )}
        {view === 'watchDetail' && (
          <WatchDetailView 
            watch={selectedWatch} 
            brand={selectedBrand} 
            onBack={() => goBack()} 
          />
        )}
        {view === 'guide' && <GuideView />}
      </main>

      <footer style={{ borderTop: `1px solid var(--border-color)`, padding: '60px 0', marginTop: '100px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '12px', letterSpacing: '2px' }}>
        &copy; 2026 HOROLOGIUM — THE ENCYCLOPEDIA OF FINE WRISTWATCHES. ALL RIGHTS RESERVED.
      </footer>
    </>
  );
};

export default App;
