import * as THREE from 'three'
import { entity } from './entity';

export const scene_manager = (() => {

    class SceneManager extends entity.Entity {
        #scenes;
        #renderer;
        #currentScene;
        #currentCamera;

        #previousRAF;

        constructor() {
            this.#scenes = new Map();
            this.#renderer = null;
            this.#currentScene = null;
            this.#currentCamera = null;

            this.#previousRAF = null;
        }

        InitComponents() {
            this.#InitThreeJS();
            this.#InitCamera();
        }

        #InitThreeJS() {
            this.#renderer = new THREE.WebGLRenderer({
                antialias: true,
            });
            this._threejs.outputEncoding = THREE.sRGBEncoding;
            this._threejs.gammaFactor = 2.2;
            this._threejs.shadowMap.enabled = true;
            this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
            this._threejs.setPixelRatio(window.devicePixelRatio);
            this._threejs.setSize(window.innerWidth, window.innerHeight);
            this._threejs.domElement.id = 'threejs';

            document.body.appendChild(this._threejs.domElement);

            window.addEventListener('resize', () => {
                this.#OnWindowResize();
            }, false);
        }

        #InitCamera() {
            const fov = 60;
            const aspect = 1920 / 1080;
            const near = 1.0;
            const far = 10000.0;
            this.#currentCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
            this.#currentCamera.position.set(25, 10, 50);
            this.#currentCamera.rotation.x = -Math.PI / 4;
        }

        #OnWindowResize() {
            this.#currentCamera.aspect = window.innerWidth / window.innerHeight;
            this.#currentCamera.updateProjectionMatrix();
            this.#renderer.setSize(window.innerWidth, window.innerHeight);
        }

        #RAF() {
            requestAnimationFrame((t) => {
                if (this._previousRAF === null) {
                    this._previousRAF = t;
                }

                this.#RAF();

                this.#renderer.render(this.#currentScene, this.#currentCamera);
                this.#Step(t - this.#previousRAF);
                this.#previousRAF = t;
            });
        }

        #Step(timeElapsed) {
            const timeElapsedS = Math.min(1.0 / 30.0, timeElapsed * 0.001);

            this.#currentScene.Update(timeElapsedS);
        }

        AddScene(scene, name) {
            if (name == undefined) {
                name = scene.constructor.name; 
            }
            this.#scenes.set(name, scene);
            scene.parent = this;
            scene.renderer = this.#renderer;
            scene.InitSceneEntities();
        }

        SwitchScene(name) {
            if (this.#scenes.has(name)) {
                this.#currentScene = this.#scenes.get(name);
            }
        }
    }

    return {
        SceneManager : SceneManager
    }
}) ();