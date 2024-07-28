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
    CardValue["Two"] = "2";
    CardValue["Three"] = "3";
    CardValue["Four"] = "4";
    CardValue["Five"] = "5";
    CardValue["Six"] = "6";
    CardValue["Seven"] = "7";
    CardValue["Eight"] = "8";
    CardValue["Nine"] = "9";
    CardValue["Ten"] = "10";
    CardValue["Jack"] = "J";
    CardValue["Queen"] = "Q";
    CardValue["King"] = "K";
    CardValue["Ace"] = "A";
})(CardValue || (CardValue = {}));
var CardNumericValue = {
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
var blackSuits = [Suit.Spades, Suit.Clubs];
var redSuits = [Suit.Diamonds, Suit.Hearts];
var logger = function (label, obj) {
    if (label === void 0) { label = ''; }
    console.log(label);
    console.dir(obj, { depth: null, colors: true });
};
var cardValueToKey = function (value) {
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
var Game = /** @class */ (function () {
    function Game() {
        this.gameRunning = true;
        this.deckPosition = 0;
        this.timerInMs = 0;
        this.lastTimestamp = 0;
        this.piles = [];
        this.deck = this.buildAndShuffleDeck();
        this.startGame();
    }
    Game.prototype.startGame = function () {
        console.log('Game started', this);
        this.initializePileZones(4);
        this.gameRunning = true;
        this.lastTimestamp = performance.now();
        this.gameLoop();
    };
    Game.prototype.gameLoop = function (timestamp) {
        var _this = this;
        if (timestamp === void 0) { timestamp = 0; }
        if (!this.gameRunning)
            return;
        var elapsed = timestamp - this.lastTimestamp;
        this.lastTimestamp = timestamp;
        // Increment the timer by the elapsed time
        this.timerInMs += elapsed;
        // Update game state
        this.updateGameState();
        // Render changes to the DOM
        this.render();
        // Request the next frame
        requestAnimationFrame(function (ts) { return _this.gameLoop(ts); });
    };
    Game.prototype.updateGameState = function () {
        // Update the game state logic
    };
    Game.prototype.render = function () {
        // Render the updated state to the DOM
        this.renderPileZones();
        this.renderPlayerDeck();
        this.renderTimer();
    };
    Game.prototype.pauseGame = function () {
        this.gameRunning = false;
    };
    /* LOGIC FUNCTIONS */
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
    Game.prototype.initializePileZones = function (count) {
        this.piles = this.deck.splice(0, count);
    };
    /* USER ACTION FUNCTIONS */
    Game.prototype.clickDeck = function () {
        //on click of the deck, increment the deck position
        this.deckPosition++;
    };
    /* RENDER FUNCTIONS */
    Game.prototype.buildCardHtml = function (card) {
        return "\n        <div class=\"card-wrapper\">\n            <div class=\"card-face ".concat(cardValueToKey(card.value), "-").concat(card.suit.toLowerCase(), "\"></div>\n        </div>\n        ");
    };
    Game.prototype.renderTimer = function () {
        var timerEl = document.querySelector('.timer-value');
        var minutes = Math.floor(this.timerInMs / 60000)
            .toString()
            .padStart(2, '0');
        var seconds = Math.floor((this.timerInMs % 60000) / 1000)
            .toString()
            .padStart(2, '0');
        var tenths = Math.floor((this.timerInMs % 1000) / 100)
            .toString()
            .padStart(1, '0');
        timerEl.innerHTML = "".concat(minutes, ":").concat(seconds, ".").concat(tenths);
    };
    Game.prototype.renderPileZones = function () {
        var _this = this;
        var pileZonesEl = document.querySelector('.pile-zones');
        pileZonesEl.innerHTML = '';
        this.piles.forEach(function (card, index) {
            var cardHtml = _this.buildCardHtml(card);
            pileZonesEl.innerHTML += cardHtml;
        });
    };
    Game.prototype.renderPlayerDeck = function () {
        var playerDeckEl = document.querySelector('.player-deck');
        // Render the current position of the deck
        var topCard = this.deck[this.deckPosition];
        var topCardHtml = this.buildCardHtml(topCard);
        playerDeckEl.innerHTML = topCardHtml;
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
