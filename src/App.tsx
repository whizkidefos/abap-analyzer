import React from 'react';
import CodeEditor from './components/CodeEditor';
import NewsTicker from './components/NewsTicker';
import { useTheme } from './context/ThemeContext';
import { SunIcon, MoonIcon, BeakerIcon, CodeBracketIcon, ChartBarIcon, DocumentCheckIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <header className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg sticky top-0 z-10`}>
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className={`text-xl md:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                <CodeBracketIcon className="h-6 w-6" />
                ABAP Code Analyzer for S/4HANA
              </h1>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm md:text-base`}>
                Analyze and improve your ABAP code quality with S/4HANA best practices
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${
                  theme === 'dark' 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-gray-100 hover:bg-gray-200'
                } transition-colors`}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <SunIcon className="h-5 w-5 text-yellow-400" />
                ) : (
                  <MoonIcon className="h-5 w-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 flex-1 py-6">
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
            <div className="flex items-center gap-2 mb-2">
              <BeakerIcon className={`h-5 w-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
              <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                S/4HANA Ready
              </h3>
            </div>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Automatically check code compatibility with S/4HANA best practices
            </p>
          </div>
          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
            <div className="flex items-center gap-2 mb-2">
              <CodeBracketIcon className={`h-5 w-5 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
              <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Modern ABAP
              </h3>
            </div>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Get suggestions for modern ABAP development patterns
            </p>
          </div>
          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
            <div className="flex items-center gap-2 mb-2">
              <ChartBarIcon className={`h-5 w-5 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
              <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Performance Insights
              </h3>
            </div>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Optimize code performance with detailed analysis
            </p>
          </div>
          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
            <div className="flex items-center gap-2 mb-2">
              <RocketLaunchIcon className={`h-5 w-5 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`} />
              <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                RAP Ready
              </h3>
            </div>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Ensure code follows RESTful ABAP Programming Model
            </p>
          </div>
        </div>

        <div className={`mb-6 p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'} shadow-md`}>
          <div className="flex items-start gap-4">
            <DocumentCheckIcon className={`h-8 w-8 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
            <div>
              <h2 className={`text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                How to use this analyzer:
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <ul className={`list-disc pl-5 space-y-2 text-sm md:text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <li>Paste your ABAP code into the editor below</li>
                  <li>The analyzer will automatically check for S/4HANA compatibility issues</li>
                  <li>Review suggestions for modern ABAP development practices</li>
                  <li>Get insights on performance optimization and code quality</li>
                </ul>
                <ul className={`list-disc pl-5 space-y-2 text-sm md:text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <li>Use keyboard shortcuts for quick actions</li>
                  <li>Access pre-built code snippets for common patterns</li>
                  <li>Check RAP compliance for modern S/4HANA development</li>
                  <li>Export analysis results for documentation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="pb-16">
          <CodeEditor />
        </div>
      </main>
      
      <NewsTicker />
    </div>
  );
}

export default App;