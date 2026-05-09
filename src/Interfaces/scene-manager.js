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
            this.#RAF();
        }


        #InitThreeJS() {
            this._threejs = new THREE.WebGLRenderer({
                antialias: true,
            });
            this._threejs.outputColorSpace = THREE.LinearSRGBColorSpace;
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

        #OnWindowResize() {
            this._currentCamera.camera.aspect = window.innerWidth / window.innerHeight;
            this._currentCamera.camera.updateProjectionMatrix();
            this._threejs.setSize(window.innerWidth, window.innerHeight);
        }

        #RAF() {
            requestAnimationFrame((t) => {
                if (this._previousRAF === null) {
                    this._previousRAF = t;
                }

                this.#RAF();

                if (this._currentScene != null && this._currentCamera != null) {
                    this._threejs.render(this._currentScene.scene, this._currentCamera.camera);
       
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
            scene.controls = this.#controls;
        }

        SwitchScene(name) {
            if (this.#scenes.has(name)) {
                document.getElementById('main-menu').style.display = 'hidden';
                document.getElementById('game-ui').style.display = 'hidden';
                this.#CleanUpScene();
                this._currentScene = this.#scenes.get(name);
                this._currentScene.InitControls();
                this._currentScene.InitSceneEntities();
            }
        }

        SetCamera(newCamera) {
            this._currentCamera = newCamera;
            this.#controls = new OrbitControls(this._currentCamera.camera, this._threejs.domElement);
            this._currentCamera.controls = this.#controls;
            for (let scene of this.#scenes) {
                scene[1].controls = this.#controls;
            }
        }

        #CleanUpScene() {
            this._currentCamera?.StopMusic();
            
            //https://discourse.threejs.org/t/when-to-dispose-how-to-completely-clean-up-a-three-js-scene/1549/11
            
            this._threejs.dispose()

            const cleanMaterial = material => {
                material.dispose()

                // dispose textures
                for (const key of Object.keys(material)) {
                    const value = material[key]
                    if (value && typeof value === 'object' && 'minFilter' in value) {
                        value.dispose()
                    }
                }
            }

            this._currentScene?.scene.traverse(object => {
                if (!object.isMesh) return
                
                object.geometry.dispose()

                if (object.material.isMaterial) {
                    cleanMaterial(object.material)
                } else {
                    // an array of materials
                    for (const material of object.material) cleanMaterial(material)
                }
            })

            while(this._currentScene?.scene.children.length > 0){ 
                this._currentScene?.scene.remove(this._currentScene?.scene.children[0]); 
            }
        }

    }

    return {
        SceneManager : SceneManager
    }
}) ();