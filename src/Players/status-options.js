export const status_options = (() => {

    /**
     * Enum for Timing Options
     */
    class Timing {
        #timing;
        static InCombat(){ return new Timing("In combat");}
        static EndOfTurn(){ return new Timing("End of turn");}

        /**
         * An enum to deternime timing options of stati
         * @param {string} color 
         */
        constructor(timing){
            this.#timing = timing;
        }

        /**
         * Checks equality
         * @param {Timing} timing 
         * @returns {bool}
         */
        equals(timing){
            return (this.toIdentifier() == timing.toIdentifier());
        }

        /**
         * Get identifier of enum
         * @returns {string}
         */
        toIdentifier(){
            return this.#timing;
        }
    }
    
    return {
        Timing : Timing
    }
})();