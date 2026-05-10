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
            this.AddComponent(new controls_component.Controls());
            this.AddComponent(new backgrounds.BackgroundMainMenu());
            this.AddComponent(new lights.LightMainMenu());
            this.AddComponent(new menu_animation.MenuAnimation());
            

            let startButton = new button.Button("Button_Start", 0.3, 0.18, new THREE.TextureLoader().load("resources/assets/background/PlayButton.png") , "Start", () => this.FindComponent("MenuAnimation").startAnimation(new THREE.Vector3(0.5,0.4,0)));
            this.AddComponent(startButton, "Button_Start");
            startButton.SetPosition(new THREE.Vector3(-0.5,0.17,2));
        }
    }

    return {
        MainMenuOverlay  : MainMenuOverlay 
    }

}) ();