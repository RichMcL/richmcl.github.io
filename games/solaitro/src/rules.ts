import { blackSuits, Card, CardNumericValue, redSuits } from './types';

/**
 * For a move to be valid, any one rule must pass, but each requirement of that rule must pass
 * Rules are relative to the player's card to the pile. Ex. OneLower means the player's card must be one lower than the pile's card
 */
export interface Rule {
    name: string;
    description: string;
    rules: SingleRuleKey[];
}

export enum SingleRuleKey {
    oppositeColor = 'oppositeColor',
    oneLower = 'oneLower'
}

export enum RuleNames {
    klondike = 'klondike'
}

export const RuleFunctions: { [key: string]: (playerCard: Card, pileCard: Card) => boolean } = {
    [SingleRuleKey.oppositeColor]: (playerCard: Card, pileCard: Card) => {
        if (blackSuits.includes(playerCard.suit) && redSuits.includes(pileCard.suit)) {
            return true;
        }

        if (redSuits.includes(playerCard.suit) && blackSuits.includes(pileCard.suit)) {
            return true;
        }

        return false;
    },

    [SingleRuleKey.oneLower]: (playerCard: Card, pileCard: Card) => {
        if (CardNumericValue[pileCard.value] - CardNumericValue[playerCard.value] === 1) {
            return true;
        }

        return false;
    }
};

export const RuleInfo: { [key in RuleNames]: Rule } = {
    [RuleNames.klondike]: {
        name: 'Klondike',
        description: 'Klondike rules',
        rules: [SingleRuleKey.oppositeColor, SingleRuleKey.oneLower]
    }
};

/**
 * For a single rule to pass, all requirements must pass
 */
export const doesSingleRulePass = (rule: Rule, playerCard: Card, pileCard: Card): boolean => {
    return rule.rules.every(ruleKey => RuleFunctions[ruleKey](playerCard, pileCard));
};

/**
 * For a move to be valid, only one rule must pass
 */
export const doesAnyRulePass = (
    ruleNames: RuleNames[],
    playerCard: Card,
    pileCard: Card
): boolean => {
    return ruleNames.some(ruleName => doesSingleRulePass(RuleInfo[ruleName], playerCard, pileCard));
};
