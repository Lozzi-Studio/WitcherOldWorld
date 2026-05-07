import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/Addons.js";

export const scene_manager = (() => {

    class SceneManager{
        #scenes;
        #controls;

        constructor() {
            this.#scenes = new Map();
            this._threejs = null;
            this._currentScene = null;
            this._currentCamera = null;
            this.#controls = null;

            this._previousRAF = null;
            this.#InitThreeJS();
            this.#InitCamera();
            this.#RAF();
        }


        #InitThreeJS() {
            this._threejs = new THREE.WebGLRenderer({
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
            this._currentCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
            this._currentCamera.position.set(0,50,50);
            this._currentCamera.rotation.x = -Math.PI / 4;
            this.#controls = new OrbitControls(this._currentCamera, this._threejs.domElement);
        }

        #OnWindowResize() {
            this._currentCamera.aspect = window.innerWidth / window.innerHeight;
            this._currentCamera.updateProjectionMatrix();
            this._threejs.setSize(window.innerWidth, window.innerHeight);
        }

        #RAF() {
            requestAnimationFrame((t) => {
                if (this._previousRAF === null) {
                    this._previousRAF = t;
                }

                this.#RAF();

                if (this._currentScene != null && this._currentCamera != null) {
                    this._threejs.render(this._currentScene.scene, this._currentCamera);
       
                    this.#Step(t - this._previousRAF);
                }
                this._previousRAF = t;
            });
        }

        #Step(timeElapsed) {
            const timeElapsedS = Math.min(1.0 / 30.0, timeElapsed * 0.001);

            this._currentScene.Update(timeElapsedS);
        }

        AddScene(scene, name) {
            if (name == undefined) {
                name = scene.constructor.name; 
            }
            this.#scenes.set(name, scene);
            scene.parent = this;
            scene.renderer = this._threejs;
            scene.camera = this._currentCamera;
            scene.controls = this.#controls;
        }

        SwitchScene(name) {
            if (this.#scenes.has(name)) {
                this._currentScene = this.#scenes.get(name);
                this._currentScene.InitControls();
                this._currentScene.InitSceneEntities();
            }
        }
    }

    return {
        SceneManager : SceneManager
    }
}) ();