var langMap = new Map(); // New map for all langs
const fs = require('fs');

function initLang() {

    const langFiles = fs.readdirSync('./translator/langs/').filter(file => file.endsWith('.json')); //Get all langs files .json

    var langSelect = document.getElementById("lang-select");
    var langNumber = 0;
    var length = langSelect.options.length;
    for (i = length - 1; i >= 0; i--) {
        langSelect.options[i] = null; //Clear all option
    }
    for (const file of langFiles) { //Execute for each lang file
        langNumber++;
        const lang = require('./translator/langs/' + file);
        var option = document.createElement('option'); //Create the option
        option.text = lang.name; //Set option
        langSelect.add(option); //Add the option
        langMap.set(lang.name, file);
    }
    if (localStorage.getItem('lang') && localStorage.getItem('lang-file')) { // if have localstorage

        document.getElementById('lang-select').value = localStorage.getItem('lang'); // Set selector option to the lang selected
        const fs = require('fs');
        fs.readFile('./translator/langs/' + localStorage.getItem("lang-file"), 'utf8', (err, data) => { // Read the lang file selectioned
            if (err) {
                console.error(err) // Log if have a error
                return
            }
            const file = JSON.parse(data); // Parse the json
            traduction("MojangLoginTitle", file.MojangLoginTitle);
            traduction("RememberMeLabel", file.RememberMeLabel);
            traduction("ConnexionButton", file.ConnexionButton);
        })
    }
}

function validateLang() { // When button done is pressed
    const langSelect = document.getElementById("lang-select"); // Get selector
    localStorage.removeItem('lang'); // Clear localstorage
    localStorage.removeItem('lang-file'); // Clear localstorage
    localStorage.setItem('lang', langSelect.value); // Add the lang name at localstorage
    localStorage.setItem('lang-file', langMap.get(langSelect.value)); // Add the lang name at localstorage
    console.log(localStorage.getItem('lang')); // Log to console
    console.log(localStorage.getItem('lang-file')); // Log to console
    initLang() //Re init for save change
}

function traduction(id, key) {
    document.getElementById(id).innerHTML = key;
}