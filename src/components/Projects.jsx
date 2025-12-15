import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import FilterDropdown from "./FilterDropdown";
import FilterBadge from "./FilterBadge";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [selectedTechs, setSelectedTechs] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [showTechDropdown, setShowTechDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const carouselRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const mouseStartX = useRef(0);
  const mouseEndX = useRef(0);
  const techClickTimer = useRef(null);
  const yearClickTimer = useRef(null);

  useEffect(() => {
    fetch("public/projects.json")
      .then((response) => response.json())
      .then((data) => setProjects(data));
  }, []);

  // Extract available technologies from projects
  const availableTechs = useMemo(() => {
    const techs = new Set();
    projects.forEach(project => {
      if (project.tags && Array.isArray(project.tags)) {
        project.tags.forEach(tag => techs.add(tag));
      }
    });
    return Array.from(techs).sort();
  }, [projects]);

  // Extract available years from projects
  const availableYears = useMemo(() => {
    const years = new Set();
    projects.forEach(project => {
      if (project.year) {
        years.add(project.year);
      }
    });
    return Array.from(years).sort((a, b) => b - a); // Sort descending (newest first)
  }, [projects]);

  // Handle tech filter toggle
  const handleToggleTech = (tech) => {
    setSelectedTechs(prev => 
      prev.includes(tech) 
        ? prev.filter(t => t !== tech)
        : [...prev, tech]
    );
  };

  // Handle year filter toggle
  const handleToggleYear = (year) => {
    setSelectedYears(prev => 
      prev.includes(year) 
        ? prev.filter(y => y !== year)
        : [...prev, year]
    );
  };

  // Handle removing a tech filter
  const handleRemoveTech = (tech) => {
    setSelectedTechs(prev => prev.filter(t => t !== tech));
  };

  // Handle removing a year filter
  const handleRemoveYear = (year) => {
    setSelectedYears(prev => prev.filter(y => y !== year));
  };

  // Handle tech button click with double-click detection
  const handleTechButtonClick = () => {
    if (techClickTimer.current) {
      // Double click detected
      clearTimeout(techClickTimer.current);
      techClickTimer.current = null;
      setShowTechDropdown(prev => !prev);
    } else {
      // First click - wait to see if there's a second click
      techClickTimer.current = setTimeout(() => {
        techClickTimer.current = null;
        setShowTechDropdown(prev => !prev);
      }, 250); // 250ms delay to detect double click
    }
  };

  // Handle year button click with double-click detection
  const handleYearButtonClick = () => {
    if (yearClickTimer.current) {
      // Double click detected
      clearTimeout(yearClickTimer.current);
      yearClickTimer.current = null;
      setShowYearDropdown(prev => !prev);
    } else {
      // First click - wait to see if there's a second click
      yearClickTimer.current = setTimeout(() => {
        yearClickTimer.current = null;
        setShowYearDropdown(prev => !prev);
      }, 250); // 250ms delay to detect double click
    }
  };

  // Handle clearing all filters
  const handleClearAllFilters = () => {
    setFilterText("");
    setSelectedTechs([]);
    setSelectedYears([]);
  };

  // Check if any filters are active
  const hasActiveFilters = filterText || selectedTechs.length > 0 || selectedYears.length > 0;

  // Memoize filtered projects to avoid recalculating on every render
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Text search filter (AND logic with other filters)
      if (filterText) {
        const searchText = filterText.toLowerCase();
        const titleMatch = project.title?.toLowerCase().includes(searchText);
        const descriptionMatch = project.description?.toLowerCase().includes(searchText);
        const tagsMatch = project.tags?.some(tag => tag.toLowerCase().includes(searchText));
        
        if (!titleMatch && !descriptionMatch && !tagsMatch) {
          return false;
        }
      }
      
      // Tech filter (OR logic within techs, AND with other filter types)
      if (selectedTechs.length > 0) {
        // Handle missing tags gracefully
        if (!project.tags || project.tags.length === 0) {
          return false;
        }
        const hasTech = project.tags.some(tag => selectedTechs.includes(tag));
        if (!hasTech) {
          return false;
        }
      }
      
      // Year filter (OR logic within years, AND with other filter types)
      if (selectedYears.length > 0) {
        // Handle missing year gracefully
        if (!project.year) {
          return false;
        }
        if (!selectedYears.includes(project.year)) {
          return false;
        }
      }
      
      return true;
    });
  }, [projects, filterText, selectedTechs, selectedYears]);

  // Carousel navigation handlers
  const handlePrevSlide = () => {
    setCurrentSlide(prev => Math.max(0, prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide(prev => Math.min(filteredProjects.length - 1, prev + 1));
  };

  // Touch/swipe handlers
  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    const swipeThreshold = 20;
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swiped left - go to next
        setCurrentSlide(prev => Math.min(filteredProjects.length - 1, prev + 1));
      } else {
        // Swiped right - go to previous
        setCurrentSlide(prev => Math.max(0, prev - 1));
      }
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  }, [filteredProjects.length]);

  // Mouse drag handlers
  const handleMouseDown = useCallback((e) => {
    // Only handle left mouse button
    if (e.button !== 0) return;
    
    setIsDragging(true);
    mouseStartX.current = e.clientX;
    mouseEndX.current = e.clientX;
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (mouseStartX.current === 0) return;
    
    mouseEndX.current = e.clientX;
    const diff = Math.abs(mouseStartX.current - mouseEndX.current);
    
    // If moved more than 5px, prevent link clicks
    if (diff > 5) {
      e.preventDefault();
    }
  }, []);

  const handleMouseUp = useCallback((e) => {
    if (mouseStartX.current === 0) return;
    
    const swipeThreshold = 20;
    const diff = mouseStartX.current - mouseEndX.current;

    if (Math.abs(diff) > swipeThreshold) {
      e.preventDefault();
      if (diff > 0) {
        // Dragged left - go to next
        setCurrentSlide(prev => Math.min(filteredProjects.length - 1, prev + 1));
      } else {
        // Dragged right - go to previous
        setCurrentSlide(prev => Math.max(0, prev - 1));
      }
    }

    setIsDragging(false);
    mouseStartX.current = 0;
    mouseEndX.current = 0;
  }, [filteredProjects.length]);

  const handleMouseLeave = useCallback(() => {
    if (mouseStartX.current !== 0) {
      setIsDragging(false);
      mouseStartX.current = 0;
      mouseEndX.current = 0;
    }
  }, []);

  // Prevent link clicks when dragging
  const handleLinkClick = useCallback((e) => {
    if (isDragging) {
      e.preventDefault();
    }
  }, [isDragging]);

  // Reset carousel when filters change
  useEffect(() => {
    setCurrentSlide(0);
  }, [filterText, selectedTechs, selectedYears]);

  // Update card width when carousel mounts or window resizes
  useEffect(() => {
    const updateCardWidth = () => {
      if (carouselRef.current) {
        const card = carouselRef.current.querySelector('[role="group"]');
        if (card) {
          setCardWidth(card.offsetWidth);
        }
      }
    };

    updateCardWidth();
    window.addEventListener('resize', updateCardWidth);
    return () => window.removeEventListener('resize', updateCardWidth);
  }, [filteredProjects]);

  // Auto-scroll carousel every 5 seconds
  useEffect(() => {
    if (filteredProjects.length <= 1) return;

    const autoScrollInterval = setInterval(() => {
      setCurrentSlide(prev => {
        // If at the end, loop back to start
        if (prev >= filteredProjects.length - 1) {
          return 0;
        }
        return prev + 1;
      });
    }, 5000); // 5 seconds

    return () => clearInterval(autoScrollInterval);
  }, [filteredProjects.length]);

  return (
    <div>
      <h2 className="mb-4 text-xs font-normal uppercase tracking-wider text-gray-400 dark:text-gray-400">
        Recent Projects
      </h2>
      <div className="flex flex-nowrap gap-2 mb-4 sm:mb-6">
        <div className="flex-1 min-w-0">
          <input
            className="flex rounded-md border px-3 py-1 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-8 w-full bg-zinc-100/30 border-zinc-200 dark:bg-zinc-900/30 dark:border-zinc-800 text-sm"
            placeholder="Filter..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
        <div className="flex flex-nowrap items-center gap-2">
          <div className="relative">
            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border shadow-sm hover:text-accent-foreground rounded-md px-3 py-2 text-xs min-h-[44px] border-dashed bg-zinc-100/30 border-zinc-200 dark:bg-zinc-900/30 dark:border-zinc-800 hover:bg-transparent"
              type="button"
              onClick={handleTechButtonClick}
              aria-haspopup="menu"
              aria-expanded={showTechDropdown}
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
                className="lucide lucide-circle-plus mr-2 h-4 w-4"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 12h8"></path>
                <path d="M12 8v8"></path>
              </svg>
              Tech
            </button>
            <FilterDropdown
              options={availableTechs}
              selectedOptions={selectedTechs}
              onToggleOption={handleToggleTech}
              isOpen={showTechDropdown}
              onClose={() => setShowTechDropdown(false)}
              label="Tech"
            />
          </div>
          <div className="relative">
            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border shadow-sm hover:text-accent-foreground rounded-md px-3 py-2 text-xs min-h-[44px] border-dashed bg-zinc-100/30 border-zinc-200 dark:bg-zinc-900/30 dark:border-zinc-800 hover:bg-transparent"
              type="button"
              onClick={handleYearButtonClick}
              aria-haspopup="menu"
              aria-expanded={showYearDropdown}
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
                className="lucide lucide-circle-plus mr-2 h-4 w-4"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 12h8"></path>
                <path d="M12 8v8"></path>
              </svg>
              Year
            </button>
            <FilterDropdown
              options={availableYears}
              selectedOptions={selectedYears}
              onToggleOption={handleToggleYear}
              isOpen={showYearDropdown}
              onClose={() => setShowYearDropdown(false)}
              label="Year"
            />
          </div>
          {hasActiveFilters && (
            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border shadow-sm hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-xs min-h-[44px] bg-zinc-100/30 border-zinc-200 dark:bg-zinc-900/30 dark:border-zinc-800"
              type="button"
              onClick={handleClearAllFilters}
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
                className="lucide lucide-x mr-2 h-4 w-4"
              >
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
              Clear All
            </button>
          )}
        </div>
      </div>
      {/* Active filter badges */}
      {(selectedTechs.length > 0 || selectedYears.length > 0) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedTechs.map((tech) => (
            <FilterBadge
              key={tech}
              label={tech}
              onRemove={() => handleRemoveTech(tech)}
              type="tech"
            />
          ))}
          {selectedYears.map((year) => (
            <FilterBadge
              key={year}
              label={year}
              onRemove={() => handleRemoveYear(year)}
              type="year"
            />
          ))}
        </div>
      )}
      {/* Project count display */}
      <div className="mb-4 text-xs text-gray-500 dark:text-gray-400">
        {hasActiveFilters 
          ? `Showing ${filteredProjects.length} of ${projects.length} projects`
          : `${projects.length} projects`
        }
      </div>
      {/* Empty state */}
      {filteredProjects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="mb-4">
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
              className="lucide lucide-search-x h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto"
            >
              <path d="m13.5 8.5-5 5"></path>
              <path d="m8.5 8.5 5 5"></path>
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No projects found
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            No projects match your current filters. Try adjusting your search criteria.
          </p>
          {hasActiveFilters && (
            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border shadow-sm hover:bg-accent hover:text-accent-foreground rounded-md px-4 py-2 text-sm bg-zinc-100/30 border-zinc-200 dark:bg-zinc-900/30 dark:border-zinc-800"
              type="button"
              onClick={handleClearAllFilters}
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}
      {/* Project carousel */}
      {filteredProjects.length > 0 && (
        <div
          className="relative w-full"
          role="region"
          aria-roledescription="carousel"
        >
          <div 
            className="overflow-hidden cursor-grab active:cursor-grabbing select-none" 
            ref={carouselRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            <div 
              className="flex -ml-1 transition-transform duration-500 ease-out"
              style={{ 
                transform: `translateX(-${currentSlide * cardWidth}px)` 
              }}
            >
              {filteredProjects.map((project, index) => (
              <div
                key={index}
                role="group"
                aria-roledescription="slide"
                className="min-w-0 shrink-0 grow-0 pl-1 basis-full md:basis-1/3"
              >
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block h-full pointer-events-auto"
                  tabIndex="0"
                  onClick={handleLinkClick}
                  draggable="false"
                >
                  <div className="border text-card-foreground shadow overflow-hidden border-zinc-200 rounded-md bg-zinc-100/30 transition-colors backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/30 h-full flex flex-col">
                    <div className="p-0 flex flex-col flex-1">
                      <div className="relative aspect-[16/9] rounded-t-md overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                        {project.image ? (
                          <img
                            alt={project.title}
                            loading="lazy"
                            decoding="async"
                            draggable="false"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            style={{
                              position: "absolute",
                              height: "100%",
                              width: "100%",
                              left: 0,
                              top: 0,
                              right: 0,
                              bottom: 0,
                              color: "transparent",
                            }}
                            src={project.image}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-zinc-400 dark:text-zinc-600">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="48"
                              height="48"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                              <circle cx="9" cy="9" r="2"></circle>
                              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="p-3 flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="text-md from-black from-30% to-black/50 dark:from-white dark:from-30% dark:to-white/50 bg-clip-text mb-1 line-clamp-2">
                            {project.title}
                          </h3>
                          <div className="mb-2">
                            <p className="text-xs text-zinc-400 line-clamp-2">
                              {project.description}
                            </p>
                            {project.description && project.description.length > 80 && (
                              <span className="text-xs text-zinc-500 dark:text-zinc-500 italic">See more...</span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {project.tags.map((tag, index) => (
                              <div
                                key={index}
                                className="inline-flex items-center rounded-md border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground text-[10px] px-1 py-0"
                              >
                                {tag}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
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
                            className="lucide lucide-arrow-up-right size-4 from-black from-30% to-black/50 dark:from-white dark:from-30% dark:to-white/50 bg-clip-text"
                          >
                            <path d="M7 7h10v10"></path>
                            <path d="M7 17 17 7"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
              ))}
            </div>
          </div>
          <button
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border shadow-sm hover:bg-accent hover:text-accent-foreground absolute h-8 w-8 rounded-full top-1/2 -translate-y-1/2 bg-white/90 border-zinc-200 dark:bg-zinc-800/90 dark:border-zinc-700 z-10"
            style={{ left: '-1rem' }}
            disabled={currentSlide === 0}
            onClick={handlePrevSlide}
            aria-label="Previous slide"
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
              className="lucide lucide-chevron-left h-5 w-5"
            >
              <path d="m15 18-6-6 6-6"></path>
            </svg>
            <span className="sr-only">Previous slide</span>
          </button>
          <button
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border shadow-sm hover:bg-accent hover:text-accent-foreground absolute h-8 w-8 rounded-full top-1/2 -translate-y-1/2 bg-white/90 border-zinc-200 dark:bg-zinc-800/90 dark:border-zinc-700 z-10"
            style={{ right: '-1rem' }}
            disabled={currentSlide >= filteredProjects.length - 1}
            onClick={handleNextSlide}
            aria-label="Next slide"
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
              className="lucide lucide-chevron-right h-5 w-5"
            >
              <path d="m9 18 6-6-6-6"></path>
            </svg>
            <span className="sr-only">Next slide</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Projects;