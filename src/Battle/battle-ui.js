import * as THREE from 'three'
import { component } from "../Interfaces/component";
import { broadcasts } from "../Interfaces/broadcasts";


export const battle_ui = (() => {

    class BattleUI extends component.Component {
        #monster;
        #player;

        constructor(){
            super();
            this.#monster = null;
            this.#player = null;
        }

        InitComponent() {
            this._RegisterHandler('battle.startBattle', (msg) => {this.#StartBattle(msg)});
            this._RegisterHandler('game.applyDamage', (msg) => {this.#UpdateHealth(msg)});
            this._RegisterHandler('battle.endBattle', (msg) => {this.#EndBattle(msg)})
        }

        #StartBattle(msg) { 
            this.#monster = msg.monster;
            this.#player = msg.player;
            document.getElementById("player-window").style.left = "30%";
            document.getElementById("player-window").classList.remove("borders--bottom-right");
            document.getElementById("player-window").classList.add("borders--all");
            document.getElementById("player-inventory-container").style.display = "none";
            document.getElementById("skills-container").style.display = "none";
            document.getElementById("combat-ui").style.display = "flex";
            document.getElementById("phase-window").style.display = "none";
            document.getElementById("monster-avatar").src = this.#GetPathForMonsterAvatar(msg.monster);
            document.getElementById("hp-amount").innerHTML = msg.player.GetHealth();
            document.getElementById("monster-health").innerHTML = msg.monster.health;
            document.getElementById("hp-separator").style.display = "flex";
            document.getElementById("hp-container").style.display = "flex";
            this.FindEntity("Camera").Broadcast(broadcasts.BroadcastTemplateBattle.StartBattle(msg.player, msg.monster));
        }

        #EndBattle(msg){
            document.getElementById("player-window").style.left = "0%";
            document.getElementById("player-window").classList.remove("borders--all");
            document.getElementById("player-window").classList.add("borders--bottom-right");
            document.getElementById("player-inventory-container").style.display = "flex";
            document.getElementById("skills-container").style.display = "flex";
            document.getElementById("combat-ui").style.display = "none";
            document.getElementById("phase-window").style.display = "flex";
            document.getElementById("hp-separator").style.display = "none";
            document.getElementById("hp-container").style.display = "none";
            this.FindEntity("Camera").Broadcast(broadcasts.BroadcastTemplateBattle.EndBattle());
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

        #UpdateHealth(msg) {
            if (this.#player) {
                document.getElementById("hp-amount").innerHTML = this.#player.GetHealth()
            }
            if (this.#monster) {
                document.getElementById("monster-health").innerHTML = this.#monster.GetCurrentHealth()
            }
        }
    }

    return {
        BattleUI : BattleUI
    }
}) ();