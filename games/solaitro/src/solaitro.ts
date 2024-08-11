import {
    createCloseDialogButton,
    createDealButton,
    createFreeButtton,
    createHitButton,
    createOpenDialogButton,
    createReloadButton,
    createThemeButtons,
    GameButton,
    ThemeButton
} from './button';
import { DefaultDialogRenderConfig, Dialog } from './dialog';
import { Pile, PilesRenderConfig } from './pile';
import { Player } from './player';
import { doesAnyRulePass, RuleInfo, RuleNames } from './rules';
import { ScoreGraphic } from './score-graphic';
import { Theme, Themes } from './theme';
import { Card, Coordinates, GameComponent } from './types';
import { buildAndShuffleDeck, drawIcon, printText } from './util';

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
    public debugButtons: GameButton[] = [];
    public themeButtons: ThemeButton[] = [];
    public dialog: Dialog;
    public dialogCloseButton: GameButton;

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

        this.isDealNewRound = false;

        this.initializeGameObjects();
        this.gameLoop();
    }

    public initializeGameObjects(): void {
        this.player = new Player(this.ctx, this.cardFaceSpriteSheet, this.cardBackSpriteSheet);

        this.initializePiles();
        this.debugButtons.push(createReloadButton(this.ctx, this.theme));
        this.debugButtons.push(createFreeButtton(this.ctx, this.theme));
        this.debugButtons.push(createDealButton(this.ctx, this.theme));
        this.buttons.push(createHitButton(this.ctx, this.theme));
        this.buttons.push(createOpenDialogButton(this.ctx, this.theme));
        this.themeButtons = createThemeButtons(this.ctx);

        this.dialog = new Dialog(this.ctx, DefaultDialogRenderConfig.coordinates);
        this.dialogCloseButton = createCloseDialogButton(this.ctx, this.theme);
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

        [this.pile1, this.pile2, this.pile3, this.pile4].forEach(pile => {
            pile.update();
        });

        // Update the game state logic
        let hoverButton: GameButton;

        //loop through objects and check if click is within the boundaries

        if (this.dialog.visible) {
            this.debugButtons.forEach(button => {
                if (button.isHoveredOver(this.scaledMouseCoordinates)) {
                    hoverButton = button;
                    hoverButton.isHovered = true;
                }
            });

            let hoverThemeButton: ThemeButton;

            this.themeButtons.forEach(button => {
                if (button.isHoveredOver(this.scaledMouseCoordinates)) {
                    hoverThemeButton = button;
                    hoverThemeButton.isHovered = true;
                }
            });

            if (hoverThemeButton && this.isMouseClicked) {
                this.theme = hoverThemeButton.theme;

                // Set the theme on the buttons
                this.buttons.forEach(button => {
                    button.theme = this.theme;
                });
            }
        } else {
            this.buttons.forEach(button => {
                if (button.isHoveredOver(this.scaledMouseCoordinates)) {
                    hoverButton = button;
                    hoverButton.isHovered = true;
                }
            });
        }

        if (this.dialogCloseButton.isHoveredOver(this.scaledMouseCoordinates)) {
            hoverButton = this.dialogCloseButton;
            this.dialogCloseButton.isHovered = true;
        }

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
                case 'dialog-open':
                    this.dialog.visible = true;
                    break;
                case 'dialog-close':
                    this.dialog.visible = false;
                    break;
            }
        }

        let hoverCard: Card;

        if (this.player.isHoveredOver(this.scaledMouseCoordinates)) {
            hoverCard = this.player.getTopPlayCard();
        }

        if (hoverCard && this.isMouseClicked) {
            this.lastCardClicked = hoverCard;
            console.log('Play pile clicked', hoverCard);
        }

        let hoverPile: Pile;
        let hoverPileCard: Card;
        [this.pile1, this.pile2, this.pile3, this.pile4].forEach(pile => {
            const card = pile.getTopCard();
            if (pile.isHoveredOver(this.scaledMouseCoordinates)) {
                hoverPile = pile;
                if (doesAnyRulePass(this.ruleNames, this.player.getTopPlayCard(), card)) {
                    hoverPileCard = card;
                    hoverPile.canPlay = true;
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
                suit: this.player.getTopPlayCard().suit,
                value: this.player.getTopPlayCard().value
            });

            this.player.removeTopPlayCard();

            this.score += 10;
            this.streak++;

            this.gameComponents.push(new ScoreGraphic(this.ctx, { x: 610, y: 300 }, 10));
        }

        if (this.isDealNewRound) {
            this.player.drawPile = buildAndShuffleDeck(true);
            this.initializePiles();
            this.isDealNewRound = false;
        }
    }

    public resetGameState(): void {
        this.clickCoordinates = null;
        this.scaledClickCoordinates = null;
        this.isMouseClicked = false;

        [this.pile1, this.pile2, this.pile3, this.pile4].forEach(pile => {
            pile.reset();
        });

        this.buttons.forEach(button => {
            button.reset();
        });

        this.debugButtons.forEach(button => {
            button.reset();
        });

        this.themeButtons.forEach(button => {
            button.reset();
        });

        this.dialogCloseButton.reset();
    }

    public render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear canvas

        this.renderTheme();
        this.renderSidebar();
        this.renderRuleSidebar();

        this.player.render();
        [this.pile1, this.pile2, this.pile3, this.pile4].forEach(pile => {
            pile.render();
        });

        // this.renderDeckIndex();
        this.renderTimer();
        this.renderScore();
        this.renderStreak();
        this.renderMousePosition();
        this.renderLastCardClicked();
        this.buttons.forEach(button => button.render());

        for (const component of this.gameComponents) {
            component.render();
        }

        if (this.dialog.visible) {
            this.dialog.render();
            this.themeButtons.forEach(button => button.render());
            this.debugButtons.forEach(button => button.render());

            this.dialogCloseButton.render();
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
        printText(this.ctx, `Cursor: X ${x} | Y ${y}`, 30, 780);
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
        this.pile1.pushCard(this.player.drawPile.pop());
        this.pile2.pushCard(this.player.drawPile.pop());
        this.pile3.pushCard(this.player.drawPile.pop());
        this.pile4.pushCard(this.player.drawPile.pop());
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
