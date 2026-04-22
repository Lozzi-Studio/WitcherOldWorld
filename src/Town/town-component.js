import { component } from "../Interfaces/component";
import { town_options } from "./town-options";
import { card_options } from "../Cards/card-options";
import * as THREE from 'three';

export const town_component = (() => {

    class Town extends component.Component{
        #id
        #name;
        #ability;
        #position;
        #region

        /**
         * @param {int} id
         * @param {string} name 
         * @param {town_options.TownAbility} ability 
         * @param {THREE.Vector3} position 
         * @param {card_options.Region} region
         */
        constructor(id, name, ability, position, region) {
            super();
            this.#id = id;
            this.#name = name;
            this.#ability = ability;
            this.#position = position;
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
            if (msg.town.id == this.#id){

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
                if (card.region.toIdentifier() == this.#region.toIdentifier()){
                    return {condition: true, card: card};
                }
            }
            return {condition: false}
        }

        get id() {
            return this.#id;
        }

        get name() {
            return this.#name;
        }

        get position() {
            return this.#position;
        }
    }

    return {
        Town : Town
    }
}) ();