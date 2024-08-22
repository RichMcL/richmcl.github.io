import { Card, Coordinates, GameComponent } from './types';
import { drawCard } from './util';

export class CardComponent extends GameComponent {
    constructor(
        ctx: CanvasRenderingContext2D,
        coordinates: Coordinates,
        private cardFaceSpriteSheet: HTMLImageElement,
        private cardBackSpriteSheet: HTMLImageElement,
        private card: Card
    ) {
        super(ctx, coordinates);
        this.renderConfig = {
            coordinates,
            size: {
                width: 71,
                height: 95
            },
            scale: 1.5
        };
    }

    update(): void {}

    render(): void {
        drawCard(
            this.ctx,
            this.cardFaceSpriteSheet,
            this.cardBackSpriteSheet,
            this.card,
            this.renderConfig.coordinates.x,
            this.renderConfig.coordinates.y,
            this.renderConfig.scale
        );
    }
}
