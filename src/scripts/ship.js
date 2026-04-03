class Ship {
    #length; #isSunk = false; #hits = 0;

    constructor(position) {
        this.position = position;

        if (position.rowStart === position.rowFinish && position.colStart === position.colFinish) {
            this.#length = 1;
        } else if (position.rowStart === position.rowFinish) {
            this.#length = position.colFinish - position.colStart + 1;
        } else {
            this.#length = position.rowFinish - position.rowStart + 1;
        }
    }

    hit() {
        if (this.#isSunk) {
            throw new Error ('The ship has already sunk');
        }

        this.#hits++;

        if (this.#hits >= this.#length) {
            this.#isSunk = true;
        }
    }

    hits() {
        return this.#hits;
    }

    length() {
        return this.#length;
    }

    isSunk() {
        return this.#isSunk;
    }
}

const shipCoords = (x1, y1, x2, y2) => {
    return {
        rowStart: x1,
        colStart: y1,
        rowFinish: x2,
        colFinish: y2
    };
};

export { Ship, shipCoords }