import { Coordinates, GameComponent } from './types';
import { printText } from './util';

export class ScoreGraphic extends GameComponent {
    public ttl: number = 90;
    public color = 'white';

    constructor(ctx: CanvasRenderingContext2D, coordinates: Coordinates, public score: number) {
        super(ctx, coordinates);
    }

    update(): void {
        this.ttl--;

        if (this.ttl <= 0) {
            this.deleteMe = true;
        }

        //start the color at white and fade to transparent
        let alpha = 1;
        if (this.ttl < 60) {
            this.coordinates.y -= 0.3;
            alpha = this.ttl / 60;
        }

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
