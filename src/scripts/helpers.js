import { characters, adjectives } from "./characters.js"

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

export { generatePlayerName, getShipEndpoint }