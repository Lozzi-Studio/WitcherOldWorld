import * as THREE from 'three';
import { entity } from "../Interfaces/entity";
import { button } from "./button";
import { controls_component } from '../GameArea/controls-component';


export const main_menu_overlay = (() => {

    class MainMenuOverlay extends entity.Entity{

        constructor() {
            super();
        }


        InitComponents() {
            this.AddComponent(new controls_component.Controls());

            let startButton = new button.Button("Button_Start",new THREE.TextureLoader().load("resources/assets/background/PlayButton.png") , "Start", () => this._parent.SwitchScene("GameScene"));
            this.AddComponent(startButton, "Button_Start");
            startButton.SetPosition(new THREE.Vector3(-0.5,0.2,2));
        }
    }

    return {
        MainMenuOverlay  : MainMenuOverlay 
    }

}) ();