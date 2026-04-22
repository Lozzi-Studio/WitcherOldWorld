import { carddeck_component } from "../Cards/carddeck";
import { entity } from "../Interfaces/entity";
import { player_options } from "./player-options";
import { player_position } from "./player-position";
import { player_skills } from "./player-skills";

export const player_entity = (() => {

    class Player extends entity.Entity {
        #player_name;
        #witcherSchool;
        #homeTownPosition;
        #currentTown;
        
        /**
         * 
         * @param {string} player_name 
         * @param {player_options.WitcherSchool} witcherSchool 
         */
        constructor(player_name, witcherSchool) {
            super();
            this.#player_name = player_name;
            this.#witcherSchool = witcherSchool;
            this.#homeTownPosition = witcherSchool.homeTown;
            this.#currentTown = witcherSchool.homeTown;

            this.AddComponent(new carddeck_component.Carddeck(7));
            this.AddComponent(new player_position.PlayerPosition(this.#currentTown, this.#currentTown.position));
            this.AddComponent(new player_skills.PlayerSkills());
            this.AddComponent(new player_skills.Shield());

        }

        /**
         * 
         * @param {int} cardslot 
         * @returns {card.Card}
         */
        getHandCard(cardslot){
            return this.FindComponent('Carddeck').getHandCard(cardslot);
        }

        get playerName() {
            return this.#player_name;
        }

        get witcherSpecialAbility() {
            return this.#witcherSchool.ability
        }

        get position() {
            return this.FindComponent('PlayerPosition').currentPosition;
        }
        
        get town() {
            return this.FindComponent('PlayerPosition').currentTown;
        }
    }

    return {
        Player : Player
    }

})();