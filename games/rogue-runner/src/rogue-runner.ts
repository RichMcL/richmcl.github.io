import { DefaultDialogRenderConfig, Dialog } from './dialog';
import { Enemy } from './enemy';
import { Player } from './player';
import { State } from './state';
import { Stats } from './stats';

export class Game {
    public lastTimestamp: number = 0;
    public enemySpawnTimer: number = 0;
    public baseEnemySpawnRate: number = 90;
    public gameOver = false;

    constructor() {
        State.setCanvas(document.getElementById('game-canvas') as HTMLCanvasElement);
        State.setCtx(State.getCanvas().getContext('2d'));

        // Wait for both images to load before starting the game
        Promise.all([this.loadFont('Base-Font', 'fonts/PressStart2P-Regular.ttf')]).then(() => {
            this.startGame();
        });
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
        State.getCanvas().addEventListener('click', event => {
            const rect = State.getCanvas().getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            State.setClickCoordinates({ x, y });

            State.setMouseClick(true);
        });

        document.body.classList.add('hide-cursor');

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

        State.incrementTimerInMs(elapsed);

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

                    if (State.isGameOver()) return;
                    State.setGameOver(true);
                    this.gameOver = true;

                    const gameOverDialog = new Dialog(DefaultDialogRenderConfig.coordinates);

                    console.log('gameOverDialog', gameOverDialog);

                    State.addGameComponent(gameOverDialog);
                }
            }
        }

        State.getPlayer().update();

        for (const component of State.getGameComponents()) {
            component.update();
        }

        this.enemySpawnTimer++;

        //Spawn enemies every 2 seconds
        if (this.enemySpawnTimer === this.baseEnemySpawnRate) {
            const player = State.getPlayer();

            const coords = {
                x: 640,
                y: 830
            };
            const enemy = new Enemy(coords);
            State.addGameComponent(enemy);
            this.enemySpawnTimer = 0;
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

        this.renderGamepadCursor();
    }

    public renderGamepadCursor(): void {
        State.getCtx().save();

        // Draw the pixelated hand cursor
        const cursor = [
            [1, 1, 0, 0, 0, 0, 0],
            [1, 1, 1, 0, 0, 0, 0],
            [1, 1, 1, 1, 0, 0, 0],
            [1, 1, 1, 1, 1, 0, 0],
            [1, 1, 1, 1, 0, 1, 0],
            [1, 0, 1, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]
        ];

        const pixelSize = 3;
        const mouseX = State.getScaledMouseCoordinates().x;
        const mouseY = State.getScaledMouseCoordinates().y;

        // Draw the outline
        State.getCtx().fillStyle = 'black';
        cursor.forEach((row, rowIndex) => {
            row.forEach((pixel, colIndex) => {
                if (pixel) {
                    State.getCtx().fillRect(
                        mouseX + colIndex * pixelSize - 1,
                        mouseY + rowIndex * pixelSize - 1,
                        pixelSize + 2,
                        pixelSize + 2
                    );
                }
            });
        });

        // Draw the filled cursor
        State.getCtx().fillStyle = 'white';
        cursor.forEach((row, rowIndex) => {
            row.forEach((pixel, colIndex) => {
                if (pixel) {
                    State.getCtx().fillRect(
                        mouseX + colIndex * pixelSize,
                        mouseY + rowIndex * pixelSize,
                        pixelSize,
                        pixelSize
                    );
                }
            });
        });

        State.getCtx().restore();
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
