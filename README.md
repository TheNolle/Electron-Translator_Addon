# TheNolle's Studios Launcher
### _Sample repository for the translator plugin_

<a href="https://TheNolle.com/Discord"><img src="https://www.thenolle.com/public_assets/img/banners/discord-banner.png" alt="TheNolle's Discord" width="200"/></a>

This repository is licensed under MIT License,
Please do not steal any of the code.

- This repository has been created to seek for help with the translator plugin
- See the problems listed under here
- 🎇 Thank you 🎇

## Issues

- When trying to translate multiple pages, the plugin doesn't work and doesn't show any error
- **index.html** is correctly translated into the different languages listed in **./translator/langs/<LANG>.json** when selecting it
- Even after separating the different translators into two separated files, it doesn't work at all
- I also tried using the same file to avoid code duplication, it still doesn't work

> *I tried averything but it still doesn't work, if you have any solutions please contact me here: [My Discord](https://TheNolle.com/Discord)*


### Here is the list of all the files that you should have to reproduce my plugin on an electron app
| HTML | CSS | JS | JSON |
| ------ | ------ | ------ | ------ |
| index.html | style.css | index.js | eng.json |
| connexion.html | body.css | connexion.js | fr.json |
|   | main.css | home.js | es.json |
|   | footer.css |   | sv.json |
|   | nav.css |   |   |
|   | popup.css |   |   |
|   | utils.css | utils-buttons.js |   |
|   | toast.css | toast.js |   |

> Note: `electron`, `electron-builder`, `path`, `shell` is required and not contained in this repository.

## License

MIT
