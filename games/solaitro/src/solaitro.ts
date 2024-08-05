import { doesAnyRulePass, Rule, RuleInfo, RuleNames } from './rules';
import { Theme, Themes } from './theme';
import {
    Card,
    CardValue,
    Coordindates,
    GameButton,
    Pile,
    Player,
    Suit,
    ThemeButton
} from './types';
import { buildAndShuffleDeck } from './util';

export class Game {
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public gameAspectRatio: number = 1280 / 800;
    public windowAspectRatio: number;
    public scaleFactor: number;
    public theme: Theme = Themes.default;

    public player: Player = new Player();

    public pile1: Pile = new Pile('pile1');
    public pile2: Pile = new Pile('pile2');
    public pile3: Pile = new Pile('pile3');
    public pile4: Pile = new Pile('pile4');

    public ruleNames: RuleNames[] = [RuleNames.klondike, RuleNames.reverseKlondike];

    public cardFaceSpriteSheet: HTMLImageElement;
    public cardBackSpriteSheet: HTMLImageElement;
    public iconSpriteSheet: HTMLImageElement;
    public clickCoordinates: Coordindates = { x: 0, y: 0 };
    public scaledClickCoordinates: Coordindates = { x: 0, y: 0 };

    public mouseCoordinates: Coordindates = { x: 0, y: 0 };
    public scaledMouseCoordinates: Coordindates = { x: 0, y: 0 };
    public isMouseClicked: boolean = false;

    public gameRunning: boolean = true;
    public timerInMs: number = 0;
    public lastTimestamp: number = 0;

    public score = 0;

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

        this.initializePiles();
        this.isDealNewRound = false;

        this.initializeGameObjects();
        this.gameLoop();
    }

    public initializeGameObjects(): void {
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
        // Update the game state logic
        let hoverButton: GameButton;

        //loop through objects and check if click is within the boundaries
        this.buttons.forEach(button => {
            if (
                this.scaledMouseCoordinates?.x >= button.x &&
                this.scaledMouseCoordinates?.x <= button.x + button.width &&
                this.scaledMouseCoordinates?.y >= button.y &&
                this.scaledMouseCoordinates?.y <= button.y + button.height
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
                case 'hit':
                    this.hitCard();
                    break;
            }
        }

        let hoverThemeButton: ThemeButton;

        this.themeButtons.forEach(button => {
            if (
                this.scaledMouseCoordinates?.x >= button.x &&
                this.scaledMouseCoordinates?.x <= button.x + button.width &&
                this.scaledMouseCoordinates?.y >= button.y &&
                this.scaledMouseCoordinates?.y <= button.y + button.height
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
            this.scaledMouseCoordinates?.x >= this.player.renderConfig.x &&
            this.scaledMouseCoordinates?.x <=
                this.player.renderConfig.x +
                    this.player.renderConfig.width * this.player.renderConfig.scale &&
            this.scaledMouseCoordinates?.y >= this.player.renderConfig.y &&
            this.scaledMouseCoordinates?.y <=
                this.player.renderConfig.y +
                    this.player.renderConfig.height * this.player.renderConfig.scale
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
                this.scaledMouseCoordinates?.x >= pile.renderConfig.x &&
                this.scaledMouseCoordinates?.x <=
                    pile.renderConfig.x + pile.renderConfig.width * pile.renderConfig.scale &&
                this.scaledMouseCoordinates?.y >= pile.renderConfig.y &&
                this.scaledMouseCoordinates?.y <=
                    pile.renderConfig.y + pile.renderConfig.height * pile.renderConfig.scale
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
            x,
            y,
            width: buttonWidth,
            height: buttonHeight
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
            x,
            y,
            width: buttonWidth,
            height: buttonHeight
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
            x,
            y,
            width: buttonWidth,
            height: buttonHeight
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
                x,
                y,
                width: buttonWidth,
                height: buttonHeight
            });

            i++;
        }
    }

    public render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear canvas

        this.renderTheme();
        this.renderSidebar();
        this.renderRuleSidebar();
        this.renderPlayerCard();
        this.renderPiles();
        this.renderDeckIndex();
        this.renderTimer();
        this.renderScore();
        this.renderMousePosition();
        this.renderLastCardClicked();
        this.renderButtons();
        this.renderThemeButtons();
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

        this.printText('Rules', x + 30, 40);

        //iterate over the riles an print their descriptions

        let y = 80;
        for (const rule of this.ruleNames) {
            const ruleInfo = RuleInfo[rule];
            this.printText(`- ${ruleInfo.name}`, x + 30, y);
            y += 30;
            this.printText(`  ${ruleInfo.description}`, x + 30, y, 15);
            y += 40;
        }
    }

    public renderButtons() {
        this.buttons.forEach(button => {
            this.ctx.fillStyle = this.theme.base;
            this.ctx.fillRect(button.x, button.y, button.width, button.height);

            this.printText(
                button.text,
                button.x + button.padding / 2,
                button.y + button.padding * 1.75
            );

            // Draw a border around the button if it's hovered
            if (button.isHovered) {
                this.ctx.strokeStyle = 'white';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(button.x, button.y, button.width, button.height);
            }
        });
    }

    public renderThemeButtons() {
        this.themeButtons.forEach(button => {
            this.ctx.fillStyle = button.fillColor;
            this.ctx.fillRect(button.x, button.y, button.width, button.height);

            // Draw a border around the button if it's hovered
            if (button.isHovered) {
                this.ctx.strokeStyle = 'white';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(button.x, button.y, button.width, button.height);
            }
        });
    }

    public renderDeckIndex() {
        const fixedWidth = 71 * 1.5; // Define the fixed width
        const text = `${this.player.handIndex} / ${this.player.hand?.length}`;
        const textWidth = this.ctx.measureText(text).width;
        const x = 585 + (fixedWidth - textWidth) / 2; // Calculate the x-coordinate to center the text

        this.printText(`${this.player.handIndex + 1}  / ${this.player.hand?.length}`, x, 645);
    }

    public renderPlayerCard(): void {
        const renderConfig = this.player.renderConfig;

        // Render blank cards behind the player card
        for (let i = 3; i > 0; i--) {
            this.drawCardBack(renderConfig.x + 5 * i, renderConfig.y + 5 * i, renderConfig.scale);
        }

        this.drawCard(
            this.player.getCurrentCard(),
            renderConfig.x,
            renderConfig.y,
            renderConfig.scale
        );
    }

    public renderPiles(): void {
        const pile1Card = this.pile1.getTopCard();
        const pile2Card = this.pile2.getTopCard();
        const pile3Card = this.pile3.getTopCard();
        const pile4Card = this.pile4.getTopCard();

        this.drawCard(
            pile1Card,
            this.pile1.renderConfig.x,
            this.pile1.renderConfig.y,
            this.pile1.renderConfig.scale
        );
        this.drawCard(
            pile2Card,
            this.pile2.renderConfig.x,
            this.pile2.renderConfig.y,
            this.pile2.renderConfig.scale
        );
        this.drawCard(
            pile3Card,
            this.pile3.renderConfig.x,
            this.pile3.renderConfig.y,
            this.pile3.renderConfig.scale
        );
        this.drawCard(
            pile4Card,
            this.pile4.renderConfig.x,
            this.pile4.renderConfig.y,
            this.pile4.renderConfig.scale
        );

        // Draw a border around the pile if it's hovered
        [this.pile1, this.pile2, this.pile3, this.pile4].forEach(pile => {
            if (pile.isHovered) {
                this.ctx.strokeStyle = 'white';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(
                    pile.renderConfig.x,
                    pile.renderConfig.y,
                    pile.renderConfig.width * pile.renderConfig.scale,
                    pile.renderConfig.height * pile.renderConfig.scale
                );
            }
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

        this.printText(`Time: ${minutes}:${seconds}.${tenths}`, 30, 40);
    }

    public renderScore(): void {
        this.printText(`Score: ${this.score}`, 30, 80);
    }

    public renderMousePosition(): void {
        const x = parseFloat(this.scaledMouseCoordinates.x.toFixed(0));
        const y = parseFloat(this.scaledMouseCoordinates.y.toFixed(0));
        this.printText(`Cursor: X ${x} | Y ${y}`, 30, 640);
    }

    public renderLastCardClicked(): void {
        const card = this.lastCardClicked;
        if (card) {
            this.printText(`Card: ${card.value}`, 30, 120);
            this.drawIcon(card.suit, 120, 103);
        }
    }

    public printText(text: string, x: number, y: number, fontSize = 20): void {
        this.ctx.font = `${fontSize}px Balatro`;
        this.ctx.fillStyle = 'white';

        // Set shadow properties
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'; // Shadow color
        this.ctx.shadowBlur = 4; // Blur level
        this.ctx.shadowOffsetX = 2; // Horizontal offset
        this.ctx.shadowOffsetY = 2; // Vertical offset

        this.ctx.fillText(text, x, y);

        // Reset shadow properties to avoid affecting other drawings
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
    }

    public pauseGame() {
        this.gameRunning = false;
    }

    /* LOGIC FUNCTIONS */

    public initializePiles(): void {
        // Pop the first 4 cards from the deck and add them to the piles
        this.pile1.pushCard(this.player.hand.pop());
        this.pile2.pushCard(this.player.hand.pop());
        this.pile3.pushCard(this.player.hand.pop());
        this.pile4.pushCard(this.player.hand.pop());
    }

    public hitCard(): void {
        this.player.hit();
    }

    /* USER ACTION FUNCTIONS */

    /* RENDER FUNCTIONS */

    public drawCard(card: Card, x: number, y: number, cardScale = 1): void {
        const cardWidth = 71; // Width of a single card in the sprite sheet
        const cardHeight = 95; // Height of a single card in the sprite sheet

        let sy = 0;
        let sx = 0;

        switch (card.suit) {
            case Suit.Hearts:
                sy = cardHeight * 0;
                break;
            case Suit.Clubs:
                sy = cardHeight * 1;
                break;
            case Suit.Diamonds:
                sy = cardHeight * 2;
                break;
            case Suit.Spades:
                sy = cardHeight * 3;
                break;
        }

        switch (card.value) {
            case CardValue.Two:
                sx = cardWidth * 0;
                break;
            case CardValue.Three:
                sx = cardWidth * 1;
                break;
            case CardValue.Four:
                sx = cardWidth * 2;
                break;
            case CardValue.Five:
                sx = cardWidth * 3;
                break;
            case CardValue.Six:
                sx = cardWidth * 4;
                break;
            case CardValue.Seven:
                sx = cardWidth * 5;
                break;
            case CardValue.Eight:
                sx = cardWidth * 6;
                break;
            case CardValue.Nine:
                sx = cardWidth * 7;
                break;
            case CardValue.Ten:
                sx = cardWidth * 8;
                break;
            case CardValue.Jack:
                sx = cardWidth * 9;
                break;
            case CardValue.Queen:
                sx = cardWidth * 10;
                break;
            case CardValue.King:
                sx = cardWidth * 11;
                break;
            case CardValue.Ace:
                sx = cardWidth * 12;
                break;
        }

        this.ctx.drawImage(
            this.cardBackSpriteSheet,
            71,
            0,
            cardWidth,
            cardHeight,
            x,
            y,
            cardWidth * cardScale,
            cardHeight * cardScale
        );

        this.ctx.drawImage(
            this.cardFaceSpriteSheet,
            sx,
            sy,
            cardWidth,
            cardHeight,
            x,
            y,
            cardWidth * cardScale,
            cardHeight * cardScale
        );
    }

    public drawCardBack(x: number, y: number, cardScale = 1): void {
        const cardWidth = 71; // Width of a single card in the sprite sheet
        const cardHeight = 95; // Height of a single card in the sprite sheet

        this.ctx.drawImage(
            this.cardBackSpriteSheet,
            0,
            0,
            cardWidth,
            cardHeight,
            x,
            y,
            cardWidth * cardScale,
            cardHeight * cardScale
        );
    }

    public drawIcon(suit: Suit, x: number, y: number): void {
        const iconWidth = 72 / 4;
        const iconHeight = 74 / 4;

        let sy = iconHeight;
        let sx = 0;

        switch (suit) {
            case Suit.Hearts:
                sx = iconWidth * 0;
                break;
            case Suit.Diamonds:
                sx = iconWidth * 1;
                break;
            case Suit.Clubs:
                sx = iconWidth * 2;
                break;
            case Suit.Spades:
                sx = iconWidth * 3;
                break;
        }

        // this.ctx.fillRect(x - 2.5, y - 2.5, iconWidth + 5, iconHeight + 5);

        this.drawRoundedRect(this.ctx, x - 2.5, y - 2.5, iconWidth + 5, iconHeight + 5, 5);

        this.ctx.drawImage(
            this.iconSpriteSheet,
            sx,
            sy,
            iconWidth,
            iconHeight,
            x,
            y,
            iconWidth,
            iconHeight
        );
    }

    public drawRoundedRect(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number,
        radius: number
    ): void {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.arcTo(x + width, y, x + width, y + radius, radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
        ctx.lineTo(x + radius, y + height);
        ctx.arcTo(x, y + height, x, y + height - radius, radius);
        ctx.lineTo(x, y + radius);
        ctx.arcTo(x, y, x + radius, y, radius);
        ctx.closePath();
        ctx.fill();
    }

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
