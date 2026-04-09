import { generatePlayerName, generateShipsPlacement } from "./helpers.js";
import { Player } from "./player.js";
import { game, userPlayer } from "./game.js";
import { renderShips, resetPlayersShips } from "./render.js";

const cards = document.getElementsByClassName('card');
const startGameBtns = document.getElementsByClassName('start-game-btn');

const attachListeners = (items, handler) => {
    for (let item of items) {
        item.addEventListener("click", handler);
    }
};

async function cellHandler(e) {
    const row = e.target.dataset.row;
    const col = e.target.dataset.col;

    await game.move(row, col);
}

const listeners = () => {
    for (let card of cards) {
        card.addEventListener('click', (e) => {
            const elemID = e.currentTarget.id;

            if (elemID === 'left-card') {
                e.currentTarget.querySelector('.bottom-card').classList.remove('inactive');
                document.getElementById('right-card').querySelector('.bottom-card').classList.add('inactive');
            }
            else if (elemID === 'right-card') {
                e.currentTarget.querySelector('.bottom-card').classList.remove('inactive');
                document.getElementById('left-card').querySelector('.bottom-card').classList.add('inactive');
            }
        });
    }

    document.body.addEventListener('click', (e) => {
        if (!e.target.closest('.card')) {
            document.getElementById('left-card').querySelector('.bottom-card').classList.add('inactive');

            document.getElementById('right-card').querySelector('.bottom-card').classList.add('inactive');
        }
    });

    for (let btn of startGameBtns) {
        btn.addEventListener('click', (e) => {
            const elemID = e.currentTarget.id;

            let playerName;

            if (elemID === 'start-game-comp-btn') {
                const input = document.getElementById('player-name-comp');
                playerName = input === '' ? input.value : generatePlayerName();

                game.start(playerName, generatePlayerName());
            }
            else if (elemID === 'start-game-online-btn') {
                const input = document.getElementById('player-name-online');
                playerName = input === '' ? input.value : generatePlayerName();
                const userPlayer = new Player(playerName);
            }
        })
    }

    document.getElementById('generate-ships-placement-btn').addEventListener('click', () => {
        userPlayer.board.resetBoard();
        resetPlayersShips();

        generateShipsPlacement(userPlayer.board);
        renderShips(userPlayer.board);
    });
}

export { listeners, attachListeners, cellHandler }