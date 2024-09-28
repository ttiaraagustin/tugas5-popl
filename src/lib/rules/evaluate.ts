import data from "../../../public/asset/rules.json"

/**
 * Represents the results based on the rules evaluation.
 * @typedef {Object} RuleBasedResults
 * @property {string} condition - The condition's name.
 * @property {number} value - The number of symptoms matching the condition.
 */

export type RuleBasedResults = {
  [condition: string]: number;
};

/**
 * Represents the rules for symptom conditions.
 * @typedef {Object} SYMPTOM_CONDITION_RULES
 * @property {string} key - The condition's name.
 * @property {string[]} value - The list of symptoms associated with the condition.
 */


export type SYMPTOM_CONDITION_RULES = Record<string, string[]>;

export const SYMPTOM_CONDITION_RULES: SYMPTOM_CONDITION_RULES = data;

/**
 * Evaluate user's answers based on the defined rules.
 * 
 * @function
 * @param {string[]} answers - The list of symptoms selected by the user.
 * @returns {RuleBasedResults} - The results showing how many symptoms match each condition.
 */

export const evaluateRules = (answers: string[]): RuleBasedResults => {
  const rulesResults: RuleBasedResults = {};

  for (const condition in SYMPTOM_CONDITION_RULES) {
    if (SYMPTOM_CONDITION_RULES.hasOwnProperty(condition)) {
      const matchingSymptoms = SYMPTOM_CONDITION_RULES[condition].filter(
        (symptom) => answers.includes(symptom)
      );
      rulesResults[condition] = matchingSymptoms.length;
    }
  }

  return rulesResults;
};