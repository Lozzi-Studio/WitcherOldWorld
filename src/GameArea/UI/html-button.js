import * as THREE from 'three'
import { component } from "../Interfaces/component";


export const html_button = (() => {

    class HTMLButton extends component.Component{
        #resolver;
        #name;

        /**
         * A component with resembles a button with custom texture
         * @param {string} name 
         * @param {*} resolver 
         */
        constructor(name, resolver) {
            super();
            this.#name = name;
            this.#resolver = resolver;
        }

        /**
         * Used to intialize and add any default components/events
         */
        InitComponent() {
            this._RegisterHandler('game.buttonPress', (msg) => {this.#Resolve(msg)});
        }

        /**
         * Triggers resolver
         */
        #Resolve() {
            this.#resolver();
        }
    }

    return {
        HTMLButton : HTMLButton
    }

}) ();