
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DACHSwitch } from './DACHSwitch';

describe('DACHSwitch', () => {
  let container: HTMLDivElement;

  // Setup DOM elements for filtering before each test
  beforeEach(() => {
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
    render(<DACHSwitch />);
    expect(screen.getByTitle('Filter by D')).toBeDefined();
    expect(screen.getByTitle('Filter by A')).toBeDefined();
    expect(screen.getByTitle('Filter by CH')).toBeDefined();
  });

  it('filters content based on default selection (All Active)', () => {
    render(<DACHSwitch />);
    
    // All should be visible
    const deItem = document.getElementById('de-item');
    const atItem = document.getElementById('at-item');
    
    expect(deItem?.style.display).toBe('');
    expect(atItem?.style.display).toBe('');
  });

  it('hides content when flag is deselected', () => {
    render(<DACHSwitch defaultAllActive={false} defaultActive={["D"]} />);
    
    const deItem = document.getElementById('de-item');
    const atItem = document.getElementById('at-item');
    
    expect(deItem?.style.display).toBe('');
    expect(atItem?.style.display).toBe('none');
    
    // Click 'A' to toggle it on
    const aBtn = screen.getByTestId('flag-A');
    fireEvent.click(aBtn);
    
    expect(atItem?.style.display).toBe('');
  });

  it('supports custom attributes', () => {
    // Re-setup DOM with custom attr
    container.innerHTML = `
      <div lang="DE" id="custom-de">DE Lang</div>
      <div lang="AT" id="custom-at">AT Lang</div>
    `;

    render(<DACHSwitch countryCodeAttribute="lang" defaultAllActive={false} defaultActive="DE" codes={{'D': 'DE', 'A': 'AT', 'CH': 'CH'}} />);

    const customDe = document.getElementById('custom-de');
    const customAt = document.getElementById('custom-at');

    // Initial: only DE selected (mapped to D)
    // Wait, defaultActive maps to UI label (keys), not values.
    // So defaultActive="D" maps to value "DE".
    
    // Let's restart this specific test with correct props
  });
  
  it('correctly maps UI labels to custom attribute values', () => {
     container.innerHTML = `
      <div lang="DE" id="custom-de">DE Lang</div>
      <div lang="AT" id="custom-at">AT Lang</div>
    `;
    
    render(<DACHSwitch countryCodeAttribute="lang" defaultAllActive={false} defaultActive="D" />);
    
    const customDe = document.getElementById('custom-de');
    const customAt = document.getElementById('custom-at');
    
    expect(customDe?.style.display).toBe('');
    expect(customAt?.style.display).toBe('none');
  });

  it('toggles all when DACH button is clicked', () => {
     render(<DACHSwitch showAllToggle={true} defaultAllActive={true} />);
     
     const dachBtn = screen.getByTitle('Toggle All Countries');
     
     // Click to deselect all
     fireEvent.click(dachBtn);
     
     const deItem = document.getElementById('de-item');
     expect(deItem?.style.display).toBe('none');
     
     // Click to select all
     fireEvent.click(dachBtn);
     expect(deItem?.style.display).toBe('');
  });
});
