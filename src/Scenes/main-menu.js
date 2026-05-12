import * as THREE from 'three'
import { scene } from "../Interfaces/scene";
import { camera_entity } from '../Camera/camera_entity';
import { main_menu_overlay } from '../MainMenu/main-menu-entity';
import { broadcasts } from '../Interfaces/broadcasts';

export const main_menu = (() => {

    class MainMenu extends scene.Scene{

        /**
         * Scene for Main Menu
         */
        constructor() {
            super();
        }

        /**
         * Used to intialize and add controls
         */
        InitControls() {
            let newCamera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 4 )
            newCamera.position.set(0,0,2);
            this._parent.SetCamera(new camera_entity.Camera(newCamera, this._controls));
            this._controls.enabled = false;
        }   


        /**
         * Used to intialize and add any default entities
         */
        InitSceneEntities() {
       
            this._entityManager.AddEntity(this._parent._currentCamera);
            this._entityManager.FindEntity('Camera').Broadcast(broadcasts.BroadcastTemplateMusic.PlayMainMenuTheme());

            document.getElementById('main-menu').style.display = 'block';

            this.#InitMenu();
        }

        /**
         * Initialize main menu overlay
         */
        #InitMenu() {
            this._entityManager.AddEntity(new main_menu_overlay.MainMenuOverlay());
        }
    }

    return {
        MainMenu : MainMenu
    }
}) ();