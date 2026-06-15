import { component } from "../../Interfaces/component";
import { broadcasts } from "../../Interfaces/broadcasts";

export const phase_two_ui_component = (() => {

    class PhaseTwoUiComponent extends component.Component {

        #currentResult = null;
        #currentEvent = null;
        

        constructor(){
            super();
        }

        InitComponent(){
            this._RegisterHandler('game.phaseTwo', (msg) => {this.#OnPhaseTwoStart(msg)});
            document.getElementById("meditate-option").addEventListener("click", () => {this.#onBtnClickMeditate()});
            document.getElementById("explore-city-option").addEventListener("click", () => {this.#onBtnClickExploreCity()});
            document.getElementById("explore-wilderness-option").addEventListener("click", () => {this.#onBtnClickExploreWilderness()});
            document.getElementById("explore-option-One").addEventListener("click", () => {this.#onBtnClickOptionA()});
            document.getElementById("explore-option-Two").addEventListener("click", () => {this.#onBtnClickOptionB()});
            document.getElementById("explore-confirm-btn").addEventListener("click", () => {this.#onBtnClickConfirm()});
            
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

        #onBtnClickExploreCity(){
            this.#openExploreWindow("Du erkundest die Stadt", "explore--city", "eventsLand");
        }

        #onBtnClickExploreWilderness(){
            this.#openExploreWindow("Du erkundest die Wildnis", "explore--wilderness", "eventsCity");
        }
        #openExploreWindow(header, cssClass, key){
            document.getElementById("phase-two-options-menu").style.display = "none";
            document.getElementById("explorartion-window").style.display = "flex";
            document.getElementById("eplore-header").innerText = header;
            document.getElementById("explorartion-window").classList.add(cssClass);
            this.#loadExploreEvent(key);
        }

        async #loadExploreEvent(key){
            let data = this._parent.GetFromCache(key);
            this.#currentEvent = data.events[Math.floor(Math.random() * data.events.length)];

            document.getElementById("explore-txt").innerHTML = this.#currentEvent.Text;
            document.getElementById("explore-option-One").innerText = this.#currentEvent.OptionA;
            document.getElementById("explore-option-Two").innerText = this.#currentEvent.OptionB;
        }

        #onBtnClickOptionA(){
            this.#currentResult = this.#currentEvent.ResultA;
            document.getElementById("explore-txt").innerHTML = this.#currentEvent.ResultTextA + "<br><br>" + this.#currentEvent.ResultA.Info;
            document.getElementById("explore-Options-Btn").style.display = "none";
            document.getElementById("explore-confirm-btn").style.display = "flex";
        }

        #onBtnClickOptionB(){
            this.#currentResult = this.#currentEvent.ResultB;
            document.getElementById("explore-txt").innerHTML = this.#currentEvent.ResultTextB + "<br><br>" + this.#currentEvent.ResultB.Info;
            document.getElementById("explore-Options-Btn").style.display = "none";
            document.getElementById("explore-confirm-btn").style.display = "flex";
        }

        #onBtnClickConfirm(){
            this.#applyResult();
            
            this.#onPhaseTwoEnd();
            this.Broadcast(broadcasts.BroadcastTemplateGame.NextPhase());
        }

        #applyResult(){
            const result = this.#currentResult;
            const currentPlayer = this.FindComponent('GameManager').currentPlayer;
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

        #onPhaseTwoEnd(){
            document.getElementById("explorartion-window").style.display = "none";
            document.getElementById("phase-two-options-menu").style.display = "none";
            document.getElementById("explore-confirm-btn").style.display = "none";
            document.getElementById("explore-Options-Btn").style.display = "flex";
            document.getElementById("explorartion-window").classList.remove("explore--city", "explore--wilderness");
            document.getElementById("meditate-option").classList.add("option--disabled");
        }

    }
    return {
        PhaseTwoUiComponent : PhaseTwoUiComponent
    }
})();