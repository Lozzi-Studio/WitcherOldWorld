import { component } from "../Interfaces/component";


export const monster_property = (() => {

    class MonsterProperty extends component.Component {
        #health;
        #rank;

        constructor(health, rank) {
            super();
            this.#health = health;
            this.#rank = rank;
        }

        get rank() {
            return this.#rank;
        }

        get health() {
            return this.#health;
        }
    }

    return {
        MonsterProperty : MonsterProperty
    }
}) ();