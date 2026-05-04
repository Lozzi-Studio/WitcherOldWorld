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
            console.log("i bims einz berliner");
            const loader = new GLTFLoader();
            loader.load("resources/assets/PlayerBaseModel.glb", (glb) =>{
                glb.scene.traverse((child) =>{
                    if (child.isMesh) {
                        console.log(child);
                        child.material = child.material.clone();
                        child.material.color.set(this.#color);
    }
                });
                this.FindEntity("GameArea").scene.add(glb.scene);
                console.log(glb.scene);
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