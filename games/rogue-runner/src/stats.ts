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
    }
}
