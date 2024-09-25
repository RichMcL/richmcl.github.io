import { State } from './state';
import { Coordinates, GameComponent } from './types';

export class EnemyExplosion extends GameComponent {
    ttl = 30;

    constructor(coordinates: Coordinates) {
        super(coordinates);

        this.renderConfig = {
            coordinates,
            size: { width: 50, height: 50 },
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
        //render expanding dots to simulate explosion
        const ctx = State.getCtx();
        const { x, y } = this.renderConfig.coordinates;
        const maxRadius = 25; // Maximum radius for the dots
        const numDots = 10; // Number of dots in the explosion

        for (let i = 0; i < numDots; i++) {
            const angle = (i / numDots) * 2 * Math.PI;
            const radius = (1 - Math.sqrt(this.ttl / 30)) * maxRadius; // Slower expansion
            const dotX = x + Math.cos(angle) * radius;
            const dotY = y + Math.sin(angle) * radius;

            ctx.save(); // Save the current state
            ctx.globalAlpha = this.ttl / 30; // Fade out as ttl decreases
            ctx.beginPath();
            ctx.arc(dotX, dotY, 3, 0, 2 * Math.PI); // Draw a dot with radius 3
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.restore(); // Restore the previous state
        }
    }
}
