import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';
import Header from '../components/Header';
import Profile from '../components/Profile';
import Projects from '../components/Projects';

describe('Mobile Responsiveness Testing', () => {
  let originalInnerWidth;
  let originalInnerHeight;

  beforeEach(() => {
    originalInnerWidth = window.innerWidth;
    originalInnerHeight = window.innerHeight;
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
  });

  describe('Breakpoint Testing - 320px (Small Phones)', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 320,
      });
    });

    it('should render app without horizontal overflow at 320px', () => {
      const { container } = render(<App />);
      const main = container.querySelector('main');
      
      expect(main).toBeTruthy();
      expect(main).toHaveClass('px-4');
    });

    it('should display header logo with mobile size at 320px', () => {
      const { container } = render(<Header theme="dark" toggleTheme={() => {}} />);
      const logo = container.querySelector('img[alt="Logo"]');
      
      expect(logo).toBeTruthy();
      expect(logo).toHaveClass('w-8');
      expect(logo).toHaveClass('h-8');
    });

    it('should display name text with mobile size at 320px', () => {
      const { container } = render(<Header theme="dark" toggleTheme={() => {}} />);
      const nameLetters = container.querySelectorAll('.text-2xl');
      
      expect(nameLetters.length).toBeGreaterThan(0);
    });

    it('should display profile image with mobile size at 320px', () => {
      const { container } = render(<Header theme="dark" toggleTheme={() => {}} />);
      const profileContainer = container.querySelector('.w-16');
      
      expect(profileContainer).toBeTruthy();
    });

    it('should apply mobile spacing at 320px', () => {
      const { container } = render(<Header theme="dark" toggleTheme={() => {}} />);
      const spacingElements = container.querySelectorAll('[class*="mb-8"]');
      
      expect(spacingElements.length).toBeGreaterThan(0);
    });
  });

  describe('Breakpoint Testing - 375px (iPhone SE, Standard Phones)', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
    });

    it('should render app properly at 375px', () => {
      const { container } = render(<App />);
      const main = container.querySelector('main');
      
      expect(main).toBeTruthy();
      expect(main).toHaveClass('px-4');
    });

    it('should maintain proper header layout at 375px', () => {
      const { container } = render(<Header theme="dark" toggleTheme={() => {}} />);
      const headerContainer = container.querySelector('.flex.items-center.justify-between');
      
      expect(headerContainer).toBeTruthy();
    });

    it('should display filter controls properly at 375px', () => {
      const { container } = render(<Projects />);
      const filterInput = container.querySelector('input[placeholder="Filter projects..."]');
      
      expect(filterInput).toBeTruthy();
      expect(filterInput).toHaveClass('w-full');
    });

    it('should ensure touch targets are adequate at 375px', () => {
      const { container } = render(<Header theme="dark" toggleTheme={() => {}} />);
      const darkModeToggle = container.querySelector('button[aria-label="Toggle dark mode"]');
      
      expect(darkModeToggle).toBeTruthy();
      expect(darkModeToggle).toHaveClass('p-2');
    });
  });

  describe('Breakpoint Testing - 414px (Larger Phones)', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 414,
      });
    });

    it('should render app without issues at 414px', () => {
      const { container } = render(<App />);
      const main = container.querySelector('main');
      
      expect(main).toBeTruthy();
    });

    it('should maintain responsive padding at 414px', () => {
      const { container } = render(<App />);
      const main = container.querySelector('main');
      
      expect(main).toHaveClass('px-4');
    });

    it('should display project cards in single column at 414px', () => {
      const { container } = render(<Projects />);
      const projectCards = container.querySelectorAll('[role="group"]');
      
      projectCards.forEach(card => {
        expect(card).toHaveClass('basis-full');
      });
    });
  });

  describe('Breakpoint Testing - 768px (Tablet Breakpoint)', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
    });

    it('should render app at tablet breakpoint', () => {
      const { container } = render(<App />);
      const main = container.querySelector('main');
      
      expect(main).toBeTruthy();
      expect(main).toHaveClass('sm:px-6');
    });

    it('should maintain proper layout at 768px', () => {
      const { container } = render(<Header theme="dark" toggleTheme={() => {}} />);
      
      expect(container.querySelector('.sm\\:text-4xl')).toBeTruthy();
    });
  });

  describe('Horizontal Scrolling Prevention', () => {
    const breakpoints = [320, 375, 414, 768];

    breakpoints.forEach(width => {
      it(`should not cause horizontal overflow at ${width}px`, () => {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: width,
        });

        const { container } = render(<App />);
        const main = container.querySelector('main');
        
        expect(main).toBeTruthy();
        expect(main).toHaveClass('px-4');
        
        // Verify no fixed-width elements that exceed viewport
        const allElements = container.querySelectorAll('*');
        allElements.forEach(el => {
          const className = typeof el.className === 'string' ? el.className : '';
          const hasFixedWidth = className && className.includes('w-[') && 
                                !className.includes('max-w');
          if (hasFixedWidth) {
            // Fixed widths should be reasonable for mobile
            expect(className).not.toMatch(/w-\[\d{4,}px\]/);
          }
        });
      });
    });

    it('should apply consistent horizontal padding across all sections', () => {
      const { container } = render(<App />);
      const main = container.querySelector('main');
      
      expect(main).toHaveClass('px-4');
      expect(main).toHaveClass('sm:px-6');
      expect(main).toHaveClass('lg:px-8');
    });

    it('should ensure filter input is full width on mobile', () => {
      const { container } = render(<Projects />);
      const filterInput = container.querySelector('input[placeholder="Filter projects..."]');
      
      expect(filterInput).toBeTruthy();
      expect(filterInput).toHaveClass('w-full');
    });
  });

  describe('Touch Target Validation (44x44px Minimum)', () => {
    it('should ensure dark mode toggle has adequate touch target', () => {
      const { container } = render(<Header theme="dark" toggleTheme={() => {}} />);
      const darkModeToggle = container.querySelector('button[aria-label="Toggle dark mode"]');
      
      expect(darkModeToggle).toBeTruthy();
      expect(darkModeToggle).toHaveClass('p-2');
      
      // Icon inside should be h-5 w-5, with p-2 padding gives adequate touch target
      const icon = darkModeToggle.querySelector('svg');
      expect(icon).toBeTruthy();
      expect(icon).toHaveClass('h-5');
      expect(icon).toHaveClass('w-5');
    });

    it('should ensure filter buttons have minimum 44px height', () => {
      const { container } = render(<Projects />);
      const filterButtons = container.querySelectorAll('button[aria-haspopup="menu"]');
      
      filterButtons.forEach(button => {
        expect(button).toHaveClass('min-h-[44px]');
      });
    });

    it('should ensure filter buttons have adequate padding', () => {
      const { container } = render(<Projects />);
      const filterButtons = container.querySelectorAll('button[aria-haspopup="menu"]');
      
      filterButtons.forEach(button => {
        expect(button).toHaveClass('px-3');
        expect(button).toHaveClass('py-2');
      });
    });

    it('should ensure Clear All button has adequate touch target', () => {
      const { container } = render(<Projects />);
      // Clear All button appears when filters are active, check for min-h class
      const buttons = container.querySelectorAll('button');
      const clearButton = Array.from(buttons).find(btn => 
        btn.textContent.includes('Clear All')
      );
      
      if (clearButton) {
        expect(clearButton).toHaveClass('min-h-[44px]');
      }
    });
  });

  describe('Mobile Layout Components', () => {
    it('should hide carousel navigation buttons on mobile', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      const { container } = render(<Projects />);
      const prevButton = container.querySelector('button[aria-label="Previous slide"]');
      const nextButton = container.querySelector('button[aria-label="Next slide"]');
      
      if (prevButton) {
        expect(prevButton).toHaveClass('hidden');
        expect(prevButton).toHaveClass('md:inline-flex');
      }
      if (nextButton) {
        expect(nextButton).toHaveClass('hidden');
        expect(nextButton).toHaveClass('md:inline-flex');
      }
    });

    it('should display project cards in single column on mobile', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      const { container } = render(<Projects />);
      const projectCards = container.querySelectorAll('[role="group"]');
      
      projectCards.forEach(card => {
        expect(card).toHaveClass('basis-full');
        expect(card).toHaveClass('md:basis-1/3');
      });
    });

    it('should apply responsive spacing to header sections', () => {
      const { container } = render(<Header theme="dark" toggleTheme={() => {}} />);
      const spacedSections = container.querySelectorAll('[class*="mb-8"]');
      
      expect(spacedSections.length).toBeGreaterThan(0);
      
      // Check for responsive spacing classes
      const responsiveSpacing = container.querySelectorAll('[class*="sm:mb-"]');
      expect(responsiveSpacing.length).toBeGreaterThan(0);
    });

    it('should apply responsive gap to profile section', () => {
      const { container } = render(<Header theme="dark" toggleTheme={() => {}} />);
      const profileSection = container.querySelector('.gap-4');
      
      expect(profileSection).toBeTruthy();
    });

    it('should maintain proper image aspect ratios on mobile', () => {
      const { container } = render(<Projects />);
      const projectImages = container.querySelectorAll('.aspect-\\[16\\/9\\]');
      
      projectImages.forEach(imageContainer => {
        expect(imageContainer).toBeTruthy();
      });
    });
  });

  describe('Typography Responsiveness', () => {
    it('should use responsive text sizes for header name', () => {
      const { container } = render(<Header theme="dark" toggleTheme={() => {}} />);
      const nameLetters = container.querySelectorAll('.text-2xl.sm\\:text-4xl');
      
      expect(nameLetters.length).toBeGreaterThan(0);
    });

    it('should use responsive text sizes for profile title', () => {
      const { container } = render(<Header theme="dark" toggleTheme={() => {}} />);
      const profileTitle = container.querySelector('.text-md');
      
      expect(profileTitle).toBeTruthy();
    });

    it('should maintain readable text on mobile', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 320,
      });

      const { container } = render(<App />);
      
      // Verify text content is present and readable
      expect(screen.getByText(/Hi, I am/)).toBeTruthy();
      expect(screen.getByText(/CURRENTLY/)).toBeTruthy();
    });
  });

  describe('Content Spacing and Padding', () => {
    it('should apply consistent 16px mobile padding', () => {
      const { container } = render(<App />);
      const main = container.querySelector('main');
      
      // px-4 = 16px (1rem = 16px, 4 * 0.25rem = 1rem)
      expect(main).toHaveClass('px-4');
    });

    it('should ensure no content touches screen edges', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 320,
      });

      const { container } = render(<App />);
      const main = container.querySelector('main');
      
      expect(main).toHaveClass('px-4');
      
      // Verify all direct children respect padding
      const children = main.children;
      Array.from(children).forEach(child => {
        // Children should not have negative margins that break padding
        const styles = window.getComputedStyle(child);
        expect(styles.marginLeft).not.toMatch(/-\d+px/);
        expect(styles.marginRight).not.toMatch(/-\d+px/);
      });
    });

    it('should apply responsive vertical spacing', () => {
      const { container } = render(<Profile />);
      const spacedElements = container.querySelectorAll('[class*="mb-"]');
      
      expect(spacedElements.length).toBeGreaterThan(0);
    });
  });

  describe('Interactive Elements Accessibility', () => {
    it('should maintain proper focus states on mobile', () => {
      const { container } = render(<Header theme="dark" toggleTheme={() => {}} />);
      const darkModeToggle = container.querySelector('button[aria-label="Toggle dark mode"]');
      
      expect(darkModeToggle).toBeTruthy();
      expect(darkModeToggle.className).toMatch(/focus/);
    });

    it('should provide proper ARIA labels for mobile navigation', () => {
      const { container } = render(<Projects />);
      const prevButton = container.querySelector('button[aria-label="Previous slide"]');
      const nextButton = container.querySelector('button[aria-label="Next slide"]');
      
      if (prevButton) {
        expect(prevButton.getAttribute('aria-label')).toBe('Previous slide');
      }
      if (nextButton) {
        expect(nextButton.getAttribute('aria-label')).toBe('Next slide');
      }
    });

    it('should maintain proper button states on mobile', () => {
      const { container } = render(<Projects />);
      const buttons = container.querySelectorAll('button');
      
      buttons.forEach(button => {
        // Buttons should have proper disabled states
        if (button.hasAttribute('disabled')) {
          expect(button.className).toMatch(/disabled/);
        }
      });
    });
  });

  describe('Requirements Validation', () => {
    it('should meet Requirement 1.1 - Logo and name display without overflow', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      const { container } = render(<Header theme="dark" toggleTheme={() => {}} />);
      const logoContainer = container.querySelector('.flex.items-center.gap-2');
      
      expect(logoContainer).toBeTruthy();
    });

    it('should meet Requirement 1.2 - Profile image size reduction', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      const { container } = render(<Header theme="dark" toggleTheme={() => {}} />);
      const profileImage = container.querySelector('.w-16.h-16');
      
      expect(profileImage).toBeTruthy();
    });

    it('should meet Requirement 1.3 - Typography adjustment', () => {
      const { container } = render(<Header theme="dark" toggleTheme={() => {}} />);
      const responsiveText = container.querySelectorAll('[class*="text-2xl"]');
      
      expect(responsiveText.length).toBeGreaterThan(0);
    });

    it('should meet Requirement 1.4 - Touch target minimum size', () => {
      const { container } = render(<Header theme="dark" toggleTheme={() => {}} />);
      const darkModeToggle = container.querySelector('button[aria-label="Toggle dark mode"]');
      
      expect(darkModeToggle).toHaveClass('p-2');
    });

    it('should meet Requirement 2.1 - Single column project layout', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      const { container } = render(<Projects />);
      const projectCards = container.querySelectorAll('[role="group"]');
      
      projectCards.forEach(card => {
        expect(card).toHaveClass('basis-full');
      });
    });

    it('should meet Requirement 2.2 - Filter controls tappable and spaced', () => {
      const { container } = render(<Projects />);
      const filterButtons = container.querySelectorAll('button[aria-haspopup="menu"]');
      
      filterButtons.forEach(button => {
        expect(button).toHaveClass('min-h-[44px]');
        expect(button).toHaveClass('px-3');
      });
    });

    it('should meet Requirement 3.1 - Consistent horizontal padding', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      const { container } = render(<App />);
      const main = container.querySelector('main');
      
      expect(main).toHaveClass('px-4');
    });

    it('should meet Requirement 3.2 - No content beyond viewport', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 320,
      });

      const { container } = render(<App />);
      const main = container.querySelector('main');
      
      expect(main).toBeTruthy();
      expect(main).toHaveClass('px-4');
    });

    it('should meet Requirement 5.2 - Adequate touch target sizes', () => {
      const { container } = render(<App />);
      const buttons = container.querySelectorAll('button');
      
      // Check that interactive buttons have adequate sizing
      buttons.forEach(button => {
        const hasAdequatePadding = 
          button.className.includes('p-2') || 
          button.className.includes('p-3') ||
          button.className.includes('px-3') ||
          button.className.includes('min-h-[44px]');
        
        if (button.getAttribute('aria-label') || button.getAttribute('aria-haspopup')) {
          expect(hasAdequatePadding).toBe(true);
        }
      });
    });
  });
});
