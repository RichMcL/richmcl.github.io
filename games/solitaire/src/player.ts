import { createDeckButton, createHitButton, GameButton } from './button';
import { CardAnimation } from './card-animation';
import { State } from './state';
import { Card, Coordinates, GameComponent, RenderConfig } from './types';
import {
    BASE_CARD_SCALE,
    buildAndShuffleDeck,
    CARD_HEIGHT,
    CARD_WIDTH,
    drawCard,
    drawCardBack,
    printText
} from './util';

const PlayerRenderConfig: RenderConfig = {
    coordinates: {
        x: 535,
        y: 560
    },
    size: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT
    },
    scale: BASE_CARD_SCALE
};

const DrawPileRenderConfig: RenderConfig = {
    coordinates: {
        x: 675,
        y: 560
    },
    size: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT
    },
    scale: BASE_CARD_SCALE
};

export class Player extends GameComponent {
    drawPile: Card[] = [];
    playPile: Card[] = [];
    startingShuffles = 3;
    shufflesRemaining = this.startingShuffles;
    cardAnimations: CardAnimation[] = [];

    playPileVisibleSize = 3;
    playPileDrawSize = 3;

    renderConfig: RenderConfig;

    buttons: GameButton[] = [];

    constructor() {
        super(PlayerRenderConfig.coordinates);
        this.drawPile = buildAndShuffleDeck(true);
        this.hit();

        console.log('player pile', this.playPile);

        this.renderConfig = PlayerRenderConfig;

        this.buttons.push(createHitButton());
        this.buttons.push(createDeckButton());
    }

    update(): void {
        this.cardAnimations.forEach(animation => animation.update());
        this.buttons.forEach(button => button.update());

        this.deleteDeadCardAnimations();
    }

    render(): void {
        // Render deck to represent draw pile
        for (let i = 3; i > 0; i--) {
            drawCardBack(
                DrawPileRenderConfig.coordinates.x + i * 5,
                DrawPileRenderConfig.coordinates.y + 5 * (i - 1),
                DrawPileRenderConfig.scale
            );
        }

        // Don't render the actual cards until they "land"
        let renderStartIndex = this.playPileVisibleSize - 1;
        let renderEndIndex = 0;

        if (this.cardAnimations.length > 0) {
            renderStartIndex += this.cardAnimations.length;
            renderEndIndex += this.cardAnimations.length;
        }

        //Render the top playPileVisibleSize cards of the play pile
        for (let i = renderStartIndex; i >= renderEndIndex; i--) {
            if (!this.playPile[i]) {
                continue;
            }

            drawCard(
                this.playPile[i],
                this.renderConfig.coordinates.x - (i - this.cardAnimations.length) * 45,
                this.renderConfig.coordinates.y,
                this.renderConfig.scale
            );
        }

        this.renderDrawPileSize();
        this.renderPlayPileSize();

        this.cardAnimations.forEach(animation => animation.render());
        this.buttons.forEach(button => button.render());
    }

    public renderPlayPileSize(): void {
        const fixedWidth = CARD_WIDTH * BASE_CARD_SCALE; // Define the fixed width
        const text = `[ ${this.playPile?.length} ]`;
        const textWidth = State.getCtx().measureText(text).width;
        const x = 495 + (fixedWidth - textWidth) / 2; // Calculate the x-coordinate to center the text

        printText(text, x, 745);
    }

    public renderDrawPileSize(): void {
        const fixedWidth = CARD_WIDTH * BASE_CARD_SCALE; // Define the fixed width
        const text = `[ ${State.getPlayer().shufflesRemaining} - ${this.drawPile?.length} ] `;
        const textWidth = State.getCtx().measureText(text).width;
        const x = 690 + (fixedWidth - textWidth) / 2; // Calculate the x-coordinate to center the text

        printText(text, x, 745);
    }

    getTopPlayCard(): Card {
        return this.playPile[0];
    }

    hit(): void {
        if (this.shufflesRemaining === 0 && this.drawPile.length === 0) {
            return;
        }

        if (this.drawPile.length === 0 && this.shufflesRemaining > 0) {
            this.drawPile = this.playPile;
            this.playPile = [];
            this.shufflesRemaining--;
        }

        //pop playPileStartingSize cards of the draw pile and add to the top of the stack
        let animationIndex = this.playPileDrawSize - 1;
        for (let i = 0; i < this.playPileDrawSize; i++) {
            const topOfDrawPile = this.drawPile.pop();

            if (topOfDrawPile) {
                this.playPile.unshift(topOfDrawPile);

                this.addCardAnimation(
                    new CardAnimation(
                        {
                            x: DrawPileRenderConfig.coordinates.x,
                            y: DrawPileRenderConfig.coordinates.y
                        },
                        {
                            x: PlayerRenderConfig.coordinates.x - animationIndex * 45,
                            y: PlayerRenderConfig.coordinates.y
                        },
                        topOfDrawPile,
                        15
                    )
                );
            }
            animationIndex--;
        }
    }

    removeTopPlayCard(): void {
        this.playPile.shift();
    }

    addCardAnimation(cardAnimation: CardAnimation): void {
        this.cardAnimations.push(cardAnimation);
    }

    deleteDeadCardAnimations(): void {
        this.cardAnimations = this.cardAnimations.filter(cardAnimation => !cardAnimation.deleteMe);
    }

    getCoordinatesCopy(): Coordinates {
        return { ...this.coordinates };
    }

    incrementPlayPileVisibleSize(): void {
        this.playPileVisibleSize++;
    }

    decrementPlayPileVisibleSize(): void {
        if (this.playPileVisibleSize === 0) {
            return;
        }

        this.playPileVisibleSize--;
    }

    incrementPlayPileDrawSize(): void {
        this.playPileDrawSize++;
    }

    decrementPlayPileDrawSize(): void {
        if (this.playPileDrawSize === 0) {
            return;
        }

        this.playPileDrawSize--;
    }

    incrementShuffles(): void {
        this.shufflesRemaining++;
    }

    decrementShuffles(): void {
        if (this.shufflesRemaining === 0) {
            return;
        }

        this.shufflesRemaining--;
    }
}
