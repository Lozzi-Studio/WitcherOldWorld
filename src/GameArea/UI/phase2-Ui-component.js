import { component } from "../../Interfaces/component";
import { broadcasts } from "../../Interfaces/broadcasts";

export const phase_two_ui_component = (() => {

    class PhaseTwoUiComponent extends component.Component {
        

        constructor(){
            super();
        }

        InitComponent(){
            this._RegisterHandler('game.phaseTwo', (msg) => {this.#OnPhaseTwoStart(msg)});
            document.getElementById("meditate-option").addEventListener("click", () => {this.#onBtnClickMeditate()});
            document.getElementById("fight-monster-option").addEventListener("click", () => {this.#onBtnClickCombat()})
            
        }

        #OnPhaseTwoStart(msg){
            document.getElementById("phase-two-options-menu").style.display = "flex";
            this.#activateMeditateOption();
            this.#activateCombatOption();
        }

        #activateMeditateOption(){
            const currentPlayer = this.FindComponent('GameManager').currentPlayer;
            const canMeditate = currentPlayer.FindComponent("PlayerSkills").canMeditate();

            for (let key in canMeditate){
                if(canMeditate[key]){
                    document.getElementById("meditate-option").classList.remove("option--disabled");
                }
            }
            
        }

        #activateCombatOption(){
            let monster = this.FindComponent('GameManager').GetLocalMonster();
            if (monster != null) {
                document.getElementById("fight-monster-option").classList.remove("option--disabled");
            }
        }

        #exploreCityOption(){
            //TODO 
        }

        #exploreWildernessOption(){
            //TODO 
        }



        #onBtnClickMeditate(){
            const currentPlayer = this.FindComponent('GameManager').currentPlayer;
            const canMeditate = currentPlayer.FindComponent("PlayerSkills").canMeditate();
    
            for(let skill in canMeditate){
                if(canMeditate[skill]){
                    currentPlayer.Broadcast(broadcasts.BroadcastTemplateGame.Meditate(skill));
                    break;
                }
            }
            this.#onPhaseTwoEnd();
            this.Broadcast(broadcasts.BroadcastTemplateGame.NextPhase());
        }

        #onBtnClickCombat(){
            this.#onPhaseTwoEnd({});
            let player = this.FindComponent("GameManager").currentPlayer;
            let monster = this.FindComponent("GameManager").GetLocalMonster();
            this.FindEntity("BattleEntity").Broadcast(broadcasts.BroadcastTemplateBattle.StartBattle(player, monster));
        }

        #onPhaseTwoEnd(msg){
            document.getElementById("phase-two-options-menu").style.display = "none";
            document.getElementById("meditate-option").classList.add("option--disabled");
            document.getElementById("fight-monster-option").classList.add("option--disabled");
        }

    }
    return {
        PhaseTwoUiComponent : PhaseTwoUiComponent
    }
})();