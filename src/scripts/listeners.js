import { generatePlayerName, generateShipsPlacement } from "./helpers.js";
import { Player } from "./player.js";
import { game, userPlayer, compPlayer } from "./game.js";
import { renderShips, reset } from "./render.js";
import { comp } from './comp.js';
import { shipCoords } from "./ship.js";

const cards = document.getElementsByClassName('card');
const startGameBtns = document.getElementsByClassName('start-game-btn');
let elemIndex;

let dragAndDropShips = document.getElementById('drag-and-drop-ships-wrapper').querySelectorAll('.ship');
dragAndDropShips = [...dragAndDropShips];

const attachListeners = (items, event, handler) => {
    for (let item of items) {
        item.addEventListener(event, handler);
    }
};

function onPointerDownHandler(e) {
    const children = document.getElementById(e.target.closest('.ship').id).querySelectorAll('.ship-piece');
    const elem = e.target;
    const index = [...children].indexOf(elem);

    elemIndex = index;
}

function shipHandler(e) {
    const id = e.target.id;
    e.dataTransfer.setData('text/plain', JSON.stringify({ id: id, index: elemIndex }));
}

function shipRotationHandler(e) {
    const children = document.getElementById(e.currentTarget.closest('.ship').id).querySelectorAll('.ship-piece');
    if (e.currentTarget.dataset.direction === 'horizontal') {
        e.currentTarget.dataset.direction = 'vertical';
        for (let child of children) {
            let classDisassambled = child.classList[1].split('-');
            classDisassambled[3] = 'vertical';

            const classAssambled = classDisassambled.join('-');

            child.classList.remove(child.classList[1]);
            child.classList.add(classAssambled);
        }
    }
    else if (e.currentTarget.dataset.direction === 'vertical') {
        e.currentTarget.dataset.direction = 'horizontal';
        for (let child of children) {
            let classDisassambled = child.classList[1].split('-');
            classDisassambled[3] = 'horizontal';

            const classAssambled = classDisassambled.join('-');

            child.classList.remove(child.classList[1]);
            child.classList.add(classAssambled);
        }
    }
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
        attachListeners(items, 'click', shipRotationHandler);
    });

    document.getElementById('player-board').addEventListener('dragover', (e) => {
        e.preventDefault();
    });
    document.getElementById('player-board').addEventListener('drop', (e) => {
        e.preventDefault();

        const raw = e.dataTransfer.getData('text/plain');
        const data = JSON.parse(raw);
        const elem = document.getElementById(data.id);
        let children = elem.querySelectorAll('.ship-piece');
        children = [...children];

        const row = e.target.closest('.board-cell').dataset.row;
        const col = e.target.closest('.board-cell').dataset.col;

        let start, finish;

        const direction = elem.dataset.direction;

        if (direction !== 'vertical') {
            start = col - data.index;
            finish = start + Number(elem.dataset.length) - 1;
        }
        else {
            start = row - data.index;
            finish = start + Number(elem.dataset.length) - 1;
        }

        try {
            if (Number(row) < 0 || Number(col) < 0 || start < 0 || finish < 0 || Number(row) > 9 || Number(col) > 9 || start > 9 || finish > 9) {
                throw new Error('Ship position is not valid');
            }
            if (direction !== 'vertical') {
                userPlayer.board.placeShip(shipCoords(Number(row), start, Number(row), finish));
            }
            else {
                userPlayer.board.placeShip(shipCoords(start, Number(col), finish, Number(col)));
            }

            for (let child of children) {
                let cell;
                if (direction !== 'vertical') {
                    cell = document.querySelector(`[data-row='${row}'][data-col='${start}']`);
                }
                else {
                    cell = document.querySelector(`[data-row='${start}'][data-col='${col}']`);
                }
                cell.appendChild(child);
                start++;
            }

            document.getElementById(`ship-length-${elem.dataset.length}-${Number(elem.dataset.index) + 1}`).classList.remove('inactive');
        }
        catch (e) {
            elem.classList.remove('invalid-shake');
            void elem.offsetWidth;
            elem.classList.add('invalid-shake');

            if (direction != 'vertical') {
                for (let i = start; i <= finish; i++) {
                    document.querySelector(`[data-row='${row}'][data-col='${i}']`).classList.add('invalid');

                    document.querySelector(`[data-row='${row}'][data-col='${i}']`).addEventListener('animationend', () => {
                        document.querySelector(`[data-row='${row}'][data-col='${i}']`).classList.remove('invalid');
                    }, { once: true });
                }
            }
            else {
                for (let i = start; i <= finish; i++) {
                    document.querySelector(`[data-row='${i}'][data-col='${col}']`).classList.add('invalid');

                    document.querySelector(`[data-row='${i}'][data-col='${col}']`).addEventListener('animationend', () => {
                        document.querySelector(`[data-row='${i}'][data-col='${col}']`).classList.remove('invalid');
                    }, { once: true });
                }
            }

            console.log(row, col, start, finish);
        }
    });
}

export { listeners, attachListeners, cellHandler }