import { State } from './state';
import { GameComponent, RenderConfig } from './types';

export class Player extends GameComponent {
    renderConfig: RenderConfig;

    static INITIAL_POSITION = { x: 100, y: 830 };

    constructor() {
        super({ x: Player.INITIAL_POSITION.x, y: Player.INITIAL_POSITION.y });

        this.renderConfig = {
            coordinates: this.coordinates,
            size: { width: 50, height: 50 },
            scale: 1
        };
    }

    update(): void {}

    render(): void {
        this.renderGround();
        this.renderPlayer();
    }

    public renderPlayer(): void {
        // Render a white sqaure to represent the player
        const ctx = State.getCtx();
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.fillRect(
            this.renderConfig.coordinates.x,
            this.renderConfig.coordinates.y,
            this.renderConfig.size.width,
            this.renderConfig.size.height
        );
        ctx.restore();
    }

    public renderGround(): void {
        State.getCtx().fillStyle = 'gray';
        State.getCtx().fillRect(
            0,
            Player.INITIAL_POSITION.y + State.getPlayer().renderConfig.size.height,
            640,
            1000
        );
    }
}
