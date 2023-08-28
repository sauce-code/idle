import { initTableBuildings, updatePrices, startLoop, readCookie, writeCookie, clickThing, deleteCookie, reset, loopAutosave, rules, data, setTableVisibility } from './modules/game.js';

initTableBuildings();
updatePrices();
startLoop();
readCookie();
window.addEventListener("beforeunload", function () { writeCookie() });
setInterval(loopAutosave, rules.saveInterval);
document.getElementById("buttonSave").onclick = writeCookie;
document.getElementById("buttonLoad").onclick = readCookie;
document.getElementById("buttonDelete").onclick = deleteCookie;
document.getElementById("buttonReset").onclick = reset;
document.getElementById("clickImage").onclick = clickThing;
document.getElementById("tableBuildingsRow" + 0)
setTableVisibility();
