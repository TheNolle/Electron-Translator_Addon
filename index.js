// Importation des modules
const path = require("path");
const { app, ipcMain, shell, BrowserWindow } = require("electron");




// Variables globales
var mainWindow;




// Création de la fenêtre principale
function createWindow() {
  mainWindow = new BrowserWindow({
    title: "TheNolle's Realms 👑",
    icon: path.join(__dirname, "assets/img/global/logos/app-logo.png"),
    width: 1159,
    height: 626,
    frame: false,
    titleBarStyle: "hidden",
    webPreferences: {
      devTools: true,
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });

  // Chargement de la page "index.html"
  mainWindow.loadURL(path.join(__dirname, "index.html"));
}




// Quand l'application est chargée effectuer les scripts suivants:
app.whenReady().then(() => {
  // Créer la fenêtre
  createWindow();

  // Ouvrir les liens <a> dans une fenêtre de l'explorateur principal
  mainWindow.webContents.on("new-window", function (event, url) {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Autoriser la création de la fenêtre quand l'application est prête
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Si toutes les fenêtres sont fermées, quitter l'application
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
