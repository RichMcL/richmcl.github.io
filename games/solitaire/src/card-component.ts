import { State } from './state';
import { Card, Coordinates, GameComponent } from './types';
import { BASE_CARD_SCALE, CARD_HEIGHT, CARD_WIDTH, drawCard } from './util';

export class CardComponent extends GameComponent {
    // Random angle between -3 and 3 degrees in radians
    private initialRotationAngle = (Math.random() * 6 - 3) * (Math.PI / 180);
    private rotationAngle = this.initialRotationAngle;

    // Random starting rotation direction
    private rotationSpeed = 0.005 * (Math.random() < 0.5 ? 1 : -1);

    private time = 0;

    constructor(coordinates: Coordinates, private card: Card) {
        super(coordinates);
        this.renderConfig = {
            coordinates,
            size: {
                width: CARD_WIDTH,
                height: CARD_HEIGHT
            },
            scale: BASE_CARD_SCALE
        };
    }

    update(): void {
        // Increment the time
        this.time += this.rotationSpeed;

        // Calculate the oscillating angle using a sine wave and add the initial angle
        const oscillatingAngle = Math.sin(this.time) * (3 * (Math.PI / 180)); // Convert degrees to radians
        this.rotationAngle = this.initialRotationAngle + oscillatingAngle;
    }

    render(): void {
        this.animationRender();
    }

    staticRender(): void {
        // Cards can have null coordinates because their parent component is responsible for rendering
        if (this.renderConfig.coordinates.x === null || this.renderConfig.coordinates.y === null) {
            return;
        }

        drawCard(
            this.card,
            this.renderConfig.coordinates.x,
            this.renderConfig.coordinates.y,
            this.renderConfig.scale
        );
    }

    animationRender(): void {
        // Save the current context state
        State.getCtx().save();

        // Move the origin to the card's center
        State.getCtx().translate(
            this.renderConfig.coordinates.x +
                (this.renderConfig.size.width * this.renderConfig.scale) / 2,
            this.renderConfig.coordinates.y +
                (this.renderConfig.size.height * this.renderConfig.scale) / 2
        );

        // Rotate the context
        State.getCtx().rotate(this.rotationAngle);

        // Move the origin back
        State.getCtx().translate(
            -this.renderConfig.coordinates.x -
                (this.renderConfig.size.width * this.renderConfig.scale) / 2,
            -this.renderConfig.coordinates.y -
                (this.renderConfig.size.height * this.renderConfig.scale) / 2
        );

        this.staticRender();

        // Restore the context state
        State.getCtx().restore();
    }

    getCard(): Card {
        return this.card;
    }
}
