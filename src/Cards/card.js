import { card_options } from "./card-options";
import { region } from "../GameArea/region";

export const card = (() => {

    class Card {
        #name;
        #color;
        #combo;
        #effects;
        #nextCardCombo;
        #comboBonus;
        #region;
        #cost;

        /**
         * 
         * @param {string} name
         * @param {card_options.Color} color
         * @param {Map<card_colors.Color,card_options.CardEffect>} combo 
         * @param {card_options.CardEffect} effects 
         * @param {region.Region} region 
         * @param {int} cost
        */
        constructor(name, color, combo, effects, region, cost){
            this.#name = name;
            this.#color = color;
            this.#combo = combo;
            this.#effects = effects;
            this.#nextCardCombo = null;
            this.#comboBonus = null;
            this.#region = region;
            this.#cost = cost;
        }

        /**
         * @param {card_options.Color} colorNextCard
         * @returns {bool}
         */
        canCombo (colorNextCard) {
            for (const i in this.#combo.values()){
                if (i.equals(colorNextCard)){
                    return true;
                }
            }
            return false;
        }

        /**
         * 
         * @param {card.Card} card
         */
        addNextComboCard(card) {
            if (this.canCombo(card)) {
                this.#nextCardCombo = card;
                this.#nextCardCombo.addBonusComboEffect(this.#combo.get(this.#nextCardCombo.color));
            }
        }

        /**
         * 
         * @param {card_options.CardEffect} effect
         */
        addBonusComboEffect(effect) {
            this.#comboBonus = effect;
        }

        /**
         * 
         * @param {object} resolver - first call from outside with empty object {}
         * @returns {object} - Resolve object which contains the card, any effects and any bonus effect on combo
         */
        getEffect(resolver) {
            resolver.push = {
                card : this,
                effects : this.#effects,
                bonus: this.#comboBonus
            }
            this.addBonusComboEffect(null);

            if (this.#nextCardCombo != null) {
                resolver = this.#nextCardCombo.getEffect(resolver);
            }

            return resolver;
        }

        get region() {
            return this.#region;
        }

        get name() {
            return this.#name;
        }

        get color() {
            return this.#color;
        }

        get cost() {
            return this.#cost;
        }
    }

    return {
        Card : Card
    }

})();