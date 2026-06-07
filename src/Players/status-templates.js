import { player_status } from "./player-status.js";
import { status_options } from "./status-options.js";

export const status_templates = (() => {

    class StatusTemplates {

        /**
         * Get status template for status "status name"
         * @param {string} type
         * @param {Timing} timing
         * @param {amount} int 
         * @returns {object}
         */
        static drawLessCards(timing, amount=0){
            return {"type": "drawLessCards", "timing": timing, "amount":amount}
        }

        /**
         * Get status template for status "status name"
         * @param {string} type
         * @param {Timing} timing
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