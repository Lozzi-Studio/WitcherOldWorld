import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { entity } from '../Interfaces/entity';

export const player_figure = (() =>{
    class PlayerFigure extends entity.Component {
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

        initComponent(){
            const loader = new GLTFLoader();
            loader.load("resources/assets/PlayerBaseModel.glb", (glb) =>{
                this.#mesh = glb.scene.clone();
                this.#mesh.traverse((child) =>{
                    if (child.isMesh) {
                        child.material = child.material.clone();
                        child.material.color.set(this.#color)
                    }
                });
                this.Parent.Scene.add(this.#mesh);
            });
        
        }

        get mesh() {
            return this.#mesh;
        }
    }

    return {
        PlayerFigure: PlayerFigure
    }

})();