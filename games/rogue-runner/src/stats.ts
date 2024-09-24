import { State } from './state';
import { Coordinates, GameComponent } from './types';
import { printText } from './util';

export class Stats extends GameComponent {
    constructor(coordinates = { x: 20, y: 0 }) {
        super(coordinates);

        this.renderConfig = {
            coordinates,
            size: {
                width: 150,
                height: 800
            },
            scale: 1
        };
    }

    update(): void {}

    render(): void {
        this.renderMousePosition();
    }

    private renderMousePosition(): void {
        const x = parseFloat(State.getScaledMouseCoordinates().x.toFixed(0));
        const y = parseFloat(State.getScaledMouseCoordinates().y.toFixed(0));

        const minutes = Math.floor(State.getTimerInMs() / 60000)
            .toString()
            .padStart(2, '0');
        const seconds = Math.floor((State.getTimerInMs() % 60000) / 1000)
            .toString()
            .padStart(2, '0');
        const tenths = Math.floor((State.getTimerInMs() % 1000) / 100)
            .toString()
            .padStart(1, '0');

        printText(`${minutes}:${seconds}.${tenths}`, 30, 50);

        printText(`(${x}, ${y})`, 30, 90);

        // printText(`Shot Level: ${State.getPlayer().shootLevel}`, 30, 130);
        printText(`HP: ${State.getPlayer().hp}`, 30, 170);

        const barWidth = 100;
        const barHeight = 20;
        const barX = 30;
        const barY = 200;
        const barFillWidth =
            (State.getPlayer().shootTimer / State.getPlayer().baseShootTimer) * barWidth;

        const ctx = State.getCtx();

        // Draw the black box
        ctx.fillStyle = '#2c2c2c';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // Draw the white outline
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2; // Set the width of the outline
        ctx.strokeRect(barX, barY, barWidth, barHeight);

        // Fill the box with white based on the fill width
        ctx.fillStyle = 'white';
        ctx.fillRect(barX, barY, barFillWidth, barHeight);
    }
}
