import { broadcasts } from "../Interfaces/broadcasts";
import { component } from "../Interfaces/component";

export const game_manager = (() => { 

    class GameManager extends component.Component {
        #currentRound;
        #currentPlayer;
        #selection;
        
        constructor() {
            super();
            this.#currentRound = Phase.Start;
            this.#currentPlayer = 1;
            this.#selection = -1;
        }

        InitComponent() {
            this._RegisterHandler('card.select', (msg) => {this.#OnCardSelect(msg);});
            this._RegisterHandler('town.selection', (msg) => {this.#OnTownSelection(msg);});
            this._RegisterHandler('game.nextPhase', (msg) => {this.#NextTurnPhase(msg);});
        }

        Update() {

        }

        #NextTurnPhase(msg){
            this.#currentRound.next();
        }

        #OnCardSelect(msg){
            switch(this.#currentRound.toIdentifier()){
                case 1:
                    this.#selection = msg.card_slot;

                    break;
                case 2:
                    break;
                case 3:
                    break;
            }
        }

        #OnTownSelection(msg){
            const player = this.FindEntity(this.#GetPlayer(this.#currentPlayer));
            switch(this.#currentRound.toIdentifier()) {
                case 1:

                    if (this.#selection >= 0 && player.town.name != msg.town.name) {
                        const selectedCard = player.getHandCard(this.#selection);
                        if (msg.town.canEnter(selectedCard)) {
                            this.Broadcast(broadcasts.BroadcastTemplateCards.DiscardCard(selectedCard, "Discard"))
                            player.Broadcast(broadcasts.BroadcastTemplatePlayer.PlayerMove(msg.town, msg.town.position))
                            this.#selection = -1
                        }
                    } else {
                        if (player.town.name == msg.town.name) {

                            this.Broadcast(broadcasts.BroadcastTemplateAction.TownAction(player.town.id));
                        }
                        //TODO TownAction
                    }
                    break;
                case 2:
                    break;
                case 3:
                    break;
            }
        }

        GetCurrentPlayer(){
            return "Player_" + this.#currentPlayer;
        }

        #GetPlayer(id) {
            return "Player_" + id;
        }

        get selection() {
            return this.#selection;
        }
    };

    class Phase {
        static One = new Phase(1);
        static Two = new Phase(2);
        static Three =  new Phase(3);

        static Start = new Phase(0);
        static End = new Phase(-1);
        #number;


        constructor(number) {
            this.#number = number;
        }

        next() {
            this.#number += 1;
            if (this.#number > 3) {
                this.#number = 0;
            }
        }

        toIdentifier() {
            return this.#number;
        }
    }


    return {
        GameManager : GameManager,
        Phase : Phase,
    }

})();