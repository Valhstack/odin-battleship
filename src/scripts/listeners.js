import { generatePlayerName, generateShipsPlacement, processAttack } from "./helpers.js";
import { Player } from "./player.js";
import { game, userPlayer, enemyPlayer } from "./game.js";
import { renderBoards, renderShips, renderMove, renderShipsOutline, renderPlayerShipSunk, renderNames, renderTurn, renderResults, reset, disableCells, enableCells } from "./render.js";
import { comp } from './comp.js';
import { shipCoords } from "./ship.js";
import { Peer } from 'peerjs';
import { TURN_USERNAME, TURN_CREDENTIALS } from "../config.js";

const cards = document.getElementsByClassName('card');
const startGameBtns = document.getElementsByClassName('start-game-btn');
let elemIndex;
let hostId, userReady, enemyReady, connection, peerId;

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
                playerName = input.value !== '' ? input.value : generatePlayerName();

                game.setMode('vsComp');

                let user, compUser;

                playerName = input.value !== '' ? input.value : generatePlayerName();
                if (!userPlayer?.name || !enemyPlayer?.name) {
                    user = new Player(playerName);
                    compUser = new Player(generatePlayerName());
                }

                game.start(user, compUser);
            }
            else if (elemID === 'start-game-online-btn') {
                const input = document.getElementById('player-name-online');

                document.getElementById('connection-form-dialog').showModal();

                const peer = new Peer({
                    config: {
                        iceServers: [
                            {
                                urls: "stun:stun.relay.metered.ca:80",
                            },
                            {
                                urls: "turn:global.relay.metered.ca:80",
                                username: TURN_USERNAME,
                                credential: TURN_CREDENTIALS,
                            },
                            {
                                urls: "turn:global.relay.metered.ca:443",
                                username: TURN_USERNAME,
                                credential: TURN_CREDENTIALS,
                            }
                        ]
                    }
                });

                peer.on("connection", (conn) => {
                    connection = conn;
                    setupConnection(conn);
                });

                peer.on("open", (id) => {
                    peerId = id;
                });


                document.getElementById('start-connection-btn').addEventListener('click', () => {
                    document.getElementById('host-player-id').classList.remove('inactive');
                    document.getElementById('connection-wrapper').classList.add('inactive');
                    document.getElementById('host-player-id').textContent = 'Share this ID with the friend to connect: ' + peerId;
                    hostId = peerId;
                });

                document.getElementById('connect-to-friend-btn').addEventListener('click', () => {
                    document.getElementById('connection-form-wrapper').classList.add('inactive');
                    document.getElementById('connect-to-friend-form-wrapper').classList.remove('inactive');
                });

                document.getElementById('set-connection-btn').addEventListener('click', (e) => {
                    e.preventDefault();

                    const form = document.getElementById('connect-to-friend-form');
                    const formData = new FormData(form);

                    const friendId = formData.get("friend-id");

                    if (!friendId) {
                        return;
                    }

                    hostId = friendId;
                    form.reset();

                    const conn = peer.connect(friendId);
                    connection = conn;

                    setupConnection(conn);
                });

                let player;

                function setupConnection(conn) {
                    conn.on("open", () => {
                        playerName = input.value !== '' ? input.value : generatePlayerName();
                        player = new Player(playerName, peer.id);

                        conn.send({
                            type: 'enemy',
                            enemy: {
                                name: player.name,
                                peerId: player.getPeerId()
                            }
                        });
                    });

                    document.getElementById('is-ready-button').addEventListener('click', (e) => {
                        userReady = true;
                        document.getElementById('is-ready-button').classList.add('inactive');
                        document.getElementById('is-ready-text').textContent = 'Waiting for your oponent';

                        if (userReady && enemyReady) {
                            document.getElementById('is-player-ready-dialog').classList.add('inactive');
                            document.getElementById('is-ready-button').classList.remove('inactive');
                            document.getElementById('is-ready-text').textContent = 'Are you ready?';
                        }

                        conn.send({
                            type: 'ready',
                            isReady: true
                        })
                    });

                    conn.on("data", (data) => {
                        if (data.type === 'enemy') {
                            const enemy = new Player(data.enemy.name, data.enemy.peerId);

                            document.getElementById('connection-form-dialog').close();
                            game.setMode('vsFriend');
                            game.start(player, enemy, conn, hostId);
                        }

                        if (data.type === 'ready') {
                            enemyReady = data.isReady;

                            if (userReady && enemyReady) {
                                document.getElementById('is-player-ready-dialog').classList.add('inactive');
                                document.getElementById('is-ready-button').classList.remove('inactive');
                                document.getElementById('is-ready-text').textContent = 'Are you ready?';
                            }
                        }

                        if (data.type === 'turn') {
                            if (!data.isTurn) {
                                disableCells();
                            }
                            else {
                                renderTurn('user');
                                enableCells();
                            }
                        }

                        if (data.type === 'move') {
                            const playerBoardBefore = userPlayer.board.getBoard().map(row => [...row]);
                            const attackResult = userPlayer.board.receiveAttack(data.position.row, data.position.col);
                            const playerBoardAfter = userPlayer.board.getBoard();

                            processAttack(userPlayer.board.getShips(), attackResult, 'player-board', playerBoardBefore, playerBoardAfter, data.position.row, data.position.col, true);

                            if (!userPlayer.board.areShipsLeft()) {
                                renderResults('enemy');
                                enemyPlayer.addWin();
                            }

                            conn.send({
                                type: 'result',
                                position: {
                                    row: data.position.row,
                                    col: data.position.col
                                },
                                result: attackResult,
                                boardBefore: playerBoardBefore,
                                boardAfter: playerBoardAfter,
                                ships: userPlayer.board.getShips(),
                                areShipsLeft: userPlayer.board.areShipsLeft()
                            })
                        }

                        if (data.type === 'result') {
                            const playerBoardBefore = data.boardBefore;
                            const attackResult = data.result;
                            const playerBoardAfter = data.boardAfter;

                            processAttack(data.ships, attackResult, 'enemy-board', playerBoardBefore, playerBoardAfter, data.position.row, data.position.col, false);

                            if (!data.areShipsLeft) {
                                renderResults('user');
                                userPlayer.addWin();
                            }

                            if (attackResult === 'miss') {
                                disableCells();
                                renderTurn('enemy');
                                conn.send({
                                    type: 'turn',
                                    isTurn: true
                                })
                            }
                        }
                    });

                    conn.on("close", () => {
                        document.getElementById('exit-btn').click();

                        if (conn.peer !== peerId) {
                            document.getElementById('connection-closed-dialog').showModal();
                        }
                    });

                    conn.on("error", (err) => {
                        console.error("Connection error:", err);
                    });
                }

                peer.on("error", (err) => {
                    console.error("Peer error:", err);
                });
            }
        })
    }

    document.getElementById('ok-button').addEventListener('click', () => {
        document.getElementById('connection-closed-dialog').close();
    });

    document.getElementById('generate-ships-placement-btn').addEventListener('click', () => {
        userPlayer.board.resetBoard();
        reset('player-board', '.ship-piece');

        generateShipsPlacement(userPlayer.board);
        renderShips(userPlayer.board);
    });

    document.getElementById('play-again-btn').addEventListener('click', () => {
        userPlayer.board.resetBoard();
        enemyPlayer.board.resetBoard();
        comp.reset();

        document.getElementById('winner-announcement').close();

        reset('player-board', '.board-cell');
        reset('enemy-board', '.board-cell');

        userReady = false;
        enemyReady = false;

        if (game.getMode() === 'vsFriend') {
            game.start(userPlayer, enemyPlayer, connection, hostId);
        }
        else {
            game.start(userPlayer, enemyPlayer);
        }

        // add notification that player suggests re-match
    });

    document.getElementById('exit-btn').addEventListener('click', () => {
        userPlayer.board.resetBoard();
        enemyPlayer.board.resetBoard();
        comp.reset();

        document.getElementById('winner-announcement').close();

        reset('player-board', '.board-cell');
        reset('enemy-board', '.board-cell');

        document.getElementById('boards-screen').classList.add('inactive');

        userPlayer.name = undefined;
        enemyPlayer.name = undefined;

        document.getElementById('start-screen').classList.remove('inactive');

        if (game.getMode() === 'vsFriend') {
            connection.close();
        }
    });

    document.getElementById('drag-and-drop-ships-btn').addEventListener('click', () => {
        userPlayer.board.resetBoard();
        reset('player-board', '.ship-piece');

        document.getElementById('drag-and-drop-ships-wrapper').classList.remove('inactive');
        document.getElementById('drag-and-drop-ships-wrapper').classList.remove('resize');
        renderShipsDragAndDrop();

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

        document.getElementById('drag-and-drop-ships-wrapper').classList.add('resize');
    });
}

export { listeners, attachListeners, cellHandler }