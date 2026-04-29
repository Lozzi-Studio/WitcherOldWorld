import * as THREE from 'three'
import { component } from '../Interfaces/component'

export const controls_component = (() => {

    class Controls extends component.Component {

        constructor() {
            super();
        }

        InitComponent() {
            document.addEventListener('mousedown', (event) => {this.#onMouseDown(event)});

        }

        #onMouseDown(event) {
            const coords = new THREE.Vector2(
                (event.clientX / this._parent.renderer.domElement.clientWidth) * 2 - 1,
                -((event.clientY / this._parent.renderer.domElement.clientHeight) * 2 - 1),
            );

            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(coords, this.FindEntity("Camera").camera);

            const intersections = raycaster.intersectObjects(this._parent.scene.children, true);
            if (intersections.length > 0) {
                const selectedObject = intersections[0].object;
                console.log(`${selectedObject.name} was clicked!`);
            }
        }
    }

    return {
        Controls : Controls,
    }

}) ();