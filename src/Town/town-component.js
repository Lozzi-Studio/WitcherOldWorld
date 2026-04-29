import { component } from "../Interfaces/component";
import { town_options } from "./town-options";
import { card_options } from "../Cards/card-options";
import * as THREE from 'three';
import { region } from "../GameArea/region";

export const town_component = (() => {

    class Town extends component.Component{
        #id
        #town_name;
        #ability;
        #position;
        #region;
        #hitbox;

        /**
         * @param {int} id
         * @param {string} town_name 
         * @param {town_options.TownAbility} ability 
         * @param {THREE.Vector3} position 
         * @param {region.Region} region
         */
        constructor(id, town_name, ability, position, region) {
            super();
            this.#id = id;
            this.#town_name = town_name;
            this.#ability = ability;
            this.#position = position;
            this.#region = region;
            this.#hitbox = undefined;

        }

        InitComponent() {
            this._RegisterHandler('town.action', (msg) => {this.#executeAbility(msg)});
            this.#createHitbox();
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

        #createHitbox(){
            const geometry = new THREE.BoxGeometry( 2.7, 2.7, 2.7 );
            const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
            const cube = new THREE.Mesh( geometry, material );
            cube.name = "Town_" + this.#id;
            cube.visible = false;
            cube.position.copy(this.#position);
            cube.position.y = (2.7 / 2 );
            this._parent.scene.add( cube );
            this.#hitbox = cube;
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

        get id() {
            return this.#id;
        }

        get town_name() {
            return this.#town_name;
        }

        get position() {
            return this.#position;
        }

        get hitbox() {
            return this.#hitbox;
        }
    }

    return {
        Town : Town
    }
}) ();