import React, { useState, useEffect, useCallback } from 'react';
import { ElementData, AppView } from './types';
import { elements } from './data/elements';
import PeriodicTable from './components/PeriodicTable';
import ElementDetail from './components/ElementDetail';
import QuizView from './components/QuizView';
import { ThemeToggle } from './components/ThemeToggle';
import { QuizIcon } from './components/icons/QuizIcon';
import { TableIcon } from './components/icons/TableIcon';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [selectedElement, setSelectedElement] = useState<ElementData | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.TABLE);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleSelectElement = useCallback((element: ElementData) => {
    setSelectedElement(element);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedElement(null);
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const toggleView = () => {
    setSelectedElement(null);
    setCurrentView(prevView => (prevView === AppView.TABLE ? AppView.QUIZ : AppView.TABLE));
  };
  
  return (
    <div className="min-h-screen bg-custom-lightgrey dark:bg-custom-blue text-gray-800 dark:text-custom-lightgrey font-rajdhani transition-colors duration-300">
      <header className="sticky top-0 z-20 bg-custom-lightgrey/80 dark:bg-custom-blue/80 backdrop-blur-sm p-4 flex justify-between items-center border-b border-custom-grey/20">
        <h1 className="text-2xl md:text-3xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-glow-cyan to-glow-magenta">
          Element Explorer
        </h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleView}
            className="p-2 rounded-full hover:bg-custom-grey/20 transition-colors"
            aria-label={currentView === AppView.TABLE ? "Switch to Quiz Mode" : "Switch to Periodic Table"}
          >
            {currentView === AppView.TABLE ? <QuizIcon /> : <TableIcon />}
          </button>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
      </header>

      <main className="p-2 sm:p-4">
        {currentView === AppView.TABLE ? (
          <PeriodicTable elements={elements} onSelectElement={handleSelectElement} />
        ) : (
          <QuizView elements={elements} />
        )}
      </main>

      {selectedElement && (
        <ElementDetail 
          element={selectedElement} 
          onClose={handleCloseDetail} 
        />
      )}
    </div>
  );
};

export default App;