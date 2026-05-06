import { component } from "../Interfaces/component";
import { broadcasts } from "../Interfaces/broadcasts";

export const player_money = (() => {
    
    class MoneyStorage extends component.Component{
        #amount;

        constructor(amount) {
            super();
            this.#amount = amount;
        }

        InitComponent() {
            this._RegisterHandler('player.changeMoney', (msg) => {this.#ChangeMoney(msg)});
        }


        #ChangeMoney(msg) {
            if (msg.amount > 0) {
                this.Add(msg.amount);
            } else {
                this.Subtract(msg.amount);
            }
            this.FindEntity("GameArea").Broadcast(broadcasts.BroadcastTemplatePlayer.UpdateUI());
        }

        Add(amount) {
            this.#amount += amount;
        }

        Subtract(amount) {
            if (this.CanPay(amount)) {
                this.#amount -= amount;
            } else {
                this.#amount = 0;
            }
            console.log("Money was subtracted");
        }

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