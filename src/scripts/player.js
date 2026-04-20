import { Board } from "./gameBoard.js";

export class Player {
    #wins = 0;
    #isTurn = false;
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

    setTurn(turn) {
        this.#isTurn = turn;
    }

    getTurn() {
        return this.#isTurn;
    }

    getPeerId() {
        return this.#peerId;
    }
}