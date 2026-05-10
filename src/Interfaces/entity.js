import * as THREE from 'three'

export const entity = (() => {

    class Entity {
        constructor() {
            this._name = null;
            this._components = new Map();

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

        /**
         * 
         * @param {string} name 
         * @param {doSomethingCallback} handler 
         */
        _RegisterHandler(name, handler) {
            if (!(name in this._handlers)) {
                this._handlers[name] = []
            }
            this._handlers[name].push(handler);
        }

        InitComponents() {}

        /**
         * 
         * @param {component.Component} component 
         * @param {string} name 
         */
        AddComponent(component, name) {
            if(name == undefined) {
                name = component.constructor.name;
            }
            component.parent = this;
            this._components.set(name,component)
            component.name = name;
            component.InitComponent();
        }

        /**
         * 
         * @param {string} component 
         * @returns {component.Component}
         */
        FindComponent(component_name) {
            return this._components.get(component_name);
        }

        /**
         * 
         * @param {string} component 
         */
        RemoveComponent(component_name) {
            this._components.delete(component_name);
        }

        /**
         * 
         * @param {string} entity_name 
         * @returns {entity.Entity} 
         */
        FindEntity(entity_name) {
            return this._parent?.FindEntity(entity_name);
        }

        /**
         * 
         * @param {object} msg 
         */
        Broadcast(msg) {
            if (msg.topic in this._handlers) {
                for (let curHandler of this._handlers[msg.topic]) {
                    curHandler(msg);
                }
            }
        }

        /**
         * 
         * @param {object} msg 
         */
        BroadcastOthers(msg) {
            this._parent?.Broadcast(msg,this);
        }

        /**
         * 
         * @param {float} timeElapsed 
         */
        Update(timeElapsed) {
            for (let component of this._components.keys()) {
                this._components.get(component).Update(timeElapsed);
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