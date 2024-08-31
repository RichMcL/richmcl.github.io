import { CardAnimation } from './card-animation';
import { calculateScoreForRules, doesAnyRulePass, getAllPassingRules } from './rules';
import { ScoreGraphic } from './score-graphic';
import { State } from './state';
import { Card, Coordinates, GameComponent, RenderConfig } from './types';
import {
    BASE_CARD_SCALE,
    CARD_HEIGHT,
    CARD_WIDTH,
    drawCard,
    drawCardOutline,
    printText
} from './util';

export const PilesRenderConfig: { [key: string]: RenderConfig } = {
    pile1: {
        coordinates: {
            x: 366.5,
            y: 70
        },
        size: {
            width: CARD_WIDTH,
            height: CARD_HEIGHT
        },
        scale: BASE_CARD_SCALE
    },

    pile2: {
        coordinates: {
            x: 513,
            y: 70
        },
        size: {
            width: CARD_WIDTH,
            height: CARD_HEIGHT
        },
        scale: BASE_CARD_SCALE
    },

    pile3: {
        coordinates: {
            x: 659.5,
            y: 70
        },
        size: {
            width: CARD_WIDTH,
            height: CARD_HEIGHT
        },
        scale: BASE_CARD_SCALE
    },

    pile4: {
        coordinates: {
            x: 806,
            y: 70
        },
        size: {
            width: CARD_WIDTH,
            height: CARD_HEIGHT
        },
        scale: BASE_CARD_SCALE
    }
};

export class Pile extends GameComponent {
    static ANIMATION_ENABLED = true;
    cards: Card[];
    renderConfig: RenderConfig;
    cardAnimations: CardAnimation[] = [];

    canPlay: boolean = false;

    // Random angle between -3 and 3 degrees in radians
    private initialRotationAngle = (Math.random() * 6 - 3) * (Math.PI / 180);
    private rotationAngle = this.initialRotationAngle;

    // Random starting rotation direction
    private rotationSpeed = 0.005 * (Math.random() < 0.5 ? 1 : -1);

    private time = 0;

    constructor(coordinates: Coordinates, private pileName: string) {
        super(coordinates);
        this.cards = [];
        this.renderConfig = PilesRenderConfig[pileName];
    }

    update(): void {
        // Increment the time
        this.time += this.rotationSpeed;

        this.canPlay = false;
        let hoverPileCard = this.getTopCard();
        const topPlayerCard = State.getPlayer().getTopPlayCard();

        if (this.isHoveredOver() && topPlayerCard) {
            if (doesAnyRulePass(State.getRuleNames(), topPlayerCard, hoverPileCard)) {
                this.canPlay = true;
            }

            if (this.canPlay && (State.isMouseClick() || State.isGamepadButtonClick())) {
                this.addCardAnimation(
                    new CardAnimation(
                        State.getPlayer().getCoordinatesCopy(),
                        this.getCoordinatesCopy(),
                        State.getPlayer().getTopPlayCard()
                    )
                );

                this.pushCard({
                    ...State.getPlayer().getTopPlayCard(),
                    suit: State.getPlayer().getTopPlayCard().suit,
                    value: State.getPlayer().getTopPlayCard().value
                });

                //get all passing rules
                const passingRules = getAllPassingRules(
                    State.getRuleNames(),
                    topPlayerCard,
                    hoverPileCard
                );

                console.log('Passing rules', passingRules);

                const pointsForMove = calculateScoreForRules(passingRules, State.getStreak());
                State.setScore(State.getScore() + pointsForMove);
                State.setStreak(State.getStreak() + 1);

                State.getPlayer().removeTopPlayCard();
                State.getScorebar().setScoreToReach(State.getScore());

                // in the middle of the pile
                const scoreX = this.renderConfig.coordinates.x + this.renderConfig.size.width / 2;

                State.addGameComponent(new ScoreGraphic({ x: scoreX, y: 300 }, pointsForMove));
            }
        }

        // Calculate the oscillating angle using a sine wave and add the initial angle
        const oscillatingAngle = Math.sin(this.time) * (3 * (Math.PI / 180)); // Convert degrees to radians
        this.rotationAngle = this.initialRotationAngle + oscillatingAngle;

        this.cardAnimations.forEach(animation => animation.update());

        this.deleteDeadCardAnimations();
    }

    render(): void {
        this.renderDropShadow();

        if (Pile.ANIMATION_ENABLED) {
            this.animationRender();
        } else {
            this.staticRender();
        }

        printText(
            `[ ${this.cards.length} ]`,
            this.renderConfig.coordinates.x + this.renderConfig.size.width / 2,
            this.renderConfig.coordinates.y +
                this.renderConfig.size.height * this.renderConfig.scale +
                30
        );

        this.cardAnimations.forEach(animation => animation.render());
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

    staticRender(): void {
        const scale = this.isHoveredOver()
            ? this.renderConfig.scale * 1.025
            : this.renderConfig.scale;

        // bump cards up on hover
        const yPos = this.isHoveredOver()
            ? this.renderConfig.coordinates.y - 5
            : this.renderConfig.coordinates.y;

        // Don't render the actual top card until it "lands"
        const card = this.getCardFromTop(this.cardAnimations.length);

        drawCard(card, this.renderConfig.coordinates.x, yPos, scale);

        // Draw a border around the pile if it can play
        if (this.canPlay) {
            drawCardOutline(
                this.renderConfig.coordinates.x,
                yPos,
                this.renderConfig.size.width * scale,
                this.renderConfig.size.height * scale
            );
        }
    }

    renderDropShadow(): void {
        State.getCtx().save();
        State.getCtx().fillStyle = 'rgba(0, 0, 0, 0.3)';

        const x = this.renderConfig.coordinates.x;
        const y = this.renderConfig.coordinates.y;
        const width = this.renderConfig.size.width * this.renderConfig.scale;
        const height = this.renderConfig.size.height * this.renderConfig.scale;
        const radius = 10; // Adjust the radius as needed

        // Calculate the center of the canvas
        const canvasCenterX = State.getCtx().canvas.width / 2;

        // Determine the shadow offset based on the element's position relative to the center
        const shadowOffsetX = (x + width / 2 - canvasCenterX) * -0.03; // Reduced horizontal offset
        const shadowOffsetY = 8; // Fixed vertical offset

        // Apply the shadow offset
        const shadowX = x + shadowOffsetX;
        const shadowY = y + shadowOffsetY;

        // Calculate the center of the element
        const elementCenterX = x + width / 2;
        const elementCenterY = y + height / 2;

        // Apply rotation
        State.getCtx().translate(elementCenterX, elementCenterY);
        State.getCtx().rotate(this.rotationAngle);

        State.getCtx().translate(-elementCenterX, -elementCenterY);

        State.getCtx().beginPath();
        State.getCtx().moveTo(shadowX + radius, shadowY);
        State.getCtx().arcTo(shadowX + width, shadowY, shadowX + width, shadowY + height, radius);
        State.getCtx().arcTo(shadowX + width, shadowY + height, shadowX, shadowY + height, radius);
        State.getCtx().arcTo(shadowX, shadowY + height, shadowX, shadowY, radius);
        State.getCtx().arcTo(shadowX, shadowY, shadowX + width, shadowY, radius);
        State.getCtx().closePath();
        State.getCtx().fill();

        State.getCtx().restore();
    }

    getTopCard(): Card {
        return this.cards[this.cards.length - 1];
    }

    getCardFromTop(index: number): Card {
        return this.cards[this.cards.length - 1 - index];
    }
    pushCard(card: Card): void {
        this.cards.push(card);
    }

    popCard(): Card {
        return this.cards.pop();
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
}
