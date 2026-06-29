import { component } from "../Interfaces/component";
import { town_options } from "./town-options";
import { card_options } from "../Cards/card-options";
import * as THREE from 'three';
import { broadcasts } from "../Interfaces/broadcasts";


export const town_properties = (() => {

    class TownProperties extends component.Component{

        #ability;
        #region;
        #neighboringTowns;
        #abilityExecuted;

        /**
         * A tracker for town properties
         * @param {town_options.TownAbility} ability  
         * @param {region.Region} region
         */
        constructor(ability, region, neighboringTowns) {
            super();
            this.#ability = ability;
            this.#region = region;
            this.#neighboringTowns = neighboringTowns;
            this.#abilityExecuted = false;
        }

        /**
         * Used to intialize and add any default components/events
         */
        InitComponent() {
            this._RegisterHandler('town.action', (msg) => {this.#ExecuteAbility(msg)});
            this._RegisterHandler('town.resetAction', (msg) => {this.#ResetAbilityExecution(msg)});
        }

        /**
         * Triggers town ability and sets "executed" parameter to true
         * @param {object} msg 
         */
        #ExecuteAbility(msg) {
            if (this.#abilityExecuted == false) {
                switch(this.#ability.target.toIdentifier()) {
                    case "Game":
                        this.FindEntity('GameArea').FindComponent('GameManager').Broadcast(this.#ability.trigger);
                        break;
                    case "Player":
                        this.FindEntity('GameArea').FindComponent('GameManager').currentPlayer.Broadcast(this.#ability.trigger);
                        break;
                }
                this.#abilityExecuted = true;
            }
            this.FindEntity("GameArea").FindComponent("UIManager").Broadcast(broadcasts.BroadcastTemplateTown.UpdateButtonActive(false));
        }

        /**
         * Set "executed" parameter to false
         * @param {object} msg 
         */
        #ResetAbilityExecution(msg) {
            this.#abilityExecuted = false;
            this.FindEntity("GameArea").FindComponent("UIManager").Broadcast(broadcasts.BroadcastTemplateTown.UpdateButtonActive(true));
        }

        /**
         * Returns a bool if the card allows to enter this town
         * @param {card.Card} card
         * @returns {bool} 
         */
        canEnter(card) {
            return (card.region.equals(this.#region) || this.#region.toIdentifier() == "Joker");
        }

        canUseAbility() {
            if (this.#ability.trigger.topic == 'skill.changeLevel') {
                return this.FindEntity("GameArea").FindComponent("GameManager").currentPlayer.FindComponent("PlayerSkills").canIncrease(this.#ability.trigger.skill);
            } 
            if (this.#ability.trigger.topic == 'card.drawCard') {
                return this.FindEntity("GameArea").FindComponent("GameManager").currentPlayer.FindComponent("Carddeck").potion.length < 4;
            }
            return true
        }

        /**
         * 
         * @returns {bool}
         */
        get abilityExecuted() {
            return this.#abilityExecuted;
        }
    }

    return {
        TownProperties : TownProperties
    }
}) ();