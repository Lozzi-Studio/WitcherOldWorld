import * as THREE from 'three'
import { scene } from '../Interfaces/scene';
import { placeholder_entity } from '../Start_Placeholder/placeholder_entity';
import { camera_entity } from '../Camera/camera_entity';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

//Die existiert nur damit es ne Start scene gibt in der der USer klicken muss, damit die chrome audio policy erfüllt ist. Macht sonst nichts und startet enfach nur das Hauptmenu.


export const placeholder = (() => {

    class Placeholder extends scene.Scene{

        constructor() {
            super();
        }

        InitControls() {
            let newCamera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 4 )
            newCamera.position.set(0,0,2);
            this._parent.SetCamera(new camera_entity.Camera(newCamera, this._controls));
            this._controls.enabled = false;
        }   

        InitSceneEntities() {
            this._entityManager.AddEntity(this._parent._currentCamera);
            this._entityManager.AddEntity(new placeholder_entity.PlaceholderEntity());
            document.getElementById('placeholder').style.display = 'block';
            document.addEventListener('mousedown', (event) => {this.#onMouseDown(event)}, {once: true});
        }

        #onMouseDown(event) {
            console.log("test");
            document.getElementById('placeholder').style.display = 'none';
            this.SwitchScene("MainMenu")
        }
    }

    return {
       Placeholder : Placeholder
    }
}) ();