import { component } from "../Interfaces/component";
import { town_options } from "./town-options";
import { card_options } from "../Cards/card-options";
import * as THREE from 'three';


export const town_properties = (() => {

    class TownProperties extends component.Component{

        #ability;
        #region;
        #neighboringTowns;

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

        }

        /**
         * Used to intialize and add any default components/events
         */
        InitComponent() {
            this._RegisterHandler('town.action', (msg) => {this.#ExecuteAbility(msg)});
        }

        /**
         * Triggers town ability
         * @param {object} msg 
         */
        #ExecuteAbility(msg) {
            switch(this.#ability.target.toIdentifier()) {
                case "Game":
                    this.FindEntity('GameArea').FindComponent('GameManager').Broadcast(this.#ability.trigger);
                    break;
                case "Player":
                    this.FindEntity('GameArea').FindComponent('GameManager').currentPlayer.Broadcast(this.#ability.trigger);
                    break;
            }
        }

        /**
         * Returns a bool if the card allows to enter this town
         * @param {card.Card} card
         * @returns {bool} 
         */
        canEnter(card) {
            return (card.region.equals(this.#region) || this.#region.toIdentifier() == "Joker");
        }

    }

    return {
        TownProperties : TownProperties
    }
}) ();