import { Theme } from './theme';
import { buildAndShuffleDeck, printText } from './util';

export interface Coordindates {
    x: number;
    y: number;
}

export enum Suit {
    Spades = 'Spades',
    Clubs = 'Clubs',
    Diamonds = 'Diamonds',
    Hearts = 'Hearts'
}

export enum SuitIcon {
    Spades = '♠',
    Clubs = '♣',
    Diamonds = '♦',
    Hearts = '♥'
}

export enum CardValue {
    Two = '2',
    Three = '3',
    Four = '4',
    Five = '5',
    Six = '6',
    Seven = '7',
    Eight = '8',
    Nine = '9',
    Ten = '10',
    Jack = 'J',
    Queen = 'Q',
    King = 'K',
    Ace = 'A'
}

export const CardNumericValue = {
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '10': 10,
    J: 11,
    Q: 12,
    K: 13,
    A: 14
};

export interface Card {
    suit: Suit;
    value: CardValue;
}

export const blackSuits = [Suit.Spades, Suit.Clubs];
export const redSuits = [Suit.Diamonds, Suit.Hearts];

export interface GameButton {
    id: string;
    text: string;
    fillColor: string;
    x: number;
    y: number;
    width: number;
    height: number;
    padding: number;
    isHovered?: boolean;
}

export interface ThemeButton extends GameButton {
    id: 'theme';
    text: '';
    theme: Theme;
}

export interface RenderConfig {
    x: number;
    y: number;
    width: number;
    height: number;
    scale: number;
}

export class Player {
    hand: Card[];
    handIndex: number;

    renderConfig: RenderConfig = {
        x: 585,
        y: 460,
        width: 71,
        height: 95,
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

export abstract class GameComponent {
    update(): void {}
    render(): void {}
    deleteMe = false;

    constructor(public ctx: CanvasRenderingContext2D, public coordinates: Coordindates) {}
}

export class ScoreGraphic extends GameComponent {
    public ttl: number = 60;
    public color = 'white';

    constructor(ctx: CanvasRenderingContext2D, coordinates: Coordindates, public score: number) {
        super(ctx, coordinates);
    }

    update(): void {
        this.ttl--;

        if (this.ttl <= 0) {
            this.deleteMe = true;
        }

        //start the color at white and fade to transparent
        const alpha = this.ttl / 60;
        this.color = `rgba(255, 255, 255, ${alpha})`;
    }

    render(): void {
        printText(
            this.ctx,
            `+${this.score}`,
            this.coordinates.x,
            this.coordinates.y,
            30,
            this.color
        );
    }
}
