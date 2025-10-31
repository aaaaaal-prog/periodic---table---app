import React, { useState, useEffect, useMemo } from 'react';
import { ElementData } from '../types';
import { getFunFact, getElementImage } from '../services/geminiService';
import AtomVisualizer from './AtomVisualizer';
import { CloseIcon } from './icons/CloseIcon';
import { InfoIcon } from './icons/InfoIcon';
import { FlaskIcon } from './icons/FlaskIcon';
import ElectronConfigDisplay from './ElectronConfigDisplay';

interface ElementDetailProps {
  element: ElementData;
  onClose: () => void;
}

const DetailItem: React.FC<{ label: string; value: string | number; }> = ({ label, value }) => (
  <div className="flex justify-between items-baseline py-2 border-b border-custom-grey/20">
    <span className="text-sm font-semibold text-custom-grey">{label}</span>
    <span className="text-base text-right font-rajdhani font-bold">{value}</span>
  </div>
);

const ElementDetail: React.FC<ElementDetailProps> = ({ element, onClose }) => {
  const [funFact, setFunFact] = useState<string>('Loading fun fact...');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoadingImage, setIsLoadingImage] = useState(true);

  useEffect(() => {
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';

    // Set initial loading states
    setFunFact('Loading fun fact...');
    setIsLoadingImage(true);

    // Fetch fun fact and update state when it's ready, independently
    getFunFact(element).then(fact => {
      setFunFact(fact);
    });

    // Fetch image and update state when it's ready, independently
    getElementImage(element).then(img => {
      setImageUrl(img);
      setIsLoadingImage(false);
    });

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [element]);

  const stateColor = useMemo(() => {
    switch(element.state) {
      case 'Solid': return 'border-green-400 text-green-400';
      case 'Liquid': return 'border-blue-400 text-blue-400';
      case 'Gas': return 'border-red-400 text-red-400';
      default: return 'border-gray-400 text-gray-400';
    }
  }, [element.state]);

  return (
    <div 
      className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm flex items-center justify-center animate-fade-in" 
      onClick={onClose}
    >
      <div 
        className="w-11/12 max-w-4xl max-h-[90vh] bg-custom-lightgrey dark:bg-custom-lightblue rounded-xl shadow-2xl overflow-hidden flex flex-col animate-slide-in"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex justify-between items-center p-4 border-b border-custom-grey/20">
          <h2 className="text-3xl md:text-4xl font-orbitron font-bold">
            <span className="text-custom-grey/80">{element.atomicNumber}.</span> {element.name} ({element.symbol})
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-custom-grey/20 transition-colors">
            <CloseIcon />
          </button>
        </header>

        <div className="flex-grow overflow-y-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-full max-w-xs aspect-square relative">
              {isLoadingImage ? (
                 <div className="w-full h-full bg-custom-blue/50 rounded-lg flex items-center justify-center">
                   <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-glow-cyan"></div>
                 </div>
              ) : (
                <img src={imageUrl} alt={`Sample of ${element.name}`} className="w-full h-full object-cover rounded-lg shadow-lg" />
              )}
            </div>
            <AtomVisualizer electronConfiguration={element.electronConfiguration} />
          </div>

          <div className="space-y-4">
            <div className="bg-custom-blue/30 dark:bg-black/30 p-4 rounded-lg">
              <h3 className="text-xl font-bold font-orbitron mb-2 flex items-center gap-2"><InfoIcon /> Details</h3>
              <DetailItem label="Atomic Mass" value={`${element.atomicMass} u`} />
              <DetailItem label="Category" value={element.category} />
              <ElectronConfigDisplay configuration={element.electronConfiguration} symbol={element.symbol} />
              <div className="flex justify-between items-center py-2">
                 <span className="text-sm font-semibold text-custom-grey">State at 20°C</span>
                 <span className={`px-2 py-1 text-sm font-bold rounded-full border-2 ${stateColor}`}>{element.state}</span>
              </div>
            </div>

            <div className="bg-custom-blue/30 dark:bg-black/30 p-4 rounded-lg">
              <h3 className="text-xl font-bold font-orbitron mb-2 flex items-center gap-2"><FlaskIcon /> Fun Fact</h3>
              <p className="text-custom-lightgrey text-base leading-relaxed">{funFact}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElementDetail;