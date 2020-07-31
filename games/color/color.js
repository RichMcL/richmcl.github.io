class Piece  {
    constructor(count, row, col) {
        this.count = count;
        this.row = row;
        this.col = col;
        this.type = 'A';
        this.element = null;
    }

    initialDraw() {
        return `<button class="piece" row="${this.row}" col="${this.col}">&nbsp;</button>`;
    }

    tick() {
        this.element.setAttribute('type', this.type);
        
        if (this.element.innerText !== this.type) {
            this.element.innerText = this.type;
        }
        
        if (this.active) {
            this.element.setAttribute('active', true);
        } else {
            this.element.removeAttribute('active');

            // This resets a piece back to type A when it is deactivated
            // this.element.setAttribute('type', 'A');            
            // this.type = 'A';
        }
    }

    click() {
        this.trigger = true;
    }

    getNeighborSet() {
        switch (this.type) {
            case 'A':
                return [2, 4, 5, 6, 8]
            case 'B':
                return [1, 3, 5, 7, 9]
            case 'Z':
                return [5]
            default: 
                return [2, 4, 5, 6, 8]
        }
    }

    getEl() {
        return document.querySelector(`[row="${this.row}"][col="${this.col}"]`)
    }
}

class Game {
    size = 8;
    board = [];

    constructor() {
        this.init();
        this.initGame();
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

    initGame() {
        let piece;

        for (let i = 0; i < 2; i++) {
            piece = this.getPieceAt(this.getRandom(), this.getRandom())
            piece.type = 'A';
            piece.click();
        }

        for (let i = 0; i < 2; i++) {
            piece = this.getPieceAt(this.getRandom(), this.getRandom())
            piece.type = 'B';
            piece.click();
        }

        for (let i = 0; i < 2; i++) {
            piece = this.getPieceAt(this.getRandom(), this.getRandom())
            piece.type = 'Z';
            piece.click();
        }
    }

    getRandom() {
        return Math.floor(Math.random() * this.size);
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

    drawInit() {
        let html = '';
        for (let i = 0; i < this.size; i++) {
            html += '<div class="row">'
            for (let j = 0; j < this.size; j++) {
                const piece = this.getPieceAt(i, j);                
                html += piece.initialDraw();
            }
            html += '</div>';
        }

        document.getElementById('game').innerHTML = html;

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const piece = this.getPieceAt(i, j);
                piece.element = document.querySelector(`[row="${i}"][col="${j}"]`);               
            }
        }
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

        console.log('neighbor positions', pos);
        console.log('neighbor', neighbors);

        return neighbors;
    }

    /**
     * 1 - Update all states
     * 2 - Redraw 
     * 3 - Check for win
     */
    tick() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const piece = this.getPieceAt(i, j);
                if (piece.trigger) {
                    const neighbors = this.getNeighborsAt(piece.row, piece.col, piece.getNeighborSet());
                    
                    for (const n of neighbors) {
                        if (!n.active) {
                            n.type = piece.type;    
                        }
                        n.active = !n.active;
                    }

                    piece.trigger = false;                
                }
            }
        }

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const piece = this.getPieceAt(i, j);
                piece.tick();
            }
        }
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
}

window.game = new Game();

window.loop = null;
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
window.showWin = true;

function gameLoop() {
    game.tick();
    window.loop = requestAnimationFrame(gameLoop);

    if (game.isWin() && window.showWin) {
        alert('You Win!')
        window.showWin = false;        
    }
}

gameLoop();