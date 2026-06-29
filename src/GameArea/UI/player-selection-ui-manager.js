import { component } from "../../Interfaces/component";
import { broadcasts } from "../../Interfaces/broadcasts";
import { remove } from "three/examples/jsm/libs/tween.module.js";

export const player_selection_ui_manager = (() => {

    class PlayerSelectionUIManager extends component.Component {
        #maxPlayers;
        #minPlayers;

        constructor(){
            super();
            this.#maxPlayers = 5;
            this.#minPlayers = 2;
        }

        InitComponent(){
            for (let i = 1; i < this.#maxPlayers+1; i++) {
                const removeButton = document.getElementById(`remove-player-button-${i}`);
                const addButton = document.getElementById(`add-player-button-${i}`);
                const nameInput = document.getElementById(`name-player-${i}`);
                const nameLabel = document.getElementById(`label-player-${i}`);

                if (i < this.#minPlayers+1) {
                    removeButton.style.display = "block";
                    removeButton.classList.remove("glyph-button");
                    removeButton.classList.add("glyph-button--inactive");
                    addButton.style.display = "none";
                } else {
                    removeButton.style.display = "none";
                    addButton.style.display = "block";
                    nameInput.style.display = "none";
                    nameLabel.style.display = "none";
                }

                if (i > this.#minPlayers+1) {
                    addButton.classList.add("button--inactive");
                }

                removeButton.playerID = i;
                removeButton.addEventListener("click", (event) => this.#HidePlayer(event));
                addButton.playerID = i;
                addButton.addEventListener("click", (event) => this.#ShowPlayer(event));
            }
        }

        #HidePlayer(event) {
            let playerID = event.currentTarget.playerID;
            let button = document.getElementById(`remove-player-button-${playerID}`)
            if (!button.classList.contains("glyph-button--inactive")) {
                document.getElementById(`name-player-${playerID}`).style.display = "none";
                document.getElementById(`label-player-${playerID}`).style.display = "none";
                document.getElementById(`remove-player-button-${playerID}`).style.display = "none";
                document.getElementById(`add-player-button-${playerID}`).style.display = "block";

                if (playerID != this.#maxPlayers) {
                    document.getElementById(`add-player-button-${playerID+1}`).classList.add("button--inactive");
                }
            }
        }

        #ShowPlayer(event) {
            let playerID = event.currentTarget.playerID;
            let button = document.getElementById(`add-player-button-${playerID}`)
            if (!button.classList.contains("button--inactive")) {
                document.getElementById(`name-player-${playerID}`).style.display = "block";
                document.getElementById(`label-player-${playerID}`).style.display = "block";
                document.getElementById(`remove-player-button-${playerID}`).style.display = "block";
                document.getElementById(`add-player-button-${playerID}`).style.display = "none";

                if (playerID != this.#maxPlayers) {
                    document.getElementById(`add-player-button-${playerID+1}`).classList.remove("button--inactive");
                }
            }
        }
    }
    return {
        PlayerSelectionUIManager : PlayerSelectionUIManager
    }
})();