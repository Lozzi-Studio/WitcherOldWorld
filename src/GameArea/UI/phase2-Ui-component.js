import { component } from "../../Interfaces/component";
import { broadcasts } from "../../Interfaces/broadcasts";
import { player_skills } from "../../Players/player-skills";
import { status_templates } from "../../Players/status-templates";
import { status_options } from "../../Players/status-options";
import { region } from "../region";

export const phase_two_ui_component = (() => {

    class PhaseTwoUiComponent extends component.Component {

        #currentResult;
        #currentEvent;
        

        constructor(){
            super();
            this.#currentEvent = null;
            this.#currentResult = null;
        }

        InitComponent(){
            this._RegisterHandler('game.phaseTwo', (msg) => {this.#OnPhaseTwoStart(msg);});
            document.getElementById("meditate-option").addEventListener("click", () => {this.#onBtnClickMeditate();});
            document.getElementById("fight-monster-option").addEventListener("click", () => {this.#onBtnClickCombat();});
            document.getElementById("explore-city-option").addEventListener("click", () => {this.#onBtnClickExploreCity();});
            document.getElementById("explore-wilderness-option").addEventListener("click", () => {this.#onBtnClickExploreWilderness();});
            document.getElementById("explore-option-One").addEventListener("click", () => {this.#onBtnClickOptionA();});
            document.getElementById("explore-option-Two").addEventListener("click", () => {this.#onBtnClickOptionB();});
            document.getElementById("explore-confirm-btn").addEventListener("click", () => {this.#onBtnClickConfirm();});
            
        }

        #OnPhaseTwoStart(msg){
            document.getElementById("town-window").style = "none";
            document.getElementById("phase-two-options-menu").style.display = "flex"; 
            this.#activateMeditateOption();
            this.#activateCombatOption();
        }

        #activateMeditateOption(){
            const currentPlayer = this.FindComponent('GameManager').currentPlayer;
            const canMeditate = currentPlayer.FindComponent("PlayerSkills").canMeditate();
            if (currentPlayer.FindComponent("TrophyStorage").amount < 3) {
                for (let key in canMeditate){
                    if(canMeditate[key]){
                        document.getElementById("meditate-option").classList.remove("option--disabled");
                    }
                }
            }
            
        }

        #activateCombatOption(){
            let monster = this.FindComponent('GameManager').GetLocalMonster();
            if (monster != null) {
                document.getElementById("fight-monster-option").classList.remove("option--disabled");
            }
        }

        #onBtnClickExploreCity(){
            this.#openExploreWindow("Du erkundest die Stadt", "explore--city", "eventsCity");
        }

        #onBtnClickExploreWilderness(){
            this.#openExploreWindow("Du erkundest die Wildnis", "explore--wilderness", "eventsLand");
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

            document.getElementById("explore-txt").innerHTML = "<br>" + this.#currentEvent.Text + "<br><br>";
            document.getElementById("explore-option-One").innerText = this.#currentEvent.OptionA;
            document.getElementById("explore-option-Two").innerText = this.#currentEvent.OptionB;
        }

        #onBtnClickOptionA(){
            if ("W6" in this.#currentEvent.ResultA) {
                this.#currentResult = this.#currentEvent.ResultA["W6"][Math.floor(Math.random() * this.#currentEvent.ResultA["W6"].length)];
                this.#currentEvent.ResultA = this.#currentResult;
            } else {
                this.#currentResult = this.#currentEvent.ResultA;
            }
            document.getElementById("explore-txt").innerHTML = "<br>" + this.#currentEvent.ResultTextA + "<br>" + (("InfoText" in this.#currentResult) ? this.#currentResult.InfoText : "") + "<br>";
            document.getElementById("explore-Options-Btn").style.display = "none";
            document.getElementById("explore-confirm-btn").style.display = "flex";
            document.getElementById("explore-confirm-btn").innerHTML = this.#currentEvent.ResultA.Info;
        }

        #onBtnClickOptionB(){
            if ("W6" in this.#currentEvent.ResultB) {
                this.#currentResult = this.#currentEvent.ResultB["W6"][Math.floor(Math.random() * this.#currentEvent.ResultB["W6"].length)];
                this.#currentEvent.ResultB = this.#currentResult;
            } else {
                this.#currentResult = this.#currentEvent.ResultB;
            }
            document.getElementById("explore-txt").innerHTML = "<br>" + this.#currentEvent.ResultTextB + "<br>" + (("InfoText" in this.#currentResult) ? this.#currentResult.InfoText : "") + "<br>";
            document.getElementById("explore-Options-Btn").style.display = "none";
            document.getElementById("explore-confirm-btn").style.display = "flex";
            document.getElementById("explore-confirm-btn").innerHTML = this.#currentEvent.ResultB.Info
        }

        #onBtnClickConfirm(){
            this.#applyResult();
            this.#onPhaseTwoEnd();
            this.Broadcast(broadcasts.BroadcastTemplateGame.NextPhase());
        }

        #applyResult(){
            const result = this.#currentResult;
            const currentPlayer = this.FindComponent('GameManager').currentPlayer;
            for (let key of Object.keys(result)) {
                switch(key) {
                    case "Potion":
                        if (result[key] > 0) {
                            currentPlayer.Broadcast(broadcasts.BroadcastTemplateCards.DrawCard("Potion", parseInt(result[key])));
                        } else {
                            currentPlayer.Broadcast(broadcasts.BroadcastTemplateCards.DiscardRandomPotion(parseInt(result[key])));
                        }
                        break;
                    case "Gold": 
                        currentPlayer.Broadcast(broadcasts.BroadcastTemplatePlayer.ChangeMoney(parseInt(result[key])));
                        break;
                    case "LowestSkill":
                        for (let i = 0; i < parseInt(result[key]); i++) {
                            currentPlayer.Broadcast(broadcasts.BroadcastTemplateSkills.ChangeSkillLevel(currentPlayer.FindComponent("PlayerSkills").GetLowestSkill(),(parseInt(result[key]) > 0) ? "Increase" : "Decrease", false));
                        }
                        break;
                    case "Shield": 
                        currentPlayer.Broadcast(broadcasts.BroadcastTemplateSkills.ChangeCurrentShield(parseInt(result[key]) > 0 ? "Increase" : "Decrease", parseInt(result[key])));
                        break;
                    case "RngSkill":
                        let rngSkill = currentPlayer.FindComponent("PlayerSkills").GetRandomSkill();
                         for (let i = 0; i < Math.abs(parseInt(result[key])); i++) {
                            currentPlayer.Broadcast(broadcasts.BroadcastTemplateSkills.ChangeSkillLevel(rngSkill,(parseInt(result[key]) > 0) ? "Increase" : "Decrease", false));
                        }
                        break;
                    case "Combat":
                        for (let i = 0; i < parseInt(result[key]); i++) {
                            currentPlayer.Broadcast(broadcasts.BroadcastTemplateSkills.ChangeSkillLevel(player_skills.Skill.Combat(), (parseInt(result[key]) > 0) ? "Increase" : "Decrease", false));
                        }
                        break;
                    case "Defense":
                        for (let i = 0; i < parseInt(result[key]); i++) {
                            currentPlayer.Broadcast(broadcasts.BroadcastTemplateSkills.ChangeSkillLevel(player_skills.Skill.Defense(), (parseInt(result[key]) > 0) ? "Increase" : "Decrease", false));
                        }
                        break;
                    case "Alchemy":
                        for (let i = 0; i < parseInt(result[key]); i++) {
                            currentPlayer.Broadcast(broadcasts.BroadcastTemplateSkills.ChangeSkillLevel(player_skills.Skill.Alchemy(), (parseInt(result[key]) > 0) ? "Increase" : "Decrease", false));
                        }
                        break;
                    case "Special":
                        for (let i = 0; i < parseInt(result[key]); i++) {
                            currentPlayer.Broadcast(broadcasts.BroadcastTemplateSkills.ChangeSkillLevel(player_skills.Skill.Special(), (parseInt(result[key]) > 0) ? "Increase" : "Decrease", false));
                        }
                        break;
                    case "RandomTrack":
                        let randomRegion = [region.Region.River(), region.Region.Forest(), region.Region.Mountain()][Math.floor(Math.random() * 3)];
                        switch(randomRegion.toIdentifier()) {
                            case "Forest":
                                currentPlayer.Broadcast(broadcasts.BroadcastTemplatePlayer.AddStatus(status_templates.StatusTemplates.forestTracker(), "permanent"));
                                break;
                            case "Mountain":
                                currentPlayer.Broadcast(broadcasts.BroadcastTemplatePlayer.AddStatus(status_templates.StatusTemplates.mountainTracker(), "permanent"));
                                break;
                            case "River":
                                currentPlayer.Broadcast(broadcasts.BroadcastTemplatePlayer.AddStatus(status_templates.StatusTemplates.riverTracker(), "permanent"));
                                break;
                        }
                        break;
                    case "HandCard":
                        if (parseInt(result[key]) < 0) {
                            currentPlayer.Broadcast(broadcasts.BroadcastTemplateCards.DiscardRandomCard());
                        }
                        break;
                    case "Phase3Draw":
                        currentPlayer.Broadcast(parseInt(result[key]) < 0 ? broadcasts.BroadcastTemplatePlayer.AddStatus(status_templates.StatusTemplates.drawLessCards(status_options.Timing.EndOfTurn(), Math.abs(parseInt(result[key]))), "temporary") : broadcasts.BroadcastTemplatePlayer.AddStatus(status_templates.StatusTemplates.drawMoreCards(status_options.Timing.EndOfTurn(), parseInt(result[key])), "temporary"));
                        break;
                    default:
                        break;
                }
            }
        }



        #onBtnClickMeditate(){
            if  (!(document.getElementById("meditate-option").classList.contains("option--disabled"))) {
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
        }

        #onBtnClickCombat(){
            if  (!(document.getElementById("combat-option").classList.contains("option--disabled"))) {
                this.#onPhaseTwoEnd({});
                let player = this.FindComponent("GameManager").currentPlayer;
                let monster = this.FindComponent("GameManager").GetLocalMonster();
                this.FindEntity("BattleEntity").Broadcast(broadcasts.BroadcastTemplateBattle.StartBattle(player, monster));
            }
        }

        #onPhaseTwoEnd(){
            document.getElementById("explorartion-window").style.display = "none";
            document.getElementById("phase-two-options-menu").style.display = "none";
            document.getElementById("explore-confirm-btn").style.display = "none";
            document.getElementById("explore-Options-Btn").style.display = "flex";
            document.getElementById("explorartion-window").classList.remove("explore--city", "explore--wilderness");
            document.getElementById("meditate-option").classList.add("option--disabled");
            document.getElementById("fight-monster-option").classList.add("option--disabled");
        }

    }
    return {
        PhaseTwoUiComponent : PhaseTwoUiComponent
    }
})();