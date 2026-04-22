import { component } from "../Interfaces/component";


export const player_position = (() => {

    class PlayerPosition extends component.Component{
        #currentTown;
        #currentPosition;

        constructor(startTown, startPosition) {
            super()
            this.#currentPosition = startPosition;
            this.#currentTown = startTown;
        }

        InitComponent(){
            this._RegisterHandler('player.move', (msg) => {this.#PlayerMove(msg)});
        }

        #PlayerMove(msg) {
            this.#currentTown = msg.town;
            this.#currentPosition = msg.position;
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