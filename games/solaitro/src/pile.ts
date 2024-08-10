import { Card, Coordinates, GameComponent, RenderConfig } from './types';
import { drawCard, printText } from './util';

export const PilesRenderConfig: { [key: string]: RenderConfig } = {
    pile1: {
        coordinates: {
            x: 366.5,
            y: 70
        },
        size: {
            width: 71,
            height: 95
        },
        scale: 1.5
    },

    pile2: {
        coordinates: {
            x: 513,
            y: 70
        },
        size: {
            width: 71,
            height: 95
        },
        scale: 1.5
    },

    pile3: {
        coordinates: {
            x: 659.5,
            y: 70
        },
        size: {
            width: 71,
            height: 95
        },
        scale: 1.5
    },

    pile4: {
        coordinates: {
            x: 806,
            y: 70
        },
        size: {
            width: 71,
            height: 95
        },
        scale: 1.5
    }
};

export class Pile extends GameComponent {
    static ANIMATION_ENABLED = true;
    cards: Card[];
    renderConfig: RenderConfig;

    // Random angle between -3 and 3 degrees in radians
    private initialRotationAngle = (Math.random() * 6 - 3) * (Math.PI / 180);
    private rotationAngle = this.initialRotationAngle;
    private rotationSpeed = 0.005;

    private time = 0;

    constructor(
        ctx: CanvasRenderingContext2D,
        coordinates: Coordinates,
        private cardFaceSpriteSheet: HTMLImageElement,
        private cardBackSpriteSheet: HTMLImageElement,
        private pileName: string
    ) {
        super(ctx, coordinates);
        this.cards = [];
        this.renderConfig = PilesRenderConfig[pileName];
    }

    update(): void {
        // Increment the time
        this.time += this.rotationSpeed;

        // Calculate the oscillating angle using a sine wave and add the initial angle
        const oscillatingAngle = Math.sin(this.time) * (3 * (Math.PI / 180)); // Convert degrees to radians
        this.rotationAngle = this.initialRotationAngle + oscillatingAngle;
    }

    render(): void {
        if (Pile.ANIMATION_ENABLED) {
            this.animationRender();
        } else {
            this.staticRender();
        }

        printText(
            this.ctx,
            `[ ${this.cards.length} ]`,
            this.renderConfig.coordinates.x + this.renderConfig.size.width / 2,
            this.renderConfig.coordinates.y +
                this.renderConfig.size.height * this.renderConfig.scale +
                30
        );
    }

    animationRender(): void {
        // Save the current context state
        this.ctx.save();

        // Move the origin to the card's center
        this.ctx.translate(
            this.renderConfig.coordinates.x +
                (this.renderConfig.size.width * this.renderConfig.scale) / 2,
            this.renderConfig.coordinates.y +
                (this.renderConfig.size.height * this.renderConfig.scale) / 2
        );

        // Rotate the context
        this.ctx.rotate(this.rotationAngle);

        // Move the origin back
        this.ctx.translate(
            -this.renderConfig.coordinates.x -
                (this.renderConfig.size.width * this.renderConfig.scale) / 2,
            -this.renderConfig.coordinates.y -
                (this.renderConfig.size.height * this.renderConfig.scale) / 2
        );

        this.staticRender();

        // Restore the context state
        this.ctx.restore();
    }

    staticRender(): void {
        drawCard(
            this.ctx,
            this.cardFaceSpriteSheet,
            this.cardBackSpriteSheet,
            this.getTopCard(),
            this.renderConfig.coordinates.x,
            this.renderConfig.coordinates.y,
            this.renderConfig.scale
        );

        if (this.isHovered) {
            this.ctx.strokeStyle = 'white';
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(
                this.renderConfig.coordinates.x,
                this.renderConfig.coordinates.y,
                this.renderConfig.size.width * this.renderConfig.scale,
                this.renderConfig.size.height * this.renderConfig.scale
            );
        }
    }

    reset(): void {
        this.isHovered = false;
    }

    getTopCard(): Card {
        return this.cards[this.cards.length - 1];
    }

    pushCard(card: Card): void {
        this.cards.push(card);
    }

    popCard(): Card {
        return this.cards.pop();
    }
}
