const comp = (function () {
    const moves = [];
    let targetQueue = [];
    let lockedDirection = null;

    const directions = [
        [1, 0], [-1, 0], [0, 1], [0, -1]
    ];

    const move = (playerBoard) => {
        let row, col;

        do {
            if (targetQueue.length > 0) {
                [row, col] = targetQueue.shift();
            } else {
                row = Math.floor(Math.random() * 10);
                col = Math.floor(Math.random() * 10);
            }
        } while (moves.some(m => m[0] === row && m[1] === col) || playerBoard.getBoard()[row][col] === 'o');

        const attackResult = playerBoard.receiveAttack(row, col);
        moves.push([row, col, attackResult]);

        if (attackResult === 'hit') {
            const lastHits = moves.filter(m => m[2] === 'hit');

            if (lastHits.length >= 2) {
                const [r1, c1] = lastHits[lastHits.length - 1];
                const [r2, c2] = lastHits[lastHits.length - 2];

                if (r1 === r2) {
                    lockedDirection = 'horizontal';
                } else if (c1 === c2) {
                    lockedDirection = 'vertical';
                }
            }

            directions.forEach(([dr, dc]) => {
                if (lockedDirection === 'horizontal' && dr !== 0) return;
                if (lockedDirection === 'vertical' && dc !== 0) return;

                const newRow = row + dr;
                const newCol = col + dc;

                const alreadyPlayed = moves.some(
                    m => m[0] === newRow && m[1] === newCol
                );

                const alreadyQueued = targetQueue.some(
                    q => q[0] === newRow && q[1] === newCol
                );

                if (
                    newRow >= 0 && newRow < 10 &&
                    newCol >= 0 && newCol < 10 &&
                    !alreadyPlayed &&
                    !alreadyQueued
                ) {
                    targetQueue.push([newRow, newCol]);
                }
            });

            if (lockedDirection) {
                targetQueue = targetQueue.filter(([r, c]) => {
                    if (lockedDirection === 'horizontal') return r === row;
                    if (lockedDirection === 'vertical') return c === col;
                });
            }
        }

        if (attackResult === 'sunk') {
            targetQueue = [];
            lockedDirection = null;
        }

        return { row, col, result: attackResult };
    };

    return { move };
})();

export { comp };