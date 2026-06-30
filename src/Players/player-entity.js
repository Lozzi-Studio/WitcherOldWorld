import * as THREE from 'three';
import { carddeck_component } from "../Cards/carddeck";
import { entity } from "../Interfaces/entity";
import { player_destination_tracker } from "./player-destination-tracker";
import { player_money } from "./player-money";
import { player_options } from "./player-options";
import { player_position } from "./player-position";
import { player_skills } from "./player-skills";
import { player_trophies } from "./player-trophies";
import { player_figure } from "./player-figure";
import { player_status } from "./player-status";
import { hitbox_component } from '../GameArea/hitbox-component';
import { status_templates } from './status-templates';

export const player_entity = (() => {

    class Player extends entity.Entity {
        #id;
        #player_name;
        #witcherSchool;
        #homeTownPosition;
        #currentTown;
        #initialMoney;
        
        /**
         * a wrapper for a player
         * @param {int} id
         * @param {string} player_name 
         * @param {player_options.WitcherSchool} witcherSchool 
         * @param {int} initialMoney
         */
        constructor(id, player_name, witcherSchool, initialMoney) {
            super();
            this.#id = id;
            this.#player_name = player_name;
            this.#witcherSchool = witcherSchool;
            this.#homeTownPosition = witcherSchool.homeTown;
            this.#currentTown = witcherSchool.homeTown;
            this.#initialMoney = initialMoney;
            
        }

        /**
         * Used to intialize and add any default components/events
         */
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
            this.AddComponent(new player_money.MoneyStorage(this.#initialMoney));
            this.AddComponent(new player_destination_tracker.PlayerTracker());
            this.AddComponent(new player_trophies.TrophyStorage());
            this.AddComponent(new player_figure.PlayerFigure(this.#witcherSchool.color, this.#homeTownPosition.position));
            this.AddComponent(new player_status.PlayerStatus());
            this.AddComponent(new hitbox_component.CubicHitbox(this.#homeTownPosition.position, "Player_" + this.#id, new THREE.Vector3(2, 3.4, 2)));
        }

        /**
         * Get the card object to the given cardslot
         * @param {int} cardslot 
         * @returns {card.Card}
         */
        GetHandCard(cardslot){
            return this.FindComponent('Carddeck').GetHandCard(cardslot);
        }

        GetHealth(){
            return (this.FindComponent('Carddeck').hand.length + this.FindComponent('Carddeck').deck.length)
        }

        GetInChase() {
            let amount = 0;
            amount += this.FindComponent("PlayerStatus").GetStatusAmount(status_templates.StatusTemplates.forestTracker());
            amount += this.FindComponent("PlayerStatus").GetStatusAmount(status_templates.StatusTemplates.riverTracker());
            amount += this.FindComponent("PlayerStatus").GetStatusAmount(status_templates.StatusTemplates.mountainTracker());
            return amount > 0;
        }

        get playerName() {
            return this.#player_name;
        }

        get witcherSpecialAbility() {
            let ability = structuredClone(this.#witcherSchool.ability);
            ability.value = ability.value[this.FindComponent('PlayerSkills').special.level - 1]
            return ability;
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

        get id() {
            return this.#id;
        }
    }

    return {
        Player : Player
    }

})();