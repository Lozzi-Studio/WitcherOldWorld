import { component } from "../Interfaces/component";
import { rumor } from "../GameObjects/rumor";


export const player_destination_tracker = (() => {

    class PlayerTracker extends component.Component{
        #rumors
        #quests

        constructor() {
            super();
            this.#rumors = [];
            this.#quests = [];
        }

        InitComponent() {
            this._RegisterHandler("player.rumor", (msg) => {this.#addRumor(msg)});
        }

        #addRumor(msg) {
            this.#rumors.push(new rumor.Rumor(msg.region, msg.reward, msg.destination));
        }
    }
}) ();