import * as THREE from 'three'
import { component } from '../Interfaces/component'
import { broadcasts } from '../Interfaces/broadcasts';

export const controls_component = (() => {

    class Controls extends component.Component {
        #used;

        /**
         * A component to track mouse clicks with raycast
         */
        constructor() {
            super();
            this.#used = false;
        }

        /**
         * Used to intialize and add any default components/events
         */
        InitComponent() {
            document.addEventListener('mousedown', (event) => {this.#onMouseDown(event)}, {once: true});
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
            
            const intersections = raycaster.intersectObjects(this._parent._parent.scene.children, true);
            if (intersections.length > 0) {
                const selectedObject = intersections[0].object;
                if (selectedObject.name.includes("Town")) {
                    this.Broadcast(broadcasts.BroadcastTemplateTown.SelectTown(this.FindEntity(selectedObject.name)));
                }
                else if (selectedObject.name.includes("Button")) {
                    this.Broadcast(broadcasts.BroadcastTemplateGame.ButtonPress());  
                }
                else {
                    this.Broadcast(broadcasts.BroadcastTemplateTown.DeselectTown());
                }
            } else {
                this.Broadcast(broadcasts.BroadcastTemplateTown.DeselectTown());
            }
            this.#used;
        }
    }

    return {
        Controls : Controls,
    }

}) ();