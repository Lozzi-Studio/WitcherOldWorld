import * as THREE from 'three'
import { component } from "../Interfaces/component";


export const button = (() => {

    class Button extends component.Component{
        #resolver;
        #buttonText;
        #mesh;
        #name;
        #texture;
        #width;
        #height;

        /**
         * A component with resembles a button with custom texture
         * @param {string} name 
         * @param {float} width 
         * @param {float} height 
         * @param {*} texture 
         * @param {string} buttonText 
         * @param {*} resolver 
         */
        constructor(name, width, height, texture, buttonText, resolver) {
            super();
            this.#name = name;
            this.#resolver = resolver;
            this.#buttonText = buttonText;
            this.#texture = texture;
            this.#mesh = null;
            this.#width = width;
            this.#height = height;
        }

        /**
         * Used to intialize and add any default components/events
         */
        InitComponent() {
            this._RegisterHandler('game.buttonPress', (msg) => {this.#Resolve(msg)});


            var material = new THREE.MeshBasicMaterial({
                map: this.#texture
            });
            material.fog = false;
            material.color.setHex(0xFFFFFF);
            this.#mesh = new THREE.Mesh(
                new THREE.PlaneGeometry(this.#width,this.#height),
                material
            );
            this.#mesh.name = this.#name;
            this._parent._parent.scene.add(this.#mesh);
        }

        /**
         * Triggers resolver
         */
        #Resolve() {
            this.#resolver();
        }

        SetPosition(newPosition) {
            this.#mesh.position.copy(newPosition);
        }

        set buttonText(newText) {
            this.#buttonText = newText;
        }
    }

    return {
        Button : Button
    }

}) ();