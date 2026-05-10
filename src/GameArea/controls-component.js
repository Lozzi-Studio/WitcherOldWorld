import * as THREE from 'three'
import { component } from '../Interfaces/component'
import { broadcasts } from '../Interfaces/broadcasts';

export const controls_component = (() => {

    class Controls extends component.Component {
        #used;

        constructor() {
            super();
            this.#used = false;
        }

        InitComponent() {
            document.addEventListener('mousedown', (event) => {this.#onMouseDown(event), {once: true}});

        }

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
                    console.log(this.FindEntity(selectedObject.name))
                    this.Broadcast(broadcasts.BroadcastTemplateTown.SelectTown(this.FindEntity(selectedObject.name)));   
                } else if (selectedObject.name.includes("Button")) {
                    console.log(selectedObject.name);
                    this.Broadcast(broadcasts.BroadcastTemplateGame.ButtonPress());  
                }
            }
            this.#used = true;
        }

        Update(timeElapsed) {
            if (this.#used) {
                document.addEventListener('mousedown', (event) => {this.#onMouseDown(event), {once: true}});
                this.#used = false;
            }
        }
    }

    return {
        Controls : Controls,
    }

}) ();