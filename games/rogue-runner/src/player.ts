import { BigBullet, SimpleBullet } from './bullet';
import { State } from './state';
import { GameComponent, RenderConfig } from './types';

export class Player extends GameComponent {
    static INITIAL_POSITION = { x: 100, y: 830 };
    static JUMP_HEIGHT = 400;

    renderConfig: RenderConfig;
    isJumping = false;
    hp = 3;
    xp = 0;
    level = 1;
    xpToNextLevel = 5;

    isIframe = false;
    iframeTimer = 0;
    defaultIframeTimer = 120;

    jumpVelocity = 0;
    jumpVelocityIncrement = 1.5; // Increased from 0.2 to 0.5
    startJumpVelocity = 25;

    fallVelocity = 0;
    fallVelocityIncrement = 1.5; // Increased from 0.5 to 1.0
    maxFallVelocity = 25;

    groundOffset = 0;
    groundSpeed = 5;
    checkerSize = 50;

    jumpCount = 0;
    maxJumps = 1;
    isInAir: boolean = false; // Track if the player is in the air

    constructor() {
        super({ x: Player.INITIAL_POSITION.x, y: Player.INITIAL_POSITION.y });

        this.renderConfig = {
            coordinates: this.coordinates,
            size: { width: 50, height: 50 },
            scale: 1
        };
    }

    update(): void {
        if (State.isGameOver()) {
            return;
        }

        // Update ground offset
        this.groundOffset = (this.groundOffset - this.groundSpeed) % (this.checkerSize * 2);

        // if the screen is clicked, the player should jump
        if (State.isMouseClick() || State.isGamepadButtonClick()) {
            // Allow jumping if the player hasn't reached the max number of jumps
            if (this.jumpCount < this.maxJumps) {
                this.isJumping = true;
                this.jumpVelocity = this.startJumpVelocity;
                this.jumpCount++;
                this.isInAir = true;
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
        } else {
            if (this.coordinates.y >= Player.INITIAL_POSITION.y) {
                this.coordinates.y = Player.INITIAL_POSITION.y; // Reset to initial position
                this.fallVelocity = 0;
                this.jumpCount = 0; // Reset jump count when player lands
                this.isInAir = false;
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
            this.isInAir = false;
        }

        // Update shoot timer
        SimpleBullet.SHOOT_TIMER++;
        BigBullet.SHOOT_TIMER++;

        //Every 60 frames, shoot a new Bullet
        if (SimpleBullet.SHOOT_TIMER === SimpleBullet.BASE_SHOOT_TIMER / SimpleBullet.SHOOT_LEVEL) {
            //coordinates are the center of the player
            const coords = {
                x: this.coordinates.x + this.renderConfig.size.width / 2,
                y:
                    this.coordinates.y +
                    this.renderConfig.size.height / 2 -
                    SimpleBullet.BULLET_SIZE / 2
            };
            State.addGameComponent(new SimpleBullet(coords));

            SimpleBullet.SHOOT_TIMER = 0;
        }

        if (BigBullet.SHOOT_TIMER === BigBullet.BASE_SHOOT_TIMER / BigBullet.SHOOT_LEVEL) {
            //coordinates are the center of the player
            const coords = {
                x: this.coordinates.x + this.renderConfig.size.width / 2,
                y:
                    this.coordinates.y +
                    this.renderConfig.size.height / 2 -
                    BigBullet.BULLET_SIZE / 2
            };
            State.addGameComponent(new BigBullet(coords));

            BigBullet.SHOOT_TIMER = 0;
        }

        if (this.isIframe) {
            this.iframeTimer--;
            if (this.iframeTimer <= 0) {
                this.isIframe = false;
            }
        }
    }

    render(): void {
        this.renderGround();
        this.renderPlayer();
        this.renderShotTimer();
        this.renderHp();
    }

    public doIframes(): void {
        this.isIframe = true;
        this.iframeTimer = this.defaultIframeTimer;
    }

    public addXpFromEnemy(xp: number): void {
        this.xp += xp;

        if (this.xp >= this.xpToNextLevel) {
            this.doLevelUp();
        }
    }

    public doLevelUp(): void {
        this.level++;
        this.xpToNextLevel = this.xpToNextLevel * 2;

        switch (this.level) {
            case 2:
                this.maxJumps = 2;
                break;
            default:
                break;
        }
    }

    public renderPlayer(): void {
        // Render a white square to represent the player
        const ctx = State.getCtx();
        ctx.save();

        // Check if the player is in an iframe
        if (this.isIframe) {
            // Toggle alpha value for faster flickering effect
            const alpha = Math.sin(Date.now() / 25) * 0.5 + 0.5; // Flicker between 0.5 and 1, faster
            ctx.globalAlpha = alpha;
        } else {
            ctx.globalAlpha = 1; // Fully opaque
        }

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

    public renderShotTimer(): void {
        //render a shot timer bar above the player for SimpleBulet
        const barWidth = this.renderConfig.size.width - 2;
        const barHeight = 5;
        const barX = this.renderConfig.coordinates.x + 1;
        const barY = this.renderConfig.coordinates.y - barHeight - 5;
        const barFillWidth = (SimpleBullet.SHOOT_TIMER / SimpleBullet.BASE_SHOOT_TIMER) * barWidth;

        const ctx = State.getCtx();
        // // Draw the black box
        ctx.fillStyle = '#2c2c2c';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // // Draw the white outline
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2; // Set the width of the outline
        ctx.strokeRect(barX, barY, barWidth, barHeight);

        // // Fill the box with white based on the fill width
        ctx.fillStyle = 'white';
        ctx.fillRect(barX, barY, barFillWidth, barHeight);

        //render a shot timer bar above the player for BigBullet
        const bigBarWidth = this.renderConfig.size.width - 2;
        const bigBarHeight = 5;
        const bigBarX = this.renderConfig.coordinates.x + 1;
        const bigBarY = this.renderConfig.coordinates.y - bigBarHeight - 13;
        const bigBarFillWidth = (BigBullet.SHOOT_TIMER / BigBullet.BASE_SHOOT_TIMER) * bigBarWidth;

        // // Draw the black box
        ctx.fillStyle = '#2c2c2c';
        ctx.fillRect(bigBarX, bigBarY, bigBarWidth, bigBarHeight);

        // // Draw the white outline
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2; // Set the width of the outline
        ctx.strokeRect(bigBarX, bigBarY, bigBarWidth, bigBarHeight);

        // // Fill the box with white based on the fill width
        ctx.fillStyle = 'white';
        ctx.fillRect(bigBarX, bigBarY, bigBarFillWidth, bigBarHeight);
    }

    public renderHp(): void {
        // Render hp as white dots to the left of the player
        const ctx = State.getCtx();
        const playerHeight = this.renderConfig.size.height;
        const indicatorHeight = 8;
        const gap = 5;
        const totalIndicatorsHeight = this.hp * (indicatorHeight + gap) - gap; // Adjust total height to include gaps
        const startY = this.renderConfig.coordinates.y + (playerHeight - totalIndicatorsHeight) / 2;

        ctx.fillStyle = 'white';
        for (let i = 0; i < this.hp; i++) {
            ctx.fillRect(
                this.renderConfig.coordinates.x - 12,
                startY + i * (indicatorHeight + gap),
                indicatorHeight,
                indicatorHeight
            );
        }
    }
}
