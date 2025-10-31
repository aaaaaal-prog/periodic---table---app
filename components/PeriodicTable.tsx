import React, { useState } from 'react';
import { ElementData } from '../types';
import ElementTile from './ElementTile';
import { SearchIcon } from './icons/SearchIcon';

interface PeriodicTableProps {
  elements: ElementData[];
  onSelectElement: (element: ElementData) => void;
}

const PeriodicTable: React.FC<PeriodicTableProps> = ({ elements, onSelectElement }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const lowerCaseSearchTerm = searchTerm.toLowerCase();

  const isMatch = (element: ElementData) => {
    if (!lowerCaseSearchTerm) return true;
    return (
      element.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      element.symbol.toLowerCase().includes(lowerCaseSearchTerm)
    );
  };

  const mainGridElements = elements.filter(
    (el) =>
      (el.atomicNumber < 57 || el.atomicNumber > 71) &&
      (el.atomicNumber < 89 || el.atomicNumber > 103)
  );

  const lanthanides = elements.filter(
    (el) => el.atomicNumber >= 57 && el.atomicNumber <= 71
  );

  const actinides = elements.filter(
    (el) => el.atomicNumber >= 89 && el.atomicNumber <= 103
  );

  return (
    <div className="w-full animate-fade-in">
      <div className="mb-4 max-w-md mx-auto px-2 sm:px-0">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-custom-grey">
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search by name or symbol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-12 pr-4 text-custom-lightgrey bg-custom-lightblue dark:bg-custom-blue border border-custom-midblue rounded-full focus:outline-none focus:ring-2 focus:ring-glow-cyan"
            aria-label="Search for an element by name or symbol"
          />
        </div>
      </div>

      <div className="w-full overflow-x-auto p-1 sm:p-2 md:p-4">
        <div
          className="grid gap-0.5 sm:gap-1 mx-auto"
          style={{
            gridTemplateColumns: 'repeat(18, minmax(0, 1fr))',
          }}
        >
          {mainGridElements.map((element) => (
            <div
              key={element.atomicNumber}
              style={{
                gridColumn: element.group || 'auto',
                gridRow: element.period,
              }}
            >
              <ElementTile
                element={element}
                onSelect={onSelectElement}
                isDimmed={!isMatch(element)}
              />
            </div>
          ))}

          {/* Lanthanide and Actinide series placeholders */}
          <div className="flex items-center justify-center text-center p-1 text-[7px] sm:text-xs md:text-sm bg-yellow-400/80 rounded-sm sm:rounded-md" style={{ gridColumn: 3, gridRow: 6 }}>57-71</div>
          <div className="flex items-center justify-center text-center p-1 text-[7px] sm:text-xs md:text-sm bg-yellow-600/80 rounded-sm sm:rounded-md" style={{ gridColumn: 3, gridRow: 7 }}>89-103</div>

        </div>

        {/* Separate grid for Lanthanides and Actinides at the bottom */}
        <div className="mt-2 sm:mt-4 w-full">
          <div className="grid gap-0.5 sm:gap-1 mx-auto" style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }}>
            {/* Empty spacer cells */}
            <div style={{ gridColumn: 'span 2' }}></div>
            {lanthanides.map((element) => (
              <div key={element.atomicNumber}>
                <ElementTile
                  element={element}
                  onSelect={onSelectElement}
                  isDimmed={!isMatch(element)}
                />
              </div>
            ))}
            {/* Empty spacer cells */}
            <div style={{ gridColumn: 'span 2', gridRow: 2 }}></div>
            {actinides.map((element) => (
              <div key={element.atomicNumber}>
                <ElementTile
                  element={element}
                  onSelect={onSelectElement}
                  isDimmed={!isMatch(element)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeriodicTable;