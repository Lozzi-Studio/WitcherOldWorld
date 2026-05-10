import * as THREE from 'three';
import { component } from "../Interfaces/component";


export const menu_animation = (() => {

    class MenuAnimation extends component.Component {
        #destination;
        #zoom;
        #plane

        constructor() {
            super();

            this.#destination = null;
            this.#zoom = 1;
        }

        InitComponent() {
            this.#plane = this.FindComponent("BackgroundMainMenu").background;
        }

        startAnimation(newDestination) {
            this.#destination = newDestination;
            this._parent.RemoveComponent('Button_Start');
            this._parent._parent.scene.remove(this._parent._parent.scene.getObjectByName('Logo'));
            this._parent._parent.scene.remove(this._parent._parent.scene.getObjectByName('Button_Start'));
        }
        
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

        #lerp(a, b, t) {
            return a + (b - a) * t
        }
        
    }

    return {
        MenuAnimation : MenuAnimation
    }
}) ();