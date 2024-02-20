const fs = require('fs')
const { config } = require('process')
const configFile = require('./config.json')

// list all directories in the directory servapps and compile them in servapps.json

const servapps = fs.readdirSync('./servapps').filter(file => fs.lstatSync(`./servapps/${file}`).isDirectory())

let servappsJSON = []

for (const file of servapps) {
    const servapp = require(`./servapps/${file}/description.json`)
    servapp.id = file
    servapp.screenshots = [];
    servapp.icon = [];
    servapp.artefacts = {};

    // list all screenshots in the directory servapps/${file}/screenshots
    const screenshots = fs.readdirSync(`./servapps/${file}/screenshots`)
    for (const screenshot of screenshots) {
        servapp.screenshots.push(`https://the-head.github.io/cosmos-servapps/servapps/${file}/screenshots/${screenshot}`)
    }

    if (fs.existsSync(`./servapps/${file}/artefacts`)) {
        const artefacts = fs.readdirSync(`./servapps/${file}/artefacts`)
        for (const artefact of artefacts) {
            servapp.artefacts[artefact] = (`https://the-head.github.io/cosmos-servapps/servapps/${file}/artefacts/${artefact}`)
        }
    }

    servapp.icon = `https://the-head.github.io/cosmos-servapps/servapps/${file}/icon.png`
    servapp.compose = `https://the-head.github.io/cosmos-servapps/servapps/${file}/cosmos-compose.json`

    servappsJSON.push(servapp)
}

// add showcase
const _sc = ["Jellyfin", "Home Assistant", "Nextcloud"];
const showcases = servappsJSON.filter((app) => _sc.includes(app.name));

let apps = {
    "source": configFile.marketIndexUrl,
    "showcase": showcases,
    "all": servappsJSON
}

fs.writeFileSync('./servapps.json', JSON.stringify(servappsJSON, null, 2))
fs.writeFileSync('./index.json', JSON.stringify(apps, null, 2))

