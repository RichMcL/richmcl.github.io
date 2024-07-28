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

class Game {
    public gameRunning: boolean = true;
    public deck: Card[];
    public deckPosition: number = 0;
    public timerInMs: number = 0;
    public lastTimestamp: number = 0;

    public piles: Card[] = [];

    constructor() {
        this.deck = this.buildAndShuffleDeck();

        this.startGame();
    }

    public startGame() {
        console.log('Game started', this);

        this.initializePileZones(4);

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

        // Request the next frame
        requestAnimationFrame(ts => this.gameLoop(ts));
    }

    public updateGameState() {
        // Update the game state logic
    }

    public render() {
        // Render the updated state to the DOM
        this.renderPileZones();
        this.renderPlayerDeck();
        this.renderTimer();
    }

    public pauseGame() {
        this.gameRunning = false;
    }

    /* LOGIC FUNCTIONS */

    public buildAndShuffleDeck(): Card[] {
        let deck: Card[] = [];

        for (const suit of Object.values(Suit)) {
            for (const value of Object.values(CardValue)) {
                deck.push({ suit, value });
            }
        }

        for (let i = 0; i < deck.length; i++) {
            const j = Math.floor(Math.random() * deck.length);
            const temp = deck[i];
            deck[i] = deck[j];
            deck[j] = temp;
        }

        return deck;
    }

    public initializePileZones(count: number): void {
        this.piles = this.deck.splice(0, count);
    }

    /* USER ACTION FUNCTIONS */

    public clickDeck(): void {
        //on click of the deck, increment the deck position
        this.deckPosition++;
    }

    /* RENDER FUNCTIONS */

    public buildCardHtml(card: Card): string {
        return `
        <div class="card-wrapper">
            <div class="card-face ${cardValueToKey(card.value)}-${card.suit.toLowerCase()}"></div>
        </div>
        `;
    }

    public renderTimer(): void {
        const timerEl = document.querySelector('.timer-value');

        const minutes = Math.floor(this.timerInMs / 60000)
            .toString()
            .padStart(2, '0');
        const seconds = Math.floor((this.timerInMs % 60000) / 1000)
            .toString()
            .padStart(2, '0');
        const tenths = Math.floor((this.timerInMs % 1000) / 100)
            .toString()
            .padStart(1, '0');

        timerEl.innerHTML = `${minutes}:${seconds}.${tenths}`;
    }

    public handlePileZoneClick = (event: Event) => {
        console.log('clicked at', this.timerInMs);
    };

    public renderPileZones(): void {
        const pileZonesEl = document.querySelector('.pile-zones');
        pileZonesEl.innerHTML = '';

        this.piles.forEach((card, index) => {
            const cardHtml = this.buildCardHtml(card);
            pileZonesEl.innerHTML += cardHtml;
        });

        //remove existing click event listeners
        pileZonesEl.removeEventListener('click', this.handlePileZoneClick);
        pileZonesEl.addEventListener('click', this.handlePileZoneClick);
    }

    public renderPlayerDeck(): void {
        const playerDeckEl = document.querySelector('.player-deck');

        // Render the current position of the deck
        const topCard = this.deck[this.deckPosition];
        const topCardHtml = this.buildCardHtml(topCard);
        playerDeckEl.innerHTML = topCardHtml;
    }

    // Sleep function using Promise and async/await
    public sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

(() => {
    document.addEventListener('DOMContentLoaded', () => {
        const game = new Game();
        (window as any).game = game;
    });
})();
