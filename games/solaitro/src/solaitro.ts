import { Theme, Themes } from './theme';
import { Card, CardValue, GameButton, Player, RenderedCard, Suit, ThemeButton } from './types';
import { buildAndShuffleDeck } from './util';

export class Game {
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public gameAspectRatio: number = 1280 / 800;
    public windowAspectRatio: number;
    public scaleFactor: number;
    public theme: Theme = Themes.default;

    public player: Player = new Player();

    public cardFaceSpriteSheet: HTMLImageElement;
    public cardBackSpriteSheet: HTMLImageElement;
    public iconSpriteSheet: HTMLImageElement;
    public clickCoordinates: { x: number; y: number } = { x: 0, y: 0 };
    public scaledClickCoordinates: { x: number; y: number } = { x: 0, y: 0 };

    public mouseCoordinates: { x: number; y: number } = { x: 0, y: 0 };
    public scaledMouseCoordinates: { x: number; y: number } = { x: 0, y: 0 };
    public isMouseClicked: boolean = false;

    public gameRunning: boolean = true;
    public timerInMs: number = 0;
    public lastTimestamp: number = 0;

    public buttons: GameButton[] = [];
    public themeButtons: ThemeButton[] = [];
    public lastCardClicked: Card;
    public isDealNewRound: boolean = true;

    public pile1: RenderedCard[] = [];
    public pile2: RenderedCard[] = [];
    public pile3: RenderedCard[] = [];
    public pile4: RenderedCard[] = [];

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

        this.player.hand = buildAndShuffleDeck(true);
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
        this.createPlayerCard();
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

            // switch (hoverCard.id) {
            //     case 'player':
            //         console.log('Player card clicked', hoverCard);
            //         break;
            // }
        }

        let hoverPile: RenderedCard[];
        let hoverPileCard: RenderedCard;
        [this.pile1, this.pile2, this.pile3, this.pile4].forEach(pile => {
            const card = pile[pile.length - 1];
            if (
                this.scaledMouseCoordinates?.x >= card.x &&
                this.scaledMouseCoordinates?.x <= card.x + card.width * card.scale &&
                this.scaledMouseCoordinates?.y >= card.y &&
                this.scaledMouseCoordinates?.y <= card.y + card.height * card.scale
            ) {
                hoverPile = pile;
                hoverPileCard = card;
            }
        });

        if (hoverPileCard && this.isMouseClicked) {
            console.log('Pile click pile', hoverPile);
            console.log('Pile click card', hoverPileCard);

            hoverPile.push({
                ...hoverPileCard,
                suit: this.player.getCurrentCard().suit,
                value: this.player.getCurrentCard().value
            });

            this.player.removeTopCard();
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

        this.buttons.forEach(button => {
            button.isHovered = false;
        });

        this.themeButtons.forEach(button => {
            button.isHovered = false;
        });
    }

    public createPlayerCard(): void {
        this.player = new Player();
    }

    public createReloadButton(): void {
        const text = 'RELOAD';
        const padding = 20; // Padding for the button
        const textMetrics = this.ctx.measureText(text);
        const textWidth = textMetrics.width;
        const buttonWidth = textWidth + padding * 2 + 5;
        const buttonHeight = 50;
        const x = 10;
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
        const x = 10;
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
        this.renderPlayerCard();
        this.renderPiles();
        this.renderDeckIndex();
        this.renderTimer();
        this.renderMousePosition();
        this.renderLastCardClicked();
        this.renderButtons();
        this.renderThemeButtons();
    }

    public renderTheme() {
        this.canvas.style.backgroundColor = this.theme.background;
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

        this.printText(`${this.player.handIndex + 1}  / ${this.player.hand?.length}`, x, 630);
    }

    public renderPlayerCard(): void {
        // this.drawCard(this.playerCard, this.playerCard.x, this.playerCard.y, this.playerCard.scale);

        const renderConfig = this.player.renderConfig;

        this.drawCard(
            this.player.getCurrentCard(),
            renderConfig.x,
            renderConfig.y,
            renderConfig.scale
        );
    }

    public renderPiles(): void {
        const y = 200;
        const pile1 = this.pile1;
        const pile2 = this.pile2;
        const pile3 = this.pile3;
        const pile4 = this.pile4;

        const cardWidth = 71 * 1.5;
        const margin = 40;
        const startingX = 260;

        //TODO do these calculations when the card is added to the pile, not on each render
        const pile1Card = pile1[pile1.length - 1];
        pile1Card.width = 71;
        pile1Card.height = 95;
        pile1Card.x = startingX + cardWidth * 1 + 0 * margin;
        pile1Card.y = y;
        pile1Card.scale = 1.5;

        const pile2Card = pile2[pile2.length - 1];
        pile2Card.width = 71;
        pile2Card.height = 95;
        pile2Card.x = startingX + cardWidth * 2 + 1 * margin;
        pile2Card.y = y;
        pile2Card.scale = 1.5;

        const pile3Card = pile3[pile3.length - 1];
        pile3Card.width = 71;
        pile3Card.height = 95;
        pile3Card.x = startingX + cardWidth * 3 + 2 * margin;
        pile3Card.y = y;
        pile3Card.scale = 1.5;

        const pile4Card = pile4[pile4.length - 1];
        pile4Card.width = 71;
        pile4Card.height = 95;
        pile4Card.x = startingX + cardWidth * 4 + 3 * margin;
        pile4Card.y = y;
        pile4Card.scale = 1.5;

        this.drawCard(pile1Card, pile1Card.x, pile1Card.y, pile1Card.scale);
        this.drawCard(pile2Card, pile2Card.x, pile2Card.y, pile2Card.scale);
        this.drawCard(pile3Card, pile3Card.x, pile3Card.y, pile3Card.scale);
        this.drawCard(pile4Card, pile4Card.x, pile4Card.y, pile4Card.scale);
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

        this.printText(`Time: ${minutes}:${seconds}.${tenths}`, 20, 60);
    }

    public renderMousePosition(): void {
        const x = parseFloat(this.scaledMouseCoordinates.x.toFixed(0));
        const y = parseFloat(this.scaledMouseCoordinates.y.toFixed(0));
        this.printText(`Cursor: X ${x} | Y ${y}`, 170, 60);
    }

    public renderLastCardClicked(): void {
        const card = this.lastCardClicked;
        if (card) {
            this.printText(`Card: ${card.value}`, 20, 100);
            this.drawIcon(card.suit, 110, 83);
        }
    }

    public printText(text: string, x: number, y: number): void {
        this.ctx.font = '20px Balatro';
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
        this.pile1 = [];
        this.pile2 = [];
        this.pile3 = [];
        this.pile4 = [];

        // Pop the first 4 cards from the deck and add them to the piles
        this.pile1.push(this.player.hand.pop() as RenderedCard);
        this.pile2.push(this.player.hand.pop() as RenderedCard);
        this.pile3.push(this.player.hand.pop() as RenderedCard);
        this.pile4.push(this.player.hand.pop() as RenderedCard);
    }

    public hitCard(): void {
        this.player.hit();
    }

    /* USER ACTION FUNCTIONS */

    /* RENDER FUNCTIONS */

    private drawCard(card: Card, x: number, y: number, cardScale = 1): void {
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
