export const component = (() => {

    class Component {
        #name
        
        /**
         * An interface for a component to give certain properties to a entity.
         */
        constructor() {
            this._parent = null;
            this.#name = null;
        }

        /**
         * Used to intialize and add any default components/events
         */
        InitComponent() {}

        /**
         * Trigger on set to active
         */
        OnActive() {}

        /**
         * Trigger on set to disable
         */
        OnDisable() {}

        /**
         * Triggers after specific time intervall
         * @param {float} timeElapsed 
         */
        Update(_) {}

        /**
         * Returns the entity for the given name
         * @param {string} entity_name 
         * @returns {entity.Entity}
         */
        FindEntity(entity_name) {
            return this._parent?.FindEntity(entity_name);
        }

        /**
         * Brodcast an object message to all components from the parent entity. Use templates in ./broadcasts.js
         * @param {object} msg 
         */
        Broadcast(msg) {
            this._parent?.Broadcast(msg);
        }

        /**
         * Brodcast an object message to all components from other entities than the parent entity. Use templates in ./broadcasts.js
         * @param {object} msg 
         */
        BroadcastOthers(msg) {
            this._parent?.BroadcastOthers(msg);
        }

        /**
         * Returns the component for the given name from the current entity
         * @param {object} component_name 
         * @returns {component.Component}
         */
        FindComponent(component_name) {
            return this._parent?.FindComponent(component_name);
        }

        /**
         * Register handler for given event
         * @param {string} name 
         * @param {doSomethingCallback} handler 
         */
        _RegisterHandler(name,handler) {
            this._parent._RegisterHandler(name,handler);
        }

        set parent(parent){
            this._parent = parent;
        }

        get parent() {
            return this._parent;
        }

        get name(){
            return this.#name;
        }

        set name(newName) {
            this.#name = newName;
        }
    };
        return {
        Component: Component,
    };
}) ();