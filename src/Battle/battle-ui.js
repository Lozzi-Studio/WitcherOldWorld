import { component } from "../Interfaces/component";


export const battle_ui = (() => {

    class BattleUI extends component.Component {

        constructor(){
            super();
        }

        InitComponent() {
            this._RegisterHandler('battle.startBattle', (msg) => {this.#StartBattle(msg)});
        }

        #StartBattle(msg) {
            document.getElementById("player-window").style.display = "none"
            document.getElementById("combat-ui").style.display = "flex"
            document.getElementById("phase-window").style.display = "none"
        }
    }

    return {
        BattleUI : BattleUI
    }
}) ();