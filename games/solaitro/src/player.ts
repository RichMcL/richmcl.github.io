import { CardAnimation } from './card-animation';
import { Card, Coordinates, GameComponent, RenderConfig } from './types';
import { buildAndShuffleDeck, drawCard, drawCardBack, printText } from './util';

const PlayerRenderConfig: RenderConfig = {
    coordinates: {
        x: 535,
        y: 560
    },
    size: {
        width: 71,
        height: 95
    },
    scale: 1.5
};

const DrawPileRenderConfig: RenderConfig = {
    coordinates: {
        x: 675,
        y: 560
    },
    size: {
        width: 71,
        height: 95
    },
    scale: 1.5
};

export class Player extends GameComponent {
    drawPile: Card[] = [];
    playPile: Card[] = [];
    startingShuffles = 3;
    shufflesRemaining = this.startingShuffles;
    cardAnimations: CardAnimation[] = [];

    playPileVisibleSize = 3;
    playPileStartingSize = 3;

    renderConfig: RenderConfig;

    constructor(
        ctx: CanvasRenderingContext2D,
        private cardFaceSpriteSheet: HTMLImageElement,
        private cardBackSpriteSheet: HTMLImageElement
    ) {
        super(ctx, PlayerRenderConfig.coordinates);
        this.drawPile = buildAndShuffleDeck(true);
        this.hit();

        console.log('player pile', this.playPile);

        this.renderConfig = PlayerRenderConfig;
    }

    update(): void {
        this.cardAnimations.forEach(animation => animation.update());

        this.deleteDeadCardAnimations();
    }

    render(): void {
        // Render deck to represent draw pile
        for (let i = 3; i > 0; i--) {
            drawCardBack(
                this.ctx,
                this.cardBackSpriteSheet,
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
                this.ctx,
                this.cardFaceSpriteSheet,
                this.cardBackSpriteSheet,
                this.playPile[i],
                this.renderConfig.coordinates.x - (i - this.cardAnimations.length) * 45,
                this.renderConfig.coordinates.y,
                this.renderConfig.scale
            );
        }

        this.renderDrawPileSize();
        this.renderPlayPileSize();

        this.cardAnimations.forEach(animation => animation.render());
    }

    public renderPlayPileSize(): void {
        const fixedWidth = 71 * 1.5; // Define the fixed width
        const text = `[ ${this.playPile?.length} ]`;
        const textWidth = this.ctx.measureText(text).width;
        const x = 495 + (fixedWidth - textWidth) / 2; // Calculate the x-coordinate to center the text

        printText(this.ctx, text, x, 745);
    }

    public renderDrawPileSize(): void {
        const fixedWidth = 71 * 1.5; // Define the fixed width
        const text = `[ ${this.drawPile?.length} ] `;
        const textWidth = this.ctx.measureText(text).width;
        const x = 685 + (fixedWidth - textWidth) / 2; // Calculate the x-coordinate to center the text

        printText(this.ctx, text, x, 745);
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
        let animationIndex = this.playPileStartingSize - 1;
        for (let i = 0; i < this.playPileStartingSize; i++) {
            const topOfDrawPile = this.drawPile.pop();

            if (topOfDrawPile) {
                this.playPile.unshift(topOfDrawPile);

                this.addCardAnimation(
                    new CardAnimation(
                        this.ctx,
                        {
                            x: DrawPileRenderConfig.coordinates.x,
                            y: DrawPileRenderConfig.coordinates.y
                        },
                        {
                            x: PlayerRenderConfig.coordinates.x - animationIndex * 45,
                            y: PlayerRenderConfig.coordinates.y
                        },
                        this.cardFaceSpriteSheet,
                        this.cardBackSpriteSheet,
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
}
