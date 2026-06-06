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
                    status => status.type === msg.status.type && status.timing.toIdentifier() === msg.status.timing.toIdentifier());
                if (existingStatus) {
                    existingStatus.amount += msg.status.amount;
                    return; 
                }
                this.#temporaryStatusList.push(msg.status);
                return;
            }
            if(msg.mode === "permanent"){
                const existingStatus = this.#permanentStatusList.find(
                    status => status.type === msg.status.type && status.timing.toIdentifier() === msg.status.timing.toIdentifier());
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
         * @param {string} type 
         * @param {Timing} timing
         * @returns {int | None}
         */
        GetStatusAmount(type, timing){
            const matchingStatusTemporary =  this.#temporaryStatusList.find(status => status.type === type && status.timing.toIdentifier() === timing.toIdentifier());
            const matchingStatusPermanent =  this.#permanentStatusList.find(status => status.type === type && status.timing.toIdentifier() === timing.toIdentifier());
            
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
        
    }
    
    return {
        PlayerStatus : PlayerStatus
    }
}) ();