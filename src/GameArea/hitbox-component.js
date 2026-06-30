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
            this._RegisterHandler('player.move', (msg) => {this.#FollowPlayer(msg)});

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

        #FollowPlayer(msg) {
            let player = this.FindEntity("GameArea").FindComponent("GameManager").currentPlayer;
            if (this.#id == `Player_${player.id}`) {
                this.#position = msg.position;
                this.#hitbox.position.copy(this.#position);
                this.#hitbox.position.y = (this.#size.y / 2 );
            }
        }

        get hitbox() {
            return this.#hitbox;
        }
    }
    
    return {
        CubicHitbox : CubicHitbox
    }
}) ();