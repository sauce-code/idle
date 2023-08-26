let data = {
    things: 0,
    buildings: [0, 0, 0, 0, 0],
    upgrades: [0, 0, 0, 0, 0],
    date: null,
}

const buffer = {
    tpsTotal: 0,
    tps: [0, 0, 0, 0, 0],
    prices: [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]],
    isBuildingVisible: [true, false, false, false, false],
}

const rules = {
    speed: 1,
    rate: 1000,
    buildings: {
        count: 5,
        bonus: [1, 10, 100, 1_000, 10_000],
        cost: [10, 100, 1_000, 10_000, 100_000],
        names: ["Obdachloser", "Festivalg&auml;nger", "Supermarkt", "M&uuml;lldeponie", "Ozean"],
        costIncrement: .1,
        steps: [1, 10, 50]
    },
    upgrades: {
        step: 20,
        cost: [1_000, 10_000, 100_000, 1_000_000, 10_000_000],
        multiplier: 2,
    },
    saveInterval: 10_000,
}

let loopId;

let autosaveLoopId;

function loop() {
    data.things += buffer.tpsTotal * rules.speed;
    updateThingCount();
    updateButtons();
}

function startLoop() {
    loopId = setInterval(loop, rules.rate); //run this once every 1000ms
}

function stopLoop() {
    clearInterval(loopId);
}

function autosave(enabled) {
    if (enabled) {
        autosaveLoopId = setInterval(loop, rules.saveInterval);
    } else {
        clearInterval(autosaveLoopId);
    }
}

function clickThing() {
    data.things += rules.speed;
    updateThingCount();
    updateButtons();
}

function reset() {
    data = {
        things: 0,
        buildings: [0, 0, 0, 0, 0],
        upgrades: [0, 0, 0, 0, 0],
        date: null,
    }
    deleteCookie();
    updateTps();
    updatePrices();
    updateThingCount();
    updateBuildingCount();
    updateButtons();
}

function updateButtons() {
    for (let i = 0; i < rules.buildings.count; i++) {
        for (let j = 0; j < rules.buildings.steps.length; j++) {
            document.getElementById("buy-" + i + "-" + j).disabled = (buffer.prices[i][j] > data.things);
        }
    }
}

function buy(building, step) {
    data.things -= buffer.prices[building][step];
    buffer.tpsTotal += rules.buildings.bonus[building] * rules.buildings.steps[step];
    data.buildings[building] += rules.buildings.steps[step];
    updateThingCount();
    updateBuildingCount(building);
    updatePrices(building);
    updateTps();
    updateButtons();
}

function updateThingCount() {
    document.getElementById("thingCount").innerHTML = data.things;
}

function updateBuildingCount(building) {
    if (building === undefined) {
        for (let i = 0; i < rules.buildings.count; i++) {
            updateBuildingCount(i);
        }
    } else {
        document.getElementById("buildingCount" + building).innerHTML = data.buildings[building];
    }
}

function updatePrices(num) {
    if (num === undefined) {
        for (let i = 0; i < rules.buildings.count; i++) {
            updatePrices(i);
        }
    } else {
        for (let i = 0; i < rules.buildings.steps.length; i++) {
            let sum = 0;
            for (let j = 0; j < rules.buildings.steps[i]; j++) {
                sum += Math.floor(rules.buildings.cost[num] * ((1 + rules.buildings.costIncrement) ** (data.buildings[num] + j)));
            }
            buffer.prices[num][i] = sum;
        }
        document.getElementById("buildingCost" + num).innerHTML = buffer.prices[num][0];
    }
}

function updateUpgrades(num) {
    return;
}

function updateTps(num) {
    if (num === undefined) {
        let sum = 0;
        for (let i = 0; i < rules.buildings.count; i++) {
            updateTps(i);
            sum += buffer.tps[i];
        }
        buffer.tpsTotal = sum;
        document.getElementById("tpsTotal").innerHTML = buffer.tpsTotal;
    } else {
        buffer.tps[num] = data.buildings[num] * rules.buildings.bonus[num] * rules.upgrades.multiplier ** data.upgrades[num];
        document.getElementById("tps" + num).innerHTML = buffer.tps[num];
    }
}

function setDate() {
    data.date = Date().now();
    data.expires.setDate(Date.now() + 365);
}

function writeCookie() {
    data.date = Date.now();
    document.cookie = 'data=' + JSON.stringify(data) + '; SameSite=Strict; expires=Sun, Mo Jan 2024 12:00:00 UTC; path=/';
}

function readCookie() {
    if (document.cookie === "") {
        console.log("was empty");
    } else {
        console.log(document.cookie);
        data = JSON.parse(document.cookie.slice(document.cookie.indexOf("=") + 1));
        updateTps();
        updatePrices();
        let timepassed = Date.now() - new Date(data.date);
        console.log(timepassed);
        console.log(data.things);
        console.log(rules.rate);
        console.log(buffer.tps);
        data.things += Math.floor((timepassed) / rules.rate) * buffer.tpsTotal;
        console.log(data.things);
        updateThingCount();
        updateBuildingCount();
        updateButtons();
    }
}

function fillBuffer() {

    buffer.tps[num] = data.buildings[num] * rules.buildings.bonus[num] * rules.upgrades.multiplier ** data.upgrades[num];
    let sum = 0;
    for (let i = 0; i < rules.buildings.count; i++) {
        updateTps(i);
        sum += buffer.tps[i];
    }
    buffer.tpsTotal = sum;

    buffer.prices = 0;
}

function deleteCookie() {
    document.cookie = 'data=; SameSite=Strict; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

function initTableBuildings() {
    for (let i = 0; i < rules.buildings.count; i++) {

        const tr = document.createElement("tr");
        {
            const td = document.createElement("td");
            td.innerHTML = rules.buildings.names[i];
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
            td.innerHTML = Math.floor(rules.buildings.cost[i] * ((1 + rules.buildings.costIncrement) ** data.buildings[i]));
            tr.appendChild(td);
        }

        for (let j = 0; j < rules.buildings.steps.length; j++) {
            const td = document.createElement("td");
            {
                const input = document.createElement("input");
                input.id = "buy-" + i + "-" + j;
                input.type = "button";
                input.value = "buy " + rules.buildings.steps[j];
                input.disabled = true;
                input.onclick = function () { buy(i, j) }
                td.appendChild(input);
            }
            tr.appendChild(td);
        }
        document.getElementById("buildings").appendChild(tr);
    }

    function main() {
        initTableBuildings();
        updatePrices();
        startLoop();
        readCookie();
        window.addEventListener("beforeunload", function () {
            writeCookie();
        });
        setInterval(writeCookie, rules.saveInterval);
    }

}