import { Ship } from "./ship.js";

class Board {
    #board = [];
    #numOfShips = 0;
    #ships = [];
    #variety = {
        1: 0,
        2: 0,
        3: 0,
        4: 0
    }

    #maxVariety = {
        1: 4,
        2: 3,
        3: 2,
        4: 1
    }

    #initialiseEmptyBoard() {
        this.#board = Array.from({ length: 10 }, () =>
            Array(10).fill('0')
        );
    }

    constructor(array) {
        this.#initialiseEmptyBoard();

        if (!array || array.length !== 10) {
            return;
        }

        for (let item of array) {
            this.placeShip(item);
        }
    }

    placeShip(position) {
        if (!this.#isPositionValid(position)) throw new Error('Ship position is not valid');
        if (this.#numOfShips >= 10) throw new Error(`Can't place more than 10 ships`);

        const ship = new Ship(position);
        const length = ship.length();

        if (this.#variety[length] >= this.#maxVariety[length]) throw new Error('Max number of this type of ships is reached');

        this.#ships.push(ship);
        this.#numOfShips++;
        this.#variety[length]++;

        if (ship.position.rowStart === ship.position.rowFinish) {
            for (let i = ship.position.colStart; i <= ship.position.colFinish; i++) {
                this.#board[ship.position.rowStart][i] = '1';
            }
        }
        else if (ship.position.colStart === ship.position.colFinish) {
            for (let i = ship.position.rowStart; i <= ship.position.rowFinish; i++) {
                this.#board[i][ship.position.colStart] = '1';
            }
        }
        else {
            this.#board[ship.position.rowStart][ship.position.colStart] = '1';
        }
    }

    #isPositionValid(position) {
        for (let i = position.rowStart - 1; i <= position.rowFinish + 1; i++) {
            for (let j = position.colStart - 1; j <= position.colFinish + 1; j++) {
                const cell = this.#board[i]?.[j];

                if (cell !== undefined && cell !== '0') {
                    return false;
                }
            }
        }

        return true;
    }

    receiveAttack(x, y) {
        if (this.#board[x][y] === '1') {
            this.#board[x][y] = 'x';

            for (let ship of this.#ships) {
                if ((ship.position.rowStart === x && ship.position.colStart === y) || (
                    ship.position.rowFinish === x && ship.position.colFinish === y)) {
                    ship.hit();

                    if (ship.isSunk()) this.#numOfShips--;
                }
                else if ((ship.position.rowStart === x - 1 && ship.position.colStart === y) ||
                    (ship.position.rowFinish === x + 1 && ship.position.colStart === y)) {
                    ship.hit();

                    if (ship.isSunk()) this.#numOfShips--;
                }
                else if ((ship.position.rowStart === x && ship.position.colStart === y - 1) ||
                    (ship.position.rowStart === x && ship.position.colFinish === y + 1)) {
                    ship.hit();

                    if (ship.isSunk()) this.#numOfShips--;
                }
            }
        }
        else if (this.#board[x][y] === '0') {
            this.#board[x][y] = 'o'
        }
        else {
            throw new Error(`Illegal move - can't place a hit there`);
        }
    }

    // returns TRUE if there are any ships left, FALSE if all are sunk
    areShipsLeft() {
        if (this.#numOfShips !== 0) return true;

        return false;
    }

    printBoard() {
        let result = '';

        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                result += this.#board[i][j];
            }
            if (i < 9) result += '\n';
        }

        return result;
    }
}

export { Board }