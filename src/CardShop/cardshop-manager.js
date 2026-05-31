import { broadcasts } from "../Interfaces/broadcasts";
import { component } from "../Interfaces/component";


export const cardshop_manager = (() => {

    class CardshopManager extends component.Component{
        #selection;
        #costSelection;

        /**
         * a wrapper to manage the cardshop
         */
        constructor() {
            super();
            this.#selection = null;
            this.#costSelection = null;
        }

        /**
         * Used to intialize and add any default components/events
         */
        InitComponent() {
            this.#UpdateShopSlots({});
            this._RegisterHandler('cardshop.select', (msg) => {this.#SelectSlot(msg)});
            this._RegisterHandler('cardshop.buy', (msg) => {this.#BuySlot(msg)});
            this._RegisterHandler('card.drawCard', (msg) => {this.#UpdateShopSlots(msg)})
        }

        /**
         * Update each Slot in Shop
         */
        #UpdateShopSlots(msg) { 
            var shopCards = this.FindComponent("Carddeck").hand;
            if (shopCards.length < 5) {
                this.Broadcast(broadcasts.BroadcastTemplateCards.DrawCard("Deck", 5 - shopCards.length))
            }
            var i = 1;
            for (let card of this.FindComponent("Carddeck").hand) {
                this.FindComponent("CardshopSlot_" + i).UpdateSlot(card);
                i += 1;
            }
        }

        /**
         * Update Current Selected Slot
         * @param {object} msg 
         */
        #SelectSlot(msg) {
            this.#selection = msg.slot;
            this.#costSelection = msg.cost;
        }

        /**
         * Buy Selected Card from Shop
         * @param {object} msg 
         */
        #BuySlot(msg) {
            if (this.#selection) {
                this.FindEntity("GameArea").FindComponent("GameManager").Broadcast(broadcasts.BroadcastTemplateCardShop.BuyCardFromShop(this.#selection, this.#costSelection));
            }
        }

        
        get cost() {
            return this.#costSelection;
        }
    }

    return {
        CardshopManager : CardshopManager
    }

}) ();