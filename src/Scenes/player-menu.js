import * as THREE from 'three'
import { scene } from '../Interfaces/scene';
import { player_menu_overlay } from '../PlayerSelection/player-menu-entity';

export const player_menu = (() => {

    class PlayerMenu extends scene.Scene{

        /**
         * Scene for player selection menu
         */
        constructor() {
            super();
        }

        /**
         * Used to intialize and add any default entities
         */
        InitSceneEntities() {
            this._entityManager.AddEntity(this._parent._currentCamera, undefined, false);

            

            this.#InitMenu();
        }

        /**
         * Initialize player selection menu overlay
         */
        #InitMenu() {
            this._entityManager.AddEntity(new player_menu_overlay.PlayerMenuOverlay());
        }
    }

    return {
        PlayerMenu : PlayerMenu
    }
}) ();