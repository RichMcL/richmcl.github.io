import { Coordinates, GameComponent, RenderConfig } from './types';
import { printText } from './util';

export const DefaultDialogRenderConfig: RenderConfig = {
    coordinates: {
        x: 150,
        y: 120
    },
    size: {
        width: 1280 - 300,
        height: 800 - 240
    },
    scale: 1
};

export class Dialog extends GameComponent {
    text: string = 'This is a test dialog, this is a game in progress obviously...';
    visible: boolean = false;

    constructor(ctx: CanvasRenderingContext2D, coordinates: Coordinates) {
        super(ctx, coordinates);
    }

    update(): void {}

    render(): void {
        if (!this.visible) {
            return;
        }

        // Save the current context state
        this.ctx.save();

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        this.ctx.fillRect(
            this.coordinates.x,
            this.coordinates.y,
            DefaultDialogRenderConfig.size.width,
            DefaultDialogRenderConfig.size.height
        );

        this.ctx.restore();

        printText(this.ctx, this.text, this.coordinates.x + 20, this.coordinates.y + 50, 30);
    }
}
