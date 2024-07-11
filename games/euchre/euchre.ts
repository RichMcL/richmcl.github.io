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
    playIndex?: number;
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

const cardValueToKey = (value: CardValue): string => {
    switch (value) {
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
    public deck: Card[];
    public players!: Player[];
    public teams: Team[];
    public kitty: Card[];
    public trump: Suit;

    public trickCount = 0;
    public currentTrick: Card[] = [];
    public currentPlayer?: Player;

    public playerOrder: number[] = [];

    constructor() {
        this.deck = this.buildAndShuffleDeck();
        this.players = this.createPlayers();
        this.teams = this.buildTeams();
        this.kitty = this.dealDeck(this.deck, this.players);

        //set trump to the top card of the kitty
        this.trump = this.kitty[3].suit;

        this.startGame();

        this.playGame();
    }

    public startGame() {
        const dealerIndex = Math.floor(Math.random() * 4);
        this.players[dealerIndex].isDealer = true;
        this.players[dealerIndex].dealIndex = 0;

        // set the dealIndex for each play starting left of the dealer
        for (let i = 1; i < 4; i++) {
            this.players[(dealerIndex + i) % 4].dealIndex = i;
        }

        // set the playIndex for each player starting left of the dealer
        for (let p of this.players) {
            let playIndex = p.dealIndex! - 1;

            if (playIndex < 0) {
                playIndex = 3;
            }

            p.playIndex = playIndex;
        }

        // update the isTrump property for each card in the players' hands
        this.setTrumpOnDeck();

        console.log('Game started', this);

        const player1DeckNode = document.querySelectorAll('.player-1-deck')[0];
        player1DeckNode.innerHTML = '';

        this.players[0].hand.forEach(card => {
            const cardHtml = `
                <div class="card-wrapper">
                    <div class="card-face ${cardValueToKey(
                        card.value
                    )}-${card.suit.toLowerCase()}"></div>
                </div>
            `;

            player1DeckNode.innerHTML += cardHtml;
        });

        const player2DeckNode = document.querySelectorAll('.player-2-deck')[0];
        player2DeckNode.innerHTML = '';

        this.players[1].hand.forEach(card => {
            const cardHtml = `
                <div class="card-wrapper">
                    <div class="card-face ${cardValueToKey(
                        card.value
                    )}-${card.suit.toLowerCase()}"></div>
                </div>
            `;

            player2DeckNode.innerHTML += cardHtml;
        });

        const player3DeckNode = document.querySelectorAll('.player-3-deck')[0];
        player3DeckNode.innerHTML = '';

        this.players[2].hand.forEach(card => {
            const cardHtml = `
                <div class="card-wrapper">
                    <div class="card-face ${cardValueToKey(
                        card.value
                    )}-${card.suit.toLowerCase()}"></div>
                </div>
            `;

            player3DeckNode.innerHTML += cardHtml;
        });

        const player4DeckNode = document.querySelectorAll('.player-4-deck')[0];
        player4DeckNode.innerHTML = '';

        this.players[3].hand.forEach(card => {
            const cardHtml = `
                <div class="card-wrapper">
                    <div class="card-face ${cardValueToKey(
                        card.value
                    )}-${card.suit.toLowerCase()}"></div>
                </div>
            `;

            player4DeckNode.innerHTML += cardHtml;
        });

        const kittyDeckNode = document.querySelectorAll('.kitty-wrapper')[0];

        this.kitty.forEach(card => {
            const cardHtml = `
                <div class="card-wrapper">
                    <div class="card-face ${cardValueToKey(
                        card.value
                    )}-${card.suit.toLowerCase()}"></div>
                </div>
            `;

            kittyDeckNode.innerHTML += cardHtml;
        });

        document.querySelectorAll('#trump-icon')[0].className = `icon-${this.trump.toLowerCase()}`;
        document.querySelectorAll('.trump-value')[0].innerHTML = this.trump;
    }

    public async playGame() {
        this.playerOrder = this.getPlayOrder();
        console.log('playerOrder', this.playerOrder);

        while (this.trickCount < 5) {
            //clear all played card zones

            await this.sleep(2000);

            document.querySelectorAll('.played-card-zone').forEach(zone => {
                zone.innerHTML = '';
            });

            //for each player in playerOrder, play a card
            for (let playerNum of this.playerOrder) {
                this.currentPlayer = this.getPlayerByPlayerNum(playerNum);

                if (this.currentPlayer.isPlayer) {
                    // this.printGameBoard();

                    const hand: string[] = this.currentPlayer.hand.map(card =>
                        this.getCardPrint(card)
                    );

                    //here await the user clicking a card
                    const cardIndex = await this.getUserCardChoice();

                    const playedCard = this.currentPlayer.hand[cardIndex as number];

                    this.currentTrick.push(playedCard);
                    this.currentPlayer.hand.splice(this.currentPlayer.hand.indexOf(playedCard), 1);

                    //Play the card on the game board
                    const playedCardNode = document.querySelectorAll(
                        `.played-card-zone.player-1-played`
                    )[0];

                    const cardHtml = `
                        <div class="card-wrapper">
                            <div class="card-face ${cardValueToKey(
                                playedCard.value
                            )}-${playedCard.suit.toLowerCase()}"></div>
                        </div>
                    `;

                    playedCardNode.innerHTML = cardHtml;

                    const toRemove = `.player-1-deck > .card-wrapper > .${cardValueToKey(
                        playedCard.value
                    )}-${playedCard.suit.toLowerCase()}`;

                    //Remove the card from the player's hand on the game board
                    const playerDeckNode = document.querySelectorAll(toRemove)[0];

                    (playerDeckNode.parentNode as Element)?.remove();
                } else {
                    await this.sleep(2000);
                    this.playNpcCard(this.currentPlayer);
                    // this.printGameBoard();
                }
            }

            //after each player has played a card, determine the winner of the trick
            const winningCard = this.getWinningCard();

            console.log('WINNING CARD: ', this.getCardPrint(winningCard));

            //get the index of the winning card in the current trick
            const winningIndex = this.currentTrick.findIndex(card => card === winningCard);

            //get the player who played the winning card
            const winningPlayer = this.players.find(player => player.playIndex === winningIndex)!;

            console.log('WINNING PLAYER: ', winningPlayer.playerNum);

            //increment the tricksTaken for the winning player's team
            const winningTeam = this.teams.find(team => team.players.includes(winningPlayer))!;
            winningTeam.tricksTaken++;

            this.trickCount++;

            this.currentTrick = [];

            console.log(
                'WINNING TEAM: ',
                winningTeam.players.map(player => player.playerNum)
            );

            this.sleep(1000);
        }
    }

    public getUserCardChoice() {
        return new Promise(resolve => {
            const cardButtons = document.querySelectorAll('.player-1-deck .card-wrapper');

            cardButtons.forEach((button, index) => {
                button.addEventListener('click', () => {
                    resolve(index);
                });
            });
        });
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

    public playNpcCard(player: Player) {
        const ledSuit = this.getLedSuit();
        const ledTrump = this.getLedTrump();
        let playedCard: Card;

        // if trump was led, the player must play a trump card if they have one
        if (ledTrump) {
            const trumpCard = player.hand.find(card => card.isTrump);
            if (trumpCard) {
                playedCard = trumpCard;
            } else {
                // if the player doesn't have a trump card, they can play any card
                playedCard = player.hand[0];
            }
        } else if (ledSuit) {
            // if the player has a card in the led suit, they must play it
            const ledSuitCard = player.hand.find(card => card.suit === ledSuit);
            if (ledSuitCard) {
                playedCard = ledSuitCard;
            } else {
                // if the player doesn't have a card in the led suit, they can play any card
                playedCard = player.hand[0];
            }
        } else {
            // else the player can play any card
            playedCard = player.hand[0];
        }

        this.currentTrick.push(playedCard);
        player.hand.splice(player.hand.indexOf(playedCard), 1);

        //Play the card on the game board
        const playedCardNode = document.querySelectorAll(
            `.played-card-zone.player-${player.playerNum}-played`
        )[0];

        const cardHtml = `
            <div class="card-wrapper">
                <div class="card-face ${cardValueToKey(
                    playedCard.value
                )}-${playedCard.suit.toLowerCase()}"></div>
            </div>
        `;

        playedCardNode.innerHTML = cardHtml;

        const toRemove = `.player-${player.playerNum}-deck > .card-wrapper > .${cardValueToKey(
            playedCard.value
        )}-${playedCard.suit.toLowerCase()}`;

        //Remove the card from the player's hand on the game board
        const playerDeckNode = document.querySelectorAll(toRemove)[0];

        (playerDeckNode.parentNode as Element)?.remove();
    }

    public getWinningCard(): Card {
        const ledSuit = this.getLedSuit();
        const ledTrump = this.getLedTrump();
        let winningCard = this.currentTrick[0];

        for (let i = 1; i < this.currentTrick.length; i++) {
            const card = this.currentTrick[i];

            if (this.isCardTrump(card, this.trump) && !this.isCardTrump(winningCard, this.trump)) {
                // if new card is trump and winning card is not, new card wins
                winningCard = card;
            } else if (
                this.isCardTrump(card, this.trump) &&
                this.isCardTrump(winningCard, this.trump)
            ) {
                // if both cards are trump, compare values but right bower beats left bower beats other trump
                if (card.value === CardValue.Jack && card.suit === this.trump) {
                    // if new card is the right bower
                    winningCard = card;
                } else if (
                    winningCard.value === CardValue.Jack &&
                    winningCard.suit === this.trump
                ) {
                    // if current winning card is the right bower
                    continue;
                } else if (card.value === CardValue.Jack && this.isCardTrump(card, this.trump)) {
                    // if new card is the left bower
                    winningCard = card;
                } else if (
                    winningCard.value === CardValue.Jack &&
                    this.isCardTrump(card, this.trump)
                ) {
                    // if winning card is the left bower
                    continue;
                } else if (card.value > winningCard.value) {
                    // else compare the natural trump values
                    winningCard = card;
                }
            } else {
                // if new card is led suit and winning card is not, new card wins
                if (card.suit === ledSuit && winningCard.suit !== ledSuit) {
                    winningCard = card;
                } else if (card.suit === ledSuit && winningCard.suit === ledSuit) {
                    // if both cards are led suit, compare values
                    if (card.value > winningCard.value) {
                        winningCard = card;
                    }
                }
            }
        }

        return winningCard;
    }

    public getLedSuit() {
        if (this.currentTrick.length === 0) {
            return null;
        }

        return this.currentTrick[0].suit;
    }

    public getLedTrump(): boolean {
        if (this.currentTrick.length === 0) {
            return false;
        }

        return this.currentTrick[0].isTrump!;
    }

    public getDealOrder() {
        const clone = [...this.players];
        return [
            ...clone.sort((a, b) => a.dealIndex! - b.dealIndex!).map(player => player.playerNum)
        ];
    }

    public getPlayOrder() {
        const clone = [...this.players];

        return [
            ...clone.sort((a, b) => a.playIndex! - b.playIndex!).map(player => player.playerNum)
        ];
    }

    public getPlayerByPlayerNum(playerNum: number): Player {
        return this.players.find(player => player.playerNum === playerNum)!;
    }

    public printPlayerTeams(players: Player[]) {
        const playerTeams = players.map(player => {
            return {
                playerNum: player.playerNum,
                team: player.team,
                isPlayer: player.isPlayer,
                isDealer: player.isDealer,
                isPlayerTeammate: player.isPlayerTeammate,
                playIndex: player.playIndex,
                dealIndex: player.dealIndex
            };
        });

        logger('playerTeams', playerTeams);
    }

    public getDealer(): Player {
        return this.players.find(player => player.isDealer)!;
    }

    public getCardPrint(card: Card): string {
        return card.value + ' ' + SuitIcon[card.suit];
    }

    public getHandPrint(hand: Card[]): string {
        return hand.map(card => this.getCardPrint(card)).join(' - ');
    }

    public getPlayerHandPrint(player: Player): string {
        if (!this.currentPlayer?.isPlayer) {
            return ' *** WAITING FOR CPU *** ';
        }

        return this.getHandPrint(player.hand);
    }

    public isCurrentPlayerMarker(player: Player): string {
        return player.playerNum === this.currentPlayer?.playerNum ? '>' : ' ';
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
