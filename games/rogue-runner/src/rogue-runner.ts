import { Player } from './player';
import { State } from './state';

export class Game {
    public lastTimestamp: number = 0;

    constructor() {
        State.setCanvas(document.getElementById('game-canvas') as HTMLCanvasElement);
        State.setCtx(State.getCanvas().getContext('2d'));

        // Wait for both images to load before starting the game
        Promise.all([this.loadFont('New-Amsterdam', 'fonts/new-amsterdam/new-amsterdam.ttf')]).then(
            () => {
                this.startGame();
            }
        );
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
        State.getPlayer().update();
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
            State.setScaleFactor(currentHeight / 1136);
        } else {
            // Window is narrower than game aspect ratio
            State.setScaleFactor(currentWidth / 640);
        }

        // Apply the scale factor to the game container
        const gameContainer = document.getElementById('game-canvas');
        gameContainer.style.transform = `scale(${State.getScaleFactor()})`;
        gameContainer.style.width = `${640}px`;
        gameContainer.style.height = `${1136}px`;
    }
}
