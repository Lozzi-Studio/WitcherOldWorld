import { broadcasts } from "../Interfaces/broadcasts";
import { component } from "../Interfaces/component";


export const player_position = (() => {

    class PlayerPosition extends component.Component{
        #currentTown;
        #currentPosition;

        /**
         * A component to track player position
         * @param {town_entity.TownEntity} startTown 
         * @param {three.Vector3} startPosition 
         */
        constructor(startTown, startPosition) {
            super()
            this.#currentPosition = startPosition;
            this.#currentTown = startTown;
        }

        /**
         * Used to intialize and add any default components/events
         */
        InitComponent(){
            this._RegisterHandler('player.move', (msg) => {this.#PlayerMove(msg)});
        }

        /**
         * Change position of player
         * @param {object} msg 
         */
        #PlayerMove(msg) {
            this.#currentTown = msg.town;
            this.#currentPosition = msg.position;
            this.Broadcast(broadcasts.BroadcastTemplatePlayer.ResolveTownLocation(msg.town));
        }

        get currentTown() {
            return this.#currentTown;
        }

        get currentPosition() {
            return this.#currentPosition;
        }

    }

    return {
        PlayerPosition : PlayerPosition
    }
})();