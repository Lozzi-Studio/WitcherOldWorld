import * as THREE from 'three'
import { scene } from "../Interfaces/scene";
import { camera_entity } from '../Camera/camera_entity';
import { main_menu_overlay } from '../MainMenu/main-menu-entity';
import { broadcasts } from '../Interfaces/broadcasts';

export const main_menu = (() => {

    class MainMenu extends scene.Scene{

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
       
            var texture = new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load("resources/assets/background/main_menu.png")
            });
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.fog = false;
            var bg = new THREE.Mesh(
                new THREE.PlaneGeometry(2,2),
                texture
            );
            bg.name = 'BG'

            this._scene.add(bg);


            var logo = new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load("resources/assets/background/the-witcher-old-world-eng-logo.webp")
            });
            logo.fog = false;
            logo.transparent = true;
            var logoMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(0.4,0.5),
                logo
            );
            logoMesh.name = 'Logo'
            logoMesh.position.copy(new THREE.Vector3(-0.5,0.6,0))
            this._scene.add(logoMesh);

            this._entityManager.AddEntity(this._parent._currentCamera);
            this._entityManager.FindEntity('Camera').Broadcast(broadcasts.BroadcastTemplateMusic.PlayMainMenuTheme());

            const ambientLight = new THREE.AmbientLight('white', 0.5);
            const directlighting = new THREE.DirectionalLight("orange", 2);
            directlighting.position.set(10, 10, 7);
            this._scene.add(ambientLight, directlighting);

            document.getElementById('main-menu').style.display = 'block';

            this.#InitMenu();
        }

        #InitMenu() {
            this._entityManager.AddEntity(new main_menu_overlay.MainMenuOverlay());
        }
    }

    return {
        MainMenu : MainMenu
    }
}) ();