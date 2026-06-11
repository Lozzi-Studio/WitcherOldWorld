import { broadcasts } from "../Interfaces/broadcasts";
import { component } from "../Interfaces/component";


export const monster_ai = (() => {

    class MonsterAi extends component.Component{

        constructor() {
            super();
        }

        /**
         * Choose the next move for the monster
         * @returns {int}
         */
        ChooseNextMove() {
            this.Broadcast(broadcasts.BroadcastTemplateCards.DrawCard("Deck", 1));
            let damage = 0;
            if (Math.floor(Math.random() * 2) >= 1) {
                damage = this.FindComponent("Carddeck").hand[0]["OptionA"];
            } else {
                damage = this.FindComponent("Carddeck").hand[0]["OptionB"];
            }
            this.Broadcast(broadcasts.BroadcastTemplateCards.DiscardCard(this.FindComponent("Carddeck").hand[0], "Discard"));
            return damage;
        }
    }

    return {
        MonsterAi : MonsterAi
    }
}) ();