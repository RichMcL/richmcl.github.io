enum Suit {
    Spades = 'Spades',
    Clubs = 'Clubs',
    Diamonds = 'Diamonds',
    Hearts = 'Hearts'
}

enum CardValue {
    Nine = '9',
    Ten = '10',
    Jack = 'J',
    Queen = 'Q',
    King = 'K',
    Ace = 'A'
}

const blackSuits = [Suit.Spades, Suit.Clubs];
const redSuits = [Suit.Diamonds, Suit.Hearts];

interface Card {
    suit: Suit;
    value: CardValue;
    isTrump?: boolean;
}

interface Player {
    hand: Card[];
    team: number;
    isPlayer: boolean;
    isDealer: boolean;
    isPlayerTeammate: boolean;
}

const isCardTrump = (card: Card, trump: Suit): boolean => {
    if (card.suit === trump) {
        return true;
    }

    if (card.value === CardValue.Jack) {
        if (
            (blackSuits.includes(trump) && blackSuits.includes(card.suit)) ||
            (redSuits.includes(trump) && redSuits.includes(card.suit))
        ) {
            return true;
        }
    }

    return false;
};

const buildDeck = (): Card[] => {
    let deck: Card[] = [];

    for (const suit of Object.values(Suit)) {
        for (const value of Object.values(CardValue)) {
            deck.push({ suit, value });
        }
    }

    return deck;
};

const shuffleDeck = (deck: Card[]) => {
    const clonedDeck = [...deck];

    for (let i = 0; i < clonedDeck.length; i++) {
        const j = Math.floor(Math.random() * clonedDeck.length);
        const temp = clonedDeck[i];
        clonedDeck[i] = clonedDeck[j];
        clonedDeck[j] = temp;
    }

    return clonedDeck;
};

/**
 * Deal 5 cards to each player, and create the kitty with the remaining 4 cards
 */
const dealDeck = (deck: Card[], players: Player[]) => {
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < players.length; j++) {
            players[j].hand.push(deck[i + j]);
        }
    }

    const kitty = deck.slice(20, 24);
    return kitty;
};

/**
 * Initialize players and teams, but doesn't deal cards or set dealer
 */
const createPlayers = (): Player[] => {
    return [
        {
            hand: [],
            team: 1,
            isPlayer: true,
            isDealer: false,
            isPlayerTeammate: false
        },
        {
            hand: [],
            team: 2,
            isPlayer: false,
            isDealer: false,
            isPlayerTeammate: false
        },
        {
            hand: [],
            team: 1,
            isPlayer: false,
            isDealer: false,
            isPlayerTeammate: true
        },
        {
            hand: [],
            team: 2,
            isPlayer: false,
            isDealer: false,
            isPlayerTeammate: false
        }
    ];
};

class Game {
    public deck: Card[];
    public players: Player[];
    public kitty: Card[];

    constructor() {
        this.deck = shuffleDeck(buildDeck());
        this.players = createPlayers();
        this.kitty = dealDeck(this.deck, this.players);
    }
}

(() => {
    const game = new Game();

    // console.log('deck', game.deck);
    console.log('players', game.players);
    console.log('kitty', game.kitty);
})();
