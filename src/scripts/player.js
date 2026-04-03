import { Board } from "./gameBoard.js";

export class Player {
    constructor(name) {
        this.name = name;
        this.board = new Board();
    }
}