import { component } from "../Interfaces/component";
import { broadcasts } from "../Interfaces/broadcasts";

export const carddeck_component = (() => {

    class Carddeck extends component.Component {
        #cardDeck;
        #cardDiscard;
        #cardHand;
        #cardPotion;
        #cardPotionLimit
        #handLimit;

        /**
         * A component to track player cards
         * @param {int} handLimit
         */
        constructor(handLimit = 7) {
            super();
            this.#cardDeck = [];
            this.#cardDiscard = [];
            this.#cardHand = [];
            this.#cardPotion = [];
            this.#cardPotionLimit = 4;
            this.#handLimit = handLimit;
        }

        /**
         * Used to intialize and add any default components/events
         */
        InitComponent() {
            this._RegisterHandler('card.loadDeck', (msg) => this.#LoadStartdeck(msg));
            this._RegisterHandler('card.addCard', (msg) => this.#AddCard(msg));
            this._RegisterHandler('card.drawCard', (msg) => this.#DrawCard(msg));
            this._RegisterHandler('card.discardCard', (msg) => this.#DiscardCard(msg));
            this._RegisterHandler('card.shuffle', (msg) => this.#Shuffle(msg));
        }

        /**
         * Returns the handcard in the given slot
         * @param {int} cardslot 
         * @returns {card.Card}
         */
        getHandCard(cardslot) {
            return this.#cardHand[this.#cardHand.length - 1 - cardslot];
        }

        /**
         * Fill the deck with a default configuration of cards
         * @param {object} msg 
         */
        #LoadStartdeck(msg){
            switch (msg.deck) {
                case "Player":
                    break;
                case "Shop":
                    break;
            }
            //TODO
        }

        /**
         * Rotate a card from deck to hand, from hand to discard  
         * @param {object} msg 
         */
        #DrawCard(msg){
            for (let i = 0; i < msg.amount; i++) {
                switch (msg.mode) {
                    case "Deck":
                        if (this.#cardDeck.length == 0) {
                            this.#Shuffle({includeDiscard: true});
                        } 
                        this.#cardHand.push(this.#cardDeck.pop());
                        break;
                    case "Discard":
                        if (this.#cardDiscard.length != 0) {
                            this.#cardHand.push(this.#cardDeck.pop())
                        }
                        break;
                    case "Potion":
                        if (this.#cardPotion.length < this.#cardPotionLimit) {
                            //TODO Draw Potion
                        }
                }
            }
            this.Broadcast(broadcasts.BroadcastTemplatePlayer.UpdateHandCardsUI("draw", msg.card));
        }

        /**
         * Add a new card to a destination
         * @param {object} msg 
         */
        #AddCard(msg){
            switch(msg.destination) {
                case "Hand":
                    if (this.#cardHand.length < this.#handLimit) {
                        this.#cardHand.push(msg.card);
                    }
                    break;
                case "Discard":
                    this.#cardDiscard.push(msg.card);
                    break;
                case "Deck":
                    this.#cardDeck.push(msg.card)
                    this.#Shuffle({includeDiscard: false});
                    break;
            }
            // console.log(this.parent);
            this.parent.BroadcastOthers(broadcasts.BroadcastTemplatePlayer.UpdateHandCardsUI("add", msg.card));
        }

        /**
         * Discard a card from hand to discard or delete from carddeck
         * @param {object} msg 
         */
        #DiscardCard(msg){
            switch (msg.mode) {
                case "Discard":
                    if (this.#cardHand.includes(msg.card)) {
                        const cardIndex = this.#cardHand.indexOf(msg.card);
                        this.#cardDiscard.push(msg.card);
                        this.#cardHand.splice(cardIndex,1);
                    }
                    break;
                    case "Delete":
                        if (this.#cardHand.includes(msg.card)) {
                            this.#cardHand.splice(this.#cardHand.indexOf(msg.card),1);
                        } else if (this.#cardDeck.includes(msg.card)) {
                            this.#cardDeck.splice(this.#cardDeck.indexOf(msg.card),1);
                        }  else if (this.#cardDiscard.includes(msg.card)) {
                            this.#cardDiscard.splice(this.#cardDiscard.indexOf(msg.card),1);
                        }
                    break;
            }
            this.Broadcast(broadcasts.BroadcastTemplatePlayer.UpdateHandCardsUI("discard", msg.card));
        }

        /**
         * Shuffle up your deck (Optional: Includes discard)
         * @param {object} msg 
         */
        #Shuffle(msg) {
            if (msg.includeDiscard) {
                this.#cardDeck = this.#cardDeck.concat(this.#cardDiscard);
                this.#cardDiscard = [];
            }
            
            //Fisher-Yates_shuffle (src:https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)
            for (let i = this.#cardDeck.length - 1; i >= 1; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [this.#cardDeck[i], this.#cardDeck[j]] = [this.#cardDeck[j], this.#cardDeck[i]];
            }
        }

        get hand() {
            return this.#cardHand;
        }

        get deck() {
            return this.#cardDeck;
        }

        get discard() {
            return this.#cardDiscard;
        }

    }

    return {
        Carddeck : Carddeck
    }
})();