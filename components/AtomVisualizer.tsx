import React, { useMemo } from 'react';
import { parseElectronConfig } from './ElectronConfigDisplay';

interface AtomVisualizerProps {
  electronConfiguration: string;
}

const AtomVisualizer: React.FC<AtomVisualizerProps> = ({ electronConfiguration }) => {
  const shells = useMemo(() => parseElectronConfig(electronConfiguration), [electronConfiguration]);

  return (
    <div className="w-48 h-48 md:w-56 md:h-56 relative flex items-center justify-center my-4">
      <div className="absolute w-4 h-4 md:w-6 md:h-6 bg-gradient-to-br from-red-500 to-red-700 rounded-full shadow-lg shadow-red-500/50"></div>
      
      {shells.map((electronCount, shellIndex) => {
        const size = 60 + shellIndex * 35;
        const animationDuration = 5 + shellIndex * 2.5;
        const animationClass = shellIndex % 2 === 0 ? 'animate-spin-slow' : 'animate-spin-medium';

        return (
          <div
            key={shellIndex}
            className={`absolute rounded-full border border-dashed border-glow-cyan/30 ${animationClass}`}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              animationDuration: `${animationDuration}s`,
            }}
          >
            {Array.from({ length: electronCount > 18 ? 18 : electronCount }).map((_, electronIndex) => {
              const angle = (electronIndex / (electronCount > 18 ? 18 : electronCount)) * 2 * Math.PI;
              const x = (size / 2) * Math.cos(angle);
              const y = (size / 2) * Math.sin(angle);
              return (
                <div
                  key={electronIndex}
                  className="absolute w-2 h-2 md:w-3 md:h-3 bg-glow-cyan rounded-full shadow-md shadow-glow-cyan/80"
                  style={{
                    top: `calc(50% - ${y}px - 6px)`,
                    left: `calc(50% + ${x}px - 6px)`,
                  }}
                ></div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default AtomVisualizer;