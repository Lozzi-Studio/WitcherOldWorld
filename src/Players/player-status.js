import { component } from "../Interfaces/component";
import { broadcasts } from "../Interfaces/broadcasts";

export const player_status = (() => {
    
    class PlayerStatus extends component.Component{
        #statusList;        

        /**
         * A tracker for player status
         */
        constructor() {
            super();
            #statusList = [];
        }

        InitComponent() {
            this._RegisterHandler('player.addStatus', (msg) => {this.#AddStatus(msg);});
        }

        #AddStatus(msg){
            // newStatus = {'name': msg.name, 'amount': msg.amount}
            // #statusList.append(newStatus);
            //TODO function for adding status
        };

        #GetStatus(statusName){
            // for every status in statusList
                // if status == status name
                    // amount += status.amount
                    // return amount
            // return None
            //TODO function for getting a specified status
        };
        
    }
}) ();