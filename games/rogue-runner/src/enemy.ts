import { Bullet } from './bullet';
import { EnemyExplosion } from './enemy-explosion';
import { State } from './state';
import { Coordinates, GameComponent } from './types';

export interface Enemy extends GameComponent {
    hp: number;
    damage: number;
    size: number;
    speed: number;
    update(): void;
    render(): void;
    isEnemy: boolean;
    color: string;
}

export class SimpleEnemy extends GameComponent implements Enemy {
    static ENEMY_SPEED = 8;
    static ENEMY_SIZE = 50;
    static ENEMY_START_HP = 1;
    static ENEMY_DAMAGE = 1;

    hp = SimpleEnemy.ENEMY_START_HP;
    damage = SimpleEnemy.ENEMY_DAMAGE;
    size = SimpleEnemy.ENEMY_SIZE;
    speed = SimpleEnemy.ENEMY_SPEED;
    isEnemy = true;
    color = 'red';

    constructor(coordinates: Coordinates) {
        super(coordinates);

        this.renderConfig = {
            coordinates,
            size: { width: SimpleEnemy.ENEMY_SIZE, height: SimpleEnemy.ENEMY_SIZE },
            scale: 1
        };
    }

    update() {
        if (State.isGameOver()) {
            return;
        }

        this.renderConfig.coordinates.x -= SimpleEnemy.ENEMY_SPEED;

        // If enemy collides with a bullet, delete the enemy
        (State.getBullets() as Bullet[]).forEach(bullet => {
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
                this.hp -= bullet.damage;
                bullet.deleteMe = true;

                if (this.hp <= 0) {
                    this.deleteMe = true;

                    const explosion = new EnemyExplosion({
                        x: this.renderConfig.coordinates.x + this.renderConfig.size.width / 2,
                        y: this.renderConfig.coordinates.y + this.renderConfig.size.height / 2
                    });
                    State.addGameComponent(explosion);
                }
            }
        });
    }

    render() {
        State.getCtx().fillStyle = this.color;
        State.getCtx().fillRect(
            this.renderConfig.coordinates.x,
            this.renderConfig.coordinates.y,
            this.renderConfig.size.width,
            this.renderConfig.size.height
        );

        renderEnemyHp(this);
    }
}

export class FlyingEnemy extends SimpleEnemy {
    static ENEMY_SPEED = 5;
    static ENEMY_SIZE = 30;
    static ENEMY_START_HP = 1;
    static ENEMY_DAMAGE = 1;

    hp = FlyingEnemy.ENEMY_START_HP;
    damage = FlyingEnemy.ENEMY_DAMAGE;
    size = FlyingEnemy.ENEMY_SIZE;
    speed = FlyingEnemy.ENEMY_SPEED;
    color = '#7CB9E8';

    update() {
        if (State.isGameOver()) {
            return;
        }

        this.renderConfig.coordinates.x -= FlyingEnemy.ENEMY_SPEED;

        // If enemy collides with a bullet, delete the enemy
        (State.getBullets() as Bullet[]).forEach(bullet => {
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
                this.hp -= bullet.damage;
                bullet.deleteMe = true;

                if (this.hp <= 0) {
                    this.deleteMe = true;

                    const explosion = new EnemyExplosion({
                        x: this.renderConfig.coordinates.x + this.renderConfig.size.width / 2,
                        y: this.renderConfig.coordinates.y + this.renderConfig.size.height / 2
                    });
                    State.addGameComponent(explosion);
                }
            }
        });
    }

    render() {
        State.getCtx().fillStyle = this.color;
        State.getCtx().fillRect(
            this.renderConfig.coordinates.x,
            this.renderConfig.coordinates.y,
            this.renderConfig.size.width,
            this.renderConfig.size.height
        );

        renderEnemyHp(this);
    }
}

const renderEnemyHp = (enemy: Enemy) => {
    // Render hp as white dots to the left of the player
    const ctx = State.getCtx();
    const playerHeight = enemy.renderConfig.size.height;
    const indicatorHeight = 8;
    const gap = 5;
    const totalIndicatorsHeight = enemy.hp * (indicatorHeight + gap) - gap; // Adjust total height to include gaps
    const startY = enemy.renderConfig.coordinates.y + (playerHeight - totalIndicatorsHeight) / 2;

    ctx.fillStyle = enemy.color;
    for (let i = 0; i < enemy.hp; i++) {
        ctx.fillRect(
            enemy.renderConfig.coordinates.x + enemy.renderConfig.size.width + 4,
            startY + i * (indicatorHeight + gap),
            indicatorHeight,
            indicatorHeight
        );
    }
};
