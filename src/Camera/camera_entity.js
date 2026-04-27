import { entity } from "../Interfaces/entity";
import { camera_component } from "./camera_component";
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
        }

        InitComponents() {
            this.AddComponent(new camera_component.CameraPosition(this.#camera, this.#controls));
        }
    }

    return {
        Camera : Camera
    }
}) ();