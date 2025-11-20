// @vitest-environment jsdom
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DACHSwitch } from './DACHSwitch';

describe('DACHSwitch', () => {
  let container: HTMLDivElement;

  // Setup DOM elements for filtering before each test
  beforeEach(() => {
    // Clear storage to ensure clean state for persistence tests
    localStorage.clear();

    container = document.createElement('div');
    document.body.appendChild(container);
    
    // Create sample items
    container.innerHTML = `
      <div class="item" data-country="DE" id="de-item">Germany Content</div>
      <div class="item" data-country="AT" id="at-item">Austria Content</div>
      <div class="item" data-country="CH" id="ch-item">Swiss Content</div>
    `;
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('renders flags correctly', () => {
    const { getByTitle } = render(<DACHSwitch />);
    expect(getByTitle('Filter by D')).toBeDefined();
    expect(getByTitle('Filter by A')).toBeDefined();
    expect(getByTitle('Filter by CH')).toBeDefined();
  });

  it('filters content based on default selection (All Active)', () => {
    render(<DACHSwitch />);
    
    // All should be visible
    const deItem = document.getElementById('de-item');
    const atItem = document.getElementById('at-item');
    
    expect(deItem?.style.display).toBe('');
    expect(atItem?.style.display).toBe('');
  });

  it('hides content when flag is deselected', async () => {
    const { getByTestId } = render(<DACHSwitch defaultAllActive={false} defaultActive={["D"]} persist={false} />);
    
    const deItem = document.getElementById('de-item');
    const atItem = document.getElementById('at-item');
    
    // Initial state: D selected
    expect(deItem?.style.display).toBe('');
    expect(atItem?.style.display).toBe('none');
    
    // Click 'A' to toggle it on
    const aBtn = getByTestId('flag-A');
    fireEvent.click(aBtn);
    
    await waitFor(() => {
      expect(atItem?.style.display).toBe('');
    });
  });

  it('supports custom attributes', () => {
    // Re-setup DOM with custom attr
    container.innerHTML = `
      <div lang="DE" id="custom-de">DE Lang</div>
      <div lang="AT" id="custom-at">AT Lang</div>
    `;

    // We use defaultAllActive=false and select 'D' (which maps to DE)
    render(
      <DACHSwitch 
        countryCodeAttribute="lang" 
        defaultAllActive={false} 
        defaultActive={["D"]} 
        persist={false}
        codes={{'D': 'DE', 'A': 'AT'}} 
      />
    );

    const customDe = document.getElementById('custom-de');
    const customAt = document.getElementById('custom-at');

    // DE should be visible
    expect(customDe?.style.display).toBe('');
    // AT should be hidden
    expect(customAt?.style.display).toBe('none');
  });
  
  it('correctly maps UI labels to custom attribute values', () => {
     container.innerHTML = `
      <div lang="DE" id="custom-de">DE Lang</div>
      <div lang="AT" id="custom-at">AT Lang</div>
    `;
    
    render(<DACHSwitch countryCodeAttribute="lang" defaultAllActive={false} defaultActive="D" persist={false} />);
    
    const customDe = document.getElementById('custom-de');
    const customAt = document.getElementById('custom-at');
    
    expect(customDe?.style.display).toBe('');
    expect(customAt?.style.display).toBe('none');
  });

  it('toggles all when DACH button is clicked', async () => {
     const { getByTitle } = render(<DACHSwitch showAllToggle={true} defaultAllActive={true} persist={false} />);
     
     const dachBtn = getByTitle('Toggle All Countries');
     
     // Click to deselect all
     fireEvent.click(dachBtn);
     
     const deItem = document.getElementById('de-item');
     
     await waitFor(() => {
       expect(deItem?.style.display).toBe('none');
     });
     
     // Click to select all
     fireEvent.click(dachBtn);
     
     await waitFor(() => {
       expect(deItem?.style.display).toBe('');
     });
  });

  // --- NEW TESTS ---

  it('normalizes defaultActive values (codes instead of labels)', () => {
    // Pass "DE" (Value) instead of "D" (Key)
    render(
      <DACHSwitch 
        defaultAllActive={false} 
        defaultActive={["DE", "AT"]} 
        persist={false}
      />
    );

    const deItem = document.getElementById('de-item');
    const atItem = document.getElementById('at-item');
    const chItem = document.getElementById('ch-item');

    // DE and AT should be visible, CH hidden
    expect(deItem?.style.display).toBe('');
    expect(atItem?.style.display).toBe('');
    expect(chItem?.style.display).toBe('none');
  });

  it('enforces singleSelect behavior', async () => {
    const { getByTestId } = render(
      <DACHSwitch 
        defaultAllActive={false} 
        defaultActive="D" 
        singleSelect={true} 
        persist={false}
      />
    );

    const deItem = document.getElementById('de-item');
    const atItem = document.getElementById('at-item');

    // Initial: D is active
    expect(deItem?.style.display).toBe('');
    expect(atItem?.style.display).toBe('none');

    // Click Austria
    const aBtn = getByTestId('flag-A');
    fireEvent.click(aBtn);

    await waitFor(() => {
      // DE should be hidden now (Radio button behavior)
      expect(deItem?.style.display).toBe('none');
      // AT should be visible
      expect(atItem?.style.display).toBe('');
    });
  });

  it('persists selection to localStorage', async () => {
    const storageKey = 'test-dach-storage';
    
    // 1. Render and change selection (Enable persistence)
    const { getByTestId, unmount } = render(
      <DACHSwitch 
        defaultAllActive={false} 
        defaultActive="D" 
        persist={true}
        storageKey={storageKey}
      />
    );

    const aBtn = getByTestId('flag-A');
    fireEvent.click(aBtn); 
    // Now "D" and "A" should be active

    await waitFor(() => {
       const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
       expect(stored).toContain('D');
       expect(stored).toContain('A');
    });

    unmount();

    // 2. Re-render (simulate reload). 
    // We pass defaultActive="CH" to prove it's IGNORED in favor of storage.
    render(
      <DACHSwitch 
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
});
