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
         * An enum to deternime color options of cards
         * Use static function constructor instead of default constructor!
         * @param {string} color 
         */
        constructor(color){
            this.#color = color;
        }

        /**
         * Checks equality
         * @param {Color} color 
         * @returns {bool}
         */
        equals(color){
            return (this.toIdentifier() == color.toIdentifier());
        }

        /**
         * Get identifier of enum
         * @returns {string}
         */
        toIdentifier(){
            return this.#color;
        }
    }


    class CardEffect {
        /**
         * A function to create a CardEffect object
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
        CardEffect : CardEffect
    }
})();