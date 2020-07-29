class Game {
    size = 10;
    board = [];

    constructor() {
        this.init();
    }

    init() {
        let count = 0;
        for (let i = 0; i < this.size; i++) {
            this.board[i] = [];
            for (let j = 0; j < this.size; j++) {
                this.board[i][j] = new Piece(count++);
            }
        }
    }

    getPieceAt(row, col) {
        if (row < 0 || row >= this.size || col < 0 || col >= this.size) {
            return;
        }

        return this.board[row][col];
    }

    printBoard() {
        console.log('Board:');
        this.board.forEach((row) => {
            console.log('row', row);
        })
    }

    getNeighborsOf(row, col) {
        let neighbors = [];

        if (this.getPieceAt(row - 1, col)) {
            neighbors.push(this.getPieceAt(row - 1, col));
        }
        if (this.getPieceAt(row, col - 1)) {
            neighbors.push(this.getPieceAt(row, col - 1));
        }
        if (this.getPieceAt(row, col + 1)) {
            neighbors.push(this.getPieceAt(row, col + 1));
        }
        if (this.getPieceAt(row + 1, col)) {
            neighbors.push(this.getPieceAt(row + 1, col));
        }

        console.log('neighbors', neighbors);
    }
}

class Piece {
    constructor(count) {
        console.log('new piece');
        this.count = count;
    }
}

const game = new Game();

function printBoard() {
    game.printBoard();
}