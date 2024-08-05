/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _solaitro__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./solaitro */ \"./src/solaitro.ts\");\n\n(function () {\n    document.addEventListener('DOMContentLoaded', function () {\n        var game = new _solaitro__WEBPACK_IMPORTED_MODULE_0__.Game();\n        window.game = game;\n        // Initial scale\n        game.scaleGame();\n        // Scale the game on window resize\n        window.addEventListener('resize', function () { return game.scaleGame(); });\n    });\n})();\n\n\n//# sourceURL=webpack://euchre/./src/index.ts?");

/***/ }),

/***/ "./src/solaitro.ts":
/*!*************************!*\
  !*** ./src/solaitro.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Game: () => (/* binding */ Game)\n/* harmony export */ });\n/* harmony import */ var _theme__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./theme */ \"./src/theme.ts\");\n/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types */ \"./src/types.ts\");\n/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util */ \"./src/util.ts\");\nvar __assign = (undefined && undefined.__assign) || function () {\n    __assign = Object.assign || function(t) {\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\n            s = arguments[i];\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\n                t[p] = s[p];\n        }\n        return t;\n    };\n    return __assign.apply(this, arguments);\n};\n\n\n\nvar Game = /** @class */ (function () {\n    function Game() {\n        var _this = this;\n        this.gameAspectRatio = 1280 / 800;\n        this.theme = _theme__WEBPACK_IMPORTED_MODULE_0__.Themes.default;\n        this.player = new _types__WEBPACK_IMPORTED_MODULE_1__.Player();\n        this.pile1 = new _types__WEBPACK_IMPORTED_MODULE_1__.Pile('pile1');\n        this.pile2 = new _types__WEBPACK_IMPORTED_MODULE_1__.Pile('pile2');\n        this.pile3 = new _types__WEBPACK_IMPORTED_MODULE_1__.Pile('pile3');\n        this.pile4 = new _types__WEBPACK_IMPORTED_MODULE_1__.Pile('pile4');\n        this.clickCoordinates = { x: 0, y: 0 };\n        this.scaledClickCoordinates = { x: 0, y: 0 };\n        this.mouseCoordinates = { x: 0, y: 0 };\n        this.scaledMouseCoordinates = { x: 0, y: 0 };\n        this.isMouseClicked = false;\n        this.gameRunning = true;\n        this.timerInMs = 0;\n        this.lastTimestamp = 0;\n        this.buttons = [];\n        this.themeButtons = [];\n        this.isDealNewRound = true;\n        this.canvas = document.getElementById('game-canvas');\n        this.ctx = this.canvas.getContext('2d');\n        this.cardFaceSpriteSheet = new Image();\n        this.cardFaceSpriteSheet.src = 'img/deck-sprite-sheet.png';\n        this.cardBackSpriteSheet = new Image();\n        this.cardBackSpriteSheet.src = 'img/card-backs-seals.png';\n        this.iconSpriteSheet = new Image();\n        this.iconSpriteSheet.src = 'img/icons.png';\n        // Wait for both images to load before starting the game\n        Promise.all([\n            this.loadImage(this.cardFaceSpriteSheet),\n            this.loadImage(this.cardBackSpriteSheet),\n            this.loadImage(this.iconSpriteSheet)\n        ]).then(function () {\n            _this.startGame();\n        });\n    }\n    Game.prototype.loadImage = function (image) {\n        return new Promise(function (resolve) {\n            image.onload = function () { return resolve(); };\n        });\n    };\n    Game.prototype.startGame = function () {\n        var _this = this;\n        console.log('Game started', this);\n        // Add click event listener\n        this.canvas.addEventListener('click', function (event) {\n            var rect = _this.canvas.getBoundingClientRect();\n            var x = event.clientX - rect.left;\n            var y = event.clientY - rect.top;\n            _this.clickCoordinates = { x: x, y: y };\n            _this.scaledClickCoordinates = { x: x / _this.scaleFactor, y: y / _this.scaleFactor };\n            _this.isMouseClicked = true;\n        });\n        document.addEventListener('mousemove', function (event) {\n            var rect = _this.canvas.getBoundingClientRect();\n            _this.mouseCoordinates = {\n                x: event.clientX - rect.left,\n                y: event.clientY - rect.top\n            };\n            _this.scaledMouseCoordinates = {\n                x: _this.mouseCoordinates.x / _this.scaleFactor,\n                y: _this.mouseCoordinates.y / _this.scaleFactor\n            };\n        });\n        this.gameRunning = true;\n        this.lastTimestamp = performance.now();\n        this.initializePiles();\n        this.isDealNewRound = false;\n        this.initializeGameObjects();\n        this.gameLoop();\n    };\n    Game.prototype.initializeGameObjects = function () {\n        this.createReloadButton();\n        this.createDealButton();\n        this.createHitButton();\n        this.createThemeButtons();\n    };\n    Game.prototype.gameLoop = function (timestamp) {\n        var _this = this;\n        if (timestamp === void 0) { timestamp = 0; }\n        if (!this.gameRunning)\n            return;\n        var elapsed = timestamp - this.lastTimestamp;\n        this.lastTimestamp = timestamp;\n        // Increment the timer by the elapsed time\n        this.timerInMs += elapsed;\n        // Update game state\n        this.updateGameState();\n        // Render changes to the DOM\n        this.render();\n        this.resetGameState();\n        // Request the next frame\n        requestAnimationFrame(function (ts) { return _this.gameLoop(ts); });\n    };\n    Game.prototype.updateGameState = function () {\n        var _this = this;\n        var _a, _b, _c, _d;\n        // Update the game state logic\n        var hoverButton;\n        //loop through objects and check if click is within the boundaries\n        this.buttons.forEach(function (button) {\n            var _a, _b, _c, _d;\n            if (((_a = _this.scaledMouseCoordinates) === null || _a === void 0 ? void 0 : _a.x) >= button.x &&\n                ((_b = _this.scaledMouseCoordinates) === null || _b === void 0 ? void 0 : _b.x) <= button.x + button.width &&\n                ((_c = _this.scaledMouseCoordinates) === null || _c === void 0 ? void 0 : _c.y) >= button.y &&\n                ((_d = _this.scaledMouseCoordinates) === null || _d === void 0 ? void 0 : _d.y) <= button.y + button.height) {\n                hoverButton = button;\n                hoverButton.isHovered = true;\n            }\n        });\n        if (hoverButton && this.isMouseClicked) {\n            switch (hoverButton.id) {\n                case 'reload':\n                    window.location.reload();\n                    break;\n                case 'deal':\n                    this.isDealNewRound = true;\n                    break;\n                case 'hit':\n                    this.hitCard();\n                    break;\n            }\n        }\n        var hoverThemeButton;\n        this.themeButtons.forEach(function (button) {\n            var _a, _b, _c, _d;\n            if (((_a = _this.scaledMouseCoordinates) === null || _a === void 0 ? void 0 : _a.x) >= button.x &&\n                ((_b = _this.scaledMouseCoordinates) === null || _b === void 0 ? void 0 : _b.x) <= button.x + button.width &&\n                ((_c = _this.scaledMouseCoordinates) === null || _c === void 0 ? void 0 : _c.y) >= button.y &&\n                ((_d = _this.scaledMouseCoordinates) === null || _d === void 0 ? void 0 : _d.y) <= button.y + button.height) {\n                hoverThemeButton = button;\n                hoverThemeButton.isHovered = true;\n            }\n        });\n        if (hoverThemeButton && this.isMouseClicked) {\n            this.theme = hoverThemeButton.theme;\n        }\n        var hoverCard;\n        if (((_a = this.scaledMouseCoordinates) === null || _a === void 0 ? void 0 : _a.x) >= this.player.renderConfig.x &&\n            ((_b = this.scaledMouseCoordinates) === null || _b === void 0 ? void 0 : _b.x) <=\n                this.player.renderConfig.x +\n                    this.player.renderConfig.width * this.player.renderConfig.scale &&\n            ((_c = this.scaledMouseCoordinates) === null || _c === void 0 ? void 0 : _c.y) >= this.player.renderConfig.y &&\n            ((_d = this.scaledMouseCoordinates) === null || _d === void 0 ? void 0 : _d.y) <=\n                this.player.renderConfig.y +\n                    this.player.renderConfig.height * this.player.renderConfig.scale) {\n            hoverCard = this.player.getCurrentCard();\n        }\n        if (hoverCard && this.isMouseClicked) {\n            this.lastCardClicked = hoverCard;\n            console.log('Player card clicked', hoverCard);\n        }\n        var hoverPile;\n        var hoverPileCard;\n        [this.pile1, this.pile2, this.pile3, this.pile4].forEach(function (pile) {\n            var _a, _b, _c, _d;\n            var card = pile.getTopCard();\n            if (((_a = _this.scaledMouseCoordinates) === null || _a === void 0 ? void 0 : _a.x) >= pile.renderConfig.x &&\n                ((_b = _this.scaledMouseCoordinates) === null || _b === void 0 ? void 0 : _b.x) <=\n                    pile.renderConfig.x + pile.renderConfig.width * pile.renderConfig.scale &&\n                ((_c = _this.scaledMouseCoordinates) === null || _c === void 0 ? void 0 : _c.y) >= pile.renderConfig.y &&\n                ((_d = _this.scaledMouseCoordinates) === null || _d === void 0 ? void 0 : _d.y) <=\n                    pile.renderConfig.y + pile.renderConfig.height * pile.renderConfig.scale) {\n                hoverPile = pile;\n                hoverPileCard = card;\n            }\n        });\n        if (hoverPile) {\n            hoverPile.isHovered = true;\n        }\n        if (hoverPileCard && this.isMouseClicked) {\n            console.log('Pile click pile', hoverPile);\n            console.log('Pile click card', hoverPileCard);\n            hoverPile.pushCard(__assign(__assign({}, hoverPileCard), { suit: this.player.getCurrentCard().suit, value: this.player.getCurrentCard().value }));\n            this.player.removeTopCard();\n        }\n        if (this.isDealNewRound) {\n            this.player.hand = (0,_util__WEBPACK_IMPORTED_MODULE_2__.buildAndShuffleDeck)(true);\n            this.initializePiles();\n            this.isDealNewRound = false;\n        }\n    };\n    Game.prototype.resetGameState = function () {\n        this.clickCoordinates = null;\n        this.scaledClickCoordinates = null;\n        this.isMouseClicked = false;\n        [this.pile1, this.pile2, this.pile3, this.pile4].forEach(function (pile) {\n            pile.isHovered = false;\n        });\n        this.buttons.forEach(function (button) {\n            button.isHovered = false;\n        });\n        this.themeButtons.forEach(function (button) {\n            button.isHovered = false;\n        });\n    };\n    Game.prototype.createReloadButton = function () {\n        var text = 'RELOAD';\n        var padding = 20; // Padding for the button\n        var textMetrics = this.ctx.measureText(text);\n        var textWidth = textMetrics.width;\n        var buttonWidth = textWidth + padding * 2 + 5;\n        var buttonHeight = 50;\n        var x = 30;\n        var y = 730;\n        this.buttons.push({\n            id: 'reload',\n            text: text,\n            padding: padding,\n            fillColor: this.theme.base,\n            x: x,\n            y: y,\n            width: buttonWidth,\n            height: buttonHeight\n        });\n    };\n    Game.prototype.createDealButton = function () {\n        var text = 'DEAL';\n        var padding = 20; // Padding for the button\n        var textMetrics = this.ctx.measureText(text);\n        var textWidth = textMetrics.width;\n        var buttonWidth = textWidth + padding * 2;\n        var buttonHeight = 50;\n        var x = 30;\n        var y = 670;\n        this.buttons.push({\n            id: 'deal',\n            text: text,\n            padding: padding,\n            fillColor: this.theme.base,\n            x: x,\n            y: y,\n            width: buttonWidth,\n            height: buttonHeight\n        });\n    };\n    Game.prototype.createHitButton = function () {\n        var text = 'HIT';\n        var padding = 20; // Padding for the button\n        var textMetrics = this.ctx.measureText(text);\n        var textWidth = textMetrics.width;\n        var buttonWidth = textWidth + padding * 2;\n        var buttonHeight = 50;\n        var x = 610;\n        var y = 390;\n        this.buttons.push({\n            id: 'hit',\n            text: text,\n            padding: padding,\n            fillColor: this.theme.base,\n            x: x,\n            y: y,\n            width: buttonWidth,\n            height: buttonHeight\n        });\n    };\n    Game.prototype.createThemeButtons = function () {\n        var i = 0;\n        for (var _i = 0, _a = Object.keys(_theme__WEBPACK_IMPORTED_MODULE_0__.Themes); _i < _a.length; _i++) {\n            var theme = _a[_i];\n            var padding = 20; // Padding for the button\n            var buttonWidth = 50;\n            var buttonHeight = 50;\n            var x = 400 + i * (buttonWidth + padding);\n            var y = 700;\n            this.themeButtons.push({\n                id: 'theme',\n                text: '',\n                theme: _theme__WEBPACK_IMPORTED_MODULE_0__.Themes[theme],\n                padding: padding,\n                fillColor: _theme__WEBPACK_IMPORTED_MODULE_0__.Themes[theme].base,\n                x: x,\n                y: y,\n                width: buttonWidth,\n                height: buttonHeight\n            });\n            i++;\n        }\n    };\n    Game.prototype.render = function () {\n        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear canvas\n        this.renderTheme();\n        this.renderSidebar();\n        this.renderPlayerCard();\n        this.renderPiles();\n        this.renderDeckIndex();\n        this.renderTimer();\n        this.renderMousePosition();\n        this.renderLastCardClicked();\n        this.renderButtons();\n        this.renderThemeButtons();\n    };\n    Game.prototype.renderTheme = function () {\n        this.canvas.style.backgroundColor = this.theme.background;\n    };\n    Game.prototype.renderSidebar = function () {\n        this.ctx.fillStyle = '#293a3a';\n        this.ctx.fillRect(20, 0, 250, 800);\n        // Left border\n        this.ctx.fillStyle = this.theme.base;\n        this.ctx.fillRect(17, 0, 3, 800);\n        // Right border\n        this.ctx.fillStyle = this.theme.base;\n        this.ctx.fillRect(270, 0, 3, 800);\n    };\n    Game.prototype.renderButtons = function () {\n        var _this = this;\n        this.buttons.forEach(function (button) {\n            _this.ctx.fillStyle = _this.theme.base;\n            _this.ctx.fillRect(button.x, button.y, button.width, button.height);\n            _this.printText(button.text, button.x + button.padding / 2, button.y + button.padding * 1.75);\n            // Draw a border around the button if it's hovered\n            if (button.isHovered) {\n                _this.ctx.strokeStyle = 'white';\n                _this.ctx.lineWidth = 2;\n                _this.ctx.strokeRect(button.x, button.y, button.width, button.height);\n            }\n        });\n    };\n    Game.prototype.renderThemeButtons = function () {\n        var _this = this;\n        this.themeButtons.forEach(function (button) {\n            _this.ctx.fillStyle = button.fillColor;\n            _this.ctx.fillRect(button.x, button.y, button.width, button.height);\n            // Draw a border around the button if it's hovered\n            if (button.isHovered) {\n                _this.ctx.strokeStyle = 'white';\n                _this.ctx.lineWidth = 2;\n                _this.ctx.strokeRect(button.x, button.y, button.width, button.height);\n            }\n        });\n    };\n    Game.prototype.renderDeckIndex = function () {\n        var _a, _b;\n        var fixedWidth = 71 * 1.5; // Define the fixed width\n        var text = \"\".concat(this.player.handIndex, \" / \").concat((_a = this.player.hand) === null || _a === void 0 ? void 0 : _a.length);\n        var textWidth = this.ctx.measureText(text).width;\n        var x = 585 + (fixedWidth - textWidth) / 2; // Calculate the x-coordinate to center the text\n        this.printText(\"\".concat(this.player.handIndex + 1, \"  / \").concat((_b = this.player.hand) === null || _b === void 0 ? void 0 : _b.length), x, 630);\n    };\n    Game.prototype.renderPlayerCard = function () {\n        var renderConfig = this.player.renderConfig;\n        this.drawCard(this.player.getCurrentCard(), renderConfig.x, renderConfig.y, renderConfig.scale);\n    };\n    Game.prototype.renderPiles = function () {\n        var _this = this;\n        var pile1Card = this.pile1.getTopCard();\n        var pile2Card = this.pile2.getTopCard();\n        var pile3Card = this.pile3.getTopCard();\n        var pile4Card = this.pile4.getTopCard();\n        this.drawCard(pile1Card, this.pile1.renderConfig.x, this.pile1.renderConfig.y, this.pile1.renderConfig.scale);\n        this.drawCard(pile2Card, this.pile2.renderConfig.x, this.pile2.renderConfig.y, this.pile2.renderConfig.scale);\n        this.drawCard(pile3Card, this.pile3.renderConfig.x, this.pile3.renderConfig.y, this.pile3.renderConfig.scale);\n        this.drawCard(pile4Card, this.pile4.renderConfig.x, this.pile4.renderConfig.y, this.pile4.renderConfig.scale);\n        // Draw a border around the pile if it's hovered\n        [this.pile1, this.pile2, this.pile3, this.pile4].forEach(function (pile) {\n            if (pile.isHovered) {\n                _this.ctx.strokeStyle = 'white';\n                _this.ctx.lineWidth = 2;\n                _this.ctx.strokeRect(pile.renderConfig.x, pile.renderConfig.y, pile.renderConfig.width * pile.renderConfig.scale, pile.renderConfig.height * pile.renderConfig.scale);\n            }\n        });\n    };\n    Game.prototype.renderTimer = function () {\n        var minutes = Math.floor(this.timerInMs / 60000)\n            .toString()\n            .padStart(2, '0');\n        var seconds = Math.floor((this.timerInMs % 60000) / 1000)\n            .toString()\n            .padStart(2, '0');\n        var tenths = Math.floor((this.timerInMs % 1000) / 100)\n            .toString()\n            .padStart(1, '0');\n        this.printText(\"Time: \".concat(minutes, \":\").concat(seconds, \".\").concat(tenths), 30, 40);\n    };\n    Game.prototype.renderMousePosition = function () {\n        var x = parseFloat(this.scaledMouseCoordinates.x.toFixed(0));\n        var y = parseFloat(this.scaledMouseCoordinates.y.toFixed(0));\n        this.printText(\"Cursor: X \".concat(x, \" | Y \").concat(y), 30, 80);\n    };\n    Game.prototype.renderLastCardClicked = function () {\n        var card = this.lastCardClicked;\n        if (card) {\n            this.printText(\"Card: \".concat(card.value), 30, 120);\n            this.drawIcon(card.suit, 120, 103);\n        }\n    };\n    Game.prototype.printText = function (text, x, y) {\n        this.ctx.font = '20px Balatro';\n        this.ctx.fillStyle = 'white';\n        // Set shadow properties\n        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'; // Shadow color\n        this.ctx.shadowBlur = 4; // Blur level\n        this.ctx.shadowOffsetX = 2; // Horizontal offset\n        this.ctx.shadowOffsetY = 2; // Vertical offset\n        this.ctx.fillText(text, x, y);\n        // Reset shadow properties to avoid affecting other drawings\n        this.ctx.shadowColor = 'transparent';\n        this.ctx.shadowBlur = 0;\n        this.ctx.shadowOffsetX = 0;\n        this.ctx.shadowOffsetY = 0;\n    };\n    Game.prototype.pauseGame = function () {\n        this.gameRunning = false;\n    };\n    /* LOGIC FUNCTIONS */\n    Game.prototype.initializePiles = function () {\n        // Pop the first 4 cards from the deck and add them to the piles\n        this.pile1.pushCard(this.player.hand.pop());\n        this.pile2.pushCard(this.player.hand.pop());\n        this.pile3.pushCard(this.player.hand.pop());\n        this.pile4.pushCard(this.player.hand.pop());\n    };\n    Game.prototype.hitCard = function () {\n        this.player.hit();\n    };\n    /* USER ACTION FUNCTIONS */\n    /* RENDER FUNCTIONS */\n    Game.prototype.drawCard = function (card, x, y, cardScale) {\n        if (cardScale === void 0) { cardScale = 1; }\n        var cardWidth = 71; // Width of a single card in the sprite sheet\n        var cardHeight = 95; // Height of a single card in the sprite sheet\n        var sy = 0;\n        var sx = 0;\n        switch (card.suit) {\n            case _types__WEBPACK_IMPORTED_MODULE_1__.Suit.Hearts:\n                sy = cardHeight * 0;\n                break;\n            case _types__WEBPACK_IMPORTED_MODULE_1__.Suit.Clubs:\n                sy = cardHeight * 1;\n                break;\n            case _types__WEBPACK_IMPORTED_MODULE_1__.Suit.Diamonds:\n                sy = cardHeight * 2;\n                break;\n            case _types__WEBPACK_IMPORTED_MODULE_1__.Suit.Spades:\n                sy = cardHeight * 3;\n                break;\n        }\n        switch (card.value) {\n            case _types__WEBPACK_IMPORTED_MODULE_1__.CardValue.Two:\n                sx = cardWidth * 0;\n                break;\n            case _types__WEBPACK_IMPORTED_MODULE_1__.CardValue.Three:\n                sx = cardWidth * 1;\n                break;\n            case _types__WEBPACK_IMPORTED_MODULE_1__.CardValue.Four:\n                sx = cardWidth * 2;\n                break;\n            case _types__WEBPACK_IMPORTED_MODULE_1__.CardValue.Five:\n                sx = cardWidth * 3;\n                break;\n            case _types__WEBPACK_IMPORTED_MODULE_1__.CardValue.Six:\n                sx = cardWidth * 4;\n                break;\n            case _types__WEBPACK_IMPORTED_MODULE_1__.CardValue.Seven:\n                sx = cardWidth * 5;\n                break;\n            case _types__WEBPACK_IMPORTED_MODULE_1__.CardValue.Eight:\n                sx = cardWidth * 6;\n                break;\n            case _types__WEBPACK_IMPORTED_MODULE_1__.CardValue.Nine:\n                sx = cardWidth * 7;\n                break;\n            case _types__WEBPACK_IMPORTED_MODULE_1__.CardValue.Ten:\n                sx = cardWidth * 8;\n                break;\n            case _types__WEBPACK_IMPORTED_MODULE_1__.CardValue.Jack:\n                sx = cardWidth * 9;\n                break;\n            case _types__WEBPACK_IMPORTED_MODULE_1__.CardValue.Queen:\n                sx = cardWidth * 10;\n                break;\n            case _types__WEBPACK_IMPORTED_MODULE_1__.CardValue.King:\n                sx = cardWidth * 11;\n                break;\n            case _types__WEBPACK_IMPORTED_MODULE_1__.CardValue.Ace:\n                sx = cardWidth * 12;\n                break;\n        }\n        this.ctx.drawImage(this.cardBackSpriteSheet, 71, 0, cardWidth, cardHeight, x, y, cardWidth * cardScale, cardHeight * cardScale);\n        this.ctx.drawImage(this.cardFaceSpriteSheet, sx, sy, cardWidth, cardHeight, x, y, cardWidth * cardScale, cardHeight * cardScale);\n    };\n    Game.prototype.drawIcon = function (suit, x, y) {\n        var iconWidth = 72 / 4;\n        var iconHeight = 74 / 4;\n        var sy = iconHeight;\n        var sx = 0;\n        switch (suit) {\n            case _types__WEBPACK_IMPORTED_MODULE_1__.Suit.Hearts:\n                sx = iconWidth * 0;\n                break;\n            case _types__WEBPACK_IMPORTED_MODULE_1__.Suit.Diamonds:\n                sx = iconWidth * 1;\n                break;\n            case _types__WEBPACK_IMPORTED_MODULE_1__.Suit.Clubs:\n                sx = iconWidth * 2;\n                break;\n            case _types__WEBPACK_IMPORTED_MODULE_1__.Suit.Spades:\n                sx = iconWidth * 3;\n                break;\n        }\n        // this.ctx.fillRect(x - 2.5, y - 2.5, iconWidth + 5, iconHeight + 5);\n        this.drawRoundedRect(this.ctx, x - 2.5, y - 2.5, iconWidth + 5, iconHeight + 5, 5);\n        this.ctx.drawImage(this.iconSpriteSheet, sx, sy, iconWidth, iconHeight, x, y, iconWidth, iconHeight);\n    };\n    Game.prototype.drawRoundedRect = function (ctx, x, y, width, height, radius) {\n        ctx.beginPath();\n        ctx.moveTo(x + radius, y);\n        ctx.lineTo(x + width - radius, y);\n        ctx.arcTo(x + width, y, x + width, y + radius, radius);\n        ctx.lineTo(x + width, y + height - radius);\n        ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);\n        ctx.lineTo(x + radius, y + height);\n        ctx.arcTo(x, y + height, x, y + height - radius, radius);\n        ctx.lineTo(x, y + radius);\n        ctx.arcTo(x, y, x + radius, y, radius);\n        ctx.closePath();\n        ctx.fill();\n    };\n    Game.prototype.scaleGame = function () {\n        console.log('Scaling game');\n        var currentWidth = window.innerWidth;\n        var currentHeight = window.innerHeight;\n        this.windowAspectRatio = currentWidth / currentHeight;\n        // Determine the scale factor\n        if (this.windowAspectRatio > this.gameAspectRatio) {\n            // Window is wider than game aspect ratio\n            this.scaleFactor = currentHeight / 800;\n        }\n        else {\n            // Window is narrower than game aspect ratio\n            this.scaleFactor = currentWidth / 1280;\n        }\n        // Apply the scale factor to the game container\n        var gameContainer = document.getElementById('game-canvas');\n        gameContainer.style.transform = \"scale(\".concat(this.scaleFactor, \")\");\n        gameContainer.style.transformOrigin = 'top left';\n        gameContainer.style.width = \"\".concat(1280, \"px\");\n        gameContainer.style.height = \"\".concat(800, \"px\");\n    };\n    return Game;\n}());\n\n\n\n//# sourceURL=webpack://euchre/./src/solaitro.ts?");

/***/ }),

/***/ "./src/theme.ts":
/*!**********************!*\
  !*** ./src/theme.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Themes: () => (/* binding */ Themes)\n/* harmony export */ });\nvar Themes = {\n    default: {\n        base: '#6c6685',\n        background: '#423e54',\n        black: '#3c4368'\n    },\n    orange: {\n        base: '#a66202',\n        background: '#442801',\n        black: '#3c4368'\n    },\n    lightblue: {\n        base: '#0278a6',\n        background: '#01364b',\n        black: '#3c4368'\n    },\n    blue: {\n        base: '#625df5',\n        background: '#232155',\n        black: '#3c4368'\n    },\n    lightyellow: {\n        base: '#ffc65c',\n        background: '#644e26',\n        black: '#3c4368'\n    },\n    green: {\n        base: '#30874b',\n        background: '#153b21',\n        black: '#3c4368'\n    },\n    red: {\n        base: '#b53434',\n        background: '#581a1a',\n        black: '#3c4368'\n    }\n};\n\n\n//# sourceURL=webpack://euchre/./src/theme.ts?");

/***/ }),

/***/ "./src/types.ts":
/*!**********************!*\
  !*** ./src/types.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   CardNumericValue: () => (/* binding */ CardNumericValue),\n/* harmony export */   CardValue: () => (/* binding */ CardValue),\n/* harmony export */   Pile: () => (/* binding */ Pile),\n/* harmony export */   PilesRenderConfig: () => (/* binding */ PilesRenderConfig),\n/* harmony export */   Player: () => (/* binding */ Player),\n/* harmony export */   Suit: () => (/* binding */ Suit),\n/* harmony export */   SuitIcon: () => (/* binding */ SuitIcon),\n/* harmony export */   blackSuits: () => (/* binding */ blackSuits),\n/* harmony export */   redSuits: () => (/* binding */ redSuits)\n/* harmony export */ });\n/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ \"./src/util.ts\");\n\nvar Suit;\n(function (Suit) {\n    Suit[\"Spades\"] = \"Spades\";\n    Suit[\"Clubs\"] = \"Clubs\";\n    Suit[\"Diamonds\"] = \"Diamonds\";\n    Suit[\"Hearts\"] = \"Hearts\";\n})(Suit || (Suit = {}));\nvar SuitIcon;\n(function (SuitIcon) {\n    SuitIcon[\"Spades\"] = \"\\u2660\";\n    SuitIcon[\"Clubs\"] = \"\\u2663\";\n    SuitIcon[\"Diamonds\"] = \"\\u2666\";\n    SuitIcon[\"Hearts\"] = \"\\u2665\";\n})(SuitIcon || (SuitIcon = {}));\nvar CardValue;\n(function (CardValue) {\n    CardValue[\"Two\"] = \"2\";\n    CardValue[\"Three\"] = \"3\";\n    CardValue[\"Four\"] = \"4\";\n    CardValue[\"Five\"] = \"5\";\n    CardValue[\"Six\"] = \"6\";\n    CardValue[\"Seven\"] = \"7\";\n    CardValue[\"Eight\"] = \"8\";\n    CardValue[\"Nine\"] = \"9\";\n    CardValue[\"Ten\"] = \"10\";\n    CardValue[\"Jack\"] = \"J\";\n    CardValue[\"Queen\"] = \"Q\";\n    CardValue[\"King\"] = \"K\";\n    CardValue[\"Ace\"] = \"A\";\n})(CardValue || (CardValue = {}));\nvar CardNumericValue = {\n    '2': 2,\n    '3': 3,\n    '4': 4,\n    '5': 5,\n    '6': 6,\n    '7': 7,\n    '8': 8,\n    '9': 9,\n    '10': 10,\n    J: 11,\n    Q: 12,\n    K: 13,\n    A: 14\n};\nvar blackSuits = [Suit.Spades, Suit.Clubs];\nvar redSuits = [Suit.Diamonds, Suit.Hearts];\nvar Player = /** @class */ (function () {\n    function Player() {\n        this.renderConfig = {\n            x: 585,\n            y: 460,\n            width: 71,\n            height: 95,\n            scale: 1.5\n        };\n        this.hand = (0,_util__WEBPACK_IMPORTED_MODULE_0__.buildAndShuffleDeck)();\n        this.handIndex = 0;\n    }\n    Player.prototype.getCurrentCard = function () {\n        return this.hand[this.handIndex];\n    };\n    Player.prototype.hit = function () {\n        this.handIndex += 3;\n        if (this.handIndex >= this.hand.length) {\n            this.handIndex = this.handIndex - this.hand.length;\n        }\n    };\n    Player.prototype.removeTopCard = function () {\n        this.hand.splice(this.handIndex, 1);\n        if (this.handIndex === 0) {\n            this.handIndex = 2;\n        }\n        else {\n            this.handIndex--;\n        }\n    };\n    return Player;\n}());\n\nvar PilesRenderConfig = {\n    pile1: {\n        x: 366.5,\n        y: 200,\n        width: 71,\n        height: 95,\n        scale: 1.5\n    },\n    pile2: {\n        x: 513,\n        y: 200,\n        width: 71,\n        height: 95,\n        scale: 1.5\n    },\n    pile3: {\n        x: 659.5,\n        y: 200,\n        width: 71,\n        height: 95,\n        scale: 1.5\n    },\n    pile4: {\n        x: 806,\n        y: 200,\n        width: 71,\n        height: 95,\n        scale: 1.5\n    }\n};\nvar Pile = /** @class */ (function () {\n    function Pile(pileName) {\n        this.cards = [];\n        this.renderConfig = PilesRenderConfig[pileName];\n    }\n    Pile.prototype.getTopCard = function () {\n        return this.cards[this.cards.length - 1];\n    };\n    Pile.prototype.pushCard = function (card) {\n        this.cards.push(card);\n    };\n    Pile.prototype.popCard = function () {\n        return this.cards.pop();\n    };\n    return Pile;\n}());\n\n\n\n//# sourceURL=webpack://euchre/./src/types.ts?");

/***/ }),

/***/ "./src/util.ts":
/*!*********************!*\
  !*** ./src/util.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   buildAndShuffleDeck: () => (/* binding */ buildAndShuffleDeck),\n/* harmony export */   cardValueToKey: () => (/* binding */ cardValueToKey)\n/* harmony export */ });\n/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types */ \"./src/types.ts\");\n\nvar cardValueToKey = function (value) {\n    switch (value) {\n        case _types__WEBPACK_IMPORTED_MODULE_0__.CardValue.Two:\n            return 'two';\n        case _types__WEBPACK_IMPORTED_MODULE_0__.CardValue.Three:\n            return 'three';\n        case _types__WEBPACK_IMPORTED_MODULE_0__.CardValue.Four:\n            return 'four';\n        case _types__WEBPACK_IMPORTED_MODULE_0__.CardValue.Five:\n            return 'five';\n        case _types__WEBPACK_IMPORTED_MODULE_0__.CardValue.Six:\n            return 'six';\n        case _types__WEBPACK_IMPORTED_MODULE_0__.CardValue.Seven:\n            return 'seven';\n        case _types__WEBPACK_IMPORTED_MODULE_0__.CardValue.Eight:\n            return 'eight';\n        case _types__WEBPACK_IMPORTED_MODULE_0__.CardValue.Nine:\n            return 'nine';\n        case _types__WEBPACK_IMPORTED_MODULE_0__.CardValue.Ten:\n            return 'ten';\n        case _types__WEBPACK_IMPORTED_MODULE_0__.CardValue.Jack:\n            return 'jack';\n        case _types__WEBPACK_IMPORTED_MODULE_0__.CardValue.Queen:\n            return 'queen';\n        case _types__WEBPACK_IMPORTED_MODULE_0__.CardValue.King:\n            return 'king';\n        case _types__WEBPACK_IMPORTED_MODULE_0__.CardValue.Ace:\n            return 'ace';\n    }\n    return '';\n};\nvar buildAndShuffleDeck = function (shuffle) {\n    if (shuffle === void 0) { shuffle = false; }\n    var deck = [];\n    for (var _i = 0, _a = Object.values(_types__WEBPACK_IMPORTED_MODULE_0__.Suit); _i < _a.length; _i++) {\n        var suit = _a[_i];\n        for (var _b = 0, _c = Object.values(_types__WEBPACK_IMPORTED_MODULE_0__.CardValue); _b < _c.length; _b++) {\n            var value = _c[_b];\n            deck.push({ suit: suit, value: value });\n        }\n    }\n    if (shuffle) {\n        for (var i = 0; i < deck.length; i++) {\n            var j = Math.floor(Math.random() * deck.length);\n            var temp = deck[i];\n            deck[i] = deck[j];\n            deck[j] = temp;\n        }\n    }\n    return deck;\n};\n\n\n//# sourceURL=webpack://euchre/./src/util.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;