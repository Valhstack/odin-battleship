import { getShipEndpoint } from "./helpers.js";
import { attachListeners, cellHandler } from "./listeners.js";

const render = (function () {
    const renderBoards = () => {
        document.getElementById('start-screen').classList.add('inactive');
        document.getElementById('boards-screen').classList.remove('inactive');

        const playerBoard = document.getElementById('player-board');
        const enemyBoard = document.getElementById('enemy-board');

        generateBoard(playerBoard);
        generateBoard(enemyBoard);
        attachListeners(enemyBoard.childNodes, cellHandler);
    };

    const renderShips = (playerBoard) => {
        const board = document.getElementById('player-board');

        const boardValues = playerBoard.getBoard();
        const ships = playerBoard.getShips();

        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                if (boardValues[i][j] === '1') {
                    const node = board.querySelector(`[data-row='${i}'][data-col='${j}']`);

                    const div = document.createElement('div');
                    div.classList.add('ship-piece');

                    const shipEndpoint = getShipEndpoint(ships, i, j);
                    if (shipEndpoint !== null) {
                        div.classList.add(`ship-piece-${shipEndpoint.type}-${shipEndpoint.orientation}`);
                    }

                    node.appendChild(div);
                }
            }
        }
    };

    const renderShipsEnemy = (enemyBoard) => {
        const board = document.getElementById('enemy-board');

        const boardValues = enemyBoard.getBoard();
        const ships = enemyBoard.getShips();

        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                if (boardValues[i][j] === 'X') {
                    const node = board.querySelector(`[data-row='${i}'][data-col='${j}']`);
                    const existing = node.querySelector('.ship-piece-sunk');

                    if (!existing) {
                        const div = document.createElement('div');
                        div.classList.add('ship-piece-sunk');

                        const shipEndpoint = getShipEndpoint(ships, i, j);
                        if (shipEndpoint !== null) {
                            div.classList.add(`ship-piece-sunk-${shipEndpoint.type}-${shipEndpoint.orientation}`);
                        }

                        node.appendChild(div);
                    }
                }
            }
        }
    };

    const renderShipsPlayer = (playerBoard) => {
        const board = document.getElementById('player-board');

        const boardValues = playerBoard.getBoard();
        const ships = playerBoard.getShips();

        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                if (boardValues[i][j] === 'X') {
                    const node = board.querySelector(`[data-row='${i}'][data-col='${j}']`);
                    const existing = node.querySelector('.ship-piece-sunk');
                    const children = node.childNodes;

                    if (!existing) {

                        for (let child of children) {
                            if (child.classList.contains('ship-piece')) {
                                child.classList.remove('ship-piece');
                                child.classList.add('ship-piece-sunk');

                                const shipEndpoint = getShipEndpoint(ships, i, j);
                                if (shipEndpoint !== null) {
                                    child.classList.remove(`ship-piece-${shipEndpoint.type}-${shipEndpoint.orientation}`);
                                    child.classList.add(`ship-piece-sunk-${shipEndpoint.type}-${shipEndpoint.orientation}`);
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    const renderMove = (boardName, cellValue, row, col) => {
        const board = document.getElementById(boardName);

        if (cellValue === 'x' || cellValue === 'X') {
            const node = board.querySelector(`[data-row='${row}'][data-col='${col}']`);

            const div = document.createElement('div');
            div.classList.add('move-hit');

            node.appendChild(div);
        }
        else if (cellValue === 'o') {
            const node = board.querySelector(`[data-row='${row}'][data-col='${col}']`);

            const div = document.createElement('div');
            div.classList.add('move-miss');

            node.appendChild(div);
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

    return { renderBoards, renderShips, renderMove, renderShipsEnemy, renderShipsPlayer };
})();

const renderBoards = () => render.renderBoards();
const renderShips = (playerBoard) => render.renderShips(playerBoard);
const renderMove = (boardName, cellValue, row, col) => render.renderMove(boardName, cellValue, row, col);
const renderShipsOutline = (enemyBoard) => render.renderShipsEnemy(enemyBoard);
const renderPlayerShipSunk = (playerBoard) => render.renderShipsPlayer(playerBoard);

export { renderBoards, renderShips, renderMove, renderShipsOutline, renderPlayerShipSunk };