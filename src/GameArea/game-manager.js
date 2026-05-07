import { broadcasts } from "../Interfaces/broadcasts";
import { component } from "../Interfaces/component";

export const game_manager = (() => { 

    class GameManager extends component.Component {
        #currentRound;
        #currentPlayerId;
        #currentPlayer;
        #selection;
        

        constructor() {
            super();
            this.#currentRound = Phase.One;
            this.#currentPlayerId = 1;
            this.#currentPlayer = null;
            this.#selection = [];
        }

        InitComponent() {
            this._RegisterHandler('card.select', (msg) => {this.#OnCardSelect(msg);});
            this._RegisterHandler('town.selection', (msg) => {this.#OnTownSelection(msg);});
            this._RegisterHandler('game.nextPhase', (msg) => {this.#NextTurnPhase(msg);});
            this._RegisterHandler('game.startPoker', (msg) => {this.#StartWuerfelpoker(msg);});
            this._RegisterHandler('game.removeShop', (msg) => {this.#RemoveShopCard(msg);});
            this._RegisterHandler('game.swapoutCard', (msg) => {this.#SwapoutCard(msg);});
            this.#currentPlayer = this.FindEntity(this.#GetPlayer(this.#currentPlayerId));

        }

        Update() {

        }

        #RemoveShopCard(msg){
            console.log("Remove Shop Card");
            //TODO
        }

        #SwapoutCard(msg){
            console.log("Swapout Card");
            //TODO
        }

        /**
         * 
         * @param {object} msg 
         */
        #NextTurnPhase(msg){
            const nextPlayer = this.#currentRound.next();
            if (nextPlayer) {
                this.#currentPlayerId += 1;
                this.#currentPlayer = this.FindEntity(this.#GetPlayer(this.#currentPlayerId));
                if (this.#currentPlayer == undefined) {
                    this.#currentPlayerId = 1;
                    this.#currentPlayer = this.FindEntity(this.#GetPlayer(this.#currentPlayerId));
                    this.Broadcast(broadcasts.BroadcastTemplateGame.NextTurn(this.#currentPlayer));
                }
            }
        }

        /**
         * 
         * @param {object} msg 
         */
        #OnCardSelect(msg){
            if (this.#selection.includes(msg.card_slot)){
                this.#selection.splice(this.#selection.findIndex(msg.card_slot),1)
            } else {
                this.#selection.push(msg.card_slot);
            }
        }

        /**
         * 
         * @param {object} msg 
         */
        #OnTownSelection(msg){
            switch(this.#currentRound.toIdentifier()) {
                case 1:
                    console.log("Town UI");
                    break;
                default:
                    break;
            }
        }


        #StartWuerfelpoker(msg) {
            //TODO Implement Wuerfelpoker
            console.log("Wuerfelpoker");
            switch (Math.floor(Math.random() * 2)) {
                case 0:
                    this.#currentPlayer.Broadcast(broadcasts.BroadcastTemplatePlayer.ChangeMoney(-1));
                    break;
                case 1:
                    this.#currentPlayer.Broadcast(broadcasts.BroadcastTemplatePlayer.ChangeMoney(3));
                    break;
            }
        }

        /**
         * 
         * @param {int} id 
         * @returns {string}
         */
        #GetPlayer(id) {
            return "Player_" + id;
        }

        get selection() {
            return this.#selection;
        }

        get currentPlayer() {
            return this.#currentPlayer;
        }

        /**
         * @returns {int}
         */
        get currentPlayerId() {
            return this.#currentPlayerId;
        }

        /**
         * @returns {Phase}
         */
        get phase() {
            return this.#currentRound;
        }
    };

    class Phase {
        static One = new Phase(1);
        static Two = new Phase(2);
        static Three =  new Phase(3);

        static Start = new Phase(1);
        static End = new Phase(-1);
        #number;


        constructor(number) {
            this.#number = number;
        }

        /**
         * 
         * @returns {bool}
         */
        next() {
            this.#number += 1;
            if (this.#number > 3) {
                this.#number = 1;
                return true;
            }
            return false;
        }

        /**
         * 
         * @returns {int}
         */
        toIdentifier() {
            return this.#number;
        }
    }


    return {
        GameManager : GameManager,
        Phase : Phase,
    }

})();