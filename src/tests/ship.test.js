import { Ship } from "../scripts/ship.js";

describe('testing functionality around Ship objects', () => {
    test('the ship is created of the passed length; if length value is invalid, the message is displayed', () => {
        const smallShip = new Ship(3);

        expect(smallShip.length()).toBe(3);
        expect(() => new Ship(0)).toThrow('Invalid input: length should be greater than 1 and less than 5');
        expect(() => new Ship(6)).toThrow('Invalid input: length should be greater than 1 and less than 5');
        expect(new Ship(1).length()).toBe(1);
        expect(new Ship(5).length()).toBe(5);
    });

    test('when the ship is hit, hits are recorded; if the ship has sank, no new hits are possible', () => {
        const smallShip = new Ship(3);
        smallShip.hit();

        expect(smallShip.hits()).toBe(1);
        expect(smallShip.hit()).toBe();
        expect(smallShip.hit()).toBe();
        expect(smallShip.hit()).toBe('The ship has sunk. No more hits available');
        expect(smallShip.hits()).toBe(3);
        expect(smallShip.isSunk()).toBe(true);
    });
});