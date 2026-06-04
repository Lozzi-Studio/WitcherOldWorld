import { component } from "../Interfaces/component";
import { broadcasts } from "../Interfaces/broadcasts";
import { status_templates } from "./status-templates"

export const player_status = (() => {
    
    class PlayerStatus extends component.Component{
        #statusList;        

        /**
         * A tracker for player status
         */
        constructor() {
            super();
            this.#statusList = [];
        }

        InitComponent() {
            this._RegisterHandler('player.addStatus', (msg) => {this.#AddStatus(msg);});
            this._RegisterHandler('player.clearAllStatuses', (msg) => {this.#ClearAllStatuses();});
        }

        #AddStatus(msg){
            const existingStatus = this.#statusList.find(status => status.type === msg.type);
            if (existingStatus && existingStatus.timing === msg.timing) {
                existingStatus.amount += msg.amount;
                return; 
            }
            let newStatus;
            switch(msg.type){
                case "drawLessCards":
                    newStatus = status_templates.StatusTemplates.drawLessCards(msg.timing, msg.amount);
                case "drawMoreCards":
                    newStatus = status_templates.StatusTemplates.drawMoreCards(msg.timing, msg.amount);
                    break;
                default:
                    console.warn(`Unknown status type: ${msg.type}`);
                    return;
            }
            this.#statusList.push(newStatus);
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