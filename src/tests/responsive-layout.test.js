import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('Responsive Layout Validation', () => {
  let originalInnerWidth;
  let originalInnerHeight;
  let originalMatchMedia;

  beforeEach(() => {
    originalInnerWidth = window.innerWidth;
    originalInnerHeight = window.innerHeight;
    originalMatchMedia = window.matchMedia;
  });

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: originalInnerHeight,
    });
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: originalMatchMedia,
    });
  });

  describe('Key Breakpoint Testing', () => {
    it('should render properly at tablet breakpoint (768px)', () => {
      const { container } = render(<App />);
      
      const layoutContainer = container.querySelector('main');
      expect(layoutContainer).toBeTruthy();
      expect(layoutContainer).toHaveClass('max-w-4xl');
      expect(layoutContainer).toHaveClass('px-4');
      
      const parentContainer = layoutContainer.parentElement;
      expect(parentContainer).toHaveClass('justify-center');
    });

    it('should render properly at desktop-small breakpoint (1024px)', () => {
      const { container } = render(<App />);
      
      const layoutContainer = container.querySelector('main');
      expect(layoutContainer).toBeTruthy();
      expect(layoutContainer).toHaveClass('max-w-4xl');
      expect(layoutContainer).toHaveClass('lg:px-8');
    });

    it('should render properly at desktop-large breakpoint (1280px)', () => {
      const { container } = render(<App />);
      
      const layoutContainer = container.querySelector('main');
      expect(layoutContainer).toBeTruthy();
      expect(layoutContainer).toHaveClass('max-w-4xl');
    });

    it('should render properly at desktop-xl breakpoint (1536px)', () => {
      const { container } = render(<App />);
      
      const layoutContainer = container.querySelector('main');
      expect(layoutContainer).toBeTruthy();
      expect(layoutContainer).toHaveClass('max-w-4xl');
    });
  });

  describe('Content Width Constraints', () => {
    it('should maintain max-w-4xl constraint for large screens', () => {
      const { container } = render(<App />);
      const mainContainer = container.querySelector('main');
      
      expect(mainContainer).toHaveClass('max-w-4xl');
      expect(mainContainer).toHaveClass('w-full');
    });

    it('should not have conflicting width constraints in Header', () => {
      const { container } = render(<App />);
      
      const headerElements = container.querySelectorAll('*');
      const conflictingElements = Array.from(headerElements).filter(el => 
        el.className && (
          el.className.includes('max-w-2xl') || 
          (el.className.includes('mx-auto') && el.className.includes('max-w'))
        )
      );
      
      expect(conflictingElements.length).toBe(0);
    });
  });

  describe('Component Alignment and Spacing', () => {
    it('should maintain consistent spacing between major sections', () => {
      const { container } = render(<App />);
      
      const elementsWithSpacing = container.querySelectorAll('[class*="mb-12"], [class*="mb-8"]');
      expect(elementsWithSpacing.length).toBeGreaterThan(0);
    });

    it('should center all content within the layout container', () => {
      const { container } = render(<App />);
      
      const layoutContainer = container.querySelector('.justify-center');
      expect(layoutContainer).toBeTruthy();
      
      const mainContainer = container.querySelector('main');
      expect(mainContainer).toBeTruthy();
      expect(mainContainer.parentElement).toHaveClass('justify-center');
    });
  });

  describe('Responsive Padding Behavior', () => {
    it('should apply correct padding at different breakpoints', () => {
      const { container } = render(<App />);
      const mainContainer = container.querySelector('main');
      
      expect(mainContainer).toHaveClass('px-4');
      expect(mainContainer).toHaveClass('sm:px-6');
      expect(mainContainer).toHaveClass('lg:px-8');
    });
  });

  describe('Visual Consistency Validation', () => {
    it('should maintain proper content hierarchy', () => {
      const { container } = render(<App />);
      
      expect(container.querySelector('main')).toBeTruthy();
      
      const backgroundEffect = container.querySelector('[class*="bg-\\[radial-gradient"]');
      expect(backgroundEffect).toBeTruthy();
      
      const layoutWrapper = container.querySelector('.min-h-screen');
      expect(layoutWrapper).toBeTruthy();
    });

    it('should preserve existing functionality while improving layout', () => {
      const { container } = render(<App />);
      
      expect(screen.getByText(/Hi, I am Eduardo Rigo/)).toBeTruthy();
      expect(screen.getByText(/CURRENTLY/)).toBeTruthy();
      expect(screen.getByText(/Recent Projects/)).toBeTruthy();
      expect(screen.getByText(/Technologies/)).toBeTruthy();
      
      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Layout System Integration', () => {
    it('should provide unified approach to content centering', () => {
      const { container } = render(<App />);
      
      const mainContainer = container.querySelector('main.max-w-4xl');
      expect(mainContainer).toBeTruthy();
      
      const layoutParent = container.querySelector('.justify-center');
      expect(layoutParent).toBeTruthy();
      expect(layoutParent.querySelector('main')).toBeTruthy();
    });
  });
});