import { rewards } from "./rewards";
import { region } from "../GameArea/region";


export const rumor = (() => {

    class Rumor {
        #region
        #reward
        #destination

        /**
         * 
         * @param {region.Region} region 
         * @param {rewards.Reward} reward
         * @param {town_entity.TownEntity} destination
         */
        constructor(region, reward, destination) {
            this.#region = region;
            this.#reward = reward;
            this.#destination = destination;

        }

        /**
         * @returns {region.Region}
         */
        get region() {
            return this.#region;
        }

        /**
         * @returns {rewards.Reward}
         */
        get reward() {
            return this.#reward;
        }

        get destination() {
            return this.#destination;
        }
    }

    return {
        Rumor : Rumor
    }
}) ();