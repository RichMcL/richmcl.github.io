import { Card, Coordinates, GameComponent } from './types';
import { BASE_CARD_SCALE, CARD_HEIGHT, CARD_WIDTH, drawCard } from './util';

export class CardAnimation extends GameComponent {
    public xRateOfChange: number = 0;
    public yRateOfChange: number = 0;

    constructor(
        coordinates: Coordinates,
        private endingCoordinates: Coordinates,
        private card: Card,
        private ttl: number = 15
    ) {
        super(coordinates);

        this.renderConfig = {
            coordinates,
            size: {
                width: CARD_WIDTH,
                height: CARD_HEIGHT
            },
            scale: BASE_CARD_SCALE
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
            this.card,
            this.renderConfig.coordinates.x,
            this.renderConfig.coordinates.y,
            this.renderConfig.scale
        );
    }
}
