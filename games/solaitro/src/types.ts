import { Theme } from './theme';
import { buildAndShuffleDeck } from './util';

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

export interface RenderedCard extends Card {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    scale?: number;
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
        this.hand = buildAndShuffleDeck();
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
