import { Game } from './rogue-runner';
import { State } from './state';
import { Coordinates, GameComponent } from './types';

export interface Bullet extends GameComponent {
    bulletSpeed: number;
    bulletSize: number;
    damage: number;
    update(): void;
    render(): void;
}

export class SimpleBullet extends GameComponent implements Bullet {
    static BULLET_SPEED = 9;
    static BULLET_SIZE = 10;

    bulletSpeed: number = SimpleBullet.BULLET_SPEED;
    bulletSize: number = SimpleBullet.BULLET_SIZE;
    damage = 1;

    constructor(coordinates: Coordinates) {
        super(coordinates);

        this.renderConfig = {
            coordinates,
            size: { width: this.bulletSize, height: this.bulletSize },
            scale: 1
        };
    }

    update(): void {
        if (State.isGameOver()) {
            return;
        }

        this.renderConfig.coordinates.x += this.bulletSpeed;
    }

    render(): void {
        State.getCtx().fillStyle = 'white';
        State.getCtx().fillRect(
            this.renderConfig.coordinates.x,
            this.renderConfig.coordinates.y,
            this.renderConfig.size.width,
            this.renderConfig.size.height
        );
    }
}

export class BigBullet extends SimpleBullet {
    static BULLET_SIZE = 20;

    damage = 3;

    bulletSize: number = BigBullet.BULLET_SIZE;
}
