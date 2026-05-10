import { hitbox_component } from "../GameArea/hitbox-component";
import { entity } from "../Interfaces/entity";
import { town_properties } from "./town-properties";
import { region } from "../GameArea/region";
import * as THREE from 'three';


export const town_entity = (() => {


    class TownEntity extends entity.Entity{
        #id;
        #town_name;
        #ability;
        #position;
        #region;
        #size;

        /**
         * A wrapper for towns
         * @param {int} id 
         * @param {string} town_name 
         * @param {town_options.TownAbility} ability 
         * @param {THREE.Vector3} position 
         * @param {region.Region} region 
         * @param {THREE.Vector3} size 
         */
        constructor(id, town_name, ability, position, region, size) {
            super();
            this.#id = id;
            this.#town_name = town_name;
            this.#ability = ability;
            this.#position = position;
            this.#region = region;
            this.#size = size;
        }

        /**
         * Used to intialize and add any default components/events
         */
        InitComponents() {
            this.AddComponent(new town_properties.TownProperties(this.#ability, this.#region));
            this.AddComponent(new hitbox_component.CubicHitbox(this.#position, "Town_" + this.#id, this.#size));
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
        
        get region() {
            return this.#region;
        }


    }

    return {
        TownEntity : TownEntity
    }
}) ();