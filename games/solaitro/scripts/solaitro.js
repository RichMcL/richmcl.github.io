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
var Themes = {
    default: {
        base: '#6c6685',
        background: '#423e54',
        black: '#3c4368'
    },
    orange: {
        base: '#a66202',
        background: '#442801',
        black: '#3c4368'
    },
    lightblue: {
        base: '#0278a6',
        background: '#01364b',
        black: '#3c4368'
    },
    blue: {
        base: '#625df5',
        background: '#232155',
        black: '#3c4368'
    },
    lightyellow: {
        base: '#ffc65c',
        background: '#644e26',
        black: '#3c4368'
    },
    green: {
        base: '#30874b',
        background: '#153b21',
        black: '#3c4368'
    },
    red: {
        base: '#b53434',
        background: '#581a1a',
        black: '#3c4368'
    }
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
        this.gameAspectRatio = 1280 / 800;
        this.theme = Themes.default;
        this.clickCoordinates = { x: 0, y: 0 };
        this.scaledClickCoordinates = { x: 0, y: 0 };
        this.mouseCoordinates = { x: 0, y: 0 };
        this.scaledMouseCoordinates = { x: 0, y: 0 };
        this.isMouseClicked = false;
        this.gameRunning = true;
        this.deckIndex = 0;
        this.timerInMs = 0;
        this.lastTimestamp = 0;
        this.buttons = [];
        this.themeButtons = [];
        this.isDealNewRound = true;
        this.pile1 = [];
        this.pile2 = [];
        this.pile3 = [];
        this.pile4 = [];
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
            _this.scaledClickCoordinates = { x: x / _this.scaleFactor, y: y / _this.scaleFactor };
            _this.isMouseClicked = true;
        });
        document.addEventListener('mousemove', function (event) {
            var rect = _this.canvas.getBoundingClientRect();
            _this.mouseCoordinates = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            };
            _this.scaledMouseCoordinates = {
                x: _this.mouseCoordinates.x / _this.scaleFactor,
                y: _this.mouseCoordinates.y / _this.scaleFactor
            };
        });
        this.gameRunning = true;
        this.lastTimestamp = performance.now();
        this.deck = this.buildAndShuffleDeck(true);
        this.initializePiles();
        this.isDealNewRound = false;
        this.initializeGameObjects();
        this.gameLoop();
    };
    Game.prototype.initializeGameObjects = function () {
        this.createReloadButton();
        this.createDealButton();
        this.createHitButton();
        this.createThemeButtons();
        this.createPlayerCard();
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
        this.resetGameState();
        // Request the next frame
        requestAnimationFrame(function (ts) { return _this.gameLoop(ts); });
    };
    Game.prototype.updateGameState = function () {
        var _this = this;
        // Update the game state logic
        var hoverButton;
        //loop through objects and check if click is within the boundaries
        this.buttons.forEach(function (button) {
            var _a, _b, _c, _d;
            if (((_a = _this.scaledMouseCoordinates) === null || _a === void 0 ? void 0 : _a.x) >= button.x &&
                ((_b = _this.scaledMouseCoordinates) === null || _b === void 0 ? void 0 : _b.x) <= button.x + button.width &&
                ((_c = _this.scaledMouseCoordinates) === null || _c === void 0 ? void 0 : _c.y) >= button.y &&
                ((_d = _this.scaledMouseCoordinates) === null || _d === void 0 ? void 0 : _d.y) <= button.y + button.height) {
                hoverButton = button;
                hoverButton.isHovered = true;
            }
        });
        if (hoverButton && this.isMouseClicked) {
            switch (hoverButton.id) {
                case 'reload':
                    window.location.reload();
                    break;
                case 'deal':
                    this.isDealNewRound = true;
                    break;
                case 'hit':
                    this.hitCard();
                    break;
            }
        }
        var hoverThemeButton;
        this.themeButtons.forEach(function (button) {
            var _a, _b, _c, _d;
            if (((_a = _this.scaledMouseCoordinates) === null || _a === void 0 ? void 0 : _a.x) >= button.x &&
                ((_b = _this.scaledMouseCoordinates) === null || _b === void 0 ? void 0 : _b.x) <= button.x + button.width &&
                ((_c = _this.scaledMouseCoordinates) === null || _c === void 0 ? void 0 : _c.y) >= button.y &&
                ((_d = _this.scaledMouseCoordinates) === null || _d === void 0 ? void 0 : _d.y) <= button.y + button.height) {
                hoverThemeButton = button;
                hoverThemeButton.isHovered = true;
            }
        });
        if (hoverThemeButton && this.isMouseClicked) {
            this.theme = hoverThemeButton.theme;
        }
        var hoverCard;
        [this.playerCard].forEach(function (card) {
            var _a, _b, _c, _d;
            if (((_a = _this.scaledMouseCoordinates) === null || _a === void 0 ? void 0 : _a.x) >= card.x &&
                ((_b = _this.scaledMouseCoordinates) === null || _b === void 0 ? void 0 : _b.x) <= card.x + card.width * card.scale &&
                ((_c = _this.scaledMouseCoordinates) === null || _c === void 0 ? void 0 : _c.y) >= card.y &&
                ((_d = _this.scaledMouseCoordinates) === null || _d === void 0 ? void 0 : _d.y) <= card.y + card.height * card.scale) {
                hoverCard = card;
            }
        });
        if (hoverCard && this.isMouseClicked) {
            this.lastCardClicked = hoverCard;
            switch (hoverCard.id) {
                case 'player':
                    console.log('Player card clicked', hoverCard);
                    break;
            }
        }
        var hoverPile, hoverPileCard;
        [this.pile1, this.pile2, this.pile3, this.pile4].forEach(function (pile) {
            var _a, _b, _c, _d;
            var card = pile[pile.length - 1];
            if (((_a = _this.scaledMouseCoordinates) === null || _a === void 0 ? void 0 : _a.x) >= card.x &&
                ((_b = _this.scaledMouseCoordinates) === null || _b === void 0 ? void 0 : _b.x) <= card.x + card.width * card.scale &&
                ((_c = _this.scaledMouseCoordinates) === null || _c === void 0 ? void 0 : _c.y) >= card.y &&
                ((_d = _this.scaledMouseCoordinates) === null || _d === void 0 ? void 0 : _d.y) <= card.y + card.height * card.scale) {
                hoverPile = pile;
                hoverPileCard = card;
            }
        });
        if (hoverPileCard && this.isMouseClicked) {
            console.log('Pile click pile', hoverPile);
            console.log('Pile click card', hoverPileCard);
            hoverPile.push(__assign(__assign({}, hoverPileCard), { suit: this.playerCard.suit, value: this.playerCard.value }));
            // Remove the card at deckIndex from deck
            this.deck.splice(this.deckIndex, 1);
            if (this.deckIndex === 0) {
                this.deckIndex = 2;
            }
            else {
                this.deckIndex--;
            }
            // Set the playerCard to the next card in the deck
            this.playerCard.suit = this.deck[this.deckIndex].suit;
            this.playerCard.value = this.deck[this.deckIndex].value;
        }
        if (this.isDealNewRound) {
            this.deck = this.buildAndShuffleDeck(true);
            this.initializePiles();
            this.isDealNewRound = false;
        }
    };
    Game.prototype.resetGameState = function () {
        this.clickCoordinates = null;
        this.scaledClickCoordinates = null;
        this.isMouseClicked = false;
        this.buttons.forEach(function (button) {
            button.isHovered = false;
        });
        this.themeButtons.forEach(function (button) {
            button.isHovered = false;
        });
    };
    Game.prototype.createPlayerCard = function () {
        var _a;
        if (!((_a = this.deck) === null || _a === void 0 ? void 0 : _a.length)) {
            return;
        }
        var card = this.deck[this.deckIndex];
        this.playerCard = __assign(__assign({}, card), { id: 'player', x: 585, y: 460, width: 71, height: 95, scale: 1.5 });
    };
    Game.prototype.createReloadButton = function () {
        var text = 'RELOAD';
        var padding = 20; // Padding for the button
        var textMetrics = this.ctx.measureText(text);
        var textWidth = textMetrics.width;
        var buttonWidth = textWidth + padding * 2 + 5;
        var buttonHeight = 50;
        var x = 10;
        var y = 730;
        this.buttons.push({
            id: 'reload',
            text: text,
            padding: padding,
            fillColor: this.theme.base,
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
        var buttonWidth = textWidth + padding * 2;
        var buttonHeight = 50;
        var x = 10;
        var y = 670;
        this.buttons.push({
            id: 'deal',
            text: text,
            padding: padding,
            fillColor: this.theme.base,
            x: x,
            y: y,
            width: buttonWidth,
            height: buttonHeight
        });
    };
    Game.prototype.createHitButton = function () {
        var text = 'HIT';
        var padding = 20; // Padding for the button
        var textMetrics = this.ctx.measureText(text);
        var textWidth = textMetrics.width;
        var buttonWidth = textWidth + padding * 2;
        var buttonHeight = 50;
        var x = 610;
        var y = 390;
        this.buttons.push({
            id: 'hit',
            text: text,
            padding: padding,
            fillColor: this.theme.base,
            x: x,
            y: y,
            width: buttonWidth,
            height: buttonHeight
        });
    };
    Game.prototype.createThemeButtons = function () {
        var i = 0;
        for (var _i = 0, _a = Object.keys(Themes); _i < _a.length; _i++) {
            var theme = _a[_i];
            var padding = 20; // Padding for the button
            var buttonWidth = 50;
            var buttonHeight = 50;
            var x = 400 + i * (buttonWidth + padding);
            var y = 700;
            this.themeButtons.push({
                id: 'theme',
                text: '',
                theme: Themes[theme],
                padding: padding,
                fillColor: Themes[theme].base,
                x: x,
                y: y,
                width: buttonWidth,
                height: buttonHeight
            });
            i++;
        }
    };
    Game.prototype.render = function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear canvas
        this.renderTheme();
        this.renderPlayerCard();
        this.renderPiles();
        this.renderDeckIndex();
        this.renderTimer();
        this.renderMousePosition();
        this.renderLastCardClicked();
        this.renderButtons();
        this.renderThemeButtons();
    };
    Game.prototype.renderTheme = function () {
        this.canvas.style.backgroundColor = this.theme.background;
    };
    Game.prototype.renderButtons = function () {
        var _this = this;
        this.buttons.forEach(function (button) {
            _this.ctx.fillStyle = _this.theme.base;
            _this.ctx.fillRect(button.x, button.y, button.width, button.height);
            _this.printText(button.text, button.x + button.padding / 2, button.y + button.padding * 1.75);
            // Draw a border around the button if it's hovered
            if (button.isHovered) {
                _this.ctx.strokeStyle = 'white';
                _this.ctx.lineWidth = 2;
                _this.ctx.strokeRect(button.x, button.y, button.width, button.height);
            }
        });
    };
    Game.prototype.renderThemeButtons = function () {
        var _this = this;
        this.themeButtons.forEach(function (button) {
            _this.ctx.fillStyle = button.fillColor;
            _this.ctx.fillRect(button.x, button.y, button.width, button.height);
            // Draw a border around the button if it's hovered
            if (button.isHovered) {
                _this.ctx.strokeStyle = 'white';
                _this.ctx.lineWidth = 2;
                _this.ctx.strokeRect(button.x, button.y, button.width, button.height);
            }
        });
    };
    Game.prototype.renderDeckIndex = function () {
        var _a, _b;
        var fixedWidth = 71 * 1.5; // Define the fixed width
        var text = "".concat(this.deckIndex, " / ").concat((_a = this.deck) === null || _a === void 0 ? void 0 : _a.length);
        var textWidth = this.ctx.measureText(text).width;
        var x = 585 + (fixedWidth - textWidth) / 2; // Calculate the x-coordinate to center the text
        this.printText("".concat(this.deckIndex + 1, "  / ").concat((_b = this.deck) === null || _b === void 0 ? void 0 : _b.length), x, 630);
    };
    Game.prototype.renderPlayerCard = function () {
        this.drawCard(this.playerCard, this.playerCard.x, this.playerCard.y, this.playerCard.scale);
    };
    Game.prototype.renderPiles = function () {
        var y = 200;
        var pile1 = this.pile1;
        var pile2 = this.pile2;
        var pile3 = this.pile3;
        var pile4 = this.pile4;
        var cardWidth = 71 * 1.5;
        var margin = 40;
        var startingX = 260;
        //TODO do these calculations when the card is added to the pile, not on each render
        var pile1Card = pile1[pile1.length - 1];
        pile1Card.width = 71;
        pile1Card.height = 95;
        pile1Card.x = startingX + cardWidth * 1 + 0 * margin;
        pile1Card.y = y;
        pile1Card.scale = 1.5;
        var pile2Card = pile2[pile2.length - 1];
        pile2Card.width = 71;
        pile2Card.height = 95;
        pile2Card.x = startingX + cardWidth * 2 + 1 * margin;
        pile2Card.y = y;
        pile2Card.scale = 1.5;
        var pile3Card = pile3[pile3.length - 1];
        pile3Card.width = 71;
        pile3Card.height = 95;
        pile3Card.x = startingX + cardWidth * 3 + 2 * margin;
        pile3Card.y = y;
        pile3Card.scale = 1.5;
        var pile4Card = pile4[pile4.length - 1];
        pile4Card.width = 71;
        pile4Card.height = 95;
        pile4Card.x = startingX + cardWidth * 4 + 3 * margin;
        pile4Card.y = y;
        pile4Card.scale = 1.5;
        this.drawCard(pile1Card, pile1Card.x, pile1Card.y, pile1Card.scale);
        this.drawCard(pile2Card, pile2Card.x, pile2Card.y, pile2Card.scale);
        this.drawCard(pile3Card, pile3Card.x, pile3Card.y, pile3Card.scale);
        this.drawCard(pile4Card, pile4Card.x, pile4Card.y, pile4Card.scale);
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
    Game.prototype.renderMousePosition = function () {
        var x = parseFloat(this.scaledMouseCoordinates.x.toFixed(0));
        var y = parseFloat(this.scaledMouseCoordinates.y.toFixed(0));
        this.printText("Cursor: X ".concat(x, " | Y ").concat(y), 170, 60);
    };
    Game.prototype.renderLastCardClicked = function () {
        var card = this.lastCardClicked;
        if (card) {
            this.printText("Card: ".concat(card.value), 20, 100);
            this.drawIcon(card.suit, 110, 83);
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
    Game.prototype.initializePiles = function () {
        this.pile1 = [];
        this.pile2 = [];
        this.pile3 = [];
        this.pile4 = [];
        // Pop the first 4 cards from the deck and add them to the piles
        this.pile1.push(this.deck.pop());
        this.pile2.push(this.deck.pop());
        this.pile3.push(this.deck.pop());
        this.pile4.push(this.deck.pop());
    };
    Game.prototype.hitCard = function () {
        this.deckIndex += 3;
        if (this.deckIndex >= this.deck.length) {
            this.deckIndex = this.deckIndex - this.deck.length;
        }
        this.playerCard.suit = this.deck[this.deckIndex].suit;
        this.playerCard.value = this.deck[this.deckIndex].value;
    };
    /* USER ACTION FUNCTIONS */
    /* RENDER FUNCTIONS */
    Game.prototype.drawCard = function (card, x, y, cardScale) {
        if (cardScale === void 0) { cardScale = 1; }
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
        this.ctx.drawImage(this.cardBackSpriteSheet, 71, 0, cardWidth, cardHeight, x, y, cardWidth * cardScale, cardHeight * cardScale);
        this.ctx.drawImage(this.cardFaceSpriteSheet, sx, sy, cardWidth, cardHeight, x, y, cardWidth * cardScale, cardHeight * cardScale);
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
        // this.ctx.fillRect(x - 2.5, y - 2.5, iconWidth + 5, iconHeight + 5);
        this.drawRoundedRect(this.ctx, x - 2.5, y - 2.5, iconWidth + 5, iconHeight + 5, 5);
        this.ctx.drawImage(this.iconSpriteSheet, sx, sy, iconWidth, iconHeight, x, y, iconWidth, iconHeight);
    };
    Game.prototype.drawRoundedRect = function (ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.arcTo(x + width, y, x + width, y + radius, radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
        ctx.lineTo(x + radius, y + height);
        ctx.arcTo(x, y + height, x, y + height - radius, radius);
        ctx.lineTo(x, y + radius);
        ctx.arcTo(x, y, x + radius, y, radius);
        ctx.closePath();
        ctx.fill();
    };
    // Sleep function using Promise and async/await
    Game.prototype.sleep = function (ms) {
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
    Game.prototype.scaleGame = function () {
        console.log('Scaling game');
        var currentWidth = window.innerWidth;
        var currentHeight = window.innerHeight;
        this.windowAspectRatio = currentWidth / currentHeight;
        // Determine the scale factor
        if (this.windowAspectRatio > this.gameAspectRatio) {
            // Window is wider than game aspect ratio
            this.scaleFactor = currentHeight / 800;
        }
        else {
            // Window is narrower than game aspect ratio
            this.scaleFactor = currentWidth / 1280;
        }
        // Apply the scale factor to the game container
        var gameContainer = document.getElementById('game-canvas');
        gameContainer.style.transform = "scale(".concat(this.scaleFactor, ")");
        gameContainer.style.transformOrigin = 'top left';
        gameContainer.style.width = "".concat(1280, "px");
        gameContainer.style.height = "".concat(800, "px");
    };
    return Game;
}());
(function () {
    document.addEventListener('DOMContentLoaded', function () {
        var game = new Game();
        window.game = game;
        // Initial scale
        game.scaleGame();
        // Scale the game on window resize
        window.addEventListener('resize', function () { return game.scaleGame(); });
    });
})();
