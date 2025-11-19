
import React, { useState } from 'react';
import { DACHSwitch } from './components/DACHSwitch';
import { Package, Settings, BookOpen, Github, Check } from 'lucide-react';

const App: React.FC = () => {
  // Configuration state for the demo
  const [config, setConfig] = useState({
    showAllToggle: true,
    defaultAllActive: true,
    singleSelect: false
  });

  // Force re-render of component when config changes (simulate fresh mount)
  const componentKey = JSON.stringify(config);

  const toggleConfig = (key: keyof typeof config) => {
    setConfig(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
           <div className="flex items-center space-x-2 font-bold text-slate-800 text-xl">
             <span>🏔️</span>
             <span>React DACHSwitch</span>
           </div>
           <a href="https://github.com" className="text-slate-500 hover:text-slate-800 transition-colors">
             <Github className="w-6 h-6" />
           </a>
        </div>
      </nav>

      <div className="flex-grow flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
        
        <header className="text-center mb-10 max-w-2xl">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Country Filtering Made Easy
          </h1>
          <p className="text-lg text-slate-600 mb-8">
            A powerful, aesthetic React component for filtering content by DACH regions (Germany, Austria, Switzerland).
          </p>
        </header>

        {/* Interactive Demo Section */}
        <section className="w-full max-w-5xl bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-12">
          <div className="border-b border-slate-100 bg-slate-50/50 p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2 text-slate-700 font-medium">
              <Settings className="w-4 h-4" />
              <span>Live Configuration</span>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm">
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <div 
                  onClick={() => toggleConfig('showAllToggle')}
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${config.showAllToggle ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300'}`}
                >
                  {config.showAllToggle && <Check className="w-3.5 h-3.5" />}
                </div>
                <span className="text-slate-600">Show All Toggle</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <div 
                  onClick={() => toggleConfig('defaultAllActive')}
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${config.defaultAllActive ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300'}`}
                >
                  {config.defaultAllActive && <Check className="w-3.5 h-3.5" />}
                </div>
                <span className="text-slate-600">Default All Active</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer select-none">
                 <div 
                  onClick={() => toggleConfig('singleSelect')}
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${config.singleSelect ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300'}`}
                >
                  {config.singleSelect && <Check className="w-3.5 h-3.5" />}
                </div>
                <span className="text-slate-600">Single Select Mode</span>
              </label>
            </div>
          </div>

          <div className="p-8 flex flex-col items-center bg-slate-50/30 min-h-[300px]">
             {/* The Component */}
             <div className="mb-10 scale-110 transform">
              <DACHSwitch 
                key={componentKey} // Forces remount on config change
                targetSelector=".content-card" 
                countryCodeAttribute="data-country"
                showAllToggle={config.showAllToggle}
                defaultAllActive={config.defaultAllActive}
                singleSelect={config.singleSelect}
              />
            </div>

            {/* Grid of Content */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
              
               {/* DE */}
              <div className="content-card bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:border-blue-200 hover:shadow-md transition-all" data-country="DE">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-3xl">🇩🇪</span>
                  <span className="text-xs font-bold px-2 py-1 bg-slate-100 rounded text-slate-500">DE</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">Berlin HQ</h3>
                <p className="text-sm text-slate-500">Exclusive for Germany.</p>
              </div>

              {/* AT */}
              <div className="content-card bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:border-red-200 hover:shadow-md transition-all" data-country="AT">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-3xl">🇦🇹</span>
                  <span className="text-xs font-bold px-2 py-1 bg-slate-100 rounded text-slate-500">AT</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">Vienna Hub</h3>
                <p className="text-sm text-slate-500">Austria region only.</p>
              </div>

              {/* CH */}
              <div className="content-card bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:border-red-200 hover:shadow-md transition-all" data-country="CH">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-3xl">🇨🇭</span>
                  <span className="text-xs font-bold px-2 py-1 bg-slate-100 rounded text-slate-500">CH</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">Zurich Lab</h3>
                <p className="text-sm text-slate-500">Swiss market specific.</p>
              </div>
              
               {/* Universal */}
               <div className="bg-slate-50 p-5 rounded-xl border border-dashed border-slate-300 opacity-75">
                <div className="flex justify-between items-start mb-3">
                  <Package className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="font-semibold text-slate-500 mb-1">Global Item</h3>
                <p className="text-sm text-slate-400">Always visible.</p>
              </div>

            </div>
          </div>
        </section>

        {/* Documentation Section */}
        <section className="w-full max-w-4xl prose prose-slate prose-headings:font-bold">
          <div className="flex items-center space-x-2 text-slate-900 mb-6">
            <BookOpen className="w-6 h-6" />
            <h2 className="text-2xl m-0">Documentation</h2>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
            <h3 className="text-xl text-slate-900 mt-0">Installation</h3>
            <pre className="bg-slate-900 text-slate-50 p-4 rounded-lg overflow-x-auto">
              <code>npm install react-dachswitch</code>
            </pre>

            <h3 className="text-xl text-slate-900 mt-8">Basic Usage</h3>
            <p>Import the component. By default, it looks for any element with a <code>data-country</code> attribute.</p>
            <pre className="bg-slate-900 text-slate-50 p-4 rounded-lg overflow-x-auto">
<code>{`import { DACHSwitch } from 'react-dachswitch';

// ... inside your component
<DACHSwitch />

// ... your HTML structure
<div data-country="DE">...</div>
<div data-country="AT">...</div>`}</code>
            </pre>

             <h3 className="text-xl text-slate-900 mt-8">Target Specific Elements</h3>
            <p>Use <code>targetSelector</code> if you only want to filter specific parts of the page.</p>
            <pre className="bg-slate-900 text-slate-50 p-4 rounded-lg overflow-x-auto">
<code>{`// Only filters elements with class .item that have data-country
<DACHSwitch targetSelector=".item" />`}</code>
            </pre>

            <h3 className="text-xl text-slate-900 mt-8">Configuration Options</h3>
            <table className="w-full text-left text-sm mt-4 border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-2 font-semibold text-slate-900">Prop</th>
                  <th className="py-2 font-semibold text-slate-900">Type</th>
                  <th className="py-2 font-semibold text-slate-900">Default</th>
                  <th className="py-2 font-semibold text-slate-900">Description</th>
                </tr>
              </thead>
              <tbody className="text-slate-600">
                 <tr className="border-b border-slate-100">
                   <td className="py-2 pr-4 font-mono text-blue-600">countryCodeAttribute</td>
                  <td className="py-2 pr-4">string</td>
                  <td className="py-2 pr-4">"data-country"</td>
                  <td className="py-2">The full attribute name to read from elements.</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-4 font-mono text-blue-600">targetSelector</td>
                  <td className="py-2 pr-4">string</td>
                  <td className="py-2 pr-4">"[data-country]"</td>
                  <td className="py-2">CSS selector for elements to filter.</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-4 font-mono text-blue-600">showAllToggle</td>
                  <td className="py-2 pr-4">boolean</td>
                  <td className="py-2 pr-4">true</td>
                  <td className="py-2">Displays the "DACH" master toggle.</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-4 font-mono text-blue-600">defaultAllActive</td>
                  <td className="py-2 pr-4">boolean</td>
                  <td className="py-2 pr-4">true</td>
                  <td className="py-2">If true, all countries are selected on mount.</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-4 font-mono text-blue-600">defaultActive</td>
                  <td className="py-2 pr-4">string | string[]</td>
                  <td className="py-2 pr-4">"D"</td>
                  <td className="py-2">Initial selection. Accepts arrays like ["D", "A"].</td>
                </tr>
              </tbody>
            </table>

            <h3 className="text-xl text-slate-900 mt-8">Astro Best Practice</h3>
            <p>For static sites like Astro, ensure you use the <code>client:load</code> directive so the filtering works immediately.</p>
            <pre className="bg-slate-900 text-slate-50 p-4 rounded-lg overflow-x-auto">
<code>{`---
import { DACHSwitch } from 'react-dachswitch';
---

<DACHSwitch client:load />

<div data-country="DE">Germany</div>
<div data-country="AT">Austria</div>`}</code>
            </pre>
          </div>
        </section>

      </div>
    </div>
  );
};

export default App;
