import { entity } from "../Interfaces/entity";
import { camera_position } from "./camera_position";
import * as THREE from 'three';

export const camera_entity = (() => {

    class Camera extends entity.Entity {
        #camera;
        #controls;

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
        }

        InitComponents() {
            this.AddComponent(new camera_position.CameraPosition());
        }

        get camera() {
            return this.#camera;
        }

        get controls() {
            return this.#controls;
        }
    }

    return {
        Camera : Camera
    }
}) ();