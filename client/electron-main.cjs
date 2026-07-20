const { app, BrowserWindow } = require('electron');
const path = require('path');

// app.isPackaged is the canonical way to detect packaged vs dev in Electron.
// In dev (electron:start), this is false. In a built portable/installer, it's true.
const isProd = app.isPackaged;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      // CRITICAL for production (file:// builds):
      // When loading via file:// protocol, origin is null. Without disabling webSecurity,
      // Chromium's CORS policy blocks same-directory asset loading, causing blank screens.
      // In dev mode we keep webSecurity ON since we load from localhost.
      webSecurity: !isProd,
    },
    autoHideMenuBar: true,
    show: false,
    backgroundColor: '#FFFDFE', // Match app background to prevent flash of white
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  if (!isProd) {
    // Dev mode: load from Vite dev server
    mainWindow.loadURL('http://localhost:3000').catch((err) => {
      console.error('Failed to load dev server URL:', err);
    });
    // Open DevTools in dev for debugging
    // mainWindow.webContents.openDevTools();
  } else {
    // Production mode: load from the built dist folder
    const distPath = path.join(__dirname, 'dist', 'index.html');
    mainWindow.loadFile(distPath).catch((err) => {
      console.error('Failed to load dist file:', err);
    });
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
