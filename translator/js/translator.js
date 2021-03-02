// We need electron to determine the root directory of the app
let electronapp = require("electron").remote.app;

const langMap = new Map(); // New map for all langs
const fs = require('fs');

/**
 * To use this translator add the class translate to the elements and add data-lang-node="NODE_NAME_HERE".
 * The final element should look something like this:
 * <span class="translate" data-lang-node="hello_world">Hello World</span>
 * And the language file should look like this:
 * {
 *  "name": "English"
 *  "content": {
 *    "hello_world": "Hello World"
 *  }
 * }
 */

function initLang() {
    // we use electronapp.getAppPath() + '/translator/langs/' to get the language files from anywhere in the app
    let langFiles = fs.readdirSync(electronapp.getAppPath() + '/translator/langs/').filter(file => file.endsWith('.json')); //Get all langs files .json

    let langSelect = document.getElementById("lang-select");
    let langNumber = 0;
    let length = langSelect.options.length;
    for (i = length - 1; i >= 0; i--) {
        langSelect.options[i] = null; //Clear all option
    }
    for (let file of langFiles) { //Execute for each lang file
        langNumber++;
        let lang = require(electronapp.getAppPath() + '/translator/langs/' + file);
        let option = document.createElement('option'); //Create the option
        option.text = lang.name; //Set option
        langSelect.add(option); //Add the option
        langMap.set(lang.name, file);
    }
    if (localStorage.getItem('lang') && localStorage.getItem('lang-file')) { // if have localstorage

        document.getElementById('lang-select').value = localStorage.getItem('lang'); // Set selector option to the lang selected
        fs.readFile(electronapp.getAppPath() + '/translator/langs/' + localStorage.getItem("lang-file"), 'utf8', (err, data) => { // Read the lang file selectioned
            if (err) {
                console.error(err) // Log if have a error
                return
            }
            let file = JSON.parse(data); // Parse the json

            // get all elements with the translate class
            let toTranslate = document.getElementsByClassName("translate");

            // loop thru them
            for (let i = 0; i < toTranslate.length; i++) {
                // get each element
                let elem = toTranslate[i];

                let dataLangNode = elem.dataset["langNode"];

                if (dataLangNode == undefined) {
                    console.warn("Element " + elem.id + " has translate class but no lang-node data. Please add data-lang-node=\"NODE_NAME_HERE\" for the translator to work");
                    continue; // continue to the next element since this one is not configured
                }

                let translatedText = file.content[dataLangNode];

                // Check if the language node exists
                if (translatedText == undefined) {
                    console.warn("Could not find language node " + dataLangNode + " in " + localStorage.getItem("lang-file"));
                    continue; // continue to the next node since there is not translation for this one
                }

                //console.log("element " + elem.id + " with data-lang-node set to " + dataLangNode + " should be translated to " + file[elem.id]); // for debugging
                elem.textContent = translatedText; // prevent xss exploits by using textContent instead of innerHTML
            }
        });
    }
}

function validateLang() { // When button done is pressed
    let langSelect = document.getElementById("lang-select"); // Get selector
    localStorage.removeItem('lang'); // Clear localstorage
    localStorage.removeItem('lang-file'); // Clear localstorage
    localStorage.setItem('lang', langSelect.value); // Add the lang name at localstorage
    localStorage.setItem('lang-file', langMap.get(langSelect.value)); // Add the lang name at localstorage
    console.log(localStorage.getItem('lang')); // Log to console
    console.log(localStorage.getItem('lang-file')); // Log to console
    initLang() //Re init for save change
}