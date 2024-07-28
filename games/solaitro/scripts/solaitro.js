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
        var _this = this;
        this.gameRunning = true;
        this.deckPosition = 0;
        this.timerInMs = 0;
        this.lastTimestamp = 0;
        this.piles = [];
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.cardFaceSpriteSheet = new Image();
        this.cardFaceSpriteSheet.src = 'img/deck-sprite-sheet.png';
        this.cardBackSpriteSheet = new Image();
        this.cardBackSpriteSheet.src = 'img/card-backs-seals.png';
        // Wait for both images to load before starting the game
        Promise.all([
            this.loadImage(this.cardFaceSpriteSheet),
            this.loadImage(this.cardBackSpriteSheet)
        ]).then(function () {
            _this.startGame();
        });
    }
    Game.prototype.loadImage = function (image) {
        return new Promise(function (resolve) {
            image.onload = function () { return resolve(); };
        });
    };
    Game.prototype.startGame = function () {
        console.log('Game started', this);
        // this.initializePileZones(4);
        this.deck = this.buildAndShuffleDeck();
        console.log('Deck', this.deck);
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
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear canvas
        // columns -> 2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K, A
        // rows -> hearts, clubs, diamonds, spades,
        var cardIndex = 0;
        for (var col = 0; col < 4; col++) {
            for (var row = 0; row < 13; row++) {
                this.drawCard(this.deck[cardIndex], row * 71, col * 95);
                cardIndex++;
            }
        }
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
        //Shuffle deck
        // for (let i = 0; i < deck.length; i++) {
        //     const j = Math.floor(Math.random() * deck.length);
        //     const temp = deck[i];
        //     deck[i] = deck[j];
        //     deck[j] = temp;
        // }
        return deck;
    };
    Game.prototype.initializePileZones = function (count) {
        this.piles = this.deck.splice(0, count);
    };
    /* USER ACTION FUNCTIONS */
    /* RENDER FUNCTIONS */
    Game.prototype.drawCard = function (card, x, y) {
        var cardWidth = 71; // Width of a single card in the sprite sheet
        var cardHeight = 95; // Height of a single card in the sprite sheet
        var cardIndex = 0;
        var sy = 0;
        var sx = 0;
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
        this.ctx.drawImage(this.cardBackSpriteSheet, 71, 0, cardWidth, cardHeight, x, y, cardWidth, cardHeight);
        this.ctx.drawImage(this.cardFaceSpriteSheet, sx, sy, cardWidth, cardHeight, x, y, cardWidth, cardHeight);
    };
    Game.prototype.renderTimer = function () {
        var minutes = Math.floor(this.timerInMs / 60000)
            .toString()
            .padStart(2, '0');
        var seconds = Math.floor((this.timerInMs % 60000) / 1000)
            .toString()
            .padStart(2, '0');
        var tenths = Math.floor((this.timerInMs % 1000) / 100)
            .toString()
            .padStart(1, '0');
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
