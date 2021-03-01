// Importation des modules
const path = require("path");
const { Client, Authenticator } = require("minecraft-launcher-core");
const { app, ipcMain, shell, BrowserWindow } = require("electron");
const fs = require("fs");




// Variables globales
var mainWindow;
var userAuth = null;
const launcher = new Client();




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




// Vérification du Mail et du Mot de Passe Mojang de l'utilisateur pour la connexion à "TheNolle's Realms"
ipcMain.on("mojang-login", (evt, data) => {
  Authenticator.getAuth(data.mail, data.pass)
    .then((auth) => {
      userAuth = auth;
      mainWindow.loadURL(path.join(__dirname, "pages/global/choose-app.html")).then(()=>{
        mainWindow.webContents.send('uuid', auth.uuid);
      });
    })
    .catch((err) => {
      mainWindow.webContents.send('loginError');
    })
});
// Déconnexion du joueur en cliquant "Disconnect"
ipcMain.on("logout", () => {
  if (userAuth != null) {
    Authenticator.invalidate(userAuth.access_token, userAuth.client_token);
    userAuth = null;
  }
});




// Lancer "TheNolle's Realms"
ipcMain.on("launch-realms", () => {
  if (userAuth != null) {
    let DataFolder = (process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share")) + "/TnStudios";
    console.log("APPDATA =" + DataFolder)
    if (!fs.existsSync(DataFolder)) {
      fs.mkdirSync(DataFolder);
    };
    let opts = {
      clientPackage: null,
      authorization: userAuth,
      root: DataFolder + "/Realms",
      version: {
        number: "1.16.5",
        type: "release"
      },
      memory: {
        max: "4G",
        min: "2G"
      }
    }

    launcher.launch(opts);
  }
});