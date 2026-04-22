import { broadcasts } from "../Interfaces/broadcasts";

export const town_options = (() => {

    class TownAbility {
        #name;
        #tooltip;
        #trigger;

        //TODO Implement COndition to Town Ability; Perfectly this is done in frontend by disabling the confirm button
        /**
         * @param {player_skills.Skill} skill 
         * @returns {TownAbility}
         */
        static increaseSkill(skill) {return new TownAbility("Erhoehe Attribut", 
            "Wenn deine Attributslevel gleich oder kleiner als dein Hexerlevel ist, kannst du das Level um 1 erhoehen.",
            broadcasts.BroadcastTemplateSkills.ChangeSkillLevel(skill, "Increase")
        );}

        /**
         * 
         * @param {string} name 
         * @param {string} tooltip 
         * @param {object} trigger 
         */
        constructor(name, tooltip, trigger) {
            this.#name = name;
            this.#tooltip = tooltip;
            this.#trigger = trigger;
        }

        get trigger() {
            return this.#trigger;
        }
        
        get name(){
            return this.#name;
        }

        get tooltip() {
            return this.#tooltip;
        }
    }

    return {
        TownAbility : TownAbility
    }
}) ();