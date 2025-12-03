import React, { useState, useEffect, useMemo, useCallback } from 'react';

// --- Types ---

export interface CountryOption {
  /**
   * The text displayed on the button (e.g., "D", "A", "LI").
   * Acts as the unique identifier for the UI state.
   */
  label: string;

  /**
   * The primary country code to match against the HTML attribute (e.g., "DE", "AT").
   */
  code: string;

  /**
   * Optional emoji flag. Defaults to a globe if not provided.
   */
  flag?: string;

  /**
   * Optional array of alternative codes that should also match this country.
   *
   * The primary `code` value is always matched. This array allows you to include
   * additional variations (e.g., shorthand, legacy, or ISO alpha-3 codes) that
   * should be treated as equivalent.
   *
   * The main `label` and `code` values are NOT automatically included here.
   * e.g., if code is "DE", you might add ["D", "DEU"].
   */
  acceptedCodes?: string[];
}

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
   */
  targetSelector?: string;

  /**
   * An array of country configuration objects.
   * If provided, this overrides the default DACH configuration.
   * * Default (internal):
   * [
   * { label: "D", code: "DE", flag: "🇩🇪" },
   * { label: "A", code: "AT", flag: "🇦🇹" },
   * { label: "CH", code: "CH", flag: "🇨🇭" }
   * ]
   */
  countries?: CountryOption[];

  /**
   * The initial active UI label(s) OR value(s).
   * Can be a single key (e.g., "D" or "DE") or an array (e.g., ["D", "AT"]).
   * Ignored if defaultAllActive is true.
   */
  defaultActive?: string | string[];

  /**
   * Whether to show the master "All" toggle button.
   * Default: true
   */
  showAllToggle?: boolean;

  /**
   * Label for the "All" toggle.
   * Default: Concatenated country labels (e.g., "DACH") or custom provided label.
   */
  allToggleLabel?: string;

  /**
   * Whether all countries should be active by default on mount.
   * Overrides defaultActive if true.
   * Default: true
   */
  defaultAllActive?: boolean;

  /**
   * If true, clicking a flag deselects all others (Radio button behavior).
   * Default: false
   */
  singleSelect?: boolean;

  /**
   * If true, the selection state will be saved to localStorage and restored on reload.
   * Default: true
   */
  persist?: boolean;

  /**
   * The key used for localStorage when persist is true.
   * Default: "dach-switch-selection"
   */
  storageKey?: string;
}

// --- Defaults ---

const DEFAULT_COUNTRIES: CountryOption[] = [
  { label: "D", code: "DE", flag: "🇩🇪" },
  { label: "A", code: "AT", flag: "🇦🇹" },
  { label: "CH", code: "CH", flag: "🇨🇭" }
];

export const DACHSwitch: React.FC<DACHSwitchProps> = ({
  countryCodeAttribute = "data-country",
  targetSelector,
  countries = DEFAULT_COUNTRIES,
  defaultActive = "D",
  showAllToggle = true,
  allToggleLabel,
  defaultAllActive = true,
  singleSelect = false,
  persist = true,
  storageKey = "dach-switch-selection"
}) => {
  
  // Memoize the labels for easy access
  const allLabels = useMemo(() => countries.map(c => c.label), [countries]);

  // Determine the label for the "All" toggle
  const effectiveAllLabel = useMemo(() => {
    if (allToggleLabel) return allToggleLabel;
    
    // Concatenate all country labels to form the "All" toggle text (e.g., "DACH", "UKUS").
    return countries
      .map(country => country.label)
      .join('')
      .toUpperCase();

  }, [allToggleLabel, countries]);

  // --- State Initialization ---
  
  const [activeLabels, setActiveLabels] = useState<string[]>(() => {
    // 1. Try Persistence
    if (persist && typeof window !== 'undefined') {
      try {
        const saved = window.localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            // Validate keys exist in current config
            const validKeys = parsed.filter(k => allLabels.includes(k));
            if (validKeys.length > 0) return validKeys;
          }
        }
      } catch (e) {
        console.warn("DACHSwitch: LocalStorage parse error", e);
      }
    }

    // 2. Fallback: Default All
    if (defaultAllActive) return [...allLabels];

    // 3. Fallback: specific defaultActive
    const inputs = Array.isArray(defaultActive) ? defaultActive : [defaultActive];
    const normalized: string[] = [];
    
    inputs.forEach(input => {
      // Check if input is a label
      if (allLabels.includes(input)) {
        normalized.push(input);
        return;
      }
      // Check if input matches a country code
      const found = countries.find(c => c.code === input);
      if (found) normalized.push(found.label);
    });

    return normalized.length > 0 ? normalized : [...allLabels];
  });

  // --- Logic ---

  const isAllSelected = useMemo(() => {
    return allLabels.length > 0 && allLabels.every(l => activeLabels.includes(l));
  }, [allLabels, activeLabels]);

  // Persist State
  useEffect(() => {
    if (persist && typeof window !== 'undefined') {
      window.localStorage.setItem(storageKey, JSON.stringify(activeLabels));
    }
  }, [activeLabels, persist, storageKey]);

  // --- Filtering Engine ---

  const filterContent = useCallback(() => {
    const effectiveSelector = targetSelector || `[${countryCodeAttribute}]`;
    const targets = document.querySelectorAll(effectiveSelector);

    // Create a Set of ALL accepted codes based on active labels
    const activeCodes = new Set<string>();
    
    activeLabels.forEach(label => {
      const config = countries.find(c => c.label === label);
      if (config) {
        activeCodes.add(config.code.toUpperCase()); // Primary code (e.g. "DE")
        if (config.acceptedCodes) {
          // Aliases (e.g. "D") - ensure they are also checked as uppercase
          config.acceptedCodes.forEach(ac => activeCodes.add(ac.toUpperCase())); 
        }
      }
    });

    targets.forEach((node) => {
      const element = node as HTMLElement;

      // Safe check: if element doesn't have the attribute, leave it alone
      if (!element.hasAttribute(countryCodeAttribute)) {
        element.style.display = '';
        return;
      }

      const rawValue = element.getAttribute(countryCodeAttribute);
      // Ensure the element's attribute value is also converted to uppercase for consistent checking
      const elementCode = rawValue ? rawValue.toUpperCase() : "";

      if (activeCodes.has(elementCode)) {
        element.style.display = '';
      } else {
        element.style.display = 'none';
      }
    });
  }, [activeLabels, countries, countryCodeAttribute, targetSelector]);

  // Apply filter on change
  useEffect(() => {
    filterContent();
  }, [filterContent]);


  // --- Handlers ---

  const handleAllToggle = () => {
    if (isAllSelected) {
      setActiveLabels([]);
    } else {
      setActiveLabels([...allLabels]);
    }
  };

  const handleFlagClick = (label: string) => {
    if (singleSelect) {
      setActiveLabels([label]);
    } else {
      if (activeLabels.includes(label)) {
        setActiveLabels(prev => prev.filter(l => l !== label));
      } else {
        setActiveLabels(prev => [...prev, label]);
      }
    }
  };

  return (
    <div className="inline-flex items-center justify-center p-1.5 bg-slate-100/90 backdrop-blur-sm rounded-xl shadow-inner border border-slate-200 gap-3">
      
      {/* Master Toggle */}
      {showAllToggle && (
        <>
          <button
            onClick={handleAllToggle}
            className={`
              group relative flex items-center justify-center px-3 py-2 rounded-lg text-sm font-bold transition-all duration-200 ease-in-out focus:outline-none
              ${isAllSelected
                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              }
            `}
            type="button"
            title="Toggle All"
            aria-pressed={isAllSelected}
          >
            <div className={`mr-2 w-8 h-4 rounded-full relative transition-colors duration-300 ${isAllSelected ? 'bg-emerald-500' : 'bg-slate-300 group-hover:bg-slate-400'}`}>
               <div className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-300 ${isAllSelected ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
            <span className="tracking-tight">{effectiveAllLabel}</span>
          </button>
          <div className="w-px h-8 bg-slate-300/60" />
        </>
      )}

      {/* Dynamic Flags */}
      <div className="flex items-center gap-1">
        {countries.map((country) => {
          const isActive = activeLabels.includes(country.label);
          const isGlobalActive = showAllToggle && isAllSelected;
          
          const containerClasses = isActive && !isGlobalActive
            ? 'bg-white shadow-sm ring-1 ring-slate-200 scale-105 z-10'
            : 'hover:bg-slate-200/50'; 

          const flagClasses = isActive
            ? 'grayscale-0 opacity-100'
            : 'grayscale opacity-40 hover:opacity-60 hover:grayscale-[50%]';

          return (
            <button
              key={country.label}
              onClick={() => handleFlagClick(country.label)}
              className={`
                relative flex items-center justify-center p-2 rounded-lg transition-all duration-200 ease-in-out focus:outline-none
                ${containerClasses}
              `}
              aria-pressed={isActive}
              type="button"
              title={`Filter by ${country.label}`}
            >
              <span className={`text-2xl leading-none filter transition-all duration-300 ${flagClasses}`}>
                {country.flag || '🌐'}
              </span>
              {/* Optional: Show label if no flag provided or if design requires it. 
                  For now we rely on flag emoji as primary visual. */}
            </button>
          );
        })}
      </div>
    </div>
  );
};