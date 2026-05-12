import * as THREE from 'three';
import { component } from "../Interfaces/component";


export const hitbox_component = (() => {

    class CubicHitbox extends component.Component{
        #position;
        #hitbox;
        #id;
        #size

        /**
         * A component which generates a hitbox for raycasting
         * @param {THREE.Vector3} position 
         * @param {string} id 
         * @param {THREE.Vector3} size 
         */
        constructor(position, id, size){
            super();
            this.#position = position;
            this.#hitbox = undefined;
            this.#id = id;
            this.#size = size;
        }

        /**
         * Used to intialize and add any default components/events
         */
        InitComponent() {
            const geometry = new THREE.BoxGeometry( this.#size.x, this.#size.y, this.#size.z);
            const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
            const cube = new THREE.Mesh( geometry, material );
            cube.name = this.#id;

            //To Debug Comment out Next Line
            cube.visible = false;

            cube.position.copy(this.#position);
            cube.position.y = (this.#size.y / 2 );
            this._parent._parent.scene.add( cube );
            this.#hitbox = cube;
        }

        get hitbox() {
            return this.#hitbox;
        }
    }
    
    return {
        CubicHitbox : CubicHitbox
    }
}) ();