import * as THREE from 'three';
import { component } from "../Interfaces/component";


export const menu_animation = (() => {

    class MenuAnimation extends component.Component {
        #destination;
        #zoom;
        #plane

        /**
         * An animation component to create an exit effect
         */
        constructor() {
            super();

            this.#destination = null;
            this.#zoom = 1;
        }

        /**
         * Used to intialize and add any default components/events
         */
        InitComponent() {
            this.#plane = this.FindComponent("BackgroundMainMenu").background;
        }

        /**
         * Initialize animation
         * @param {THREE.Vector3} newDestination 
         */
        startAnimation(newDestination) {
            this.#destination = newDestination;
            this._parent.RemoveComponent('Button_Start');
            this._parent._parent.scene.remove(this._parent._parent.scene.getObjectByName('Logo'));
            this._parent._parent.scene.remove(this._parent._parent.scene.getObjectByName('Button_Start'));
        }
        
        /**
         * Triggers after specific time intervall
         * @param {float} timeElapsed 
         */
        Update(timeElapsed) {
            //https://stackoverflow.com/questions/47733935/threejs-move-object-from-point-a-to-point-b
            if (this.#destination != null) {
                if (this.#zoom < 3) {
                    this.#plane.scale.set( 2 * this.#zoom, 2 * this.#zoom);
                    this.#zoom += 0.015
                    var newX = this.#lerp(this.#plane.position.x, this.#destination.x * this.#zoom , 0.01);
                    var newY = this.#lerp(this.#plane.position.y, this.#destination.y * this.#zoom, 0.01);
                    var newZ = this.#lerp(this.#plane.position.z, this.#destination.z * this.#zoom, 0.01);
                    this.#plane.position.set(newX, newY, newZ);
                } else {
                    document.getElementById('main-menu').style.display = 'none';
                    this._parent._parent.SwitchScene('PlayerMenu', false);
                }
            }
            
        }

        /**
         * Interpoaltes between 2 values with a time value
         * @param {float} a 
         * @param {float} b 
         * @param {flaot} t 
         * @returns 
         */
        #lerp(a, b, t) {
            return a + (b - a) * t
        }
        
    }

    return {
        MenuAnimation : MenuAnimation
    }
}) ();