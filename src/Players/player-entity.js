import { carddeck_component } from "../Cards/carddeck";
import { entity } from "../Interfaces/entity";
import { player_destination_tracker } from "./player-destination-tracker";
import { player_money } from "./player-money";
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
            
        }

        InitComponents() {
            let homeTown = null;
            switch (this.#homeTownPosition) {
                case "Gorthur Guaed":
                    homeTown = this.FindEntity('Town_15');
                    break;
                case "Stygga":
                    homeTown = this.FindEntity('Town_17');
                    break;
                case "Haern Caduch":
                    homeTown = this.FindEntity('Town_10');
                    break;
                case "Kaer Morhen":
                    homeTown =this.FindEntity('Town_3');
                    break;
                case "Kaer Seren":
                    homeTown = this.FindEntity('Town_1');
                    break;
            }
            this.#homeTownPosition = homeTown ?? this.#homeTownPosition;
            this.#currentTown = homeTown ?? this.#currentTown;


            this.AddComponent(new carddeck_component.Carddeck(7));
            this.AddComponent(new player_position.PlayerPosition(this.#currentTown, this.#currentTown.position));
            this.AddComponent(new player_skills.PlayerSkills());
            this.AddComponent(new player_skills.Shield());
            this.AddComponent(new player_money.MoneyStorage());
            this.AddComponent(new player_destination_tracker.PlayerTracker());
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
            return this.#witcherSchool.ability;
        }

        get position() {
            return this.FindComponent('PlayerPosition').currentPosition;
        }
        
        get town() {
            return this.FindComponent('PlayerPosition').currentTown;
        }

        get witcherSchool() {
            return this.#witcherSchool
        }
    }

    return {
        Player : Player
    }

})();