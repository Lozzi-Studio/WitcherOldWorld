import { component } from "../Interfaces/component";
import * as THREE from 'three';

export const camera_component = (() => {

    class CameraPosition extends component.Component{
        #camera;
        #currentPosition;
        #currentLookat;
        #target;
        #controls;
        #controlable;
        #direction;

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
            this.#controlable = true;
            this.#direction = Direction.None();
        }

        InitComponent() {
            this._RegisterHandler("camera.moveTo", (msg) => {this.#MoveTo(msg)});
            this._RegisterHandler("camera.focusOn", (msg) => {this.#FocusOn(msg)});
            this._RegisterHandler("camera.stopFocus", (msg) => {this.#StopFocus(msg)});

            window.addEventListener("keydown", (event) => {this.#onKeyDown(event)});
            window.addEventListener("keyup", (event) => {this.#onKeyUp(event)});
        }

        #MoveTo(msg) {
           //TODO
           this.#controls.enabled = false;
           this.#controls.enabled = true;
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

        #onKeyDown(event) {
            switch (event.keyCode) {
                case 87: // W
                    this.#direction = Direction.Up();
                    break;
                case 83: // S
                    this.#direction = Direction.Down();
                    break;
                case 65: // A
                    this.#direction = Direction.Left();
                    break;
                case 68: // D
                    this.#direction = Direction.Right();
                    break;
            }
        }

        #onKeyUp(event) {
            if (event.keyCode == 87 || event.keyCode == 83 || event.keyCode == 65 || event.keyCode == 68) {
                this.#direction = Direction.None();
            }
        }

        Update(timeElapsed) {   
            const t = 1.0 - Math.pow(0.01, timeElapsed);
            switch (this.#direction.getIdentifier()) {
                case "up":
                    this.#controls.target.z -= 1 * t;
                    break;
                case "down":
                    this.#controls.target.z += 1 * t;
                    break;
                case "right":
                    this.#controls.target.x += 1 * t;
                    break;
                case "left":
                    this.#controls.target.x += -1 * t;
                    break;
                case "none":
                    this.#controls.target.set(this.#target?.position.x ?? 0, this.#target?.position.y ?? 0, this.#target?.position.z ?? 0);
                    break;
            }  
        }
    }


    class Direction {
        #direction;

        static Up() {return new Direction("up");}
        static Down() {return new Direction("down");}
        static Right() {return new Direction("right");}
        static Left() {return new Direction("left");}
        static None() {return new Direction("none");}

        /**
         * Use static function constructor instead of default constructor!
         * @param {string} direction 
         */
        constructor(direction){
            this.#direction = direction;
        }

        getIdentifier() {
            return this.#direction;
        }
    }

    return {
        CameraPosition : CameraPosition
    }
}) ();