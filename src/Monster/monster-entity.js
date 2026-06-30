import { carddeck_component } from "../Cards/carddeck";
import { broadcasts } from "../Interfaces/broadcasts";
import { entity } from "../Interfaces/entity";
import { monster_ai } from "./monster-ai";
import { monster_figure } from "./monster-figure";
import { monster_property } from "./monster-property";


export const monster_entity = (() => {
    
    class MonsterEntity extends entity.Entity{
        #monsterName;
        #town;
        #initialRank;
        #intialHealth

        constructor(monster_name, town_position, health, rank) {
            super();
            this.#monsterName = monster_name;
            this.#town = town_position;
            this.#intialHealth = health;
            this.#initialRank = rank;
        }

        InitComponents() {
            this.AddComponent(new carddeck_component.Carddeck(1));
            let color = "c47bc6";
            switch(this.#initialRank ) {
                case 1:
                    color = "c47bc6";
                    break;
                case 2:
                    color = "854587";
                    break;
                case 3:
                    color = "482848";
                    break;
            }
            this.AddComponent(new monster_figure.MonsterFigure(color, this.#town.monsterSpot));
            this.AddComponent(new monster_ai.MonsterAi());
            this.AddComponent(new monster_property.MonsterProperty(this.#intialHealth, this.#initialRank));
        }

        GetCurrentHealth() {
            return (this.FindComponent('Carddeck').hand.length + this.FindComponent('Carddeck').deck.length)
        }

        get monsterName() {
            return this.#monsterName;
        }

        get position() {
            return this.#town.monsterSpot;
        }

        get town() {
            return this.#town;
        }

        get health() {
            return this.FindComponent("MonsterProperty").health;
        }

        get rank() {
            return this.FindComponent("MonsterProperty").rank;
        }

    }

    return {
        MonsterEntity : MonsterEntity
    }
})();