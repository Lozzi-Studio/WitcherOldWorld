import { component } from "../Interfaces/component";
import { rumor } from "../GameObjects/rumor";


export const player_destination_tracker = (() => {

    class PlayerTracker extends component.Component{
        #rumors
        #quests

        /**
         * A component to keep track of all quests & rumors
         */
        constructor() {
            super();
            this.#rumors = [];
            this.#quests = [];
        }

        /**
         * Used to intialize and add any default components/events
         */
        InitComponent() {
            this._RegisterHandler("player.rumor", (msg) => {this.#addRumor(msg)});
        }

        /**
         * Add a new rumor to tracker
         * @param {object} msg 
         */
        #addRumor(msg) {
            this.#rumors.push(new rumor.Rumor(msg.region, msg.reward, msg.destination));
        }
    }

    return {
        PlayerTracker : PlayerTracker
    }
}) ();