import * as THREE from 'three'
import { scene } from '../Interfaces/scene';
import { player_menu_overlay } from '../MainMenu/player-menu-entity';

export const player_menu = (() => {

    class PlayerMenu extends scene.Scene{

        constructor() {
            super();
        }

        InitSceneEntities() {
               
            this._entityManager.AddEntity(this._parent._currentCamera);

            document.getElementById('main-menu').style.display = 'block';

            this.#InitMenu();
        }

        #InitMenu() {
            this._entityManager.AddEntity(new player_menu_overlay.PlayerMenuOverlay());
        }
    }

    return {
        PlayerMenu : PlayerMenu
    }
}) ();