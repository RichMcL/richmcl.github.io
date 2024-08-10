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
    cards: Card[];
    renderConfig: RenderConfig;

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

    update(): void {}

    render(): void {
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

        printText(
            this.ctx,
            `[ ${this.cards.length} ]`,
            this.renderConfig.coordinates.x + this.renderConfig.size.width / 2,
            this.renderConfig.coordinates.y +
                this.renderConfig.size.height * this.renderConfig.scale +
                30
        );
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
