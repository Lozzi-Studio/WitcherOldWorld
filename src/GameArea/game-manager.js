import { broadcasts } from "../Interfaces/broadcasts";
import { component } from "../Interfaces/component";
import { cards } from "../Cards/card-templates";
import { card_options } from "../Cards/card-options";

export const game_manager = (() => { 

    class GameManager extends component.Component {
        #currentRound;
        #currentPlayerId;
        #currentPlayer;
        #selection;
        #selectedTown;
        
        /**
         * Manages game stages and game behaviour
         */

        constructor() {
            super();
            this.#currentRound = Phase.One;
            this.#currentPlayerId = 1;
            this.#currentPlayer = null;
            this.#selection = [];
            this.#selectedTown = null;
        }

        /**
         * Used to intialize and add any default components/events
         */
        InitComponent() {
            this._RegisterHandler('card.select', (msg) => {this.#OnCardSelect(msg);});
            this._RegisterHandler('town.selection', (msg) => {this.#OnTownSelection(msg);});
            this._RegisterHandler('game.nextPhase', (msg) => {this.#NextTurnPhase(msg);});
            this._RegisterHandler('game.startPoker', (msg) => {this.#StartWuerfelpoker(msg);});
            this._RegisterHandler('game.removeShop', (msg) => {this.#RemoveShopCard(msg);});
            this._RegisterHandler('game.swapoutCard', (msg) => {this.#SwapoutCard(msg);});
            this._RegisterHandler('game.start', (msg) => {this.#OnGameStart(msg)});
            this._RegisterHandler('game.meditate', (msg) => {this.#OnMeditate(msg)});
            this._RegisterHandler('game.discardCards',() => {this.DiscardCardsRoundThree()});
            this.#currentPlayer = this.FindEntity(this.#GetPlayer(this.#currentPlayerId));
        }

        #OnMeditate(msg) {
            if (this.#currentRound.toIdentifier() == 2) {
                this.#currentPlayer.Broadcast(msg);
            }
        }

        /**
         * Trigger selection to remove cards from shop
         * @param {object} msg 
         */
        #RemoveShopCard(msg){
            console.log("Remove Shop Card");
            //TODO
        }

        /**
         * Trigger selection to remove card from hand to get a shopcard
         * @param {object} msg 
         */
        #SwapoutCard(msg){
            console.log("Swapout Card");
            //TODO
        }

        /**
         * Swaps to the next phase
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
         * Add card to selection
         * @param {object} msg 
         */
        #OnCardSelect(msg){
            if (this.#selection.includes(msg.card_slot)){
                this.#selection.splice(this.#selection.indexOf(msg.card_slot),1);
                this.Broadcast(broadcasts.BroadcastTemplateCards.UpdateCardSelectionUI(msg.card_slot, "Deselect"));
                if (this.#selection.length === 0){
                    this.Broadcast(broadcasts.BroadcastTemplateGame.UpdateDiscardButtonActive(false));
                }
            } else {
                this.#selection.push(msg.card_slot);
                this.Broadcast(broadcasts.BroadcastTemplateCards.UpdateCardSelectionUI(msg.card_slot, "Select"));
                this.Broadcast(broadcasts.BroadcastTemplateGame.UpdateDiscardButtonActive(true));
            }
        }

        /**
         * Discards selected card to move to selected town
         */
        DiscardCardToMove(){
            var selectedCards = [];
            for (let card_slot of this.#selection) {
                selectedCards.push(this.#currentPlayer.FindComponent("Carddeck").hand[card_slot]);
            }
            if (selectedCards.length > 0 && this.#selectedTown) {
                let moveAllowed = this.ValidateMove(this.#selectedTown, selectedCards).moveAllowed;
                let allowedCard = this.ValidateMove(this.#selectedTown, selectedCards).allowedCard;
                if (moveAllowed){
                    this.#currentPlayer.Broadcast(broadcasts.BroadcastTemplatePlayer.PlayerMove(this.#selectedTown, this.#selectedTown.position));
                    this.#selectedTown.Broadcast(broadcasts.BroadcastTemplateTown.ResetTownAction());
                    this.#currentPlayer.Broadcast(broadcasts.BroadcastTemplateCards.DiscardCard(allowedCard, "Discard"));
                    this.#selection = [];
                    this.Broadcast(broadcasts.BroadcastTemplateCards.UpdateCardSelectionUI());
                }
            }
        }

        DiscardCardsRoundThree(){
            if (this.#selection.length == 0 || this.#currentRound.toIdentifier() != 3){
                return;
            }
            else{
                var cardsToDiscard = [];
                for (let card_slot of this.#selection) {
                    cardsToDiscard.push(this.#currentPlayer.FindComponent("Carddeck").hand[card_slot]);
                }

                for (const card of cardsToDiscard) {
                    this.#currentPlayer.Broadcast(broadcasts.BroadcastTemplateCards.DiscardCard(card, "Discard"));
                }

                this.#selection = [];
                
                this.Broadcast(broadcasts.BroadcastTemplateCards.UpdateCardSelectionUI());
                this.Broadcast(broadcasts.BroadcastTemplateGame.UpdateDiscardButtonActive(false));
            }
        }

        /**
         * Gets current player's selected cards and checks if moving to selected town is valid
         * @returns {bool}
         */
        CheckIfCanMoveToTown() {
            var selectedCards = [];
            for (let card_slot of this.#selection) {
                selectedCards.push(this.#currentPlayer.FindComponent("Carddeck").hand[card_slot]);
            }

            if (selectedCards.length > 0 && this.#selectedTown) {
                let moveAllowed = this.ValidateMove(this.#selectedTown, selectedCards).moveAllowed;
                if (moveAllowed){
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        }

        /**
         * Checks if moving to selected town is valid (one of selected cards must be the right region + town must be neighbor of current town)
         * @param {town_entity.TownEntity} town 
         * @param {array} selectedCards 
         * @returns 
         */
        ValidateMove(town, selectedCards){
            var moveAllowed = false;
            var allowedCard;

            for (let card of selectedCards) {
                if (this.#currentPlayer.town.neighboringTowns.includes(town.id) && town != this.#currentPlayer.town && town.FindComponent("TownProperties").canEnter(card)) {
                    return { moveAllowed: true, allowedCard: card };
                }
            }
            return { moveAllowed: false, allowedCard: null };
        }

        /**
         * Triggers town UI on click on town
         * @param {object} msg 
         */
        #OnTownSelection(msg){
            switch(this.#currentRound.toIdentifier()) {
                case 1:
                    this.#selectedTown = msg.town;
                    break;
                default:
                    break;
            }
        }

        /**
         * Triggers start of a wuerfelpoker game
         * @param {object} msg 
         */
        #StartWuerfelpoker(msg) {
            //TODO Implement Wuerfelpoker
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
         * Get string of player entity
         * @param {int} id 
         * @returns {string}
         */
        #GetPlayer(id) {
            return "Player_" + id;
        }

        /**
         * Gives default card deck to players on game start
         */
        #OnGameStart() {
            // give start deck to players
            const players = this._parent._parent.Filter(x => x.name.includes("Player"));
            for (let player of players) {
                player.Broadcast(broadcasts.BroadcastTemplateCards.LoadCarddeck("Player"));
            }
        }

        /**
         * @returns {array}
         */
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

        /**
         * @returns {town.Town}
         */
        get selectedTown() {
            return this.#selectedTown;
        }
    };

    class Phase {
        static One = new Phase(1);
        static Two = new Phase(2);
        static Three =  new Phase(3);

        static Start = new Phase(1);
        static End = new Phase(-1);
        #number;

        /**
         * An enum class to determine phase
         * Use static function constructor instead of default constructor!
         * @param {int} number 
         */
        constructor(number) {
            this.#number = number;
        }

        /**
         * Set state to next phase
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
         * Get identifier of enum
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