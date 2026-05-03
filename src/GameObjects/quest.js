

export const quest = (() => {
    
    class Quest{
        #reward
        #destination
        
        /**
         * 
         * @param {rewards.Reward} withGoldReward 
         * @param {town_entity.TownEntity} destination
         */
        constructor(reward) {
            this.#reward = reward;
            this.#destination = destination;
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
}) ();