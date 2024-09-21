import { State } from './state';
import { GameComponent, RenderConfig } from './types';

export class Player extends GameComponent {
    static INITIAL_POSITION = { x: 100, y: 830 };
    static JUMP_HEIGHT = 400;

    renderConfig: RenderConfig;
    isJumping = false;

    jumpVelocity = 0;
    jumpVelocityIncrement = 0.2;
    startJumpVelocity = 10;
    maxJumpVelocity = 10;

    fallVelocity = 0;
    fallVelocityIncrement = 0.5;
    maxFallVelocity = 10;

    constructor() {
        super({ x: Player.INITIAL_POSITION.x, y: Player.INITIAL_POSITION.y });

        this.renderConfig = {
            coordinates: this.coordinates,
            size: { width: 50, height: 50 },
            scale: 1
        };
    }

    update(): void {
        // if the screen is clicked, the player should jump
        if (State.isMouseClick() || State.isGamepadButtonClick()) {
            this.isJumping = true;
            this.jumpVelocity = this.startJumpVelocity;
        }
        // if the player is jumping, update the player's position
        if (this.isJumping) {
            this.jumpVelocity -= this.jumpVelocityIncrement;
            this.coordinates.y -= this.jumpVelocity;

            // if the player has reached the max jump height, start falling
            if (
                this.jumpVelocity <= 0 &&
                this.coordinates.y <= Player.INITIAL_POSITION.y - Player.JUMP_HEIGHT
            ) {
                this.isJumping = false;
                this.jumpVelocity = 0;
            }
        }

        if (!this.isJumping) {
            if (this.coordinates.y >= Player.INITIAL_POSITION.y) {
                this.coordinates.y = Player.INITIAL_POSITION.y; // Reset to initial position
                this.fallVelocity = 0;
            } else {
                this.fallVelocity = Math.min(
                    this.fallVelocity + this.fallVelocityIncrement,
                    this.maxFallVelocity
                );
                this.coordinates.y += this.fallVelocity;
            }
        }

        // Ensure player does not fall below the initial position
        if (this.coordinates.y > Player.INITIAL_POSITION.y) {
            this.coordinates.y = Player.INITIAL_POSITION.y;
            this.fallVelocity = 0;
        }
    }

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
