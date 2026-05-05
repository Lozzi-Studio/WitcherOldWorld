import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { component } from "../Interfaces/component";


export const player_figure = (() =>{
    class PlayerFigure extends component.Component {
        #mesh;
        #color;

        /**
         * 
         * @param {*} color 
         */
        constructor(color) {
            super();
            this.#color = color;
            this.#mesh = null;
        }
        
        InitComponent(){
            this._RegisterHandler('player.move', (msg) => this.#OnPlayerMove(msg));
            const loader = new GLTFLoader();
            loader.load("resources/assets/PlayerBaseModel.glb", (glb) =>{
                glb.scene.traverse((child) =>{
                    if (child.isMesh) {
                        child.material = child.material.clone();
                        child.material.color.set(this.#color);
                    }
                });
                this.#mesh = glb.scene;
                this.FindEntity("GameArea").scene.add(glb.scene);
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