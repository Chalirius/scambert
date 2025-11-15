import React from 'react'
import { createRoot } from 'react-dom/client'
import { GreetingComponent } from './greeting'
import QRScamGame from './qr';

type WidgetType = 'greeting' | 'default' | 'qr';

interface WidgetConfig {
  container?: HTMLElement | string;
  // options passed to the selected component
  options?: {
    character?: string;
    animate?: boolean;
    widget?: WidgetType;
  };
}

// Component map for selecting the appropriate subcomponent
const componentMap: Record<WidgetType, React.FC<any>> = {
  greeting: GreetingComponent,
  qr: QRScamGame, 
  default: GreetingComponent
};

// Mount API: allow programmatic mounting with component selection and options
export function mountScamducationWidget(config?: WidgetConfig | HTMLElement | string) {
  // Handle backward compatibility: if config is a string or HTMLElement, treat as container
  let containerOrSelector: HTMLElement | string | null = null;
  let widget: WidgetType = 'default';
  let options: { character?: string; animate?: boolean; widget?: WidgetType } = { character: 'scamuel', animate: true, widget: 'greeting' };

  if (config) {
    if (typeof config === 'string' || config instanceof HTMLElement) {
      containerOrSelector = config;
    } else if (typeof config === 'object' && config !== null) {
      containerOrSelector = config.container || null;
      options = { ...options, ...(config.options || {}) };
      console.log(JSON.stringify(options));
    }
  }

  const container: HTMLElement | null = typeof containerOrSelector === 'string'
    ? (document.querySelector(containerOrSelector) as HTMLElement | null)
    : (containerOrSelector as HTMLElement | null) || document.getElementById('root');

  if (!container) return null;

  // If container has data-attributes for configuration, prefer those when options not explicitly provided
  if (container && container instanceof HTMLElement) {
    try {
      const ds = (container as HTMLElement).dataset;
      if (ds.character && !options.character) options.character = ds.character;
      if (ds.animate && options.animate === undefined) {
        options.animate = ds.animate === 'true';
      }
    } catch (e) {
      // ignore dataset read errors
    }
  }

  // Get the component based on type
  const Component = componentMap[options.widget || 'default'
  ] || GreetingComponent;

  const root = createRoot(container);
  root.render(<Component {...options} />);

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