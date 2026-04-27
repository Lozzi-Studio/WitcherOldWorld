import { component } from "../Interfaces/component";
import { lerp } from "three/src/math/MathUtils.js";
import * as THREE from 'three';

export const camera_component = (() => {

    class CameraPosition extends component.Component{
        #camera;
        #currentPosition;
        #currentLookat;
        #target;
        #controls

        /**
         * 
         * @param {THREE.camera} camera 
         * @param {THREE.controls} controls
         */
        constructor(camera, controls) {
            super();
            this.#camera = camera;
            this.#controls = controls;
           this.#controls.enablePan = false;

            this.#currentPosition = new THREE.Vector3();
            this.#currentLookat = new THREE.Vector3();
            this.#target = undefined;
        }

        InitComponent() {
            this._RegisterHandler("camera.moveTo", (msg) => {this.#MoveTo(msg)});
            this._RegisterHandler("camera.focusOn", (msg) => {this.#FocusOn(msg)});
            this._RegisterHandler("camera.stopFocus", (msg) => {this.#StopFocus(msg)});
        }

        #MoveTo(msg) {
           //TODO
           this.#controls.enabled = false;
        }

        #FocusOn(msg) {
            this.#controls.enableDamping = false;
            this.#target = msg.target;
            this.#controls.target.set(this.#target.position.x, this.#target.position.y, this.#target.position.z);
        }

        #StopFocus(msg) {
            this.#controls.enableDamping = true;
            this.#target = undefined;
            this.#controls.target.set(0,0,0);
        }

        Update(timeElapsed) {         
        }
    }

    return {
        CameraPosition : CameraPosition
    }
}) ();