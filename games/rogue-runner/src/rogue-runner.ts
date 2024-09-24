import { DefaultDialogRenderConfig, GameOverDialog } from './game-over-dialog';
import { Enemy } from './enemy';
import { Player } from './player';
import { State } from './state';
import { Stats } from './stats';

export class Game {
    public lastTimestamp: number = 0;
    public enemySpawnTimer: number = 0;
    public timeUntilSpawn = 0;
    public enemySpawnMin = 1 * 60; // seconds * fps
    public enemySpawnMax = 3 * 60; // seconds * fps

    public gameOver = false;

    constructor() {
        State.setCanvas(document.getElementById('game-canvas') as HTMLCanvasElement);
        State.setCtx(State.getCanvas().getContext('2d'));

        // Wait for both images to load before starting the game
        Promise.all([this.loadFont('Base-Font', 'fonts/PressStart2P-Regular.ttf')]).then(() => {
            this.startGame();
        });

        this.timeUntilSpawn =
            Math.random() * (this.enemySpawnMax - this.enemySpawnMin) + this.enemySpawnMin;
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

        if (!State.isGameOver()) {
            State.incrementTimerInMs(elapsed);
        }

        // Update game state
        this.updateGameState();

        // Render changes to the DOM
        this.render();

        this.resetGameState();

        // Request the next frame
        requestAnimationFrame(ts => this.gameLoop(ts));
    }

    public updateGameState() {
        //remove all gameComponents with deleteMe set to true
        State.removeAllDeletedGameComponents();

        //if Player collides with an enemy, end the game
        for (const component of State.getGameComponents()) {
            if (component.constructor.name === 'Enemy') {
                if (
                    State.getPlayer().renderConfig.coordinates.x <
                        component.renderConfig.coordinates.x + component.renderConfig.size.width &&
                    State.getPlayer().renderConfig.coordinates.x +
                        State.getPlayer().renderConfig.size.width >
                        component.renderConfig.coordinates.x &&
                    State.getPlayer().renderConfig.coordinates.y <
                        component.renderConfig.coordinates.y + component.renderConfig.size.height &&
                    State.getPlayer().renderConfig.coordinates.y +
                        State.getPlayer().renderConfig.size.height >
                        component.renderConfig.coordinates.y
                ) {
                    // State.setGameRunning(false);

                    if (!State.isGameOver()) {
                        State.setGameOver(true);
                        this.gameOver = true;

                        const gameOverDialog = new GameOverDialog(
                            DefaultDialogRenderConfig.coordinates
                        );

                        State.addGameComponent(gameOverDialog);
                    }
                }
            }
        }

        State.getPlayer().update();

        for (const component of State.getGameComponents()) {
            component.update();
        }

        this.doEnemySpawns();
    }

    public doEnemySpawns() {
        if (this.timeUntilSpawn < 0) {
            const coords = {
                x: 640,
                y: 830
            };
            const enemy = new Enemy(coords);
            State.addGameComponent(enemy);

            //number in between min and max
            this.timeUntilSpawn =
                Math.random() * (this.enemySpawnMax - this.enemySpawnMin) + this.enemySpawnMin;
        } else {
            this.timeUntilSpawn--;
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
