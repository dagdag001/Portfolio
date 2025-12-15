import { useEffect, useRef } from "react";

const ContactDropdown = ({ isOpen, onClose, position = 'right' }) => {
  const dropdownRef = useRef(null);

  // Contact methods data
  const contactMethods = [
    {
      id: 'email',
      label: 'Email',
      value: 'dagimw14@gmail.com',
      href: 'mailto:dagimw14@gmail.com',
      icon: 'email',
      target: '_self'
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      value: '+251 98 020 7363',
      href: 'https://wa.me/251980207363?text=Hi%2C%20I%27d%20like%20to%20get%20in%20touch',
      icon: 'whatsapp',
      target: '_blank'
    },
    {
      id: 'telegram',
      label: 'Telegram',
      value: '@cole_j_p',
      href: 'https://t.me/cole_j_p',
      icon: 'telegram',
      target: '_blank'
    }
  ];

  // Icons as inline SVG components
  const EmailIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );

  const WhatsAppIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors"
    >
      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
      <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
    </svg>
  );

  const TelegramIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'email':
        return <EmailIcon />;
      case 'whatsapp':
        return <WhatsAppIcon />;
      case 'telegram':
        return <TelegramIcon />;
      default:
        return null;
    }
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle Escape key to close dropdown
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  // Focus management - focus first item when dropdown opens
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const firstLink = dropdownRef.current.querySelector('a[role="menuitem"]');
      if (firstLink) {
        firstLink.focus();
      }
    }
  }, [isOpen]);

  // Conditional rendering based on isOpen prop
  if (!isOpen) return null;

  // Handle keyboard navigation within menu
  const handleKeyDown = (event, index) => {
    const menuItems = dropdownRef.current?.querySelectorAll('a[role="menuitem"]');
    if (!menuItems) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        const nextIndex = (index + 1) % menuItems.length;
        menuItems[nextIndex]?.focus();
        break;
      case 'ArrowUp':
        event.preventDefault();
        const prevIndex = (index - 1 + menuItems.length) % menuItems.length;
        menuItems[prevIndex]?.focus();
        break;
      case 'Home':
        event.preventDefault();
        menuItems[0]?.focus();
        break;
      case 'End':
        event.preventDefault();
        menuItems[menuItems.length - 1]?.focus();
        break;
      default:
        break;
    }
  };

  return (
    <div
      ref={dropdownRef}
      className={`absolute z-50 mt-2 w-70 rounded-lg border shadow-xl bg-white border-zinc-200 dark:bg-black dark:border-zinc-800 dark:shadow-2xl ${
        position === 'left' ? 'left-0' : 'right-0'
      }`}
      role="menu"
      aria-label="Contact options"
    >
      <div className="p-2">
        {contactMethods.map((method, index) => (
          <a
            key={method.id}
            href={method.href}
            target={method.target}
            rel={method.target === '_blank' ? 'noopener noreferrer' : undefined}
            className="flex items-start gap-3 p-3 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer transition-all duration-200 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 group"
            role="menuitem"
            tabIndex={0}
            onKeyDown={(e) => handleKeyDown(e, index)}
            aria-label={`${method.label}: ${method.value}`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {getIcon(method.icon)}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors">
                {method.label}
              </span>
              <span className="text-xs text-zinc-600 dark:text-zinc-500 break-all group-hover:text-zinc-700 dark:group-hover:text-zinc-400 transition-colors">
                {method.value}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ContactDropdown;
