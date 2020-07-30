class Piece  {
    constructor(count, row, col) {
        this.count = count;
        this.row = row;
        this.col = col;
        
    }

    tick() {
        if (this.active) {
            document.querySelector(`[row="${this.row}"][col="${this.col}"]`).classList.add('active');
        } else {
            document.querySelector(`[row="${this.row}"][col="${this.col}"]`).classList.remove('active');
        }
    }

    click() {
        this.active = !this.active;
        this.trigger = true;
    }
}

class Game {
    size = 5;
    board = [];

    constructor() {
        this.init();
    }

    init() {
        let count = 0;
        for (let i = 0; i < this.size; i++) {
            this.board[i] = [];
            for (let j = 0; j < this.size; j++) {
                this.board[i][j] = new Piece(count++, i, j);
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

    isWin() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const piece = this.getPieceAt(i, j);

                if (piece.active) {
                    return false;
                }
            }
        }

        return true;
    }

    drawInit() {
        let html = '';
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const piece = this.getPieceAt(i, j);
                
                // html += `<button class="piece" row="${i}" col="${j}">${i},${j}</button>`;
                html += `<button class="piece" row="${i}" col="${j}">&nbsp;</button>`;
            }
            html += '<br>';
        }

        document.getElementById('game').innerHTML = html;
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
    }

    tick() {
        if (this.isWin()) {
            cancelAnimationFrame(window.loop);
            window.stop = true;            
        }

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const piece = this.getPieceAt(i, j);
                piece.tick();                                

                if (piece.trigger) {
                    const neighbors = this.getNeighborsAt(piece.row, piece.col, [2, 4, 6, 8]);
                    neighbors.forEach(n => n.active = !n.active);
                    piece.trigger = false;                
                }
            }
        }
    }
}

window.game = new Game();
game.getPieceAt(2,2).active = true;
game.getPieceAt(2,2).trigger = true;
window.loop = null;
window.stop = null;

window.game.drawInit();

document.querySelectorAll('.piece').forEach(b => {
    b.addEventListener('click', () => {
        let row = b.getAttribute('row');
        let col = b.getAttribute('col');
        
        console.log('click', row, col);

        game.getPieceAt(row, col).click();
    })
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
    } else {
        alert('you win');
    }
}

gameLoop();