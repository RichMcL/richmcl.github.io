import { State } from './state';
import { Coordinates, GameComponent } from './types';

export class Enemy extends GameComponent {
    static ENEMY_SPEED = 10;
    static ENEMY_SIZE = 50;

    constructor(coordinates: Coordinates) {
        super(coordinates);

        this.renderConfig = {
            coordinates,
            size: { width: Enemy.ENEMY_SIZE, height: Enemy.ENEMY_SIZE },
            scale: 1
        };
    }

    update() {
        if (State.isGameOver()) {
            return;
        }

        this.renderConfig.coordinates.x -= Enemy.ENEMY_SPEED;

        // If enemy collides with a bullet, delete the enemy
        State.getBullets().forEach(bullet => {
            if (
                this.renderConfig.coordinates.x <
                    bullet.renderConfig.coordinates.x + bullet.renderConfig.size.width &&
                this.renderConfig.coordinates.x + this.renderConfig.size.width >
                    bullet.renderConfig.coordinates.x &&
                this.renderConfig.coordinates.y <
                    bullet.renderConfig.coordinates.y + bullet.renderConfig.size.height &&
                this.renderConfig.coordinates.y + this.renderConfig.size.height >
                    bullet.renderConfig.coordinates.y
            ) {
                this.deleteMe = true;
                bullet.deleteMe = true;
            }
        });
    }

    render() {
        State.getCtx().fillStyle = 'red';
        State.getCtx().fillRect(
            this.renderConfig.coordinates.x,
            this.renderConfig.coordinates.y,
            this.renderConfig.size.width,
            this.renderConfig.size.height
        );
    }
}
