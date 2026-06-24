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
            document.getElementById("player-window").style.left = "30%";
            document.getElementById("player-window").classList.remove("borders--bottom-right");
            document.getElementById("player-window").classList.add("borders--all");
            document.getElementById("player-inventory-container").style.display = "none";
            document.getElementById("skills-container").style.display = "none";
            document.getElementById("combat-ui").style.display = "flex";
            document.getElementById("phase-window").style.display = "none";
            document.getElementById("monster-avatar").src = this.#GetPathForMonsterAvatar(msg.monster);
        }

        #GetPathForMonsterAvatar(monster) {
            switch(monster.rank) {
                case 1:
                    return "./resources/assets/avatars/monster_wolf.webp";
                    break;
                case 2:
                    return "./resources/assets/avatars/monster_arachas.webp";
                    break;
                case 3:
                    return "./resources/assets/avatars/monster_vampire.webp";
                    break;
                default:
                    return "";
                    break;
            }
        }
    }

    return {
        BattleUI : BattleUI
    }
}) ();