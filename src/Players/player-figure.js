import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { component } from "../Interfaces/component";


export const player_figure = (() =>{
    class PlayerFigure extends component.Component {
        #mesh;
        #color;
        #startPosition;

        /**
         * A loader for the player figure
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
            this._RegisterHandler('player.move', (msg) => {this.#OnPlayerMove(msg)});
            let schoolName = "";
            switch(this._parent.witcherSchool.name){
                case "Vipernschule":
                    schoolName = "viper_"
                    break;
                case "Katzenschule":
                    schoolName = "cat_"
                    break;
                case "Baerenschule":
                    schoolName = "bear_"
                    break;
                case "Wolfsschule":
                    schoolName = "wolf_"
                    break;
                case "Greifenschule":
                    schoolName = "griffin_"
                    break;
            }
            let model = this._parent.GetFromCache((schoolName + "player_model"));
            if (model == undefined) {
                let default_model = this._parent.GetFromCache((schoolName + "default_figure"));
                default_model.traverse((child) =>{
                    if (child.isMesh) {
                        child.material.fog = false;
                        child.material.color.setHex('0x' + this.#color.toString(16));
                    }
                });
                default_model.name = (schoolName + "default_figure");
                this.#mesh = default_model;
                this.#mesh.position.copy(this.#startPosition);
                this._parent._parent.scene.add(this.#mesh);
            } else {
                this.#mesh = model ;
                this.#mesh.position.copy(this.#startPosition);
                this._parent._parent.scene.add(this.#mesh);
            }
        }

        /**
         * Change position of model on player move
         * @param {object} msg 
         * @returns 
         */
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