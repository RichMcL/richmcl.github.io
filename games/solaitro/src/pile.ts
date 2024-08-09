import { Card, RenderConfig } from './types';

export const PilesRenderConfig: { [key: string]: RenderConfig } = {
    pile1: {
        x: 366.5,
        y: 70,
        width: 71,
        height: 95,
        scale: 1.5
    },

    pile2: {
        x: 513,
        y: 70,
        width: 71,
        height: 95,
        scale: 1.5
    },

    pile3: {
        x: 659.5,
        y: 70,
        width: 71,
        height: 95,
        scale: 1.5
    },

    pile4: {
        x: 806,
        y: 70,
        width: 71,
        height: 95,
        scale: 1.5
    }
};

export class Pile {
    cards: Card[];
    renderConfig: RenderConfig;
    isHovered: boolean;

    constructor(pileName: string) {
        this.cards = [];
        this.renderConfig = PilesRenderConfig[pileName];
    }

    getTopCard(): Card {
        return this.cards[this.cards.length - 1];
    }

    pushCard(card: Card): void {
        this.cards.push(card);
    }

    popCard(): Card {
        return this.cards.pop();
    }
}
