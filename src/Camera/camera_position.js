import { component } from "../Interfaces/component";
import * as THREE from 'three';

export const camera_position = (() => {

    class CameraPosition extends component.Component{
        #currentPosition;
        #currentLookat;
        #target;
        #controlable;
        #direction;

        constructor() {
            super();
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
           this._parent.controls.enabled = false;
           this._parent.controls.enabled = true;
        }

        #FocusOn(msg) {
            this._parent.controls.enableDamping = false;
            this.#target = msg.target;
            this._parent.controls.target.set(this.#target.position.x, this.#target.position.y, this.#target.position.z);
        }

        #StopFocus(msg) {
            this._parent.controls.enableDamping = true;
            this.#target = undefined;
            this._parent.controls.target.set(0,0,0);
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
                    this._parent.controls.target.z -= 1 * t;
                    break;
                case "down":
                    this._parent.controls.target.z += 1 * t;
                    break;
                case "right":
                    this._parent.controls.target.x += 1 * t;
                    break;
                case "left":
                    this._parent.controls.target.x += -1 * t;
                    break;
                case "none":
                    this._parent.controls.target.set(this.#target?.position.x ?? 0, this.#target?.position.y ?? 0, this.#target?.position.z ?? 0);
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