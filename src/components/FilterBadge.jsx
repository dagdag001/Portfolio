const FilterBadge = ({ label, onRemove, type }) => {
  return (
    <div className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium transition-colors bg-zinc-100/30 border-zinc-200 dark:bg-zinc-900/30 dark:border-zinc-800">
      <span>{label}</span>
      <button
        onClick={onRemove}
        className="ml-1 rounded-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors p-0.5"
        aria-label={`Remove ${type} filter: ${label}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 6 6 18"></path>
          <path d="m6 6 12 12"></path>
        </svg>
      </button>
    </div>
  );
};

export default FilterBadge;
