
# React DACHSwitch 🏔️

A lightweight, aesthetic, and reusable React component for country-based content filtering, specifically designed for the DACH region (Germany 🇩🇪, Austria 🇦🇹, Switzerland 🇨🇭).

## Features

- **Zero Dependencies** (besides React/ReactDOM)
- **DOM-based Filtering**: Works with any HTML structure, not just React components.
- **Plug & Play**: Drop it in, and it automatically works on elements with `data-country` (customizable).
- **Customizable**: Supports single-select, multi-select, and "Select All" modes.
- **Flexible**: Filter by standard data attributes or custom attributes (like `lang` or `data-market`).
- **Aesthetic**: Built with modern UI principles (Tailwind-ready).

## Installation

```bash
npm install react-dachswitch
```

## Usage

1. **Tag your content**: Add a `data-country` attribute to the elements you want to filter.
2. **Add the Switch**: Place the component in your app.

```tsx
import { DACHSwitch } from 'react-dachswitch';

function App() {
  return (
    <div>
      {/* Automatically finds all [data-country] elements */}
      <DACHSwitch />

      <div className="grid">
        <div data-country="DE">German Product</div>
        <div data-country="AT">Austrian Product</div>
        <div data-country="CH">Swiss Product</div>
      </div>
    </div>
  );
}
```

## Configuration (Props)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `countryCodeAttribute` | `string` | `"data-country"` | The full attribute name to check on target elements (e.g., `lang`, `data-region`). |
| `targetSelector` | `string` | `"[${countryCodeAttribute}]"` | CSS selector for the items to filter. Defaults to selecting all elements with the attribute. |
| `showAllToggle` | `boolean` | `true` | Shows the "DACH" master toggle switch. |
| `defaultAllActive` | `boolean` | `true` | Whether all countries are visible by default. |
| `singleSelect` | `boolean` | `false` | If `true`, only one country can be active at a time. |
| `defaultActive` | `string` \| `string[]` | `"D"` | Initial country/countries if `defaultAllActive` is false. Accepts an array (e.g., `["D", "CH"]`). |
| `codes` | `Record<string, string>` | `{ D:"DE", ...}` | Map of UI labels to data values. |

## Advanced Usage

### Using Custom Attributes

If your site uses `lang` attributes or a different data attribute, you can override it:

```tsx
<DACHSwitch countryCodeAttribute="lang" />

<div lang="DE">...</div>
<div lang="AT">...</div>
```

### Using with Astro 🚀

Astro components are static by default. To enable the interactive filtering features of `DACHSwitch`, you must hydrate the component using a `client:*` directive. `client:load` is recommended so the content filters immediately upon page load.

```astro
---
import { DACHSwitch } from 'react-dachswitch';
---

<header>
  <!-- 'client:load' ensures React hydrates this component immediately -->
  <DACHSwitch client:load />
</header>

<main>
  <article data-country="DE">
    <h2>Nachrichten aus Deutschland</h2>
  </article>
  
  <article data-country="CH">
    <h2>Nachrichten aus der Schweiz</h2>
  </article>
</main>
```

### Scripted Initialization (e.g., IP Detection)

You can set the active country based on the user's location or browser language by fetching the data first and then rendering the component with `defaultAllActive={false}` and the detected country as `defaultActive`.

```tsx
const [initialCountry, setInitialCountry] = useState<string | null>(null);

useEffect(() => {
  // Your detection logic here
  const userRegion = detectRegion(); // e.g., returns 'AT'
  setInitialCountry(userRegion);
}, []);

if (!initialCountry) return <div>Loading...</div>;

return (
  <DACHSwitch 
    defaultAllActive={false}
    defaultActive={initialCountry}
  />
);
```

## Development & Testing

This project uses **Vitest** for unit testing.

1. Install dependencies: `npm install`
2. Run tests: `npm test`

## License

MIT
