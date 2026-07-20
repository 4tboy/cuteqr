<div align="center">

<br />

```
  ██████╗██╗   ██╗████████╗███████╗ ██████╗██████╗ 
 ██╔════╝██║   ██║╚══██╔══╝██╔════╝██╔═══██╗██╔══██╗
 ██║     ██║   ██║   ██║   █████╗  ██║   ██║██████╔╝
 ██║     ██║   ██║   ██║   ██╔══╝  ██║   ██║██╔══██╗
 ╚██████╗╚██████╔╝   ██║   ███████╗╚██████╔╝██║  ██║
  ╚═════╝ ╚═════╝    ╚═╝   ╚══════╝ ╚═════╝ ╚═╝  ╚═╝
```

### **CuteQR Studio**
**Local-first, privacy-focused studio for generating & scanning stylized QR codes.**

<br />

[![Download Installer](https://img.shields.io/badge/⚡_Download_Setup-.exe_--_v1.0.0-FFB3D9?style=for-the-badge&logo=windows&logoColor=2C3E50)](https://github.com/4tboy/cuteqr/releases)
[![Download Portable](https://img.shields.io/badge/📦_Download_Portable-.exe_--_v1.0.0-B3E5FC?style=for-the-badge&logo=windows&logoColor=2C3E50)](https://github.com/4tboy/cuteqr/releases)

<br />

[![License](https://img.shields.io/badge/License-MIT-2C3E50?style=flat-square)](LICENSE)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev)
[![Electron](https://img.shields.io/badge/Electron-34.0-47848F?style=flat-square&logo=electron&logoColor=white)](https://electronjs.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

</div>

---

> **Why we built this:** Most online QR generators are ad-cluttered, track your data, or charge for basic styling. CuteQR is local-first, zero-telemetry, free, and beautiful by default.

---

### ✨ Key Features

- **Multi-Payload Generator**: Create QR codes for URLs, Wi-Fi auto-connect, vCards, Plain Text, and UPI payments (India).
- **Aesthetic Customization**: Full control over dot patterns, eye geometries, linear/radial gradients, and background colors.
- **Brand Embedding**: Embed central image logos or text badges with automatic contrast calculation.
- **Built-in Scanner**: Instant verification via webcam feed or image file upload (`html5-qrcode` & `jsqr`).
- **Local History**: Save, organize, and reuse QR presets locally without accounts or servers.
- **Dual Distribution**: Available as a web app or zero-dependency native Windows desktop application.

---

### 📥 Installation & Downloads

#### Pre-built Binaries (Windows)
Download pre-compiled executables from the [Releases](https://github.com/4tboy/cuteqr/releases) page:

- **Installer (`CuteQR-Setup-1.0.0.exe`)**: Full NSIS setup wizard with start menu shortcuts, desktop icon, and uninstall data preservation prompt.
- **Portable (`CuteQR-Portable-1.0.0.exe`)**: Standalone binary. Runs directly without installation.

#### Local Development
```bash
# Clone the repository
git clone https://github.com/4tboy/cuteqr.git
cd cuteqr

# Install dependencies & start dev server
npm run install:client
npm run dev

# Open http://localhost:3000
```

#### Desktop Build (Electron)
```bash
cd client
npm run electron:start   # Run desktop window in dev mode
npm run electron:build   # Package NSIS & Portable executables
```

---

### 🗂️ Project Structure

```
cuteqr/
├── client/                     # Application source
│   ├── src/
│   │   ├── App.jsx             # Core application & state logic
│   │   ├── main.jsx            # React 19 mount
│   │   ├── index.css           # Design tokens & Tailwind CSS
│   │   └── components/
│   │       └── CustomColorPicker.jsx  # Color picker with eyedropper
│   ├── public/
│   │   ├── logo.svg            # Vector branding logo
│   │   ├── favicon.svg         # Favicon asset
│   │   └── icons.svg           # Sprite icons
│   ├── build/                  # Packaging assets
│   │   ├── icon.ico            # Windows executable multi-res icon
│   │   ├── icon.png            # High-res 512x512 app icon
│   │   └── installer.nsh       # Custom NSIS uninstaller hook
│   ├── electron-main.cjs       # Electron main process
│   ├── vite.config.js          # Vite 6 config
│   ├── tailwind.config.js      # Tailwind & DaisyUI theme config
│   └── package.json            # Client dependencies & build scripts
├── .gitignore
├── README.md
└── package.json                # Root scripts
```

---

### 🛠️ Tech Stack

- **UI & Logic**: React 19, JSX
- **Styling**: Tailwind CSS v3, DaisyUI (cupcake theme)
- **QR Rendering**: `qr-code-styling`
- **QR Scanning**: `html5-qrcode`, `@zxing/browser`, `jsqr`
- **Desktop Shell**: Electron 34, `electron-builder`
- **Build Engine**: Vite 6

---

### 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Repository
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

### 🤍 Support & Donations

If CuteQR saves you time or serves your team, support the project:

- **PayPal**: [paypal.me/4tboy](https://www.paypal.com/paypalme/4tboy)
- **UPI (India)**: `ashahu@upi`

---

### 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
