import { component } from "../Interfaces/component";

export const player_trophies = (() => {
    
    class TrophyStorage extends component.Component{
        #amount;

        constructor() {
            super();
            this.#amount = 0;
        }

        InitComponent() {
            this._RegisterHandler('player.add_trophy', (msg) => {this.#AddTrophy(msg)});
        }


        #AddTrophy() {
            this.Add(1);
        }

        Add(amount) {
            this.#amount += amount;
        }

        get amount(){
            return this.#amount;
        }
    }

    return {
        TrophyStorage : TrophyStorage
    }
}) ();