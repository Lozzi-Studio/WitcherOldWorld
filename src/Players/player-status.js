import { component } from "../Interfaces/component";
import { broadcasts } from "../Interfaces/broadcasts";
import { status_templates } from "./status-templates"
import { status_options } from "./status-options";

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
            this._RegisterHandler('player.addStatus', (msg) => {this.#AddStatus(msg);});
            this._RegisterHandler('game.nextRound', (msg) => {this.#ClearAllTemporaryStatuses();});
        }

        /**
         * Adds a temporary status to the temporary status list of the player
         * If the status already exists, the amount is increased by the incoming amount
         * @param {object} msg 
         * @returns
         */
        #AddStatus(msg){
            if(msg.mode === "temporary"){
                const existingStatus = this.#temporaryStatusList.find(
                    status => status.type === msg.status.type && status.timing.equals(msg.status.timing));
                if (existingStatus) {
                    existingStatus.amount += msg.status.amount;
                    return; 
                }
                this.#temporaryStatusList.push(msg.status);
                return;
            }
            if(msg.mode === "permanent"){
                const existingStatus = this.#permanentStatusList.find(
                    status => status.type === msg.status.type && status.timing.equals(msg.status.timing));
                if (existingStatus) {
                    existingStatus.amount += msg.status.amount;
                    return; 
                }
                this.#permanentStatusList.push(msg.status);
                return;
            }
        };

        /**
         * Gets a status by status type
         * @param {StatusTemplates} given_status
         * @returns {int | None}
         */
        GetStatusAmount(given_status){
            const matchingStatusTemporary =  this.#temporaryStatusList.find(status => status.type === given_status.type && status.timing.equals(given_status.timing));
            const matchingStatusPermanent =  this.#permanentStatusList.find(status => status.type === given_status.type && status.timing.equals(given_status.timing));

            const tempAmount = matchingStatusTemporary ? matchingStatusTemporary.amount : 0;
            const permAmount = matchingStatusPermanent ? matchingStatusPermanent.amount : 0;
            
            return tempAmount + permAmount;
        };

        /**
         * Clears the temporary status list
         */
        #ClearAllTemporaryStatuses(){
            this.#temporaryStatusList = [];
        }

        /**
         * Remove the given status from the permanent stati
         * @param {object} givenStatus 
         */
        RemovePermanentStatus(givenStatus) {
            let status = this.#permanentStatusList.find(status => status.type === givenStatus.type && status.timing.equals(givenStatus.timing));
            if (status && status.amount > 1) {
                status.amount -= 1;
            } else if (status){
                this.#permanentStatusList.splice(this.#permanentStatusList.indexOf(status), 1);
            }
        }
        
    }
    
    return {
        PlayerStatus : PlayerStatus
    }
}) ();