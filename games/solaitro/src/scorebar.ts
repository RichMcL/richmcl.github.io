import { Coordinates, GameComponent } from './types';

export class Scorebar extends GameComponent {
    private scoreToReach = 0;
    private renderedScore = 0;
    private maxScore = 100;

    constructor(ctx: CanvasRenderingContext2D) {
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
            this.renderedScore += 1;
        }
    }

    render(): void {
        // Left border
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(
            this.coordinates.x - 3,
            this.coordinates.y,
            3,
            this.renderConfig.size.height
        );

        let completedRatio = this.renderedScore / this.maxScore;

        if (completedRatio > 1) {
            completedRatio = 1;
        }

        const scoreHeight = completedRatio * 780;

        this.ctx.fillStyle = '#77dd77';
        this.ctx.fillRect(
            this.coordinates.x,
            this.coordinates.y + this.renderConfig.size.height,
            this.renderConfig.size.width,
            -scoreHeight
        );

        // Right border
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(
            this.coordinates.x + this.renderConfig.size.width,
            this.coordinates.y,
            3,
            this.renderConfig.size.height
        );
    }

    setScoreToReach(score: number): void {
        this.scoreToReach = score;
    }

    reset(): void {
        this.renderedScore = 0;
        this.scoreToReach = 0;
    }

    setMaxScore(maxScore: number): void {
        this.maxScore = maxScore;
    }
}
