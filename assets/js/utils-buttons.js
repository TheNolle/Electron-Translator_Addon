// Importation des modules
const {remote} = require('electron')

// Variables globales
const win = remote.getCurrentWindow()

// Minimiser la fenêtre à la réception de l'event "minimizebtn"
document.getElementById('minimizebtn').addEventListener('click', () => {
    win.minimize();
});

// Maximiser la fenêtre à la réception de l'event "maximizebtn"
document.getElementById('maximizebtn').addEventListener('click', () => {
    if (win.isMaximized()) {
        win.unmaximize();
        var element = document.getElementById("maximizeicon");
        element.classList.remove("hiddenbtn");
        var element = document.getElementById("restoreicon");
        element.classList.add("hiddenbtn");
    } else {
        win.maximize();
        var element = document.getElementById("maximizeicon");
        element.classList.add("hiddenbtn");
        var element = document.getElementById("restoreicon");
        element.classList.remove("hiddenbtn");
    };
});

// Fermer la fenêtre à la réception de l'event "closebtn"
document.getElementById('closebtn').addEventListener('click', () => {
    win.close();
});