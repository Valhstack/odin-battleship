import { Ship, shipCoords } from "../scripts/ship.js";

describe('testing functionality around Ship objects', () => {
    test('the ship is created of the passed length; if length value is invalid, the message is displayed', () => {
        const smallShip = new Ship(shipCoords(1, 1, 3, 1));

        expect(smallShip.length()).toBe(3);
        expect(new Ship(shipCoords(1, 1, 1, 1)).length()).toBe(1);
        expect(new Ship(shipCoords(1, 3, 1, 7)).length()).toBe(5);
    });

    test('when the ship is hit, hits are recorded; if the ship has sank, no new hits are possible', () => {
        const smallShip = new Ship(shipCoords(1, 1, 3, 1));
        smallShip.hit();

        expect(smallShip.hits()).toBe(1);
        smallShip.hit();
        smallShip.hit();
        expect(smallShip.isSunk()).toBe(true);

        expect(() => smallShip.hit()).toThrow('The ship has already sunk');
        expect(smallShip.hits()).toBe(3);
        expect(smallShip.isSunk()).toBe(true);
    });
});