# ✨ CuteQR — Creative QR Code Studio

A beautiful, local-first QR code generator and scanner built with React + Vite + Electron. Generate highly customized, styled QR codes with live preview, download them in PNG/SVG, and scan QR codes using your camera or uploaded images — all without any server or account.

---

## 🌟 Features

- **Multi-type QR Codes** — URL, Wi-Fi, vCard contact, plain text, and UPI payment
- **Full Aesthetic Customization** — dot shapes, corner styles, gradients, background color
- **Logo Embedding** — add your own image or a custom text badge to the center
- **Custom Color Picker** — with eyedropper tool and saved color presets
- **PNG / SVG Download** — dynamic, context-aware filenames (e.g. `qr-wifi-MySSID.png`)
- **QR Scanner** — scan via webcam (live camera feed) or by uploading an image
- **QR History** — all generated codes stored locally in your browser
- **Electron Desktop App** — runs as a native window on Windows with no internet required

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)

### Run in the browser (web mode)
```bash
# From the project root
npm run install:client   # installs client dependencies
npm run dev              # starts Vite dev server at http://localhost:3000
```

### Run as an Electron desktop app
```bash
cd client
npm run electron:start
```

### Build the Electron installer (Windows)
```bash
cd client
npm run electron:build
# Output → client/dist-electron/
```

---

## 🗂️ Project Structure

```
Qr generate app/
├── client/                    # Frontend (React + Vite + Electron)
│   ├── src/
│   │   ├── App.jsx            # Main application (all tabs & logic)
│   │   ├── main.jsx           # React entry point
│   │   ├── index.css          # Global styles + Tailwind
│   │   └── components/
│   │       └── CustomColorPicker.jsx
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── electron-main.cjs      # Electron main process
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── package.json               # Root convenience scripts
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 19 + JSX |
| Styling | Tailwind CSS v3 + DaisyUI (cupcake theme) |
| QR Generation | `qr-code-styling` |
| QR Scanning | `html5-qrcode`, `@zxing/browser`, `jsqr` |
| Desktop Shell | Electron 34 |
| Build Tool | Vite 6 |
| Font | Quicksand (Google Fonts) |

---

## 📄 License

MIT — free to use, modify, and distribute.
