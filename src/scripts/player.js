import { Board } from "./gameBoard.js";

export class Player {
    #wins = 0;

    constructor(name) {
        this.name = name;
        this.board = new Board();
    }

    addWin() {
        this.#wins++;
    }

    getWins() {
        return this.#wins;
    }

    resetWins() {
        this.#wins = 0;
    }
}