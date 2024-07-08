var __spreadArray =
    (this && this.__spreadArray) ||
    function (to, from, pack) {
        if (pack || arguments.length === 2)
            for (var i = 0, l = from.length, ar; i < l; i++) {
                if (ar || !(i in from)) {
                    if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                    ar[i] = from[i];
                }
            }
        return to.concat(ar || Array.prototype.slice.call(from));
    };
var Suit;
(function (Suit) {
    Suit['Spades'] = 'Spades';
    Suit['Clubs'] = 'Clubs';
    Suit['Diamonds'] = 'Diamonds';
    Suit['Hearts'] = 'Hearts';
})(Suit || (Suit = {}));
var SuitIcon;
(function (SuitIcon) {
    SuitIcon['Spades'] = '\u2660';
    SuitIcon['Clubs'] = '\u2663';
    SuitIcon['Diamonds'] = '\u2666';
    SuitIcon['Hearts'] = '\u2665';
})(SuitIcon || (SuitIcon = {}));
var CardValue;
(function (CardValue) {
    CardValue['Nine'] = '9';
    CardValue['Ten'] = '10';
    CardValue['Jack'] = 'J';
    CardValue['Queen'] = 'Q';
    CardValue['King'] = 'K';
    CardValue['Ace'] = 'A';
})(CardValue || (CardValue = {}));
var blackSuits = [Suit.Spades, Suit.Clubs];
var redSuits = [Suit.Diamonds, Suit.Hearts];
var logger = function (label, obj) {
    if (label === void 0) {
        label = '';
    }
    console.log(label);
    console.dir(obj, { depth: null, colors: true });
};
var cardValueToKey = function (value) {
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
var Game = /** @class */ (function () {
    function Game() {
        this.trickCount = 0;
        this.currentTrick = [];
        this.deck = this.buildAndShuffleDeck();
        this.players = this.createPlayers();
        this.teams = this.buildTeams();
        this.kitty = this.dealDeck(this.deck, this.players);
        //set trump to the top card of the kitty
        this.trump = this.kitty[0].suit;
        this.startGame();
    }
    Game.prototype.startGame = function () {
        var dealerIndex = Math.floor(Math.random() * 4);
        this.players[dealerIndex].isDealer = true;
        this.players[dealerIndex].dealIndex = 0;
        // set the dealIndex for each play starting left of the dealer
        for (var i = 1; i < 4; i++) {
            this.players[(dealerIndex + i) % 4].dealIndex = i;
        }
        // set the playIndex for each player starting left of the dealer
        for (var _i = 0, _a = this.players; _i < _a.length; _i++) {
            var p = _a[_i];
            var playIndex = p.dealIndex - 1;
            if (playIndex < 0) {
                playIndex = 3;
            }
            p.playIndex = playIndex;
        }
        // update the isTrump property for each card in the players' hands
        this.setTrumpOnDeck();
        console.log('Game started', this);
        var player1DeckNode = document.querySelectorAll('.player-deck')[0];
        player1DeckNode.innerHTML = '';
        this.players[0].hand.forEach(function (card) {
            var cardHtml =
                '\n                <div class="card-wrapper">\n                    <div class="card-face '
                    .concat(cardValueToKey(card.value), '-')
                    .concat(
                        card.suit.toLowerCase(),
                        '"></div>\n                </div>\n            '
                    );
            player1DeckNode.innerHTML += cardHtml;
        });
        var player2DeckNode = document.querySelectorAll('.player-2-deck')[0];
        player2DeckNode.innerHTML = '';
        this.players[1].hand.forEach(function (card) {
            var cardHtml =
                '\n                <div class="card-wrapper">\n                    <div class="card-face '
                    .concat(cardValueToKey(card.value), '-')
                    .concat(
                        card.suit.toLowerCase(),
                        '"></div>\n                </div>\n            '
                    );
            player2DeckNode.innerHTML += cardHtml;
        });
        var player3DeckNode = document.querySelectorAll('.player-3-deck')[0];
        player3DeckNode.innerHTML = '';
        this.players[2].hand.forEach(function (card) {
            var cardHtml =
                '\n                <div class="card-wrapper">\n                    <div class="card-face '
                    .concat(cardValueToKey(card.value), '-')
                    .concat(
                        card.suit.toLowerCase(),
                        '"></div>\n                </div>\n            '
                    );
            player3DeckNode.innerHTML += cardHtml;
        });
        var player4DeckNode = document.querySelectorAll('.player-4-deck')[0];
        player4DeckNode.innerHTML = '';
        this.players[3].hand.forEach(function (card) {
            var cardHtml =
                '\n                <div class="card-wrapper">\n                    <div class="card-face '
                    .concat(cardValueToKey(card.value), '-')
                    .concat(
                        card.suit.toLowerCase(),
                        '"></div>\n                </div>\n            '
                    );
            player4DeckNode.innerHTML += cardHtml;
        });
        var kittyDeckNode = document.querySelectorAll('.kitty-wrapper')[0];
        this.kitty.forEach(function (card) {
            var cardHtml =
                '\n                <div class="card-wrapper">\n                    <div class="card-face '
                    .concat(cardValueToKey(card.value), '-')
                    .concat(
                        card.suit.toLowerCase(),
                        '"></div>\n                </div>\n            '
                    );
            kittyDeckNode.innerHTML += cardHtml;
        });
    };
    Game.prototype.buildAndShuffleDeck = function () {
        var deck = [];
        for (var _i = 0, _a = Object.values(Suit); _i < _a.length; _i++) {
            var suit = _a[_i];
            for (var _b = 0, _c = Object.values(CardValue); _b < _c.length; _b++) {
                var value = _c[_b];
                deck.push({ suit: suit, value: value });
            }
        }
        for (var i = 0; i < deck.length; i++) {
            var j = Math.floor(Math.random() * deck.length);
            var temp = deck[i];
            deck[i] = deck[j];
            deck[j] = temp;
        }
        return deck;
    };
    /**
     * Deal 5 cards to each player, and create the kitty with the remaining 4 cards
     */
    Game.prototype.dealDeck = function (deck, players) {
        // dealt the first 20 cards randomly to the players so that each player gets 5 cards
        for (var i = 0; i < 20; i++) {
            players[i % 4].hand.push(deck[i]);
        }
        var kitty = deck.slice(20, 24);
        return kitty;
    };
    /**
     * Initialize players and teams, but doesn't deal cards or set dealer
     */
    Game.prototype.createPlayers = function () {
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
    };
    Game.prototype.buildTeams = function () {
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
    };
    Game.prototype.setTrumpOnDeck = function () {
        var _this = this;
        this.players.forEach(function (player) {
            player.hand.forEach(function (card) {
                card.isTrump = _this.isCardTrump(card, _this.trump);
            });
        });
    };
    Game.prototype.isCardTrump = function (card, trump) {
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
    Game.prototype.playNpcCard = function (player) {
        var ledSuit = this.getLedSuit();
        var ledTrump = this.getLedTrump();
        var playedCard;
        // if trump was led, the player must play a trump card if they have one
        if (ledTrump) {
            var trumpCard = player.hand.find(function (card) {
                return card.isTrump;
            });
            if (trumpCard) {
                playedCard = trumpCard;
            } else {
                // if the player doesn't have a trump card, they can play any card
                playedCard = player.hand[0];
            }
        } else if (ledSuit) {
            // if the player has a card in the led suit, they must play it
            var ledSuitCard = player.hand.find(function (card) {
                return card.suit === ledSuit;
            });
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
    };
    Game.prototype.getWinningCard = function () {
        var ledSuit = this.getLedSuit();
        var ledTrump = this.getLedTrump();
        var winningCard = this.currentTrick[0];
        for (var i = 1; i < this.currentTrick.length; i++) {
            var card = this.currentTrick[i];
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
    };
    Game.prototype.getLedSuit = function () {
        if (this.currentTrick.length === 0) {
            return null;
        }
        return this.currentTrick[0].suit;
    };
    Game.prototype.getLedTrump = function () {
        if (this.currentTrick.length === 0) {
            return false;
        }
        return this.currentTrick[0].isTrump;
    };
    Game.prototype.getDealOrder = function () {
        var clone = __spreadArray([], this.players, true);
        return __spreadArray(
            [],
            clone
                .sort(function (a, b) {
                    return a.dealIndex - b.dealIndex;
                })
                .map(function (player) {
                    return player.playerNum;
                }),
            true
        );
    };
    Game.prototype.getPlayOrder = function () {
        var clone = __spreadArray([], this.players, true);
        return __spreadArray(
            [],
            clone
                .sort(function (a, b) {
                    return a.playIndex - b.playIndex;
                })
                .map(function (player) {
                    return player.playerNum;
                }),
            true
        );
    };
    Game.prototype.getPlayerByPlayerNum = function (playerNum) {
        return this.players.find(function (player) {
            return player.playerNum === playerNum;
        });
    };
    Game.prototype.printPlayerTeams = function (players) {
        var playerTeams = players.map(function (player) {
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
    };
    Game.prototype.getDealer = function () {
        return this.players.find(function (player) {
            return player.isDealer;
        });
    };
    Game.prototype.getCardPrint = function (card) {
        return card.value + ' ' + SuitIcon[card.suit];
    };
    Game.prototype.getHandPrint = function (hand) {
        var _this = this;
        return hand
            .map(function (card) {
                return _this.getCardPrint(card);
            })
            .join(' - ');
    };
    Game.prototype.getPlayerHandPrint = function (player) {
        var _a;
        if (!((_a = this.currentPlayer) === null || _a === void 0 ? void 0 : _a.isPlayer)) {
            return ' *** WAITING FOR CPU *** ';
        }
        return this.getHandPrint(player.hand);
    };
    Game.prototype.isCurrentPlayerMarker = function (player) {
        var _a;
        return player.playerNum ===
            ((_a = this.currentPlayer) === null || _a === void 0 ? void 0 : _a.playerNum)
            ? '>'
            : ' ';
    };
    // Sleep function using Promise and async/await
    Game.prototype.sleep = function (ms) {
        return new Promise(function (resolve) {
            return setTimeout(resolve, ms);
        });
    };
    return Game;
})();
(function () {
    setTimeout(function () {
        var game = new Game();
        window.game = game;
    }, 100);
})();
