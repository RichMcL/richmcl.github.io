import { Bullet } from './bullet';
import { State } from './state';
import { GameComponent, RenderConfig } from './types';

export class Player extends GameComponent {
    static INITIAL_POSITION = { x: 100, y: 830 };
    static JUMP_HEIGHT = 400;

    renderConfig: RenderConfig;
    isJumping = false;

    jumpVelocity = 0;
    jumpVelocityIncrement = 0.7; // Increased from 0.2 to 0.5
    startJumpVelocity = 20;

    fallVelocity = 0;
    fallVelocityIncrement = 1.1; // Increased from 0.5 to 1.0
    maxFallVelocity = 15;

    groundOffset = 0;
    groundSpeed = 5;
    checkerSize = 50;

    shootTimer = 0;
    baseShootTimer = 60;

    constructor() {
        super({ x: Player.INITIAL_POSITION.x, y: Player.INITIAL_POSITION.y });

        this.renderConfig = {
            coordinates: this.coordinates,
            size: { width: 50, height: 50 },
            scale: 1
        };
    }

    update(): void {
        // Update ground offset
        this.groundOffset = (this.groundOffset - this.groundSpeed) % (this.checkerSize * 2);

        // if the screen is clicked, the player should jump
        if (State.isMouseClick() || State.isGamepadButtonClick()) {
            // TODO - double and triple jump as bonus
            if (!this.isJumping) {
                this.isJumping = true;
                this.jumpVelocity = this.startJumpVelocity;
            }
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
            this.isJumping = false;
        }

        // Update shoot timer
        this.shootTimer++;

        //Every 60 frames, shoot a new Bullet
        if (this.shootTimer === this.baseShootTimer) {
            //coordinates are the center of the player
            const coords = {
                x: this.coordinates.x + this.renderConfig.size.width / 2,
                y: this.coordinates.y + this.renderConfig.size.height / 2
            };
            State.addGameComponent(new Bullet(coords));
            this.shootTimer = 0;
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
        // State.getCtx().fillStyle = 'gray';
        // State.getCtx().fillRect(
        //     0,
        //     Player.INITIAL_POSITION.y + State.getPlayer().renderConfig.size.height,
        //     640,
        //     1000
        // );

        const ctx = State.getCtx();
        const groundY = Player.INITIAL_POSITION.y + State.getPlayer().renderConfig.size.height;
        const canvasWidth = ctx.canvas.width;
        const canvasHeight = ctx.canvas.height;

        // Draw the checkerboard pattern
        for (let y = groundY; y < canvasHeight; y += this.checkerSize) {
            for (let x = this.groundOffset; x < canvasWidth; x += this.checkerSize * 2) {
                ctx.fillStyle = 'gray';
                ctx.fillRect(x, y, this.checkerSize, this.checkerSize);
                ctx.fillRect(
                    x + this.checkerSize,
                    y + this.checkerSize,
                    this.checkerSize,
                    this.checkerSize
                );
                ctx.fillStyle = 'darkgray';
                ctx.fillRect(x + this.checkerSize, y, this.checkerSize, this.checkerSize);
                ctx.fillRect(x, y + this.checkerSize, this.checkerSize, this.checkerSize);
            }
        }
    }
}
