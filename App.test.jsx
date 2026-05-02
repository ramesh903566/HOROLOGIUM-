import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import App from './App';

// Mock GSAP and ScrollTrigger to prevent errors in the jsdom testing environment
vi.mock('gsap', () => {
  return {
    default: {
      registerPlugin: vi.fn(),
      fromTo: vi.fn(),
      to: vi.fn(),
    }
  };
});

vi.mock('gsap/ScrollTrigger', () => {
  return {
    ScrollTrigger: {}
  };
});

const createLocalStorageMock = () => {
  let store = new Map();

  return {
    clear: vi.fn(() => {
      store.clear();
    }),
    getItem: vi.fn((key) => store.get(String(key)) ?? null),
    setItem: vi.fn((key, value) => {
      store.set(String(key), String(value));
    }),
    removeItem: vi.fn((key) => {
      store.delete(String(key));
    }),
    key: vi.fn((index) => Array.from(store.keys())[index] ?? null),
    get length() {
      return store.size;
    },
  };
};

describe('App Component', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', createLocalStorageMock());
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    // Clear localStorage before each test to ensure a clean state
    localStorage.clear();
    // Reset document theme
    document.documentElement.setAttribute('data-theme', 'light');
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders the Home view initially', () => {
    render(<App />);
    
    // The hero title should be present
    const heroTitles = screen.getAllByText(/HOROLOGIUM/i);
    expect(heroTitles.length).toBeGreaterThan(0);
    
    // The subtitle should be present
    expect(screen.getByText(/Welcome to the ultimate digital sanctuary/i)).toBeInTheDocument();
  });

  it('navigates to the Brands view when "brands" is clicked in the navbar', () => {
    render(<App />);
    
    // Click the "brands" button in the Navbar
    const brandsNavButton = screen.getByRole('button', { name: /^brands$/i });
    fireEvent.click(brandsNavButton);
    
    // Should display the Brands view heading
    expect(screen.getByText(/THE MAISONS/i)).toBeInTheDocument();
  });

  it('navigates to the Guide view when "guide" is clicked in the navbar', () => {
    render(<App />);
    
    const guideNavButton = screen.getByRole('button', { name: /^guide$/i });
    fireEvent.click(guideNavButton);
    
    expect(screen.getByText(/THE GENTLEMAN'S GUIDE/i)).toBeInTheDocument();
  });

  it('toggles the theme from light to dark', () => {
    render(<App />);
    
    // Find the toggle button on the home page
    const themeToggleButton = screen.getByRole('button', { name: /Toggle light\/dark theme/i });
    
    // Initially it defaults to light
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    
    // Click to toggle
    fireEvent.click(themeToggleButton);
    
    // Should now be updated to dark
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});
