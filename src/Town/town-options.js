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

        /**
         * @param {player_skills.Skill} skill 
         * @returns {TownAbility}
         */
        static increaseSkillForMoney() {return new TownAbility("Erhoehe Attribut", 
            "Du kannst einen Skill um eine Stufe erhöhen. Zahle Gold entsprechender der neuen Stufe. Die Spezialitaet laesst sich nur in deiner Heimatstadt erhoehen.",
            //TODO
            broadcasts.BroadcastTemplateSkills.ChangeSkillLevel("Increase", true)
        );}

        /**
         * @returns {TownAbility}
         */
        static getPotion() {
            return new TownAbility("Bekomme einen Trank", "Du bekommst einen Trank, wenn dein Tranklimit das zulässt.",
                broadcasts.BroadcastTemplateCards.DrawCard(1, "Potion")
            );
        }

        /**
        * @returns {TownAbility}
        */
        static playWuerfelpoker() {
            return new TownAbility("Spiele Wuerfelpoker", "Du spielst Wuerfelpoker. Wenn du gewinnst erhaelst du 3 Gold. Bei einer Niederlage verlierst du 1 Gold",
                broadcasts.BroadcastTemplateGame.StartWuerfelpoker()
            );
        }

        static getGeruechte() {
            return new TownAbility("Bekomme ein Geruecht", "Erhalte 1 Gold und erhalte danach ein Geruecht. Beim Einsammeln dieses erhaelts du noch ein Gold.",
                broadcasts.BroadcastTemplateGame.GetGeruecht()
            );
        }

        static removeShopCards() {
            return new TownAbility("Entferne Karten im Shop", "Erhalte 1 Gold, falls du kein Gold hast und ersetze danach bis zu 2 Karten im Shop",
                broadcasts.BroadcastTemplateGame.RemoveShopCards()  
            );
        }

        static swapoutCard() {
            return new TownAbility("Kartentausch", "Entferne eine Karte aus deiner Hand. Fuege eine neue Karte aus dem die Shop hinzu die bis zu eins mehr kostet als die alte Karte.",
                broadcasts.BroadcastTemplateGame.SwapoutCard()
            );
        }


        /**
         * Use static function constructor instead of default constructor!
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