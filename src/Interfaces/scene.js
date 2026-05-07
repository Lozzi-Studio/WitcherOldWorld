import * as THREE from 'three'
import { component } from './component';

export const scene = (() => {

    class Scene extends component.Component{
        #scene;
        #renderer;
        #entityManager;
        #parent;
        #controls;

        constructor(renderer){
            this.#scene = new THREE.Scene();
            this.#renderer = renderer;
            this.#entityManager = new entity_manager.EntityManager(this.#scene, renderer);
            this.#parent = null;
            this.InitControls();
        }

        InitControls() {}

        InitSceneEntities(){}

        Update(timeElapsed) {
            this.#entityManager.Update(timeElapsed);
            this.#controls.update();
        }

        SwitchScene(name){
            this.parent?.SwitchScene(name);
        }

        get scene(){
            return this.#scene;
        }

        get parent() {
            return this.#parent;
        }

        set parent(newParent) {
            this.#parent = newParent;
        }

        set renderer(newRenderer) {
            this.#renderer = newRenderer;
        }
    }

    return {
        Scene : Scene
    }
}) ();