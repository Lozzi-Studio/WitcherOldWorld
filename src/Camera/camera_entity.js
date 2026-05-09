import { entity } from "../Interfaces/entity";
import { music_component } from "./music_component";
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
            
        }

        InitComponents() {
            this.AddComponent(new camera_position.CameraPosition());
            this.AddComponent(new music_component.MusicComponent(this.#camera));
        }

        StopMusic() {
            this.FindComponent('MusicComponent').Stop();
        }

        get camera() {
            return this.#camera;
        }

        get controls() {
            return this.#controls;
        }

        set controls(newControls) {
            this.#controls = newControls;
        }
    }

    return {
        Camera : Camera
    }
}) ();