import { Enemy } from './enemy';
import { State } from './state';
import { Coordinates, GameComponent } from './types';

export class EnemyExplosion extends GameComponent {
    ttl = 20;

    constructor(coordinates: Coordinates, private enemy: Enemy) {
        super(coordinates);

        this.renderConfig = {
            coordinates,
            size: {
                width: this.enemy.renderConfig.size.width,
                height: this.enemy.renderConfig.size.height
            },
            scale: 1
        };
    }

    update(): void {
        this.ttl--;

        if (this.ttl <= 0) {
            this.deleteMe = true;
        }
    }

    render(): void {
        // Render expanding squares to simulate explosion
        const ctx = State.getCtx();
        const { x, y } = this.renderConfig.coordinates;
        const enemySize = this.renderConfig.size.width; // Assuming size is available in renderConfig
        const numSquares = 6; // Number of squares in the explosion

        for (let i = 0; i < numSquares; i++) {
            const angle = (i / numSquares) * 2 * Math.PI;
            const distance = (1 - Math.sqrt(this.ttl / 30)) * enemySize; // Slower expansion
            const squareX = x + Math.cos(angle) * distance - enemySize / 2;
            const squareY = y + Math.sin(angle) * distance - enemySize / 2;
            const squareSize = enemySize * (this.ttl / 30); // Size decreases as ttl decreases

            ctx.save(); // Save the current state
            ctx.globalAlpha = this.ttl / 20; // Fade out as ttl decreases
            ctx.fillStyle = this.enemy.color; // Use the enemy's color
            ctx.fillRect(squareX, squareY, squareSize, squareSize); // Draw a square
            ctx.restore(); // Restore the previous state
        }
    }
}
