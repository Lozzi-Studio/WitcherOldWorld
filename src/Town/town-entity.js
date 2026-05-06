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
        #neighboringTowns;

        /**
         * 
         * @param {int} id 
         * @param {string} town_name 
         * @param {town_options.TownAbility} ability 
         * @param {THREE.Vector3} position 
         * @param {region.Region} region 
         * @param {THREE.Vector3} size 
         * @param {Array<int>} neighboringTowns
         */
        constructor(id, town_name, ability, position, region, size, neighboringTowns) {
            super();
            this.#id = id;
            this.#town_name = town_name;
            this.#ability = ability;
            this.#position = position;
            this.#region = region;
            this.#size = size;
            this.#neighboringTowns = neighboringTowns;
        }

        InitComponents() {
            this.AddComponent(new town_properties.TownProperties(this.#ability, this.#region,this.#neighboringTowns));
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