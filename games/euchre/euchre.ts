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

enum OrderAction {
    Pass = 'Pass',
    OrderUp = 'Order Up',
    Alone = 'Alone'
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

        //sort each player's hand by suit and value
        this.players.forEach(player => {
            player.hand.sort((a, b) => {
                if (a.suit === b.suit) {
                    return a.value > b.value ? 1 : -1;
                }

                return a.suit > b.suit ? 1 : -1;
            });
        });

        console.log('Game started', this);

        this.renderInitialHands();
        this.renderKitty();

        document.querySelectorAll('#trump-icon')[0].className = `icon-${this.trump.toLowerCase()}`;
        document.querySelectorAll('.trump-value')[0].innerHTML = this.trump;
    }

    public renderInitialHands() {
        [0, 1, 2, 3].forEach(index => {
            this.renderPlayerHand(index);
        });
    }

    public renderPlayerHand(index: number): void {
        const player = this.players[index];

        const playerDeckNode = document.querySelectorAll(`.player-${player.playerNum}-deck`)[0];
        playerDeckNode.innerHTML = '';

        this.players[index].hand.forEach(card => {
            const cardHtml = this.buildCardHtml(card);

            playerDeckNode.innerHTML += cardHtml;
        });
    }

    public renderKitty() {
        const kittyDeckNode = document.querySelectorAll('.kitty-wrapper')[0];

        this.kitty.forEach(card => {
            const cardHtml = this.buildCardHtml(card);

            kittyDeckNode.innerHTML += cardHtml;
        });
    }

    public async playGame() {
        this.playerOrder = this.getPlayOrder();
        console.log('playerOrder', this.playerOrder);
        const dealer = this.players.find(player => player.isDealer);
        document.querySelectorAll('.dealer-box-value')[0].innerHTML = `Player ${dealer?.playerNum}`;
        document
            .querySelectorAll(`.player-${dealer.playerNum}-dealer`)[0]
            .classList.remove('hidden');

        let isOrderedUp = false;
        let orderedUpBy: number = null;

        // We need to determine trump so use the playOrder to ask pass or order up
        for (let playerNum of this.playerOrder) {
            this.currentPlayer = this.getPlayerByPlayerNum(playerNum);

            this.updateCurrentPlayerHighlight(playerNum);

            if (this.currentPlayer.isPlayer) {
                //Unhide player-1-order-actions and await a button click
                const orderAction = await this.getUserOrderAction();
                console.log('PLAYER ORDER ACTION', orderAction);

                if (orderAction === OrderAction.OrderUp || orderAction === OrderAction.Alone) {
                    isOrderedUp = true;
                    orderedUpBy = playerNum;

                    this.renderOrderActionSelection(this.currentPlayer, orderAction);

                    break;
                } else {
                    this.renderOrderActionSelection(this.currentPlayer, orderAction);
                }
            } else {
                await this.sleep(2000);
                const orderAction = this.npcOrderAction(this.currentPlayer);
                console.log('playerNum', playerNum);
                console.log('NPC ORDER ACTION: ', orderAction);

                if (orderAction === OrderAction.OrderUp || orderAction === OrderAction.Alone) {
                    isOrderedUp = true;
                    orderedUpBy = playerNum;

                    this.renderOrderActionSelection(this.currentPlayer, orderAction);

                    break;
                } else {
                    this.renderOrderActionSelection(this.currentPlayer, orderAction);
                }
            }
        }

        console.log('isOrderedUp', isOrderedUp);
        console.log('orderedUpBy', orderedUpBy);

        if (!isOrderedUp) {
            //if no one orders up, we need to loop through again to pick trump
            console.log('NO ONE ORDERED UP');

            await this.sleep(2000);
            this.clearAllPlayedZones();

            let isCalledTrump = false;

            for (let playerNum of this.playerOrder) {
                this.currentPlayer = this.getPlayerByPlayerNum(playerNum);
                const isStickTheDealer = this.currentPlayer.isDealer;

                this.updateCurrentPlayerHighlight(playerNum);

                if (this.currentPlayer.isPlayer) {
                    const { result } = await this.getUserCallTrump();
                    let orderAction: OrderAction;
                    let suit: Suit | undefined;

                    if (result == OrderAction.Pass) {
                        orderAction = OrderAction.Pass;
                    } else {
                        suit = result as Suit;
                    }

                    console.log('suit', suit);
                    if (!suit) {
                        orderAction = OrderAction.Pass;
                    }
                    console.log('PLAYER ORDER ACTION', orderAction);

                    if (suit) {
                        isCalledTrump = true;
                    }

                    this.renderCallTrumpSelection(this.currentPlayer, orderAction, suit);

                    if (isCalledTrump) {
                        break;
                    }
                } else {
                    await this.sleep(2000);

                    this.updateCurrentPlayerHighlight(playerNum);

                    const { suit, orderAction } = this.npcCallTrump(
                        this.currentPlayer,
                        isStickTheDealer
                    );

                    if (suit) {
                        isCalledTrump = true;
                    }

                    this.renderCallTrumpSelection(this.currentPlayer, orderAction, suit);

                    if (isCalledTrump) {
                        break;
                    }
                }
            }
        } else if (isOrderedUp) {
            //If ordered up, add the kitty to the dealer's hand
            document.querySelectorAll(
                '.ordered-up-box-value'
            )[0].innerHTML = `Player ${this.currentPlayer?.playerNum}`;

            //TODO - make this smarter
            if (!dealer.isPlayer) {
                const discardCard = dealer.hand.find(card => !card.isTrump);
                dealer.hand.splice(dealer.hand.indexOf(discardCard), 1);

                this.removeDiscardCardFromDom(dealer, discardCard);
            } else {
                //we need to prompt the player to discard a card
                const discardCardIndex = await this.getUserCardChoice();

                const discardCard = dealer.hand[discardCardIndex as number];
                dealer.hand.splice(dealer.hand.indexOf(discardCard), 1);

                this.removeDiscardCardFromDom(dealer, discardCard);
            }

            const topKitty = { ...this.kitty[3], isTrump: true };
            dealer.hand.push(topKitty);

            //find their hand in the DOM and add the element
            const dealerDeckNode = document.querySelectorAll(`.player-${dealer.playerNum}-deck`)[0];

            const cardHtml = this.buildCardHtml(topKitty);
            dealerDeckNode.innerHTML += cardHtml;

            //delete the card faces from the kitty and swap with red deck
            document.querySelectorAll('.kitty-wrapper .card-face').forEach((card, index) => {
                card.remove();
            });
            document.querySelectorAll('.kitty-wrapper .card-wrapper').forEach((card, index) => {
                card.classList.add('red-deck');

                if (index === 3) {
                    card.remove();
                }
            });
        }

        //TODO: If no one orders up, we need to loop through again to pick trump
        console.log('ORDERED UP BY ', this.currentPlayer.playerNum);

        while (this.trickCount < 5) {
            //clear all played card zones

            await this.sleep(2000);

            this.clearAllPlayedZones();

            //for each player in playerOrder, play a card
            for (let playerNum of this.playerOrder) {
                this.currentPlayer = this.getPlayerByPlayerNum(playerNum);

                if (this.currentPlayer.isPlayer) {
                    this.updateCurrentPlayerHighlight(playerNum);

                    //here await the user clicking a card
                    const cardIndex = await this.getUserCardChoice();

                    const playedCard = this.currentPlayer.hand[cardIndex as number];

                    this.currentTrick.push(playedCard);
                    this.currentPlayer.hand.splice(this.currentPlayer.hand.indexOf(playedCard), 1);

                    //Play the card on the game board
                    const playedCardNode = document.querySelectorAll(
                        `.played-card-zone.player-1-played`
                    )[0];

                    const cardHtml = this.buildCardHtml(playedCard);

                    playedCardNode.innerHTML = cardHtml;

                    const toRemove = `.player-1-deck > .card-wrapper > .${cardValueToKey(
                        playedCard.value
                    )}-${playedCard.suit.toLowerCase()}`;

                    //Remove the card from the player's hand on the game board
                    const playerDeckNode = document.querySelectorAll(toRemove)[0];

                    (playerDeckNode.parentNode as Element)?.remove();
                } else {
                    this.updateCurrentPlayerHighlight(playerNum);

                    await this.sleep(2000);
                    this.playNpcCard(this.currentPlayer);
                }
            }

            //after each player has played a card, determine the winner of the trick
            const winningCard = this.getWinningCard();

            //get the index of the winning card in the current trick
            const winningIndex = this.currentTrick.findIndex(card => card === winningCard);

            //get the player who played the winning card
            const winningPlayer = this.players.find(player => player.playIndex === winningIndex)!;

            console.log('WINNING PLAYER: ', winningPlayer.playerNum);

            //increment the tricksTaken for the winning player's team
            const winningTeam = this.teams.find(team => team.players.includes(winningPlayer))!;
            winningTeam.tricksTaken++;

            this.renderTrickCount();

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

    public getUserOrderAction(): Promise<OrderAction> {
        const orderActionsNode = document.querySelectorAll('.player-1-order-actions')[0];
        orderActionsNode.classList.remove('hidden');

        return new Promise(resolve => {
            const orderActions = document.querySelectorAll('.player-1-order-actions button');

            orderActions.forEach(button => {
                button.addEventListener('click', () => {
                    orderActionsNode.classList.add('hidden');
                    resolve(button.innerHTML as OrderAction);
                });
            });
        });
    }

    public getUserCallTrump(): Promise<{ result: Suit | OrderAction.Pass }> {
        const callTrumpNode = document.querySelectorAll('.player-1-call-trump')[0];
        callTrumpNode.classList.remove('hidden');

        const kitty = this.kitty[3].suit;
        const suits = Object.values(Suit).filter(suit => suit !== kitty);

        suits.forEach(suit => {
            const button = document.createElement('button');
            button.innerHTML = suit;
            button.classList.add('theme-button');
            callTrumpNode.appendChild(button);
        });

        const button = document.createElement('button');
        button.innerHTML = OrderAction.Pass;
        button.classList.add('theme-button');
        callTrumpNode.appendChild(button);

        return new Promise(resolve => {
            const suits = document.querySelectorAll('.player-1-call-trump button');

            suits.forEach(button => {
                button.addEventListener('click', () => {
                    callTrumpNode.classList.add('hidden');
                    resolve({ result: button.innerHTML as Suit | OrderAction.Pass });
                });
            });
        });
    }

    public renderOrderActionSelection(player: Player, orderAction: OrderAction) {
        const passCardHtml = `<div class="pass-card">${orderAction}</div>`;

        document.querySelectorAll(`.player-${player.playerNum}-played`)[0].innerHTML = passCardHtml;
    }

    public renderCallTrumpSelection(player: Player, orderAction: OrderAction, suit: Suit) {
        let action;

        if (orderAction === OrderAction.Pass) {
            action = orderAction;
        } else if (orderAction === OrderAction.Alone) {
            action = `${orderAction} ${suit}`;
        } else {
            action = suit;
        }
        const passCardHtml = `<div class="pass-card">${action}</div>`;

        document.querySelectorAll(`.player-${player.playerNum}-played`)[0].innerHTML = passCardHtml;
    }

    public removeDiscardCardFromDom(dealer: Player, discardCard: Card): void {
        //find the card in the DOM and remove it
        const toRemove = `.player-${dealer.playerNum}-deck > .card-wrapper > .${cardValueToKey(
            discardCard.value
        )}-${discardCard.suit.toLowerCase()}`;

        const playerDeckNode = document.querySelectorAll(toRemove)[0];

        (playerDeckNode.parentNode as Element)?.remove();
    }

    public renderTrickCount() {
        document.querySelectorAll('.team-1-tricks')[0].innerHTML = `${this.teams[0].tricksTaken}`;
        document.querySelectorAll('.team-2-tricks')[0].innerHTML = `${this.teams[1].tricksTaken}`;
    }

    public updateCurrentPlayerHighlight(playerNum: number) {
        document.querySelectorAll('.played-card-zone').forEach(zone => {
            zone.classList.remove('current-player');
        });

        document
            .querySelectorAll(`.played-card-zone.player-${playerNum}-played`)[0]
            .classList.add('current-player');
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

    public buildCardHtml(card: Card) {
        return `
        <div class="card-wrapper">
            <div class="card-face ${cardValueToKey(card.value)}-${card.suit.toLowerCase()}"></div>
        </div>
        `;
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

        const cardHtml = this.buildCardHtml(playedCard);

        playedCardNode.innerHTML = cardHtml;

        const toRemove = `.player-${player.playerNum}-deck > .card-wrapper > .${cardValueToKey(
            playedCard.value
        )}-${playedCard.suit.toLowerCase()}`;

        //Remove the card from the player's hand on the game board
        const playerDeckNode = document.querySelectorAll(toRemove)[0];

        (playerDeckNode.parentNode as Element)?.remove();
    }

    public npcOrderAction(player: Player): OrderAction {
        const trump = this.kitty[3].suit;

        // if the player has a right bower, order up
        if (player.hand.find(card => card.value === CardValue.Jack && card.suit === trump)) {
            return OrderAction.OrderUp;
        }

        // if they have at least 2 trump cards, order up
        if (player.hand.filter(card => card.isTrump).length >= 2) {
            return OrderAction.OrderUp;
        }

        // else pass
        return OrderAction.Pass;
    }

    public npcCallTrump(
        player: Player,
        stickTheDealer: boolean
    ):
        | { orderAction: OrderAction.Pass; suit: undefined }
        | { suit: Suit; orderAction?: OrderAction.Alone } {
        // npc can call any suit other than the top card of the kitty
        const kitty = this.kitty[3].suit;

        const suits = Object.values(Suit).filter(suit => suit !== kitty);

        // if the player has 4 or more cards in a suit, call that suit and go alone
        for (let suit of suits) {
            if (player.hand.filter(card => card.suit === suit).length >= 4) {
                return { suit, orderAction: OrderAction.Alone };
            }
        }

        //if the player has 3 cards in a suit, call that suit
        for (let suit of suits) {
            if (player.hand.filter(card => card.suit === suit).length === 3) {
                return { suit };
            }
        }

        //if stickTheDealer is true, pick random suit from their hand, but not the kitty suit
        if (stickTheDealer) {
            const cards = player.hand.filter(card => card.suit !== kitty);
            const randomCard = cards[Math.floor(Math.random() * suits.length)];

            return { suit: randomCard.suit };
        }

        // else pass
        return { orderAction: OrderAction.Pass, suit: undefined };
    }

    public clearAllPlayedZones() {
        document.querySelectorAll('.played-card-zone').forEach(zone => {
            zone.innerHTML = '';
        });
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

    public getDealer(): Player {
        return this.players.find(player => player.isDealer)!;
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
