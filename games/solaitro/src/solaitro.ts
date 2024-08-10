import { Pile, PilesRenderConfig } from './pile';
import { Player } from './player';
import { doesAnyRulePass, RuleInfo, RuleNames } from './rules';
import { ScoreGraphic } from './score-graphic';
import { Theme, Themes } from './theme';
import {
    Card,
    CardValue,
    Coordinates,
    GameButton,
    GameComponent,
    Suit,
    ThemeButton
} from './types';
import {
    buildAndShuffleDeck,
    drawCard,
    drawCardBack,
    drawIcon,
    drawRoundedRect,
    printText
} from './util';

export class Game {
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public gameAspectRatio: number = 1280 / 800;
    public windowAspectRatio: number;
    public scaleFactor: number;
    public theme: Theme = Themes.default;

    public player: Player;

    public pile1: Pile;
    public pile2: Pile;
    public pile3: Pile;
    public pile4: Pile;

    public ruleNames: RuleNames[] = [RuleNames.klondike, RuleNames.reverseKlondike];
    public gameComponents: GameComponent[] = [];

    public cardFaceSpriteSheet: HTMLImageElement;
    public cardBackSpriteSheet: HTMLImageElement;
    public iconSpriteSheet: HTMLImageElement;
    public clickCoordinates: Coordinates = { x: 0, y: 0 };
    public scaledClickCoordinates: Coordinates = { x: 0, y: 0 };

    public mouseCoordinates: Coordinates = { x: 0, y: 0 };
    public scaledMouseCoordinates: Coordinates = { x: 0, y: 0 };
    public isMouseClicked: boolean = false;

    public gameRunning: boolean = true;
    public timerInMs: number = 0;
    public lastTimestamp: number = 0;

    public score = 0;
    public streak = 0;

    public buttons: GameButton[] = [];
    public themeButtons: ThemeButton[] = [];
    public lastCardClicked: Card;
    public isDealNewRound: boolean = true;

    constructor() {
        this.canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d');

        this.cardFaceSpriteSheet = new Image();
        this.cardFaceSpriteSheet.src = 'img/deck-sprite-sheet.png';

        this.cardBackSpriteSheet = new Image();
        this.cardBackSpriteSheet.src = 'img/card-backs-seals.png';

        this.iconSpriteSheet = new Image();
        this.iconSpriteSheet.src = 'img/icons.png';

        // Wait for both images to load before starting the game
        Promise.all([
            this.loadImage(this.cardFaceSpriteSheet),
            this.loadImage(this.cardBackSpriteSheet),
            this.loadImage(this.iconSpriteSheet)
        ]).then(() => {
            this.startGame();
        });
    }

    private loadImage(image: HTMLImageElement): Promise<void> {
        return new Promise(resolve => {
            image.onload = () => resolve();
        });
    }

    public startGame() {
        console.log('Game started', this);

        // Add click event listener
        this.canvas.addEventListener('click', event => {
            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            this.clickCoordinates = { x, y };
            this.scaledClickCoordinates = { x: x / this.scaleFactor, y: y / this.scaleFactor };

            this.isMouseClicked = true;
        });

        document.addEventListener('mousemove', event => {
            const rect = this.canvas.getBoundingClientRect();

            this.mouseCoordinates = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            };

            this.scaledMouseCoordinates = {
                x: this.mouseCoordinates.x / this.scaleFactor,
                y: this.mouseCoordinates.y / this.scaleFactor
            };
        });

        this.gameRunning = true;
        this.lastTimestamp = performance.now();

        this.player = new Player(this.ctx, this.cardFaceSpriteSheet, this.cardBackSpriteSheet);

        this.initializePiles();
        this.isDealNewRound = false;

        this.initializeGameObjects();
        this.gameLoop();
    }

    public initializeGameObjects(): void {
        this.createFreeButton();
        this.createReloadButton();
        this.createDealButton();
        this.createHitButton();
        this.createThemeButtons();
    }

    public gameLoop(timestamp: number = 0) {
        if (!this.gameRunning) return;

        const elapsed = timestamp - this.lastTimestamp;
        this.lastTimestamp = timestamp;

        // Increment the timer by the elapsed time
        this.timerInMs += elapsed;

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
        this.gameComponents = this.gameComponents.filter(component => !component.deleteMe);

        //update each gameComponent
        this.gameComponents.forEach(component => component.update());

        // Update the game state logic
        let hoverButton: GameButton;

        //loop through objects and check if click is within the boundaries
        this.buttons.forEach(button => {
            if (
                this.scaledMouseCoordinates?.x >= button.coordinates.x &&
                this.scaledMouseCoordinates?.x <= button.coordinates.x + button.size.width &&
                this.scaledMouseCoordinates?.y >= button.coordinates.y &&
                this.scaledMouseCoordinates?.y <= button.coordinates.y + button.size.height
            ) {
                hoverButton = button;
                hoverButton.isHovered = true;
            }
        });

        if (hoverButton && this.isMouseClicked) {
            switch (hoverButton.id) {
                case 'reload':
                    window.location.reload();
                    break;
                case 'deal':
                    this.isDealNewRound = true;
                    break;
                case 'free':
                    //toggle RuleNames.free
                    if (this.ruleNames.includes(RuleNames.free)) {
                        this.ruleNames = this.ruleNames.filter(rule => rule !== RuleNames.free);
                    } else {
                        this.ruleNames.push(RuleNames.free);
                    }
                    break;
                case 'hit':
                    this.hitCard();
                    break;
            }
        }

        let hoverThemeButton: ThemeButton;

        this.themeButtons.forEach(button => {
            if (
                this.scaledMouseCoordinates?.x >= button.coordinates.x &&
                this.scaledMouseCoordinates?.x <= button.coordinates.x + button.size.width &&
                this.scaledMouseCoordinates?.y >= button.coordinates.y &&
                this.scaledMouseCoordinates?.y <= button.coordinates.y + button.size.height
            ) {
                hoverThemeButton = button;
                hoverThemeButton.isHovered = true;
            }
        });

        if (hoverThemeButton && this.isMouseClicked) {
            this.theme = hoverThemeButton.theme;
        }

        let hoverCard: Card;

        if (
            this.scaledMouseCoordinates?.x >= this.player.renderConfig.coordinates.x &&
            this.scaledMouseCoordinates?.x <=
                this.player.renderConfig.coordinates.x +
                    this.player.renderConfig.size.width * this.player.renderConfig.scale &&
            this.scaledMouseCoordinates?.y >= this.player.renderConfig.coordinates.y &&
            this.scaledMouseCoordinates?.y <=
                this.player.renderConfig.coordinates.y +
                    this.player.renderConfig.size.height * this.player.renderConfig.scale
        ) {
            hoverCard = this.player.getCurrentCard();
        }

        if (hoverCard && this.isMouseClicked) {
            this.lastCardClicked = hoverCard;
            console.log('Player card clicked', hoverCard);
        }

        let hoverPile: Pile;
        let hoverPileCard: Card;
        [this.pile1, this.pile2, this.pile3, this.pile4].forEach(pile => {
            const card = pile.getTopCard();
            if (
                this.scaledMouseCoordinates?.x >= pile.renderConfig.coordinates.x &&
                this.scaledMouseCoordinates?.x <=
                    pile.renderConfig.coordinates.x +
                        pile.renderConfig.size.width * pile.renderConfig.scale &&
                this.scaledMouseCoordinates?.y >= pile.renderConfig.coordinates.y &&
                this.scaledMouseCoordinates?.y <=
                    pile.renderConfig.coordinates.y +
                        pile.renderConfig.size.height * pile.renderConfig.scale
            ) {
                if (doesAnyRulePass(this.ruleNames, this.player.getCurrentCard(), card)) {
                    hoverPile = pile;
                    hoverPileCard = card;
                }
            }
        });

        if (hoverPile) {
            hoverPile.isHovered = true;
        }

        if (hoverPileCard && this.isMouseClicked) {
            console.log('Pile click card', hoverPileCard);

            hoverPile.pushCard({
                ...hoverPileCard,
                suit: this.player.getCurrentCard().suit,
                value: this.player.getCurrentCard().value
            });

            this.player.removeTopCard();

            this.score += 10;
            this.streak++;

            this.gameComponents.push(new ScoreGraphic(this.ctx, { x: 610, y: 300 }, 10));
        }

        if (this.isDealNewRound) {
            this.player.hand = buildAndShuffleDeck(true);
            this.initializePiles();
            this.isDealNewRound = false;
        }
    }

    public resetGameState(): void {
        this.clickCoordinates = null;
        this.scaledClickCoordinates = null;
        this.isMouseClicked = false;

        [this.pile1, this.pile2, this.pile3, this.pile4].forEach(pile => {
            pile.isHovered = false;
        });

        this.buttons.forEach(button => {
            button.isHovered = false;
        });

        this.themeButtons.forEach(button => {
            button.isHovered = false;
        });
    }

    public createReloadButton(): void {
        const text = 'RELOAD';
        const padding = 20; // Padding for the button
        const textMetrics = this.ctx.measureText(text);
        const textWidth = textMetrics.width;
        const buttonWidth = textWidth + padding * 2 + 5;
        const buttonHeight = 50;
        const x = 30;
        const y = 730;

        this.buttons.push({
            id: 'reload',
            text,
            padding,
            fillColor: this.theme.base,
            coordinates: {
                x,
                y
            },
            size: {
                width: buttonWidth,
                height: buttonHeight
            }
        });
    }

    public createFreeButton(): void {
        const text = 'FREE';
        const padding = 20; // Padding for the button
        const textMetrics = this.ctx.measureText(text);
        const textWidth = textMetrics.width;
        const buttonWidth = textWidth + padding * 2;
        const buttonHeight = 50;
        const x = 1100;
        const y = 670;

        this.buttons.push({
            id: 'free',
            text,
            padding,
            fillColor: this.theme.base,
            coordinates: {
                x,
                y
            },
            size: {
                width: buttonWidth,
                height: buttonHeight
            }
        });
    }

    public createDealButton(): void {
        const text = 'DEAL';
        const padding = 20; // Padding for the button
        const textMetrics = this.ctx.measureText(text);
        const textWidth = textMetrics.width;
        const buttonWidth = textWidth + padding * 2;
        const buttonHeight = 50;
        const x = 30;
        const y = 670;

        this.buttons.push({
            id: 'deal',
            text,
            padding,
            fillColor: this.theme.base,
            coordinates: {
                x,
                y
            },
            size: {
                width: buttonWidth,
                height: buttonHeight
            }
        });
    }

    public createHitButton(): void {
        const text = 'HIT';
        const padding = 20; // Padding for the button
        const textMetrics = this.ctx.measureText(text);
        const textWidth = textMetrics.width;
        const buttonWidth = textWidth + padding * 2;
        const buttonHeight = 50;
        const x = 610;
        const y = 390;

        this.buttons.push({
            id: 'hit',
            text,
            padding,
            fillColor: this.theme.base,
            coordinates: {
                x,
                y
            },
            size: {
                width: buttonWidth,
                height: buttonHeight
            }
        });
    }

    public createThemeButtons(): void {
        let i = 0;
        for (const theme of Object.keys(Themes)) {
            const padding = 20; // Padding for the button
            const buttonWidth = 50;
            const buttonHeight = 50;
            const x = 400 + i * (buttonWidth + padding);
            const y = 700;

            this.themeButtons.push({
                id: 'theme',
                text: '',
                theme: Themes[theme],
                padding,
                fillColor: Themes[theme].base,
                coordinates: {
                    x,
                    y
                },
                size: {
                    width: buttonWidth,
                    height: buttonHeight
                }
            });

            i++;
        }
    }

    public render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear canvas

        this.renderTheme();
        this.renderSidebar();
        this.renderRuleSidebar();
        this.player.render();
        this.renderPiles();
        this.renderDeckIndex();
        this.renderTimer();
        this.renderScore();
        this.renderStreak();
        this.renderMousePosition();
        this.renderLastCardClicked();
        this.renderButtons();
        this.renderThemeButtons();

        for (const component of this.gameComponents) {
            component.render();
        }
    }

    public renderTheme() {
        this.canvas.style.backgroundColor = this.theme.background;
    }

    public renderSidebar() {
        const x = 20;

        // Left border
        this.ctx.fillStyle = this.theme.base;
        this.ctx.fillRect(x - 3, 0, 3, 800);

        this.ctx.fillStyle = '#293a3a';
        this.ctx.fillRect(x, 0, 250, 800);

        // Right border
        this.ctx.fillStyle = this.theme.base;
        this.ctx.fillRect(x + 250, 0, 3, 800);
    }

    public renderRuleSidebar() {
        const x = 1007;

        // Left border
        this.ctx.fillStyle = this.theme.base;
        this.ctx.fillRect(x - 3, 0, 3, 800);

        this.ctx.fillStyle = '#293a3a';
        this.ctx.fillRect(x, 0, 250, 800);

        // Right border
        this.ctx.fillStyle = this.theme.base;
        this.ctx.fillRect(x + 250, 0, 3, 800);

        printText(this.ctx, 'Rules', x + 30, 40);

        //iterate over the riles an print their descriptions

        let y = 80;
        for (const rule of this.ruleNames) {
            const ruleInfo = RuleInfo[rule];
            printText(this.ctx, `- ${ruleInfo.name}`, x + 30, y);
            y += 30;
            printText(this.ctx, `  ${ruleInfo.description}`, x + 30, y, 15);
            y += 40;
        }
    }

    public renderButtons() {
        this.buttons.forEach(button => {
            this.ctx.fillStyle = this.theme.base;
            this.ctx.fillRect(
                button.coordinates.x,
                button.coordinates.y,
                button.size.width,
                button.size.height
            );

            printText(
                this.ctx,
                button.text,
                button.coordinates.x + button.padding / 2,
                button.coordinates.y + button.padding * 1.75
            );

            // Draw a border around the button if it's hovered
            if (button.isHovered) {
                this.ctx.strokeStyle = 'white';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(
                    button.coordinates.x,
                    button.coordinates.y,
                    button.size.width,
                    button.size.height
                );
            }
        });
    }

    public renderThemeButtons() {
        this.themeButtons.forEach(button => {
            this.ctx.fillStyle = button.fillColor;
            this.ctx.fillRect(
                button.coordinates.x,
                button.coordinates.y,
                button.size.width,
                button.size.height
            );

            // Draw a border around the button if it's hovered
            if (button.isHovered) {
                this.ctx.strokeStyle = 'white';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(
                    button.coordinates.x,
                    button.coordinates.y,
                    button.size.width,
                    button.size.height
                );
            }
        });
    }

    public renderDeckIndex() {
        const fixedWidth = 71 * 1.5; // Define the fixed width
        const text = `${this.player.handIndex} / ${this.player.hand?.length}`;
        const textWidth = this.ctx.measureText(text).width;
        const x = 585 + (fixedWidth - textWidth) / 2; // Calculate the x-coordinate to center the text

        printText(this.ctx, `${this.player.handIndex + 1}  / ${this.player.hand?.length}`, x, 645);
    }

    public renderPiles(): void {
        [this.pile1, this.pile2, this.pile3, this.pile4].forEach(pile => {
            pile.render();
        });
    }

    public renderTimer(): void {
        const minutes = Math.floor(this.timerInMs / 60000)
            .toString()
            .padStart(2, '0');
        const seconds = Math.floor((this.timerInMs % 60000) / 1000)
            .toString()
            .padStart(2, '0');
        const tenths = Math.floor((this.timerInMs % 1000) / 100)
            .toString()
            .padStart(1, '0');

        printText(this.ctx, `Time: ${minutes}:${seconds}.${tenths}`, 30, 40);
    }

    public renderScore(): void {
        printText(this.ctx, `Score: ${this.score}`, 30, 80);
    }

    public renderStreak(): void {
        printText(this.ctx, `Streak: ${this.streak}`, 30, 120);
    }

    public renderMousePosition(): void {
        const x = parseFloat(this.scaledMouseCoordinates.x.toFixed(0));
        const y = parseFloat(this.scaledMouseCoordinates.y.toFixed(0));
        printText(this.ctx, `Cursor: X ${x} | Y ${y}`, 30, 640);
    }

    public renderLastCardClicked(): void {
        const card = this.lastCardClicked;
        if (card) {
            printText(this.ctx, `Card: ${card.value}`, 30, 160);
            drawIcon(this.ctx, this.iconSpriteSheet, card.suit, 120, 143);
        }
    }

    public pauseGame() {
        this.gameRunning = false;
    }

    /* LOGIC FUNCTIONS */

    public initializePiles(): void {
        this.pile1 = new Pile(
            this.ctx,
            PilesRenderConfig.pile1.coordinates,
            this.cardFaceSpriteSheet,
            this.cardBackSpriteSheet,
            'pile1'
        );
        this.pile2 = new Pile(
            this.ctx,
            PilesRenderConfig.pile2.coordinates,
            this.cardFaceSpriteSheet,
            this.cardBackSpriteSheet,
            'pile2'
        );
        this.pile3 = new Pile(
            this.ctx,
            PilesRenderConfig.pile3.coordinates,
            this.cardFaceSpriteSheet,
            this.cardBackSpriteSheet,
            'pile3'
        );
        this.pile4 = new Pile(
            this.ctx,
            PilesRenderConfig.pile4.coordinates,
            this.cardFaceSpriteSheet,
            this.cardBackSpriteSheet,
            'pile4'
        );

        // Pop the first 4 cards from the deck and add them to the piles
        this.pile1.pushCard(this.player.hand.pop());
        this.pile2.pushCard(this.player.hand.pop());
        this.pile3.pushCard(this.player.hand.pop());
        this.pile4.pushCard(this.player.hand.pop());
    }

    public hitCard(): void {
        this.streak = 0;
        this.player.hit();
    }

    /* USER ACTION FUNCTIONS */

    /* RENDER FUNCTIONS */

    public scaleGame() {
        console.log('Scaling game');
        const currentWidth = window.innerWidth;
        const currentHeight = window.innerHeight;
        this.windowAspectRatio = currentWidth / currentHeight;

        // Determine the scale factor
        if (this.windowAspectRatio > this.gameAspectRatio) {
            // Window is wider than game aspect ratio
            this.scaleFactor = currentHeight / 800;
        } else {
            // Window is narrower than game aspect ratio
            this.scaleFactor = currentWidth / 1280;
        }

        // Apply the scale factor to the game container
        const gameContainer = document.getElementById('game-canvas');
        gameContainer.style.transform = `scale(${this.scaleFactor})`;
        gameContainer.style.transformOrigin = 'top left';
        gameContainer.style.width = `${1280}px`;
        gameContainer.style.height = `${800}px`;
    }
}
