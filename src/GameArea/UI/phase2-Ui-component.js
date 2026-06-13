import { component } from "../../Interfaces/component";
import { broadcasts } from "../../Interfaces/broadcasts";

export const phase_two_ui_component = (() => {

    class PhaseTwoUiComponent extends component.Component {
        

        constructor(){
            super();
        }

        InitComponent(){
            this._RegisterHandler('game.phaseTwo', (msg) => {this.#OnPhaseTwoStart(msg)});
            //this._RegisterHandler('game.phaseTwoEnd', (msg) => {this.#onPhaseTwoEnd(msg)});
            document.getElementById("meditate-option").addEventListener("click", () => {this.#onBtnClickMeditate()});
            
        }

        #OnPhaseTwoStart(msg){
            document.getElementById("phase-two-options-menu").style.display = "flex";
            this.#activateMeditateOption();
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

        #activateFightMonsterOption(){
            //TODO implement function to enable monster fight btn
        }

        #onPhaseTwoEnd(msg){
            document.getElementById("phase-two-options-menu").style.display = "none";
            document.getElementById("meditate-option").classList.add("option--disabled");
        }

    }
    return {
        PhaseTwoUiComponent : PhaseTwoUiComponent
    }
})();