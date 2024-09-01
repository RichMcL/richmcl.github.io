import { Levels } from './level';
import { State } from './state';
import { GameComponent } from './types';
import { printText } from './util';

export class StatsSidebar extends GameComponent {
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
        const x = 20;

        // Left border
        State.getCtx().fillStyle = State.getTheme().base;
        State.getCtx().fillRect(x - 3, 0, 3, 800);

        State.getCtx().fillStyle = '#293a3a';
        State.getCtx().fillRect(x, 0, this.renderConfig.size.width, 800);

        // Right border
        State.getCtx().fillStyle = State.getTheme().base;
        State.getCtx().fillRect(x + this.renderConfig.size.width, 0, 3, 800);

        const level = Levels[State.getCurrentLevel()];
        const lines = [];

        lines.push(`Level`);
        lines.push(`${State.getCurrentLevel() + 1}`);
        lines.push(`Score`);
        lines.push(`${level.scoreToBeat}`);

        lines.push('');
        lines.push('Score');
        lines.push(`${State.getScore()}`);
        lines.push('Streak');
        lines.push(`${State.getStreak()}`);

        let y = 40;
        lines.forEach(line => {
            printText(line, 30, y);
            y += 40;
        });

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

        printText(`${minutes}:${seconds}.${tenths}`, 30, 740);

        printText(`( ${x}, ${y} )`, 30, 780);
    }
}
