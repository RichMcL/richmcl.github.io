import { createCloseDialogButton } from './button';
import { CardComponent } from './card-component';
import { DefaultDialogRenderConfig } from './dialog';
import { State } from './state';
import { Card, CardNumericValue, Coordinates, GameComponent } from './types';
import { BASE_CARD_SCALE, CARD_WIDTH, printText } from './util';

export class DeckDialog extends GameComponent {
    cardComponents: CardComponent[] = [];
    allCards: Card[] = [];
    buttonComponents: GameComponent[] = [];

    constructor(coordinates: Coordinates, private playPile: Card[], private drawPile: Card[]) {
        super(coordinates);

        //clone deck
        this.drawPile = JSON.parse(JSON.stringify(this.drawPile));
        this.allCards.push(...this.drawPile);
        this.playPile = JSON.parse(JSON.stringify(this.playPile));
        this.allCards.push(...this.playPile);

        // Sort deck by suit and value
        this.allCards.sort((a, b) => {
            if (a.suit === b.suit) {
                return CardNumericValue[a.value] - CardNumericValue[b.value];
            }

            return a.suit.localeCompare(b.suit);
        });

        this.createCardComponents();

        this.buttonComponents.push(createCloseDialogButton());

        State.setDialogOpen(true);
    }

    update(): void {
        this.cardComponents.forEach(cardComponent => {
            cardComponent.update();
        });

        this.buttonComponents.forEach(buttonComponent => {
            buttonComponent.update();
        });
    }

    render(): void {
        this.renderDialogBackground();

        printText(
            'All cards remaining in deck and hand',
            this.coordinates.x + 40,
            this.coordinates.y + 40,
            30
        );

        //render the cards in a grid
        this.cardComponents.forEach(cardComponent => {
            cardComponent.render();
        });

        //render the buttons
        this.buttonComponents.forEach(buttonComponent => {
            buttonComponent.render();
        });
    }

    private renderDialogBackground(): void {
        const ctx = State.getCtx();
        ctx.save();

        const x = this.coordinates.x;
        const y = this.coordinates.y;
        const width = DefaultDialogRenderConfig.size.width;
        const height = DefaultDialogRenderConfig.size.height;
        const radius = 10; // Radius for rounded corners

        // Draw the filled rectangle with rounded corners
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.arcTo(x + width, y, x + width, y + radius, radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
        ctx.lineTo(x + radius, y + height);
        ctx.arcTo(x, y + height, x, y + height - radius, radius);
        ctx.lineTo(x, y + radius);
        ctx.arcTo(x, y, x + radius, y, radius);
        ctx.closePath();

        ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        ctx.fill();

        // Draw the green outline
        ctx.strokeStyle = State.getTheme().base;
        ctx.lineWidth = 5;
        ctx.stroke();

        ctx.restore();
    }

    private createCardComponents(): void {
        // Create card components, rendering each suit in a row
        let x = this.coordinates.x + 10;
        let y = this.coordinates.y + 70;

        // Group cards by suit
        const suits = this.allCards.reduce((acc, card) => {
            if (!acc[card.suit]) {
                acc[card.suit] = [];
            }
            acc[card.suit].push(card);
            return acc;
        }, {} as Record<string, Card[]>);

        Object.keys(suits).forEach(suit => {
            const cards = suits[suit];
            const cardWidth = CARD_WIDTH * BASE_CARD_SCALE; // Card width * scale
            const dialogWidth = DefaultDialogRenderConfig.size.width - 20; // Adjust for padding
            const totalCardWidth = cards.length * cardWidth;
            const totalSpacing = dialogWidth - totalCardWidth;
            const spacing = totalSpacing / (cards.length - 1); // Reduce the spacing between cards

            x = this.coordinates.x + 10;

            cards.forEach(card => {
                this.cardComponents.push(new CardComponent({ x, y }, card));

                x += cardWidth + spacing;
            });

            y += 80;
        });
    }
}
