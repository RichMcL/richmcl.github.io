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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _rogue_runner__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rogue-runner */ \"./src/rogue-runner.ts\");\n\n(function () {\n    document.addEventListener('DOMContentLoaded', function () {\n        var game = new _rogue_runner__WEBPACK_IMPORTED_MODULE_0__.Game();\n        window.game = game;\n        // Initial scale\n        game.scaleGame();\n        // Scale the game on window resize\n        window.addEventListener('resize', function () { return game.scaleGame(); });\n    });\n})();\n\n\n//# sourceURL=webpack://rogue-runner/./src/index.ts?");

/***/ }),

/***/ "./src/player.ts":
/*!***********************!*\
  !*** ./src/player.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Player: () => (/* binding */ Player)\n/* harmony export */ });\n/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types */ \"./src/types.ts\");\nvar __extends = (undefined && undefined.__extends) || (function () {\n    var extendStatics = function (d, b) {\n        extendStatics = Object.setPrototypeOf ||\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\n            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };\n        return extendStatics(d, b);\n    };\n    return function (d, b) {\n        if (typeof b !== \"function\" && b !== null)\n            throw new TypeError(\"Class extends value \" + String(b) + \" is not a constructor or null\");\n        extendStatics(d, b);\n        function __() { this.constructor = d; }\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n    };\n})();\n\nvar Player = /** @class */ (function (_super) {\n    __extends(Player, _super);\n    function Player() {\n        return _super.call(this, { x: null, y: null }) || this;\n    }\n    Player.prototype.update = function () { };\n    Player.prototype.render = function () { };\n    return Player;\n}(_types__WEBPACK_IMPORTED_MODULE_0__.GameComponent));\n\n\n\n//# sourceURL=webpack://rogue-runner/./src/player.ts?");

/***/ }),

/***/ "./src/rogue-runner.ts":
/*!*****************************!*\
  !*** ./src/rogue-runner.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Game: () => (/* binding */ Game)\n/* harmony export */ });\n/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./player */ \"./src/player.ts\");\n/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./state */ \"./src/state.ts\");\n\n\nvar Game = /** @class */ (function () {\n    function Game() {\n        var _this = this;\n        this.lastTimestamp = 0;\n        _state__WEBPACK_IMPORTED_MODULE_1__.State.setCanvas(document.getElementById('game-canvas'));\n        _state__WEBPACK_IMPORTED_MODULE_1__.State.setCtx(_state__WEBPACK_IMPORTED_MODULE_1__.State.getCanvas().getContext('2d'));\n        // Wait for both images to load before starting the game\n        Promise.all([this.loadFont('New-Amsterdam', 'fonts/new-amsterdam/new-amsterdam.ttf')]).then(function () {\n            _this.startGame();\n        });\n    }\n    // Function to load the custom font\n    Game.prototype.loadFont = function (fontName, fontUrl) {\n        return new Promise(function (resolve, reject) {\n            var font = new FontFace(fontName, \"url(\".concat(fontUrl, \")\"));\n            font.load()\n                .then(function (loadedFont) {\n                // Add the font to the document\n                document.fonts.add(loadedFont);\n                resolve();\n            })\n                .catch(function (error) {\n                reject(error);\n            });\n        });\n    };\n    Game.prototype.startGame = function () {\n        console.log('Game started', this);\n        // Add click event listener\n        _state__WEBPACK_IMPORTED_MODULE_1__.State.getCanvas().addEventListener('click', function (event) {\n            var rect = _state__WEBPACK_IMPORTED_MODULE_1__.State.getCanvas().getBoundingClientRect();\n            var x = event.clientX - rect.left;\n            var y = event.clientY - rect.top;\n            _state__WEBPACK_IMPORTED_MODULE_1__.State.setClickCoordinates({ x: x, y: y });\n            _state__WEBPACK_IMPORTED_MODULE_1__.State.setMouseClick(true);\n        });\n        document.body.classList.add('hide-cursor');\n        document.addEventListener('mousemove', function (event) {\n            var rect = _state__WEBPACK_IMPORTED_MODULE_1__.State.getCanvas().getBoundingClientRect();\n            _state__WEBPACK_IMPORTED_MODULE_1__.State.setMouseCoordinates({\n                x: event.clientX - rect.left,\n                y: event.clientY - rect.top\n            });\n        });\n        _state__WEBPACK_IMPORTED_MODULE_1__.State.setGameRunning(true);\n        this.lastTimestamp = performance.now();\n        this.initializeGameObjects();\n        this.gameLoop();\n    };\n    Game.prototype.initializeGameObjects = function () {\n        _state__WEBPACK_IMPORTED_MODULE_1__.State.setPlayer(new _player__WEBPACK_IMPORTED_MODULE_0__.Player());\n    };\n    Game.prototype.gameLoop = function (timestamp) {\n        var _this = this;\n        if (timestamp === void 0) { timestamp = 0; }\n        if (!_state__WEBPACK_IMPORTED_MODULE_1__.State.isGameRunning())\n            return;\n        var elapsed = timestamp - this.lastTimestamp;\n        this.lastTimestamp = timestamp;\n        _state__WEBPACK_IMPORTED_MODULE_1__.State.incrementTimerInMs(elapsed);\n        // Update game state\n        this.updateGameState();\n        // Render changes to the DOM\n        this.render();\n        this.resetGameState();\n        // Request the next frame\n        requestAnimationFrame(function (ts) { return _this.gameLoop(ts); });\n    };\n    Game.prototype.updateGameState = function () {\n        _state__WEBPACK_IMPORTED_MODULE_1__.State.getPlayer().update();\n    };\n    Game.prototype.resetGameState = function () {\n        _state__WEBPACK_IMPORTED_MODULE_1__.State.setClickCoordinates(null);\n        _state__WEBPACK_IMPORTED_MODULE_1__.State.setMouseClick(false);\n        _state__WEBPACK_IMPORTED_MODULE_1__.State.setGamepadButtonClick(false);\n    };\n    Game.prototype.render = function () {\n        _state__WEBPACK_IMPORTED_MODULE_1__.State.getCtx().clearRect(0, 0, _state__WEBPACK_IMPORTED_MODULE_1__.State.getCanvas().width, _state__WEBPACK_IMPORTED_MODULE_1__.State.getCanvas().height); // Clear canvas\n        _state__WEBPACK_IMPORTED_MODULE_1__.State.getPlayer().render();\n        for (var _i = 0, _a = _state__WEBPACK_IMPORTED_MODULE_1__.State.getGameComponents(); _i < _a.length; _i++) {\n            var component = _a[_i];\n            component.render();\n        }\n        this.renderGamepadCursor();\n    };\n    Game.prototype.renderGamepadCursor = function () {\n        _state__WEBPACK_IMPORTED_MODULE_1__.State.getCtx().save();\n        // Draw the pixelated hand cursor\n        var cursor = [\n            [1, 1, 0, 0, 0, 0, 0],\n            [1, 1, 1, 0, 0, 0, 0],\n            [1, 1, 1, 1, 0, 0, 0],\n            [1, 1, 1, 1, 1, 0, 0],\n            [1, 1, 1, 1, 0, 1, 0],\n            [1, 0, 1, 1, 0, 0, 0],\n            [0, 0, 0, 0, 0, 0, 0],\n            [0, 0, 0, 0, 0, 0, 0]\n        ];\n        var pixelSize = 3;\n        var mouseX = _state__WEBPACK_IMPORTED_MODULE_1__.State.getScaledMouseCoordinates().x;\n        var mouseY = _state__WEBPACK_IMPORTED_MODULE_1__.State.getScaledMouseCoordinates().y;\n        // Draw the outline\n        _state__WEBPACK_IMPORTED_MODULE_1__.State.getCtx().fillStyle = 'black';\n        cursor.forEach(function (row, rowIndex) {\n            row.forEach(function (pixel, colIndex) {\n                if (pixel) {\n                    _state__WEBPACK_IMPORTED_MODULE_1__.State.getCtx().fillRect(mouseX + colIndex * pixelSize - 1, mouseY + rowIndex * pixelSize - 1, pixelSize + 2, pixelSize + 2);\n                }\n            });\n        });\n        // Draw the filled cursor\n        _state__WEBPACK_IMPORTED_MODULE_1__.State.getCtx().fillStyle = 'white';\n        cursor.forEach(function (row, rowIndex) {\n            row.forEach(function (pixel, colIndex) {\n                if (pixel) {\n                    _state__WEBPACK_IMPORTED_MODULE_1__.State.getCtx().fillRect(mouseX + colIndex * pixelSize, mouseY + rowIndex * pixelSize, pixelSize, pixelSize);\n                }\n            });\n        });\n        _state__WEBPACK_IMPORTED_MODULE_1__.State.getCtx().restore();\n    };\n    /* LOGIC FUNCTIONS */\n    /* USER ACTION FUNCTIONS */\n    /* RENDER FUNCTIONS */\n    Game.prototype.scaleGame = function () {\n        console.log('Scaling game');\n        var currentWidth = window.innerWidth;\n        var currentHeight = window.innerHeight;\n        _state__WEBPACK_IMPORTED_MODULE_1__.State.setWindowAspectRatio(currentWidth / currentHeight);\n        // Determine the scale factor\n        if (_state__WEBPACK_IMPORTED_MODULE_1__.State.getWindowAspectRatio() > _state__WEBPACK_IMPORTED_MODULE_1__.State.getGameAspectRatio()) {\n            // Window is wider than game aspect ratio\n            _state__WEBPACK_IMPORTED_MODULE_1__.State.setScaleFactor(currentHeight / 1136);\n        }\n        else {\n            // Window is narrower than game aspect ratio\n            _state__WEBPACK_IMPORTED_MODULE_1__.State.setScaleFactor(currentWidth / 640);\n        }\n        // Apply the scale factor to the game container\n        var gameContainer = document.getElementById('game-canvas');\n        gameContainer.style.transform = \"scale(\".concat(_state__WEBPACK_IMPORTED_MODULE_1__.State.getScaleFactor(), \")\");\n        gameContainer.style.width = \"\".concat(640, \"px\");\n        gameContainer.style.height = \"\".concat(1136, \"px\");\n    };\n    return Game;\n}());\n\n\n\n//# sourceURL=webpack://rogue-runner/./src/rogue-runner.ts?");

/***/ }),

/***/ "./src/state.ts":
/*!**********************!*\
  !*** ./src/state.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   State: () => (/* binding */ State)\n/* harmony export */ });\nvar State = /** @class */ (function () {\n    function State() {\n    }\n    State.getGameAspectRatio = function () {\n        return State.gameAspectRatio;\n    };\n    State.setWindowAspectRatio = function (aspectRatio) {\n        State.windowAspectRatio = aspectRatio;\n    };\n    State.getWindowAspectRatio = function () {\n        return State.windowAspectRatio;\n    };\n    State.setCanvas = function (canvas) {\n        State.canvas = canvas;\n    };\n    State.getCanvas = function () {\n        return State.canvas;\n    };\n    State.setCtx = function (ctx) {\n        State.ctx = ctx;\n    };\n    State.getCtx = function () {\n        return State.ctx;\n    };\n    State.setGameRunning = function (gameRunning) {\n        State.gameRunning = gameRunning;\n    };\n    State.isGameRunning = function () {\n        return State.gameRunning;\n    };\n    State.setTimerInMs = function (timerInMs) {\n        State.timerInMs = timerInMs;\n    };\n    State.getTimerInMs = function () {\n        return State.timerInMs;\n    };\n    State.incrementTimerInMs = function (elapsed) {\n        State.timerInMs += elapsed;\n    };\n    State.getScore = function () {\n        return State.score;\n    };\n    State.setScore = function (score) {\n        State.score = score;\n    };\n    State.getCurrentLevel = function () {\n        return State.currentLevel;\n    };\n    State.setCurrentLevel = function (level) {\n        State.currentLevel = level;\n    };\n    State.incrementCurrentLevel = function () {\n        State.currentLevel++;\n    };\n    State.setPlayer = function (player) {\n        State.player = player;\n    };\n    State.getPlayer = function () {\n        return State.player;\n    };\n    State.setMouseCoordinates = function (coordinates) {\n        State.mouseCoordinates = coordinates;\n        State.scaledMouseCoordinates = {\n            x: coordinates.x / State.scaleFactor,\n            y: coordinates.y / State.scaleFactor\n        };\n    };\n    State.getMouseCoordinates = function () {\n        return State.mouseCoordinates;\n    };\n    State.setClickCoordinates = function (coordinates) {\n        if (coordinates === null) {\n            State.clickCoordinates = null;\n            State.scaledClickCoordinates = null;\n        }\n        else {\n            State.clickCoordinates = coordinates;\n            State.scaledClickCoordinates = {\n                x: coordinates.x / State.scaleFactor,\n                y: coordinates.y / State.scaleFactor\n            };\n        }\n    };\n    State.getClickCoordinates = function () {\n        return State.clickCoordinates;\n    };\n    State.getScaledClickCoordinates = function () {\n        return State.scaledClickCoordinates;\n    };\n    State.getScaledMouseCoordinates = function () {\n        return State.scaledMouseCoordinates;\n    };\n    State.setScaleFactor = function (scaleFactor) {\n        State.scaleFactor = scaleFactor;\n    };\n    State.getScaleFactor = function () {\n        return State.scaleFactor;\n    };\n    State.setMouseClick = function (isMouseClick) {\n        State.mouseClick = isMouseClick;\n    };\n    State.isMouseClick = function () {\n        return State.mouseClick;\n    };\n    State.setGamepadButtonClick = function (isGamepadButtonClick) {\n        State.gamepadButtonClick = isGamepadButtonClick;\n    };\n    State.isGamepadButtonClick = function () {\n        return State.gamepadButtonClick;\n    };\n    State.addGameComponent = function (gameComponent) {\n        State.gameComponents.push(gameComponent);\n    };\n    State.removeGameComponent = function (gameComponent) {\n        State.gameComponents = State.gameComponents.filter(function (gc) { return gc !== gameComponent; });\n    };\n    State.removeGameComponentByType = function (type) {\n        State.gameComponents = State.gameComponents.filter(function (gc) { return gc.constructor.name !== type; });\n    };\n    State.getGameComponents = function () {\n        return State.gameComponents;\n    };\n    State.removeAllDeletedGameComponents = function () {\n        State.gameComponents = State.gameComponents.filter(function (gc) { return !gc.deleteMe; });\n    };\n    State.gameAspectRatio = 640 / 1136;\n    State.gameRunning = false;\n    State.timerInMs = 0;\n    State.score = 0;\n    State.currentLevel = 0;\n    State.mouseClick = false;\n    State.gamepadButtonClick = false;\n    State.scaleFactor = 1;\n    State.mouseCoordinates = { x: 0, y: 0 };\n    State.scaledMouseCoordinates = { x: 0, y: 0 };\n    State.clickCoordinates = { x: 0, y: 0 };\n    State.scaledClickCoordinates = { x: 0, y: 0 };\n    State.gameComponents = [];\n    return State;\n}());\n\n\n\n//# sourceURL=webpack://rogue-runner/./src/state.ts?");

/***/ }),

/***/ "./src/types.ts":
/*!**********************!*\
  !*** ./src/types.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GameComponent: () => (/* binding */ GameComponent)\n/* harmony export */ });\n/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./state */ \"./src/state.ts\");\nvar __assign = (undefined && undefined.__assign) || function () {\n    __assign = Object.assign || function(t) {\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\n            s = arguments[i];\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\n                t[p] = s[p];\n        }\n        return t;\n    };\n    return __assign.apply(this, arguments);\n};\n\nvar GameComponent = /** @class */ (function () {\n    function GameComponent(coordinates) {\n        this.coordinates = coordinates;\n        this.deleteMe = false;\n    }\n    GameComponent.prototype.update = function () { };\n    GameComponent.prototype.render = function (coordinates) { };\n    GameComponent.prototype.reset = function () { };\n    GameComponent.prototype.isHoveredOver = function () {\n        var scaledMouseCoordinates = _state__WEBPACK_IMPORTED_MODULE_0__.State.getScaledMouseCoordinates();\n        return ((scaledMouseCoordinates === null || scaledMouseCoordinates === void 0 ? void 0 : scaledMouseCoordinates.x) >= this.renderConfig.coordinates.x &&\n            (scaledMouseCoordinates === null || scaledMouseCoordinates === void 0 ? void 0 : scaledMouseCoordinates.x) <=\n                this.renderConfig.coordinates.x +\n                    this.renderConfig.size.width * this.renderConfig.scale &&\n            (scaledMouseCoordinates === null || scaledMouseCoordinates === void 0 ? void 0 : scaledMouseCoordinates.y) >= this.renderConfig.coordinates.y &&\n            (scaledMouseCoordinates === null || scaledMouseCoordinates === void 0 ? void 0 : scaledMouseCoordinates.y) <=\n                this.renderConfig.coordinates.y +\n                    this.renderConfig.size.height * this.renderConfig.scale);\n    };\n    GameComponent.prototype.isClicked = function () {\n        return this.isHoveredOver() && (_state__WEBPACK_IMPORTED_MODULE_0__.State.isMouseClick() || _state__WEBPACK_IMPORTED_MODULE_0__.State.isGamepadButtonClick());\n    };\n    GameComponent.prototype.getCoordinatesCopy = function () {\n        return __assign({}, this.coordinates);\n    };\n    return GameComponent;\n}());\n\n\n\n//# sourceURL=webpack://rogue-runner/./src/types.ts?");

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