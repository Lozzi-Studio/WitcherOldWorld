import { component } from "../Interfaces/component";

export const player_money = (() => {
    
    class MoneyStorage extends component.Component{
        #amount;

        constructor(amount) {
            super();
            this.#amount = amount;
        }

        InitComponent() {
            this._RegisterHandler('player.change_money', (msg) => {this.#ChangeMoney(msg)});
        }


        #ChangeMoney(msg) {
            console.log("Amount: " + msg.amount)
            if (msg.amount > 0) {
                this.Add(msg.amount);
            } else {
                this.Subtract(msg.amount);
            }
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