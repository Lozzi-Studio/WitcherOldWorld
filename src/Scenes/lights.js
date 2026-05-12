import * as THREE from 'three';
import { component } from "../Interfaces/component";


export const lights = (() => {

    class LightMainMenu extends component.Component{

        /**
         * Initializes Lights for MainMenuScene
         */
        constructor() {
            super();
        }

        /**
         * Used to intialize and add any default components/events
         */
        InitComponent() {
            const ambientLight = new THREE.AmbientLight('orange',10);
            this._parent._parent.scene.add(ambientLight);
        }
    }

    class LightGameScene extends component.Component{

        /**
         * Initializes lights for GameScene
         */
        constructor() {
            super();
        }

        /**
         * Used to intialize and add any default components/events
         */
        InitComponent() {
            
            const ambientLight = new THREE.AmbientLight('white', 3.5);
            const directlighting = new THREE.DirectionalLight("orange", 3.5);
            directlighting.position.set(10, 10, 7);

            this._parent._parent.scene.add(ambientLight, directlighting);
        }
    }

    return {
        LightMainMenu : LightMainMenu,
        LightGameScene : LightGameScene
    }
}) ();