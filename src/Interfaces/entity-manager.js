import { entity } from "./entity";

export const entity_manager = (() => {

    class EntityManager {
        constructor() {
            this._ids = 0;
            this._entitiesMap = {};
            this._entities = [];
        }

        _GenerateName() {
            this._ids += 1;
            return '__name__' + this._ids;
        }

        FindEntity(entity) {
            return this._entitiesMap[entity];
        }

        Filter(condition) {
            return this._entities.filter(condition);
        }

        AddEntity(entity,name) {
            if (!name) {
                name = this._GenerateName();
            }

            this._entitiesMap[name] = entity;
            this._entities.push(entity);
            entity.parent = this;
            entity.name = name;
        }

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

        Update(timeElapsed) {
            for (let e of this._entities) {
                e.Update(timeElapsed);
            }
        }

        Broadcast(msg, entityToIgnore) {
            for (let e of this._entities) {
                if (e != entityToIgnore) {
                    e.Broadcast(msg);
                }
            }
        }
    }

    return {
        EntityManager: EntityManager
    };
})();