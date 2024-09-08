import { CardComponent } from './card-component';
import { State } from './state';
import { Card, Coordinates, GameComponent, RenderConfig } from './types';
import {
    BASE_CARD_SCALE,
    CARD_HEIGHT,
    CARD_WIDTH,
    drawCardBack,
    drawCardOutline,
    drawRoundedRect,
    printText
} from './util';

export const DrawPileRenderConfig: RenderConfig = {
    coordinates: {
        x: 675,
        y: 560
    },
    size: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT
    },
    scale: BASE_CARD_SCALE
};

export class DrawPile extends GameComponent {
    cards: CardComponent[] = [];

    constructor() {
        super(DrawPileRenderConfig.coordinates);
        this.renderConfig = DrawPileRenderConfig;
    }

    update(): void {
        this.renderConfig.scale = this.isHoveredOver() ? BASE_CARD_SCALE * 1.025 : BASE_CARD_SCALE;

        if (this.isClicked()) {
            if (!State.isDialogOpen()) {
                State.getPlayer().hit();
            }
        }
    }

    render(): void {
        // // Render deck to represent draw pile
        for (let i = 3; i > 0; i--) {
            drawCardBack(
                DrawPileRenderConfig.coordinates.x + i * 5,
                DrawPileRenderConfig.coordinates.y + 5 * (i - 1),
                DrawPileRenderConfig.scale
            );
        }

        this.renderDrawPileSize();

        if (this.isHoveredOver()) {
            drawCardOutline(
                DrawPileRenderConfig.coordinates.x + 5,
                DrawPileRenderConfig.coordinates.y,
                DrawPileRenderConfig.scale * DrawPileRenderConfig.size.width,
                DrawPileRenderConfig.scale * DrawPileRenderConfig.size.height
            );

            this.renderHit();
        }
    }

    renderDrawPileSize(): void {
        const fixedWidth = CARD_WIDTH * BASE_CARD_SCALE; // Define the fixed width
        const text = `[ ${State.getPlayer().shufflesRemaining} - ${this.cards?.length} ] `;
        const textWidth = State.getCtx().measureText(text).width;
        const x = 690 + (fixedWidth - textWidth) / 2; // Calculate the x-coordinate to center the text

        printText(text, x, 745);
    }

    renderHit(): void {
        const ctx = State.getCtx();
        ctx.save();
        State.getCtx().fillStyle = 'rgba(0, 0, 0, 0.5)';
        drawRoundedRect(710, 600, 50, 50, 10);
        printText('Hit', 720, 635);
        ctx.restore();
    }

    isHoveredOver(): boolean {
        if (State.isDialogOpen()) {
            return false;
        }

        return super.isHoveredOver();
    }

    /**
     * Converts raw Card[] to CardComponent[] and sets the cards
     */
    setCards(cards: Card[]): void {
        this.cards = cards.map((card, index) => {
            return new CardComponent(
                {
                    x: null,
                    y: null
                },
                card
            );
        });
    }

    getRawCards(): Card[] {
        return this.cards.map(cardComponent => cardComponent.getCard());
    }

    popCard() {
        return this.cards.pop();
    }

    pushCard(card: Card) {
        this.cards.push(new CardComponent({ x: this.coordinates.x, y: this.coordinates.y }, card));
    }
}
