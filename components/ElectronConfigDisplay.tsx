import React from 'react';

interface ElectronConfigDisplayProps {
  configuration: string;
  symbol: string;
}

const nobleGasShells: { [key: string]: number[] } = {
    'He': [2],
    'Ne': [2, 8],
    'Ar': [2, 8, 8],
    'Kr': [2, 8, 18, 8],
    'Xe': [2, 8, 18, 18, 8],
    'Rn': [2, 8, 18, 32, 18, 8],
};
const shellNames = ['K', 'L', 'M', 'N', 'O', 'P', 'Q'];

export const parseElectronConfig = (config: string): number[] => {
    const coreMatch = config.match(/\[(.*?)\]/);
    let shells: number[] = [];
    let remainingConfig = config;

    if (coreMatch) {
        const core = coreMatch[1] as keyof typeof nobleGasShells;
        if (nobleGasShells[core]) {
            shells = [...nobleGasShells[core]];
        }
        remainingConfig = config.replace(/\[.*?\]\s*/, '');
    }

    const orbitals = remainingConfig.split(/\s+/).filter(o => o);

    orbitals.forEach(orbital => {
        const match = orbital.match(/(\d+)([spdf])(\d+)/);
        if (match) {
            const shellNumber = parseInt(match[1], 10);
            const electrons = parseInt(match[3], 10);

            while (shells.length < shellNumber) {
                shells.push(0);
            }
            shells[shellNumber - 1] += electrons;
        }
    });
    
    return shells.filter(count => count > 0);
};

export const formatConfigShells = (config: string, symbol?: string): string => {
  const shells = parseElectronConfig(config);
  const shellString = shells.join(',');
  if (symbol) {
    return `[${symbol}] ${shellString}`;
  }
  return shellString;
};


const ElectronConfigDisplay: React.FC<ElectronConfigDisplayProps> = ({ configuration, symbol }) => {
  const shells = parseElectronConfig(configuration);
  const formattedConfig = formatConfigShells(configuration, symbol);

  return (
    <div>
      <div className="flex justify-between items-baseline py-2 border-b border-custom-grey/20">
        <span className="text-sm font-semibold text-custom-grey">Electron Config</span>
        <span className="text-base text-right font-rajdhani font-bold tracking-tight">{formattedConfig}</span>
      </div>
      <div className="pt-2 text-right">
        <h4 className="text-sm font-semibold text-custom-grey text-left">Shell Breakdown</h4>
        <ul className="mt-1 text-sm font-rajdhani">
          {shells.map((count, index) => (
            <li key={index} className="flex justify-between items-center text-custom-lightgrey">
              <span className="text-custom-grey">Shell {index + 1} ({shellNames[index]})</span>
              <span className="font-bold">{count} electron{count > 1 ? 's' : ''}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ElectronConfigDisplay;