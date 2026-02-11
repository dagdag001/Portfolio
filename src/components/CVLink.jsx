import { useState, useRef, useCallback, useEffect } from "react";

const CVLink = ({
  className = "",
  variant = "primary",
  size = "md",
  cvUrl,
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const buttonRef = useRef(null);
  const timeoutRef = useRef(null);

  const handleClick = useCallback(
    (e) => {
      e.preventDefault();

      if (isProcessing) return;

      if (!cvUrl || typeof cvUrl !== "string") {
        console.error("Invalid CV URL");
        return;
      }

      setIsProcessing(true);
      setIsClicked(true);

      try {
        const newWindow = window.open(cvUrl, "_blank");

        if (newWindow) {
          newWindow.opener = null;
        } else {
          window.location.href = cvUrl;
        }
      } catch (err) {
        console.error("Failed to open CV:", err);
        window.location.href = cvUrl;
      } finally {
        timeoutRef.current = setTimeout(() => {
          setIsClicked(false);
          setIsProcessing(false);

          // Remove focus after click
          if (buttonRef.current) {
            buttonRef.current.blur();
          }
        }, 200);
      }
    },
    [cvUrl, isProcessing],
  );

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  /* Size Variants */
  const sizeClasses = {
    sm: "px-3 py-2 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  /* Style Variants */
  const variantClasses = {
    primary: `
      bg-blue-600 hover:bg-blue-700
      text-white border-2 border-blue-600 hover:border-blue-700
      focus-visible:ring-4 focus-visible:ring-blue-300 focus-visible:ring-offset-2
      dark:bg-blue-600 dark:hover:bg-blue-700
      dark:border-blue-600 dark:hover:border-blue-700
      shadow-lg hover:shadow-xl
      ${isHovered ? "scale-105" : ""}
      ${isProcessing ? "opacity-80 cursor-wait" : ""}
    `,
    secondary: `
      bg-white dark:bg-gray-800
      border-2 border-gray-400 dark:border-gray-500
      text-gray-800 dark:text-gray-200
      hover:bg-gray-50 dark:hover:bg-gray-700
      shadow-md hover:shadow-lg
      focus-visible:ring-4 focus-visible:ring-gray-300
      ${isHovered ? "shadow-lg" : ""}
      ${isProcessing ? "opacity-80 cursor-wait" : ""}
    `,
  };

  const baseClasses = `
    inline-flex items-center justify-center gap-2
    font-medium rounded-lg transition-all duration-200
    cursor-pointer select-none
    focus:outline-none
    transform active:scale-95
    relative
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const clickedClasses = isClicked ? "scale-95 opacity-80" : "";

  return (
    <button
      ref={buttonRef}
      type="button"
      disabled={isProcessing}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label="View CV document in new tab"
      aria-busy={isProcessing}
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${clickedClasses}
        ${className}
      `}
    >
      {/* Loading / File Icon */}
      {isProcessing ? (
        <svg
          className="animate-spin flex-shrink-0 text-white"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="flex-shrink-0"
          aria-hidden="true"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14,2 14,8 20,8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      )}

      {/* Text */}
      <span className="font-semibold">
        {isProcessing ? "Opening..." : "View CV"}
      </span>
    </button>
  );
};

export default CVLink;
