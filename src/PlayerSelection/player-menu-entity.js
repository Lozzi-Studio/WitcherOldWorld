import * as THREE from 'three';
import { controls_component } from "../GameArea/controls-component";
import { entity } from "../Interfaces/entity";
import { backgrounds } from "../Scenes/backgrounds";
import { player_picker } from "./player-pick-component";
import { button } from "../MainMenu/button";
import { player_selection_ui_manager } from '../GameArea/UI/player-selection-ui-manager';

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
            document.getElementById('player-selector').style.display = 'block';
            this.AddComponent(new player_picker.PlayerPicker())
            this.AddComponent(new player_selection_ui_manager.PlayerSelectionUIManager());
            
            let mainMenu = document.getElementById("main-menu");
            mainMenu.style.display = "none";

            let startButton = document.getElementById("player-selection-start-game-button");
            startButton.addEventListener("click", () => this.FindComponent("PlayerPicker").SwitchScene());

            let playerSelection = document.getElementById("player-selection");
            playerSelection.style.display = "block";
        }
    }

    return {
        PlayerMenuOverlay : PlayerMenuOverlay
    }
}) ();