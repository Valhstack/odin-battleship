import { generatePlayerName, generateShipsPlacement } from "./helpers.js";
import { Player } from "./player.js";
import { game, userPlayer, compPlayer } from "./game.js";
import { renderShips, reset } from "./render.js";
import { comp } from './comp.js';

const cards = document.getElementsByClassName('card');
const startGameBtns = document.getElementsByClassName('start-game-btn');
let elemIndex;

const attachListeners = (items, event, handler) => {
    for (let item of items) {
        item.addEventListener(event, handler);
    }
};

function onPointerDownHandler(e) {
    const children = document.getElementById(e.target.closest('.ship').id).querySelectorAll('.ship-piece');
    console.log(children);
    const elem = e.target;
    console.log('elem from the hadler', e.target);
    const index = [...children].indexOf(elem);
    console.log(index);

    elemIndex = index;
}

function shipHandler(e) {
    const id = e.target.id;
    e.dataTransfer.setData('text/plain', JSON.stringify({ id: id, index: elemIndex }));
}

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
        reset('player-board', '.ship-piece');

        generateShipsPlacement(userPlayer.board);
        renderShips(userPlayer.board);
    });

    document.getElementById('play-again-btn').addEventListener('click', () => {
        userPlayer.board.resetBoard();
        compPlayer.board.resetBoard();
        comp.reset();

        document.getElementById('winner-announcement').close();

        reset('player-board', '.board-cell');
        reset('enemy-board', '.board-cell');

        game.start();
    });

    document.getElementById('exit-btn').addEventListener('click', () => {
        userPlayer.board.resetBoard();
        compPlayer.board.resetBoard();
        comp.reset();

        document.getElementById('winner-announcement').close();

        reset('player-board', '.board-cell');
        reset('enemy-board', '.board-cell');

        document.getElementById('boards-screen').classList.add('inactive');

        userPlayer.name = undefined;
        compPlayer.name = undefined;

        document.getElementById('start-screen').classList.remove('inactive');
    });

    document.getElementById('drag-and-drop-ships-btn').addEventListener('click', () => {
        userPlayer.board.resetBoard();
        reset('player-board', '.ship-piece');

        document.getElementById('drag-and-drop-ships-wrapper').classList.remove('inactive');

        const items = document.getElementsByClassName('ship');
        attachListeners(items, 'dragstart', shipHandler);
        attachListeners(items, 'pointerdown', onPointerDownHandler);
    });

    document.getElementById('player-board').addEventListener('dragover', (e) => {
        e.preventDefault();
    });
    document.getElementById('player-board').addEventListener('drop', (e) => {
        e.preventDefault();

        const raw = e.dataTransfer.getData('text/plain');
        const data = JSON.parse(raw);
        console.log(data.id, data.index);
        const elem = document.getElementById(data.id);
        console.log(elem);
        console.log(e.target.closest('.board-cell').dataset.row);
        console.log(e.target.closest('.board-cell').dataset.col);
        //document.getElementById(e.target.id).appendChild(elem);
    });
}

export { listeners, attachListeners, cellHandler }