import React from 'react';
import { ElementData } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface ElementTileProps {
  element: ElementData;
  onSelect: (element: ElementData) => void;
  isDimmed?: boolean;
}

const ElementTile: React.FC<ElementTileProps> = ({ element, onSelect, isDimmed }) => {
  const colorClass = CATEGORY_COLORS[element.category] || 'bg-gray-500';

  return (
    <button
      onClick={() => onSelect(element)}
      className={`w-full aspect-square p-0.5 sm:p-1 rounded-sm sm:rounded-md text-white shadow-md transition-all duration-300 transform hover:scale-110 hover:z-10 focus:outline-none focus:ring-2 focus:ring-white focus:z-10 ${colorClass} ${isDimmed ? 'opacity-20 pointer-events-none' : ''}`}
    >
      <div className="text-left text-[8px] sm:text-sm font-bold">{element.atomicNumber}</div>
      <div className="text-center text-base sm:text-2xl font-orbitron font-bold">{element.symbol}</div>
      <div className="text-center text-[7px] sm:text-xs truncate">{element.name}</div>
    </button>
  );
};

export default ElementTile;