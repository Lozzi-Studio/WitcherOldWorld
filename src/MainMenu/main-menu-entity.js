import * as THREE from 'three';
import { entity } from "../Interfaces/entity";
import { button } from "./button";
import { controls_component } from '../GameArea/controls-component';
import { backgrounds } from '../Scenes/backgrounds';
import { lights } from '../Scenes/lights';
import { menu_animation } from './menu-animation';


export const main_menu_overlay = (() => {

    class MainMenuOverlay extends entity.Entity{

        /**
         * A wrapper for the main menu
         */
        constructor() {
            super();
        }

        /**
         * Used to intialize and add any default components/events
         */
        InitComponents() {
            let startButton = document.getElementById("start-game-button");
            startButton.addEventListener("click", () => this._parent.SwitchScene('PlayerMenu', false));

            let mainMenu = document.getElementById("main-menu");
            mainMenu.style.display = "block";
        }
    }

    return {
        MainMenuOverlay  : MainMenuOverlay 
    }

}) ();