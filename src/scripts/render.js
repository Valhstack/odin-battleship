const render = (function () {
    const renderBoards = () => {
        document.getElementById('start-screen').classList.add('inactive');
        document.getElementById('boards-screen').classList.remove('inactive');

        const playerBoard = document.getElementById('player-board');
        const enemyBoard = document.getElementById('enemy-board');

        generateBoard(playerBoard);
        generateBoard(enemyBoard);
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
                }
                else if (j === -1) {
                    div.classList.add('no-border');
                    const pNum = document.createElement('p');
                    pNum.textContent = indx;
                    pNum.classList.add('board-label')
                    indx++;

                    div.appendChild(pNum);
                }

                element.appendChild(div);
            }
        }
    }

    return { renderBoards };
})();

const renderBoards = () => render.renderBoards();

export { renderBoards };