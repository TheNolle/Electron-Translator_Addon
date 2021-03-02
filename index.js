// Modules
const path = require("path");
const { app, shell, BrowserWindow } = require("electron");

// Globale Variables
var mainWindow;

// Main Window Creation
function createWindow() {
  mainWindow = new BrowserWindow({
    title: "TheNolle's Electron Translator",
    width: 1159,
    height: 626,
    frame: false,
    icon: "assets/img/logo.png",
    webPreferences: {
      devTools: true,
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });

  // Loading "index.html"
  mainWindow.loadURL(path.join(__dirname, "index.html"));
}

// When app is ready, run following scripts:
app.whenReady().then(() => {
  // Main Window Creation
  createWindow();

  // Open <a> links in a new window on your main browser
  mainWindow.webContents.on("new-window", function (event, url) {
    event.preventDefault();
    shell.openExternal(url);
  });

  // When app launched, allow Window Creation
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// When every windows are closed, kill the app
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});