import * as THREE from 'three'
import { entity_manager } from './entity-manager';

export const scene = (() => {

    class Scene {

        /**
         * A scene object
         */
        constructor(){
            this._scene = new THREE.Scene();

            this._renderer = null;
            this._parent = null;
            this._camera = null;   
            this._controls = null;
        }

        /**
         * Used to intialize and add any default components/events
         */
        InitControls() {}

        /**
         * Used to intialize and add any default entities to scene
         */
        InitSceneEntities(){}

        /**
         * Triggers after specific time intervall
         * @param {float} timeElapsed 
         */
        Update(timeElapsed) {
            this._entityManager.Update(timeElapsed);
            this._controls.update();
        }

        /**
         * Switches the current scene
         * @param {string} name 
         * @param {bool} stopAudio - Default: true
         */
        SwitchScene(name, stopAudio = true){
            this._parent?.SwitchScene(name, stopAudio);
        }

        get scene(){
            return this._scene;
        }

        get parent() {
            return this._parent;
        }

        set parent(newParent) {
            this._parent = newParent;
        }

        set renderer(newRenderer) {
            this._renderer = newRenderer;
            const oldManager = this._entityManager;
            this._entityManager = new entity_manager.EntityManager(this, newRenderer);
            if (oldManager){
                this._entityManager.setEntities(oldManager.getEntities());
            }
        }

        set camera(newCamera) {
            this._camera = newCamera;
        }

        set controls(newControls) {
            this._controls = newControls;
        }
    }

    return {
        Scene : Scene
    }
}) ();