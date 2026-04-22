export const card_options = (() => {

    /**
     * Enum for Color Options
     */
    class Color {
        #color;
        static Blue(){ return new Color("Blue");}
        static Yellow(){ return new Color("Yellow");}
        static Red(){ return new Color("Red");}
        static Purple(){ return new Color("Purple");}
        static Green(){ return new Color("Green");}

        /**
         * Use static function constructor instead of default constructor!
         * @param {string} color 
         */
        constructor(color){
            this.#color = color;
        }

        /**
         * 
         * @param {Color} color 
         * @returns {bool}
         */
        equals(color){
            return Object.equlas(this.toIdentifier(), color.toIdentifier());
        }

        /**
         * 
         * @returns {string}
         */
        toIdentifier(){
            return this.#color;
        }
    }

    /**
     * Enum for Movement Options
     */
    class Region {
        #region;
        static River() {return new Region("River");}
        static Forest() {return new Region("Forest");}
        static Mountain() {return new Region("Mountain");}

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
            return Object.equlas(this.toIdentifier(), region.toIdentifier());
        }

        /**
         * 
         * @returns {string}
         */
        toIdentifier(){
            return this.#region;
        }

    }

    class CardEffect {
        /**
         * 
         * @param {int} damage 
         * @param {int} shield 
         * @param {int} drawModifier 
         * @param {bool} backtohand 
         * @param {bool} gettopdiscard 
         * @returns {object}
         */
        static createCardEffect(damage, shield, drawModifier, backtohand, gettopdiscard) {
            return {
                damage: damage,
                shield: shield,
                drawModifier: drawModifier,
                backtohand: backtohand,
                gettopdiscard: gettopdiscard,
            }
        }
    }

    return {
        Color : Color,
        Region : Region,
        CardEffect : CardEffect
    }
})();