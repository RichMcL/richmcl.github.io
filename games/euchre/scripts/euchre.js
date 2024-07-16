var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var Suit;
(function (Suit) {
    Suit["Spades"] = "Spades";
    Suit["Clubs"] = "Clubs";
    Suit["Diamonds"] = "Diamonds";
    Suit["Hearts"] = "Hearts";
})(Suit || (Suit = {}));
var SuitIcon;
(function (SuitIcon) {
    SuitIcon["Spades"] = "\u2660";
    SuitIcon["Clubs"] = "\u2663";
    SuitIcon["Diamonds"] = "\u2666";
    SuitIcon["Hearts"] = "\u2665";
})(SuitIcon || (SuitIcon = {}));
var CardValue;
(function (CardValue) {
    CardValue["Nine"] = "9";
    CardValue["Ten"] = "10";
    CardValue["Jack"] = "J";
    CardValue["Queen"] = "Q";
    CardValue["King"] = "K";
    CardValue["Ace"] = "A";
})(CardValue || (CardValue = {}));
var OrderAction;
(function (OrderAction) {
    OrderAction["Pass"] = "Pass";
    OrderAction["OrderUp"] = "Order Up";
    OrderAction["Alone"] = "Alone";
})(OrderAction || (OrderAction = {}));
var blackSuits = [Suit.Spades, Suit.Clubs];
var redSuits = [Suit.Diamonds, Suit.Hearts];
var logger = function (label, obj) {
    if (label === void 0) { label = ''; }
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
        var _this = this;
        this.trickCount = 0;
        this.currentTrick = [];
        this.playerOrder = [];
        this.deck = this.buildAndShuffleDeck();
        this.players = this.createPlayers();
        this.teams = this.buildTeams();
        this.kitty = this.dealDeck(this.deck, this.players);
        //set trump to the top card of the kitty
        this.trump = this.kitty[3].suit;
        // update the isTrump property for each card in the players' hands
        this.setTrumpOnDeck();
        //sort player hands by suit and value, prioritizing trump
        this.players.forEach(function (player) {
            _this.sortPlayerHand(player);
        });
        this.startGame();
        this.playGame();
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
        console.log('Game started', this);
        this.renderInitialHands();
        this.renderKitty();
        this.setTrumpIconAndValue(this.trump);
    };
    Game.prototype.setTrumpIconAndValue = function (suit) {
        document.querySelectorAll('#trump-icon')[0].className = "icon-".concat(suit.toLowerCase());
        document.querySelectorAll('.trump-value')[0].innerHTML = suit;
    };
    Game.prototype.renderInitialHands = function () {
        var _this = this;
        [0, 1, 2, 3].forEach(function (index) {
            _this.renderPlayerHand(index);
        });
    };
    Game.prototype.renderPlayerHand = function (index) {
        var _this = this;
        var player = this.players[index];
        var playerDeckNode = document.querySelectorAll(".player-".concat(player.playerNum, "-deck"))[0];
        playerDeckNode.innerHTML = '';
        this.players[index].hand.forEach(function (card) {
            var cardHtml = _this.buildCardHtml(card, true);
            playerDeckNode.innerHTML += cardHtml;
        });
    };
    Game.prototype.renderKitty = function () {
        var _this = this;
        var kittyDeckNode = document.querySelectorAll('.kitty-wrapper')[0];
        this.kitty.forEach(function (card, index) {
            var cardHtml = _this.buildCardHtml(card, index === 3);
            kittyDeckNode.innerHTML += cardHtml;
        });
    };
    Game.prototype.playGame = function () {
        return __awaiter(this, void 0, void 0, function () {
            var dealer, isOrderedUp, orderedUpBy, _i, _a, playerNum, orderAction, orderAction, isCalledTrump, _b, _c, playerNum, isStickTheDealer, result, orderAction, suit, _d, suit, orderAction, discardCard, discardCardIndex, discardCard, topKitty, dealerDeckNode, cardHtml, _loop_1, this_1;
            var _this = this;
            var _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        this.playerOrder = this.getPlayOrder();
                        console.log('playerOrder', this.playerOrder);
                        dealer = this.players.find(function (player) { return player.isDealer; });
                        document.querySelectorAll('.dealer-box-value')[0].innerHTML = "Player ".concat(dealer === null || dealer === void 0 ? void 0 : dealer.playerNum);
                        document
                            .querySelectorAll(".player-".concat(dealer.playerNum, "-dealer"))[0]
                            .classList.remove('hidden');
                        isOrderedUp = false;
                        orderedUpBy = null;
                        _i = 0, _a = this.playerOrder;
                        _g.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        playerNum = _a[_i];
                        this.currentPlayer = this.getPlayerByPlayerNum(playerNum);
                        this.updateCurrentPlayerHighlight(playerNum);
                        if (!this.currentPlayer.isPlayer) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getUserOrderAction()];
                    case 2:
                        orderAction = _g.sent();
                        console.log('PLAYER ORDER ACTION', orderAction);
                        if (orderAction === OrderAction.OrderUp || orderAction === OrderAction.Alone) {
                            isOrderedUp = true;
                            orderedUpBy = playerNum;
                            this.renderOrderActionSelection(this.currentPlayer, orderAction);
                            return [3 /*break*/, 6];
                        }
                        else {
                            this.renderOrderActionSelection(this.currentPlayer, orderAction);
                        }
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.sleep(2000)];
                    case 4:
                        _g.sent();
                        orderAction = this.npcOrderAction(this.currentPlayer);
                        console.log('playerNum', playerNum);
                        console.log('NPC ORDER ACTION: ', orderAction);
                        if (orderAction === OrderAction.OrderUp || orderAction === OrderAction.Alone) {
                            isOrderedUp = true;
                            orderedUpBy = playerNum;
                            this.renderOrderActionSelection(this.currentPlayer, orderAction);
                            return [3 /*break*/, 6];
                        }
                        else {
                            this.renderOrderActionSelection(this.currentPlayer, orderAction);
                        }
                        _g.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6:
                        console.log('isOrderedUp', isOrderedUp);
                        console.log('orderedUpBy', orderedUpBy);
                        if (!!isOrderedUp) return [3 /*break*/, 14];
                        //if no one orders up, we need to loop through again to pick trump
                        console.log('NO ONE ORDERED UP');
                        return [4 /*yield*/, this.sleep(2000)];
                    case 7:
                        _g.sent();
                        this.clearAllPlayedZones();
                        isCalledTrump = false;
                        _b = 0, _c = this.playerOrder;
                        _g.label = 8;
                    case 8:
                        if (!(_b < _c.length)) return [3 /*break*/, 13];
                        playerNum = _c[_b];
                        this.currentPlayer = this.getPlayerByPlayerNum(playerNum);
                        isStickTheDealer = this.currentPlayer.isDealer;
                        this.updateCurrentPlayerHighlight(playerNum);
                        if (!this.currentPlayer.isPlayer) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.getUserCallTrump()];
                    case 9:
                        result = (_g.sent()).result;
                        orderAction = void 0;
                        suit = void 0;
                        if (result == OrderAction.Pass) {
                            orderAction = OrderAction.Pass;
                        }
                        else {
                            suit = result;
                        }
                        console.log('suit', suit);
                        if (!suit) {
                            orderAction = OrderAction.Pass;
                        }
                        console.log('PLAYER ORDER ACTION', orderAction);
                        if (suit) {
                            this.trump = suit;
                            isCalledTrump = true;
                        }
                        this.renderCallTrumpSelection(this.currentPlayer, orderAction, suit);
                        if (isCalledTrump) {
                            return [3 /*break*/, 13];
                        }
                        return [3 /*break*/, 12];
                    case 10: return [4 /*yield*/, this.sleep(2000)];
                    case 11:
                        _g.sent();
                        this.updateCurrentPlayerHighlight(playerNum);
                        _d = this.npcCallTrump(this.currentPlayer, isStickTheDealer), suit = _d.suit, orderAction = _d.orderAction;
                        if (suit) {
                            this.trump = suit;
                            isCalledTrump = true;
                        }
                        this.renderCallTrumpSelection(this.currentPlayer, orderAction, suit);
                        if (isCalledTrump) {
                            return [3 /*break*/, 13];
                        }
                        _g.label = 12;
                    case 12:
                        _b++;
                        return [3 /*break*/, 8];
                    case 13:
                        if (isCalledTrump) {
                            this.flipKittyOnDom();
                            // update the isTrump property for each card in the players' hands
                            this.setTrumpOnDeck();
                            this.setTrumpIconAndValue(this.trump);
                            //sort player hands by suit and value, prioritizing trump
                            this.players.forEach(function (player) {
                                _this.sortPlayerHand(player);
                            });
                            this.renderInitialHands();
                        }
                        return [3 /*break*/, 18];
                    case 14:
                        if (!isOrderedUp) return [3 /*break*/, 18];
                        //If ordered up, add the kitty to the dealer's hand
                        document.querySelectorAll('.ordered-up-box-value')[0].innerHTML = "Player ".concat((_e = this.currentPlayer) === null || _e === void 0 ? void 0 : _e.playerNum);
                        if (!!dealer.isPlayer) return [3 /*break*/, 15];
                        discardCard = dealer.hand.find(function (card) { return !card.isTrump; });
                        dealer.hand.splice(dealer.hand.indexOf(discardCard), 1);
                        this.removeDiscardCardFromDom(dealer, discardCard);
                        return [3 /*break*/, 17];
                    case 15: return [4 /*yield*/, this.getUserCardChoice()];
                    case 16:
                        discardCardIndex = _g.sent();
                        discardCard = dealer.hand[discardCardIndex];
                        dealer.hand.splice(dealer.hand.indexOf(discardCard), 1);
                        this.removeDiscardCardFromDom(dealer, discardCard);
                        _g.label = 17;
                    case 17:
                        topKitty = __assign(__assign({}, this.kitty[3]), { isTrump: true });
                        dealer.hand.push(topKitty);
                        dealerDeckNode = document.querySelectorAll(".player-".concat(dealer.playerNum, "-deck"))[0];
                        cardHtml = this.buildCardHtml(topKitty, true);
                        dealerDeckNode.innerHTML += cardHtml;
                        this.flipKittyOnDom();
                        _g.label = 18;
                    case 18:
                        //TODO: If no one orders up, we need to loop through again to pick trump
                        console.log('ORDERED UP BY ', this.currentPlayer.playerNum);
                        _loop_1 = function () {
                            var _h, _j, playerNum, cardIndex, playedCard, playedCardNode, cardHtml, toRemove, playerDeckNode, winningCard, winningIndex, winningPlayer, winningTeam;
                            return __generator(this, function (_k) {
                                switch (_k.label) {
                                    case 0: 
                                    //clear all played card zones
                                    return [4 /*yield*/, this_1.sleep(2000)];
                                    case 1:
                                        //clear all played card zones
                                        _k.sent();
                                        this_1.animatePlayer2TakeTrick();
                                        // this.animatePlayer1TakeTrick();
                                        // this.animatePlayer3TakeTrick();
                                        return [4 /*yield*/, this_1.sleep(2000)];
                                    case 2:
                                        // this.animatePlayer1TakeTrick();
                                        // this.animatePlayer3TakeTrick();
                                        _k.sent();
                                        this_1.clearAllPlayedZones();
                                        _h = 0, _j = this_1.playerOrder;
                                        _k.label = 3;
                                    case 3:
                                        if (!(_h < _j.length)) return [3 /*break*/, 8];
                                        playerNum = _j[_h];
                                        this_1.currentPlayer = this_1.getPlayerByPlayerNum(playerNum);
                                        if (!this_1.currentPlayer.isPlayer) return [3 /*break*/, 5];
                                        this_1.updateCurrentPlayerHighlight(playerNum);
                                        return [4 /*yield*/, this_1.getUserCardChoice()];
                                    case 4:
                                        cardIndex = _k.sent();
                                        playedCard = this_1.currentPlayer.hand[cardIndex];
                                        this_1.currentTrick.push(playedCard);
                                        this_1.currentPlayer.hand.splice(this_1.currentPlayer.hand.indexOf(playedCard), 1);
                                        playedCardNode = document.querySelectorAll(".played-card-zone.player-1-played")[0];
                                        cardHtml = this_1.buildCardHtml(playedCard, true);
                                        playedCardNode.innerHTML = cardHtml;
                                        toRemove = ".player-1-deck > .card-wrapper > .".concat(cardValueToKey(playedCard.value), "-").concat(playedCard.suit.toLowerCase());
                                        playerDeckNode = document.querySelectorAll(toRemove)[0];
                                        (_f = playerDeckNode.parentNode) === null || _f === void 0 ? void 0 : _f.remove();
                                        return [3 /*break*/, 7];
                                    case 5:
                                        this_1.updateCurrentPlayerHighlight(playerNum);
                                        return [4 /*yield*/, this_1.sleep(2000)];
                                    case 6:
                                        _k.sent();
                                        this_1.playNpcCard(this_1.currentPlayer);
                                        _k.label = 7;
                                    case 7:
                                        _h++;
                                        return [3 /*break*/, 3];
                                    case 8:
                                        winningCard = this_1.getWinningCard();
                                        winningIndex = this_1.currentTrick.findIndex(function (card) { return card === winningCard; });
                                        winningPlayer = this_1.players.find(function (player) { return player.playIndex === winningIndex; });
                                        console.log('WINNING PLAYER: ', winningPlayer.playerNum);
                                        winningTeam = this_1.teams.find(function (team) { return team.players.includes(winningPlayer); });
                                        winningTeam.tricksTaken++;
                                        this_1.renderTrickCount();
                                        this_1.trickCount++;
                                        this_1.currentTrick = [];
                                        console.log('WINNING TEAM: ', winningTeam.players.map(function (player) { return player.playerNum; }));
                                        this_1.sleep(1000);
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _g.label = 19;
                    case 19:
                        if (!(this.trickCount < 5)) return [3 /*break*/, 21];
                        return [5 /*yield**/, _loop_1()];
                    case 20:
                        _g.sent();
                        return [3 /*break*/, 19];
                    case 21: return [2 /*return*/];
                }
            });
        });
    };
    Game.prototype.getUserCardChoice = function () {
        return new Promise(function (resolve) {
            var cardButtons = document.querySelectorAll('.player-1-deck .card-wrapper');
            cardButtons.forEach(function (button, index) {
                button.addEventListener('click', function () {
                    resolve(index);
                });
            });
        });
    };
    Game.prototype.getUserOrderAction = function () {
        var orderActionsNode = document.querySelectorAll('.player-1-order-actions')[0];
        orderActionsNode.classList.remove('hidden');
        return new Promise(function (resolve) {
            var orderActions = document.querySelectorAll('.player-1-order-actions button');
            orderActions.forEach(function (button) {
                button.addEventListener('click', function () {
                    orderActionsNode.classList.add('hidden');
                    resolve(button.innerHTML);
                });
            });
        });
    };
    Game.prototype.getUserCallTrump = function () {
        var callTrumpNode = document.querySelectorAll('.player-1-call-trump')[0];
        callTrumpNode.classList.remove('hidden');
        var kitty = this.kitty[3].suit;
        var suits = Object.values(Suit).filter(function (suit) { return suit !== kitty; });
        suits.forEach(function (suit) {
            var button = document.createElement('button');
            button.innerHTML = suit;
            button.classList.add('theme-button');
            callTrumpNode.appendChild(button);
        });
        var button = document.createElement('button');
        button.innerHTML = OrderAction.Pass;
        button.classList.add('theme-button');
        callTrumpNode.appendChild(button);
        return new Promise(function (resolve) {
            var suits = document.querySelectorAll('.player-1-call-trump button');
            suits.forEach(function (button) {
                button.addEventListener('click', function () {
                    callTrumpNode.classList.add('hidden');
                    resolve({ result: button.innerHTML });
                });
            });
        });
    };
    Game.prototype.renderOrderActionSelection = function (player, orderAction) {
        var passCardHtml = "<div class=\"pass-card\">".concat(orderAction, "</div>");
        document.querySelectorAll(".player-".concat(player.playerNum, "-played"))[0].innerHTML = passCardHtml;
    };
    Game.prototype.renderCallTrumpSelection = function (player, orderAction, suit) {
        var action;
        if (orderAction === OrderAction.Pass) {
            action = orderAction;
        }
        else if (orderAction === OrderAction.Alone) {
            action = "".concat(orderAction, " ").concat(suit);
        }
        else {
            action = suit;
        }
        var passCardHtml = "<div class=\"pass-card\">".concat(action, "</div>");
        document.querySelectorAll(".player-".concat(player.playerNum, "-played"))[0].innerHTML = passCardHtml;
    };
    Game.prototype.removeDiscardCardFromDom = function (dealer, discardCard) {
        var _a;
        //find the card in the DOM and remove it
        var toRemove = ".player-".concat(dealer.playerNum, "-deck > .card-wrapper > .").concat(cardValueToKey(discardCard.value), "-").concat(discardCard.suit.toLowerCase());
        var playerDeckNode = document.querySelectorAll(toRemove)[0];
        (_a = playerDeckNode.parentNode) === null || _a === void 0 ? void 0 : _a.remove();
    };
    Game.prototype.renderTrickCount = function () {
        document.querySelectorAll('.team-1-tricks')[0].innerHTML = "".concat(this.teams[0].tricksTaken);
        document.querySelectorAll('.team-2-tricks')[0].innerHTML = "".concat(this.teams[1].tricksTaken);
    };
    Game.prototype.updateCurrentPlayerHighlight = function (playerNum) {
        document.querySelectorAll('.played-card-zone').forEach(function (zone) {
            zone.classList.remove('current-player');
        });
        document
            .querySelectorAll(".played-card-zone.player-".concat(playerNum, "-played"))[0]
            .classList.add('current-player');
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
    Game.prototype.sortPlayerHand = function (player) {
        var _this = this;
        player.hand.sort(function (a, b) {
            //if a is the right bower, it should be first
            if (a.value === CardValue.Jack && a.suit === _this.trump) {
                return -1;
            }
            //if b is the right bower, it should be first
            if (b.value === CardValue.Jack && b.suit === _this.trump) {
                return 1;
            }
            //if a is the left bower, it should be first
            if (a.value === CardValue.Jack && a.isTrump) {
                return -1;
            }
            //if b is the left bower, it should be first
            if (b.value === CardValue.Jack && b.isTrump) {
                return 1;
            }
            //if a is trump, it should be first
            if (a.isTrump && !b.isTrump) {
                return -1;
            }
            //if b is trump, it should be first
            if (!a.isTrump && b.isTrump) {
                return 1;
            }
            //if a and b are both trump, compare their values
            if (a.isTrump && b.isTrump) {
                if (a.value === CardValue.Jack && a.suit === _this.trump) {
                    return -1;
                }
                if (b.value === CardValue.Jack && b.suit === _this.trump) {
                    return 1;
                }
                return a.value > b.value ? -1 : 1;
            }
            //if a and b are both not trump, compare their suits
            if (a.suit === b.suit) {
                return a.value > b.value ? -1 : 1;
            }
            //if a and b are different suits, compare their suits
            return a.suit > b.suit ? -1 : 1;
        });
        //reverse the order of the hand so that the highest cards are first
        player.hand.reverse();
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
            if ((blackSuits.includes(trump) && blackSuits.includes(card.suit)) ||
                (redSuits.includes(trump) && redSuits.includes(card.suit))) {
                return true;
            }
        }
        return false;
    };
    Game.prototype.buildCardHtml = function (card, showTrump) {
        if (showTrump === void 0) { showTrump = false; }
        card.isTrump = this.isCardTrump(card, this.trump);
        return "\n        <div class=\"card-wrapper ".concat(card.isTrump && showTrump ? 'steel' : '', "\">\n            <div class=\"card-face ").concat(cardValueToKey(card.value), "-").concat(card.suit.toLowerCase(), "\"></div>\n        </div>\n        ");
    };
    Game.prototype.playNpcCard = function (player) {
        var _a;
        var ledSuit = this.getLedSuit();
        var ledTrump = this.getLedTrump();
        var playedCard;
        // if the player has the lead, play the highest card in their hand
        if (this.currentTrick.length === 0) {
            playedCard = player.hand[player.hand.length - 1];
        }
        else if (ledTrump) {
            // if trump was led, the player must play a trump card if they have one
            var trumpCard = player.hand.find(function (card) { return card.isTrump; });
            if (trumpCard) {
                playedCard = trumpCard;
            }
            else {
                // if the player doesn't have a trump card, they can play any card
                playedCard = player.hand[0];
            }
        }
        else if (ledSuit) {
            // if the player has a card in the led suit, they must play it
            var ledSuitCard = player.hand.find(function (card) { return card.suit === ledSuit; });
            if (ledSuitCard) {
                playedCard = ledSuitCard;
            }
            else {
                // if the player doesn't have a card in the led suit, they can play any card
                playedCard = player.hand[0];
            }
        }
        else {
            // else the player can play any card
            playedCard = player.hand[0];
        }
        this.currentTrick.push(playedCard);
        player.hand.splice(player.hand.indexOf(playedCard), 1);
        //Play the card on the game board
        var playedCardNode = document.querySelectorAll(".played-card-zone.player-".concat(player.playerNum, "-played"))[0];
        var cardHtml = this.buildCardHtml(playedCard, true);
        playedCardNode.innerHTML = cardHtml;
        var toRemove = ".player-".concat(player.playerNum, "-deck > .card-wrapper > .").concat(cardValueToKey(playedCard.value), "-").concat(playedCard.suit.toLowerCase());
        //Remove the card from the player's hand on the game board
        var playerDeckNode = document.querySelectorAll(toRemove)[0];
        (_a = playerDeckNode.parentNode) === null || _a === void 0 ? void 0 : _a.remove();
    };
    Game.prototype.npcOrderAction = function (player) {
        var trump = this.kitty[3].suit;
        var hasRightBower = player.hand.find(function (card) { return card.value === CardValue.Jack && card.suit === trump; });
        var hasLeftBower = player.hand.find(function (card) { return card.value === CardValue.Jack && card.isTrump && card.suit !== trump; });
        var trumpCount = player.hand.filter(function (card) { return card.isTrump; }).length;
        var aceCount = player.hand.filter(function (card) { return card.value === CardValue.Ace; }).length;
        // if the player has both bowers, and either 4 trump or 2 aces, go alone
        if (hasRightBower && hasLeftBower && (trumpCount >= 4 || aceCount >= 2)) {
            return OrderAction.Alone;
        }
        // if the player has a right bower and another trump card, order up
        if (hasRightBower && trumpCount >= 2) {
            return OrderAction.OrderUp;
        }
        // if the player is dealer and has a left bower and another trump card, order up
        if (player.isDealer && hasLeftBower && trumpCount >= 2) {
            return OrderAction.OrderUp;
        }
        // if they have at least 2 trump cards, order up
        if (trumpCount >= 3) {
            return OrderAction.OrderUp;
        }
        // else pass
        return OrderAction.Pass;
    };
    Game.prototype.npcCallTrump = function (player, stickTheDealer) {
        // npc can call any suit other than the top card of the kitty
        var kitty = this.kitty[3].suit;
        var suits = Object.values(Suit).filter(function (suit) { return suit !== kitty; });
        var _loop_2 = function (suit) {
            if (player.hand.filter(function (card) { return card.suit === suit; }).length >= 4) {
                return { value: { suit: suit, orderAction: OrderAction.Alone } };
            }
        };
        // if the player has 4 or more cards in a suit, call that suit and go alone
        for (var _i = 0, suits_1 = suits; _i < suits_1.length; _i++) {
            var suit = suits_1[_i];
            var state_1 = _loop_2(suit);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        var _loop_3 = function (suit) {
            if (player.hand.filter(function (card) { return card.suit === suit; }).length === 3) {
                return { value: { suit: suit } };
            }
        };
        //if the player has 3 cards in a suit, call that suit
        for (var _a = 0, suits_2 = suits; _a < suits_2.length; _a++) {
            var suit = suits_2[_a];
            var state_2 = _loop_3(suit);
            if (typeof state_2 === "object")
                return state_2.value;
        }
        //if stickTheDealer is true, pick random suit from their hand, but not the kitty suit
        if (stickTheDealer) {
            var cards = player.hand.filter(function (card) { return card.suit !== kitty; });
            var randomCard = cards[Math.floor(Math.random() * suits.length)];
            return { suit: randomCard.suit };
        }
        // else pass
        return { orderAction: OrderAction.Pass, suit: undefined };
    };
    Game.prototype.clearAllPlayedZones = function () {
        document.querySelectorAll('.played-card-zone').forEach(function (zone) {
            zone.innerHTML = '';
        });
    };
    Game.prototype.flipKittyOnDom = function () {
        //delete the card faces from the kitty and swap with red deck
        document.querySelectorAll('.kitty-wrapper .card-face').forEach(function (card, index) {
            card.remove();
        });
        document.querySelectorAll('.kitty-wrapper .card-wrapper').forEach(function (card, index) {
            card.classList.add('red-deck');
            if (index === 3) {
                card.remove();
            }
        });
    };
    Game.prototype.animatePlayer1TakeTrick = function () {
        var _a, _b, _c, _d;
        (_a = document
            .querySelectorAll('.played-card-zone.player-1-played .card-wrapper')[0]) === null || _a === void 0 ? void 0 : _a.classList.add('player-1-take-trick-from-3');
        (_b = document
            .querySelectorAll('.played-card-zone.player-2-played .card-wrapper')[0]) === null || _b === void 0 ? void 0 : _b.classList.add('player-1-take-trick-from-2');
        (_c = document
            .querySelectorAll('.played-card-zone.player-3-played .card-wrapper')[0]) === null || _c === void 0 ? void 0 : _c.classList.add('player-1-take-trick-from-3');
        (_d = document
            .querySelectorAll('.played-card-zone.player-4-played .card-wrapper')[0]) === null || _d === void 0 ? void 0 : _d.classList.add('player-1-take-trick-from-4');
    };
    Game.prototype.animatePlayer2TakeTrick = function () {
        var _a, _b, _c, _d;
        (_a = document
            .querySelectorAll('.played-card-zone.player-1-played .card-wrapper')[0]) === null || _a === void 0 ? void 0 : _a.classList.add('player-2-take-trick-from-1');
        (_b = document
            .querySelectorAll('.played-card-zone.player-2-played .card-wrapper')[0]) === null || _b === void 0 ? void 0 : _b.classList.add('player-2-take-trick-from-2');
        (_c = document
            .querySelectorAll('.played-card-zone.player-3-played .card-wrapper')[0]) === null || _c === void 0 ? void 0 : _c.classList.add('player-2-take-trick-from-3');
        (_d = document
            .querySelectorAll('.played-card-zone.player-4-played .card-wrapper')[0]) === null || _d === void 0 ? void 0 : _d.classList.add('player-2-take-trick-from-4');
    };
    Game.prototype.animatePlayer3TakeTrick = function () {
        var _a, _b, _c, _d;
        (_a = document
            .querySelectorAll('.played-card-zone.player-1-played .card-wrapper')[0]) === null || _a === void 0 ? void 0 : _a.classList.add('player-3-take-trick-from-1');
        (_b = document
            .querySelectorAll('.played-card-zone.player-2-played .card-wrapper')[0]) === null || _b === void 0 ? void 0 : _b.classList.add('player-3-take-trick-from-2');
        (_c = document
            .querySelectorAll('.played-card-zone.player-3-played .card-wrapper')[0]) === null || _c === void 0 ? void 0 : _c.classList.add('player-3-take-trick-from-1');
        (_d = document
            .querySelectorAll('.played-card-zone.player-4-played .card-wrapper')[0]) === null || _d === void 0 ? void 0 : _d.classList.add('player-3-take-trick-from-4');
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
            }
            else if (this.isCardTrump(card, this.trump) &&
                this.isCardTrump(winningCard, this.trump)) {
                // if both cards are trump, compare values but right bower beats left bower beats other trump
                if (card.value === CardValue.Jack && card.suit === this.trump) {
                    // if new card is the right bower
                    winningCard = card;
                }
                else if (winningCard.value === CardValue.Jack &&
                    winningCard.suit === this.trump) {
                    // if current winning card is the right bower
                    continue;
                }
                else if (card.value === CardValue.Jack && this.isCardTrump(card, this.trump)) {
                    // if new card is the left bower
                    winningCard = card;
                }
                else if (winningCard.value === CardValue.Jack &&
                    this.isCardTrump(card, this.trump)) {
                    // if winning card is the left bower
                    continue;
                }
                else if (card.value > winningCard.value) {
                    // else compare the natural trump values
                    winningCard = card;
                }
            }
            else {
                // if new card is led suit and winning card is not, new card wins
                if (card.suit === ledSuit && winningCard.suit !== ledSuit) {
                    winningCard = card;
                }
                else if (card.suit === ledSuit && winningCard.suit === ledSuit) {
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
        return __spreadArray([], clone.sort(function (a, b) { return a.dealIndex - b.dealIndex; }).map(function (player) { return player.playerNum; }), true);
    };
    Game.prototype.getPlayOrder = function () {
        var clone = __spreadArray([], this.players, true);
        return __spreadArray([], clone.sort(function (a, b) { return a.playIndex - b.playIndex; }).map(function (player) { return player.playerNum; }), true);
    };
    Game.prototype.getPlayerByPlayerNum = function (playerNum) {
        return this.players.find(function (player) { return player.playerNum === playerNum; });
    };
    Game.prototype.getDealer = function () {
        return this.players.find(function (player) { return player.isDealer; });
    };
    // Sleep function using Promise and async/await
    Game.prototype.sleep = function (ms) {
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
    return Game;
}());
(function () {
    document.addEventListener('DOMContentLoaded', function () {
        var game = new Game();
        window.game = game;
    });
})();
