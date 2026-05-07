import { entity } from "./entity";

export const entity_manager = (() => {

    class EntityManager {
        #scene;
        #renderer;

        constructor(scene, renderer) {
            this._entitiesMap = {};
            this._entities = [];
            this.#scene = scene;
            this.#renderer = renderer;
        }

        /**
         * 
         * @param {string} entity_name 
         * @returns {entity}
         */
        FindEntity(entity_name) {
            return this._entitiesMap[entity_name];
        }

        Filter(condition) {
            return this._entities.filter(condition);
        }

        /**
         * 
         * @param {entity.Entity} entity 
         * @param {string} name 
         */
        AddEntity(entity,name) {
            if (!name) {
                name = entity.constructor.name;
            }

            this._entitiesMap[name] = entity;
            this._entities.push(entity);
            entity.parent = this;
            entity.name = name;
            entity.InitComponents();
        }

        /**
         * 
         * @param {entity.Entity} entity 
         * @param {bool} bool 
         */
        SetActive(entity, bool) {
            if (bool) {
                if (!(entity in this._entities)) {
                    this._entities.push(this._entitiesMap[entity.name]);
                    entity.OnActive();
                }
            } else {
                const i = this._entities.indexOf(entity);
                if (i >= 0) {
                    this._entities.splice(i, 1);
                    entity.OnDisable();
                }
            }
        }

        /**
         * 
         * @param {float} timeElapsed 
         */
        Update(timeElapsed) {
            for (let e of this._entities) {
                e.Update(timeElapsed);
            }
        }

        /**
         * 
         * @param {object} msg 
         * @param {entity.Entity} entityToIgnore 
         */
        Broadcast(msg, entityToIgnore) {
            for (let e of this._entities) {
                if (e != entityToIgnore) {
                    e.Broadcast(msg);
                }
            }
        }

        SwapScene(name){
            this.#scene.SwapScene(name);
        }

        get renderer() {
            return this.#renderer;
        }

        get scene() {
            return this.#scene.scene;
        }

        getEntities() {
            return {list: this._entities, map: this._entitiesMap}
        }

        setEntities(newEntities) {
            this._entities = newEntities.list;
            this._entitiesMap = newEntities.map;
            for (let e in this._entitiesMap){
                e.parent = this;
            }
        }
    }

    return {
        EntityManager: EntityManager
    };
})();