
export const region = (() => {

    /**
     * Enum for Movement Options
     */
    class Region {
        #region;
        static River() {return new Region("River");}
        static Forest() {return new Region("Forest");}
        static Mountain() {return new Region("Mountain");}
        static Joker() {return new Region("Joker");}

        /**
         * Use static function constructor instead of default constructor!
         * @param {string} region 
         */
        constructor(region){
            this.#region = region;
        }

        /**
         * 
         * @param {Region} region 
         * @returns {bool}
         */
        equals(region){
            return (this.toIdentifier() == region.toIdentifier());
        }

        /**
         * 
         * @returns {string}
         */
        toIdentifier(){
            return this.#region;
        }

    }

    return {
        Region : Region
    }
})();