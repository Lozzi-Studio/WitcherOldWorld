import { component } from "../Interfaces/component";
import { broadcasts } from "../Interfaces/broadcasts";

export const player_trophies = (() => {
    
    class TrophyStorage extends component.Component{
        #amount;

        constructor() {
            super();
            this.#amount = 0;
        }

        InitComponent() {
            this._RegisterHandler('player.addTrophy', (msg) => {this.#AddTrophy(msg)});
        }


        #AddTrophy() {
            this.#amount += 1;
            this.FindEntity("GameArea").Broadcast(broadcasts.BroadcastTemplatePlayer.UpdateUI());
        }

        get amount(){
            return this.#amount;
        }
    }

    return {
        TrophyStorage : TrophyStorage
    }
}) ();