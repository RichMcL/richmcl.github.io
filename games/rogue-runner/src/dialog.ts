import { State } from './state';
import { Coordinates, GameComponent, RenderConfig } from './types';
import { GAME_BASE_HEIGHT, GAME_BASE_WIDTH, printText } from './util';

export const DefaultDialogRenderConfig: RenderConfig = {
    coordinates: {
        x: 60,
        y: 200
    },
    size: {
        width: GAME_BASE_WIDTH - 120,
        height: 520
    },
    scale: 1
};

export class Dialog extends GameComponent {
    text: string = 'Game Over';

    constructor(coordinates: Coordinates) {
        super(coordinates);
    }

    update(): void {}

    render(): void {
        const ctx = State.getCtx();
        // Save the current context state
        ctx.save();

        ctx.fillStyle = '#2c2c2c';
        ctx.fillRect(
            this.coordinates.x,
            this.coordinates.y,
            DefaultDialogRenderConfig.size.width,
            DefaultDialogRenderConfig.size.height
        );

        // Add a white outline
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3; // Set the width of the outline
        ctx.strokeRect(
            this.coordinates.x,
            this.coordinates.y,
            DefaultDialogRenderConfig.size.width,
            DefaultDialogRenderConfig.size.height
        );

        const text = this.text;
        const fontSize = 30;
        const dialogWidth = DefaultDialogRenderConfig.size.width;
        const dialogHeight = DefaultDialogRenderConfig.size.height;

        // Set the font size for measuring the text
        ctx.font = `${fontSize}px Base-Font`;

        // Measure the width of the text
        const textWidth = ctx.measureText(text).width;

        // Calculate the x-coordinate to center the text horizontally
        const x = this.coordinates.x + (dialogWidth - textWidth) / 2;

        // Calculate the y-coordinate to center the text vertically
        const y = this.coordinates.y + 80;

        // Print the text centered inside the dialog
        printText(text, x, y, fontSize);
        ctx.restore();
    }
}
