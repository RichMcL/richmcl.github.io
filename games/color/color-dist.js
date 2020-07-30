"use strict";
var Piece = /** @class */ (function () {
    function Piece(count, row, col) {
        this.count = count;
        this.row = row;
        this.col = col;
    }
    Piece.prototype.tick = function () {
        if (this.active) {
            document.querySelector("[row=\"" + this.row + "\"][col=\"" + this.col + "\"]").classList.add('active');
        }
        else {
            document.querySelector("[row=\"" + this.row + "\"][col=\"" + this.col + "\"]").classList.remove('active');
        }
    };
    Piece.prototype.click = function () {
        this.active = !this.active;
        this.trigger = true;
    };
    return Piece;
}());
var Game = /** @class */ (function () {
    function Game() {
        this.size = 5;
        this.board = [];
        this.init();
    }
    Game.prototype.init = function () {
        var count = 0;
        for (var i = 0; i < this.size; i++) {
            this.board[i] = [];
            for (var j = 0; j < this.size; j++) {
                this.board[i][j] = new Piece(count++, i, j);
            }
        }
    };
    Game.prototype.getPieceAt = function (row, col) {
        if (row < 0 || row >= this.size || col < 0 || col >= this.size) {
            return;
        }
        return this.board[row][col];
    };
    Game.prototype.printBoard = function () {
        console.log('Board:');
        this.board.forEach(function (row) {
            console.log('row', row);
        });
    };
    Game.prototype.isWin = function () {
        for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size; j++) {
                var piece = this.getPieceAt(i, j);
                if (piece.active) {
                    return false;
                }
            }
        }
        return true;
    };
    Game.prototype.drawInit = function () {
        var html = '';
        for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size; j++) {
                var piece = this.getPieceAt(i, j);
                html += "<button class=\"piece\" row=\"" + i + "\" col=\"" + j + "\">" + i + "," + j + "</button>";
            }
            html += '<br>';
        }
        document.getElementById('game').innerHTML = html;
    };
    /**
     * 1-2-3
     * 4-5-6
     * 7-8-9
     *
     * 5 is self
     */
    Game.prototype.getNeighborsAt = function (row, col, pos) {
        var neighbors = [];
        console.log('pos', pos);
        if (pos.includes(1) && this.getPieceAt(row - 1, col - 1)) {
            neighbors.push(this.getPieceAt(row - 1, col - 1));
        }
        if (pos.includes(2) && this.getPieceAt(row - 1, col)) {
            neighbors.push(this.getPieceAt(row - 1, col));
        }
        if (pos.includes(3) && this.getPieceAt(row - 1, parseInt(col) + 1)) {
            neighbors.push(this.getPieceAt(row - 1, parseInt(col) + 1));
        }
        if (pos.includes(4) && this.getPieceAt(row, col - 1)) {
            neighbors.push(this.getPieceAt(row, col - 1));
        }
        if (pos.includes(5) && this.getPieceAt(row, col)) {
            neighbors.push(this.getPieceAt(row, col));
        }
        if (pos.includes(6) && this.getPieceAt(row, parseInt(col) + 1)) {
            neighbors.push(this.getPieceAt(row, parseInt(col) + 1));
        }
        if (pos.includes(7) && this.getPieceAt(parseInt(row) + 1, col - 1)) {
            neighbors.push(this.getPieceAt(parseInt(row) + 1, col - 1));
        }
        if (pos.includes(8) && this.getPieceAt(parseInt(row) + 1, col)) {
            neighbors.push(this.getPieceAt(parseInt(row) + 1, col));
        }
        if (pos.includes(9) && this.getPieceAt(parseInt(row) + 1, parseInt(col) + 1)) {
            neighbors.push(this.getPieceAt(parseInt(row) + 1, parseInt(col) + 1));
        }
        return neighbors;
        // console.log('neighbors', neighbors);
    };
    Game.prototype.tick = function () {
        if (this.isWin()) {
            cancelAnimationFrame(window.loop);
            window.stop = true;
        }
        for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size; j++) {
                var piece = this.getPieceAt(i, j);
                piece.tick();
                if (piece.trigger) {
                    var neighbors = this.getNeighborsAt(piece.row, piece.col, [2, 4, 6, 8]);
                    neighbors.forEach(function (n) { return n.active = !n.active; });
                    piece.trigger = false;
                }
            }
        }
    };
    return Game;
}());
window.game = new Game();
game.getPieceAt(2, 2).active = true;
game.getPieceAt(2, 2).trigger = true;
window.loop = null;
window.stop = null;
window.game.drawInit();
document.querySelectorAll('.piece').forEach(function (b) {
    b.addEventListener('click', function () {
        var row = b.getAttribute('row');
        var col = b.getAttribute('col');
        console.log('click', row, col);
        game.getPieceAt(row, col).click();
    });
});
function printBoard() {
    game.printBoard();
}
//GAME LOOP 
var frameCount = 0;
function gameLoop() {
    if (!window.stop) {
        game.tick();
        window.loop = requestAnimationFrame(gameLoop);
    }
    else {
        alert('you win');
    }
}
gameLoop();
