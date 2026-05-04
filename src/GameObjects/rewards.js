export const rewards = (()=> {

    class Reward {
        #id;
        #amount;

        /**
         * 
         * @returns {Reward}
         */
        static GetOneGold() {
            return new Reward("Gold", 1)
        }

        /**
         * Use static function constructor instead of default constructor!
         * @param {string} id 
         * @param {int} amount
         */
        constructor(id, amount) {
            this.#id = id;
            this.#amount = amount;
        }

        /**
         * 
         * @returns {string}
         */
        getIdentifier() {
            return this.#id;
        }

        /**
         * @returns {int}
         */
        get amount() {
            return this.#amount;
        }
    }

    return {
        Reward : Reward
    }

}) ();