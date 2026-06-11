import { carddeck_component } from "../Cards/carddeck";
import { broadcasts } from "../Interfaces/broadcasts";
import { entity } from "../Interfaces/entity";
import { monster_ai } from "./monster-ai";
import { monster_figure } from "./monster-figure";


export const monster_entity = (() => {
    
    class MonsterEntity extends entity.Entity{
        #monsterName;
        #town;

        constructor(monster_name, town_position) {
            super();
            this.#monsterName = monster_name;
            this.#town = town_position;
        }

        InitComponents() {
            this.AddComponent(new carddeck_component.Carddeck(1));
            this.AddComponent(new monster_figure.MonsterFigure("FFFF00", this.#town.monsterSpot));
            this.AddComponent(new monster_ai.MonsterAi());
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

    }

    return {
        MonsterEntity : MonsterEntity
    }
})();