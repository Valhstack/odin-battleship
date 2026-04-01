export class Ship {
    #length; #isSunk = false; #hits = 0;

    constructor(length) {
        if (length < 1 || length > 5) {
            throw new Error('Invalid input: length should be greater than 1 and less than 5');
        }

        this.#length = length;
    }

    hit() {
        if (this.#hits >= this.#length) {
            this.#isSunk = true;
            return 'The ship has sunk. No more hits available';
        }
        else {
            this.#hits++;
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