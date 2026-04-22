export const component = (() => {

    class Component {
        constructor() {
            this._parent = null;
        }

        InitComponent() {}

        OnActive() {}

        OnDisable() {}

        Update(_) {}


        FindEntity(entity) {
            return this._parent?.FindEntity(entity);
        }

        Broadcast(msg) {
            this._parent?.Broadcast(msg);
        }

        BroadcastOthers(msg) {
            this.parent?.BroadcastOthers(msg);
        }

        FindComponent(component) {
            return this._parent?.FindComponent(component);
        }

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