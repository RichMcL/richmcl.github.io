import { Bullet } from './bullet';
import { EnemyExplosion } from './enemy-explosion';
import { State } from './state';
import { Coordinates, GameComponent } from './types';

export interface Enemy extends GameComponent {
    hp: number;
    damage: number;
    size: number;
    speed: number;
    spawnMin: number;
    spawnMax: number;
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

    static ENEMY_SPAWN_MIN = 1 * 60; // 1 second
    static ENEMY_SPAWN_MAX = 3 * 60; // 3 seconds

    static TIME_UNTIL_SPAWN =
        Math.random() * (SimpleEnemy.ENEMY_SPAWN_MAX - SimpleEnemy.ENEMY_SPAWN_MIN) +
        SimpleEnemy.ENEMY_SPAWN_MIN;

    hp = SimpleEnemy.ENEMY_START_HP;
    damage = SimpleEnemy.ENEMY_DAMAGE;
    size = SimpleEnemy.ENEMY_SIZE;
    speed = SimpleEnemy.ENEMY_SPEED;
    spawnMin = SimpleEnemy.ENEMY_SPAWN_MIN;
    spawnMax = SimpleEnemy.ENEMY_SPAWN_MAX;
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

                    const explosion = new EnemyExplosion(
                        {
                            x: this.renderConfig.coordinates.x + this.renderConfig.size.width / 2,
                            y: this.renderConfig.coordinates.y + this.renderConfig.size.height / 2
                        },
                        this
                    );
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

    static ENEMY_SPAWN_MIN = 1.5 * 60; // 1 second
    static ENEMY_SPAWN_MAX = 3.5 * 60; // 3 seconds

    static TIME_UNTIL_SPAWN =
        Math.random() * (FlyingEnemy.ENEMY_SPAWN_MAX - FlyingEnemy.ENEMY_SPAWN_MIN) +
        FlyingEnemy.ENEMY_SPAWN_MIN;

    hp = FlyingEnemy.ENEMY_START_HP;
    damage = FlyingEnemy.ENEMY_DAMAGE;
    size = FlyingEnemy.ENEMY_SIZE;
    speed = FlyingEnemy.ENEMY_SPEED;
    spawnMin = FlyingEnemy.ENEMY_SPAWN_MIN;
    spawnMax = FlyingEnemy.ENEMY_SPAWN_MAX;
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

                    const explosion = new EnemyExplosion(
                        {
                            x: this.renderConfig.coordinates.x + this.renderConfig.size.width / 2,
                            y: this.renderConfig.coordinates.y + this.renderConfig.size.height / 2
                        },
                        this
                    );
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

export class BounceEnemy extends GameComponent implements Enemy {
    static ENEMY_SPEED = 3;
    static ENEMY_SIZE = 50;
    static ENEMY_START_HP = 2;
    static ENEMY_DAMAGE = 1;

    static ENEMY_SPAWN_MIN = 7 * 60; // 1 second
    static ENEMY_SPAWN_MAX = 10 * 60; // 3 seconds

    static TIME_UNTIL_SPAWN =
        Math.random() * (BounceEnemy.ENEMY_SPAWN_MAX - BounceEnemy.ENEMY_SPAWN_MIN) +
        BounceEnemy.ENEMY_SPAWN_MIN;

    hp = BounceEnemy.ENEMY_START_HP;
    damage = BounceEnemy.ENEMY_DAMAGE;
    size = BounceEnemy.ENEMY_SIZE;
    speed = BounceEnemy.ENEMY_SPEED;
    spawnMin = BounceEnemy.ENEMY_SPAWN_MIN;
    spawnMax = BounceEnemy.ENEMY_SPAWN_MAX;
    isEnemy = true;
    color = 'green';

    private initialY: number;
    private oscillationSpeed = 0.1;
    private oscillationAmplitude = 50;
    private oscillationTime = 0;

    constructor(coordinates: Coordinates = { x: 640, y: 650 }) {
        super(coordinates);

        this.renderConfig = {
            coordinates,
            size: { width: BounceEnemy.ENEMY_SIZE, height: BounceEnemy.ENEMY_SIZE },
            scale: 1
        };

        this.initialY = coordinates.y;
    }

    update() {
        if (State.isGameOver()) {
            return;
        }

        this.renderConfig.coordinates.x -= BounceEnemy.ENEMY_SPEED;

        // Oscillate vertically
        this.oscillationTime += this.oscillationSpeed;
        this.renderConfig.coordinates.y =
            this.initialY + Math.sin(this.oscillationTime) * this.oscillationAmplitude;

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

                    const explosion = new EnemyExplosion(
                        {
                            x: this.renderConfig.coordinates.x + this.renderConfig.size.width / 2,
                            y: this.renderConfig.coordinates.y + this.renderConfig.size.height / 2
                        },
                        this
                    );
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
