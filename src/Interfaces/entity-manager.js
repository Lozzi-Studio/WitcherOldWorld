import { entity } from "./entity";

export const entity_manager = (() => {

    class EntityManager {
        #renderer;

         /**
         * A manager for entities.
         */
        constructor(scene, renderer) {
            this._entitiesMap = {};
            this._entities = [];
            this._scene = scene;
            this.#renderer = renderer;
        }

        /**
         * Returns the entity for the given name.
         * @param {string} entity_name 
         * @returns {entity}
         */
        FindEntity(entity_name) {
            return this._entitiesMap[entity_name];
        }

        /**
         * Get a filtered collection of all entities
         * @param {*} condition 
         * @returns 
         */
        Filter(condition) {
            return this._entities.filter(condition);
        }

        /**
         * Add an entity to this manager
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
         * Set state of entity and their components on acitive or disabled
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
         * Triggers after specific time intervall
         * @param {float} timeElapsed 
         */
        Update(timeElapsed) {
            for (let e of this._entities) {
                e.Update(timeElapsed);
            }
        }

        /**
         * Brodcast an object message to all components from all entities. Use templates in ./broadcasts.js
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

        /**
         * Switches the current scene
         * @param {string} name 
         * @param {bool} stopAudio - Default: true
         */
        SwitchScene(name,stopAudio = true){
            this._scene.SwitchScene(name, stopAudio);
        }

        get renderer() {
            return this.#renderer;
        }

        get scene() {
            return this._scene.scene;
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