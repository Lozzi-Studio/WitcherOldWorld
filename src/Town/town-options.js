import { broadcasts } from "../Interfaces/broadcasts";
import { rewards } from "../GameObjects/rewards";

export const town_options = (() => {

    class TownAbility {
        #name;
        #tooltip;
        #trigger;
        #target;

        /**
         * @param {player_skills.Skill} skill 
         * @returns {TownAbility}
         */
        static increaseSkill(skill) {return new TownAbility("Erhoehe Attribut", 
            "Wenn deine Attributslevel gleich oder kleiner als dein Hexerlevel ist, kannst du das Level um 1 erhoehen.",
            broadcasts.BroadcastTemplateSkills.ChangeSkillLevel(skill, "Increase", false),
            town_options.TownAbilityTarget.Player()
        );}

        /**
         * @returns {TownAbility}
         */
        static increaseSkillForMoney() {return new TownAbility("Erhoehe beliebiges Attribut gegen Geld", 
            "Du kannst einen Skill um eine Stufe erhöhen. Zahle Gold entsprechender der neuen Stufe. Die Spezialitaet laesst sich nur in deiner Heimatstadt erhoehen.",
            broadcasts.BroadcastTemplateSkills.ChooseSkillToIncrease(true),
            town_options.TownAbilityTarget.Game()
        );}

        /**
         * @returns {TownAbility}
         */
        static getPotion() {
            return new TownAbility("Bekomme einen Trank", "Du bekommst einen Trank, wenn dein Tranklimit das zulässt.",
                broadcasts.BroadcastTemplateCards.DrawCard( "Potion", 1),
                town_options.TownAbilityTarget.Player()
            );
        }

        /**
        * @returns {TownAbility}
        */
        static playWuerfelpoker() {
            return new TownAbility("Spiele Wuerfelpoker", "Du spielst Wuerfelpoker. Wenn du gewinnst erhaelst du 3 Gold. Bei einer Niederlage verlierst du 1 Gold",
                broadcasts.BroadcastTemplateGame.StartWuerfelpoker(),
                town_options.TownAbilityTarget.Game()
            );
        }

        /**
        * @returns {TownAbility}
        */
        static getGeruechte() {
            return new TownAbility("Bekomme ein Geruecht", "Erhalte 1 Gold und erhalte danach ein Geruecht. Beim Einsammeln dieses erhaeltst du noch ein Gold.",
                broadcasts.BroadcastTemplateGame.ChooseRegion("Rumor", broadcasts.BroadcastTemplatePlayer.GetRumor),
                town_options.TownAbilityTarget.Game()
            );
        }
        
        /**
        * @returns {TownAbility}
        */
        static removeShopCards() {
            return new TownAbility("Entferne Karten im Shop", "Erhalte 1 Gold, falls du kein Gold hast und ersetze danach bis zu 2 Karten im Shop",
                broadcasts.BroadcastTemplateGame.RemoveShopCards(),
                town_options.TownAbilityTarget.Game()
            );
        }

        /**
        * @returns {TownAbility}
        */
        static swapoutCard() {
            return new TownAbility("Kartentausch", "Entferne eine Karte aus deiner Hand. Fuege eine neue Karte aus dem die Shop hinzu die bis zu eins mehr kostet als die alte Karte.",
                broadcasts.BroadcastTemplateGame.SwapoutCard(),
                town_options.TownAbilityTarget.Game()
            );
        }


        /**
         * An enum class to determine town abilities
         * Use static function constructor instead of default constructor!
         * @param {string} name 
         * @param {string} tooltip 
         * @param {object} trigger 
         * @param {TownAbilityTarget} target
         */
        constructor(name, tooltip, trigger, target) {
            this.#name = name;
            this.#tooltip = tooltip;
            this.#trigger = trigger;
            this.#target = target;
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

        get target() {
            return this.#target;
        }
    }

    class TownAbilityTarget {
        #target;

        static Game() {return new TownAbilityTarget("Game");}

        static Player() {return new TownAbilityTarget("Player");}

        /**
         * An enum class to determine town abilities target
         * Use static function constructor instead of default constructor!
         * @param {string} target
         */
        constructor(target){
            this.#target = target;
        }

        /**
         * Get identifier of enum
         * @returns {string}
         */
        toIdentifier() {
            return this.#target;
        }
    }

    return {
        TownAbility : TownAbility,
        TownAbilityTarget : TownAbilityTarget
    }
}) ();