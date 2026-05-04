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
            this.#currentRound = Phase.Start;
            this.#currentPlayerId = 1;
            this.#currentPlayer = null;
            this.#selection = [];
        }

        InitComponent() {
            this._RegisterHandler('card.select', (msg) => {this.#OnCardSelect(msg);});
            this._RegisterHandler('town.selection', (msg) => {this.#OnTownSelection(msg);});
            this._RegisterHandler('town.ability', (msg) => {this.#OnTownAbility(msg);});
            this._RegisterHandler('game.nextPhase', (msg) => {this.#NextTurnPhase(msg);});
            this.#currentPlayer = this.FindEntity(this.#GetPlayer(this.#currentPlayerId));

        }

        Update() {

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
                this.Broadcast(broadcasts.BroadcastTemplateGame.NextTurn(this.#currentPlayer));
                if (this.#currentPlayer == undefined) {
                    this.#currentPlayerId = 1;
                    this.#currentPlayer = this.FindEntity(this.#GetPlayer(this.#currentPlayerId));
                }
            }
        }

        /**
         * 
         * @param {object} msg 
         */
        #OnCardSelect(msg){
            switch(this.#currentRound.toIdentifier()){
                case 1:
                    this.#selection.push(msg.card_slot);

                    break;
                case 2:
                    break;
                case 3:
                    break;
            }
        }

        /**
         * 
         * @param {object} msg 
         */
        #OnTownSelection(msg){
            const player = this.FindEntity(this.#GetPlayer(this.#currentPlayer));
            switch(this.#currentRound.toIdentifier()) {
                case 1:
                    if (this.#selection.length > 0) {
                        //TODO Show Town Tooltip with Button Move here if possible
                    } else {
                        //TODO Show Town Tooltip with Button use Town Action
                    }
                    break;
                default:
                    break;
            }
        }

        /**
         * 
         * @param {object} msg 
         */
        #OnTownAbility(msg) {
            const player = this.FindEntity(this.#GetPlayer(this.#currentPlayer));
            switch(this.#currentRound.toIdentifier()) {
                case 1:
                    if (this.#selection.length > 0 && player?.town.name != msg.town.name) {

                        const selectedCards = [];
                        for (let card of this.#selection) {
                            selectedCards.push(player.getHandCard(card));
                        }
                        const enterObject = msg.town.canEnter(selectedCards);
                        if (enterObject.condition) {;
                            this.Broadcast(broadcasts.BroadcastTemplateCards.DiscardCard(enterObject.card, "Discard"))
                            player.Broadcast(broadcasts.BroadcastTemplatePlayer.PlayerMove(msg.town, msg.town.position))
                            this.#selection = []
                        }
                    } else {
                        if (player.town.name == msg.town.name) {
                            this.Broadcast(broadcasts.BroadcastTemplateTown.TownAction(player.town.id));
                        }
                    }
                    break;
                default:
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