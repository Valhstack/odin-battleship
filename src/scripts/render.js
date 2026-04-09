import { getShipEndpoint } from "./helpers.js";
import { attachListeners, cellHandler } from "./listeners.js";
import { VICTORY_MESSAGES, DEFEAT_MESSAGES } from "./resultMessages.js";

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

    const renderNames = (userName, compName) => {
        const h3UserName = document.getElementById('user-name-text');
        h3UserName.textContent = userName;

        const h3CompName = document.getElementById('comp-name-text');
        h3CompName.textContent = compName;
    };

    const renderTurn = (player) => {
        const user = document.getElementById('user-turn');
        const comp = document.getElementById('comp-turn');

        if (player === 'user') {
            user.textContent = 'YOUR TURN';
            comp.textContent = 'WAITING';

            user.classList.add('active-turn');
            user.classList.remove('inactive-turn');
            comp.classList.add('inactive-turn');
            comp.classList.remove('active-turn');
        } else {
            user.textContent = 'WAITING';
            comp.textContent = 'YOUR TURN';

            user.classList.add('inactive-turn');
            user.classList.remove('active-turn');
            comp.classList.add('active-turn');
            comp.classList.remove('inactive-turn');
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

    const reset = (elem, className) => {
        const elems = document.getElementById(elem).querySelectorAll(className);

        elems.forEach(elem => elem.remove());
    };

    const renderResults = (winner) => {
        const h4Result = document.getElementById('result');
        const pResultSubtext = document.getElementById('result-subtext');

        if (winner === 'user') {
            h4Result.classList.add('victory');
            pResultSubtext.classList.add('victory');

            h4Result.textContent = 'VICTORY';
            pResultSubtext.textContent = VICTORY_MESSAGES[Math.floor(Math.random() * VICTORY_MESSAGES.length)];
        }
        else {
            h4Result.classList.add('defeat');
            pResultSubtext.classList.add('defeat');

            h4Result.textContent = 'DEFEAT';
            pResultSubtext.textContent = DEFEAT_MESSAGES[Math.floor(Math.random() * DEFEAT_MESSAGES.length)];
        }

        const dialog = document.getElementById('winner-announcement');

        dialog.showModal();
    };

    return { renderBoards, renderShips, renderMove, renderShipsEnemy, renderShipsPlayer, renderNames, renderTurn, reset, renderResults };
})();

const renderBoards = () => render.renderBoards();
const renderNames = (playerName, compName) => render.renderNames(playerName, compName);
const renderShips = (playerBoard) => render.renderShips(playerBoard);
const renderMove = (boardName, cellValue, row, col) => render.renderMove(boardName, cellValue, row, col);
const renderShipsOutline = (enemyBoard) => render.renderShipsEnemy(enemyBoard);
const renderPlayerShipSunk = (playerBoard) => render.renderShipsPlayer(playerBoard);
const renderTurn = (player) => render.renderTurn(player);
const reset = (elem, className) => render.reset(elem, className);
const renderResults = (winner) => render.renderResults(winner);

export { renderBoards, renderShips, renderMove, renderShipsOutline, renderPlayerShipSunk, renderNames, renderTurn, reset, renderResults };