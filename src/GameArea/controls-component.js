import * as THREE from 'three'
import { component } from '../Interfaces/component'
import { broadcasts } from '../Interfaces/broadcasts';

export const controls_component = (() => {

    class Controls extends component.Component {
        #used;
        #raycastingEnabled;

        /**
         * A component to track mouse clicks with raycast
         */
        constructor() {
            super();
            this.#used = false;
            this.#raycastingEnabled = true;
        }

        /**
         * Used to intialize and add any default components/events
         */
        InitComponent() {
            this._RegisterHandler('game.enableRaycasting', (msg) => {this.#EnableRaycasting(msg)});
            this._RegisterHandler('game.disableRaycasting', (msg) => {this.#DisableRaycasting(msg)});
            document.addEventListener('mousedown', (event) => {this.#onMouseDown(event)}, {once: true});
        }

        /**
         * Enable or disable raycasting (used to exclude UI elements from raycasting)
         */
        #EnableRaycasting(msg) {
            this.#raycastingEnabled = true;
        }

        /**
         * Enable or disable raycasting (used to exclude UI elements from raycasting)
         */
        #DisableRaycasting(msg) {
            this.#raycastingEnabled = false;
        }

        /**
         * Determines behaviour on mouse click and broadcasts events
         * @param {object} event 
         */
        #onMouseDown(event) {
            const coords = new THREE.Vector2(
                (event.clientX / this._parent._parent.renderer.domElement.clientWidth) * 2 - 1,
                -((event.clientY / this._parent._parent.renderer.domElement.clientHeight) * 2 - 1),
            );
            
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(coords, this.FindEntity("Camera").camera);
            
            if (this.#raycastingEnabled) {
                const intersections = raycaster.intersectObjects(this._parent._parent.scene.children, true);
                if (intersections.length > 0) {
                    const selectedObject = intersections[0].object;
                    if (selectedObject.name.includes("Town")) {
                        this.Broadcast(broadcasts.BroadcastTemplateTown.SelectTown(this.FindEntity(selectedObject.name)));
                    }
                    else if (selectedObject.name.includes("Button")) {
                        this.Broadcast(broadcasts.BroadcastTemplateGame.ButtonPress());  
                    } else if (selectedObject.name.includes("ShopCard") || selectedObject.name.includes("ShopCardDisplay")) {
                        var msg = broadcasts.BroadcastTemplateCardShop.SelectCardFromShop(selectedObject.name.split("_")[1], selectedObject.name.split("_")[2]);
                        this.FindEntity("Cardshop").Broadcast(msg);
                        this.Broadcast(msg); 
                    }
                }
            }
            this.#used = true;
        }
        
        /**
         * Triggers after specific time intervall
         * @param {float} timeElapsed 
         */
        Update(timeElapsed) {
            if (this.#used) {
                document.addEventListener('mousedown', (event) => {this.#onMouseDown(event)}, {once: true});
                this.#used = false;
            }
        }
    }

    return {
        Controls : Controls,
    }

}) ();