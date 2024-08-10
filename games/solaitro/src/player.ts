import { Card, Coordinates, GameComponent, RenderConfig } from './types';
import { buildAndShuffleDeck, drawCard, drawCardBack } from './util';

const PlayerRenderConfig: RenderConfig = {
    coordinates: {
        x: 635,
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
                this.renderConfig.coordinates.x - 150 + i * 5,
                this.renderConfig.coordinates.y + 5 * (i - 1),
                this.renderConfig.scale
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
                this.renderConfig.coordinates.x + i * 30,
                this.renderConfig.coordinates.y,
                this.renderConfig.scale
            );
        }
    }

    getTopPlayCard(): Card {
        return this.playPile[0];
    }

    hit(): void {
        console.log('hit');
        //pop 3 cards of the draw pile and add to the top of the stack
        for (let i = 0; i < 3; i++) {
            this.playPile.unshift(this.drawPile.pop());
        }
    }

    removeTopPlayCard(): void {
        this.playPile.shift();
    }
}
