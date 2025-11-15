import React from 'react'
import { createRoot } from 'react-dom/client'
import { GreetingComponent } from './greeting'

type WidgetType = 'greeting' | 'default';

interface WidgetConfig {
  type?: WidgetType;
  container?: HTMLElement | string;
  // options passed to the selected component
  options?: {
    character?: string;
    animate?: boolean;
  };
}

// Component map for selecting the appropriate subcomponent
const componentMap: Record<WidgetType, React.FC<any>> = {
  greeting: GreetingComponent,
  default: GreetingComponent, // default to greeting
};

// Mount API: allow programmatic mounting with component selection and options
export function mountScamducationWidget(config?: WidgetConfig | HTMLElement | string) {
  // Handle backward compatibility: if config is a string or HTMLElement, treat as container
  let containerOrSelector: HTMLElement | string | null = null;
  let widgetType: WidgetType = 'default';
  let options: { character?: string; animate?: boolean } = { character: 'scamuel', animate: true };

  if (config) {
    if (typeof config === 'string' || config instanceof HTMLElement) {
      containerOrSelector = config;
    } else if (typeof config === 'object' && config !== null) {
      containerOrSelector = config.container || null;
      widgetType = config.type || 'default';
      options = { ...options, ...(config.options || {}) };
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
  const Component = componentMap[widgetType] || GreetingComponent;

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