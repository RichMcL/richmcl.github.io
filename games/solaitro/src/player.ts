import { Card, RenderConfig } from './types';
import { buildAndShuffleDeck } from './util';

export class Player {
    hand: Card[];
    handIndex: number;

    renderConfig: RenderConfig = {
        coordinates: {
            x: 585,
            y: 460
        },
        size: {
            width: 71,
            height: 95
        },
        scale: 1.5
    };

    constructor() {
        this.hand = buildAndShuffleDeck(true);
        this.handIndex = 0;
    }

    getCurrentCard(): Card {
        return this.hand[this.handIndex];
    }

    hit(): void {
        this.handIndex += 3;

        if (this.handIndex >= this.hand.length) {
            this.handIndex = this.handIndex - this.hand.length;
        }
    }

    removeTopCard(): void {
        this.hand.splice(this.handIndex, 1);

        if (this.handIndex === 0) {
            this.handIndex = 2;
        } else {
            this.handIndex--;
        }
    }
}
