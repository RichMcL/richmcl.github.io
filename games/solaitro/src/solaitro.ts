import {
    createCloseDialogButton,
    createDealButton,
    createDecrementDrawSizeButton,
    createDecrementPlayPileButton,
    createDecrementShufflesButton,
    createFlushButton,
    createFreeButtton,
    createHitButton,
    createIncrementDrawSizeButton,
    createIncrementPlayPileButton,
    createIncrementShufflesButton,
    createKlondikeButton,
    createOpenDialogButton,
    createReloadButton,
    createReverseKlondikeButton,
    createSameValueButton,
    createThemeButtons,
    GameButton,
    ThemeButton
} from './button';
import { CardAnimation } from './card-animation';
import { DefaultDialogRenderConfig, Dialog } from './dialog';
import { Levels } from './level';
import { Pile, PilesRenderConfig } from './pile';
import { Player } from './player';
import {
    calculateScoreForRules,
    doesAnyRulePass,
    getAllPassingRules,
    RuleInfo,
    RuleNames
} from './rules';
import { ScoreGraphic } from './score-graphic';
import { Scorebar } from './scorebar';
import { Swirl } from './swirl';
import { SwirlThemes, Theme, Themes } from './theme';
import { Card, Coordinates, GameComponent } from './types';
import { buildAndShuffleDeck, drawIcon, printText } from './util';

export class Game {
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public gameAspectRatio: number = 1280 / 800;
    public windowAspectRatio: number;
    public scaleFactor: number;
    public theme: Theme = Themes.default;

    public swirl = new Swirl();

    public currentLevel = 0;

    public player: Player;

    public pile1: Pile;
    public pile2: Pile;
    public pile3: Pile;
    public pile4: Pile;

    public scorebar: Scorebar;

    public ruleNames: RuleNames[] = [RuleNames.klondike, RuleNames.reverseKlondike, RuleNames.free];
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
            this.loadImage(this.iconSpriteSheet),
            this.loadFont('Balatro', 'fonts/balatro/balatro.ttf')
        ]).then(() => {
            this.startGame();
        });

        this.swirl.doSwirl(SwirlThemes.default);
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
        this.debugButtons.push(createDecrementDrawSizeButton(this.ctx, this.theme));
        this.debugButtons.push(createIncrementDrawSizeButton(this.ctx, this.theme));
        this.debugButtons.push(createDecrementShufflesButton(this.ctx, this.theme));
        this.debugButtons.push(createIncrementShufflesButton(this.ctx, this.theme));
        this.debugButtons.push(createDecrementPlayPileButton(this.ctx, this.theme));
        this.debugButtons.push(createIncrementPlayPileButton(this.ctx, this.theme));
        this.debugButtons.push(createSameValueButton(this.ctx, this.theme));
        this.debugButtons.push(createFlushButton(this.ctx, this.theme));
        this.debugButtons.push(createKlondikeButton(this.ctx, this.theme));
        this.debugButtons.push(createReverseKlondikeButton(this.ctx, this.theme));
        this.debugButtons.push(createReloadButton(this.ctx, this.theme));
        this.debugButtons.push(createFreeButtton(this.ctx, this.theme));
        this.debugButtons.push(createDealButton(this.ctx, this.theme));
        this.buttons.push(createHitButton(this.ctx, this.theme));
        this.buttons.push(createOpenDialogButton(this.ctx, this.theme));
        this.themeButtons = createThemeButtons(this.ctx);

        this.dialog = new Dialog(this.ctx, DefaultDialogRenderConfig.coordinates);
        this.dialogCloseButton = createCloseDialogButton(this.ctx, this.theme);

        this.scorebar = new Scorebar(this.ctx);

        this.gameComponents.push(this.scorebar);
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
        if (
            this.score >= Levels[this.currentLevel].scoreToBeat &&
            !this.isActiveAnimations() &&
            this.scorebar.isAnimationComplete()
        ) {
            this.goToNextLevel();
        }

        //remove all gameComponents with deleteMe set to true
        this.gameComponents = this.gameComponents.filter(component => !component.deleteMe);

        //update each gameComponent
        this.gameComponents.forEach(component => component.update());

        [this.pile1, this.pile2, this.pile3, this.pile4].forEach(pile => {
            pile.update();
        });

        this.player.update();

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
                this.changeTheme(hoverThemeButton.theme);
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
                case 'klondike':
                    //toggle RuleNames.klondike
                    if (this.ruleNames.includes(RuleNames.klondike)) {
                        this.ruleNames = this.ruleNames.filter(rule => rule !== RuleNames.klondike);
                    } else {
                        this.ruleNames.push(RuleNames.klondike);
                    }
                    break;
                case 'reverse-klondike':
                    //toggle RuleNames.reverseKlondike
                    if (this.ruleNames.includes(RuleNames.reverseKlondike)) {
                        this.ruleNames = this.ruleNames.filter(
                            rule => rule !== RuleNames.reverseKlondike
                        );
                    } else {
                        this.ruleNames.push(RuleNames.reverseKlondike);
                    }
                    break;
                case 'flush':
                    //toggle RuleNames.flush
                    if (this.ruleNames.includes(RuleNames.flush)) {
                        this.ruleNames = this.ruleNames.filter(rule => rule !== RuleNames.flush);
                    } else {
                        this.ruleNames.push(RuleNames.flush);
                    }
                    break;
                case 'same-value':
                    //toggle RuleNames.sameValue
                    if (this.ruleNames.includes(RuleNames.sameValue)) {
                        this.ruleNames = this.ruleNames.filter(
                            rule => rule !== RuleNames.sameValue
                        );
                    } else {
                        this.ruleNames.push(RuleNames.sameValue);
                    }
                    break;
                case 'hit':
                    this.hitCard();
                    break;
                case 'increment-draw-size':
                    this.player.incrementPlayPileDrawSize();
                    break;
                case 'decrement-draw-size':
                    this.player.decrementPlayPileDrawSize();
                    break;
                case 'increment-shuffles':
                    this.player.incrementShuffles();
                    break;
                case 'decrement-shuffles':
                    this.player.decrementShuffles();
                    break;
                case 'increment-play-pile':
                    this.player.incrementPlayPileVisibleSize();
                    break;
                case 'decrement-play-pile':
                    this.player.decrementPlayPileVisibleSize();
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

            hoverPile.coordinates;

            hoverPile.addCardAnimation(
                new CardAnimation(
                    this.ctx,
                    this.player.getCoordinatesCopy(),
                    hoverPile.getCoordinatesCopy(),
                    this.cardFaceSpriteSheet,
                    this.cardBackSpriteSheet,
                    this.player.getTopPlayCard()
                )
            );

            hoverPile.pushCard({
                ...hoverPileCard,
                suit: this.player.getTopPlayCard().suit,
                value: this.player.getTopPlayCard().value
            });

            //get all passing rules
            const passingRules = getAllPassingRules(
                this.ruleNames,
                this.player.getTopPlayCard(),
                hoverPileCard
            );

            console.log('Passing rules', passingRules);

            const pointsForMove = calculateScoreForRules(passingRules, this.streak);
            this.score += pointsForMove;
            this.streak++;

            this.player.removeTopPlayCard();
            this.scorebar.setScoreToReach(this.score);

            // in the middle of the pile
            const scoreX =
                hoverPile.renderConfig.coordinates.x + hoverPile.renderConfig.size.width / 2;

            this.gameComponents.push(
                new ScoreGraphic(this.ctx, { x: scoreX, y: 300 }, pointsForMove)
            );
        }
    }

    public goToNextLevel() {
        this.player.drawPile = buildAndShuffleDeck(true);
        this.initializePiles();
        this.player.playPile = [];
        this.player.hit();

        this.isDealNewRound = false;
        this.score = 0;
        this.currentLevel++;

        //increment the theme the next object in the map
        const themeKeys = Object.keys(Themes);
        const currentThemeIndex = themeKeys.indexOf(this.theme.name);
        const nextThemeIndex = currentThemeIndex + 1;
        const nextTheme = themeKeys[nextThemeIndex % themeKeys.length];

        if (nextThemeIndex > themeKeys.length - 1) {
            this.theme = Themes.default;
        }

        this.changeTheme(Themes[nextTheme]);
        this.gameComponents.push(new ScoreGraphic(this.ctx, { x: 540, y: 350 }, 'Next Level!'));
        this.player.shufflesRemaining = this.player.startingShuffles;

        this.scorebar.reset();
        this.scorebar.setMaxScore(Levels[this.currentLevel].scoreToBeat);
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

        this.renderSidebarStats();

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
        // this.canvas.style.backgroundColor = this.theme.background;
        document.body.style.backgroundColor = this.theme.black;
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

        this.ruleNames.sort();
        for (const rule of this.ruleNames) {
            const ruleInfo = RuleInfo[rule];
            printText(this.ctx, `- ${ruleInfo.name}`, x + 30, y);
            y += 30;
            printText(this.ctx, `  ${ruleInfo.description}`, x + 30, y, 15);
            y += 40;
        }
    }

    public renderSidebarStats(): void {
        const level = Levels[this.currentLevel];
        const lines = [];

        const minutes = Math.floor(this.timerInMs / 60000)
            .toString()
            .padStart(2, '0');
        const seconds = Math.floor((this.timerInMs % 60000) / 1000)
            .toString()
            .padStart(2, '0');
        const tenths = Math.floor((this.timerInMs % 1000) / 100)
            .toString()
            .padStart(1, '0');

        lines.push(`Time: ${minutes}:${seconds}.${tenths}`);
        lines.push('');
        lines.push(`Shuffles: ${this.player.shufflesRemaining}`);
        lines.push(`Play Pile Size: ${this.player.playPileVisibleSize}`);
        lines.push(`Draw Pile Size: ${this.player.playPileDrawSize}`);
        lines.push(`Score: ${this.score}`);
        lines.push(`Streak: ${this.streak}`);
        lines.push('');
        lines.push(`Level: ${level.name}`);
        lines.push(`Score to Beat: ${level.scoreToBeat}`);

        let y = 40;
        lines.forEach(line => {
            printText(this.ctx, line, 30, y);
            y += 40;
        });
    }

    public renderMousePosition(): void {
        const x = parseFloat(this.scaledMouseCoordinates.x.toFixed(0));
        const y = parseFloat(this.scaledMouseCoordinates.y.toFixed(0));
        printText(this.ctx, `Cursor: X ${x} | Y ${y}`, 30, 780);
    }

    public renderLastCardClicked(): void {
        const card = this.lastCardClicked;
        if (card) {
            printText(this.ctx, `Card: ${card.value}`, 30, 740);
            drawIcon(this.ctx, this.iconSpriteSheet, card.suit, 120, 723);
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

    public changeTheme(theme: Theme): void {
        this.theme = theme;
        this.swirl.doSwirl(SwirlThemes[theme.name]);

        this.buttons.forEach(button => {
            button.theme = this.theme;
        });

        this.debugButtons.forEach(button => {
            button.theme = this.theme;
        });

        this.dialogCloseButton.theme = this.theme;
    }

    public isActiveAnimations(): boolean {
        let active = false;

        for (const pile of [this.pile1, this.pile2, this.pile3, this.pile4]) {
            if (pile.cardAnimations.length > 0) {
                active = true;
                break;
            }
        }

        return active || this.gameComponents.some(component => component instanceof CardAnimation);
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
        gameContainer.style.width = `${1280}px`;
        gameContainer.style.height = `${800}px`;

        // Apply the scale factor to the game container
        const bgontainer = document.getElementById('bg-canvas');
        bgontainer.style.transform = `scale(${this.scaleFactor})`;
        bgontainer.style.width = `${1280}px`;
        bgontainer.style.height = `${800}px`;
    }
}
