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
            this.AddComponent("PlayerPicker");
            
            let mainMenu = document.getElementById("main-menu");
            mainMenu.style.display = "none";

            let startButton = document.getElementById("player-selection-start-game-button");
            startButton.addEventListener("click", () => this.FindComponent("PlayerPicker").SwitchScene());

            let playerSelection = document.getElementById("player-selection");
            playerSelection.style.display = "block";

            // let startButton = new button.Button("Button_Start", 0.3, 0.18, new THREE.TextureLoader().load("resources/assets/background/PlayButton.png") , "Start", () => this.FindComponent("PlayerPicker").SwitchScene());

        }
    }

    return {
        PlayerMenuOverlay : PlayerMenuOverlay
    }
}) ();