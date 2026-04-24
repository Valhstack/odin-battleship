import { Board } from "./gameBoard.js";

export class Player {
    #wins = 0;
    #peerId;

    constructor(name, peerId) {
        this.name = name;
        this.board = new Board();
        this.#peerId = peerId;
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

    getPeerId() {
        return this.#peerId;
    }
}