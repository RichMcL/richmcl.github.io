import { Theme } from './theme';
import { printText } from './util';

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

export abstract class GameComponent {
    update(): void {}
    render(): void {}
    deleteMe = false;

    constructor(public ctx: CanvasRenderingContext2D, public coordinates: Coordindates) {}
}
