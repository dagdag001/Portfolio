import { describe, it, expect } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';
import fc from 'fast-check';
import CVLink from '../components/CVLink';

describe('CVLink Property-Based Tests', () => {
  
  describe('Property 1: Link Navigation', () => {
    it('should open the CV URL in a new tab for any user interaction with the CV link', () => {
      // **Feature: cv-link, Property 1: Link Navigation**
      // **Validates: Requirements 1.2, 4.2**
      
      fc.assert(
        fc.property(
          fc.record({
            variant: fc.constantFrom('primary', 'secondary'),
            size: fc.constantFrom('sm', 'md', 'lg'),
            cvUrl: fc.webUrl(),
            interactionType: fc.constantFrom('click', 'keyboardEnter', 'keyboardSpace')
          }),
          ({ variant, size, cvUrl, interactionType }) => {
            const { container } = render(
              <CVLink 
                variant={variant}
                size={size}
                cvUrl={cvUrl}
              />
            );
            
            const linkElement = container.querySelector('[role="button"]');
            expect(linkElement).toBeTruthy();
            
            // Mock window.open to capture navigation attempts
            const originalOpen = window.open;
            let openedUrl = null;
            let openedTarget = null;
            let openedFeatures = null;
            
            window.open = (url, target, features) => {
              openedUrl = url;
              openedTarget = target;
              openedFeatures = features;
              return { closed: false }; // Mock successful window opening
            };
            
            try {
              // Perform the interaction based on type
              switch (interactionType) {
                case 'click':
                  fireEvent.click(linkElement);
                  break;
                case 'keyboardEnter':
                  fireEvent.keyDown(linkElement, { key: 'Enter' });
                  break;
                case 'keyboardSpace':
                  fireEvent.keyDown(linkElement, { key: ' ' });
                  break;
              }
              
              // Verify that window.open was called with correct parameters
              expect(openedUrl).toBe(cvUrl);
              expect(openedTarget).toBe('_blank');
              expect(openedFeatures).toBe('noopener,noreferrer');
              
              // Verify visual feedback is provided
              const classes = linkElement.className;
              expect(classes).toMatch(/transition-all/);
              
            } finally {
              // Restore original window.open
              window.open = originalOpen;
            }
            
            cleanup();
          }
        ),
        { numRuns: 100 }
      );
    });
  });
  
  describe('Property 2: Theme Integration', () => {
    it('should display appropriate styling for any theme state', () => {
      // **Feature: cv-link, Property 2: Theme Integration**
      // **Validates: Requirements 2.1, 2.3**
      
      fc.assert(
        fc.property(
          fc.record({
            variant: fc.constantFrom('primary', 'secondary'),
            size: fc.constantFrom('sm', 'md', 'lg'),
            isDark: fc.boolean(),
            cvUrl: fc.webUrl()
          }),
          ({ variant, size, isDark, cvUrl }) => {
            // Setup theme by adding/removing dark class
            if (isDark) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
            
            const { container } = render(
              <CVLink 
                variant={variant}
                size={size}
                cvUrl={cvUrl}
              />
            );
            
            const linkElement = container.querySelector('[role="button"]');
            expect(linkElement).toBeTruthy();
            
            // Verify the component renders without errors
            expect(linkElement).toBeInTheDocument();
            
            // Verify theme-aware classes are present
            const classes = linkElement.className;
            
            // Should have focus ring classes that work with both themes
            expect(classes).toMatch(/focus:ring-offset-2/);
            
            // Should have transition classes for smooth theme changes
            expect(classes).toMatch(/transition-all/);
            
            // Variant-specific theme checks
            if (variant === 'primary') {
              // Primary variant should have gradient background
              expect(classes).toMatch(/bg-gradient-to-r/);
            } else if (variant === 'secondary') {
              // Secondary variant should have theme-aware border and text colors
              expect(classes).toMatch(/border-gray-|text-gray-/);
            }
            
            cleanup();
            
            // Reset theme state
            document.documentElement.classList.remove('dark');
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 3: Responsive Design', () => {
    it('should render appropriately for any viewport size within supported range', () => {
      // **Feature: cv-link, Property 3: Responsive Design**
      // **Validates: Requirements 2.2**
      
      fc.assert(
        fc.property(
          fc.record({
            variant: fc.constantFrom('primary', 'secondary'),
            size: fc.constantFrom('sm', 'md', 'lg'),
            cvUrl: fc.webUrl(),
            // Simulate different viewport widths (mobile: 320-767, tablet: 768-1023, desktop: 1024+)
            viewportWidth: fc.integer({ min: 320, max: 1920 }),
            viewportHeight: fc.integer({ min: 568, max: 1080 })
          }),
          ({ variant, size, cvUrl, viewportWidth, viewportHeight }) => {
            // Mock window dimensions for responsive testing
            Object.defineProperty(window, 'innerWidth', {
              writable: true,
              configurable: true,
              value: viewportWidth,
            });
            Object.defineProperty(window, 'innerHeight', {
              writable: true,
              configurable: true,
              value: viewportHeight,
            });
            
            const { container } = render(
              <CVLink 
                variant={variant}
                size={size}
                cvUrl={cvUrl}
              />
            );
            
            const linkElement = container.querySelector('[role="button"]');
            expect(linkElement).toBeTruthy();
            
            // Verify the component renders without errors
            expect(linkElement).toBeInTheDocument();
            
            // Verify responsive classes are present
            const classes = linkElement.className;
            
            // Should have responsive padding/sizing classes
            expect(classes).toMatch(/px-\d+|py-\d+/);
            
            // Should have proper text sizing
            expect(classes).toMatch(/text-(xs|sm|base)/);
            
            // Should maintain proper structure regardless of viewport
            const textElement = linkElement.querySelector('span');
            expect(textElement).toBeInTheDocument();
            expect(textElement.textContent).toBe('View CV');
            
            // Should have icons that scale appropriately
            const icons = linkElement.querySelectorAll('svg');
            expect(icons.length).toBeGreaterThanOrEqual(2); // CV icon + external link icon
            
            // Should maintain accessibility regardless of size
            expect(linkElement.getAttribute('aria-label')).toBe('View CV document in new tab');
            expect(linkElement.getAttribute('role')).toBe('button');
            expect(linkElement.getAttribute('tabIndex')).toBe('0');
            
            cleanup();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 4: Keyboard Accessibility', () => {
    it('should be focusable via tab navigation and provide clear visual focus indicators for any keyboard navigation sequence', () => {
      // **Feature: cv-link, Property 4: Keyboard Accessibility**
      // **Validates: Requirements 3.2, 3.3**
      
      fc.assert(
        fc.property(
          fc.record({
            variant: fc.constantFrom('primary', 'secondary'),
            size: fc.constantFrom('sm', 'md', 'lg'),
            cvUrl: fc.webUrl(),
            keySequence: fc.array(
              fc.constantFrom('Tab', 'Enter', ' ', 'Escape'),
              { minLength: 1, maxLength: 3 }
            )
          }),
          ({ variant, size, cvUrl, keySequence }) => {
            const { container } = render(
              <CVLink 
                variant={variant}
                size={size}
                cvUrl={cvUrl}
              />
            );
            
            const linkElement = container.querySelector('[role="button"]');
            expect(linkElement).toBeTruthy();
            
            // Verify initial keyboard accessibility attributes
            expect(linkElement.getAttribute('tabIndex')).toBe('0');
            expect(linkElement.getAttribute('role')).toBe('button');
            expect(linkElement.getAttribute('aria-label')).toBeTruthy();
            
            // Test focus behavior
            linkElement.focus();
            expect(document.activeElement).toBe(linkElement);
            
            // Verify focus creates visual indicators
            fireEvent.focus(linkElement);
            
            // Check for focus-related classes or styles
            const classes = linkElement.className;
            expect(classes).toMatch(/focus:ring-|focus:outline-/);
            
            // Test keyboard navigation sequence
            let totalOpenCalls = 0;
            keySequence.forEach((key, index) => {
              if (key === 'Enter' || key === ' ') {
                // Mock window.open to prevent actual navigation during tests
                const originalOpen = window.open;
                let openCalled = false;
                window.open = () => { 
                  openCalled = true; 
                  totalOpenCalls++;
                };
                
                fireEvent.keyDown(linkElement, { key });
                
                // For the first activation key, it should always work
                // For subsequent keys, it may be debounced
                if (index === 0 || totalOpenCalls === 0) {
                  expect(openCalled).toBe(true);
                }
                
                // Restore original window.open
                window.open = originalOpen;
              } else if (key === 'Tab') {
                fireEvent.keyDown(linkElement, { key: 'Tab' });
                // Tab navigation should work
              } else if (key === 'Escape') {
                fireEvent.keyDown(linkElement, { key: 'Escape' });
                // Escape should not activate the link
              }
            });
            
            // Verify component maintains accessibility
            expect(linkElement.getAttribute('role')).toBe('button');
            expect(linkElement.getAttribute('tabIndex')).toBe('0');
            
            cleanup();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 5: Interaction State Management', () => {
    it('should display appropriate visual feedback for any user interaction state', () => {
      // **Feature: cv-link, Property 5: Interaction State Management**
      // **Validates: Requirements 2.5, 4.1**
      
      fc.assert(
        fc.property(
          fc.record({
            variant: fc.constantFrom('primary', 'secondary'),
            size: fc.constantFrom('sm', 'md', 'lg'),
            cvUrl: fc.webUrl(),
            interactionSequence: fc.array(
              fc.constantFrom('hover', 'click'),
              { minLength: 1, maxLength: 2 }
            )
          }),
          ({ variant, size, cvUrl, interactionSequence }) => {
            const { container } = render(
              <CVLink 
                variant={variant}
                size={size}
                cvUrl={cvUrl}
              />
            );
            
            const linkElement = container.querySelector('[role="button"]');
            expect(linkElement).toBeTruthy();
            
            // Verify initial state has proper interaction classes
            const initialClasses = linkElement.className;
            expect(initialClasses).toMatch(/hover:|focus:|active:/);
            expect(initialClasses).toMatch(/transition-all/);
            
            // Test interaction sequence
            let totalClicks = 0;
            let totalOpenCalls = 0;
            interactionSequence.forEach(interaction => {
              switch (interaction) {
                case 'hover':
                  fireEvent.mouseEnter(linkElement);
                  // Should have hover effects
                  expect(linkElement.className).toMatch(/hover:/);
                  fireEvent.mouseLeave(linkElement);
                  break;
                  
                case 'click':
                  // Mock window.open to prevent actual navigation
                  const originalOpen = window.open;
                  let openCalled = false;
                  window.open = () => { 
                    openCalled = true; 
                    totalOpenCalls++;
                  };
                  
                  fireEvent.click(linkElement);
                  totalClicks++;
                  
                  // For the first click, it should always work
                  // For subsequent clicks, it may be debounced
                  if (totalClicks === 1) {
                    expect(openCalled).toBe(true);
                  }
                  
                  // Restore original window.open
                  window.open = originalOpen;
                  break;
              }
            });
            
            // Verify component maintains proper accessibility throughout interactions
            expect(linkElement.getAttribute('role')).toBe('button');
            expect(linkElement.getAttribute('tabIndex')).toBe('0');
            expect(linkElement.getAttribute('aria-label')).toBeTruthy();
            
            // Verify visual feedback classes are present
            const finalClasses = linkElement.className;
            expect(finalClasses).toMatch(/cursor-pointer/);
            expect(finalClasses).toMatch(/transition-all/);
            
            cleanup();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 6: Multiple Click Handling', () => {
    it('should handle any sequence of rapid link clicks gracefully without causing issues', () => {
      // **Feature: cv-link, Property 6: Multiple Click Handling**
      // **Validates: Requirements 4.3**
      
      fc.assert(
        fc.property(
          fc.record({
            variant: fc.constantFrom('primary', 'secondary'),
            size: fc.constantFrom('sm', 'md', 'lg'),
            cvUrl: fc.webUrl(),
            clickCount: fc.integer({ min: 2, max: 10 }),
            clickInterval: fc.integer({ min: 10, max: 500 }) // milliseconds between clicks
          }),
          ({ variant, size, cvUrl, clickCount, clickInterval }) => {
            const { container } = render(
              <CVLink 
                variant={variant}
                size={size}
                cvUrl={cvUrl}
              />
            );
            
            const linkElement = container.querySelector('[role="button"]');
            expect(linkElement).toBeTruthy();
            
            // Mock window.open to capture navigation attempts
            const originalOpen = window.open;
            let openCallCount = 0;
            const openCalls = [];
            
            window.open = (url, target, features) => {
              openCallCount++;
              openCalls.push({ url, target, features, timestamp: Date.now() });
              return { closed: false }; // Mock successful window opening
            };
            
            try {
              // Perform rapid clicks
              const startTime = Date.now();
              for (let i = 0; i < clickCount; i++) {
                fireEvent.click(linkElement);
                
                // No need to simulate time passing in tests - just test rapid succession
              }
              
              // Verify that multiple rapid clicks are handled gracefully
              // The component should either:
              // 1. Debounce clicks (fewer opens than clicks)
              // 2. Handle all clicks properly (same number of opens as clicks)
              // But it should NOT crash or behave unexpectedly
              
              expect(openCallCount).toBeGreaterThan(0);
              expect(openCallCount).toBeLessThanOrEqual(clickCount);
              
              // Verify all successful opens used correct parameters
              openCalls.forEach(call => {
                expect(call.url).toBe(cvUrl);
                expect(call.target).toBe('_blank');
                expect(call.features).toBe('noopener,noreferrer');
              });
              
              // Verify component remains functional after rapid clicks
              expect(linkElement).toBeInTheDocument();
              expect(linkElement.getAttribute('role')).toBe('button');
              expect(linkElement.getAttribute('tabIndex')).toBe('0');
              
              // Component should not be in an error state
              const classes = linkElement.className;
              expect(classes).toMatch(/cursor-pointer|cursor-wait/); // Should have appropriate cursor
              
            } finally {
              // Restore original window.open
              window.open = originalOpen;
            }
            
            cleanup();
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});