
import React, { useState, useEffect, useMemo } from 'react';

export interface DACHSwitchProps {
  /**
   * The full HTML Attribute name to check on target elements.
   * Examples: "data-country", "lang", "data-market".
   * Default: "data-country"
   */
  countryCodeAttribute?: string;

  /**
   * The CSS Selector identifying the elements to be filtered.
   * If omitted, it defaults to selecting all elements that have the `countryCodeAttribute`.
   * (e.g., default becomes "[data-country]").
   */
  targetSelector?: string;

  /**
   * An object mapping UI labels to country codes.
   * Default: {"D": "DE", "A": "AT", "CH": "CH"}
   */
  codes?: Record<string, string>;

  /**
   * The initial active UI label(s).
   * Can be a single key (e.g., "D") or an array of keys (e.g., ["D", "A"]).
   * Ignored if defaultAllActive is true.
   */
  defaultActive?: string | string[];

  /**
   * Whether to show the master "DACH" toggle button.
   * Default: true
   */
  showAllToggle?: boolean;

  /**
   * Whether all countries should be active by default on mount.
   * Overrides defaultActive if true.
   * Default: true
   */
  defaultAllActive?: boolean;

  /**
   * If true, clicking a flag deselects all others (Radio button behavior).
   * If false, multiple flags can be active simultaneously.
   * Default: false
   */
  singleSelect?: boolean;
}

const FLAGS: Record<string, string> = {
  "D": "🇩🇪",
  "A": "🇦🇹",
  "CH": "🇨🇭"
};

export const DACHSwitch: React.FC<DACHSwitchProps> = ({
  countryCodeAttribute = "data-country",
  targetSelector, // Now optional
  codes = { "D": "DE", "A": "AT", "CH": "CH" },
  defaultActive = "D",
  showAllToggle = true,
  defaultAllActive = true,
  singleSelect = false
}) => {
  // Helper to get all available labels
  const allLabels = useMemo(() => Object.keys(codes), [codes]);

  // Initialize state
  const [activeLabels, setActiveLabels] = useState<string[]>(() => {
    if (defaultAllActive) return [...allLabels];
    if (Array.isArray(defaultActive)) return defaultActive;
    return [defaultActive];
  });

  // Computed property: Are all options currently selected?
  const isAllSelected = allLabels.length > 0 && allLabels.every(label => activeLabels.includes(label));

  const filterContent = () => {
    // If no selector provided, target anything with the specific attribute
    const effectiveSelector = targetSelector || `[${countryCodeAttribute}]`;
    const targets = document.querySelectorAll(effectiveSelector);
    
    // Map active labels to their actual data codes
    const activeCodes = new Set(activeLabels.map(label => codes[label]));

    targets.forEach((node) => {
      const element = node as HTMLElement;
      
      // Elements without the attribute are always visible (if caught by a broad selector)
      // OR if they are layout elements wrapping the content.
      if (!element.hasAttribute(countryCodeAttribute)) {
        // If the selector was specific (e.g. .card) but attribute is missing, 
        // we generally leave it alone unless logic dictates otherwise.
        // Current logic: if it doesn't have the attribute, we don't filter it.
        element.style.display = '';
        return;
      }

      const elementCode = element.getAttribute(countryCodeAttribute);
      
      // Show if the element's code is in our active set
      if (elementCode && activeCodes.has(elementCode)) {
        element.style.display = '';
      } else {
        element.style.display = 'none';
      }
    });
  };

  // Run filter on mount and when selection changes
  useEffect(() => {
    filterContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLabels, targetSelector, countryCodeAttribute, codes]);

  // Handler for clicking the "DACH" (All) toggle
  const handleAllToggle = () => {
    if (isAllSelected) {
      // If all are selected, deselect all
      setActiveLabels([]);
    } else {
      // Select all
      setActiveLabels([...allLabels]);
    }
  };

  // Handler for clicking a specific country flag
  const handleFlagClick = (label: string) => {
    if (singleSelect) {
      // Radio behavior: Select only this one
      setActiveLabels([label]);
    } else {
      // Checkbox behavior
      if (activeLabels.includes(label)) {
        setActiveLabels(prev => prev.filter(l => l !== label));
      } else {
        setActiveLabels(prev => [...prev, label]);
      }
    }
  };

  return (
    <div className="inline-flex items-center justify-center p-1.5 bg-slate-100/90 backdrop-blur-sm rounded-xl shadow-inner border border-slate-200 gap-3">
      
      {/* Master DACH Toggle */}
      {showAllToggle && (
        <>
          <button
            onClick={handleAllToggle}
            className={`
              group relative flex items-center justify-center px-3 py-2 rounded-lg text-sm font-bold transition-all duration-200 ease-in-out focus:outline-none
              ${
                isAllSelected
                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              }
            `}
            type="button"
            title="Toggle All Countries"
            aria-pressed={isAllSelected}
          >
            {/* Toggle Switch Icon */}
            <div className={`mr-2 w-8 h-4 rounded-full relative transition-colors duration-300 ${isAllSelected ? 'bg-emerald-500' : 'bg-slate-300 group-hover:bg-slate-400'}`}>
               <div className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-300 ${isAllSelected ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
            <span className="tracking-tight">DACH</span>
          </button>

          {/* Vertical Divider */}
          <div className="w-px h-8 bg-slate-300/60" />
        </>
      )}

      {/* Country Flags */}
      <div className="flex items-center gap-1">
        {allLabels.map((label) => {
          const isActive = activeLabels.includes(label);
          
          // Visual Logic:
          // If "All" is active (via toggle), show flags as colorful but flat (no border/scale).
          // If specific flags are active (subset), show them colorful AND highlighted (border + bg + scale).
          
          const isGlobalActive = showAllToggle && isAllSelected;
          
          const containerClasses = isActive && !isGlobalActive
            ? 'bg-white shadow-sm ring-1 ring-slate-200 scale-105 z-10'
            : 'hover:bg-slate-200/50'; // Flat state for "All active" or "Inactive"

          // If active (either globally or individually), show full color. Otherwise grayscale.
          const flagClasses = isActive
            ? 'grayscale-0 opacity-100'
            : 'grayscale opacity-40 hover:opacity-60 hover:grayscale-[50%]';

          return (
            <button
              key={label}
              onClick={() => handleFlagClick(label)}
              className={`
                relative flex items-center justify-center p-2 rounded-lg transition-all duration-200 ease-in-out focus:outline-none
                ${containerClasses}
              `}
              aria-pressed={isActive}
              type="button"
              title={`Filter by ${label}`}
              data-testid={`flag-${label}`}
            >
              <span 
                className={`text-2xl leading-none filter transition-all duration-300 ${flagClasses}`}
              >
                {FLAGS[label] || '🏳️'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
