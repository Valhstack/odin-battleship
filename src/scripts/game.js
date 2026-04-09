import { renderBoards, renderShips, renderMove, renderShipsOutline, renderPlayerShipSunk, renderNames, renderTurn, renderResults } from "./render.js";
import { Player } from "./player.js";
import { comp } from './comp.js';
import { generateShipsPlacement } from "./helpers.js";

let userPlayer, compPlayer, isPlayerTurn = true;

const game = (function () {
    const start = (playerName, compName) => {
        userPlayer = new Player(playerName);
        compPlayer = new Player(compName);

        renderBoards();
        renderNames(userPlayer.name, compPlayer.name);

        const boardPlayer = userPlayer.board;
        /*
        boardPlayer.placeShip(shipCoords(7, 0, 7, 1)); // length: 2; A8 - B8
        boardPlayer.placeShip(shipCoords(0, 1, 3, 1)); // length: 4; B1 - B4
        boardPlayer.placeShip(shipCoords(9, 2, 9, 2)); // length: 1; C10
        boardPlayer.placeShip(shipCoords(0, 3, 0, 5)); // length: 3; D1 - F1
        boardPlayer.placeShip(shipCoords(4, 3, 4, 3)); // length: 1; D5
        boardPlayer.placeShip(shipCoords(8, 5, 8, 6)); // length: 2; F9 - G9
        boardPlayer.placeShip(shipCoords(4, 6, 6, 6)); // length: 3; G5 - G7
        boardPlayer.placeShip(shipCoords(1, 7, 1, 7)); // length: 1; H7
        boardPlayer.placeShip(shipCoords(0, 9, 1, 9)); // length: 2; J1 - J2
        boardPlayer.placeShip(shipCoords(5, 9, 5, 9)); // length: 1; J6
        */

        generateShipsPlacement(boardPlayer);

        const boardComp = compPlayer.board;
        /*
        boardComp.placeShip(shipCoords(7, 0, 7, 1)); // length: 2; A8 - B8
        boardComp.placeShip(shipCoords(0, 1, 3, 1)); // length: 4; B1 - B4
        boardComp.placeShip(shipCoords(9, 2, 9, 2)); // length: 1; C10
        boardComp.placeShip(shipCoords(0, 3, 0, 5)); // length: 3; D1 - F1
        boardComp.placeShip(shipCoords(4, 3, 4, 3)); // length: 1; D5
        boardComp.placeShip(shipCoords(8, 5, 8, 6)); // length: 2; F9 - G9
        boardComp.placeShip(shipCoords(4, 6, 6, 6)); // length: 3; G5 - G7
        boardComp.placeShip(shipCoords(1, 7, 1, 7)); // length: 1; H7
        boardComp.placeShip(shipCoords(0, 9, 1, 9)); // length: 2; J1 - J2
        boardComp.placeShip(shipCoords(5, 9, 5, 9)); // length: 1; J6
        */

        generateShipsPlacement(boardComp);
        renderShips(boardPlayer);
    };

    const move = async (row, col) => {
        const compBoardBefore = compPlayer.board.getBoard().map(row => [...row]);

        try {
            const attackResult = compPlayer.board.receiveAttack(row, col);
            const compBoardAfter = compPlayer.board.getBoard();

            if (attackResult === 'hit' || attackResult === 'miss') {
                renderMove('enemy-board', compBoardAfter[row][col], row, col);
            }
            else {
                for (let i = 0; i < 10; i++) {
                    for (let j = 0; j < 10; j++) {
                        if (compBoardBefore[i][j] !== compBoardAfter[i][j]) {
                            renderMove('enemy-board', compBoardAfter[i][j], i, j);
                        }
                    }
                }

                renderShipsOutline(compPlayer.board);

                if (!compPlayer.board.areShipsLeft()) {
                    renderResults('user');
                }
            }

            if (attackResult === 'miss') {
                renderTurn('comp');
                await runCompTurn();
                renderTurn('user');

                if (!userPlayer.board.areShipsLeft()) {
                    renderResults('comp');
                }

            }
        }
        catch (e) {
            //show dialog that can't make this move
        }

        // add check if the game is finished;
    };

    const sleep = (ms) => new Promise(res => setTimeout(res, ms));

    const runCompTurn = async () => {
        let result;

        await sleep(1000 + Math.random() * 500);

        do {
            const playerBoardBefore = userPlayer.board.getBoard().map(row => [...row]);
            const compMoveResult = comp.move(userPlayer.board);
            const playerBoardAfter = userPlayer.board.getBoard();

            if (compMoveResult.result === 'hit' || compMoveResult.result === 'miss') {
                renderMove(
                    'player-board',
                    playerBoardAfter[compMoveResult.row][compMoveResult.col],
                    compMoveResult.row,
                    compMoveResult.col
                );
            } else {
                for (let i = 0; i < 10; i++) {
                    for (let j = 0; j < 10; j++) {
                        if (playerBoardBefore[i][j] !== playerBoardAfter[i][j]) {
                            renderMove('player-board', playerBoardAfter[i][j], i, j);
                        }
                    }
                }

                renderPlayerShipSunk(userPlayer.board);
            }

            result = compMoveResult.result;

            if (result === 'hit' || result === 'sunk') {
                await sleep(1000 + Math.random() * 500);
            }

        } while (result === 'hit' || result === 'sunk');
    };

    return { start, move };
})();

export { game, userPlayer };