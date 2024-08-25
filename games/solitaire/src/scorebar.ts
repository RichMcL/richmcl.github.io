import { GameComponent } from './types';
import { printText } from './util';
import { Theme } from './theme';
import { State } from './state';

export class Scorebar extends GameComponent {
    private scoreToReach = 0;
    private renderedScore = 0;
    private maxScore = 100;
    private incrementer = 1;

    constructor() {
        const coordinates = { x: 290, y: 10 };
        super(coordinates);

        this.renderConfig = {
            coordinates,
            size: {
                width: 20,
                height: 780
            },
            scale: 1
        };
    }

    update(): void {
        if (this.renderedScore < this.scoreToReach) {
            this.renderedScore += this.incrementer;
            this.incrementer += 0.05;
        } else {
            this.incrementer = 1;
        }
    }

    render(): void {
        // Left border
        State.getCtx().fillStyle = '#eeeeee';
        State.getCtx().fillRect(
            this.coordinates.x - 3,
            this.coordinates.y,
            3,
            this.renderConfig.size.height
        );

        let completedRatio = this.getCompletedRatio();

        if (completedRatio > 1) {
            completedRatio = 1;
        }

        const scoreHeight = completedRatio * 780;

        State.getCtx().fillStyle = 'white';
        State.getCtx().fillRect(
            this.coordinates.x,
            this.coordinates.y,
            this.renderConfig.size.width,
            this.renderConfig.size.height
        );

        State.getCtx().fillStyle = State.getTheme().base;
        State.getCtx().fillRect(
            this.coordinates.x,
            this.coordinates.y + this.renderConfig.size.height,
            this.renderConfig.size.width,
            -scoreHeight
        );

        // Right border
        State.getCtx().fillStyle = '#eeeeee';
        State.getCtx().fillRect(
            this.coordinates.x + this.renderConfig.size.width,
            this.coordinates.y,
            3,
            this.renderConfig.size.height
        );

        //render the score at the top of the bar
        let textY = this.renderConfig.size.height - scoreHeight + 10;

        if (textY < 30) {
            textY = 30;
        }

        printText(
            `${Math.floor(this.renderedScore)}`,
            this.coordinates.x + this.renderConfig.size.width + 10,
            textY,
            30,
            'white'
        );
    }

    setScoreToReach(score: number): void {
        this.scoreToReach = score;
    }

    reset(): void {
        this.renderedScore = 0;
        this.scoreToReach = 0;
        this.incrementer = 1;
    }

    setMaxScore(maxScore: number): void {
        this.maxScore = maxScore;
    }

    getCompletedRatio(): number {
        return this.renderedScore / this.maxScore;
    }

    isAnimationComplete(): boolean {
        return this.renderedScore >= this.scoreToReach;
    }
}
