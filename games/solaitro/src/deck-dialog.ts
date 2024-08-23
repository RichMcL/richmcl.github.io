import { createCloseDialogButton } from './button';
import { CardComponent } from './card-component';
import { DefaultDialogRenderConfig } from './dialog';
import { State } from './state';
import { Card, CardNumericValue, Coordinates, GameComponent } from './types';

export class DeckDialog extends GameComponent {
    cardComponents: CardComponent[] = [];
    allCards: Card[] = [];

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

        State.addGameComponent(createCloseDialogButton());
    }

    update(): void {
        this.cardComponents.forEach(cardComponent => {
            cardComponent.update();
        });
    }

    render(): void {
        this.renderDialogBackground();

        //render the cards in a grid
        this.cardComponents.forEach(cardComponent => {
            cardComponent.render();
        });
    }

    private renderDialogBackground(): void {
        State.getCtx().save();

        State.getCtx().fillStyle = 'rgba(0, 0, 0, 0.9)';
        State.getCtx().fillRect(
            this.coordinates.x,
            this.coordinates.y,
            DefaultDialogRenderConfig.size.width,
            DefaultDialogRenderConfig.size.height
        );

        State.getCtx().restore();
    }

    private createCardComponents(): void {
        // Create card components, rendering each suit in a row
        let x = this.coordinates.x + 10;
        let y = this.coordinates.y + 10;
        let currentSuit = this.drawPile[0].suit;

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
            const cardWidth = 71 * 1.5; // Card width * scale
            const dialogWidth = DefaultDialogRenderConfig.size.width - 20; // Adjust for padding
            const totalCardWidth = cards.length * cardWidth;
            const totalSpacing = dialogWidth - totalCardWidth;
            const spacing = totalSpacing / (cards.length - 1); // Reduce the spacing between cards

            x = this.coordinates.x + 10;

            cards.forEach(card => {
                this.cardComponents.push(new CardComponent({ x, y }, card));

                x += cardWidth + spacing;
            });

            y += 90;
        });
    }
}
