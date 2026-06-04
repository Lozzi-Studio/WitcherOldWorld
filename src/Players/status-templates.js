import { player_status } from "../player-status.js"

export const stati = (() => {

    class StatusTemplates {

        /**
         * Get status template for status "status name"
         * @param {amount} int 
         * @returns {object}
         */
        static drawLessCards(amount){
            return {"name": "drawLessCards","amount":amount}
        }

        /**
         * Get status template for status "status name"
         * @param {amount} int 
         * @returns {object}
         */
        static drawMoreCards(amount){
            return {"name": "drawMoreCards","amount":amount}
        }

    }

    return {
        StatusTemplates : StatusTemplates
    }
}) ();