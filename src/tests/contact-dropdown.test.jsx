import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ContactDropdown from '../components/ContactDropdown';
import Header from '../components/Header';

describe('ContactDropdown Component Tests', () => {
  describe('Rendering Tests', () => {
    it('should not render when isOpen is false', () => {
      const { container } = render(
        <ContactDropdown isOpen={false} onClose={() => {}} position="right" />
      );
      
      const dropdown = container.querySelector('[role="menu"]');
      expect(dropdown).toBeNull();
    });

    it('should render when isOpen is true', () => {
      const { container } = render(
        <ContactDropdown isOpen={true} onClose={() => {}} position="right" />
      );
      
      const dropdown = container.querySelector('[role="menu"]');
      expect(dropdown).toBeTruthy();
      expect(dropdown).toHaveAttribute('aria-label', 'Contact options');
    });

    it('should display all three contact methods', () => {
      render(<ContactDropdown isOpen={true} onClose={() => {}} position="right" />);
      
      expect(screen.getByText('Email')).toBeTruthy();
      expect(screen.getByText('dagimw14@gmail.com')).toBeTruthy();
      
      expect(screen.getByText('WhatsApp')).toBeTruthy();
      expect(screen.getByText('+251 98 020 7363')).toBeTruthy();
      
      expect(screen.getByText('Telegram')).toBeTruthy();
      expect(screen.getByText('@cole_j_p')).toBeTruthy();
    });

    it('should render with correct positioning class when position is right', () => {
      const { container } = render(
        <ContactDropdown isOpen={true} onClose={() => {}} position="right" />
      );
      
      const dropdown = container.querySelector('[role="menu"]');
      expect(dropdown).toHaveClass('right-0');
      expect(dropdown).not.toHaveClass('left-0');
    });

    it('should render with correct positioning class when position is left', () => {
      const { container } = render(
        <ContactDropdown isOpen={true} onClose={() => {}} position="left" />
      );
      
      const dropdown = container.querySelector('[role="menu"]');
      expect(dropdown).toHaveClass('left-0');
      expect(dropdown).not.toHaveClass('right-0');
    });
  });

  describe('Contact Method Data Tests', () => {
    it('should have correct href for email link', () => {
      const { container } = render(
        <ContactDropdown isOpen={true} onClose={() => {}} position="right" />
      );
      
      const emailLink = container.querySelector('a[href="mailto:dagimw14@gmail.com"]');
      expect(emailLink).toBeTruthy();
      expect(emailLink).toHaveAttribute('target', '_self');
    });

    it('should have correct href and target for WhatsApp link', () => {
      const { container } = render(
        <ContactDropdown isOpen={true} onClose={() => {}} position="right" />
      );
      
      const whatsappLink = container.querySelector('a[href="https://wa.me/251980207363?text=Hi%2C%20I%27d%20like%20to%20get%20in%20touch"]');
      expect(whatsappLink).toBeTruthy();
      expect(whatsappLink).toHaveAttribute('target', '_blank');
      expect(whatsappLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should have correct href and target for Telegram link', () => {
      const { container } = render(
        <ContactDropdown isOpen={true} onClose={() => {}} position="right" />
      );
      
      const telegramLink = container.querySelector('a[href="https://t.me/cole_j_p"]');
      expect(telegramLink).toBeTruthy();
      expect(telegramLink).toHaveAttribute('target', '_blank');
      expect(telegramLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should render icons for all contact methods', () => {
      const { container } = render(
        <ContactDropdown isOpen={true} onClose={() => {}} position="right" />
      );
      
      const icons = container.querySelectorAll('svg');
      expect(icons.length).toBe(3);
    });
  });

  describe('Click Outside Behavior', () => {
    it('should call onClose when clicking outside the dropdown', async () => {
      const onCloseMock = vi.fn();
      const { container } = render(
        <div>
          <div data-testid="outside">Outside element</div>
          <ContactDropdown isOpen={true} onClose={onCloseMock} position="right" />
        </div>
      );
      
      const outsideElement = screen.getByTestId('outside');
      fireEvent.mouseDown(outsideElement);
      
      await waitFor(() => {
        expect(onCloseMock).toHaveBeenCalledTimes(1);
      });
    });

    it('should not call onClose when clicking inside the dropdown', async () => {
      const onCloseMock = vi.fn();
      const { container } = render(
        <ContactDropdown isOpen={true} onClose={onCloseMock} position="right" />
      );
      
      const dropdown = container.querySelector('[role="menu"]');
      fireEvent.mouseDown(dropdown);
      
      await waitFor(() => {
        expect(onCloseMock).not.toHaveBeenCalled();
      }, { timeout: 100 });
    });
  });

  describe('Escape Key Behavior', () => {
    it('should call onClose when Escape key is pressed', async () => {
      const onCloseMock = vi.fn();
      render(<ContactDropdown isOpen={true} onClose={onCloseMock} position="right" />);
      
      fireEvent.keyDown(document, { key: 'Escape' });
      
      await waitFor(() => {
        expect(onCloseMock).toHaveBeenCalledTimes(1);
      });
    });

    it('should not call onClose when other keys are pressed', async () => {
      const onCloseMock = vi.fn();
      render(<ContactDropdown isOpen={true} onClose={onCloseMock} position="right" />);
      
      fireEvent.keyDown(document, { key: 'Enter' });
      fireEvent.keyDown(document, { key: 'Tab' });
      
      await waitFor(() => {
        expect(onCloseMock).not.toHaveBeenCalled();
      }, { timeout: 100 });
    });
  });

  describe('Accessibility Features', () => {
    it('should have proper ARIA attributes on dropdown', () => {
      const { container } = render(
        <ContactDropdown isOpen={true} onClose={() => {}} position="right" />
      );
      
      const dropdown = container.querySelector('[role="menu"]');
      expect(dropdown).toHaveAttribute('role', 'menu');
      expect(dropdown).toHaveAttribute('aria-label', 'Contact options');
    });

    it('should have proper role and tabIndex on menu items', () => {
      const { container } = render(
        <ContactDropdown isOpen={true} onClose={() => {}} position="right" />
      );
      
      const menuItems = container.querySelectorAll('a[role="menuitem"]');
      expect(menuItems.length).toBe(3);
      
      menuItems.forEach(item => {
        expect(item).toHaveAttribute('role', 'menuitem');
        expect(item).toHaveAttribute('tabIndex', '0');
      });
    });

    it('should have aria-label on each menu item', () => {
      const { container } = render(
        <ContactDropdown isOpen={true} onClose={() => {}} position="right" />
      );
      
      const emailItem = container.querySelector('a[aria-label="Email: dagimw14@gmail.com"]');
      expect(emailItem).toBeTruthy();
      
      const whatsappItem = container.querySelector('a[aria-label="WhatsApp: +251 98 020 7363"]');
      expect(whatsappItem).toBeTruthy();
      
      const telegramItem = container.querySelector('a[aria-label="Telegram: @cole_j_p"]');
      expect(telegramItem).toBeTruthy();
    });

    it('should have focus styles on menu items', () => {
      const { container } = render(
        <ContactDropdown isOpen={true} onClose={() => {}} position="right" />
      );
      
      const menuItems = container.querySelectorAll('a[role="menuitem"]');
      menuItems.forEach(item => {
        expect(item.className).toMatch(/focus:outline-none/);
        expect(item.className).toMatch(/focus:ring-2/);
      });
    });
  });

  describe('Mobile Touch Target Requirements', () => {
    it('should have minimum 44px height for touch targets', () => {
      const { container } = render(
        <ContactDropdown isOpen={true} onClose={() => {}} position="right" />
      );
      
      const menuItems = container.querySelectorAll('a[role="menuitem"]');
      menuItems.forEach(item => {
        expect(item).toHaveClass('min-h-[44px]');
      });
    });

    it('should have adequate padding for touch targets', () => {
      const { container } = render(
        <ContactDropdown isOpen={true} onClose={() => {}} position="right" />
      );
      
      const menuItems = container.querySelectorAll('a[role="menuitem"]');
      menuItems.forEach(item => {
        expect(item).toHaveClass('p-3');
      });
    });
  });

  describe('Theme Support', () => {
    it('should have theme-aware styling classes', () => {
      const { container } = render(
        <ContactDropdown isOpen={true} onClose={() => {}} position="right" />
      );
      
      const dropdown = container.querySelector('[role="menu"]');
      expect(dropdown.className).toMatch(/bg-white/);
      expect(dropdown.className).toMatch(/dark:bg-black/);
      expect(dropdown.className).toMatch(/border-zinc-200/);
      expect(dropdown.className).toMatch(/dark:border-zinc-800/);
    });

    it('should have theme-aware hover states', () => {
      const { container } = render(
        <ContactDropdown isOpen={true} onClose={() => {}} position="right" />
      );
      
      const menuItems = container.querySelectorAll('a[role="menuitem"]');
      menuItems.forEach(item => {
        expect(item.className).toMatch(/hover:bg-zinc-100/);
        expect(item.className).toMatch(/dark:hover:bg-zinc-900/);
      });
    });
  });
});

describe('Header Component Integration Tests', () => {
  describe('Contact Badge and Dropdown Toggle', () => {
    it('should render Contact Badge with proper attributes', () => {
      const { container } = render(<Header theme="dark" toggleTheme={() => {}} />);
      
      const contactBadge = container.querySelector('[aria-label="Open contact options"]');
      expect(contactBadge).toBeTruthy();
      expect(contactBadge).toHaveAttribute('role', 'button');
      expect(contactBadge).toHaveAttribute('aria-haspopup', 'menu');
      expect(contactBadge).toHaveAttribute('tabIndex', '0');
    });

    it('should toggle dropdown when Contact Badge is clicked', async () => {
      const { container } = render(<Header theme="dark" toggleTheme={() => {}} />);
      
      const contactBadge = container.querySelector('[aria-label="Open contact options"]');
      
      // Initially closed
      expect(contactBadge).toHaveAttribute('aria-expanded', 'false');
      let dropdown = container.querySelector('[role="menu"]');
      expect(dropdown).toBeNull();
      
      // Click to open
      fireEvent.click(contactBadge);
      
      await waitFor(() => {
        expect(contactBadge).toHaveAttribute('aria-expanded', 'true');
        dropdown = container.querySelector('[role="menu"]');
        expect(dropdown).toBeTruthy();
      });
    });

    it('should close dropdown when clicking outside', async () => {
      const { container } = render(
        <div>
          <div data-testid="outside">Outside</div>
          <Header theme="dark" toggleTheme={() => {}} />
        </div>
      );
      
      const contactBadge = container.querySelector('[aria-label="Open contact options"]');
      
      // Open dropdown
      fireEvent.click(contactBadge);
      
      await waitFor(() => {
        const dropdown = container.querySelector('[role="menu"]');
        expect(dropdown).toBeTruthy();
      });
      
      // Click outside
      const outsideElement = screen.getByTestId('outside');
      fireEvent.mouseDown(outsideElement);
      
      await waitFor(() => {
        const dropdown = container.querySelector('[role="menu"]');
        expect(dropdown).toBeNull();
      });
    });

    it('should close dropdown when Escape key is pressed', async () => {
      const { container } = render(<Header theme="dark" toggleTheme={() => {}} />);
      
      const contactBadge = container.querySelector('[aria-label="Open contact options"]');
      
      // Open dropdown
      fireEvent.click(contactBadge);
      
      await waitFor(() => {
        const dropdown = container.querySelector('[role="menu"]');
        expect(dropdown).toBeTruthy();
      });
      
      // Press Escape
      fireEvent.keyDown(document, { key: 'Escape' });
      
      await waitFor(() => {
        const dropdown = container.querySelector('[role="menu"]');
        expect(dropdown).toBeNull();
      });
    });

    it('should maintain Contact Badge styling with green indicator', () => {
      const { container } = render(<Header theme="dark" toggleTheme={() => {}} />);
      
      const greenIndicator = container.querySelector('.bg-\\[\\#69df69\\]');
      expect(greenIndicator).toBeTruthy();
      expect(greenIndicator).toHaveClass('h-1.5');
      expect(greenIndicator).toHaveClass('w-1.5');
      expect(greenIndicator).toHaveClass('rounded-full');
    });

    it('should maintain Contact Badge shiny text animation', () => {
      const { container } = render(<Header theme="dark" toggleTheme={() => {}} />);
      
      const contactText = screen.getByText('Contact');
      expect(contactText).toBeTruthy();
      expect(contactText.className).toMatch(/animate-shiny-text/);
      expect(contactText.className).toMatch(/bg-clip-text/);
    });

    it('should support keyboard interaction on Contact Badge', async () => {
      const { container } = render(<Header theme="dark" toggleTheme={() => {}} />);
      
      const contactBadge = container.querySelector('[aria-label="Open contact options"]');
      
      // Press Enter to open
      fireEvent.keyDown(contactBadge, { key: 'Enter' });
      
      await waitFor(() => {
        const dropdown = container.querySelector('[role="menu"]');
        expect(dropdown).toBeTruthy();
      });
    });

    it('should support Space key on Contact Badge', async () => {
      const { container } = render(<Header theme="dark" toggleTheme={() => {}} />);
      
      const contactBadge = container.querySelector('[aria-label="Open contact options"]');
      
      // Press Space to open
      fireEvent.keyDown(contactBadge, { key: ' ' });
      
      await waitFor(() => {
        const dropdown = container.querySelector('[role="menu"]');
        expect(dropdown).toBeTruthy();
      });
    });
  });

  describe('Requirements Validation', () => {
    it('should meet Requirement 1.1 - Display dropdown on Contact Badge click', async () => {
      const { container } = render(<Header theme="dark" toggleTheme={() => {}} />);
      
      const contactBadge = container.querySelector('[aria-label="Open contact options"]');
      fireEvent.click(contactBadge);
      
      await waitFor(() => {
        const dropdown = container.querySelector('[role="menu"]');
        expect(dropdown).toBeTruthy();
        
        expect(screen.getByText('Email')).toBeTruthy();
        expect(screen.getByText('WhatsApp')).toBeTruthy();
        expect(screen.getByText('Telegram')).toBeTruthy();
      });
    });

    it('should meet Requirement 1.3 - Close dropdown on outside click', async () => {
      const { container } = render(
        <div>
          <div data-testid="outside">Outside</div>
          <Header theme="dark" toggleTheme={() => {}} />
        </div>
      );
      
      const contactBadge = container.querySelector('[aria-label="Open contact options"]');
      fireEvent.click(contactBadge);
      
      await waitFor(() => {
        expect(container.querySelector('[role="menu"]')).toBeTruthy();
      });
      
      fireEvent.mouseDown(screen.getByTestId('outside'));
      
      await waitFor(() => {
        expect(container.querySelector('[role="menu"]')).toBeNull();
      });
    });

    it('should meet Requirement 1.4 - Close dropdown on Escape key', async () => {
      const { container } = render(<Header theme="dark" toggleTheme={() => {}} />);
      
      const contactBadge = container.querySelector('[aria-label="Open contact options"]');
      fireEvent.click(contactBadge);
      
      await waitFor(() => {
        expect(container.querySelector('[role="menu"]')).toBeTruthy();
      });
      
      fireEvent.keyDown(document, { key: 'Escape' });
      
      await waitFor(() => {
        expect(container.querySelector('[role="menu"]')).toBeNull();
      });
    });

    it('should meet Requirement 2.1 - Email opens default client', async () => {
      const { container } = render(<Header theme="dark" toggleTheme={() => {}} />);
      
      const contactBadge = container.querySelector('[aria-label="Open contact options"]');
      fireEvent.click(contactBadge);
      
      await waitFor(() => {
        const emailLink = container.querySelector('a[href="mailto:dagimw14@gmail.com"]');
        expect(emailLink).toBeTruthy();
        expect(emailLink).toHaveAttribute('target', '_self');
      });
    });

    it('should meet Requirement 3.1 - WhatsApp opens in new tab', async () => {
      const { container } = render(<Header theme="dark" toggleTheme={() => {}} />);
      
      const contactBadge = container.querySelector('[aria-label="Open contact options"]');
      fireEvent.click(contactBadge);
      
      await waitFor(() => {
        const whatsappLink = container.querySelector('a[href="https://wa.me/251980207363?text=Hi%2C%20I%27d%20like%20to%20get%20in%20touch"]');
        expect(whatsappLink).toBeTruthy();
        expect(whatsappLink).toHaveAttribute('target', '_blank');
      });
    });

    it('should meet Requirement 4.1 - Telegram opens in new tab', async () => {
      const { container } = render(<Header theme="dark" toggleTheme={() => {}} />);
      
      const contactBadge = container.querySelector('[aria-label="Open contact options"]');
      fireEvent.click(contactBadge);
      
      await waitFor(() => {
        const telegramLink = container.querySelector('a[href="https://t.me/cole_j_p"]');
        expect(telegramLink).toBeTruthy();
        expect(telegramLink).toHaveAttribute('target', '_blank');
      });
    });

    it('should meet Requirement 5.1 - Minimum 44px touch targets', async () => {
      const { container } = render(<Header theme="dark" toggleTheme={() => {}} />);
      
      const contactBadge = container.querySelector('[aria-label="Open contact options"]');
      fireEvent.click(contactBadge);
      
      await waitFor(() => {
        const menuItems = container.querySelectorAll('a[role="menuitem"]');
        menuItems.forEach(item => {
          expect(item).toHaveClass('min-h-[44px]');
        });
      });
    });
  });
});
