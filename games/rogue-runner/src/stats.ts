import { BigBullet, SimpleBullet } from './bullet';
import { BounceEnemy, FlyingEnemy, SimpleEnemy } from './enemy';
import { State } from './state';
import { GameComponent } from './types';
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

        printText('Rogue Runner', 160, 60);
        printText('--------------------', 20, 100);

        printText(`${minutes}:${seconds}.${tenths}`, 30, 140, 20);
        printText(`F: ${State.getFps()?.toFixed(1) || '-'}`, 210, 140, 20);
        printText(`(${x}, ${y})`, 400, 140, 20);

        printText(
            `SB ${SimpleBullet.BASE_SHOOT_TIMER}:${
                SimpleBullet.BASE_SHOOT_TIMER - SimpleBullet.SHOOT_TIMER
            }`,
            30,
            170,
            20,
            'white'
        );

        printText(
            `BB ${BigBullet.BASE_SHOOT_TIMER}:${
                BigBullet.BASE_SHOOT_TIMER - BigBullet.SHOOT_TIMER
            }`,
            260,
            170,
            20,
            'white'
        );

        printText(
            `R ${SimpleEnemy.ENEMY_SPAWN_MIN}-${
                SimpleEnemy.ENEMY_SPAWN_MAX
            }:${SimpleEnemy.TIME_UNTIL_SPAWN.toFixed(0)}`,
            30,
            200,
            20,
            'red'
        );
        printText(
            `B ${FlyingEnemy.ENEMY_SPAWN_MIN}-${
                FlyingEnemy.ENEMY_SPAWN_MAX
            }:${FlyingEnemy.TIME_UNTIL_SPAWN.toFixed(0)}`,
            30,
            230,
            20,
            '#7CB9E8'
        );
        printText(
            `G ${BounceEnemy.ENEMY_SPAWN_MIN}-${
                BounceEnemy.ENEMY_SPAWN_MAX
            }:${BounceEnemy.TIME_UNTIL_SPAWN.toFixed(0)}`,
            30,
            260,
            20,
            'green'
        );
    }
}
