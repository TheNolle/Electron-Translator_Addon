const electronapp = require("electron").remote.app;
const fs = require('fs');

const languageMap = new Map();

const DEFAULT_OR_FALLBACK_LANGUAGE = "english";

var selectedLanguage = DEFAULT_OR_FALLBACK_LANGUAGE;

document.onload = initLanguageManager();

/**
 * Called when the language manager is loaded
 */
function initLanguageManager() {
    console.log("initLanguageManager() called");
    if (localStorage.getItem("selected_language") != null) {
        selectedLanguage = localStorage.getItem("selected_language");
    }

    readDefaultLanguageFiles();
    translateElements();
}

/**
 * Read the launchers language files
 */
function readDefaultLanguageFiles() {
    readLangFiles(electronapp.getAppPath() + '/translator/langs/');
}

/**
 * Read all language files in a directory
 * @param {s} path The folder to read language files from
 */
function readLangFiles(path) {
    console.log("Reading language files from " + path);
    let langFiles = fs.readdirSync(path).filter(file => file.endsWith('.json'));

    for (let i in langFiles) {
        let file = langFiles[i];
        let fileContent = fs.readFileSync(path + "/" + file, 'utf8');

        let content = JSON.parse(fileContent);

        let langData = null;

        if (languageMap[content.name] == undefined) {
            if(content.name == undefined) {
                console.error("Languge file " + file + " is missing the property: name. It wont be loaded until this is fixed");
                continue;
            }

            if(content.display_name == undefined) {
                console.error("Languge file " + file + " is missing the property: display_name. It wont be loaded until this is fixed");
                continue;
            }

            langData = {
                "name": content.name,
                "display_name": content.display_name,
                "content": {}
            };
        } else {
            langData = languageMap[content.name];
        }

        for (let key in content.content) {
            langData.content[key] = content.content[key];
        }

        languageMap[content.name] = langData;
    }

    updateLanguageSelector();
}

/**
 * Add all languages to the dropdown
 */
function updateLanguageSelector() {
    console.log("Updating language selector");
    let langSelect = document.getElementById("lang-select");
    let length = langSelect.options.length;

    for (let i = length - 1; i >= 0; i--) {
        langSelect.options[i] = null;
    }

    // Sort the languages before adding them to the list

    let languages = [];

    for (let key in languageMap) {
        languages.push(languageMap[key]);
    }

    languages.sort((a, b) => a.display_name.localeCompare(b.display_name));

    for (let i in languages) {
        let language = languages[i];

        let opt = document.createElement('option');

        opt.innerText = language.display_name;
        opt.value = language.name;

        langSelect.add(opt);
    }

    langSelect.value = selectedLanguage;
}

/**
 * Translate all elements with the provided class or with the class translate if no class was provided
 * 
 * @param {string} className The name of the class to translate
 */
function translateElements(className = "translate") {
    let elements = document.getElementsByClassName(className);

    for (let i = 0; i < elements.length; i++) {
        let element = elements[i];

        let dataLangNode = element.dataset["langNode"];

        if (dataLangNode == undefined) {
            console.warn("Element " + element + " has translate class but no lang-node data. Please add data-lang-node=\"NODE_NAME_HERE\" for the translator to work");
            continue; // continue to the next element since this one is not configured
        }

        let translatedText = translate(dataLangNode);

        element.innerHTML = translatedText;
    }
}

/**
 * Get the translation from a language node
 * 
 * @param {string} node The language node to get
 * @param {boolean} use_fallback Set to true to use fallback language on failure
 * @param {string} language_to_use The language to translate from
 * @returns Translated string
 */

function translate(node, use_fallback = true, language_to_use = null) {
    let language = languageMap[language_to_use != null ? language_to_use : selectedLanguage];

    if (language == undefined) {
        if (use_fallback) {
            console.warn("Trying to get fallback translation for node " + node + " since the language " + selectedLanguage + " could not be found");
            return translate(node, false, DEFAULT_OR_FALLBACK_LANGUAGE);
        }
        return node;
    } else {
        let content = language.content[node];

        if (content == undefined) {
            if (use_fallback) {
                console.warn("Trying to get fallback translation for node " + node + " since the language " + selectedLanguage + " does not contain a translation for that node");
                return translate(node, false, DEFAULT_OR_FALLBACK_LANGUAGE);
            }
        } else {
            return content;
        }

        return node;
    }
}

/**
 * Called when the language dropdown changes
 */
function updateSelectedLanguage() {
    let langSelect = document.getElementById("lang-select");
    selectedLanguage = langSelect.value;

    console.log(selectedLanguage);

    localStorage.removeItem('selected_language');
    localStorage.setItem('selected_language', selectedLanguage);

    translateElements();
}