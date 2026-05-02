import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import gsap from 'gsap';
import App from './App';

// Mock GSAP and ScrollTrigger to prevent errors in the jsdom testing environment
vi.mock('gsap', () => {
  return {
    default: {
      registerPlugin: vi.fn(),
      fromTo: vi.fn(),
      to: vi.fn(),
      killTweensOf: vi.fn(),
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
    vi.clearAllMocks();
    vi.stubGlobal('localStorage', createLocalStorageMock());
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      json: async () => [],
    })));
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    vi.spyOn(window, 'open').mockImplementation(() => null);
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

  it('moves brand cover text with transform-only motion', async () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /^brands$/i }));
    fireEvent.click(screen.getByText(/^IWC Schaffhausen$/i));

    const coverTitle = await screen.findByRole('heading', { name: /^IWC Schaffhausen$/i });
    const cover = coverTitle.closest('.brand-cover-luxury');

    fireEvent.mouseEnter(cover);

    const enterTween = gsap.to.mock.calls.find(([, vars]) => vars?.textAlign === 'center')?.[1];
    expect(enterTween).toEqual(expect.objectContaining({
      x: expect.any(Number),
      y: expect.any(Number),
      scale: 1,
      textAlign: 'center',
    }));
    expect(enterTween).not.toHaveProperty('top');
    expect(enterTween).not.toHaveProperty('bottom');
    expect(enterTween).not.toHaveProperty('left');
    expect(enterTween).not.toHaveProperty('width');
    expect(enterTween).not.toHaveProperty('maxWidth');
    expect(enterTween).not.toHaveProperty('xPercent');
    expect(enterTween).not.toHaveProperty('yPercent');

    fireEvent.mouseLeave(cover);

    const leaveTween = gsap.to.mock.calls.find(([, vars]) => vars?.textAlign === 'left')?.[1];
    expect(leaveTween).toEqual(expect.objectContaining({
      x: 0,
      y: 0,
      scale: 1,
      textAlign: 'left',
    }));
    expect(leaveTween).not.toHaveProperty('top');
    expect(leaveTween).not.toHaveProperty('bottom');
    expect(leaveTween).not.toHaveProperty('left');
    expect(leaveTween).not.toHaveProperty('width');
    expect(leaveTween).not.toHaveProperty('maxWidth');
    expect(leaveTween).not.toHaveProperty('xPercent');
    expect(leaveTween).not.toHaveProperty('yPercent');
  });

  it('opens the official model URL when the watch has one', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => [
        {
          brand: 'Rolex',
          name: 'Submariner Date',
          reference: '126610LN',
          collection: 'Submariner',
          class: 'Diver',
          image: 'https://example.com/submariner.png',
          description: 'Officially linked model.',
          officialUrl: 'https://www.rolex.com/en-us/watches/submariner/m126610ln-0001',
        },
      ],
    });

    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /^brands$/i }));
    fireEvent.click(screen.getByText(/^Rolex$/i));
    fireEvent.click(await screen.findByText(/^Submariner Date$/i));
    fireEvent.click(screen.getByRole('button', { name: /enquire on official site/i }));

    expect(window.open).toHaveBeenCalledWith(
      'https://www.rolex.com/en-us/watches/submariner/m126610ln-0001',
      '_blank',
      'noopener,noreferrer'
    );
    expect(screen.getByText(/Opening official model page for 126610LN/i)).toBeInTheDocument();
  });

  it('warns when a specific model was not found on the official site', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => [
        {
          brand: 'Rolex',
          name: 'Unlisted Reference',
          reference: 'UNKNOWN-1',
          collection: 'Archive',
          class: 'Dress',
          image: 'https://example.com/unlisted.png',
          description: 'No official model URL.',
          officialUrlStatus: 'not_found',
        },
      ],
    });

    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /^brands$/i }));
    fireEvent.click(screen.getByText(/^Rolex$/i));
    fireEvent.click(await screen.findByText(/^Unlisted Reference$/i));

    expect(screen.getByText(/was not found on the official Rolex site/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /enquire on official site/i }));

    expect(window.open).toHaveBeenCalledWith(
      'https://www.rolex.com/',
      '_blank',
      'noopener,noreferrer'
    );
  });
});
