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

    /**
     * 1-2-3
     * 4-5-6
     * 7-8-9
     * 
     * 5 is self
     */
    getNeighborsAt(row, col, pos){
        let neighbors = [];

        console.log('pos', pos);

        if (pos.includes(1) && this.getPieceAt(row - 1, col - 1)) {
            neighbors.push(this.getPieceAt(row - 1, col - 1));
        }
        if (pos.includes(2) && this.getPieceAt(row - 1, col)) {
            neighbors.push(this.getPieceAt(row - 1, col));
        }
        if (pos.includes(3) && this.getPieceAt(row - 1, col + 1)) {
            neighbors.push(this.getPieceAt(row - 1, col + 1));
        }

        if (pos.includes(4) && this.getPieceAt(row, col - 1)) {
            neighbors.push(this.getPieceAt(row, col - 1));
        }
        if (pos.includes(5) && this.getPieceAt(row, col)) {
            neighbors.push(this.getPieceAt(row, col));
        }
        if (pos.includes(6) && this.getPieceAt(row, col + 1)) {
            neighbors.push(this.getPieceAt(row, col + 1));
        }

        if (pos.includes(7) && this.getPieceAt(row + 1, col - 1)) {
            neighbors.push(this.getPieceAt(row + 1, col - 1));
        }
        if (pos.includes(8) && this.getPieceAt(row + 1, col)) {
            neighbors.push(this.getPieceAt(row + 1, col));
        }
        if (pos.includes(9) && this.getPieceAt(row + 1, col + 1)) {
            neighbors.push(this.getPieceAt(row + 1, col + 1));
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

//GAME LOOP 

var frameCount = 0;

function gameLoop() {
    frameCount++;

    if (frameCount > 60) {
        console.log(new Date());
        // printBoard();
        frameCount = 0;
    }


    requestAnimationFrame(gameLoop);
}

gameLoop();