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
            broadcasts.BroadcastTemplateSkills.ChangeSkillLevel(skill, "Increase", false)
        );}

        static increaseSkillForMoney(skill) {return new TownAbility("Erhoehe Attribut", 
            "Du kannst einen Skill um eine Stufe erhöhen. Zahle Gold entsprechender der neuen Stufe. Die Spezialitaet laesst sich nur in deiner Heimatstadt erhoehen.",
            broadcasts.BroadcastTemplateSkills.ChangeSkillLevel(skill, "Increase", true)
        );}

        static getPotion() {
            return new TownAbility("Bekomme einen Trank", "Du bekommst einen Trank, wenn dein Tranklimit das zulässt.",
                broadcasts.BroadcastTemplateCards.DrawCard(1, "Potion")
            );
        }


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