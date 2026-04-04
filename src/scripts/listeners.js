import { generatePlayerName } from "./helpers.js";
import { Player } from "./player.js";

const cards = document.getElementsByClassName('card');
const startGameBtns = document.getElementsByClassName('start-game-btn');

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
                const userPlayer = new Player(playerName);
                const compPlayer = new Player(generatePlayerName());
            }
            else if (elemID === 'start-game-online-btn') {
                const input = document.getElementById('player-name-online');
                playerName = input === '' ? input.value : generatePlayerName();
                const userPlayer = new Player(playerName);
            }
        })
    }
}

export { listeners }