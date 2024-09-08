import { createDeckButton, GameButton } from './button';
import { CardAnimation } from './card-animation';
import { State } from './state';
import { Card, GameComponent, RenderConfig } from './types';
import { DrawPile, DrawPileRenderConfig } from './draw-pile';

import { buildAndShuffleDeck } from './util';
import { PlayerRenderConfig, PlayPile } from './play-pile';
export class Player extends GameComponent {
    drawPile: DrawPile;
    playPile: PlayPile;

    renderConfig: RenderConfig;

    buttons: GameButton[] = [];

    constructor() {
        super({ x: null, y: null });
        const drawPile = buildAndShuffleDeck(true);

        this.drawPile = new DrawPile();
        this.drawPile.setCards(drawPile);

        this.playPile = new PlayPile();

        this.hit();

        console.log('player pile', this.playPile.cards);

        this.buttons.push(createDeckButton());
    }

    update(): void {
        this.buttons.forEach(button => button.update());
        this.drawPile.update();
        this.playPile.update();
    }

    render(): void {
        this.drawPile.render();
        this.playPile.render();

        this.buttons.forEach(button => button.render());
    }

    getTopPlayCard(): Card {
        return this.playPile.getRawCards()[0];
    }

    hit(): void {
        if (this.playPile.shufflesRemaining === 0 && this.drawPile.cards.length === 0) {
            return;
        }

        State.setStreak(0);

        if (this.drawPile.cards.length === 0 && this.playPile.shufflesRemaining > 0) {
            this.drawPile.setCards(this.playPile.getRawCards());
            this.playPile.setCards([]);
            this.playPile.shufflesRemaining--;
        }

        //pop playPileStartingSize cards of the draw pile and add to the top of the stack
        let animationIndex = this.playPile.playPileDrawSize - 1;
        for (let i = 0; i < this.playPile.playPileDrawSize; i++) {
            const topOfDrawPile = this.drawPile.popCard().getCard();

            if (topOfDrawPile) {
                this.playPile.unshiftCard(topOfDrawPile);

                this.playPile.addCardAnimation(
                    new CardAnimation(
                        {
                            x: DrawPileRenderConfig.coordinates.x,
                            y: DrawPileRenderConfig.coordinates.y
                        },
                        {
                            x: PlayerRenderConfig.coordinates.x - animationIndex * 45,
                            y: PlayerRenderConfig.coordinates.y
                        },
                        topOfDrawPile,
                        15
                    )
                );
            }
            animationIndex--;
        }
    }

    removeTopPlayCard(): void {
        this.playPile.shiftCard();
    }

    incrementShuffles(): void {
        this.playPile.shufflesRemaining++;
    }

    decrementShuffles(): void {
        if (this.playPile.shufflesRemaining === 0) {
            return;
        }

        this.playPile.shufflesRemaining--;
    }
}
