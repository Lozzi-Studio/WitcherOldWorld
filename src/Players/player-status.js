import { component } from "../Interfaces/component";
import { broadcasts } from "../Interfaces/broadcasts";
import { status_templates } from "./status-templates"

export const player_status = (() => {
    
    class PlayerStatus extends component.Component{
        #temporaryStatusList;  
        #permanentStatusList;       

        /**
         * A tracker for player status
         */
        constructor() {
            super();
            this.#temporaryStatusList = [];
            this.#permanentStatusList = [];
        }

        InitComponent() {
            this._RegisterHandler('player.addStatus', (msg) => {this.#AddTemporaryStatus(msg);});
            this._RegisterHandler('player.clearAllTemporaryStatuses', (msg) => {this.#ClearAllTemporaryStatuses();});
            this._RegisterHandler('player.getStatus', (msg) => {this.#GetStatus(msg);});
        }

        #AddTemporaryStatus(msg){
            const existingStatus = this.#temporaryStatusList.find(status => status.type === msg.type);
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
            this.#temporaryStatusList.push(newStatus);
        };

        #GetStatus(msg){
            return this.#temporaryStatusList.find(status => status.type === msg.type);
        };

        #ClearAllTemporaryStatuses(){
            #statusList = [];
        }
        
    }
    
    return {
        PlayerStatus : PlayerStatus
    }
}) ();