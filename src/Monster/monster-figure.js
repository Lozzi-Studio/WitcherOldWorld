import { component } from "../Interfaces/component";
import { GLTFLoader } from 'three/examples/jsm/Addons.js';


export const monster_figure = (() => {

    class MonsterFigure extends component.Component{
        #mesh;
        #color;
        #startPosition;

        /**
         * A loader for the monster figure
         * @param {string} color
         * @param {THREE.Vector3} startPosition
         */
        constructor(color, startPosition) {
            super();
            this.#color = color;
            this.#mesh = null;
            this.#startPosition = startPosition;
        }

        /**
         * Used to intialize and add any default components/events
         */
        InitComponent(){
            const loader = new GLTFLoader();
            loader.load("resources/assets/PlayerBaseModel.glb", (glb) =>{
                glb.scene.traverse((child) =>{
                    if (child.isMesh) {
                        child.material.fog = false;
                        child.material.color.setHex('0x' + this.#color.toString(16));
                    }
                });
                this.#mesh = glb.scene;
                this.#mesh.position.copy(this.#startPosition);
                this._parent._parent.scene.add(this.#mesh);
            });
        }

        get mesh() {
            return this.#mesh;
        }
    }

    return {
        MonsterFigure : MonsterFigure
    }
}) ();