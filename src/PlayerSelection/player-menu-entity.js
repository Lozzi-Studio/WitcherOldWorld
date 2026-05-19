import * as THREE from 'three';
import { controls_component } from "../GameArea/controls-component";
import { entity } from "../Interfaces/entity";
import { backgrounds } from "../Scenes/backgrounds";
import { player_picker } from "./player-pick-component";
import { button } from "../MainMenu/button";

export const player_menu_overlay = (() => {

    class PlayerMenuOverlay extends entity.Entity{

        /**
         * A wrapper for the player selection menu
         */
        constructor() {
            super();
        }

        /**
         * Used to intialize and add any default components/events
         */
        InitComponents() {
            this.AddComponent(new controls_component.Controls());
            this.AddComponent(new backgrounds.BackgroundPlayerselection());
            this.AddComponent(new player_picker.PlayerPicker())

            let startButton = new button.Button("Button_Start", 0.3, 0.18, new THREE.TextureLoader().load("resources/assets/background/PlayButton.png") , "Start", () => this.FindComponent("PlayerPicker").SwitchScene());
            this.AddComponent(startButton, "Button_Start");
            startButton.SetPosition(new THREE.Vector3(-0.5,-0.5,2));
        }
    }

    return {
        PlayerMenuOverlay : PlayerMenuOverlay
    }
}) ();