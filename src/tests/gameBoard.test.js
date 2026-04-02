import { Board } from "../scripts/gameBoard.js";
import { shipCoords } from "../scripts/ship.js";

describe('testing the game board', () => {
    test('if game board is created and if nothing is passed, it creates empty board', () => {
        const board = new Board();

        expect(board.printBoard()).toBe('0000000000\n0000000000\n0000000000\n0000000000\n0000000000\n0000000000\n0000000000\n0000000000\n0000000000\n0000000000');
    });

    test('if array of coordinates is more/less than 10, empty board is created', () => {
        const coordinates = [];
        coordinates.push(shipCoords(0, 0, 0, 1));

        const board = new Board(coordinates);

        expect(board.printBoard()).toBe('0000000000\n0000000000\n0000000000\n0000000000\n0000000000\n0000000000\n0000000000\n0000000000\n0000000000\n0000000000');
    });

    test('if array of coordinates is passed, the board is populated by the ships', () => {
        const ships = [];
        ships.push(shipCoords(7, 0, 7, 1)); // length: 2; A8 - B8
        ships.push(shipCoords(0, 1, 3, 1)); // length: 4; B1 - B4
        ships.push(shipCoords(9, 2, 9, 2)); // length: 1; C10
        ships.push(shipCoords(0, 3, 0, 5)); // length: 3; D1 - F1
        ships.push(shipCoords(4, 3, 4, 3)); // length: 1; D5
        ships.push(shipCoords(8, 5, 8, 6)); // length: 2; F9 - G9
        ships.push(shipCoords(4, 6, 6, 6)); // length: 3; G5 - G7
        ships.push(shipCoords(1, 7, 1, 7)); // length: 1; H7
        ships.push(shipCoords(0, 9, 1, 9)); // length: 2; J1 - J2
        ships.push(shipCoords(5, 9, 5, 9)); // length: 1; J6

        const board = new Board(ships);

        expect(board.printBoard()).toBe(
            '0101110001\n0100000101\n0100000000\n0100000000\n0001001000\n0000001001\n0000001000\n1100000000\n0000011000\n0010000000'
        );
    });

    test('when placeShip is called, it handles the ship placement correctly and check if the placement is valid', () => {
        const board = new Board();

        board.placeShip(shipCoords(0, 0, 0, 0));

        expect(board.printBoard()).toBe(
            '1000000000\n0000000000\n0000000000\n0000000000\n0000000000\n0000000000\n0000000000\n0000000000\n0000000000\n0000000000'
        );

        expect(() => board.placeShip(shipCoords(1, 1, 1, 1))).toThrow('Ship position is not valid');

        board.placeShip(shipCoords(0, 2, 0, 2));
        expect(board.printBoard()).toBe(
            '1010000000\n0000000000\n0000000000\n0000000000\n0000000000\n0000000000\n0000000000\n0000000000\n0000000000\n0000000000'
        );

        board.placeShip(shipCoords(4, 3, 4, 6));
        expect(board.printBoard()).toBe(
            '1010000000\n0000000000\n0000000000\n0000000000\n0001111000\n0000000000\n0000000000\n0000000000\n0000000000\n0000000000'
        );

        board.placeShip(shipCoords(1, 9, 3, 9));
        expect(board.printBoard()).toBe(
            '1010000000\n0000000001\n0000000001\n0000000001\n0001111000\n0000000000\n0000000000\n0000000000\n0000000000\n0000000000'
        );
    });

    test(`placeShip doesn't allow to place more than 10 ships`, () => {
        const ships = [];
        ships.push(shipCoords(7, 0, 7, 1)); // length: 2; A8 - B8
        ships.push(shipCoords(0, 1, 3, 1)); // length: 4; B1 - B4
        ships.push(shipCoords(9, 2, 9, 2)); // length: 1; C10
        ships.push(shipCoords(0, 3, 0, 5)); // length: 3; D1 - F1
        ships.push(shipCoords(4, 3, 4, 3)); // length: 1; D5
        ships.push(shipCoords(8, 5, 8, 6)); // length: 2; F9 - G9
        ships.push(shipCoords(4, 6, 6, 6)); // length: 3; G5 - G7
        ships.push(shipCoords(1, 7, 1, 7)); // length: 1; H7
        ships.push(shipCoords(0, 9, 1, 9)); // length: 2; J1 - J2
        ships.push(shipCoords(5, 9, 5, 9)); // length: 1; J6

        const board = new Board(ships);

        expect(() => board.placeShip(shipCoords(7, 3, 7, 3))).toThrow(`Can't place more than 10 ships`);
    });

    test(`placeShip doesn't allow to place more than specific number of ships of specific type`, () => {
        const board = new Board();

        board.placeShip(shipCoords(0, 0, 0, 0));
        board.placeShip(shipCoords(0, 9, 0, 9));
        board.placeShip(shipCoords(9, 0, 9, 0));
        board.placeShip(shipCoords(9, 9, 9, 9));

        expect(() => board.placeShip(4, 4, 4, 4)).toThrow('Max number of this type of ships is reached');
    });
});