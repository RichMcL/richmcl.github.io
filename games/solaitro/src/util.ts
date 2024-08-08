import { Card, CardValue, Suit } from './types';

export const cardValueToKey = (value: CardValue): string => {
    switch (value) {
        case CardValue.Two:
            return 'two';
        case CardValue.Three:
            return 'three';
        case CardValue.Four:
            return 'four';
        case CardValue.Five:
            return 'five';
        case CardValue.Six:
            return 'six';
        case CardValue.Seven:
            return 'seven';
        case CardValue.Eight:
            return 'eight';
        case CardValue.Nine:
            return 'nine';
        case CardValue.Ten:
            return 'ten';
        case CardValue.Jack:
            return 'jack';
        case CardValue.Queen:
            return 'queen';
        case CardValue.King:
            return 'king';
        case CardValue.Ace:
            return 'ace';
    }

    return '';
};

export const buildAndShuffleDeck = (shuffle = false): Card[] => {
    let deck: Card[] = [];

    for (const suit of Object.values(Suit)) {
        for (const value of Object.values(CardValue)) {
            deck.push({ suit, value });
        }
    }

    if (shuffle) {
        for (let i = 0; i < deck.length; i++) {
            const j = Math.floor(Math.random() * deck.length);
            const temp = deck[i];
            deck[i] = deck[j];
            deck[j] = temp;
        }
    }

    return deck;
};

export const printText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    fontSize = 20,
    color = 'white'
): void => {
    ctx.font = `${fontSize}px Balatro`;
    ctx.fillStyle = color;

    // Set shadow properties
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'; // Shadow color
    ctx.shadowBlur = 4; // Blur level
    ctx.shadowOffsetX = 2; // Horizontal offset
    ctx.shadowOffsetY = 2; // Vertical offset

    ctx.fillText(text, x, y);

    // Reset shadow properties to avoid affecting other drawings
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
};
