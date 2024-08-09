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

export const drawCard = (
    ctx: CanvasRenderingContext2D,
    cardFaceSpriteSheet: HTMLImageElement,
    cardBackSpriteSheet: HTMLImageElement,
    card: Card,
    x: number,
    y: number,
    cardScale = 1
): void => {
    const cardWidth = 71; // Width of a single card in the sprite sheet
    const cardHeight = 95; // Height of a single card in the sprite sheet

    let sy = 0;
    let sx = 0;

    switch (card.suit) {
        case Suit.Hearts:
            sy = cardHeight * 0;
            break;
        case Suit.Clubs:
            sy = cardHeight * 1;
            break;
        case Suit.Diamonds:
            sy = cardHeight * 2;
            break;
        case Suit.Spades:
            sy = cardHeight * 3;
            break;
    }

    switch (card.value) {
        case CardValue.Two:
            sx = cardWidth * 0;
            break;
        case CardValue.Three:
            sx = cardWidth * 1;
            break;
        case CardValue.Four:
            sx = cardWidth * 2;
            break;
        case CardValue.Five:
            sx = cardWidth * 3;
            break;
        case CardValue.Six:
            sx = cardWidth * 4;
            break;
        case CardValue.Seven:
            sx = cardWidth * 5;
            break;
        case CardValue.Eight:
            sx = cardWidth * 6;
            break;
        case CardValue.Nine:
            sx = cardWidth * 7;
            break;
        case CardValue.Ten:
            sx = cardWidth * 8;
            break;
        case CardValue.Jack:
            sx = cardWidth * 9;
            break;
        case CardValue.Queen:
            sx = cardWidth * 10;
            break;
        case CardValue.King:
            sx = cardWidth * 11;
            break;
        case CardValue.Ace:
            sx = cardWidth * 12;
            break;
    }

    ctx.drawImage(
        cardBackSpriteSheet,
        71,
        0,
        cardWidth,
        cardHeight,
        x,
        y,
        cardWidth * cardScale,
        cardHeight * cardScale
    );

    ctx.drawImage(
        cardFaceSpriteSheet,
        sx,
        sy,
        cardWidth,
        cardHeight,
        x,
        y,
        cardWidth * cardScale,
        cardHeight * cardScale
    );
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
