/**
 * Global Zustand Store
 * Centralized reactive state store managing smooth scroll instance,
 * intro loading lifecycle, full-screen menu state, and WebGL fluid color matrices.
 */
import { create } from 'zustand';

export const useStore = create((set) => ({
  // Lenis smooth scroll instance
  lenis: undefined,
  setLenis: (lenis) => set({ lenis }),

  // Tracks if the introductory loader animation has concluded
  introOut: false,
  setIntroOut: (introOut) => set({ introOut }),

  // Controls open/close state of the full-screen navigation drawer
  isMenuOpen: false,
  setIsMenuOpen: (isMenuOpen) => set({ isMenuOpen }),

  // Page loading overlay state
  isLoading: true,
  setIsLoading: (isLoading) => set({ isLoading }),

  // Active color matrix uniform for WebGL fluid simulation
  fluidColor: '#d7d7d4',
  setFluidColor: (fluidColor) => set({ fluidColor }),

  // About view active marker
  isAbout: false,
  setIsAbout: (isAbout) => set({ isAbout }),
}));
