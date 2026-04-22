import * as THREE from 'three'

export const entity = (() => {

    class Entity {
        constructor() {
            this._name = null;
            this._components = {};

            this._position = new THREE.Vector3();
            this._rotation = new THREE.Quaternion();
            this._handlers = {};
            this._parent = null;
        }

        OnActive() {
            for (let component in this._components) {
                this._components[component].OnActive();
            }
        }

        OnDisable() {
            for (let component in this._components) {
                this._components[component].OnDisable();
            }
        }

        _RegisterHandler(name, handler) {
            if (!(name in this._handlers)) {
                this._handlers[name] = []
            }
            this._handlers[name].push(handler);
        }

        AddComponent(component, name) {
            if(name == undefined) {
                name = component.constructor.name;
            }
            component.parent = this;
            this._components[name] = component;
            component.InitComponent();
        }

        FindComponent(component) {
            return this._components[component];
        }

        FindEntity(entity) {
            return this._parent?.FindEntity(entity);
        }

        Broadcast(msg) {
            if (msg.topic in this._handlers) {
                for (let curHandler of this._handlers[msg.topic]) {
                    curHandler(msg);
                }
            }
        }

        BroadcastOthers(msg) {
            this._parent?.Broadcast(msg,this);
        }

        Update(timeElapsed) {
            for (let component in this._components) {
                this._components[component].Update(timeElapsed);
            }
        }

        set parent(newParent) {
            this._parent = newParent;
        }
        
        get name() {
            return this._name;
        }

        set name(newName) {
            this._name = newName;
        }

        set active(bool) {
            this._parent?.SetActive(this, bool)
        }

        set position(position) {
            this._position.copy(position);
            this.Broadcast({
                topic: 'update.position',
                value: this._position,
            })
        }

        set rotation(rotation) {
            this._rotation.copy(rotation);
            this.Broadcast({
                topic: 'update.rotation',
                value: this._rotation,
            })
        }
    };

   

    return {
        Entity: Entity,
    };
}) ();