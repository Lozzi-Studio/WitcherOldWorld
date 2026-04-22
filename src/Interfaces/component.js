export const component = (() => {

    class Component {
        constructor() {
            this._parent = null;
        }

        InitComponent() {}

        OnActive() {}

        OnDisable() {}

        Update(_) {}

        /**
         * 
         * @param {string} entity_name 
         * @returns 
         */
        FindEntity(entity_name) {
            return this._parent?.FindEntity(entity_name);
        }

        /**
         * 
         * @param {object} msg 
         */
        Broadcast(msg) {
            this._parent?.Broadcast(msg);
        }

        /**
         * 
         * @param {object} msg 
         */
        BroadcastOthers(msg) {
            this.parent?.BroadcastOthers(msg);
        }

        /**
         * 
         * @param {object} component_name 
         * @returns {component.Component}
         */
        FindComponent(component_name) {
            return this._parent?.FindComponent(component_name);
        }

        /**
         * 
         * @param {string} name 
         * @param {doSomethingCallback} handler 
         */
        _RegisterHandler(name,handler) {
            this._parent._RegisterHandler(name,handler);
        }

        set parent(parent){
            this._parent = parent;
        }
    };
        return {
        Component: Component,
    };
}) ();