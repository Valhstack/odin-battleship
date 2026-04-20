import { renderBoards, renderShips, renderMove, renderShipsOutline, renderPlayerShipSunk, renderNames, renderTurn, renderResults } from "./render.js";
import { Player } from "./player.js";
import { comp } from './comp.js';
import { generateShipsPlacement } from "./helpers.js";

let userPlayer, compPlayer;

const game = (function () {
    let mode;

    const start = (player, enemy, conn) => {
        if (mode === 'vsComp') {
            userPlayer = player;
            compPlayer = enemy;

            renderBoards();
            renderNames(userPlayer.name, compPlayer.name);

            const boardPlayer = userPlayer.board;
            console.log(boardPlayer);
            generateShipsPlacement(boardPlayer);

            const boardComp = compPlayer.board;
            generateShipsPlacement(boardComp);
            renderShips(boardPlayer);
        }

        if (mode === 'vsFriend') {
            userPlayer = player;
            compPlayer = enemy;

            renderBoards();
            renderNames(userPlayer.name, compPlayer.name);

            const boardPlayer = userPlayer.board;
            generateShipsPlacement(boardPlayer);
            renderShips(boardPlayer);
            console.log(boardPlayer);
        }
    };

    const setMode = (currentMode) => {
        mode = currentMode;
    }

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
                    userPlayer.addWin();
                }
            }

            if (attackResult === 'miss') {
                renderTurn('comp');
                await runCompTurn();
                renderTurn('user');

                if (!userPlayer.board.areShipsLeft()) {
                    renderResults('comp');
                    compPlayer.addWin();
                }
            }
        }
        catch (e) { }
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

    return { start, move, setMode };
})();

export { game, userPlayer, compPlayer };