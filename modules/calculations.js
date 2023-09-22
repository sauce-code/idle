import { rules } from "./rules.js";

/**
 * Calculates the current income of a building
 * @param {number} building index of the building
 * @returns calculated income
 */
export function calcBuildingIncome(building) {
    return rules.buildingIncomeBase * (rules.buildingIncomeFactor ** building);
}

/**
 * Calculates the cost of a given building.
 * @param {number} building index of the building
 * @param {number} count count of existing buildings of that kind
 * @returns calculated cost
 */
export function calcBuildingCost(building, count) {
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
export function calcUpgradeCost(building, upgrade) {
    return calcBuildingCost(building, upgrade * rules.buildingUpgradeRequiredBuildings) * rules.buildingUpgradeCostFactor;
}