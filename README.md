
# React DACHSwitch 🏔️

A lightweight, aesthetic, and reusable React component for country-based content filtering, specifically designed for the DACH region (Germany 🇩🇪, Austria 🇦🇹, Switzerland 🇨🇭).

## Features

- **Zero Dependencies** (besides React/ReactDOM)
- **DOM-based Filtering**: Works with any HTML structure, not just React components.
- **Plug & Play**: Drop it in, and it automatically works on elements with `data-country` (customizable).
- **State Persistence**: Optionally saves user selection to `localStorage` so it remembers preferences on reload.
- **Customizable**: Supports single-select, multi-select, and "Select All" modes.
- **Flexible**: Filter by standard data attributes or custom attributes (like `lang` or `data-market`).
- **Aesthetic**: Built with modern UI principles (Tailwind-ready).

## Installation

```bash
npm install react-dachswitch
```

## Styling (Important)

This component uses **Tailwind CSS** classes. To ensure it looks correct, you must import the provided CSS file in your application (e.g., in `App.tsx`, `main.tsx`, or `_app.tsx`):

```javascript
import 'react-dachswitch/dist/style.css';
```

## Usage

1. **Tag your content**: Add a `data-country` attribute to the elements you want to filter.
2. **Add the Switch**: Place the component in your app.

```tsx
import { DACHSwitch } from 'react-dachswitch';
import 'react-dachswitch/dist/style.css';

function App() {
  return (
    <div>
      {/* Automatically finds all [data-country] elements */}
      <DACHSwitch persist={true} />

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
| `defaultActive` | `string` \| `string[]` | `"D"` | Initial country. Accepts Keys (e.g. "D") OR Values (e.g. "DE"). Accepts array (e.g., `["DE", "CH"]`). Ignored if `defaultAllActive` is true. |
| `persist` | `boolean` | `true` | If `true`, saves the selection to `localStorage`. |
| `storageKey` | `string` | `"dach-switch-selection"` | The `localStorage` key used to save state. |
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
import 'react-dachswitch/dist/style.css';
---

<header>
  <!-- 'client:load' ensures React hydrates this component immediately -->
  <DACHSwitch client:load persist={true} />
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
    defaultActive={initialCountry} // Can be "AT" or "A"
  />
);
```

## Development & Testing

This project uses **Vitest** for unit testing.

1. Install dependencies: `npm install`
2. Run tests: `npm test`

### Publishing

1. Build the library: `npm run build:lib`
2. Publish: `npm publish`

### Hosting the Demo

To build the demo application and deploy it to GitHub Pages using a Personal Access Token):
1. `npm run build:demo`
2. The output will be in the `build/` directory.
3. `export GH_TOKEN="[YOUR_PAT_TOKEN]"`
4. `npm run deploy`

## License

MIT