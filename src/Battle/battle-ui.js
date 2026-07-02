import * as THREE from 'three'
import { component } from "../Interfaces/component";
import { broadcasts } from "../Interfaces/broadcasts";
import { directionToColor } from 'three/tsl';


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
            this._RegisterHandler('battle.highlightMonster', (msg) => {this.#HighlightMonsterTurn(msg)});
            this._RegisterHandler('battle.highlightPlayer', (msg) => {this.#HighlightPlayerTurn(msg)});
        }

        #StartBattle(msg) { 
            this.#monster = msg.monster;
            this.#player = msg.player;

            let playerWindow = document.getElementById("player-window");
            playerWindow.classList.remove("borders--bottom-right");
            playerWindow.classList.add("borders--all");
            playerWindow.classList.remove("position-top-left");

            
            let combatUI = document.getElementById("combat-ui");
            combatUI.style.display = "flex";
            combatUI.insertBefore(playerWindow, document.getElementById("battle-monster-window"));

            let playerCardStacks = document.getElementById("player-card-stacks");
            playerCardStacks.classList.remove("position-bottom-left");
            combatUI.insertBefore(playerCardStacks, playerWindow);
            playerCardStacks.insertBefore(document.getElementById("discard-stack"), document.getElementById("player-deck-stack"));

            document.getElementById("player-inventory-container").style.display = "none";
            document.getElementById("skills-container").style.display = "none";
            document.getElementById("phase-window").style.display = "none";
            document.getElementById("monster-avatar").src = this.#GetPathForMonsterAvatar(msg.monster);
            document.getElementById("hp-amount").innerHTML = msg.player.GetHealth();
            document.getElementById("monster-hp-amount").innerHTML = msg.monster.health;
            document.getElementById("monster-deck-number").innerHTML = msg.monster.health;
            let monsterLevel;
            switch (msg.monster.rank) {
                case 1: monsterLevel = "I"; break;
                case 2: monsterLevel = "II"; break;
                case 3: monsterLevel = "III"; break;

            }
            document.getElementById("monster-level").innerHTML = monsterLevel;
            document.getElementById("hp-separator").style.display = "flex";
            document.getElementById("hp-container").style.display = "flex";
            this.FindEntity("Camera").Broadcast(broadcasts.BroadcastTemplateBattle.StartBattle(msg.player, msg.monster));
        }

        #EndBattle(msg){
            let playerWindow = document.getElementById("player-window");
            document.getElementById("game-ui").appendChild(playerWindow);
            playerWindow.classList.remove("borders--all");
            playerWindow.classList.add("borders--bottom-right");
            playerWindow.classList.add("position-top-left");
            document.getElementById("game-ui").appendChild(playerWindow);

            let playerCardStacks = document.getElementById("player-card-stacks");
            playerCardStacks.classList.add("position-bottom-left");
            document.getElementById("game-ui").appendChild(playerCardStacks);
            playerCardStacks.insertBefore(document.getElementById("player-deck-stack"), document.getElementById("discard-stack"));

            document.getElementById("combat-ui").style.display = "none";
            document.getElementById("player-inventory-container").style.display = "flex";
            document.getElementById("skills-container").style.display = "flex";
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
                document.getElementById("hp-amount").innerHTML = this.#player.GetHealth();
            }
            if (this.#monster) {
                document.getElementById("monster-hp-amount").innerHTML = this.#monster.GetCurrentHealth();
                document.getElementById("monster-deck-number").innerHTML = this.#monster.GetCurrentHealth();
            }
        }

        #SetWindowActiveById(id) {
            document.getElementById(id).classList.remove("window--inactive");
        }

        #SetWindowInactiveById(id) {
            document.getElementById(id).classList.add("window--inactive");
        }

        #HighlightMonsterTurn(msg) {
            this.#SetWindowActiveById("battle-monster-window");
            this.#SetWindowInactiveById("player-window");
        }

        #HighlightPlayerTurn(msg) {
            this.#SetWindowActiveById("player-window");
            this.#SetWindowInactiveById("battle-monster-window");
        }
    }

    return {
        BattleUI : BattleUI
    }
}) ();