let data;

let buffer;

const buildings = [
    {
        name: "Obdachloser",
        namePlural: "Obdachlose",
        upgrades: ["Vodka", "Agressives Betteln", "Handschuhe", "Sicherheitsflipflops", "'ne Mark", "Obdachlosenheim", "Kaffee"],
    },
    {
        name: "Festivalgänger",
        namePlural: "Festivalgänger",
        upgrades: ["Auto", "Wacken-Ticket", "Trichter", "Zelt", "Dreistheit", "kein Schlaf", "fehlender Geruchssinn", "Dosenravioli"],
    },
    {
        name: "Pfandautomat",
        namePlural: "Pfandautomaten",
        upgrades: ["breitere Öffnung", "Anti-Stau-System", "schlaue Kunden", "tolle Mitarbeiter", "Assembler"],
    },
    {
        name: "Glascontainer",
        namePlural: "Glascontainer",
        upgrades: ["tägliche Leerung", "zweiter Boden", "stündliche Leerung", "besserer Standort", "schwarzes Loch"],
    },
    {
        name: "Supermarkt",
        namePlural: "Supermärkte",
        upgrades: ["Kinderarbeit", "verbessertes Kassensystem", "dumme Kunden", "Autobahnanbindung"],
    },
    {
        name: "M&uuml;lldeponie",
        namePlural: "M&uuml;lldeponien",
        upgrades: ["fehlende Umweltauflagen", "", ""],
    },
    {
        name: "Panama",
        namePlural: "Panamas",
        upgrades: ["lorem ipsum", "lorem ipsum", "lorem ipsum"],
    },
    {
        name: "Ozean",
        namePlural: "Ozeane",
        upgrades: ["lorem ipsum", "lorem ipsum", "lorem ipsum"],
    },
    {
        name: "Zweite Erde",
        namePlural: "Zweite Erden",
        upgrades: ["lorem ipsum", "lorem ipsum", "lorem ipsum"],
    }
];

const rules = {
    buildingIncomeBase: 0.1,
    buildingIncomeFactor: 8,
    buildingCostBase: 10,
    buildingCostFactorNextLvl: 13,
    buildingCostFactorSameLvl: 1.15,
    buildingUpgradeRequiredBuildings: 20,
    buildingUpgradeIncomeFactor: 2,
    buildingUpgradeCostFactor: 7,
    buildingUpgradeEntranceRequirement: 2,
    buildingBuySteps: [1, 10, 20],
}

const settings = {
    locale: "de-DE",
    gameSpeedFactor: 100,
    updateInterval: 50,
    intervalSave: 10_000,
}

let loopId;

function loop() {
    let now = new Date();
    data.things += buffer.tpsTotal * settings.gameSpeedFactor * (now - data.date) / 1_000;
    data.date = now;
    updateThingCount();
    updateButtons();
}

function startLoop() {
    loopId = setInterval(loop, settings.updateInterval);
}

function stopLoop() {
    clearInterval(loopId);
}

function loopAutosave() {
    if (document.getElementById("checkboxAutosave").checked) {
        writeCookie();
    }
}

function clickThing() {
    data.things += settings.gameSpeedFactor;
    updateThingCount();
    updateButtons();
}

function reset() {
    if (confirm("Are you sure?")) {
        resetData();
        resetBuffer();
        bufferUpgradePrices();
        deleteCookie();
        updateTps();
        updatePrices();
        updateThingCount();
        updateBuildingCount();
        updateButtons();
        updateTableBuildingsVisibility();
        updateTableUpgradesVisibility();
    }
}

function calcBuildingIncome(building) {
    return rules.buildingIncomeBase * (rules.buildingIncomeFactor ** building);
}

/**
 * Calculates the cost of a given building.
 * @param {number} building given building
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

function calcUpgradeCost(building, upgrade) {
    return calcBuildingCost(building, upgrade * rules.buildingUpgradeRequiredBuildings) * rules.buildingUpgradeCostFactor;
}

function resetData() {
    data = {
        date: null,
        things: 0,
        buildings: new Array(buildings.length),
        upgrades: new Array(buildings.length),
    }
    for (let i = 0; i < buildings.length; i++) {
        data.buildings[i] = 0;
        data.upgrades[i] = new Array(buildings[i].upgrades.length);
        for (let j = 0; j < buildings[i].upgrades.length; j++) {
            data.upgrades[i][j] = false;
        }
    }
}

function resetBuffer() {
    buffer = {
        tpsTotal: 0,
        tps: new Array(buildings.length),
        prices: new Array(buildings.length),
        upgrades: new Array(buildings.length),
        pricesUpgrades: new Array(buildings.length),
    }
    for (let i = 0; i < buildings.length; i++) {
        buffer.tps[i] = 0;
        buffer.upgrades[i] = 0;
        buffer.prices[i] = new Array(rules.buildingBuySteps);
        for (let j = 0; j < rules.buildingBuySteps; j++) {
            buffer.prices[i][j] = 0;
        }
        buffer.pricesUpgrades[i] = new Array(buildings[i].upgrades.length);
        for (let j = 0; j < buildings[i].upgrades.length; j++) {
            buffer.pricesUpgrades[i][j] = 0;
        }
    }
}

function updateButtons() {
    for (let i = 0; i < buildings.length; i++) {
        for (let j = 0; j < rules.buildingBuySteps.length; j++) {
            document.getElementById("buy-" + i + "-" + j).disabled = (buffer.prices[i][j] > data.things);

        }
        for (let j = 0; j < buildings[i].upgrades.length; j++) {
            document.getElementById("upgrade-" + i + "-" + j).disabled = (buffer.pricesUpgrades[i][j] > data.things);
        }
    }
}

function buy(building, step) {
    data.things -= buffer.prices[building][step];
    buffer.tpsTotal += calcBuildingIncome(building) * rules.buildingBuySteps[step];
    data.buildings[building] += rules.buildingBuySteps[step];
    revealBuildings(building);
    updateThingCount();
    updateBuildingCount(building);
    updatePrices(building);
    updateTps();
    updateButtons();
    updateTableBuildingsVisibility(Math.min((building + 1), (buildings.length - 1)));
    updateTableUpgradesVisibility(building);
}

function upgrade(building, step) {
    data.things -= calcUpgradeCost(building, step);
    data.upgrades[building][step] = true;
    buffer.upgrades[building]++;
    updateThingCount();
    updateTps();
    updateTableUpgradesVisibility(building, step);
}

function updateThingCount() {
    document.getElementById("thingCount").innerHTML = format(data.things);
}

function updateBuildingCount(building) {
    if (building === undefined) {
        for (let i = 0; i < buildings.length; i++) {
            updateBuildingCount(i);
        }
    } else {
        document.getElementById("buildingCount" + building).innerHTML = format(data.buildings[building]);
    }
}

function updatePrices(building) {
    if (building === undefined) {
        for (let i = 0; i < buildings.length; i++) {
            updatePrices(i);
        }
    } else {
        for (let i = 0; i < rules.buildingBuySteps.length; i++) {
            let sum = 0;
            for (let j = 0; j < rules.buildingBuySteps[i]; j++) {
                sum += calcBuildingCost(building, data.buildings[building] + j);
            }
            buffer.prices[building][i] = sum;
        }
        document.getElementById("buildingCost" + building).innerHTML = format(buffer.prices[building][0]);
    }
}

function updateTps(num) {
    if (num === undefined) {
        let sum = 0;
        for (let i = 0; i < buildings.length; i++) {
            updateTps(i);
            sum += buffer.tps[i];
        }
        buffer.tpsTotal = sum;
        document.getElementById("tpsTotal").innerHTML = format(buffer.tpsTotal);
    } else {
        buffer.tps[num] = data.buildings[num] * calcBuildingIncome(num) * rules.buildingUpgradeIncomeFactor ** buffer.upgrades[num];
        document.getElementById("tps" + num).innerHTML = format(buffer.tps[num]);
    }
}

function setDate() {
    data.date = Date().now();
    data.expires.setDate(Date.now() + 365);
}

function writeCookie() {
    data.date = Date.now();
    document.cookie = 'data=' + JSON.stringify(data) + '; SameSite=Strict; expires=Sun, Mo Jan 2024 12:00:00 UTC; path=/';
    console.log("wrote cookie");
}

function readCookie() {
    if (document.cookie === "") {
        console.log("no cookie to read");
    } else {
        data = JSON.parse(document.cookie.slice(document.cookie.indexOf("=") + 1));
        bufferUpgrades();
        updateTps();
        updatePrices();
        let timepassed = Date.now() - new Date(data.date);
        data.things += Math.floor((timepassed) / settings.updateInterval) * buffer.tpsTotal;
        updateThingCount();
        updateBuildingCount();
        updateButtons();
        updateTableBuildingsVisibility();
        updateTableUpgradesVisibility();
        revealBuildings();
    }
}

function revealBuildings(building) {
    if (building === undefined) {
        for (let i = 0; i < buildings.length; i++) {
            revealBuildings(i);
        }
    } else {
        if (data.buildings[building] > 0) {
            document.getElementById("buildingName" + building).innerHTML = buildings[building].name;
        }
    }
}

function deleteCookie() {
    document.cookie = 'data=; SameSite=Strict; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

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
            td.setAttribute("style", "text-align:right;");
            td.innerHTML = data.buildings[i];
            tr.appendChild(td);
        }
        {
            const td = document.createElement("td");
            td.id = "tps" + i;
            td.setAttribute("style", "text-align:right;");
            td.innerHTML = buffer.tps[i];
            tr.appendChild(td);
        }
        {
            const td = document.createElement("td");
            td.id = "buildingCost" + i;
            td.setAttribute("style", "text-align:right;");
            td.innerHTML = calcBuildingCost(i, data.buildings[i]);
            tr.appendChild(td);
        }

        for (let j = 0; j < rules.buildingBuySteps.length; j++) {
            const td = document.createElement("td");
            {
                const input = document.createElement("input");
                input.id = "buy-" + i + "-" + j;
                input.type = "button";
                input.value = "buy " + rules.buildingBuySteps[j];
                input.disabled = true;
                input.onclick = function () { buy(i, j) }
                td.appendChild(input);
            }
            tr.appendChild(td);
        }
        document.getElementById("buildings").appendChild(tr);
    }
}

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
                td.setAttribute("style", "text-align:right;");
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

function format(number) {
    if (number > 5) {
        return Math.floor(number).toLocaleString(settings.locale);
    } else {
        return number.toLocaleString(settings.locale);
    }
}

function updateTableUpgradesVisibility(building, step) {
    if (building === undefined) {
        for (let i = 0; i < buildings.length; i++) {
            for (let j = 0; j < buildings[i].upgrades.length; j++) {
                updateTableUpgradesVisibility(i, j);
            }
        }
    } else if (step === undefined) {
        for (let j = 0; j < buildings[building].upgrades.length; j++) {
            updateTableUpgradesVisibility(building, j);
        }
    } else {
        if (!data.upgrades[building][step] && data.buildings[building] >= Math.max(rules.buildingUpgradeEntranceRequirement, step * rules.buildingUpgradeRequiredBuildings)) {
            document.getElementById("tableUpgradesRow" + building + "-" + step).style.display = "";
        } else {
            document.getElementById("tableUpgradesRow" + building + "-" + step).style.display = "none";
        }
    }
}

function bufferUpgrades() {
    for (let i = 0; i < buildings.length; i++) {
        for (let j = 0; j < buildings[i].upgrades.length; j++) {
            if (data.upgrades[i][j]) {
                buffer.upgrades[i]++;
            }
        }
    }
}

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
    resetData();
    resetBuffer();
    bufferUpgradePrices();
    initTableBuildings();
    initTableUpgrades();
    updatePrices();
    startLoop();
    readCookie();
    window.addEventListener("beforeunload", function () { writeCookie() });
    setInterval(loopAutosave, settings.intervalSave);
    document.getElementById("buttonSave").onclick = writeCookie;
    document.getElementById("buttonLoad").onclick = readCookie;
    document.getElementById("buttonDelete").onclick = deleteCookie;
    document.getElementById("buttonReset").onclick = reset;
    document.getElementById("clickImage").onclick = clickThing;
    document.getElementById("tableBuildingsRow" + 0);
    updateTableBuildingsVisibility();
    updateTableUpgradesVisibility();
    console.log("executed init");
    // for (let i = 0; i < buildings.length; i++) {
    //     for (let j = 0; j < buildings[i].upgrades.length; j++) {
    //         console.log(`i${i} j${j} ${buffer.pricesUpgrades[i][j]}`)
    //     }
    // }
}

export { init }
