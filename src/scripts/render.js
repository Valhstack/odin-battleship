import { attachListeners, cellHandler } from "./listeners.js";

const render = (function () {
    const renderBoards = () => {
        document.getElementById('start-screen').classList.add('inactive');
        document.getElementById('boards-screen').classList.remove('inactive');

        const playerBoard = document.getElementById('player-board');
        const enemyBoard = document.getElementById('enemy-board');

        generateBoard(playerBoard);
        generateBoard(enemyBoard);
    };

    const renderShips = (playerBoard) => {
        const board = document.getElementById('player-board');

        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                if (playerBoard[i][j] === '1') {
                    const node = board.querySelector(`[data-row='${i}'][data-col='${j}']`);
                    console.log(node);

                    const div = document.createElement('div');
                    div.classList.add('ship-piece');
                    node.appendChild(div);
                }
            }
        }
    };

    const renderPlayerMove = (cellValue, row, col) => {
        const board = document.getElementById('enemy-board');

        if (cellValue === 'x') {
            const node = board.querySelector(`[data-row='${row}'][data-col='${col}']`);

            const p = document.createElement('p');
            p.classList.add('move-hit');
            p.textContent = 'X';
            node.appendChild(p);
        }
        else if (cellValue === 'o') {
            const node = board.querySelector(`[data-row='${row}'][data-col='${col}']`);

            const p = document.createElement('p');
            p.classList.add('move-miss');
            p.textContent = '•';
            node.appendChild(p);
        }
    };

    const generateBoard = (element) => {
        let charIndx = 65;
        let indx = 1;

        for (let i = -1; i < 10; i++) {
            for (let j = -1; j < 10; j++) {
                const div = document.createElement('div');
                div.classList.add('board-cell');
                div.dataset.row = i;
                div.dataset.col = j;

                if (i === -1 && j === -1) {
                    div.classList.add('no-border');
                    element.appendChild(div);
                    continue;
                }
                else if (i === -1) {
                    div.classList.add('no-border');
                    const pChar = document.createElement('p');
                    pChar.textContent = String.fromCharCode(charIndx);
                    pChar.classList.add('board-label');
                    charIndx++;

                    div.appendChild(pChar);
                    element.appendChild(div);

                    continue;
                }
                else if (j === -1) {
                    div.classList.add('no-border');
                    const pNum = document.createElement('p');
                    pNum.textContent = indx;
                    pNum.classList.add('board-label')
                    indx++;

                    div.appendChild(pNum);
                    element.appendChild(div);

                    continue;
                }

                element.appendChild(div);
            }
        }
    };

    return { renderBoards, renderShips, renderPlayerMove };
})();

const renderBoards = () => render.renderBoards();
const renderShips = (playerBoard) => render.renderShips(playerBoard);
const renderPlayerMove = (cellValue, row, col) => render.renderPlayerMove(cellValue, row, col);

export { renderBoards, renderShips, renderPlayerMove };