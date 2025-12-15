import { useEffect, useRef } from "react";

const FilterDropdown = ({
  options,
  selectedOptions,
  onToggleOption,
  isOpen,
  onClose,
  label,
}) => {
  const dropdownRef = useRef(null);

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

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute z-50 mt-2 w-56 rounded-md border shadow-lg bg-white border-zinc-200 dark:bg-zinc-800 dark:border-zinc-600"
      role="menu"
      aria-label={`${label} filter options`}
    >
      <div className="p-2 border-b border-zinc-200 dark:border-zinc-600">
        <p className="text-xs font-semibold text-zinc-600 dark:text-black px-2 py-1">
          {label}
        </p>
      </div>
      <div className="max-h-64 overflow-y-auto p-2">
        {options.length === 0 ? (
          <div className="px-2 py-3 text-sm text-zinc-500 dark:text-zinc-400">
            No {label.toLowerCase()} available
          </div>
        ) : (
          options.map((option) => (
            <label
              key={option}
              className="flex items-center gap-2 px-2 py-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer transition-colors"
              role="menuitemcheckbox"
              aria-checked={selectedOptions.includes(option)}
            >
              <input
                type="checkbox"
                checked={selectedOptions.includes(option)}
                onChange={() => onToggleOption(option)}
                className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-2 focus:ring-zinc-500 dark:border-zinc-500 dark:bg-zinc-700 dark:checked:bg-zinc-500"
              />
              <span className="text-sm text-zinc-700 dark:text-black">
                {option}
              </span>
            </label>
          ))
        )}
      </div>
    </div>
  );
};

export default FilterDropdown;
