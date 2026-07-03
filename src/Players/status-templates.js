import { player_status } from "./player-status.js";
import { status_options } from "./status-options.js";

export const status_templates = (() => {

    class StatusTemplates {

        /**
         * Get status template for status "status name"
         * @param {Timing} timing
         * @param {amount} int 
         * @returns {object}
         */
        static drawLessCards(timing, amount=0){
            return {"type": "drawLessCards", "timing": timing, "amount":amount}
        }

        /**
         * Get status template for status "status name"
         * @param {Timing} timing
         * @param {amount} int 
         * @returns {object}
         */
        static drawMoreCards(timing, amount){
            return {"type": "drawMoreCards","timing": timing, "amount":amount}
        }

        static forestTracker() {
            return {"type": "forestTracker","timing": status_options.Timing.InCombat(), "amount":1}
        }

        static riverTracker() {
            return {"type": "riverTracker","timing": status_options.Timing.InCombat(), "amount":1}
        }

        static mountainTracker() {
            return {"type": "mountainTracker","timing": status_options.Timing.InCombat(), "amount":1}
        }

    }

    return {
        StatusTemplates : StatusTemplates
    }
}) ();