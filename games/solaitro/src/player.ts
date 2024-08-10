import { Card, Coordinates, GameComponent, RenderConfig } from './types';
import { buildAndShuffleDeck, drawCard, drawCardBack } from './util';

const PlayerRenderConfig: RenderConfig = {
    coordinates: {
        x: 585,
        y: 460
    },
    size: {
        width: 71,
        height: 95
    },
    scale: 1.5
};

export class Player extends GameComponent {
    hand: Card[];
    handIndex: number;

    renderConfig: RenderConfig;

    constructor(
        ctx: CanvasRenderingContext2D,
        private cardFaceSpriteSheet: HTMLImageElement,
        private cardBackSpriteSheet: HTMLImageElement
    ) {
        super(ctx, PlayerRenderConfig.coordinates);
        this.hand = buildAndShuffleDeck(true);
        this.handIndex = 0;
        this.renderConfig = PlayerRenderConfig;
    }

    update(): void {}

    render(): void {
        // Render blank cards behind the player card
        for (let i = 3; i > 0; i--) {
            drawCardBack(
                this.ctx,
                this.cardBackSpriteSheet,
                this.renderConfig.coordinates.x + 5 * i,
                this.renderConfig.coordinates.y + 5 * i,
                this.renderConfig.scale
            );
        }

        drawCard(
            this.ctx,
            this.cardFaceSpriteSheet,
            this.cardBackSpriteSheet,
            this.getCurrentCard(),
            this.renderConfig.coordinates.x,
            this.renderConfig.coordinates.y,
            this.renderConfig.scale
        );
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
