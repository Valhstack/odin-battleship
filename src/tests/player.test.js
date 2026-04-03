import { Player } from "../scripts/player.js";
import { shipCoords } from "../scripts/ship.js";

describe('player class of the battleship game', () => {
    test('a new player is created with the given name and a board is created for them', () => {
        const player1 = new Player('Jon Snow');
        const board1 = player1.board;

        expect(player1.name).toBe('Jon Snow');
        expect(board1.printBoard()).toBe('0000000000\n0000000000\n0000000000\n0000000000\n0000000000\n0000000000\n0000000000\n0000000000\n0000000000\n0000000000');

        board1.placeShip(shipCoords(7, 0, 7, 1)); // length: 2; A8 - B8
        board1.placeShip(shipCoords(0, 1, 3, 1)); // length: 4; B1 - B4
        board1.placeShip(shipCoords(9, 2, 9, 2)); // length: 1; C10
        board1.placeShip(shipCoords(0, 3, 0, 5)); // length: 3; D1 - F1
        board1.placeShip(shipCoords(4, 3, 4, 3)); // length: 1; D5
        board1.placeShip(shipCoords(8, 5, 8, 6)); // length: 2; F9 - G9
        board1.placeShip(shipCoords(4, 6, 6, 6)); // length: 3; G5 - G7
        board1.placeShip(shipCoords(1, 7, 1, 7)); // length: 1; H7
        board1.placeShip(shipCoords(0, 9, 1, 9)); // length: 2; J1 - J2
        board1.placeShip(shipCoords(5, 9, 5, 9)); // length: 1; J6

        expect(board1.printBoard()).toBe(
            '0101110001\n0100000101\n0100000000\n0100000000\n0001001000\n0000001001\n0000001000\n1100000000\n0000011000\n0010000000'
        );
    });
});