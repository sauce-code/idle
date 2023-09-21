import { write, read, erase } from './cookie.js';

/**
 * Stores all important data that describes a player's progress.
 */
let data;

/**
 * Stores all data that can be calculated by the data field to save unnecessary operations.
 */
let buffer;

/**
 * Describes all buildings and thir upgrades in the game.
 */
const buildings = [
    {
        name: "Obdachloser",
        namePlural: "Obdachlose",
        upgrades: [
            "Vodka",
            "Agressives Betteln",
            "Handschuhe",
            "Sicherheitsflipflops",
            "'ne Mark",
            "Crack",
            "Obdachlosenheim",
            "Kaffee",
            "Schlafsack",
            "Br&uuml;cke",
            "Bahnhof",
            "Stammplatz",
            "Netto",
            "Hund",
            "Polizeieskorte",
            "lorem ipsum",
            "lorem ipsum",
            "lorem ipsum",
            "lorem ipsum",
            "lorem ipsum",
        ]
    },
    {
        name: "Festivalg&auml;nger",
        namePlural: "Festivalg&auml;nger",
        upgrades: [
            "Happiness-Ticket",
            "Auto",
            "Wacken-Ticket",
            "Trichter",
            "Zelt",
            "Sex",
            "Dreistheit",
            "Ritalin",
            "kein Schlaf",
            "fehlender Geruchssinn",
            "Dosenravioli",
            "Musikgeschmack",
            "Energy-Drinks",
            "pubert&auml;res Verhalten",
            "M&uuml;lls&auml;cke",
            "lorem ipsum",
            "lorem ipsum",
            "lorem ipsum",
            "lorem ipsum",
        ]
    },
    {
        name: "Pfandautomat",
        namePlural: "Pfandautomaten",
        upgrades: [
            "Breitere &ouml;ffnung",
            "Anti-Stau-System",
            "Schlaue Kunden",
            "Hilfsbereite Mitarbeiter",
            "Assembler",
            "Peitschen",
            "Diebstahlschutz",
            "Zweite &ouml;ffnung",
            "Deposit Droid",
            "Bottle Bounty Bot",
            "Can Credit Contraption",
            "Refund Robot",
            "Coin-Return Wizard",
            "Refundinator Machine",
            "Penny Pincher's Pal",
            "Empties Enchanter",
            "Token Treasure Trove",
            "Bottle Bucks Buddy",
        ],
    },
    {
        name: "Glascontainer",
        namePlural: "Glascontainer",
        upgrades: [
            "W&ouml;chentliche Leerung",
            "T&auml;gliche Leerung",
            "Zweiter Boden",
            "St&uuml;ndliche Leerung",
            "Besserer Standort",
            "Schwarzes Loch",
            "Glass Goblin Hideout",
            "Bottle Bank Bonanza",
            "Jar Jamboree",
            "Canister Carnival",
            "Pane Party Pitstop",
            "Clinker Collector's Corner",
            "Shatter Stopover Spot",
            "Mug Mingle Zone",
            "Pint Pot Parade Ground",
        ],
    },
    {
        name: "Supermarkt",
        namePlural: "Superm&auml;rkte",
        upgrades: [
            "Kinderarbeit",
            "Verbessertes Kassensystem",
            "Dumme Kunden",
            "Autobahnanbindung",
            "Manager",
            "Aisle Adventures",
            "Shopping Cart Shenanigans",
            "Checkout Line Comedy",
            "Cereal Aisle Surprises",
            "Frozen Food Follies",
            "Coupon Craziness",
            "Express Lane Exasperation",
            "Price Tag Perplexities",
            "Produce Section Peculiarities",
        ],
    },
    {
        name: "HaDiKo",
        namePlural: "HaDiKos",
        upgrades: [
            "GeMa",
            "Andr&eacute;",
            "i2",
            "K5 Bar",
            "K2 Hausfest",
            "K7",
            "Dormitory Drama",
            "Residence Hall Romp",
            "Roommate Roulette",
            "Common Area Capers",
            "Cafeteria Chronicles",
            "Launderette Lunacy",
            "Quiet Hours Quandary",
            "RA Revelations",
            "Freshman Follies",
        ],
    },
    {
        name: "M&uuml;lldeponie",
        namePlural: "M&uuml;lldeponien",
        upgrades: [
            "Rattenk&ouml;der",
            "Afrikaner",
            "fehlende Umweltauflagen",
            "Kipplader",
            "Abfallberg",
            "Schrottplatz",
            "M&uuml;llkippe",
            "Trash-Palast",
            "Deponie",
            "Kl&uuml;ngelhaufen",
            "Sammelsurium der Sinnlosigkeit",
            "Ressourcen-Resort",
            "Plastik-Paradies",
            "Unordnungs-Olympics",
        ],
    },
    {
        name: "Flaschenfabrik",
        namePlural: "Flaschenfabriken",
        upgrades: [
            "Produktionspapierwalze",
            "Zahnrad-Zentrale",
            "Fließband-Fieber",
            "Roboter-Rendezvous",
            "Qualm-Quelle",
            "Schrauben-Sinfonie",
            "Ziegelstein-Zauberei",
            "Fabrik-Fata Morgana",
            "Dampfmaschinen-Disco",
            "Rostiges R&auml;tselreich",
            "Montage-M&auml;rchenland",
            "Zylinder-Zirkus",
            "Schrauben-Spaßstation",
        ],
    },
    {
        name: "Panama",
        namePlural: "Panamas",
        upgrades: [
            "Strand voller Pfand",
            "Touristenf&uuml;hrer",
            "Panamapapier",
            "Panamakappe",
            "Panamarama",
            "Panamarama-Drama",
            "Panamadrama",
            "Panamabande",
            "Panamamama",
            "Panama-Hut",
            "Panama-Kanal",
            "Panamahose",
        ],
    },
    {
        name: "Ozean",
        namePlural: "Ozeane",
        upgrades: [
            "Plastiktitanik",
            "Wellenwirbel",
            "Meeresmonster",
            "Schatzsuche",
            "Gezeitengepl&auml;nkel",
            "Walfischtango",
            "Neptuns Spielplatz",
            "Muschelmagie",
            "Seegurken-Spuk",
            "Krakenkaraoke",
            "Pinguin-Poolparty",
        ],
    },
    {
        name: "Zweite Erde",
        namePlural: "Zweite Erden",
        upgrades: [
            "Doppelg&auml;nger-Planet",
            "Terra Dos",
            "Bizarro-Erde",
            "Erdling 2.0",
            "Erd-Zwo",
            "Die Andere Welt",
            "Erdopia",
            "Erde Deluxe",
            "Terra Zwei: Die R&uuml;ckkehr",
            "Planet Xerox",
        ],
    }
];

/**
 * Describes the rules, how the buildings in the game behave.
 */
const rules = {
    buildingIncomeBase: 0.1,
    buildingIncomeFactor: 9,
    buildingCostBase: 10,
    buildingCostFactorNextLvl: 31,
    buildingCostFactorSameLvl: 1.17,
    buildingUpgradeRequiredBuildings: 10,
    buildingUpgradeIncomeFactor: 2,
    buildingUpgradeCostFactor: 4,
    buildingUpgradeEntranceRequirement: 2,
}

/**
 * Describes all client-sided settings that do not affect the game logic.
 */
const settings = {
    locale: "de-DE",
    gameSpeedFactor: 1,
    intervalTick: 50,
    intervalSave: 10_000,
    digitThreshold: 10,
    buildingBuySteps: [1, 10, 20],
    cookieExpireDays: 365,
}

/**
 * A tick upgdates the current thing count and updates relevant UI that can be activated
 * by reaching certain thing counts.
 */
function tick() {
    updateThingCount();
    updateButtons();
}

/**
 * Triggers whenever the player clicks the image.
 */
function clickThing() {
    data.things += settings.gameSpeedFactor + buffer.tpsTotal;
    updateThingCount();
    updateButtons();
}

/**
 * Resets the whole game. Asks the player for permission first.
 */
function reset() {
    if (confirm("Are you sure? All progress will be lost!")) {
        // order matters here!
        resetData();
        resetBuffer();
        bufferUpgradePrices();
        erase();
        updateTps();
        updatePrices();
        updateThingCount();
        updateBuildingCount();
        updateButtons();
        updateTableBuildingsVisibility();
        updateTableUpgradesVisibility();
    }
}

/**
 * Calculates the current income of a building
 * @param {number} building index of the building
 * @returns calculated income
 */
function calcBuildingIncome(building) {
    return rules.buildingIncomeBase * (rules.buildingIncomeFactor ** building);
}

/**
 * Calculates the cost of a given building.
 * @param {number} building index of the building
 * @param {number} count count of existing buildings of that kind
 * @returns calculated cost
 */
function calcBuildingCost(building, count) {
    if (count === undefined) {
        return rules.buildingCostBase * (rules.buildingCostFactorNextLvl ** building);
    } else {
        return calcBuildingCost(building) * (rules.buildingCostFactorSameLvl ** count);
    }
}

/**
 * Calculates the cost of a building's upgrade.
 * @param {number} building index of the building
 * @param {number} upgrade index of the upgrade
 * @returns calculated upgrade cost
 */
function calcUpgradeCost(building, upgrade) {
    return calcBuildingCost(building, upgrade * rules.buildingUpgradeRequiredBuildings) * rules.buildingUpgradeCostFactor;
}

/**
 * Resets {@link data} to null values.
 */
function resetData() {
    data = {
        date: Date.now(),
        things: 0.0,
        buildings: new Array(buildings.length),
        upgrades: new Array(buildings.length),
    }
    for (let i = 0; i < buildings.length; i++) {
        data.buildings[i] = 0.0;
        data.upgrades[i] = new Array(buildings[i].upgrades.length);
        for (let j = 0; j < buildings[i].upgrades.length; j++) {
            data.upgrades[i][j] = false;
        }
    }
}

/**
 * Resets {@link buffer} to null values.
 */
function resetBuffer() {
    buffer = {
        tpsTotal: 0.0,
        tps: new Array(buildings.length),
        prices: new Array(buildings.length),
        upgrades: new Array(buildings.length),
        pricesUpgrades: new Array(buildings.length),
    }
    for (let i = 0; i < buildings.length; i++) {
        buffer.tps[i] = 0.0;
        buffer.upgrades[i] = 0.0;
        buffer.prices[i] = new Array(settings.buildingBuySteps);
        for (let j = 0; j < settings.buildingBuySteps; j++) {
            buffer.prices[i][j] = 0.0;
        }
        buffer.pricesUpgrades[i] = new Array(buildings[i].upgrades.length);
        for (let j = 0; j < buildings[i].upgrades.length; j++) {
            buffer.pricesUpgrades[i][j] = 0.0;
        }
    }
}

/**
 * Updates all of the UI's buttons' disabled property.
 */
function updateButtons() {
    for (let i = 0; i < buildings.length; i++) {
        for (let j = 0; j < settings.buildingBuySteps.length; j++) {
            document.getElementById("buy-" + i + "-" + j).disabled = (buffer.prices[i][j] > data.things);

        }
        for (let j = 0; j < buildings[i].upgrades.length; j++) {
            document.getElementById("upgrade-" + i + "-" + j).disabled = (buffer.pricesUpgrades[i][j] > data.things);
        }
    }
}

/**
 * Buys [{@link step}] [{@link building}s].
 * @param {number} building index of the building
 * @param {number} step index of the buy step
 */
function buy(building, step) {
    data.things -= buffer.prices[building][step];
    buffer.tpsTotal += calcBuildingIncome(building) * settings.buildingBuySteps[step];
    data.buildings[building] += settings.buildingBuySteps[step];
    updateBuildingsNameVisibility(building);
    updateThingCount();
    updateBuildingCount(building);
    updatePrices(building);
    updateTps();
    updateButtons();
    updateTableBuildingsVisibility(Math.min((building + 1), (buildings.length - 1)));
    updateTableUpgradesVisibility(building);
}

/**
 * Buys the {@link step}th upgrade of {@link building}.
 * @param {number} building index of the building
 * @param {number} step index of the upgrade
 */
function upgrade(building, step) {
    data.things -= calcUpgradeCost(building, step);
    data.upgrades[building][step] = true;
    buffer.upgrades[building]++;
    updateThingCount();
    updateTps();
    updateTableUpgradesVisibility(building, step);
}

/**
 * Updates the thing count based on how much time has passed and updates linked UI elements.
 */
function updateThingCount() {
    const now = Date.now();
    data.things += buffer.tpsTotal * settings.gameSpeedFactor * (now - data.date) / 1_000;
    data.date = now;
    document.getElementById("thingCount").innerHTML = format(data.things, false);
}

/**
 * Updates the current count of a building and updates linked UI elements. If {@link building}
 * is undefinded, this will be done for all buildings.
 * @param {number} building index of the building 
 */
function updateBuildingCount(building) {
    if (building === undefined) {
        for (let i = 0; i < buildings.length; i++) {
            updateBuildingCount(i);
        }
    } else {
        document.getElementById("buildingCount" + building).innerHTML = format(data.buildings[building]);
    }
}

/**
 * Updates the current prices of a building and updates linked UI elements. If {@link building}
 * is undefinded, this will be done for all buildings.
 * @param {number} building index of the building
 */
function updatePrices(building) {
    if (building === undefined) {
        for (let i = 0; i < buildings.length; i++) {
            updatePrices(i);
        }
    } else {
        for (let i = 0; i < settings.buildingBuySteps.length; i++) {
            let sum = 0;
            for (let j = 0; j < settings.buildingBuySteps[i]; j++) {
                sum += calcBuildingCost(building, data.buildings[building] + j);
            }
            buffer.prices[building][i] = sum;
        }
        document.getElementById("buildingCost" + building).innerHTML = format(buffer.prices[building][0]);
    }
}

/**
 * Updates the current income of a building and updates linked UI elements. If {@link building}
 * is undefined, this will be done for all buildings.
 * @param {number} building index of the building
 */
function updateTps(building) {
    if (building === undefined) {
        let sum = 0;
        for (let i = 0; i < buildings.length; i++) {
            updateTps(i);
            sum += buffer.tps[i];
        }
        buffer.tpsTotal = sum;
        document.getElementById("tpsTotal").innerHTML = format(buffer.tpsTotal);
    } else {
        buffer.tps[building] = data.buildings[building] * calcBuildingIncome(building) * rules.buildingUpgradeIncomeFactor ** buffer.upgrades[building];
        document.getElementById("tps" + building).innerHTML = format(buffer.tps[building]);
    }
}

/**
 * Formats a number based on {@link settings.locale}. If {@link showDecimalPlaces} and {@link number} 
 * &lt; {@link settings.digitThreshold}, decimal places will be shown.
 * @param {number} number the number to be formatted
 * @param {boolean} showDecimalPlaces true, if decimal places shall be shown
 * @returns the formatted number
 */
function format(number, showDecimalPlaces) {
    if (showDecimalPlaces === undefined) {
        return format(number, true);
    } else {
        if (showDecimalPlaces && number < settings.digitThreshold) {
            return number.toLocaleString(settings.locale);
        } else {
            return Math.floor(number).toLocaleString(settings.locale);
        }
    }
}

/**
 * Saves the current game state.
 */
function save() {
    write("data", JSON.stringify(data), settings.cookieExpireDays);
    console.log("saved gamestate");
}

/**
 * Loads the gamestate. If there is none, nothing will happen.
 */
function load() {
    const cookie = read("data");
    if (cookie === undefined) {
        console.log("no saved data to read");
    } else {
        // order matters here!
        data = JSON.parse(cookie);
        bufferUpgrades();
        updateTps();
        updatePrices();
        updateThingCount();
        updateBuildingCount();
        updateButtons();
        updateTableBuildingsVisibility();
        updateTableUpgradesVisibility();
        updateBuildingsNameVisibility();
        console.log("loaded gamestate");
    }
}

/**
 * Updates the visibility of a building. If {@link building} is undefined, this will be
 * done for all buildings.
 * @param {number} building index of the building 
 */
function updateBuildingsNameVisibility(building) {
    if (building === undefined) {
        for (let i = 0; i < buildings.length; i++) {
            updateBuildingsNameVisibility(i);
        }
    } else {
        if (data.buildings[building] > 0) {
            document.getElementById("buildingName" + building).innerHTML = buildings[building].name;
        } else {
            document.getElementById("buildingName" + building).innerHTML = "?????";
        }
    }
}

/**
 * Initializes the HTML child elements for table "buildings".
 */
function initTableBuildings() {
    for (let i = 0; i < buildings.length; i++) {
        const tr = document.createElement("tr");
        tr.id = "tableBuildingsRow" + i;
        tr.style.display = "none";
        {
            const td = document.createElement("td");
            td.id = "buildingName" + i;
            td.innerHTML = "?????";
            tr.appendChild(td);
        }
        {
            const td = document.createElement("td");
            td.id = "buildingCount" + i;
            td.classList.add("cell-number");
            td.innerHTML = data.buildings[i];
            tr.appendChild(td);
        }
        {
            const td = document.createElement("td");
            td.id = "tps" + i;
            td.classList.add("cell-number");
            td.innerHTML = buffer.tps[i];
            tr.appendChild(td);
        }
        {
            const td = document.createElement("td");
            td.id = "buildingCost" + i;
            td.classList.add("cell-number");
            td.innerHTML = calcBuildingCost(i, data.buildings[i]);
            tr.appendChild(td);
        }

        for (let j = 0; j < settings.buildingBuySteps.length; j++) {
            const td = document.createElement("td");
            {
                const input = document.createElement("input");
                input.id = "buy-" + i + "-" + j;
                input.type = "button";
                input.value = "buy " + settings.buildingBuySteps[j];
                input.disabled = true;
                input.onclick = function () { buy(i, j) }
                td.appendChild(input);
            }
            tr.appendChild(td);
        }
        document.getElementById("buildings").appendChild(tr);
    }
}

/**
 * Initializes the HTML child elements for table "upgrades".
 */
function initTableUpgrades() {
    for (let i = 0; i < buildings.length; i++) {
        for (let j = 0; j < buildings[i].upgrades.length; j++) {
            const tr = document.createElement("tr");
            tr.id = "tableUpgradesRow" + i + "-" + j;
            tr.style.display = "none";
            {
                const td = document.createElement("td");
                td.innerHTML = buildings[i].upgrades[j];
                tr.appendChild(td);
            }
            {
                const td = document.createElement("td");
                td.innerHTML = `${buildings[i].namePlural} arbeiten ${rules.buildingUpgradeIncomeFactor} mal so schnell.`
                tr.appendChild(td);
            }
            {
                const td = document.createElement("td");
                td.classList.add("cell-number");
                td.innerHTML = format(calcUpgradeCost(i, j));
                tr.appendChild(td);
            }
            {
                const td = document.createElement("td");
                {
                    const input = document.createElement("input");
                    input.id = "upgrade-" + i + "-" + j;
                    input.type = "button";
                    input.value = "buy";
                    input.disabled = true;
                    input.onclick = function () { upgrade(i, j) }
                    td.appendChild(input);
                }
                tr.appendChild(td);
            }
            document.getElementById("upgrades").appendChild(tr);
        }
    }
}

/**
 * Sets the visibility for a row in table buildings. Building 1 is always visible. Building 2+ are visible if their predecessor exists (min 1 building).
 * Sets all rows, if row is undefined.
 * 
 * @param {number} row desired row
 */
function updateTableBuildingsVisibility(row) {
    if (row === undefined) {
        document.getElementById("tableBuildingsRow0").style.display = "";
        for (let i = 1; i < buildings.length; i++) {
            updateTableBuildingsVisibility(i);
        }
    } else {
        if (data.buildings[row - 1] && row < buildings.length) {
            document.getElementById("tableBuildingsRow" + row).style.display = "";
        } else {
            document.getElementById("tableBuildingsRow" + row).style.display = "none";
        }
    }
}

/**
 * Updates the visibility of an upgrade HTML &lt;tr&gt; element. If {@link building}
 * is undefined, this will be done for all buildings. If {@link upgrade} is undefined,
 * this will be done for all upgrades of the corresponding building.
 * @param {number} building index of the building
 * @param {number} upgrade index of the upgrade
 */
function updateTableUpgradesVisibility(building, upgrade) {
    if (building === undefined) {
        for (let i = 0; i < buildings.length; i++) {
            for (let j = 0; j < buildings[i].upgrades.length; j++) {
                updateTableUpgradesVisibility(i, j);
            }
        }
    } else if (upgrade === undefined) {
        for (let j = 0; j < buildings[building].upgrades.length; j++) {
            updateTableUpgradesVisibility(building, j);
        }
    } else {
        if (!data.upgrades[building][upgrade] && data.buildings[building] >= Math.max(rules.buildingUpgradeEntranceRequirement, upgrade * rules.buildingUpgradeRequiredBuildings)) {
            document.getElementById("tableUpgradesRow" + building + "-" + upgrade).style.display = "";
        } else {
            document.getElementById("tableUpgradesRow" + building + "-" + upgrade).style.display = "none";
        }
    }
}

/**
 * Buffers the count of all upgrades that have been bought so far.
 */
function bufferUpgrades() {
    for (let i = 0; i < buildings.length; i++) {
        for (let j = 0; j < buildings[i].upgrades.length; j++) {
            if (data.upgrades[i][j]) {
                buffer.upgrades[i]++;
            }
        }
    }
}

/**
 * Buffers the prices of all upgrades that exist in the game.
 */
function bufferUpgradePrices() {
    for (let i = 0; i < buildings.length; i++) {
        for (let j = 0; j < buildings[i].upgrades.length; j++) {
            buffer.pricesUpgrades[i][j] = calcUpgradeCost(i, j);
        }
    }
}

/**
 * Initializes all fields, checks for existing savegame, links onclick events and prints all html elements.
 */
function init() {
    // order matters here!
    resetData();
    resetBuffer();
    bufferUpgradePrices();
    initTableBuildings();
    initTableUpgrades();
    updatePrices();
    load();
    updateTableBuildingsVisibility();
    updateTableUpgradesVisibility();
    setInterval(tick, settings.intervalTick);
    setInterval(save, settings.intervalSave);
    document.getElementById("buttonReset").addEventListener("click", function () { reset() });
    document.getElementById("clickImage").addEventListener("click", function () { clickThing() });
    window.addEventListener("beforeunload", function () { save() });
    console.log("executed init");
}

export { init }
