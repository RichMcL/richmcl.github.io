import { DefaultDialogRenderConfig, GameOverDialog } from './game-over-dialog';
import { BounceEnemy, Enemy, FlyingEnemy, SimpleEnemy } from './enemy';
import { Player } from './player';
import { State } from './state';
import { Stats } from './stats';
import { Coordinates } from './types';
import { EnemyExplosion } from './enemy-explosion';

export class Game {
    public lastTimestamp: number = 0;
    public enemySpawnTimer: number = 0;
    // public timeUntilSpawn = 0;
    // public enemySpawnMin = 1 * 60; // seconds * fps
    // public enemySpawnMax = 3 * 60; // seconds * fps

    public gameOver = false;
    public accumulatedTime: number = 0;
    public frameCount: number = 0;
    public fps: number = 0;
    public fpsLastTimestamp: number = 0;
    public FRAME_DURATION = 1000 / 60; // 60 FPS

    constructor() {
        State.setCanvas(document.getElementById('game-canvas') as HTMLCanvasElement);
        State.setCtx(State.getCanvas().getContext('2d'));

        // Wait for both images to load before starting the game
        Promise.all([this.loadFont('Base-Font', 'fonts/PressStart2P-Regular.ttf')]).then(() => {
            this.startGame();
        });

        // this.timeUntilSpawn =
        //     Math.random() * (this.enemySpawnMax - this.enemySpawnMin) + this.enemySpawnMin;
    }

    // Function to load the custom font
    private loadFont(fontName: string, fontUrl: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const font = new FontFace(fontName, `url(${fontUrl})`);
            font.load()
                .then(loadedFont => {
                    // Add the font to the document
                    (document.fonts as any).add(loadedFont);
                    resolve();
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    public startGame() {
        console.log('Game started', this);

        // Add click event listener
        State.getCanvas().addEventListener('mousedown', event => {
            const rect = State.getCanvas().getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            State.setClickCoordinates({ x, y });

            State.setMouseClick(true);
        });

        State.getCanvas().addEventListener('touchstart', event => {
            const rect = State.getCanvas().getBoundingClientRect();
            const touch = event.touches[0]; // Get the first touch point
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;

            State.setClickCoordinates({ x, y });
            State.setMouseClick(true);

            event.preventDefault(); // Prevent long-press context menu
        });

        // Add touchmove event listener to prevent pinch zoom
        State.getCanvas().addEventListener('touchmove', event => {
            event.preventDefault(); // Prevent pinch zoom
        });

        // Add touchend event listener to prevent default behavior
        State.getCanvas().addEventListener('touchend', event => {
            event.preventDefault(); // Prevent default behavior
        });

        // document.body.classList.add('hide-cursor');

        document.addEventListener('mousemove', event => {
            const rect = State.getCanvas().getBoundingClientRect();

            State.setMouseCoordinates({
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            });
        });

        State.setGameRunning(true);
        this.lastTimestamp = performance.now();

        this.initializeGameObjects();
        this.gameLoop();
    }

    public initializeGameObjects(): void {
        State.setPlayer(new Player());

        const statsSidebar = new Stats();

        State.addGameComponent(statsSidebar);
    }

    public gameLoop(timestamp: number = 0) {
        if (!State.isGameRunning()) return;

        const elapsed = timestamp - this.lastTimestamp;
        this.lastTimestamp = timestamp;

        this.accumulatedTime += elapsed;

        while (this.accumulatedTime >= this.FRAME_DURATION) {
            if (!State.isGameOver()) {
                State.incrementTimerInMs(this.FRAME_DURATION);
            }

            this.frameCount++;
            const fpsElapsed = timestamp - this.fpsLastTimestamp;
            if (fpsElapsed >= 1000) {
                // Update FPS every second
                this.fps = this.frameCount / (fpsElapsed / 1000);
                this.frameCount = 0;
                this.fpsLastTimestamp = timestamp;

                State.setFps(parseFloat(this.fps.toFixed(2)));
            }

            // Update game state
            this.updateGameState();

            this.accumulatedTime -= this.FRAME_DURATION;
            this.resetGameState();
        }
        // Render changes to the DOM
        this.render();

        // Request the next frame
        requestAnimationFrame(ts => this.gameLoop(ts));
    }

    public updateGameState() {
        //remove all gameComponents with deleteMe set to true
        State.removeAllDeletedGameComponents();

        const player = State.getPlayer();

        //if Player collides with an enemy, end the game
        (State.getEnemies() as Enemy[]).forEach(enemy => {
            if (
                player.renderConfig.coordinates.x <
                    enemy.renderConfig.coordinates.x + enemy.renderConfig.size.width &&
                player.renderConfig.coordinates.x + player.renderConfig.size.width >
                    enemy.renderConfig.coordinates.x &&
                player.renderConfig.coordinates.y <
                    enemy.renderConfig.coordinates.y + enemy.renderConfig.size.height &&
                player.renderConfig.coordinates.y + player.renderConfig.size.height >
                    enemy.renderConfig.coordinates.y
            ) {
                // State.setGameRunning(false);

                if (!State.isGameOver() && !player.isIframe) {
                    player.hp -= enemy.damage;
                    player.doIframes();
                }

                if (player.hp <= 0) {
                    if (!State.isGameOver()) {
                        State.setGameOver(true);
                        this.gameOver = true;

                        const gameOverDialog = new GameOverDialog(
                            DefaultDialogRenderConfig.coordinates
                        );

                        State.addGameComponent(gameOverDialog);
                    }
                } else {
                    enemy.deleteMe = true;

                    const explosion = new EnemyExplosion(
                        {
                            x: enemy.renderConfig.coordinates.x + enemy.renderConfig.size.width / 2,
                            y: enemy.renderConfig.coordinates.y + enemy.renderConfig.size.height / 2
                        },
                        enemy
                    );
                    State.addGameComponent(explosion);
                }
            }
        });

        player.update();

        for (const component of State.getGameComponents()) {
            component.update();
        }

        this.doEnemySpawns();
    }

    public doEnemySpawns() {
        //Simple enemy spawn
        if (SimpleEnemy.TIME_UNTIL_SPAWN < 0) {
            let coords: Coordinates = {
                x: 640,
                y: 830
            };
            let enemy: Enemy;

            enemy = new SimpleEnemy(coords);
            State.addGameComponent(enemy);

            //number in between min and max
            SimpleEnemy.TIME_UNTIL_SPAWN =
                Math.random() * (SimpleEnemy.ENEMY_SPAWN_MAX - SimpleEnemy.ENEMY_SPAWN_MIN) +
                SimpleEnemy.ENEMY_SPAWN_MIN;
        } else {
            SimpleEnemy.TIME_UNTIL_SPAWN--;
        }

        //Flying enemy spawn
        if (FlyingEnemy.TIME_UNTIL_SPAWN < 0) {
            let coords: Coordinates = {
                x: 640,
                y: 650
            };
            let enemy: Enemy;

            enemy = new FlyingEnemy(coords);

            State.addGameComponent(enemy);

            //number in between min and max
            FlyingEnemy.TIME_UNTIL_SPAWN =
                Math.random() * (FlyingEnemy.ENEMY_SPAWN_MAX - FlyingEnemy.ENEMY_SPAWN_MIN) +
                FlyingEnemy.ENEMY_SPAWN_MIN;
        } else {
            FlyingEnemy.TIME_UNTIL_SPAWN--;
        }

        if (BounceEnemy.TIME_UNTIL_SPAWN < 0) {
            let enemy: Enemy;

            enemy = new BounceEnemy();
            State.addGameComponent(enemy);

            //number in between min and max
            BounceEnemy.TIME_UNTIL_SPAWN =
                Math.random() * (BounceEnemy.ENEMY_SPAWN_MAX - BounceEnemy.ENEMY_SPAWN_MIN) +
                BounceEnemy.ENEMY_SPAWN_MIN;
        } else {
            BounceEnemy.TIME_UNTIL_SPAWN--;
        }
    }

    public resetGameState(): void {
        State.setClickCoordinates(null);
        State.setMouseClick(false);
        State.setGamepadButtonClick(false);
    }

    public render() {
        State.getCtx().clearRect(0, 0, State.getCanvas().width, State.getCanvas().height); // Clear canvas

        State.getPlayer().render();

        for (const component of State.getGameComponents()) {
            component.render();
        }
    }

    /* LOGIC FUNCTIONS */

    /* USER ACTION FUNCTIONS */

    /* RENDER FUNCTIONS */

    public scaleGame() {
        console.log('Scaling game');
        const currentWidth = window.innerWidth;
        const currentHeight = window.innerHeight;
        State.setWindowAspectRatio(currentWidth / currentHeight);

        // Determine the scale factor
        if (State.getWindowAspectRatio() > State.getGameAspectRatio()) {
            // Window is wider than game aspect ratio
            State.setScaleFactor(currentHeight / 1000);
        } else {
            // Window is narrower than game aspect ratio
            State.setScaleFactor(currentWidth / 640);
        }

        // Apply the scale factor to the game container
        const gameContainer = document.getElementById('game-canvas');
        gameContainer.style.transform = `scale(${State.getScaleFactor()})`;
        gameContainer.style.width = `${640}px`;
        gameContainer.style.height = `${1000}px`;
    }
}
