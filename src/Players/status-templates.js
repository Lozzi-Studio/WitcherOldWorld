import { player_status } from "./player-status.js";

export const status_templates = (() => {

    class StatusTemplates {

        /**
         * Get status template for status "status name"
         * @param {timing} string - "phaseThree", "battle"
         * @param {amount} int 
         * @returns {object}
         */
        static drawLessCards(timing, amount){
            return {"type": "drawLessCards", "timing": timing, "amount":amount}
        }

        /**
         * Get status template for status "status name"
         * @param {timing} string - "phaseThree", "battle"
         * @param {amount} int 
         * @returns {object}
         */
        static drawMoreCards(timing, amount){
            return {"type": "drawMoreCards","timing": timing, "amount":amount}
        }

    }

    return {
        StatusTemplates : StatusTemplates
    }
}) ();