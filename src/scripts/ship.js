class Ship {
    #length; #isSunk = false; #hits = 0;

    constructor(length) {
        if (length < 1 || length > 5) {
            throw new Error('Invalid input: length should be greater than 1 and less than 5');
        }

        this.#length = length;
    }

    hit() {
        if (this.#isSunk) {
            return 'The ship has already sunk';
        }

        this.#hits++;

        if (this.#hits >= this.#length) {
            this.#isSunk = true;
            return 'The ship has sunk';
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