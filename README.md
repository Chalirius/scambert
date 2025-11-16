# 🛡️ Scambert Widget

Interactive scam education widgets to help users identify and avoid common online scams. Built with React and designed to be easily embedded in any website.

## 🎯 Features

- **Multiple Widget Types**: Greeting cards, QR code scam simulator, area-based scam alerts, and interactive chatbot
- **Customizable Characters**: Configure different personas for varied educational contexts
- **Easy Integration**: Drop-in script tag or programmatic API
- **Lightweight**: Minimal dependencies, uses external React CDN

## Demo

Visit https://chalirius.github.io/scambert/bank-demo/login.html

## 🚀 Quick Start

### Installation

```bash
npm install scambert-widget
```

### Basic Usage

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Scam Education</title>
  </head>
  <body>
    <!-- Container for the widget -->
    <div id="root" data-widget-type="greeting" data-character="scambert"></div>

    <!-- Load Scambert Widget -->
    <script src="https://unpkg.com/scambert-widget@latest/dist/bundle.js"></script>
  </body>
</html>
```

## 📦 Widget Types

### Greeting Widget

A welcoming introduction to scam awareness.

```html
<div id="root" data-widget-type="greeting" data-character="scambert"></div>
```

### QR Scam Game

Interactive simulation of QR code phishing attempts.

```html
<div id="root" data-widget-type="qr" data-character="scambert"></div>
```

### Scams In Your Area

Location-aware scam alerts and warnings.

```html
<div
  id="root"
  data-widget-type="scams-in-your-area"
  data-character="scambert"
></div>
```

### Chatbot

Interactive conversational guide to identifying scams.

```html
<div id="root" data-widget-type="chatbot" data-character="advisor"></div>
```

## 🎨 Configuration Options

| Attribute          | Type   | Default      | Description               |
| ------------------ | ------ | ------------ | ------------------------- |
| `data-widget-type` | string | `"greeting"` | Type of widget to display |
| `data-character`   | string | `scambert`   | Character persona name    |

## 💻 Programmatic API

For more control, use the JavaScript API:

```html
<div id="my-widget"></div>

<script src="node_modules/scambert-widget/dist/bundle.js"></script>
<script>
  const widget = window.mountScamducationWidget(
    document.getElementById("my-widget")
  )

  // Later, if needed:
  // widget.unmount();
</script>
```

## 🔧 Development

### Prerequisites

- Node.js 16+
- npm or yarn

### Build from Source

```bash
# Clone the repository
git clone https://github.com/chalirius/scambert-widget.git
cd scambert-widget/widget

# Install dependencies
npm install

# Build the bundle
npm run build

# Output will be in dist/bundle.js
```

## 📄 License

MIT License - feel free to use in your educational projects!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🐛 Issues

Found a bug? Please [open an issue](https://github.com/chalirius/scambert-widget/issues) with:

- Widget type being used
- Browser and version
- Steps to reproduce
- Expected vs actual behavior

## 🙏 Acknowledgments

Built to educate users about common online scams and phishing attempts. Stay safe online!
