import { characters, adjectives } from "./characters.js";
import { shipCoords } from "./ship.js";

const generatePlayerName = () => {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const base = characters[Math.floor(Math.random() * characters.length)];
    return `${adj}${base}`;
}

const getShipEndpoint = (ships, i, j) => {
    for (const ship of ships) {
        const p = ship.position;

        const rowMin = Math.min(p.rowStart, p.rowFinish);
        const rowMax = Math.max(p.rowStart, p.rowFinish);
        const colMin = Math.min(p.colStart, p.colFinish);
        const colMax = Math.max(p.colStart, p.colFinish);

        const isStart = i === p.rowStart && j === p.colStart;
        const isFinish = i === p.rowFinish && j === p.colFinish;

        const orientation = p.rowStart === p.rowFinish ? "horizontal" : "vertical";

        if (isStart && isFinish) {
            return {
                type: "single",
                orientation: "none",
                ship
            };
        }

        if (isStart || isFinish) {
            return {
                type: isStart ? "start" : "finish",
                orientation,
                ship
            };
        }

        const isInside =
            i >= rowMin && i <= rowMax &&
            j >= colMin && j <= colMax;

        if (isInside) {
            return {
                type: "middle",
                orientation,
                ship
            };
        }
    }

    return null;
}

const generateShipsPlacement = (board) => {
    let coord1, coord2, coord3, direction, start, finish;

    while (board.getNumOfShips() < 10) {
        let isPlaced = false;

        while (!isPlaced) {
            coord1 = Math.floor(Math.random() * 10);
            coord2 = Math.floor(Math.random() * 10);
            coord3 = Math.floor(Math.random() * 10);
            direction = Math.floor(Math.random() * 1000);

            if (direction < 500) {
                direction = 'horizontal';
            }
            else {
                direction = 'vertical';
            }

            if (Math.abs(coord1 - coord2) > 3) {
                if (Math.abs(coord1 - coord3) > 3) {
                    if (Math.abs(coord2 - coord3) > 3) {
                        coord1 = Math.floor(Math.random() * 10);
                        coord2 = Math.floor(Math.random() * 10);
                        coord3 = Math.floor(Math.random() * 10);
                        continue;
                    }
                    else {
                        isPlaced = attemptPlacement(coord2, coord3, coord1, direction, board);
                    }
                }
                else {
                    isPlaced = attemptPlacement(coord1, coord3, coord2, direction, board);
                }
            }
            else {
                isPlaced = attemptPlacement(coord1, coord2, coord3, direction, board);
            }
        }
    }
}

const attemptPlacement = (coord1, coord2, coord3, direction, board) => {
    let start, finish, fixed;

    start = Math.min(coord1, coord2);
    finish = Math.max(coord1, coord2);
    fixed = coord3;

    if (direction === 'horizontal') {
        try {
            board.placeShip(shipCoords(fixed, start, fixed, finish));
            return true;
        }
        catch (e) { }
    }
    else {
        try {
            board.placeShip(shipCoords(start, fixed, finish, fixed));
            return true;
        }
        catch (e) { }
    }

    return false;
}

export { generatePlayerName, getShipEndpoint, generateShipsPlacement }