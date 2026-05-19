import { broadcasts } from "../Interfaces/broadcasts";
import { component } from "../Interfaces/component";

export const player_skills = (() => {

    class PlayerSkills extends component.Component{
        #combat;
        #defense;
        #alchemy;
        #special;
        #witcher;

        /**
         * A component to track skills from player
         */
        constructor() {
            super();
            this.#combat = Skill.Combat();
            this.#defense = Skill.Defense();
            this.#alchemy = Skill.Alchemy();
            this.#special = Skill.Special();
            this.#witcher = Skill.Witcher();
        }

        /**
         * Used to intialize and add any default components/events
         */
        InitComponent() {
            this._RegisterHandler('skill.changeLevel', (msg) => {this.#ChangeLevel(msg)});
        }

        /**
         * Increase or decrease skill level by 1
         * @param {object} msg 
         */
        #ChangeLevel(msg) {
            let skill = null;
            switch(msg.skill.toIdentifier()) {
                case "Combat":
                    skill = this.#combat;
                    break;
                case "Defense":
                    skill = this.#defense;
                    break;
                case "Alchemy":
                    skill = this.#alchemy;
                    break;
                case "Special":
                    skill = this.#special;
                    break;
            }
            switch(msg.mode) {
                case "Increase":
                    if (msg.payMoney && skill?.maxAmount != skill?.level) {
                        this.parent.Broadcast(broadcasts.BroadcastTemplatePlayer.ChangeMoney(- (skill.level + 1)));
                    }
                    skill?.increaseLevel();
                    if (this.#combat.level > this.#witcher.level && this.#defense.level > this.#witcher.level && this.#alchemy.level > this.#witcher.level && this.#special.level > this.#witcher.level) {
                        this.#witcher.increaseLevel();
                        if (this.#witcher.level < 3) {
                            this.Broadcast(broadcasts.BroadcastTemplateCards.DrawCard("Deck", 1));
                        } else {
                            this.Broadcast(broadcasts.BroadcastTemplateCards.DrawCard("Deck", 2));
                        }
                    } else if (skill.toIdentifier() == "Alchemy") {
                        this.Broadcast(broadcasts.BroadcastTemplateCards.DrawCard("Potion", 1));
                    } else if (skill.toIdentifier() == "Defense") {
                        this.Broadcast(broadcasts.BroadcastTemplateSkills.ChangeShield("Increase", this.#defense.level, 1))
                    }
                    break;
                case "Decrease":
                    skill?.decreaseLevel();
                    if (skill.toIdentifier() == "Defense") {
                        this.Broadcast(broadcasts.BroadcastTemplateSkills.ChangeShield("Decrease", this.#defense.level, -1))
                    }
                    break;
            }
            this.FindEntity("GameArea").Broadcast(broadcasts.BroadcastTemplateSkills.UpdateUI());
        }

        canMeditate(){
            return {
                "Combat": this.#combat.canMeditate(),
                "Alchemy" : this.#alchemy.canMeditate(),
                "Special":  this.#special.canMeditate(),
                "Defense": this.#defense.canMeditate(), 
            }
        }

        #OnMeditate(msg) {
            switch(msg){
                case "Combat":
                    this.#combat.meditated();
                case "Alchemy":
                    this.#alchemy.meditated();
                case "Special":
                    this.#special.meditated();
                case "Defense":
                    this.#defense.meditated();
            }
        }




        get combat() {
            return this.#combat;
        }

        get defense() {
            return this.#defense;
        }

        get alchemy() {
            return this.#alchemy;
        }

        get special() {
            return this.#special;
        }

        get witcher() {
            return this.#witcher;
        }
    }

    class Skill {
        #name;
        #level;
        #minLevel;
        #maxLevel;
        #hasMeditated;
        
        static Combat() {return new Skill("Combat")};
        static Defense() {return new Skill("Defense")};
        static Alchemy() {return new Skill("Alchemy")};
        static Special() {return new Skill("Special")};
        static Witcher() {return new Skill("Witcher")};

        /**
         * An enum class to determine skill
         * Use static function constructor instead of default constructor! 
         * @param {string} name 
         */
        constructor(name) {
            this.#name = name;
            this.#minLevel = 1;
            this.#maxLevel = 5;
            this.#level = this.#minLevel;
            this.#hasMeditated = false;
        }

        /**
         * Increase level of skill by 1
         */
        increaseLevel() {
            if (this.#level < this.#maxLevel) {
                this.#level += 1;
            }
        }

        /**
         * Decreases level of skill by 1
         */
        decreaseLevel() {
            if (this.#level > this.#minLevel) {
                this.#level -= 1;
            }
        }

        get level() {
            return this.#level;
        }

        canMeditate() {
            return this.#level == this.#maxLevel && !(this.#hasMeditated)
        }

        meditated() {
            this.#hasMeditated = true;
            this.Broadcast(broadcasts.BroadcastTemplatePlayer.AddTrophy)
        }



         /**
         * Get identifier of enum
         * @returns {string}
         */
        toIdentifier() {
            return this.#name;
        }
    }

    class Shield extends component.Component {
        #amount;
        #maxAmount;

        /**
         * A tracker for player shields
         */
        constructor() {
            super();
            this.#amount = 0;
            this.#maxAmount = 1;
        }

        /**
         * Used to intialize and add any default components/events
         */
        InitComponent() {
            this._RegisterHandler('skill.changeShield', (msg) => {this.#ChangeShield(msg)});
            this._RegisterHandler('skill.changeCurrentShield', (msg) => {this.#ChangeShield(msg)});
        }

        /**
         * Increases or decreases shield by 1
         * @param {object} msg 
         */
        #ChangeShield(msg) {
            switch(msg.mode) {
                case "Increase":
                    if(msg.level) {
                        if(msg.level > this.#maxAmount && msg.level < 5) {
                            this.#maxAmount = msg.level;
                        }
                    }
                    if (this.#amount < this.#maxAmount) {
                        if (this.#amount + msg.amount > this.#maxAmount) {
                            this.#amount = this.#maxAmount;
                        } else {
                            this.#amount += msg.amount;
                        }
                    }
                    break;
                case "Decrease":
                    if (msg.amount == -1) {
                        this.#maxAmount -= 1;
                        if (this.#amount > this.#maxAmount) {
                            this.#amount = this.#maxAmount;
                        }
                    } else if (this.#amount > 0) {
                        if (this.#amount - msg.amount < 0) {
                            this.#amount = 0;
                        } else {
                            this.#amount -= msg.amount;
                        }
                    }
                    break;
            }
            this.FindEntity("GameArea").Broadcast(broadcasts.BroadcastTemplateSkills.UpdateUI());
        }

    

        get amount() {
            return this.#amount;
        }

        get maxAmount() {
            return this.#maxAmount;
        }
    }

    return {
        PlayerSkills : PlayerSkills,
        Skill : Skill,
        Shield : Shield
    }
})();