import { component } from "../Interfaces/component";
import { broadcasts } from "../Interfaces/broadcasts";

export const player_trophies = (() => {
    
    class TrophyStorage extends component.Component{
        #amount;

        /**
         * A tracker for player trophies
         */
        constructor() {
            super();
            this.#amount = 0;
        }

        /**
         * Used to intialize and add any default components/events
         */
        InitComponent() {
            this._RegisterHandler('player.addTrophy', (msg) => {this.#AddTrophy(msg)});
        }

        /**
         * Increase trophies by 1
         */
        #AddTrophy() {
            this.#amount += 1;
            this.FindEntity("GameArea").Broadcast(broadcasts.BroadcastTemplatePlayer.UpdateUI(this.parent));
            if (this.#amount >= 4){
                this.FindEntity("GameArea").Broadcast(broadcasts.BroadcastTemplateGame.EndGame(this.parent));
            }
        }

        get amount(){
            return this.#amount;
        }
    }

    return {
        TrophyStorage : TrophyStorage
    }
}) ();