import { CardAnimation } from './card-animation';
import { Levels } from './level';
import { PileContainer } from './pile-container';
import { Player } from './player';
import { RuleSidebar } from './rule-sidebar';
import { ScoreGraphic } from './score-graphic';
import { Scorebar } from './scorebar';
import { State } from './state';
import { StatsSidebar } from './stats-sidebar';
import { Swirl } from './swirl';
import { SwirlThemes, Theme, Themes } from './theme';
import { Card } from './types';
import { buildAndShuffleDeck, drawIcon, printText } from './util';

export class Game {
    public lastTimestamp: number = 0;

    public lastCardClicked: Card;
    public isDealNewRound: boolean = true;

    // Add a property to track the previous state of the gamepad buttons
    private previousButtonStates: boolean[] = [];
    public hasGamepad: boolean = false;

    constructor() {
        State.setCanvas(document.getElementById('game-canvas') as HTMLCanvasElement);
        State.setCtx(State.getCanvas().getContext('2d'));

        const cardFaceSpriteSheet = new Image();
        cardFaceSpriteSheet.src = 'img/deck-sprite-sheet-new-2.png';

        State.setCardFaceSpriteSheet(cardFaceSpriteSheet);

        const cardBackSpriteSheet = new Image();
        cardBackSpriteSheet.src = 'img/card-backs-seals-new-2.png';

        State.setCardBackSpriteSheet(cardBackSpriteSheet);

        const iconSpriteSheet = new Image();
        iconSpriteSheet.src = 'img/icons.png';

        State.setIconSpriteSheet(iconSpriteSheet);

        const ruleIconSpriteSheet = new Image();
        ruleIconSpriteSheet.src = 'img/rule-icons.png';

        State.setRuleIconSpriteSheet(ruleIconSpriteSheet);

        // Wait for both images to load before starting the game
        Promise.all([
            this.loadImage(cardFaceSpriteSheet),
            this.loadImage(cardBackSpriteSheet),
            this.loadImage(iconSpriteSheet),
            this.loadImage(ruleIconSpriteSheet),
            this.loadFont('New-Amsterdam', 'fonts/new-amsterdam/new-amsterdam.ttf')
        ]).then(() => {
            this.startGame();
        });

        State.setSwirl(new Swirl());
        State.getSwirl().doSwirl(SwirlThemes.default);
    }

    private loadImage(image: HTMLImageElement): Promise<void> {
        return new Promise(resolve => {
            image.onload = () => resolve();
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

        window.addEventListener('gamepadconnected', event => {
            console.log('Gamepad connected:', event.gamepad);
            this.hasGamepad = true;
        });

        window.addEventListener('gamepaddisconnected', event => {
            console.log('Gamepad disconnected:', event.gamepad);
            this.hasGamepad = false;
        });

        State.setGameRunning(true);
        this.lastTimestamp = performance.now();

        this.isDealNewRound = false;

        this.initializeGameObjects();
        this.gameLoop();
    }

    public initializeGameObjects(): void {
        State.setPlayer(new Player());
        State.setPileContainer(new PileContainer());

        State.getPileContainer().initializePiles();

        const scorebar = new Scorebar();
        const statsSidebar = new StatsSidebar();
        const ruleSidebar = new RuleSidebar();

        State.setScorebar(scorebar);
        State.getScorebar().setMaxScore(Levels[State.getCurrentLevel()].scoreToBeat);

        State.addGameComponent(scorebar);
        State.addGameComponent(statsSidebar);
        State.addGameComponent(ruleSidebar);
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

        const gamepads = navigator.getGamepads();
        for (const gamepad of gamepads) {
            if (gamepad) {
                this.handleGamepadInput(gamepad);
            }
        }

        // Request the next frame
        requestAnimationFrame(ts => this.gameLoop(ts));
    }

    private handleGamepadInput(gamepad: Gamepad) {
        if (this.previousButtonStates.length === 0) {
            this.initializePreviousButtonStates(gamepad);
        }

        for (let i = 0; i < gamepad.buttons.length; i++) {
            if (gamepad.buttons[i].pressed && !this.previousButtonStates[i]) {
                console.log(`Button ${i} pressed`);
                State.setGamepadButtonClick(true);
            }
            this.previousButtonStates[i] = gamepad.buttons[i].pressed;
        }

        // Example: Map gamepad axes to game actions
        const xAxis = gamepad.axes[0];
        const yAxis = gamepad.axes[1];
        if (xAxis !== 0 || yAxis !== 0) {
            console.log(`Joystick moved: x=${xAxis}, y=${yAxis}`);

            // Get the current mouse position
            const rect = State.getCanvas().getBoundingClientRect();
            let mouseX = State.getMouseCoordinates().x;
            let mouseY = State.getMouseCoordinates().y;

            // Update the mouse position based on joystick input
            const speed = 15; // Adjust the speed as needed
            mouseX += xAxis * speed;
            mouseY += yAxis * speed;

            // Ensure the mouse position stays within the canvas bounds
            mouseX = Math.max(0, Math.min(rect.width, mouseX));
            mouseY = Math.max(0, Math.min(rect.height, mouseY));

            // Set the new mouse position
            State.setMouseCoordinates({ x: mouseX, y: mouseY });

            // Optionally, you can trigger a mouse move event if needed
            const mouseMoveEvent = new MouseEvent('mousemove', {
                clientX: mouseX + rect.left,
                clientY: mouseY + rect.top
            });
            State.getCanvas().dispatchEvent(mouseMoveEvent);
        }
    }

    public updateGameState() {
        if (
            State.getScore() >= Levels[State.getCurrentLevel()].scoreToBeat &&
            !this.isActiveAnimations() &&
            State.getScorebar().isAnimationComplete()
        ) {
            this.goToNextLevel();
        }

        //remove all gameComponents with deleteMe set to true
        State.removeAllDeletedGameComponents();

        //update each gameComponent
        State.getGameComponents().forEach(component => component.update());

        State.getPlayer().update();
        State.getPileContainer().update();
    }

    public goToNextLevel() {
        const drawPile = buildAndShuffleDeck(true);
        State.getPlayer().drawPile.setCards(drawPile);
        State.getPileContainer().initializePiles();

        State.getPlayer().playPile = [];
        State.getPlayer().hit();

        this.isDealNewRound = false;
        State.setScore(0);
        State.incrementCurrentLevel();

        //increment the theme the next object in the map
        const themeKeys = Object.keys(Themes);
        const currentThemeIndex = themeKeys.indexOf(State.getTheme().name);
        const nextThemeIndex = currentThemeIndex + 1;
        const nextTheme = themeKeys[nextThemeIndex % themeKeys.length];

        if (nextThemeIndex > themeKeys.length - 1) {
            State.setTheme(Themes.default);
        }

        this.changeTheme(Themes[nextTheme]);
        State.addGameComponent(new ScoreGraphic({ x: 540, y: 350 }, 'Next Level!'));
        State.getPlayer().shufflesRemaining = State.getPlayer().startingShuffles;

        State.getScorebar().reset();
        State.getScorebar().setMaxScore(Levels[State.getCurrentLevel()].scoreToBeat);
    }

    public resetGameState(): void {
        State.setClickCoordinates(null);
        State.setMouseClick(false);
        State.setGamepadButtonClick(false);
    }

    public render() {
        State.getCtx().clearRect(0, 0, State.getCanvas().width, State.getCanvas().height); // Clear canvas

        this.renderTheme();
        State.getPlayer().render();
        State.getPileContainer().render();

        this.renderLastCardClicked();

        for (const component of State.getGameComponents()) {
            component.render();
        }

        this.renderGamepadCursor();
    }

    public renderTheme() {
        document.body.style.backgroundColor = State.getTheme().black;
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

    public renderLastCardClicked(): void {
        const card = this.lastCardClicked;
        if (card) {
            printText(`Card: ${card.value}`, 30, 740);
            drawIcon(State.getIconSpriteSheet(), card.suit, 120, 723);
        }
    }

    /* LOGIC FUNCTIONS */

    public changeTheme(theme: Theme): void {
        State.setTheme(theme);
    }

    public isActiveAnimations(): boolean {
        let active = false;

        if (State.getPileContainer().doesAnyPileHaveAnimations()) {
            active = true;
        }

        return (
            active ||
            State.getGameComponents().some(component => component instanceof CardAnimation)
        );
    }

    private initializePreviousButtonStates(gamepad: Gamepad) {
        this.previousButtonStates = new Array(gamepad.buttons.length).fill(false);
    }

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
            State.setScaleFactor(currentHeight / 800);
        } else {
            // Window is narrower than game aspect ratio
            State.setScaleFactor(currentWidth / 1280);
        }

        // Apply the scale factor to the game container
        const gameContainer = document.getElementById('game-canvas');
        gameContainer.style.transform = `scale(${State.getScaleFactor()})`;
        gameContainer.style.width = `${1280}px`;
        gameContainer.style.height = `${800}px`;

        // Apply the scale factor to the game container
        const bgontainer = document.getElementById('bg-canvas');
        bgontainer.style.transform = `scale(${State.getScaleFactor()})`;
        bgontainer.style.width = `${1280}px`;
        bgontainer.style.height = `${800}px`;
    }
}
