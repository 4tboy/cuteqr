# ✨ CuteQR — Creative QR Code Studio

A beautiful, local-first QR code generator and scanner built with **React + Vite + Electron**. Generate highly customized, styled QR codes with live preview, download them in PNG/SVG, and scan QR codes using your camera or uploaded images — all without any server or account.

---

## 🌟 Features

- **Multi-type QR Codes** — URL, Wi-Fi, vCard contact, plain text, and UPI payment
- **Full Aesthetic Customization** — dot shapes, corner styles, gradients, background color
- **Logo Embedding** — add your own image or a custom text badge to the center
- **Custom Color Picker** — with eyedropper tool and saved color presets
- **PNG / SVG Download** — dynamic filenames (e.g. `qr-wifi-MySSID.png`)
- **QR Scanner** — scan via webcam (live camera feed) or by uploading an image
- **QR History** — all generated codes stored locally in your browser
- **Electron Desktop App** — runs as a native window on Windows, no internet required

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)

### Run in the browser
```bash
npm run install:client   # install dependencies
npm run dev              # open http://localhost:3000
```

### Run as Electron desktop app
```bash
cd client
npm run electron:start
```

### Build Windows installer
```bash
cd client
npm run electron:build
# Output → client/dist-electron/
```

---

## 🗂️ Project Structure

```
cuteqr/
├── client/
│   ├── src/
│   │   ├── App.jsx                      # Main app UI & logic
│   │   ├── main.jsx                     # React entry point
│   │   ├── index.css                    # Global styles + Tailwind
│   │   └── components/
│   │       └── CustomColorPicker.jsx    # Color picker component
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── electron-main.cjs               # Electron main process
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── package.json                        # Root convenience scripts
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 19 |
| Styling | Tailwind CSS v3 + DaisyUI |
| QR Generation | `qr-code-styling` |
| QR Scanning | `html5-qrcode`, `@zxing/browser`, `jsqr` |
| Desktop Shell | Electron 34 |
| Build Tool | Vite 6 |
| Font | Quicksand (Google Fonts) |

---

## 📄 License

MIT — free to use, modify, and distribute.
