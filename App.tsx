
import React, { useState } from 'react';
import { DACHSwitch } from './components/DACHSwitch';
import { Package, Settings, BookOpen, Github, Check, Save, ExternalLink, Globe } from 'lucide-react';

const App: React.FC = () => {
  // Configuration state for the demo
  const [config, setConfig] = useState({
    showAllToggle: true,
    defaultAllActive: true,
    singleSelect: false,
    persist: true
  });

  // Force re-render of component when config changes (simulate fresh mount)
  const componentKey = JSON.stringify(config);

  const toggleConfig = (key: keyof typeof config) => {
    setConfig(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 sticky top-0 z-50 bg-white/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
           <div className="flex items-center space-x-2 font-bold text-slate-800 text-xl tracking-tight">
             <span className="text-2xl">🏔️</span>
             <span>React DACHSwitch</span>
           </div>
           <a 
            href="https://github.com/pwagner/react-dachswitch" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-slate-900 transition-colors p-2 rounded-full hover:bg-slate-100"
            aria-label="View on GitHub"
           >
             <Github className="w-6 h-6" />
           </a>
        </div>
      </nav>

      <div className="flex-grow flex flex-col items-center py-8 sm:py-16 px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto">
        
        <header className="text-center mb-10 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 leading-tight">
            Country Filtering <br/>Made
            
            {/* Container for 'Easy' and 'DeutschsprACHig' */}
            <span className="relative inline-block mx-2">
                {/* Struck-through "Easy" (Flow placeholder) */}
                <span className="line-through">Easy</span>
                
                {/* Simplified Handwriting replacement: DeutschsprACHig - Absolute position for layering */}
                <span 
                    className="
                        absolute 
                        text-red-700                 /* Dark Red color */
                        text-xl 
                        transform 
                        -rotate-3 
                        origin-bottom-left
                        -top-1                         /* Move up */
                        -left-25                       /* Move slightly right */
                    "
                    style={{ fontFamily: 'Permanent Marker, cursive' }} 
                >
                    DeutschsprACHig
                </span>
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 px-4">
            A powerful, aesthetic React component for filtering content by DACH regions: Germany, Austria, Switzerland - <em>not</em> only for German-speaking websites!
          </p>
        </header>

        {/* Interactive Demo Section */}
        <section className="w-full max-w-5xl bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 overflow-hidden mb-16">
          
          {/* Config Header */}
          <div className="border-b border-slate-100 bg-slate-50/80 p-4 sm:p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-8">
            <div className="flex items-center space-x-2 text-slate-800 font-semibold shrink-0">
              <Settings className="w-5 h-5 text-slate-500" />
              <span>Live Configuration</span>
            </div>
            
            <div className="w-full lg:w-auto flex flex-wrap gap-3 sm:gap-6 text-sm">
              <label className="flex items-center space-x-2 cursor-pointer select-none bg-white px-3 py-1.5 rounded border border-slate-200 hover:border-slate-300 transition-all sm:bg-transparent sm:border-0 sm:p-0">
                <div 
                  onClick={() => toggleConfig('showAllToggle')}
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0 ${config.showAllToggle ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300'}`}
                >
                  {config.showAllToggle && <Check className="w-3.5 h-3.5" />}
                </div>
                <span className="text-slate-700">Show All Toggle</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer select-none bg-white px-3 py-1.5 rounded border border-slate-200 hover:border-slate-300 transition-all sm:bg-transparent sm:border-0 sm:p-0">
                <div 
                  onClick={() => toggleConfig('defaultAllActive')}
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0 ${config.defaultAllActive ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300'}`}
                >
                  {config.defaultAllActive && <Check className="w-3.5 h-3.5" />}
                </div>
                <span className="text-slate-700">Default All</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer select-none bg-white px-3 py-1.5 rounded border border-slate-200 hover:border-slate-300 transition-all sm:bg-transparent sm:border-0 sm:p-0">
                 <div 
                  onClick={() => toggleConfig('singleSelect')}
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0 ${config.singleSelect ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300'}`}
                >
                  {config.singleSelect && <Check className="w-3.5 h-3.5" />}
                </div>
                <span className="text-slate-700">Single Select</span>
              </label>

               <label className="flex items-center space-x-2 cursor-pointer select-none bg-white px-3 py-1.5 rounded border border-slate-200 hover:border-slate-300 transition-all sm:bg-transparent sm:border-0 sm:p-0 sm:border-l sm:border-slate-300 sm:pl-6">
                 <div 
                  onClick={() => toggleConfig('persist')}
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0 ${config.persist ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-300'}`}
                >
                  {config.persist && <Save className="w-3.5 h-3.5" />}
                </div>
                <span className="text-slate-700 font-medium">Persist</span>
              </label>
            </div>

          </div>

          {/* Demo Canvas */}
          <div className="p-6 sm:p-10 flex flex-col items-center bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] min-h-[400px]">
             
             {/* The Component */}
             <div className="mb-12 transform sm:scale-110 transition-transform origin-center z-10">
              <DACHSwitch 
                key={componentKey} // Forces remount on config change
                targetSelector=".content-card" 
                countryCodeAttribute="data-country"
                showAllToggle={config.showAllToggle}
                defaultAllActive={config.defaultAllActive}
                singleSelect={config.singleSelect}
                persist={config.persist}
              />
            </div>

            {/* Grid of Content */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl">
              
               {/* DE */}
              <div className="content-card group bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300" data-country="DE">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-4xl filter drop-shadow-sm">🇩🇪</span>
                  <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 text-slate-500 rounded uppercase tracking-wider">Germany</span>
                </div>
                <h3 className="font-bold text-slate-900 mb-2 text-lg">Berlin HQ</h3>
                <p className="text-sm text-slate-500 leading-relaxed">Exclusive content visible only when Germany is active.</p>
              </div>

              {/* AT */}
              <div className="content-card group bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-red-400/50 hover:shadow-lg hover:shadow-red-100/50 transition-all duration-300" data-country="AT">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-4xl filter drop-shadow-sm">🇦🇹</span>
                  <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 text-slate-500 rounded uppercase tracking-wider">Austria</span>
                </div>
                <h3 className="font-bold text-slate-900 mb-2 text-lg">Vienna Hub</h3>
                <p className="text-sm text-slate-500 leading-relaxed">Exclusive content visible only when Austria is active.</p>
              </div>

              {/* CH */}
              <div className="content-card group bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-red-400/50 hover:shadow-lg hover:shadow-red-100/50 transition-all duration-300" data-country="CH">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-4xl filter drop-shadow-sm">🇨🇭</span>
                  <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 text-slate-500 rounded uppercase tracking-wider">Switz.</span>
                </div>
                <h3 className="font-bold text-slate-900 mb-2 text-lg">Zurich Lab</h3>
                <p className="text-sm text-slate-500 leading-relaxed">Exclusive content visible only when Switzerland is active.</p>
              </div>
              
               {/* Universal */}
               <div className="bg-slate-100/50 p-6 rounded-xl border border-dashed border-slate-300/75 flex flex-col justify-center items-center text-center sm:col-span-2 lg:col-span-3 xl:col-span-1">
                <div className="mb-3 p-3 bg-slate-100 rounded-full">
                  <Package className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="font-semibold text-slate-600 mb-1">Global Item</h3>
                <p className="text-xs text-slate-400">This item has no attribute, so it stays visible.</p>
              </div>

            </div>
          </div>
        </section>

        {/* Live Example Badge */}
        <a 
          href="https://silbervergleich.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-sm text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:shadow-sm transition-all group mb-16"
        >
          <Globe className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
          <span>See it in action: <strong>silbervergleich.com</strong></span>
          <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100" />
        </a>

        {/* Documentation Section */}
        <section className="w-full max-w-4xl prose prose-slate prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-500">
          <div className="flex items-center space-x-3 text-slate-900 mb-8 border-b border-slate-200 pb-4">
            <BookOpen className="w-7 h-7" />
            <h2 className="text-3xl m-0">Documentation</h2>
          </div>

          {/* Reduced padding on mobile (p-4 vs p-10) */}
          <div className="bg-white rounded-2xl p-4 sm:p-10 shadow-sm border border-slate-200">
            <h3 className="text-xl text-slate-900 mt-0">Installation</h3>
            <div className="relative group">
              <pre className="bg-slate-900 text-slate-50 p-3 sm:p-4 rounded-lg overflow-x-auto shadow-md max-w-full text-xs sm:text-sm mt-4">
                <code>npm install react-dachswitch</code>
              </pre>
            </div>

            <h3 className="text-xl text-slate-900 mt-8">Basic Usage</h3>
            <p>Import the component. By default, it looks for any element with a <code>data-country</code> attribute.</p>
            <pre className="bg-slate-900 text-slate-50 p-3 sm:p-4 rounded-lg overflow-x-auto shadow-md max-w-full text-xs sm:text-sm mt-6">
<code>{`import { DACHSwitch } from 'react-dachswitch';
import 'react-dachswitch/dist/style.css';

// ... inside your component
<DACHSwitch />

// ... your HTML structure
<div data-country="DE">...</div>
<div data-country="AT">...</div>`}</code>
            </pre>

             <h3 className="text-xl text-slate-900 mt-8">Target Specific Elements</h3>
            <p>Use <code>targetSelector</code> if you only want to filter specific parts of the page.</p>
            <pre className="bg-slate-900 text-slate-50 p-3 sm:p-4 rounded-lg overflow-x-auto shadow-md max-w-full text-xs sm:text-sm mt-6">
<code>{`// Only filters elements with class .item that have data-country
<DACHSwitch targetSelector=".item" />`}</code>
            </pre>

            <h3 className="text-xl text-slate-900 mt-8">Configuration Options</h3>
            {/* Adjusted negative margin to match mobile padding (-mx-4) */}
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full text-left text-xs sm:text-sm mt-4 border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="py-2 px-2 sm:py-3 sm:px-4 font-semibold text-slate-900 rounded-tl-lg">Prop</th>
                    <th className="py-2 px-2 sm:py-3 sm:px-4 font-semibold text-slate-900">Type</th>
                    <th className="py-2 px-2 sm:py-3 sm:px-4 font-semibold text-slate-900">Default</th>
                    <th className="py-2 px-2 sm:py-3 sm:px-4 font-semibold text-slate-900 rounded-tr-lg">Description</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600">
                   <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                     <td className="py-2 px-2 sm:py-3 sm:px-4 font-mono text-blue-600 font-medium whitespace-nowrap">countryCodeAttribute</td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4 whitespace-nowrap">string</td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4">"data-country"</td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4">The full attribute name to read.</td>
                  </tr>
                  <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-2 px-2 sm:py-3 sm:px-4 font-mono text-blue-600 font-medium whitespace-nowrap">targetSelector</td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4 whitespace-nowrap">string</td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4">"[data-country]"</td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4">CSS selector for elements to filter.</td>
                  </tr>
                  <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-2 px-2 sm:py-3 sm:px-4 font-mono text-blue-600 font-medium whitespace-nowrap">showAllToggle</td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4 whitespace-nowrap">boolean</td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4">true</td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4">Displays the "DACH" master toggle.</td>
                  </tr>
                  <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-2 px-2 sm:py-3 sm:px-4 font-mono text-blue-600 font-medium whitespace-nowrap">defaultAllActive</td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4 whitespace-nowrap">boolean</td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4">true</td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4">Whether all countries are visible by default.</td>
                  </tr>
                  <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-2 px-2 sm:py-3 sm:px-4 font-mono text-blue-600 font-medium whitespace-nowrap">singleSelect</td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4 whitespace-nowrap">boolean</td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4">false</td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4">If true, clicking a flag deselects others.</td>
                  </tr>
                  <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-2 px-2 sm:py-3 sm:px-4 font-mono text-blue-600 font-medium whitespace-nowrap">persist</td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4 whitespace-nowrap">boolean</td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4">true</td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4">If true, saves selection to localStorage.</td>
                  </tr>
                  <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-2 px-2 sm:py-3 sm:px-4 font-mono text-blue-600 font-medium whitespace-nowrap">storageKey</td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4 whitespace-nowrap">string</td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4">"dach-..."</td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4">The localStorage key used.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl text-slate-900 mt-8">Astro Best Practice</h3>
            <p>For static sites like Astro, ensure you use the <code>client:load</code> directive so the filtering works immediately.</p>
            <pre className="bg-slate-900 text-slate-50 p-3 sm:p-4 rounded-lg overflow-x-auto shadow-md max-w-full text-xs sm:text-sm mt-6">
<code>{`---
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
`}</code>
            </pre>
          </div>
        </section>

      </div>
    </div>
  );
};

export default App;
