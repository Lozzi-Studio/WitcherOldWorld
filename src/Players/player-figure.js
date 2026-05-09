import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { component } from "../Interfaces/component";


export const player_figure = (() =>{
    class PlayerFigure extends component.Component {
        #mesh;
        #color;
        #startPosition;

        /**
         * 
         * @param {*} color
         * @param {*} startPosition startposition des Spielers 
         */
        constructor(color, startPosition) {
            super();
            this.#color = color;
            this.#mesh = null;
            this.#startPosition = startPosition;
        }
        
        InitComponent(){
            this._RegisterHandler('player.move', (msg) => this.#OnPlayerMove(msg));
            const loader = new GLTFLoader();
            loader.load("resources/assets/PlayerBaseModel.glb", (glb) =>{
                glb.scene.traverse((child) =>{
                    if (child.isMesh) {
                        child.material.fog = false;
                        child.material.color.setHex('0x' + this.#color.toString(16));
                        this.#mesh = child;
                    }
                });
                this.#mesh = glb.scene;
                this.#mesh.position.copy(this.#startPosition);
                this._parent._parent.scene.add(this.#mesh);
            });
        }

        #OnPlayerMove(msg) {
            if (!this.#mesh) return;
            this.#mesh.position.copy(msg.position);
        }


        get mesh() {
            return this.#mesh;
        }
    }

    return {
        PlayerFigure: PlayerFigure
    }

})();