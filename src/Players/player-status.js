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
            this._RegisterHandler('game.nextRound', (msg) => {this.#ClearAllTemporaryStatuses();});
        }

        /**
         * Adds a temporary status to the temporary status list of the player
         * If the status already exists, the amount is increased by the incoming amount
         * @param {object} msg 
         * @returns
         */
        #AddTemporaryStatus(msg){
            const existingStatus = this.#temporaryStatusList.find(status => status.type === msg.status.type);
            if (existingStatus && existingStatus.timing === msg.status.timing) {
                existingStatus.amount += msg.status.amount;
                return;
            }
            this.#temporaryStatusList.push(msg.status);
        };

        /**
         * Gets a status by status type
         * @param {string} type 
         * @param {string} timing 
         * @returns {int | None}
         */
        GetStatusAmount(type, timing){
            const matchingStatus =  this.#temporaryStatusList.find(status => status.type === type && status.timing === timing);
            return matchingStatus ? matchingStatus.amount : None;
        };

        /**
         * Clears the temporary status list
         */
        #ClearAllTemporaryStatuses(){
            this.#temporaryStatusList = [];
        }
        
    }
    
    return {
        PlayerStatus : PlayerStatus
    }
}) ();