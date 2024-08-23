import {
    createCloseDialogButton,
    createDealButton,
    createDeckButton,
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
import { DeckDialog } from './deck-dialog';
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
import { State } from './state';
import { Swirl } from './swirl';
import { SwirlThemes, Theme, Themes } from './theme';
import { Card, GameComponent } from './types';
import { buildAndShuffleDeck, drawIcon, printText } from './util';

export class Game {
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

    public timerInMs: number = 0;
    public lastTimestamp: number = 0;

    public buttons: GameButton[] = [];
    public debugButtons: GameButton[] = [];
    public themeButtons: ThemeButton[] = [];
    public dialog: Dialog;
    public dialogCloseButton: GameButton;

    public lastCardClicked: Card;
    public isDealNewRound: boolean = true;

    constructor() {
        State.setCanvas(document.getElementById('game-canvas') as HTMLCanvasElement);
        State.setCtx(State.getCanvas().getContext('2d'));

        const cardFaceSpriteSheet = new Image();
        cardFaceSpriteSheet.src = 'img/deck-sprite-sheet.png';

        State.setCardFaceSpriteSheet(cardFaceSpriteSheet);

        const cardBackSpriteSheet = new Image();
        cardBackSpriteSheet.src = 'img/card-backs-seals.png';

        State.setCardBackSpriteSheet(cardBackSpriteSheet);

        const iconSpriteSheet = new Image();
        iconSpriteSheet.src = 'img/icons.png';

        State.setIconSpriteSheet(iconSpriteSheet);

        // Wait for both images to load before starting the game
        Promise.all([
            this.loadImage(cardFaceSpriteSheet),
            this.loadImage(cardBackSpriteSheet),
            this.loadImage(iconSpriteSheet),
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
        State.getCanvas().addEventListener('click', event => {
            const rect = State.getCanvas().getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            State.setClickCoordinates({ x, y });

            // this.isMouseClicked = true;
            State.setMouseClick(true);
        });

        document.addEventListener('mousemove', event => {
            const rect = State.getCanvas().getBoundingClientRect();

            State.setMouseCoordinates({
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            });
        });

        State.setGameRunning(true);
        this.lastTimestamp = performance.now();

        this.isDealNewRound = false;

        this.initializeGameObjects();
        this.gameLoop();
    }

    public initializeGameObjects(): void {
        this.player = new Player();

        this.initializePiles();
        this.debugButtons.push(createDecrementDrawSizeButton());
        this.debugButtons.push(createIncrementDrawSizeButton());
        this.debugButtons.push(createDecrementShufflesButton());
        this.debugButtons.push(createIncrementShufflesButton());
        this.debugButtons.push(createDecrementPlayPileButton());
        this.debugButtons.push(createIncrementPlayPileButton());
        this.debugButtons.push(createSameValueButton());
        this.debugButtons.push(createFlushButton());
        this.debugButtons.push(createKlondikeButton());
        this.debugButtons.push(createReverseKlondikeButton());
        this.debugButtons.push(createReloadButton());
        this.debugButtons.push(createFreeButtton());
        this.debugButtons.push(createDealButton());
        this.buttons.push(createHitButton());
        this.buttons.push(createDeckButton());
        this.buttons.push(createOpenDialogButton());
        this.themeButtons = createThemeButtons();

        this.dialog = new Dialog(DefaultDialogRenderConfig.coordinates);
        this.dialogCloseButton = createCloseDialogButton();

        this.scorebar = new Scorebar(State.getTheme());
        this.scorebar.setMaxScore(Levels[this.currentLevel].scoreToBeat);

        this.gameComponents.push(this.scorebar);
    }

    public gameLoop(timestamp: number = 0) {
        if (!State.isGameRunning()) return;

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
            State.getScore() >= Levels[this.currentLevel].scoreToBeat &&
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
                if (button.isHoveredOver(State.getScaledMouseCoordinates())) {
                    hoverButton = button;
                    hoverButton.isHovered = true;
                }
            });

            let hoverThemeButton: ThemeButton;

            this.themeButtons.forEach(button => {
                if (button.isHoveredOver(State.getScaledMouseCoordinates())) {
                    hoverThemeButton = button;
                    hoverThemeButton.isHovered = true;
                }
            });

            if (hoverThemeButton && State.isMouseClick()) {
                this.changeTheme(hoverThemeButton.theme);
            }
        } else {
            this.buttons.forEach(button => {
                if (button.isHoveredOver(State.getScaledMouseCoordinates())) {
                    hoverButton = button;
                    hoverButton.isHovered = true;
                }
            });
        }

        if (this.dialogCloseButton.isHoveredOver(State.getScaledMouseCoordinates())) {
            hoverButton = this.dialogCloseButton;
            this.dialogCloseButton.isHovered = true;
        }

        if (hoverButton && State.isMouseClick()) {
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
                    this.gameComponents = this.gameComponents.filter(
                        component => !(component instanceof DeckDialog)
                    );
                    break;
                case 'deck-dialog-open':
                    this.openDeckDialog();
                    break;
            }
        }

        let hoverCard: Card;

        if (this.player.isHoveredOver(State.getScaledMouseCoordinates())) {
            hoverCard = this.player.getTopPlayCard();
        }

        if (hoverCard && State.isMouseClick()) {
            this.lastCardClicked = hoverCard;
            console.log('Play pile clicked', hoverCard);
        }

        let hoverPile: Pile;
        let hoverPileCard: Card;
        [this.pile1, this.pile2, this.pile3, this.pile4].forEach(pile => {
            const card = pile.getTopCard();
            if (pile.isHoveredOver(State.getScaledMouseCoordinates())) {
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

        if (hoverPileCard && State.isMouseClick()) {
            console.log('Pile click card', hoverPileCard);

            hoverPile.coordinates;

            hoverPile.addCardAnimation(
                new CardAnimation(
                    this.player.getCoordinatesCopy(),
                    hoverPile.getCoordinatesCopy(),
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

            const pointsForMove = calculateScoreForRules(passingRules, State.getStreak());
            State.setScore(State.getScore() + pointsForMove);
            State.setStreak(State.getStreak() + 1);

            this.player.removeTopPlayCard();
            this.scorebar.setScoreToReach(State.getScore());

            // in the middle of the pile
            const scoreX =
                hoverPile.renderConfig.coordinates.x + hoverPile.renderConfig.size.width / 2;

            this.gameComponents.push(new ScoreGraphic({ x: scoreX, y: 300 }, pointsForMove));
        }
    }

    public goToNextLevel() {
        this.player.drawPile = buildAndShuffleDeck(true);
        this.initializePiles();
        this.player.playPile = [];
        this.player.hit();

        this.isDealNewRound = false;
        State.setScore(0);
        this.currentLevel++;

        //increment the theme the next object in the map
        const themeKeys = Object.keys(Themes);
        const currentThemeIndex = themeKeys.indexOf(State.getTheme().name);
        const nextThemeIndex = currentThemeIndex + 1;
        const nextTheme = themeKeys[nextThemeIndex % themeKeys.length];

        if (nextThemeIndex > themeKeys.length - 1) {
            State.setTheme(Themes.default);
        }

        this.changeTheme(Themes[nextTheme]);
        this.gameComponents.push(new ScoreGraphic({ x: 540, y: 350 }, 'Next Level!'));
        this.player.shufflesRemaining = this.player.startingShuffles;

        this.scorebar.reset();
        this.scorebar.setMaxScore(Levels[this.currentLevel].scoreToBeat);
    }

    public resetGameState(): void {
        State.setClickCoordinates(null);
        State.setMouseClick(false);

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
        State.getCtx().clearRect(0, 0, State.getCanvas().width, State.getCanvas().height); // Clear canvas

        this.renderTheme();
        this.renderSidebar();
        this.renderRuleSidebar();
        this.renderPileShadow();

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

        if (this.gameComponents.some(component => component instanceof DeckDialog)) {
            this.dialogCloseButton.render();
        }
    }

    public renderTheme() {
        document.body.style.backgroundColor = State.getTheme().black;
    }

    public renderPileShadow(): void {
        State.getCtx().fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.drawRoundedRect(State.getCtx(), 330, 70, 620, 180, 10);
        State.getCtx().fill();
    }

    // Function to draw a rounded rectangle
    public drawRoundedRect(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number,
        radius: number
    ) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    public renderSidebar() {
        const x = 20;

        // Left border
        State.getCtx().fillStyle = State.getTheme().base;
        State.getCtx().fillRect(x - 3, 0, 3, 800);

        State.getCtx().fillStyle = '#293a3a';
        State.getCtx().fillRect(x, 0, 250, 800);

        // Right border
        State.getCtx().fillStyle = State.getTheme().base;
        State.getCtx().fillRect(x + 250, 0, 3, 800);
    }

    public renderRuleSidebar() {
        const x = 1007;

        // Left border
        State.getCtx().fillStyle = State.getTheme().base;
        State.getCtx().fillRect(x - 3, 0, 3, 800);

        State.getCtx().fillStyle = '#293a3a';
        State.getCtx().fillRect(x, 0, 250, 800);

        // Right border
        State.getCtx().fillStyle = State.getTheme().base;
        State.getCtx().fillRect(x + 250, 0, 3, 800);

        printText('Rules', x + 30, 40);

        //iterate over the riles an print their descriptions

        let y = 80;

        this.ruleNames.sort();
        for (const rule of this.ruleNames) {
            const ruleInfo = RuleInfo[rule];
            printText(`- ${ruleInfo.name}`, x + 30, y);
            y += 30;
            printText(`  ${ruleInfo.description}`, x + 30, y, 15);
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
        lines.push(`Score: ${State.getScore()}`);
        lines.push(`Streak: ${State.getStreak()}`);
        lines.push('');
        lines.push(`Level: ${level.name}`);
        lines.push(`Score to Beat: ${level.scoreToBeat}`);

        let y = 40;
        lines.forEach(line => {
            printText(line, 30, y);
            y += 40;
        });
    }

    public renderMousePosition(): void {
        const x = parseFloat(State.getScaledMouseCoordinates().x.toFixed(0));
        const y = parseFloat(State.getScaledMouseCoordinates().y.toFixed(0));
        printText(`Cursor: X ${x} | Y ${y}`, 30, 780);
    }

    public renderLastCardClicked(): void {
        const card = this.lastCardClicked;
        if (card) {
            printText(`Card: ${card.value}`, 30, 740);
            drawIcon(State.getIconSpriteSheet(), card.suit, 120, 723);
        }
    }

    /* LOGIC FUNCTIONS */

    public initializePiles(): void {
        this.pile1 = new Pile(PilesRenderConfig.pile1.coordinates, 'pile1');
        this.pile2 = new Pile(PilesRenderConfig.pile2.coordinates, 'pile2');
        this.pile3 = new Pile(PilesRenderConfig.pile3.coordinates, 'pile3');
        this.pile4 = new Pile(PilesRenderConfig.pile4.coordinates, 'pile4');

        // Pop the first 4 cards from the deck and add them to the piles
        this.pile1.pushCard(this.player.drawPile.pop());
        this.pile2.pushCard(this.player.drawPile.pop());
        this.pile3.pushCard(this.player.drawPile.pop());
        this.pile4.pushCard(this.player.drawPile.pop());
    }

    public hitCard(): void {
        State.setStreak(0);
        this.player.hit();
    }

    public changeTheme(theme: Theme): void {
        State.setTheme(theme);
        this.swirl.doSwirl(SwirlThemes[theme.name]);
        this.scorebar.setTheme(theme);

        this.buttons.forEach(button => {
            button.theme = State.getTheme();
        });

        this.debugButtons.forEach(button => {
            button.theme = State.getTheme();
        });

        this.dialogCloseButton.theme = State.getTheme();
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

    public openDeckDialog(): void {
        const deckDialog = new DeckDialog(
            DefaultDialogRenderConfig.coordinates,
            this.player.drawPile,
            this.player.playPile
        );

        this.gameComponents.push(deckDialog);
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
