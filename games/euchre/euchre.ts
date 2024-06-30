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

interface Team {
    players: Player[];
    score: number;
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
    // dealt the first 20 cards randomly to the players so that each player gets 5 cards
    for (let i = 0; i < 20; i++) {
        players[i % 4].hand.push(deck[i]);
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

const logger = (label = '', obj: any): void => {
    // console.log(label, JSON.stringify(obj, null, 2));
    console.log(label);
    console.dir(obj, { depth: null, colors: true });
};

class Game {
    public deck: Card[];
    public players: Player[];
    public teams: Team[];
    public kitty: Card[];
    public trump: Suit;

    constructor() {
        this.deck = shuffleDeck(buildDeck());
        this.players = createPlayers();
        this.teams = [
            {
                players: [this.players[0], this.players[2]],
                score: 0
            },
            {
                players: [this.players[1], this.players[3]],
                score: 0
            }
        ];
        this.kitty = dealDeck(this.deck, this.players);

        //set trump to the top card of the kitty
        this.trump = this.kitty[0].suit;

        this.startGame();
    }

    public startGame() {
        const dealerIndex = Math.floor(Math.random() * 4);
        this.players[dealerIndex].isDealer = true;

        // update the isTrump property for each card in the players' hands
        this.setTrumpOnDeck();

        logger('trump', this.trump);
        logger('players', this.players);
    }

    public setTrumpOnDeck() {
        this.players.forEach(player => {
            player.hand.forEach(card => {
                card.isTrump = isCardTrump(card, this.trump);
            });
        });
    }

    public printPlayerTeams(players: Player[]) {
        const playerTeams = players.map(player => {
            return {
                team: player.team,
                isPlayer: player.isPlayer,
                isDealer: player.isDealer,
                isPlayerTeammate: player.isPlayerTeammate
            };
        });

        logger('playerTeams', playerTeams);
    }
}

(() => {
    const game = new Game();

    // logger('players', game.players);
    // logger('kitty', game.kitty);
})();
