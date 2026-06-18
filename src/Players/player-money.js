import { component } from "../Interfaces/component";
import { broadcasts } from "../Interfaces/broadcasts";

export const player_money = (() => {
    
    class MoneyStorage extends component.Component{
        #amount;

        /**
         * A tracker for player money
         * @param {int} amount 
         */
        constructor(amount) {
            super();
            this.#amount = parseInt(amount);
        }

        /**
         * Used to intialize and add any default components/events
         */
        InitComponent() {
            this._RegisterHandler('player.changeMoney', (msg) => {this.#ChangeMoney(msg)});
        }

        /**
         * Change the money of the player by the given amount
         * @param {object} msg 
         */
        #ChangeMoney(msg) {
            if (msg.amount > 0) {
                this.Add(msg.amount);
            } else {
                this.Subtract(Math.abs(msg.amount));
            }
            this.FindEntity("GameArea").Broadcast(broadcasts.BroadcastTemplatePlayer.UpdateUI());
        }

        /**
         * Add money to storage
         * @param {int} amount 
         */
        Add(amount) {
            this.#amount += amount;
        }

        /**
         * Subtract money from storage
         * @param {int} amount 
         */
        Subtract(amount) {
            if (this.CanPay(amount)) {
                this.#amount -= Math.abs(amount);
            } else {
                this.#amount = 0;
            }
        }

        /**
         * Returns a bool if a player can pay the cost
         * @param {int} costs 
         * @returns {bool}
         */
        CanPay(costs) {
            return (this.#amount >= costs);
        }

        get amount(){
            return this.#amount;
        }
    }

    return {
        MoneyStorage : MoneyStorage
    }
}) ();