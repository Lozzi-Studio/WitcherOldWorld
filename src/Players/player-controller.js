import { component } from "../Interfaces/component";

export const player_controller = (() => {

    class PlayerController extends component.Component {
        constructor() {
            super();
        }
    
        InitComponent() {
            this._RegisterHandler('input.click_map', (msg) => { this.#HandleMapClick(msg) });
        }

        #HandleMapClick(msg) {
            // Calculate new target town and position from click
            const targetTown = msg.targetTown;
            const targetPosition = msg.targetCoords;

            this._Parent.Broadcast({
                topic: 'player.move',
                town: targetTown,
                position: targetPosition
            });
        }
    }

    return {
        PlayerController: PlayerController
    }
})();