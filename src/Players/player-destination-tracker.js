import { component } from "../Interfaces/component";
import { rumor } from "../GameObjects/rumor";
import { broadcasts } from "../Interfaces/broadcasts";
import { status_options } from "./status-options";
import { status_templates } from "./status-templates";
import { region } from "../GameArea/region";

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
            this._RegisterHandler('player.resolveLocation', (msg) => {this.#checkLocation(msg)})
        }

        /**
         * Add a new rumor to tracker
         * @param {object} msg 
         */
        #addRumor(msg) {
            this.#rumors.push(new rumor.Rumor(msg.region, msg.reward, msg.destination));
        }

        #checkLocation(msg) {
            for (let rumor of this.#rumors) {
                if (rumor.destination == msg.town) {
                    this.Broadcast(broadcasts.BroadcastTemplatePlayer.ChangeMoney(rumor.reward.amount));
                    switch (rumor.region.toIdentifier()) {
                        case region.Region.Forest().toIdentifier():
                            this.Broadcast(broadcasts.BroadcastTemplatePlayer.AddStatus(status_templates.StatusTemplates.forestTracker(), "permanent"));
                            break;
                        case region.Region.River().toIdentifier():
                            this.Broadcast(broadcasts.BroadcastTemplatePlayer.AddStatus(status_templates.StatusTemplates.riverTracker(), "permanent"));
                            break;
                        case region.Region.Mountain().toIdentifier():
                            this.Broadcast(broadcasts.BroadcastTemplatePlayer.AddStatus(status_templates.StatusTemplates.mountainTracker(), "permanent"));
                            break;
                    }
                    this.FindEntity("GameArea").FindComponent('TownManager').ReturnToPool(msg.town);
                }
            }
        }
    }

    return {
        PlayerTracker : PlayerTracker
    }
}) ();