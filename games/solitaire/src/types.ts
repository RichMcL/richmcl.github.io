import { State } from './state';
import { Theme } from './theme';

export interface Coordinates {
    x: number;
    y: number;
}

export interface Size {
    width: number;
    height: number;
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

export enum CardBack {
    Red = 'red',
    White = 'white',
    Gold = 'gold',
    Wild = 'wild'
}

export const CardBackCoordinates = {
    [CardBack.Red]: { x: 0, y: 0 },
    [CardBack.Wild]: { x: 1, y: 0 },
    [CardBack.White]: { x: 0, y: 1 },
    [CardBack.Gold]: { x: 1, y: 1 }
};

export interface Card {
    suit: Suit;
    value: CardValue;
}

export const blackSuits = [Suit.Spades, Suit.Clubs];
export const redSuits = [Suit.Diamonds, Suit.Hearts];

export interface RenderConfig {
    coordinates: Coordinates;
    size: Size;
    scale: number;
}

export abstract class GameComponent {
    update(): void {}
    render(coordinates?: Coordinates): void {}
    reset(): void {}

    renderConfig: RenderConfig;

    deleteMe = false;

    constructor(public coordinates: Coordinates) {}

    isHoveredOver(): boolean {
        const scaledMouseCoordinates = State.getScaledMouseCoordinates();

        return (
            scaledMouseCoordinates?.x >= this.renderConfig.coordinates.x &&
            scaledMouseCoordinates?.x <=
                this.renderConfig.coordinates.x +
                    this.renderConfig.size.width * this.renderConfig.scale &&
            scaledMouseCoordinates?.y >= this.renderConfig.coordinates.y &&
            scaledMouseCoordinates?.y <=
                this.renderConfig.coordinates.y +
                    this.renderConfig.size.height * this.renderConfig.scale
        );
    }

    isClicked(): boolean {
        return this.isHoveredOver() && (State.isMouseClick() || State.isGamepadButtonClick());
    }

    getCoordinatesCopy(): Coordinates {
        return { ...this.coordinates };
    }
}
