import { blackSuits, Card, CardNumericValue, CardValue, redSuits } from './types';

/**
 * For a move to be valid, any one rule must pass, but each requirement of that rule must pass
 * Rules are relative to the player's card to the pile. Ex. OneLower means the player's card must be one lower than the pile's card
 */
export interface Rule {
    name: string;
    description: string;
    rules: SingleRuleKey[];
    baseScore?: number;
    plusMultiplier?: number;
    timesMultiplier?: number;
    spriteXIndex?: number;
    spriteYIndex?: number;
}

export enum SingleRuleKey {
    free = 'free',
    oppositeColor = 'oppositeColor',
    sameColor = 'sameColor',
    sameSuit = 'sameSuit',
    sameValue = 'sameValue',
    oneLower = 'oneLower',
    oneHigher = 'oneHigher'
}

export enum RuleNames {
    klondike = 'klondike',
    reverseKlondike = 'reverseKlondike',
    flush = 'flush',
    free = 'free',
    sameValue = 'sameValue'
}

export const RuleFunctions: { [key: string]: (playerCard: Card, pileCard: Card) => boolean } = {
    [SingleRuleKey.free]: (playerCard: Card) => (playerCard ? true : false),

    [SingleRuleKey.oppositeColor]: (playerCard: Card, pileCard: Card) => {
        if (!playerCard || !pileCard) return false;

        if (blackSuits.includes(playerCard?.suit) && redSuits.includes(pileCard.suit)) {
            return true;
        }

        if (redSuits.includes(playerCard.suit) && blackSuits.includes(pileCard.suit)) {
            return true;
        }

        return false;
    },

    [SingleRuleKey.sameColor]: (playerCard: Card, pileCard: Card) => {
        if (!playerCard || !pileCard) return false;

        if (blackSuits.includes(playerCard?.suit) && blackSuits.includes(pileCard.suit)) {
            return true;
        }

        if (redSuits.includes(playerCard.suit) && redSuits.includes(pileCard.suit)) {
            return true;
        }

        return false;
    },

    [SingleRuleKey.sameSuit]: (playerCard: Card, pileCard: Card) => {
        if (!playerCard || !pileCard) return false;

        return playerCard.suit === pileCard.suit;
    },

    [SingleRuleKey.sameValue]: (playerCard: Card, pileCard: Card) => {
        if (!playerCard || !pileCard) return false;

        return playerCard.value === pileCard.value;
    },

    [SingleRuleKey.oneLower]: (playerCard: Card, pileCard: Card) => {
        if (!playerCard || !pileCard) return false;

        if (CardNumericValue[pileCard.value] - CardNumericValue[playerCard.value] === 1) {
            return true;
        }

        // Alows the pile to wrap
        if (pileCard.value === CardValue.Two && playerCard.value === CardValue.Ace) {
            return true;
        }

        return false;
    },

    [SingleRuleKey.oneHigher]: (playerCard: Card, pileCard: Card) => {
        if (!playerCard || !pileCard) return false;

        if (CardNumericValue[playerCard.value] - CardNumericValue[pileCard.value] === 1) {
            return true;
        }

        // Alows the pile to wrap
        if (pileCard.value === CardValue.Ace && playerCard.value === CardValue.Two) {
            return true;
        }

        return false;
    }
};

export const RuleInfo: { [key in RuleNames]: Rule } = {
    [RuleNames.free]: {
        name: 'Free',
        description: 'Everything is valid',
        rules: [SingleRuleKey.free],
        baseScore: 10,
        plusMultiplier: 1,
        timesMultiplier: 2,
        spriteXIndex: 2,
        spriteYIndex: 0
    },

    [RuleNames.flush]: {
        name: 'Flush',
        description: 'Same suit',
        rules: [SingleRuleKey.sameSuit],
        baseScore: 5,
        plusMultiplier: 1,
        timesMultiplier: 1,
        spriteXIndex: 3,
        spriteYIndex: 0
    },

    [RuleNames.klondike]: {
        name: 'Klondike',
        description: 'Opp. color and one lower',
        rules: [SingleRuleKey.oppositeColor, SingleRuleKey.oneLower],
        baseScore: 10,
        plusMultiplier: 1,
        timesMultiplier: 1,
        spriteXIndex: 1,
        spriteYIndex: 0
    },

    [RuleNames.reverseKlondike]: {
        name: 'Reverse Klondike',
        description: 'Opp. color and one higher',
        rules: [SingleRuleKey.oppositeColor, SingleRuleKey.oneHigher],
        baseScore: 10,
        plusMultiplier: 1,
        timesMultiplier: 1,
        spriteXIndex: 0,
        spriteYIndex: 0
    },

    [RuleNames.sameValue]: {
        name: 'Same Value',
        description: 'Same value',
        rules: [SingleRuleKey.sameValue],
        baseScore: 10,
        plusMultiplier: 1,
        timesMultiplier: 1,
        spriteXIndex: 4,
        spriteYIndex: 0
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

export const getAllPassingRules = (
    rulesNames: RuleNames[],
    playerCard: Card,
    pileCard: Card
): RuleNames[] => {
    return Object.values(rulesNames).filter(ruleName =>
        doesSingleRulePass(RuleInfo[ruleName], playerCard, pileCard)
    );
};

export const calculateScoreForRules = (rules: RuleNames[], streak: number): number => {
    const baseScore = rules.reduce((score, ruleName) => {
        return score + RuleInfo[ruleName].baseScore;
    }, 0);

    const plusMultiplier = rules.reduce((multiplier, ruleName) => {
        return multiplier + RuleInfo[ruleName].plusMultiplier;
    }, 0);

    const timesMultiplier = rules.reduce((multiplier, ruleName) => {
        return multiplier * RuleInfo[ruleName].timesMultiplier;
    }, 1);

    return baseScore * (plusMultiplier + streak) * timesMultiplier;
};
