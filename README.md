<div align="center">

<img src="https://img.shields.io/badge/CuteQR-%E2%9C%A8%20Creative%20QR%20Studio-FFB3D9?style=for-the-badge&logo=qrcode&logoColor=white" alt="CuteQR Banner" />

<br/>

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white)
![Electron](https://img.shields.io/badge/Electron-34-47848F?style=flat-square&logo=electron&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-v3-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

<br/>

### ✨ Generate beautiful, customized QR codes — no account, no internet, no ads.

</div>

---

## 🎯 Why CuteQR?

Most QR generators are ugly, ad-heavy, or require you to sign up. **CuteQR runs 100% on your device** — your data never leaves your computer. It looks great, works instantly, and gives you full creative control over every pixel.

---

## 🌟 Features

| Feature | Details |
|---|---|
| 🔗 **URL QR** | Link to any website |
| 📶 **Wi-Fi QR** | Tap-to-connect for guests |
| 👤 **vCard QR** | Share contact info instantly |
| 💬 **Text QR** | Any plain text message |
| 💸 **UPI Payment QR** | Accept payments instantly (India) |
| 🎨 **Full Customization** | Dot shapes, gradients, corner styles |
| 🖼️ **Logo Embedding** | Add image or text badge to center |
| 🎨 **Color Picker** | Eyedropper + saved color presets |
| ⬇️ **PNG / SVG Export** | Smart filenames, crisp quality |
| 📷 **QR Scanner** | Webcam + image upload scanning |
| 🕐 **History** | All your QR codes saved locally |
| 🖥️ **Desktop App** | Electron native window (Windows) |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- npm (included with Node.js)

### Run in the browser
```bash
# 1. Install dependencies
npm run install:client

# 2. Start the app
npm run dev

# Open → http://localhost:3000
```

### Run as Electron desktop app
```bash
cd client
npm run electron:start
```

### Build Windows installer (.exe)
```bash
cd client
npm run electron:build
# Installer → client/dist-electron/
```

---

## 🗂️ Project Structure

```
cuteqr/
├── client/
│   ├── src/
│   │   ├── App.jsx                      # Main app (all tabs & logic)
│   │   ├── main.jsx                     # React entry point
│   │   ├── index.css                    # Global styles + Tailwind
│   │   └── components/
│   │       └── CustomColorPicker.jsx    # Color picker with eyedropper
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
| UI Framework | React 19 + JSX |
| Styling | Tailwind CSS v3 + DaisyUI (cupcake theme) |
| QR Generation | `qr-code-styling` |
| QR Scanning | `html5-qrcode` · `@zxing/browser` · `jsqr` |
| Desktop Shell | Electron 34 |
| Build Tool | Vite 6 |
| Font | Quicksand (Google Fonts) |

---

## ❤️ Support This Project

If CuteQR saved you time or made your day a little more beautiful, consider buying me a coffee! Every contribution keeps this project alive and improving. 🙏

<div align="center">

### 🇮🇳 UPI Payment (India)

**UPI ID: `ashahu@upi`**

> Scan the UPI QR or copy the ID into any UPI app (GPay, PhonePe, Paytm, etc.)

<br/>

### 🌍 PayPal (International)

[![Donate via PayPal](https://img.shields.io/badge/Donate-PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white)](https://www.paypal.com/paypalme/4tboy)

<br/>

_Even a small ☕ means a lot — thank you!_

</div>

---

## 📄 License

MIT — free to use, modify, and distribute.

---

<div align="center">
Made with ❤️ and a lot of ✨ by <a href="https://github.com/4tboy">4tboy</a>
</div>
