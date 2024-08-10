import { Card, Coordinates, GameComponent, RenderConfig } from './types';
import { buildAndShuffleDeck, drawCard, drawCardBack, printText } from './util';

const PlayerRenderConfig: RenderConfig = {
    coordinates: {
        x: 535,
        y: 460
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
        y: 460
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

    update(): void {}

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

        //Render the top 3 cards of the play pile
        for (let i = 2; i >= 0; i--) {
            if (!this.playPile[i]) {
                continue;
            }

            drawCard(
                this.ctx,
                this.cardFaceSpriteSheet,
                this.cardBackSpriteSheet,
                this.playPile[i],
                this.renderConfig.coordinates.x - i * 45,
                this.renderConfig.coordinates.y,
                this.renderConfig.scale
            );
        }

        this.renderDrawPileSize();
        this.renderPlayPileSize();
    }

    public renderPlayPileSize(): void {
        const fixedWidth = 71 * 1.5; // Define the fixed width
        const text = `${this.playPile?.length}`;
        const textWidth = this.ctx.measureText(text).width;
        const x = 495 + (fixedWidth - textWidth) / 2; // Calculate the x-coordinate to center the text

        printText(this.ctx, text, x, 645);
    }

    public renderDrawPileSize(): void {
        const fixedWidth = 71 * 1.5; // Define the fixed width
        const text = `${this.drawPile?.length}`;
        const textWidth = this.ctx.measureText(text).width;
        const x = 685 + (fixedWidth - textWidth) / 2; // Calculate the x-coordinate to center the text

        printText(this.ctx, text, x, 645);
    }

    getTopPlayCard(): Card {
        return this.playPile[0];
    }

    hit(): void {
        if (this.drawPile.length === 0) {
            this.drawPile = this.playPile;
            this.playPile = [];
        }

        //pop 3 cards of the draw pile and add to the top of the stack
        for (let i = 0; i < 3; i++) {
            const topOfDrawPile = this.drawPile.pop();

            if (topOfDrawPile) {
                this.playPile.unshift(topOfDrawPile);
            }
        }
    }

    removeTopPlayCard(): void {
        this.playPile.shift();
    }
}
