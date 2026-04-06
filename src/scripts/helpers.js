import { characters, adjectives } from "./characters.js"

const generatePlayerName = () => {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const base = characters[Math.floor(Math.random() * characters.length)];
    return `${adj}${base}`;
}

const getShipEndpoint = (ships, i, j) => {
    for (const ship of ships) {
        const p = ship.position;

        const isStart = i === p.rowStart && j === p.colStart;
        const isFinish = i === p.rowFinish && j === p.colFinish;

        if (isStart || isFinish) {
            const orientation =
                p.rowStart === p.rowFinish ? "horizontal" : "vertical";

            return {
                type: isStart ? "start" : "finish",
                orientation
            };
        }
    }

    return null;
}

export { generatePlayerName, getShipEndpoint }