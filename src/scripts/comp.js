const comp = (function () {
    const moves = [];

    const move = (playerBoard) => {
        let attackResult;

        if (moves.length === 0) {
            let row = Math.floor(Math.random() * 10);
            let col = Math.floor(Math.random() * 10);

            while (moves.includes([row, col])) {
                row = Math.floor(Math.random() * 10);
                col = Math.floor(Math.random() * 10);
            }
            attackResult = playerBoard.receiveAttack(row, col);
            moves.push([row, col, attackResult]);
        }
        else {
            let lastHitMove = getLastHitMove();

            let lastRow = lastHitMove.move[0], lastCol = lastHitMove.move[1], lastResult = lastHitMove.move[2];

            while (attackResult !== 'miss') {
                // some changes here
            }
        }

        console.log(row, ' ', col, ' ', attackResult);

        return { row, col, result: attackResult };
    };

    const getLastHitMove = () => {
        for (let i = moves.length - 1; i > 0; i--) {
            if (moves[i][2] === 'hit') {
                return { move: moves[i], index: i };
            }
        }
    }

    const generateAdjacentMove = (row, col) => {

    }

    return { move };
})();

export { comp };