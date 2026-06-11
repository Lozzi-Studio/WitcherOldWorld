import * as THREE from 'three'

export const entity = (() => {

    class Entity {

        /**
         * An interface for an entity
         */
        constructor() {
            this._name = null;
            this._components = new Map();

            this._position = new THREE.Vector3();
            this._rotation = new THREE.Quaternion();
            this._handlers = {};
            this._parent = null;
        }

        /**
         * Triggers all components on set to active
         */
        OnActive() {
            for (let component in this._components) {
                this._components[component].OnActive();
            }
        }

        /**
         * Triggers all components on set to disable
         */
        OnDisable() {
            for (let component in this._components) {
                this._components[component].OnDisable();
            }
        }

        /**
         * Register handler for given event
         * @param {string} name 
         * @param {doSomethingCallback} handler 
         */
        _RegisterHandler(name, handler) {
            if (!(name in this._handlers)) {
                this._handlers[name] = []
            }
            this._handlers[name].push(handler);
        }

        /**
         * Used to intialize and add any default components/events
         */
        InitComponents() {}

        /**
         * Add a component to this entity
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
         * Returns the component for the given name
         * @param {string} component 
         * @returns {component.Component}
         */
        FindComponent(component_name) {
            return this._components.get(component_name);
        }

        /**
         * Remove a component to this entity
         * @param {string} component 
         */
        RemoveComponent(component_name) {
            this._components.delete(component_name);
        }

        /**
         * Returns the entity for the given name
         * @param {string} entity_name 
         * @returns {entity.Entity} 
         */
        FindEntity(entity_name) {
            return this._parent?.FindEntity(entity_name);
        }

        /**
         * Brodcast an object message to all components in this entity. Use templates in ./broadcasts.js
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
         * Brodcast an object message to all components in other entities. Use templates in ./broadcasts.js
         * @param {object} msg 
         */
        BroadcastOthers(msg) {
            this._parent?.Broadcast(msg,this);
        }

        /**
         * 
         * @param {string} key 
         * @returns {*}
         */
        GetFromCache(key){
            return this._parent.GetFromCache(key);
        }

        /**
         * Triggers after specific time intervall
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

        get position() {
            return this._position;
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