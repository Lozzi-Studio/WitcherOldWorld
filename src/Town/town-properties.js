import { component } from "../Interfaces/component";
import { town_options } from "./town-options";
import { card_options } from "../Cards/card-options";
import * as THREE from 'three';


export const town_properties = (() => {

    class TownProperties extends component.Component{

        #ability;
        #region;

        /**
         * @param {town_options.TownAbility} ability  
         * @param {region.Region} region
         */
        constructor(ability, region) {
            super();
            this.#ability = ability;
            this.#region = region;

        }

        InitComponent() {
            this._RegisterHandler('town.action', (msg) => {this.#executeAbility(msg)});
        }

        /**
         * 
         * @param {object} msg 
         */
        #executeAbility(msg) {
            if (msg.town.id == this._parent.id){

                let player = this._parent.FindComponent("GameManager").currentPlayer;
                player.Broadcast(this.#ability.trigger);
            }
        }

        /**
         * 
         * @param {Array<card.Card>} cards 
         * @returns 
         */
        canEnter(cards) {
            for (let card of cards) {
                if (card.region.toIdentifier() == this.#region.toIdentifier() || this.#region.toIdentifier() == "Joker"){
                    return {condition: true, card: card};
                }
            }
            return {condition: false}
        }

    }

    return {
        TownProperties : TownProperties
    }
}) ();