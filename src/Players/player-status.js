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
            this._RegisterHandler('player.clearAllStatuses', (msg) => {this.#ClearAllStatuses();});
        }

        #AddStatus(msg){
            //TODO: Template File für stati > Bezeichner (topic): name > amount: anzahl
            // newStatus = {'name': msg.name, 'amount': msg.amount}
            // #statusList.append(newStatus);
        };

        #GetStatus(statusName){
            // for every status in statusList
                // if status == status name
                    // amount += status.amount
                    // return amount
            // return None
        };

        #ClearAllStatuses(){
            #statusList = [];
        }
        
    }
    
    return {
        PlayerStatus : PlayerStatus
    }
}) ();