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
        attachListeners(enemyBoard.childNodes, 'click', cellHandler);
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

    const renderShipsEnemy = (boardValues, ships) => {
        const board = document.getElementById('enemy-board');

        //const boardValues = enemyBoard.getBoard();
        //const ships = enemyBoard.getShips();

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

    const renderShipsPlayer = (boardValues, ships) => {
        const board = document.getElementById('player-board');

        /*const boardValues = playerBoard.getBoard();
        const ships = playerBoard.getShips();*/

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
        document.getElementById(elem)?.querySelectorAll(className).forEach(el => el.remove());
    };

    const renderResults = (winner) => {
        const h4Result = document.getElementById('result');
        const pResultSubtext = document.getElementById('result-subtext');

        if (winner === 'user') {
            h4Result.classList.remove('defeat');
            pResultSubtext.classList.remove('defeat');

            h4Result.classList.add('victory');
            pResultSubtext.classList.add('victory');

            h4Result.textContent = 'VICTORY';
            pResultSubtext.textContent = VICTORY_MESSAGES[Math.floor(Math.random() * VICTORY_MESSAGES.length)];
        }
        else {
            h4Result.classList.remove('victory');
            pResultSubtext.classList.remove('victory');

            h4Result.classList.add('defeat');
            pResultSubtext.classList.add('defeat');

            h4Result.textContent = 'DEFEAT';
            pResultSubtext.textContent = DEFEAT_MESSAGES[Math.floor(Math.random() * DEFEAT_MESSAGES.length)];
        }

        const dialog = document.getElementById('winner-announcement');

        dialog.showModal();
    };

    const renderDragAndDropShips = () => {
        const dragAndDropWrapper = document.getElementById('drag-and-drop-ships-wrapper');

        reset('drag-and-drop-ships-wrapper', '.ship');

        dragAndDropWrapper.appendChild(generateShipPieces(4, 1));
        dragAndDropWrapper.appendChild(generateShipPieces(3, 1));
        dragAndDropWrapper.appendChild(generateShipPieces(3, 2, 'inactive'));
        dragAndDropWrapper.appendChild(generateShipPieces(2, 1));
        dragAndDropWrapper.appendChild(generateShipPieces(2, 2, 'inactive'));
        dragAndDropWrapper.appendChild(generateShipPieces(2, 3, 'inactive'));
        dragAndDropWrapper.appendChild(generateShipPieces(1, 1));
        dragAndDropWrapper.appendChild(generateShipPieces(1, 2, 'inactive'));
        dragAndDropWrapper.appendChild(generateShipPieces(1, 3, 'inactive'));
        dragAndDropWrapper.appendChild(generateShipPieces(1, 4, 'inactive'));
    };

    const generateShipPieces = (length, index, extraClass) => {
        const divWrapper = document.createElement('div');
        divWrapper.classList.add('ship');
        divWrapper.classList.add(`ship-length-${length}`);
        if (extraClass !== undefined) {
            divWrapper.classList.add(extraClass);
        }
        divWrapper.id = `ship-length-${length}-${index}`;
        divWrapper.dataset.length = length;
        divWrapper.dataset.index = index;
        divWrapper.dataset.direction = 'horizontal';
        divWrapper.setAttribute('draggable', 'true');

        const divShipPieceStart = document.createElement('div');
        const divShipPieceFinish = document.createElement('div');
        const divShipMiddlePiece = document.createElement('div');

        divShipPieceStart.classList.add('ship-piece');
        divShipPieceStart.classList.add('ship-piece-start-horizontal');

        divShipMiddlePiece.classList.add('ship-piece');
        divShipMiddlePiece.classList.add('ship-piece-middle-horizontal');

        divShipPieceFinish.classList.add('ship-piece');
        divShipPieceFinish.classList.add('ship-piece-finish-horizontal');

        switch (length) {
            case 1:
                const divShipPiece = document.createElement('div');
                divShipPiece.classList.add('ship-piece');
                divShipPiece.classList.add('ship-piece-single-none');

                divWrapper.appendChild(divShipPiece);

                return divWrapper;
            case 2:
                divWrapper.appendChild(divShipPieceStart);
                divWrapper.appendChild(divShipPieceFinish);

                return divWrapper;
            case 3:
                divWrapper.appendChild(divShipPieceStart);
                divWrapper.appendChild(divShipMiddlePiece);
                divWrapper.appendChild(divShipPieceFinish);

                return divWrapper;
            case 4:
                const divShipPieceMiddle2 = divShipMiddlePiece.cloneNode(true);

                divWrapper.appendChild(divShipPieceStart);
                divWrapper.appendChild(divShipMiddlePiece);
                divWrapper.appendChild(divShipPieceMiddle2);
                divWrapper.appendChild(divShipPieceFinish);

                return divWrapper;
        }
    };

    return { renderBoards, renderShips, renderMove, renderShipsEnemy, renderShipsPlayer, renderNames, renderTurn, reset, renderResults, renderDragAndDropShips };
})();

const renderBoards = () => render.renderBoards();
const renderNames = (playerName, compName) => render.renderNames(playerName, compName);
const renderShips = (playerBoard) => render.renderShips(playerBoard);
const renderMove = (boardName, cellValue, row, col) => render.renderMove(boardName, cellValue, row, col);
const renderShipsOutline = (boardValues, ships) => render.renderShipsEnemy(boardValues, ships);
const renderPlayerShipSunk = (boardValues, ships) => render.renderShipsPlayer(boardValues, ships);
const renderTurn = (player) => render.renderTurn(player);
const reset = (elem, className) => render.reset(elem, className);
const renderResults = (winner) => render.renderResults(winner);
const renderShipsDragAndDrop = () => render.renderDragAndDropShips();

export { renderBoards, renderShips, renderMove, renderShipsOutline, renderPlayerShipSunk, renderNames, renderTurn, reset, renderResults, renderShipsDragAndDrop };