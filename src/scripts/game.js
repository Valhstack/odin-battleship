import { renderBoards, renderShips, renderMove, renderShipsOutline, renderPlayerShipSunk, renderNames, renderTurn, renderResults } from "./render.js";
import { Player } from "./player.js";
import { comp } from './comp.js';
import { generateShipsPlacement } from "./helpers.js";

let userPlayer, enemyPlayer;

const game = (function () {
    let mode, connection, turn;

    const start = (player, enemy, conn) => {
        if (mode === 'vsComp') {
            userPlayer = player;
            enemyPlayer = enemy;

            renderBoards();
            renderNames(userPlayer.name, enemyPlayer.name);

            const boardPlayer = userPlayer.board;
            console.log(boardPlayer);
            generateShipsPlacement(boardPlayer);

            const boardComp = enemyPlayer.board;
            generateShipsPlacement(boardComp);
            renderShips(boardPlayer);
        }

        if (mode === 'vsFriend') {
            userPlayer = player;
            enemyPlayer = enemy;

            renderBoards();
            renderNames(userPlayer.name, enemyPlayer.name);

            const boardPlayer = userPlayer.board;
            generateShipsPlacement(boardPlayer);
            renderShips(boardPlayer);
            console.log(boardPlayer);

            connection = conn;
        }

        console.log('Player 1: ', userPlayer, ' Enemy: ', enemyPlayer);
    };

    const setMode = (currentMode) => {
        mode = currentMode;
    }

    const move = async (row, col) => {
        const enemyBoardBefore = enemyPlayer.board.getBoard().map(row => [...row]);

        try {
            if (mode === 'vsFriend') {
                connection.send({
                    type: 'move',
                    position: {
                        row,
                        col
                    }
                });

                return;
            }

            const attackResult = enemyPlayer.board.receiveAttack(row, col);
            const enemyBoardAfter = enemyPlayer.board.getBoard();

            if (attackResult === 'hit' || attackResult === 'miss') {
                renderMove('enemy-board', enemyBoardAfter[row][col], row, col);
            }
            else {
                for (let i = 0; i < 10; i++) {
                    for (let j = 0; j < 10; j++) {
                        if (enemyBoardBefore[i][j] !== enemyBoardAfter[i][j]) {
                            renderMove('enemy-board', enemyBoardAfter[i][j], i, j);
                        }
                    }
                }

                renderShipsOutline(enemyPlayer.board.getBoard(), enemyPlayer.board.getShips());

                if (!enemyPlayer.board.areShipsLeft()) {
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
                    enemyPlayer.addWin();
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

                renderPlayerShipSunk(playerBoardAfter, userPlayer.board.getShips());
            }

            result = compMoveResult.result;

            if (result === 'hit' || result === 'sunk') {
                await sleep(1000 + Math.random() * 500);
            }

        } while (result === 'hit' || result === 'sunk');
    };

    return { start, move, setMode, turn, connection };
})();

export { game, userPlayer, enemyPlayer };