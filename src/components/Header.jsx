import { useState, useRef } from 'react';
import ContactDropdown from './ContactDropdown';

const Header = ({ theme, toggleTheme }) => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const contactBadgeRef = useRef(null);

  const toggleContactDropdown = () => {
    setIsContactOpen(!isContactOpen);
  };

  const openImageModal = () => {
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  return (
    <div>
      <div>
        {/* logo */}
        <div className="py-2">
          <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
            <a
              href="/"
              className="flex items-center gap-2 sm:gap-3 cursor-pointer"
              // style={{ opacity: 0, transform: "translateX(-20px)" }}
            >
              <img
                alt="Logo"
                loading="lazy"
                width="40"
                height="40"
                decoding="async"
                data-nimg="1"
                className="w-8 h-8 sm:w-10 sm:h-10"
                style={{ color: "transparent" }}
                src="/favicon.svg"
              />
              <div className="overflow-hidden py-2 flex cursor-default scale-100 gap-1">
                {["D", "A", "G", "I", "M"].map((letter, i) => (
                  <span
                    key={i}
                    className="font-mono font-bold cursor-pointer text-2xl sm:text-4xl"
                    style={{
                      lineHeight: "1",
                    }}
                  >
                    {letter}
                  </span>
                ))}
              </div>
            </a>
            <div
              className="cursor-pointer relative"
              ref={contactBadgeRef}
              // style={{ opacity: 0, transform: "translateY(-20px)" }}
            >
              <div 
                className="flex items-center" 
                tabIndex="0"
                onClick={toggleContactDropdown}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleContactDropdown();
                  }
                }}
                role="button"
                aria-label="Open contact options"
                aria-expanded={isContactOpen}
                aria-haspopup="menu"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#69df69]"></span>
                <p
                  style={{
                    "--shiny-width": "100px",
                  }}
                  className="mx-auto max-w-md text-neutral-600/70 dark:text-neutral-400/70 animate-shiny-text bg-clip-text bg-no-repeat [background-position:0_0] [background-size:var(--shiny-width)_100%] [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite] bg-gradient-to-r from-transparent via-black/80 via-50% to-transparent dark:via-white/80 inline-flex items-center justify-center px-4 py-1 text-xs transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400"
                >
                  Contact Me
                </p>
              </div>
              <ContactDropdown 
                isOpen={isContactOpen}
                onClose={() => setIsContactOpen(false)}
                position="right"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 sm:mb-12 flex justify-between items-center">
        {
          <div className="relative flex items-center gap-2">
            <div
              className="text-xs font-medium"
              data-state="closed"
              // style={{ opacity: 0, transform: "translateY(-20px)" }}
            ></div>
          </div>
        }

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-400 hover:text-zinc-400 dark:text-gray-400 dark:hover:text-zinc-400 transition-colors duration-300 ease-in-out focus:outline-none"
            aria-label="Toggle dark mode"
            style={{ 
              border: 'none', 
              background: 'transparent',
              outline: 'none',
              boxShadow: 'none'
            }}
          >
            {theme === 'light' ? (
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
                className="lucide lucide-moon h-5 w-5"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
              </svg>
            ) : (
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
                className="lucide lucide-sun h-5 w-5"
              >
                <circle cx="12" cy="12" r="4"></circle>
                <path d="M12 2v2"></path>
                <path d="M12 20v2"></path>
                <path d="m4.93 4.93 1.41 1.41"></path>
                <path d="m17.66 17.66 1.41 1.41"></path>
                <path d="M2 12h2"></path>
                <path d="M20 12h2"></path>
                <path d="m6.34 17.66-1.41 1.41"></path>
                <path d="m19.07 4.93-1.41 1.41"></path>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* discription */}

      <div className="mb-8 sm:mb-12 flex items-center gap-4 sm:gap-6">
        <div className="relative">
          <div className="absolute inset-[-4px] rounded-full">
            <svg
              className="w-[72px] h-[72px] sm:w-[104px] sm:h-[104px]"
              viewBox="0 0 104 104"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="52"
                cy="52"
                r="50"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="314.1592653589793"
                strokeDashoffset="314.1592653589793"
              ></circle>
            </svg>
          </div>
          <div className="absolute inset-0 bg-blue-500 rounded-full"></div>
          <div className="relative w-16 h-16 sm:w-24 sm:h-24 rounded-full overflow-hidden cursor-pointer">
            <div>
              <img
                alt="Profile Picture"
                loading="lazy"
                width="64"
                height="64"
                decoding="async"
                data-nimg="1"
                className="object-cover w-full h-full"
                style={{ color: "transparent" }}
                src="/profile.jpg"
              />
            </div>
          </div>
        </div>

        <div>
          <h1 className="text-md md:text-2xl font-bold bg-gradient-to-br from-black from-30% to-black/50 dark:from-white dark:from-30% dark:to-white/50 bg-clip-text">
            Hi, I am Dagim Wubeante,
          </h1>
          <p className="font-normal text-gray-400 dark:text-zinc-300 text-sm md:text-sm">
            a web developer with strong skills in both frontend and backend, building functional, well structured applications with 
            clean UI and smooth user experiences, and a strong attention to detail.
          </p>
          <span className="relative mt-2 text-xs md:text-sm font-normal inline-flex items-center text-gray-400 dark:text-zinc-200">
            Adiss Ababa, Ethiopia
          </span>
        </div>
      </div>
    </div>
  );
};

export default Header;
