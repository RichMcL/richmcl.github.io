import { Levels } from './level';
import { State } from './state';
import { GameComponent } from './types';
import { printText } from './util';

export class StatsSidebar extends GameComponent {
    constructor(coordinates = { x: 20, y: 0 }) {
        super(coordinates);
    }

    update(): void {}

    render(): void {
        const x = 20;

        // Left border
        State.getCtx().fillStyle = State.getTheme().base;
        State.getCtx().fillRect(x - 3, 0, 3, 800);

        State.getCtx().fillStyle = '#293a3a';
        State.getCtx().fillRect(x, 0, 250, 800);

        // Right border
        State.getCtx().fillStyle = State.getTheme().base;
        State.getCtx().fillRect(x + 250, 0, 3, 800);

        const level = Levels[State.getCurrentLevel()];
        const lines = [];

        const minutes = Math.floor(State.getTimerInMs() / 60000)
            .toString()
            .padStart(2, '0');
        const seconds = Math.floor((State.getTimerInMs() % 60000) / 1000)
            .toString()
            .padStart(2, '0');
        const tenths = Math.floor((State.getTimerInMs() % 1000) / 100)
            .toString()
            .padStart(1, '0');

        lines.push(`Time: ${minutes}:${seconds}.${tenths}`);
        lines.push('');
        lines.push(`Shuffles: ${State.getPlayer().shufflesRemaining}`);
        lines.push(`Play Pile Size: ${State.getPlayer().playPileVisibleSize}`);
        lines.push(`Draw Pile Size: ${State.getPlayer().playPileDrawSize}`);
        lines.push(`Score: ${State.getScore()}`);
        lines.push(`Streak: ${State.getStreak()}`);
        lines.push('');
        lines.push(`Level: ${level.name}`);
        lines.push(`Score to Beat: ${level.scoreToBeat}`);

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
        printText(`Cursor: X ${x} | Y ${y}`, 30, 780);
    }
}
