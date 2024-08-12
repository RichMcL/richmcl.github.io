import { Card, Coordinates, GameComponent } from './types';
import { drawCard } from './util';

export class CardAnimation extends GameComponent {
    public xRateOfChange: number = 0;
    public yRateOfChange: number = 0;

    constructor(
        ctx: CanvasRenderingContext2D,
        coordinates: Coordinates,
        private endingCoordinates: Coordinates,
        private cardFaceSpriteSheet: HTMLImageElement,
        private cardBackSpriteSheet: HTMLImageElement,
        private card: Card,
        private ttl: number = 15
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
        // determine rate of change for x and y based no ttl
        this.xRateOfChange = (this.coordinates.x - this.endingCoordinates.x) / this.ttl;
        this.yRateOfChange = (this.coordinates.y - this.endingCoordinates.y) / this.ttl;
    }

    update(): void {
        this.ttl--;

        if (this.ttl <= 0) {
            this.deleteMe = true;
        }

        this.coordinates.x -= this.xRateOfChange;
        this.coordinates.y -= this.yRateOfChange;
    }

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
