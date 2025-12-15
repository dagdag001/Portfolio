import { useState } from 'react';
import SocialLinksDropdown from './SocialLinksDropdown';

const Footer = () => {
  const [isSocialOpen, setIsSocialOpen] = useState(false);

  const toggleSocialDropdown = () => {
    setIsSocialOpen(!isSocialOpen);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleSocialDropdown();
    }
  };

  return (
    <footer className="flex items-center justify-between border-t border-zinc-200 pt-6 dark:border-zinc-800">
      <div className="flex items-center gap-4">
        <div className="relative flex items-center gap-3">
          <button
            className="text-gray-400 flex items-center text-sm gap-2 hover:text-zinc-400 dark:text-gray-400 dark:hover:text-zinc-400"
            tabIndex="0"
            role="button"
            aria-label="Toggle social media links"
            aria-expanded={isSocialOpen}
            onClick={toggleSocialDropdown}
            onKeyDown={handleKeyDown}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-link2 h-4 w-4"
            >
              <path d="M9 17H7A5 5 0 0 1 7 7h2"></path>
              <path d="M15 7h2a5 5 0 1 1 0 10h-2"></path>
              <line x1="8" x2="16" y1="12" y2="12"></line>
            </svg>
            my socials
          </button>
          <SocialLinksDropdown
            isOpen={isSocialOpen}
            onClose={() => setIsSocialOpen(false)}
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
