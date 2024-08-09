import { Coordindates, GameComponent } from './types';
import { printText } from './util';

export class ScoreGraphic extends GameComponent {
    public ttl: number = 60;
    public color = 'white';

    constructor(ctx: CanvasRenderingContext2D, coordinates: Coordindates, public score: number) {
        super(ctx, coordinates);
    }

    update(): void {
        this.ttl--;

        if (this.ttl <= 0) {
            this.deleteMe = true;
        }

        //start the color at white and fade to transparent
        const alpha = this.ttl / 60;
        this.color = `rgba(255, 255, 255, ${alpha})`;
    }

    render(): void {
        printText(
            this.ctx,
            `+${this.score}`,
            this.coordinates.x,
            this.coordinates.y,
            30,
            this.color
        );
    }
}
