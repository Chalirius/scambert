import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'

interface Character {
  tone: 'friendly' | 'serious';
  text: string;
}

const FinancialGuardianWidget: React.FC = () => {
  const [character, setCharacter] = useState<Character>({
    tone: 'friendly',
    text: 'Hi there!'
  });

  const handleSimulationClick = () => {
    setCharacter({
      tone: 'serious',
      text: "Uh-oh! You clicked on a scam link! Here's what went wrong..."
    });
  };

  return (
    <div className="scamducation-widget">
      <div className="widget-header">
        <h2>{character.text}</h2>
        <button id="start-simulation" onClick={handleSimulationClick}>
          Start Scam Simulation
        </button>
      </div>
    </div>
  );
};

// Mount API: allow programmatic mounting or automatic mount to `#root`
export function mountScamducationWidget(containerOrSelector?: HTMLElement | string) {
  const container: HTMLElement | null = typeof containerOrSelector === 'string'
    ? (document.querySelector(containerOrSelector) as HTMLElement | null)
    : (containerOrSelector as HTMLElement | null) || document.getElementById('root');

  if (!container) return null;

  const root = createRoot(container);
  root.render(<FinancialGuardianWidget />);

  return {
    unmount: () => root.unmount()
  };
}

// Attach to window for pages that want to call it directly
;(globalThis as any).mountScamducationWidget = mountScamducationWidget;

// Auto-mount if a `#root` container exists on page
if (document.getElementById('root')) {
  mountScamducationWidget();
}