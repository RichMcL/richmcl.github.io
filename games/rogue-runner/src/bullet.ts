import { State } from './state';
import { Coordinates, GameComponent } from './types';

export class Bullet extends GameComponent {
    static BULLET_SPEED = 9;
    static BULLET_SIZE = 10;

    constructor(coordinates: Coordinates) {
        super(coordinates);

        this.renderConfig = {
            coordinates,
            size: { width: Bullet.BULLET_SIZE, height: Bullet.BULLET_SIZE },
            scale: 1
        };
    }

    update(): void {
        this.renderConfig.coordinates.x += Bullet.BULLET_SPEED;
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
