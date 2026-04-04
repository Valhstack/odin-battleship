import { characters, adjectives } from "./characters.js"

const generatePlayerName = () => {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const base = characters[Math.floor(Math.random() * characters.length)];
    return `${adj}${base}`;
}

export { generatePlayerName }