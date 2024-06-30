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
    playerNum: number;
    hand: Card[];
    team: number;
    isPlayer: boolean;
    isDealer: boolean;
    isPlayerTeammate: boolean;
    dealIndex?: number;
}

interface Team {
    players: Player[];
    score: number;
    tricksTaken: number;
}

const logger = (label = '', obj: any): void => {
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
        this.deck = this.buildAndShuffleDeck();
        this.players = this.createPlayers();
        this.teams = this.buildTeams();
        this.kitty = this.dealDeck(this.deck, this.players);

        //set trump to the top card of the kitty
        this.trump = this.kitty[0].suit;

        this.startGame();
    }

    public startGame() {
        const dealerIndex = Math.floor(Math.random() * 4);
        this.players[dealerIndex].isDealer = true;
        this.players[dealerIndex].dealIndex = 0;

        // set the dealIndex for each play starting left of the dealer
        for (let i = 1; i < 4; i++) {
            this.players[(dealerIndex + i) % 4].dealIndex = i;
        }

        // update the isTrump property for each card in the players' hands
        this.setTrumpOnDeck();

        logger('trump', this.trump);
        logger('players', this.players);
    }

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

    /**
     * Deal 5 cards to each player, and create the kitty with the remaining 4 cards
     */
    public dealDeck(deck: Card[], players: Player[]) {
        // dealt the first 20 cards randomly to the players so that each player gets 5 cards
        for (let i = 0; i < 20; i++) {
            players[i % 4].hand.push(deck[i]);
        }

        const kitty = deck.slice(20, 24);
        return kitty;
    }

    /**
     * Initialize players and teams, but doesn't deal cards or set dealer
     */
    public createPlayers(): Player[] {
        return [
            {
                playerNum: 1,
                hand: [],
                team: 1,
                isPlayer: true,
                isDealer: false,
                isPlayerTeammate: false
            },
            {
                playerNum: 2,
                hand: [],
                team: 2,
                isPlayer: false,
                isDealer: false,
                isPlayerTeammate: false
            },
            {
                playerNum: 3,
                hand: [],
                team: 1,
                isPlayer: false,
                isDealer: false,
                isPlayerTeammate: true
            },
            {
                playerNum: 4,
                hand: [],
                team: 2,
                isPlayer: false,
                isDealer: false,
                isPlayerTeammate: false
            }
        ];
    }

    public buildTeams() {
        return [
            {
                players: [this.players[0], this.players[2]],
                score: 0,
                tricksTaken: 0
            },
            {
                players: [this.players[1], this.players[3]],
                score: 0,
                tricksTaken: 0
            }
        ];
    }

    public setTrumpOnDeck() {
        this.players.forEach(player => {
            player.hand.forEach(card => {
                card.isTrump = this.isCardTrump(card, this.trump);
            });
        });
    }

    public isCardTrump(card: Card, trump: Suit): boolean {
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
})();
