import React from "react"
import { createRoot } from "react-dom/client"
import { GreetingComponent } from "./Greeting"
import QRScamGame from "./Qr"
import { ScamsInYourArea } from "./ScamsInYourArea"

type WidgetType = "greeting" | "default" | "qr" | "scams-in-your-area"

interface WidgetOptions {
  character?: string
  animate?: boolean
  widgetType?: WidgetType
}

// Component map for selecting the appropriate subcomponent
const componentMap: Record<WidgetType, React.FC<any>> = {
  greeting: GreetingComponent,
  qr: QRScamGame,
  "scams-in-your-area": ScamsInYourArea,
  default: GreetingComponent,
}

// Mount API: allow programmatic mounting with component selection and options
export function mountScamducationWidget(config: HTMLElement | null) {
  if (!config) return null

  const options = (config.dataset || {}) as WidgetOptions

  // Get the component based on type
  const Component = componentMap[options.widgetType || "greeting"]

  const root = createRoot(config)
  root.render(<Component {...options} />)

  return {
    unmount: () => root.unmount(),
  }
}

// Attach to window for pages that want to call it directly
;(globalThis as any).mountScamducationWidget = mountScamducationWidget

// Auto-mount if a `#root` container exists on page
if (document.getElementById("root")) {
  const element = document.getElementById("root")
  mountScamducationWidget(element)
}
