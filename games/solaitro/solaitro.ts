enum Suit {
    Spades = 'Spades',
    Clubs = 'Clubs',
    Diamonds = 'Diamonds',
    Hearts = 'Hearts'
}

enum SuitIcon {
    Spades = '♠',
    Clubs = '♣',
    Diamonds = '♦',
    Hearts = '♥'
}

enum CardValue {
    Two = '2',
    Three = '3',
    Four = '4',
    Five = '5',
    Six = '6',
    Seven = '7',
    Eight = '8',
    Nine = '9',
    Ten = '10',
    Jack = 'J',
    Queen = 'Q',
    King = 'K',
    Ace = 'A'
}

const CardNumericValue = {
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '10': 10,
    J: 11,
    Q: 12,
    K: 13,
    A: 14
};

const blackSuits = [Suit.Spades, Suit.Clubs];
const redSuits = [Suit.Diamonds, Suit.Hearts];

interface Card {
    suit: Suit;
    value: CardValue;
}

interface RenderedCard extends Card {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

interface Player {
    playerNum: number;
    hand: Card[];
    team: number;
    isPlayer: boolean;
    isDealer: boolean;
    isPlayerTeammate: boolean;
    dealIndex?: number;
    playIndex?: number;
}

const logger = (label = '', obj: any): void => {
    console.log(label);
    console.dir(obj, { depth: null, colors: true });
};

const cardValueToKey = (value: CardValue): string => {
    switch (value) {
        case CardValue.Two:
            return 'two';
        case CardValue.Three:
            return 'three';
        case CardValue.Four:
            return 'four';
        case CardValue.Five:
            return 'five';
        case CardValue.Six:
            return 'six';
        case CardValue.Seven:
            return 'seven';
        case CardValue.Eight:
            return 'eight';
        case CardValue.Nine:
            return 'nine';
        case CardValue.Ten:
            return 'ten';
        case CardValue.Jack:
            return 'jack';
        case CardValue.Queen:
            return 'queen';
        case CardValue.King:
            return 'king';
        case CardValue.Ace:
            return 'ace';
    }

    return '';
};

interface GameButton {
    id: string;
    text: string;
    fillColor: string;
    x: number;
    y: number;
    width: number;
    height: number;
    padding: number;
}

class Game {
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public cardFaceSpriteSheet: HTMLImageElement;
    public cardBackSpriteSheet: HTMLImageElement;
    public clickCoordinates: { x: number; y: number } = { x: 0, y: 0 };

    public gameRunning: boolean = true;
    public deck: Card[];
    public deckIndex: number = 0;
    public timerInMs: number = 0;
    public lastTimestamp: number = 0;

    public buttons: GameButton[] = [];
    public renderedCards: RenderedCard[] = [];
    public lastCardClicked: Card;
    public isDealNewRound: boolean = true;

    public piles: Card[] = [];

    constructor() {
        this.canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d');

        this.cardFaceSpriteSheet = new Image();
        this.cardFaceSpriteSheet.src = 'img/deck-sprite-sheet.png';

        this.cardBackSpriteSheet = new Image();
        this.cardBackSpriteSheet.src = 'img/card-backs-seals.png';

        // Wait for both images to load before starting the game
        Promise.all([
            this.loadImage(this.cardFaceSpriteSheet),
            this.loadImage(this.cardBackSpriteSheet)
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
        });

        // this.initializePileZones(4);

        this.gameRunning = true;
        this.lastTimestamp = performance.now();
        this.gameLoop();
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

        this.clickCoordinates = null;

        // Request the next frame
        requestAnimationFrame(ts => this.gameLoop(ts));
    }

    public updateGameState() {
        // Update the game state logic

        this.buttons = [];
        this.renderedCards = [];

        this.createPlayerCard();
        this.createReloadButton();
        this.createDealButton();
        // this.createRenderedCards();

        let clickedButton;

        //loop through objects and check if click is within the boundaries
        this.buttons.forEach(button => {
            if (
                this.clickCoordinates?.x >= button.x &&
                this.clickCoordinates?.x <= button.x + button.width &&
                this.clickCoordinates?.y >= button.y &&
                this.clickCoordinates?.y <= button.y + button.height
            ) {
                clickedButton = button;
            }
        });

        if (clickedButton) {
            switch (clickedButton.id) {
                case 'reload':
                    window.location.reload();
                    break;
                case 'deal':
                    this.isDealNewRound = true;
                    break;
            }
        }

        let clickedCard;

        this.renderedCards.forEach(card => {
            if (
                this.clickCoordinates?.x >= card.x &&
                this.clickCoordinates?.x <= card.x + card.width &&
                this.clickCoordinates?.y >= card.y &&
                this.clickCoordinates?.y <= card.y + card.height
            ) {
                clickedCard = card;
            }
        });

        if (clickedCard) {
            this.lastCardClicked = clickedCard;

            switch (clickedCard.id) {
                case 'player':
                    console.log('Player card clicked', clickedCard);
                    this.deckIndex += 3;

                    if (this.deckIndex >= this.deck.length) {
                        this.deckIndex = this.deckIndex - this.deck.length;
                    }

                    break;
            }
        }

        if (this.isDealNewRound) {
            this.deck = this.buildAndShuffleDeck(true);
            this.isDealNewRound = false;
        }
    }

    public createPlayerCard(): void {
        if (!this.deck?.length) {
            return;
        }

        const card = this.deck[this.deckIndex];
        this.renderedCards.push({
            ...card,
            id: 'player',
            x: 605,
            y: 500,
            width: 71,
            height: 95
        });
    }

    public createReloadButton(): void {
        const text = 'RELOAD';
        const padding = 20; // Padding for the button
        const textMetrics = this.ctx.measureText(text);
        const textWidth = textMetrics.width;
        const buttonWidth = textWidth + padding;
        const buttonHeight = 50;
        const x = 10;
        const y = 730;

        this.buttons.push({
            id: 'reload',
            text,
            padding,
            fillColor: '#30874b',
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
        const buttonWidth = textWidth + padding;
        const buttonHeight = 50;
        const x = 10;
        const y = 670;

        this.buttons.push({
            id: 'deal',
            text,
            padding,
            fillColor: '#30874b',
            x,
            y,
            width: buttonWidth,
            height: buttonHeight
        });
    }

    public render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear canvas

        this.renderAllCards();
        this.renderDeckIndex();
        this.renderTimer();
        this.renderLastCardClicked();
        this.renderButtons();
    }

    public renderButtons() {
        this.buttons.forEach(button => {
            this.ctx.fillStyle = button.fillColor;
            this.ctx.fillRect(button.x, button.y, button.width, button.height);

            this.printText(
                button.text,
                button.x + button.padding / 2,
                button.y + button.padding * 1.75
            );
        });
    }

    public renderDeckIndex() {
        this.printText(`${this.deckIndex} / ${this.deck?.length}`, 610, 630);
    }

    public renderAllCards(): void {
        this.renderedCards.forEach(card => {
            this.drawCard(card, card.x, card.y);
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

        this.printText(`Time: ${minutes}:${seconds}.${tenths}`, 20, 60);
    }

    public renderLastCardClicked(): void {
        const card = this.lastCardClicked;
        if (card) {
            this.printText(`Card: ${card.value} ${SuitIcon[card.suit]}`, 20, 100);
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

    public buildAndShuffleDeck(shuffle = false): Card[] {
        let deck: Card[] = [];

        for (const suit of Object.values(Suit)) {
            for (const value of Object.values(CardValue)) {
                deck.push({ suit, value });
            }
        }

        if (shuffle) {
            for (let i = 0; i < deck.length; i++) {
                const j = Math.floor(Math.random() * deck.length);
                const temp = deck[i];
                deck[i] = deck[j];
                deck[j] = temp;
            }
        }

        return deck;
    }

    public initializePileZones(count: number): void {
        this.piles = this.deck.splice(0, count);
    }

    /* USER ACTION FUNCTIONS */

    /* RENDER FUNCTIONS */

    private drawCard(card: Card, x: number, y: number): void {
        const cardWidth = 71; // Width of a single card in the sprite sheet
        const cardHeight = 95; // Height of a single card in the sprite sheet
        const cardIndex = 0;

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
            cardWidth,
            cardHeight
        );

        this.ctx.drawImage(
            this.cardFaceSpriteSheet,
            sx,
            sy,
            cardWidth,
            cardHeight,
            x,
            y,
            cardWidth,
            cardHeight
        );
    }

    // Sleep function using Promise and async/await
    public sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * columns -> 2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K, A
     * rows -> hearts, clubs, diamonds, spades,
     */
    // public createRenderedCards(): void {
    //     if (!this.deck?.length) {
    //         return;
    //     }

    //     let cardIndex = 0;
    //     for (let col = 0; col < 4; col++) {
    //         for (let row = 0; row < 13; row++) {
    //             this.renderedCards.push({
    //                 ...this.deck[cardIndex],
    //                 id: this.deck[cardIndex].suit + this.deck[cardIndex].value,
    //                 x: row * 71 + 200,
    //                 y: col * 95 + 100,
    //                 width: 71,
    //                 height: 95
    //             });

    //             cardIndex++;
    //         }
    //     }
    // }
}

(() => {
    document.addEventListener('DOMContentLoaded', () => {
        const game = new Game();
        (window as any).game = game;
    });
})();
