import { component } from "../Interfaces/component";

export const carddeck_component = (() => {

    class Carddeck extends component.Component {
        #cardDeck;
        #cardDiscard;
        #cardHand;
        #cardPotion;
        #cardPotionLimit
        #handLimit;

        /**
         * 
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

        InitComponent() {
            this._RegisterHandler('card.loadDeck', (msg) => this.#LoadStartdeck(msg));
            this._RegisterHandler('card.addCard', (msg) => this.#AddCard(msg));
            this._RegisterHandler('card.drawCard', (msg) => this.#DrawCard(msg));
            this._RegisterHandler('card.discardDraw', (msg) => this.#DiscardCard(msg));
            this._RegisterHandler('card.shuffle', (msg) => this.#Shuffle(msg));
        }

        getHandCard(cardslot) {
            return this.#cardHand[this.#cardHand.length - 1 - cardslot];
        }

        #LoadStartdeck(msg){
            switch (msg.deck) {
                case "Player":
                    break;
                case "Shop":
                    break;
            }
            //TODO
        }

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
        }

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
        }

        #DiscardCard(msg){
            switch (msg.mode) {
                case "Discard":
                    if (msg.card in this.#cardHand) {
                        const cardIndex = this.#cardHand.indexOf(msg.card);
                        this.#cardDiscard.push(msg.card);
                        this.#cardHand.splice(cardIndex,1);
                    }
                    break;
                case "Delete":
                    if (msg.card in this.#cardHand) {
                        this.#cardHand.splice(this.#cardHand.indexOf(msg.card),1);
                    } else if (msg.card in this.#cardDeck) {
                        this.#cardDeck.splice(this.#cardDeck.indexOf(msg.card),1);
                    }  else if (msg.card in this.#cardDiscard) {
                        this.#cardDiscard.splice(this.#cardDiscard.indexOf(msg.card),1);
                    }
                    break;
            }
        }

        #Shuffle(msg) {
            if (msg.includeDiscard) {
                this.#cardDeck = this.#cardDeck.concat(this.#cardDiscard);
                this.#cardDiscard = [];
            }
            
            //Fisher-Yates_shuffle (src:wikipedia)
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