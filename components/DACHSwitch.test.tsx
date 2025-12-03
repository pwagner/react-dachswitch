// @vitest-environment jsdom
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DACHSwitch, CountryOption } from './DACHSwitch';

// Mandatory props for the component logic
const REQUIRED_PROPS = {
  targetSelector: '.item',
  // Fix: Use the correct prop name
  countryCodeAttribute: 'data-country',
};

// Custom DACHLI configuration for the new test case
const DACHLI_COUNTRIES: CountryOption[] = [
    { label: "D", code: "DE", flag: "🇩🇪" },
    { label: "A", code: "AT", flag: "🇦🇹" },
    { label: "CH", code: "CH", flag: "🇨🇭" },
    { label: "LI", code: "LI", flag: "🇱🇮" },
];

describe('DACHSwitch', () => {
  let container: HTMLDivElement;

  // Setup DOM elements for filtering before each test
  beforeEach(() => {
    // Ensure a clean state for persistence tests
    localStorage.clear(); 
    container = document.createElement('div');
    document.body.appendChild(container);
    
    // Create sample items (including LI for the new test)
    container.innerHTML = `
      <div class="item" data-country="DE" id="de-item">Germany Content</div>
      <div class="item" data-country="AT" id="at-item">Austria Content</div>
      <div class="item" data-country="CH" id="ch-item">Swiss Content</div>
      <div class="item" data-country="LI" id="li-item">Liechtenstein Content</div>
    `;
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  // --- Basic Rendering and Default Behavior Tests ---

  it('renders flags correctly with default countries', () => {
    const { getByTitle } = render(<DACHSwitch {...REQUIRED_PROPS} />);
    expect(getByTitle('Filter by D')).toBeDefined();
    expect(getByTitle('Filter by A')).toBeDefined();
    expect(getByTitle('Filter by CH')).toBeDefined();
  });

  it('filters content based on default selection (All Active by default)', () => {
    render(<DACHSwitch {...REQUIRED_PROPS} />);
    
    // All should be visible
    const deItem = document.getElementById('de-item');
    const atItem = document.getElementById('at-item');
    
    expect(deItem?.style.display).toBe('');
    expect(atItem?.style.display).toBe('');
  });
  
  it('filters content based on specific defaultActive (Default Active D)', () => {
    render(<DACHSwitch {...REQUIRED_PROPS} defaultActive="D" defaultAllActive={false} />);

    // D should be visible
    const deItem = document.getElementById('de-item');
    // A and CH should be hidden
    const atItem = document.getElementById('at-item');
    
    expect(deItem?.style.display).toBe('');
    expect(atItem?.style.display).toBe('none');
  });

  // --- Interactivity and Multi-Select Tests ---

  it('allows multi-select by default (toggling on a new flag)', async () => {
    // Start with D selected
    const { getByTitle } = render(<DACHSwitch {...REQUIRED_PROPS} defaultAllActive={false} defaultActive="D" persist={false} />);
    
    const deItem = document.getElementById('de-item');
    const atItem = document.getElementById('at-item');
    
    // Initial state: D selected, A hidden
    expect(deItem?.style.display).toBe('');
    expect(atItem?.style.display).toBe('none');
    
    // Click 'A' to toggle it on
    const aBtn = getByTitle('Filter by A'); // Fix: Use getByTitle
    fireEvent.click(aBtn);
    
    await waitFor(() => {
      // Both D and A should now be visible (Multi-select)
      expect(deItem?.style.display).toBe('');
      expect(atItem?.style.display).toBe('');
    });
  });

  it('toggles all when DACH button is clicked', async () => {
    // Start with All Active
    const { getByTitle } = render(<DACHSwitch {...REQUIRED_PROPS} showAllToggle={true} defaultAllActive={true} persist={false} />);
    
    // Fix: Use the correct title for the DACH toggle
    const dachBtn = getByTitle('Toggle All'); 
    const deItem = document.getElementById('de-item');
    
    // Initial state: All visible
    expect(deItem?.style.display).toBe('');

    // Click to deselect all
    fireEvent.click(dachBtn);
    
    await waitFor(() => {
      // All items should be hidden
      expect(deItem?.style.display).toBe('none');
      expect(document.getElementById('at-item')?.style.display).toBe('none');
    });
    
    // Click to select all again
    fireEvent.click(dachBtn);
    
    await waitFor(() => {
      // All items visible again
      expect(deItem?.style.display).toBe('');
      expect(document.getElementById('at-item')?.style.display).toBe('');
    });
  });
  
  it('enforces singleSelect behavior', async () => {
    const { getByTitle } = render(
      <DACHSwitch 
        {...REQUIRED_PROPS} 
        defaultAllActive={false} 
        defaultActive="D" 
        singleSelect={true} // Test radio button mode
        persist={false}
      />
    );

    const deItem = document.getElementById('de-item');
    const atItem = document.getElementById('at-item');

    // Initial: D is active
    expect(deItem?.style.display).toBe('');
    expect(atItem?.style.display).toBe('none');

    // Click Austria
    const aBtn = getByTitle('Filter by A'); // Fix: Use getByTitle
    fireEvent.click(aBtn);

    await waitFor(() => {
      // DE should be hidden now (Radio button behavior)
      expect(deItem?.style.display).toBe('none');
      // AT should be visible
      expect(atItem?.style.display).toBe('');
    });
  });

  // --- Custom Configuration Tests ---

  it('supports custom attributes and country definitions via countries prop', async () => {
    // Re-setup DOM with custom attr 'lang'
    container.innerHTML = `
      <div lang="DE" id="custom-de">DE Lang</div>
      <div lang="AT" id="custom-at">AT Lang</div>
    `;

    // Define custom countries
    const customCountries = [
        { label: 'Ger', code: 'DE', flag: '🇩🇪' },
        { label: 'Aus', code: 'AT', flag: '🇦🇹' },
    ];
    
    // We select 'Ger' (which maps to DE)
    const { getByTitle } = render(
      <DACHSwitch 
        targetSelector="div"
        countryCodeAttribute="lang" // Fix: Use correct prop name
        defaultAllActive={false} 
        defaultActive="Ger" 
        countries={customCountries}
        persist={false}
      />
    );

    const customDe = document.getElementById('custom-de');
    const customAt = document.getElementById('custom-at');

    // DE should be visible
    expect(customDe?.style.display).toBe('');
    // AT should be hidden
    expect(customAt?.style.display).toBe('none');
    
    // Click 'Aus' to activate it
    const ausBtn = getByTitle('Filter by Aus');
    fireEvent.click(ausBtn);
    
    await waitFor(() => {
        // Both DE and AT should now be visible
        expect(customDe?.style.display).toBe('');
        expect(customAt?.style.display).toBe('');
    });
  });
  
  it('correctly maps UI labels to custom attribute values (default DACH set)', () => {
     // Re-setup DOM with custom attr
     container.innerHTML = `
      <div lang="DE" id="custom-de-2">DE Lang</div>
      <div lang="AT" id="custom-at-2">AT Lang</div>
    `;
    
    // Use the default DACH labels (D, A, CH) but target the 'lang' attribute
    render(<DACHSwitch targetSelector="div" countryCodeAttribute="lang" defaultAllActive={false} defaultActive="D" />);
    
    const customDe = document.getElementById('custom-de-2');
    const customAt = document.getElementById('custom-at-2');
    
    // D (DE) should be visible
    expect(customDe?.style.display).toBe('');
    // A (AT) should be hidden
    expect(customAt?.style.display).toBe('none');
  });

  // --- Persistence Test ---

  it('persists selection to localStorage', async () => {
    const storageKey = 'test-dach-storage';
    
    // 1. Render and change selection (Enable persistence)
    const { getByTitle, unmount } = render(
      <DACHSwitch 
        {...REQUIRED_PROPS} 
        defaultAllActive={false} 
        defaultActive="D" 
        persist={true}
        storageKey={storageKey}
      />
    );

    const aBtn = getByTitle('Filter by A');
    fireEvent.click(aBtn); 
    // Now "D" and "A" should be active (multi-select default)

    // Wait for the change to persist
    await waitFor(() => {
       const storedValue = localStorage.getItem(storageKey);
       // Fix: Component saves a simple array of active labels, e.g., ["D", "A"]
       const stored = JSON.parse(storedValue || '[]');
       expect(stored).toEqual(['D', 'A']);
    });

    unmount();

    // 2. Re-render (simulate reload). 
    // defaultActive="CH" should be IGNORED in favor of storage state (D & A).
    render(
      <DACHSwitch 
        {...REQUIRED_PROPS} 
        defaultAllActive={false} 
        defaultActive="CH" 
        persist={true}
        storageKey={storageKey}
      />
    );

    const deItem = document.getElementById('de-item');
    const atItem = document.getElementById('at-item');
    const chItem = document.getElementById('ch-item');

    // Should match stored state (D & A), not default (CH)
    expect(deItem?.style.display).toBe('');
    expect(atItem?.style.display).toBe('');
    expect(chItem?.style.display).toBe('none');
  });

  // --- NEW TEST FOR DACHLI ---

  it('correctly handles DACHLI configuration and label', async () => {
    // Render with DACHLI countries and defaultAllActive
    const { getByTitle } = render(
      <DACHSwitch
        {...REQUIRED_PROPS}
        countries={DACHLI_COUNTRIES}
        defaultAllActive={true} // All selected
        showAllToggle={true}
        persist={false}
      />
    );
    
    // Check that the "All" toggle label is correctly calculated as DACHLI
    // The component should concatenate the labels (D, A, CH, LI)
    const allToggleBtn = screen.getByText('DACHLI'); 
    expect(allToggleBtn).toBeDefined();

    // Check that LI content is visible since All is active
    const liItem = document.getElementById('li-item');
    expect(liItem?.style.display).toBe('');

    // Click 'LI' to deselect it
    const liBtn = getByTitle('Filter by LI');
    fireEvent.click(liBtn);

    await waitFor(() => {
      // LI content should now be hidden
      expect(liItem?.style.display).toBe('none');
      // The other items should still be visible (D, A, CH)
      expect(document.getElementById('de-item')?.style.display).toBe('');
    });
  });

});