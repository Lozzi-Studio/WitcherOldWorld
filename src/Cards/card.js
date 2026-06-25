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
        #imagePath;

        /**
         * A wrapper for action cards
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
            this.#combo = combo || new Map();
            this.#effects = effects;
            this.#nextCardCombo = null;
            this.#comboBonus = null;
            this.#region = region;
            this.#cost = cost;
            this.#imagePath = this.getImagePathFromName();
        }

        /**
         * Returns a bool, if there is a combo option for given color
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
         * Add a card to the current combo
         * @param {card.Card} card
         */
        addNextComboCard(card) {
            if (this.canCombo(card.color)) {
                this.#nextCardCombo = card;
                this.#nextCardCombo.addBonusComboEffect(this.#combo.get(this.#nextCardCombo.color));
            }
        }

        /**
         * Add a bonus effect for the current combo
         * @param {card_options.CardEffect} effect
         */
        addBonusComboEffect(effect) {
            this.#comboBonus = effect;
        }

        /**
         * Wraps up all effects from the current combo into a resolver object
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

        getImagePathFromName() {
            const parts = [];

            parts.push(this.#name.split(" ").join("_").toLowerCase());

            if (this.#region) {
                parts.push(this.#region.toIdentifier().toLowerCase());
            }

            if (this.#combo) {
                for (let combo of this.#combo.keys()) {
                    parts.push(combo.toIdentifier().toLowerCase());
                }
            }
            return "../../resources/assets/cards/" + parts.join("_") + ".webp";
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

        get imagePath() {
            return this.#imagePath;
        }
    }

    return {
        Card : Card
    }

})();