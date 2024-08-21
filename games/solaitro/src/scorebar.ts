import { text } from 'stream/consumers';
import { Coordinates, GameComponent } from './types';
import { printText } from './util';
import { Theme } from './theme';

export class Scorebar extends GameComponent {
    private scoreToReach = 0;
    private renderedScore = 0;
    private maxScore = 100;
    private incrementer = 1;

    constructor(ctx: CanvasRenderingContext2D, private theme: Theme) {
        const coordinates = { x: 290, y: 10 };
        super(ctx, coordinates);

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
        this.ctx.fillStyle = '#eeeeee';
        this.ctx.fillRect(
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

        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(
            this.coordinates.x,
            this.coordinates.y,
            this.renderConfig.size.width,
            this.renderConfig.size.height
        );

        this.ctx.fillStyle = this.theme.base;
        this.ctx.fillRect(
            this.coordinates.x,
            this.coordinates.y + this.renderConfig.size.height,
            this.renderConfig.size.width,
            -scoreHeight
        );

        // Right border
        this.ctx.fillStyle = '#eeeeee';
        this.ctx.fillRect(
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
            this.ctx,
            `${Math.floor(this.renderedScore)}`,
            this.coordinates.x + this.renderConfig.size.width + 10,
            textY,
            20,
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

    setTheme(theme: Theme): void {
        this.theme = theme;
    }
}
