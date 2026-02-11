import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import Profile from '../components/Profile';

describe('CVLink Integration Tests', () => {
  let originalInnerWidth;
  let originalOpen;

  beforeEach(() => {
    originalInnerWidth = window.innerWidth;
    originalOpen = window.open;
    
    // Mock window.open to prevent actual navigation during tests
    window.open = vi.fn(() => ({
      closed: false,
      focus: vi.fn()
    }));
  });

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    window.open = originalOpen;
  });

  describe('Profile Component Integration', () => {
    it('should render Profile component with CVLink integrated', () => {
      render(<Profile />);
      
      // Verify Profile component content is present
      expect(screen.getByText('CURRENTLY')).toBeInTheDocument();
      expect(screen.getByText('FullStack Developer')).toBeInTheDocument();
      expect(screen.getByText('2024 - Present')).toBeInTheDocument();
      
      // Verify CVLink is integrated
      expect(screen.getByRole('button', { name: /view cv/i })).toBeInTheDocument();
    });

    it('should position CVLink correctly within Profile layout', () => {
      const { container } = render(<Profile />);
      
      // Find the CV link container
      const cvLinkContainer = container.querySelector('.mt-4.sm\\:mt-6');
      expect(cvLinkContainer).toBeTruthy();
      
      // Verify it contains the CV link button
      const cvButton = cvLinkContainer.querySelector('[role="button"]');
      expect(cvButton).toBeTruthy();
      expect(cvButton).toHaveAttribute('aria-label', 'View CV document in new tab');
    });

    it('should maintain Profile component animations with CVLink', async () => {
      const { container } = render(<Profile />);
      
      // Verify the main Profile container has transition classes
      const profileContainer = container.querySelector('.transition-all.duration-500');
      expect(profileContainer).toBeTruthy();
      
      // Verify CVLink doesn't interfere with Profile animations
      const cvButton = screen.getByRole('button', { name: /view cv/i });
      expect(cvButton).toBeInTheDocument();
      
      // Wait for Profile animation to complete (100ms timeout + some buffer)
      await waitFor(() => {
        expect(profileContainer).toHaveStyle({ opacity: '1' });
      }, { timeout: 500 });
    });

    it('should use correct CV URL from Profile component', () => {
      render(<Profile />);
      
      const cvButton = screen.getByRole('button', { name: /view cv/i });
      fireEvent.click(cvButton);
      
      // Verify window.open was called with the correct Google Drive URL
      expect(window.open).toHaveBeenCalledWith(
        'https://drive.google.com/file/d/19CoQxtVemS2xAILQCayBm8--_E-ep0Xq/view?usp=drive_link',
        '_blank',
        'noopener,noreferrer'
      );
    });
  });

  describe('Theme Integration', () => {
    it('should inherit theme context from parent Profile component', () => {
      const { container } = render(<Profile />);
      
      const cvButton = screen.getByRole('button', { name: /view cv/i });
      
      // Verify CVLink has theme-aware classes
      expect(cvButton.className).toMatch(/dark:/);
      
      // Should have solid blue styling for primary variant (better visibility)
      expect(cvButton.className).toMatch(/!bg-blue-600/);
      expect(cvButton.className).toMatch(/!text-white/);
      expect(cvButton.className).toMatch(/!border-blue-600/);
    });

    it('should maintain consistent styling with Profile component', () => {
      const { container } = render(<Profile />);
      
      // Profile uses specific text colors and spacing
      const profileText = container.querySelector('.text-gray-400.dark\\:text-gray-400');
      expect(profileText).toBeTruthy();
      
      // CVLink should complement the Profile styling
      const cvButton = screen.getByRole('button', { name: /view cv/i });
      expect(cvButton).toHaveClass('rounded-lg');
      expect(cvButton).toHaveClass('font-medium');
    });
  });

  describe('Responsive Behavior in Context', () => {
    it('should maintain responsive spacing within Profile layout at mobile size', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      const { container } = render(<Profile />);
      
      // Verify Profile responsive classes are maintained
      const profileSections = container.querySelectorAll('.mb-6.sm\\:mb-8');
      expect(profileSections.length).toBeGreaterThan(0);
      
      // Verify CVLink container has responsive spacing
      const cvLinkContainer = container.querySelector('.mt-4.sm\\:mt-6');
      expect(cvLinkContainer).toBeTruthy();
      
      // CVLink should be responsive within the Profile context
      const cvButton = screen.getByRole('button', { name: /view cv/i });
      expect(cvButton).toHaveClass('px-4'); // Medium size by default
    });

    it('should maintain responsive spacing within Profile layout at tablet size', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      const { container } = render(<Profile />);
      
      // Verify responsive spacing is applied correctly
      const cvLinkContainer = container.querySelector('.mt-4.sm\\:mt-6');
      expect(cvLinkContainer).toBeTruthy();
      
      const cvButton = screen.getByRole('button', { name: /view cv/i });
      expect(cvButton).toBeInTheDocument();
    });

    it('should maintain responsive spacing within Profile layout at desktop size', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      const { container } = render(<Profile />);
      
      // Desktop should maintain proper spacing
      const cvLinkContainer = container.querySelector('.mt-4.sm\\:mt-6');
      expect(cvLinkContainer).toBeTruthy();
      
      const cvButton = screen.getByRole('button', { name: /view cv/i });
      expect(cvButton).toBeInTheDocument();
    });
  });

  describe('Accessibility Integration', () => {
    it('should maintain Profile accessibility with CVLink addition', () => {
      render(<Profile />);
      
      // Profile should maintain its semantic structure
      expect(screen.getByText('CURRENTLY')).toBeInTheDocument();
      
      // CVLink should add proper accessibility without breaking Profile
      const cvButton = screen.getByRole('button', { name: /view cv/i });
      expect(cvButton).toHaveAttribute('aria-label', 'View CV document in new tab');
      expect(cvButton).toHaveAttribute('tabindex', '0');
    });

    it('should support keyboard navigation within Profile context', () => {
      render(<Profile />);
      
      const cvButton = screen.getByRole('button', { name: /view cv/i });
      
      // Should be focusable via keyboard
      cvButton.focus();
      expect(document.activeElement).toBe(cvButton);
      
      // Should handle keyboard activation
      fireEvent.keyDown(cvButton, { key: 'Enter' });
      expect(window.open).toHaveBeenCalled();
    });
  });

  describe('Requirements Validation', () => {
    it('should meet Requirement 1.1 - CV link displayed prominently in portfolio', () => {
      render(<Profile />);
      
      // CVLink should be visible and prominent within Profile
      const cvButton = screen.getByRole('button', { name: /view cv/i });
      expect(cvButton).toBeInTheDocument();
      
      // Should have visual prominence with solid blue styling
      expect(cvButton.className).toMatch(/!bg-blue-600/);
    });

    it('should meet Requirement 2.1 - Theme integration with existing design', () => {
      const { container } = render(<Profile />);
      
      const cvButton = screen.getByRole('button', { name: /view cv/i });
      
      // Should have dark mode classes for theme integration
      expect(cvButton.className).toMatch(/dark:/);
      
      // Should integrate with Profile's existing theme patterns
      const profileElements = container.querySelectorAll('.dark\\:text-gray-400');
      expect(profileElements.length).toBeGreaterThan(0);
    });

    it('should meet Requirement 2.2 - Responsive design across screen sizes', () => {
      const breakpoints = [375, 768, 1024];
      
      breakpoints.forEach(width => {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: width,
        });

        const { container, unmount } = render(<Profile />);
        
        // CVLink should be responsive at all breakpoints
        const cvButton = screen.getByRole('button', { name: /view cv/i });
        expect(cvButton).toBeInTheDocument();
        
        // Should maintain proper spacing within Profile
        const cvLinkContainer = container.querySelector('.mt-4.sm\\:mt-6');
        expect(cvLinkContainer).toBeTruthy();
        
        // Clean up for next iteration
        unmount();
      });
    });
  });
});