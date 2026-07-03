import { pass } from "three/tsl";
import { component } from "../Interfaces/component";
import * as THREE from 'three';
import { broadcasts } from "../Interfaces/broadcasts";

export const camera_position = (() => {

    class CameraPosition extends component.Component{
        #currentPosition;
        #currentLookat;
        #target;
        #controlable;
        #directions;

        /**
         * Manager for position of camera
         */
        constructor() {
            super();
            this.#currentPosition = new THREE.Vector3();
            this.#currentLookat = new THREE.Vector3();
            this.#target = undefined;
            this.#controlable = true;
            this.#directions = new Map([[Direction.Down().toIdentifier(), false], [Direction.Left().toIdentifier(), false], [Direction.Right().toIdentifier(),false], [Direction.Up().toIdentifier(), false]]);
        }

        /**
         * Used to intialize and add any default components/events
         */
        InitComponent() {
            this._RegisterHandler("camera.moveTo", (msg) => {this.#MoveTo(msg)});
            this._RegisterHandler("camera.focusOn", (msg) => {this.#FocusOn(msg)});
            this._RegisterHandler("camera.focusOnShop", (msg) => {this.#FocusOnShop(msg)});
            this._RegisterHandler("camera.stopFocusShop", (msg) => {this.#StopFocusShop(msg)});
            this._RegisterHandler("camera.stopFocus", (msg) => {this.#StopFocus(msg)});

            window.addEventListener("keydown", (event) => {this.#onKeyDown(event)});
            window.addEventListener("keyup", (event) => {this.#onKeyUp(event)});
        }

        /**
         * Moves camera to target position
         * @param {object} msg 
         */
        #MoveTo(msg) {
           //TODO
           this._parent.controls.enabled = false;
           this._parent.controls.enabled = true;
        }

        /**
         * Focus camera on new target
         * @param {object} msg 
         */
        #FocusOn(msg) {
            this._parent.controls.enableDamping = false;
            this.#target = msg.target;
            this._parent.controls.target.set(this.#target.position.x, this.#target.position.y, this.#target.position.z);
            this.FindComponent("CubicHitbox").hitbox.position.set(this.#target.position.x, 0, this.#target.position.z);
        }

        /**
         * Focus camera on Shop
         * @param {object} msg 
         */
        #FocusOnShop(msg) {
            this._parent.controls.enableDamping = false;
            this._parent.controls.enabled = false;
            this._parent.camera.position.set(0, 25, -15);
            this._parent.controls.target.set(0, 5.1, -33);
        }

        /**
         * Stops focus on shop and return to last focus
         * @param {object} msg 
         */
        #StopFocusShop(msg) {
            this._parent.controls.enableDamping = true;
            this._parent.controls.enabled = true;
            this._parent.controls.target.set(this.#target.position.x, this.#target.position.y, this.#target.position.z);
        }

        /**
         * Stops focus on specific target and returns focus to origin
         * @param {object} msg 
         */
        #StopFocus(msg) {
            this._parent.controls.enableDamping = true;
            this.#target = undefined;
            this._parent.controls.target.set(0,0,0);
            this.FindComponent("CubicHitbox").hitbox.position.set(0, 0, 0);
        }

        /**
         * Manages key input
         * @param {object} event 
         */
        #onKeyDown(event) {

            if (this._parent.controls.enabled) {
                this.#createButton();
                switch (event.keyCode) {
                    case 87: // W
                        this.#directions.set(Direction.Up().toIdentifier(), true);
                        break;
                    case 83: // S
                        this.#directions.set(Direction.Down().toIdentifier(), true);
                        break;
                    case 65: // A
                        this.#directions.set(Direction.Left().toIdentifier(), true);
                        break;
                    case 68: // D
                        this.#directions.set(Direction.Right().toIdentifier(), true);
                        break;
                    case 32: // Space
                        
                        this.#directions = new Map([[Direction.Down().toIdentifier(), false], [Direction.Left().toIdentifier(), false], [Direction.Right().toIdentifier(),false], [Direction.Up().toIdentifier(), false]]);
                        this._parent.controls.enableDamping = false;
                        this.#target = this.FindEntity("GameArea").FindComponent("GameManager").currentPlayer;
                        this._parent.controls.target.set(this.#target.position.x, this.#target.position.y, this.#target.position.z);
                        this.FindComponent("CubicHitbox").hitbox.position.set(this.#target.position.x, this.#target.position.y, this.#target.position.z);

                        this.#deleteButton()
    
                        break;
                }
            }
        }

        #createButton(){
            if (!document.getElementById("reset-camera-button")) {
                let resetButton = document.createElement("div");
                resetButton.classList.add("textbox", "textbox--fill", "button", "position-bottom-center");
                resetButton.id = "reset-camera-button";
                resetButton.innerHTML = "Zurück zu meiner Spielfigur";
                document.getElementById("game-ui").appendChild(resetButton);
    
                resetButton.addEventListener("click", () => {
                    this.Broadcast(broadcasts.BroadcastTemplateCamera.FocusOn(this.#target));
                    this.#deleteButton();
                })
            }
        }

        #deleteButton() {
            if (document.getElementById("reset-camera-button")){
                let resetButton = document.getElementById("reset-camera-button");
                resetButton.remove()
            }

        }

        /**
         * Manages stop of key input
         * @param {object} event 
         */
        #onKeyUp(event) {
             switch (event.keyCode) {
                    case 87: // W
                        this.#directions.set(Direction.Up().toIdentifier(), false);
                        break;
                    case 83: // S
                        this.#directions.set(Direction.Down().toIdentifier(), false);
                        break;
                    case 65: // A
                        this.#directions.set(Direction.Left().toIdentifier(), false);
                        break;
                    case 68: // D
                        this.#directions.set(Direction.Right().toIdentifier(), false);
                        break;
            }
        }

        /**
         * Triggers after specific time intervall
         * @param {float} timeElapsed 
         */
        Update(timeElapsed) {   
            const t = 1.0 - Math.pow(0.01, timeElapsed);
            let h = this.FindComponent("CubicHitbox").hitbox;
            let y = this._parent.camera.position.y;
            for (let [key, value] of this.#directions.entries()) {
                switch (key) {
                    case "up":
                        if (value) {
                            this._parent.camera.translateZ(- (3 * t));
                            h.rotation.set(this._parent.camera.rotation.x, this._parent.camera.rotation.y, this._parent.camera.rotation.z);
                            h.translateZ(- (3 * t));
                            h.position.y = 0;
                            this._parent.controls.target.set((h.position.x), (h.position.y), (h.position.z));
                        }
                        break;
                    case "down":
                        if (value) {
                            this._parent.camera.translateZ((3 * t));
                            h.rotation.set(this._parent.camera.rotation.x, this._parent.camera.rotation.y, this._parent.camera.rotation.z);
                            h.translateZ((3 * t));
                            h.position.y = 0;
                            this._parent.controls.target.set((h.position.x), (h.position.y), (h.position.z));
                        }
                        break;
                    case "right":
                        if (value) {
                            this._parent.camera.translateX((3 * t));
                            h.rotation.set(this._parent.camera.rotation.x, this._parent.camera.rotation.y, this._parent.camera.rotation.z);
                            h.translateX((3 * t));
                            h.position.y = 0;
                            this._parent.controls.target.set((h.position.x), (h.position.y), (h.position.z));
                        }
                        break;
                    case "left":
                        if (value) {
                            this._parent.camera.translateX(- (3 * t));
                            h.rotation.set(this._parent.camera.rotation.x, this._parent.camera.rotation.y, this._parent.camera.rotation.z);
                            h.translateX(-(3 * t));
                            h.position.y = 0;
                            this._parent.controls.target.set((h.position.x), (h.position.y), (h.position.z));
                        }
                        break;
                    case "none":
                        break;
                }  
            }
            this._parent.camera.position.y = y;
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
         * An enum class to determine directions
         * Use static function constructor instead of default constructor!
         * @param {string} direction 
         */
        constructor(direction){
            this.#direction = direction;
        }

        /**
         * Get identifier of enum
         * @returns {string}
         */
        toIdentifier() {
            return this.#direction;
        }
    }

    return {
        CameraPosition : CameraPosition
    }
}) ();