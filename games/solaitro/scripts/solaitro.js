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
        this.clickCoordinates = { x: 0, y: 0 };
        this.gameRunning = true;
        this.deckIndex = 0;
        this.timerInMs = 0;
        this.lastTimestamp = 0;
        this.buttons = [];
        this.renderedCards = [];
        this.isDealNewRound = true;
        this.piles = [];
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.cardFaceSpriteSheet = new Image();
        this.cardFaceSpriteSheet.src = 'img/deck-sprite-sheet.png';
        this.cardBackSpriteSheet = new Image();
        this.cardBackSpriteSheet.src = 'img/card-backs-seals.png';
        this.iconSpriteSheet = new Image();
        this.iconSpriteSheet.src = 'img/icons.png';
        // Wait for both images to load before starting the game
        Promise.all([
            this.loadImage(this.cardFaceSpriteSheet),
            this.loadImage(this.cardBackSpriteSheet),
            this.loadImage(this.iconSpriteSheet)
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
        var _this = this;
        console.log('Game started', this);
        // Add click event listener
        this.canvas.addEventListener('click', function (event) {
            var rect = _this.canvas.getBoundingClientRect();
            var x = event.clientX - rect.left;
            var y = event.clientY - rect.top;
            _this.clickCoordinates = { x: x, y: y };
        });
        // this.initializePileZones(4);
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
        this.clickCoordinates = null;
        // Request the next frame
        requestAnimationFrame(function (ts) { return _this.gameLoop(ts); });
    };
    Game.prototype.updateGameState = function () {
        // Update the game state logic
        var _this = this;
        this.buttons = [];
        this.renderedCards = [];
        this.createPlayerCard();
        this.createReloadButton();
        this.createDealButton();
        // this.createRenderedCards();
        var clickedButton;
        //loop through objects and check if click is within the boundaries
        this.buttons.forEach(function (button) {
            var _a, _b, _c, _d;
            if (((_a = _this.clickCoordinates) === null || _a === void 0 ? void 0 : _a.x) >= button.x &&
                ((_b = _this.clickCoordinates) === null || _b === void 0 ? void 0 : _b.x) <= button.x + button.width &&
                ((_c = _this.clickCoordinates) === null || _c === void 0 ? void 0 : _c.y) >= button.y &&
                ((_d = _this.clickCoordinates) === null || _d === void 0 ? void 0 : _d.y) <= button.y + button.height) {
                clickedButton = button;
            }
        });
        if (clickedButton) {
            switch (clickedButton.id) {
                case 'reload':
                    window.location.reload();
                    break;
                case 'deal':
                    this.isDealNewRound = true;
                    break;
            }
        }
        var clickedCard;
        this.renderedCards.forEach(function (card) {
            var _a, _b, _c, _d;
            if (((_a = _this.clickCoordinates) === null || _a === void 0 ? void 0 : _a.x) >= card.x &&
                ((_b = _this.clickCoordinates) === null || _b === void 0 ? void 0 : _b.x) <= card.x + card.width &&
                ((_c = _this.clickCoordinates) === null || _c === void 0 ? void 0 : _c.y) >= card.y &&
                ((_d = _this.clickCoordinates) === null || _d === void 0 ? void 0 : _d.y) <= card.y + card.height) {
                clickedCard = card;
            }
        });
        if (clickedCard) {
            this.lastCardClicked = clickedCard;
            switch (clickedCard.id) {
                case 'player':
                    console.log('Player card clicked', clickedCard);
                    this.deckIndex += 3;
                    if (this.deckIndex >= this.deck.length) {
                        this.deckIndex = this.deckIndex - this.deck.length;
                    }
                    break;
            }
        }
        if (this.isDealNewRound) {
            this.deck = this.buildAndShuffleDeck(true);
            this.isDealNewRound = false;
        }
    };
    Game.prototype.createPlayerCard = function () {
        var _a;
        if (!((_a = this.deck) === null || _a === void 0 ? void 0 : _a.length)) {
            return;
        }
        var card = this.deck[this.deckIndex];
        this.renderedCards.push(__assign(__assign({}, card), { id: 'player', x: 605, y: 500, width: 71, height: 95 }));
    };
    Game.prototype.createReloadButton = function () {
        var text = 'RELOAD';
        var padding = 20; // Padding for the button
        var textMetrics = this.ctx.measureText(text);
        var textWidth = textMetrics.width;
        var buttonWidth = textWidth + padding;
        var buttonHeight = 50;
        var x = 10;
        var y = 730;
        this.buttons.push({
            id: 'reload',
            text: text,
            padding: padding,
            fillColor: '#30874b',
            x: x,
            y: y,
            width: buttonWidth,
            height: buttonHeight
        });
    };
    Game.prototype.createDealButton = function () {
        var text = 'DEAL';
        var padding = 20; // Padding for the button
        var textMetrics = this.ctx.measureText(text);
        var textWidth = textMetrics.width;
        var buttonWidth = textWidth + padding;
        var buttonHeight = 50;
        var x = 10;
        var y = 670;
        this.buttons.push({
            id: 'deal',
            text: text,
            padding: padding,
            fillColor: '#30874b',
            x: x,
            y: y,
            width: buttonWidth,
            height: buttonHeight
        });
    };
    Game.prototype.render = function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear canvas
        this.renderAllCards();
        this.renderDeckIndex();
        this.renderTimer();
        this.renderLastCardClicked();
        this.renderButtons();
    };
    Game.prototype.renderButtons = function () {
        var _this = this;
        this.buttons.forEach(function (button) {
            _this.ctx.fillStyle = button.fillColor;
            _this.ctx.fillRect(button.x, button.y, button.width, button.height);
            _this.printText(button.text, button.x + button.padding / 2, button.y + button.padding * 1.75);
        });
    };
    Game.prototype.renderDeckIndex = function () {
        var _a;
        this.printText("".concat(this.deckIndex, " / ").concat((_a = this.deck) === null || _a === void 0 ? void 0 : _a.length), 610, 630);
    };
    Game.prototype.renderAllCards = function () {
        var _this = this;
        this.renderedCards.forEach(function (card) {
            _this.drawCard(card, card.x, card.y);
        });
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
        this.printText("Time: ".concat(minutes, ":").concat(seconds, ".").concat(tenths), 20, 60);
    };
    Game.prototype.renderLastCardClicked = function () {
        var card = this.lastCardClicked;
        if (card) {
            this.printText("Card: ".concat(card.value), 20, 100);
            this.drawIcon(card.suit, 100, 83);
        }
    };
    Game.prototype.printText = function (text, x, y) {
        this.ctx.font = '20px Balatro';
        this.ctx.fillStyle = 'white';
        // Set shadow properties
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'; // Shadow color
        this.ctx.shadowBlur = 4; // Blur level
        this.ctx.shadowOffsetX = 2; // Horizontal offset
        this.ctx.shadowOffsetY = 2; // Vertical offset
        this.ctx.fillText(text, x, y);
        // Reset shadow properties to avoid affecting other drawings
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
    };
    Game.prototype.pauseGame = function () {
        this.gameRunning = false;
    };
    /* LOGIC FUNCTIONS */
    Game.prototype.buildAndShuffleDeck = function (shuffle) {
        if (shuffle === void 0) { shuffle = false; }
        var deck = [];
        for (var _i = 0, _a = Object.values(Suit); _i < _a.length; _i++) {
            var suit = _a[_i];
            for (var _b = 0, _c = Object.values(CardValue); _b < _c.length; _b++) {
                var value = _c[_b];
                deck.push({ suit: suit, value: value });
            }
        }
        if (shuffle) {
            for (var i = 0; i < deck.length; i++) {
                var j = Math.floor(Math.random() * deck.length);
                var temp = deck[i];
                deck[i] = deck[j];
                deck[j] = temp;
            }
        }
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
    Game.prototype.drawIcon = function (suit, x, y) {
        var iconWidth = 72 / 4;
        var iconHeight = 74 / 4;
        var sy = iconHeight;
        var sx = 0;
        switch (suit) {
            case Suit.Hearts:
                sx = iconWidth * 0;
                break;
            case Suit.Diamonds:
                sx = iconWidth * 1;
                break;
            case Suit.Clubs:
                sx = iconWidth * 2;
                break;
            case Suit.Spades:
                sx = iconWidth * 3;
                break;
        }
        this.ctx.drawImage(this.iconSpriteSheet, sx, sy, iconWidth, iconHeight, x, y, iconWidth, iconHeight);
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
