import { CardAnimation } from './card-animation';
import { CardComponent } from './card-component';
import { State } from './state';
import { Card, CardBack, Coordinates, GameComponent, RenderConfig } from './types';
import { BASE_CARD_SCALE, CARD_HEIGHT, CARD_WIDTH, drawCard, printText } from './util';

export const PlayerRenderConfig: RenderConfig = {
    coordinates: {
        x: 535,
        y: 560
    },
    size: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT
    },
    scale: BASE_CARD_SCALE
};

export class PlayPile extends GameComponent {
    cards: CardComponent[] = [];
    startingShuffles = 3;
    cardAnimations: CardAnimation[] = [];
    public shufflesRemaining = this.startingShuffles;
    public playPileVisibleSize = 3;
    public playPileDrawSize = 3;

    constructor() {
        super(PlayerRenderConfig.coordinates);
        this.renderConfig = PlayerRenderConfig;
    }

    update() {
        this.cards.forEach(card => card.update());
        this.cardAnimations.forEach(cardAnimation => cardAnimation.update());
        this.deleteDeadCardAnimations();
    }

    render() {
        // Don't render the actual cards until they "land"
        let renderStartIndex = this.playPileVisibleSize - 1;
        let renderEndIndex = 0;

        if (this.cardAnimations.length > 0) {
            renderStartIndex += this.cardAnimations.length;
            renderEndIndex += this.cardAnimations.length;
        }
        for (let i = renderStartIndex; i >= renderEndIndex; i--) {
            if (!this.getRawCards()[i]) {
                continue;
            }

            drawCard(
                this.getRawCards()[i],
                this.renderConfig.coordinates.x - (i - this.cardAnimations.length) * 45,
                this.renderConfig.coordinates.y,
                this.renderConfig.scale,
                CardBack.White
            );
        }

        this.cardAnimations.forEach(animation => animation.render());
        this.renderPlayPileSize();
    }

    public renderPlayPileSize(): void {
        const fixedWidth = CARD_WIDTH * BASE_CARD_SCALE; // Define the fixed width
        const text = `[ ${this.getRawCards()?.length} ]`;
        const textWidth = State.getCtx().measureText(text).width;
        const x = 495 + (fixedWidth - textWidth) / 2; // Calculate the x-coordinate to center the text

        printText(text, x, 745);
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
        this.cards.push(new CardComponent({ x: null, y: null }, card));
    }

    unshiftCard(card: Card) {
        this.cards.unshift(new CardComponent({ x: null, y: null }, card));
    }

    shiftCard() {
        return this.cards.shift();
    }

    addCardAnimation(cardAnimation: CardAnimation): void {
        this.cardAnimations.push(cardAnimation);
    }

    deleteDeadCardAnimations(): void {
        this.cardAnimations = this.cardAnimations.filter(cardAnimation => !cardAnimation.deleteMe);
    }

    getCoordinatesCopy(): Coordinates {
        return { ...this.coordinates };
    }

    incrementPlayPileVisibleSize(): void {
        this.playPileVisibleSize++;
    }

    decrementPlayPileVisibleSize(): void {
        if (this.playPileVisibleSize === 0) {
            return;
        }

        this.playPileVisibleSize--;
    }

    incrementPlayPileDrawSize(): void {
        this.playPileDrawSize++;
    }

    decrementPlayPileDrawSize(): void {
        if (this.playPileDrawSize === 0) {
            return;
        }

        this.playPileDrawSize--;
    }
}
