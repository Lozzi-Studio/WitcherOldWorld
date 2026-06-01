import { component } from "../../Interfaces/component";
import { broadcasts } from "../../Interfaces/broadcasts";

export const phase_two_ui_component = (() => {

    class PhaseTwoUiComponent extends component.Component {
        

        constructor(){
            super();
        }

        InitComponent(){
            this._RegisterHandler('game.phaseTwo', (msg) => {this.#OnPhaseTwoStart(msg)});
            
        }

        #OnPhaseTwoStart(msg){
            document.getElementById("phase-two-options-menu").style.display = "flex";

        }

    }
    return {
        PhaseTwoUiComponent : PhaseTwoUiComponent
    }
})();