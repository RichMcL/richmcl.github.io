class Piece extends HTMLElement {
    styles = `
        <style>
            :host {
                display: inline-block;
                width: 30px;
                height: 30px;
            }

            button.active {
                background-color: red;
            }

            button {
                width: 100%;
                height: 100%;
                -webkit-appearance: none;
                border: none;
                outline: 1px solid black;
                background-color: white;
            }
        </style>
    `

    constructor() {
        super();
    }

    connectedCallback() {
        this.count = this.getAttribute('count');
        this.row = this.getAttribute('row');
        this.col = this.getAttribute('col');

        const template = document.createElement('template');
        template.innerHTML = `
            ${this.styles}
            <button id="button">${this.count}</button>
        `;

        this.attachShadow({ mode: 'open' })
            .appendChild(template.content.cloneNode(true));

            this.shadowRoot.addEventListener('click', () => {
                this.click();
            });
    }

    tick() {
        if (this.active) {
            this.shadowRoot.getElementById('button').classList.add('active')
        } else {
            this.shadowRoot.getElementById('button').classList.remove('active')
        }
    }

    click() {
        this.active = !this.active;
        this.trigger = true;
    }
}

customElements.define('app-piece', Piece);


class Game extends HTMLElement {
    size = 5;
    board = [];

    constructor() {
        super();
        const template = document.createElement('template');
        template.innerHTML = `
            <h1>Game</h1>
        `;

        this.attachShadow({ mode: 'open' })
            .appendChild(template.content.cloneNode(true));

        this.init();
    }

    init() {
        let count = 0;
        for (let i = 0; i < this.size; i++) {
            this.board[i] = [];
            for (let j = 0; j < this.size; j++) {
                let piece = document.createElement('app-piece');
                piece.setAttribute('row', i);
                piece.setAttribute('col', j);
                piece.setAttribute('count', count++);
                this.shadowRoot.appendChild(piece);
                this.board[i][j] = piece;
            }
            this.shadowRoot.appendChild(document.createElement('br'));
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
        if (pos.includes(3) && this.getPieceAt(row - 1, 1 + col)) {
            neighbors.push(this.getPieceAt(row - 1, 1 + col));
        }

        if (pos.includes(4) && this.getPieceAt(row, col - 1)) {
            neighbors.push(this.getPieceAt(row, col - 1));
        }
        if (pos.includes(5) && this.getPieceAt(row, col)) {
            neighbors.push(this.getPieceAt(row, col));
        }
        if (pos.includes(6) && this.getPieceAt(row, 1 + col)) {
            neighbors.push(this.getPieceAt(row, 1 + col));
        }

        if (pos.includes(7) && this.getPieceAt(1 + row, col - 1)) {
            neighbors.push(this.getPieceAt(1 + row, col - 1));
        }
        if (pos.includes(8) && this.getPieceAt(1 + row, col)) {
            neighbors.push(this.getPieceAt(1 + row, col));
        }
        if (pos.includes(9) && this.getPieceAt(1 + row, 1 + col)) {
            neighbors.push(this.getPieceAt(1 + row, 1 + col));
        }

        console.log('neighbors', neighbors);
    }

    tick() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                this.getPieceAt(i, j).tick();
            }
        }
    }
}

customElements.define('app-game', Game);

const game = document.getElementsByTagName('app-game')[0];
window.game = game;

function printBoard() {
    game.printBoard();
}

//GAME LOOP 

var frameCount = 0;

function gameLoop() {
    frameCount++;

    if (frameCount > 2) {
        // console.log(new Date());
        // printBoard();
        frameCount = 0;

        game.tick();
    }


    requestAnimationFrame(gameLoop);
}

gameLoop();