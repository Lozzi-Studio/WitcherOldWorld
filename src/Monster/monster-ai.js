import { broadcasts } from "../Interfaces/broadcasts";
import { component } from "../Interfaces/component";


export const monster_ai = (() => {

    class MonsterAi extends component.Component{

        constructor() {
            super();
        }

        /**
         * Choose the next move for the monster
         * @returns {object}
         */
        ChooseNextMove() {
            this.Broadcast(broadcasts.BroadcastTemplateCards.DrawCard("Deck", 1));
            let effect = {};
            if (Math.floor(Math.random() * 2) >= 1) {
                effect = this.FindComponent("Carddeck").hand[0]["OptionA"];
            } else {
                effect = this.FindComponent("Carddeck").hand[0]["OptionB"];
            }
            if (effect.level != []) {
                effect.level = effect.level[this.FindComponent("MonsterProperty").rank-1]
            }
            this.Broadcast(broadcasts.BroadcastTemplateCards.DiscardCard(this.FindComponent("Carddeck").hand[0], "Discard"));
            return effect;
        }
    }

    return {
        MonsterAi : MonsterAi
    }
}) ();