import * as THREE from 'three';
import { entity_manager } from './Interfaces/entity-manager.js';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { player_entity } from './Players/player-entity.js';
import { player_options } from './Players/player-options.js';
import { game_area_entity } from './GameArea/game-area-entity.js';
import { broadcasts } from './Interfaces/broadcasts.js';
import { cards } from './Cards/card-templates.js';
import { card_options } from './Cards/card-options.js';
import { camera_entity } from './Camera/camera_entity.js';
import { test } from 'vitest';

//architecture style inspired by simondev (youtube)
//https://github.com/simondevyoutube/Quick_3D_RPG

class DemoThreeJS {
    constructor() {
        this.#Initialized()
    }
    
    #Initialized() {
        this._threejs = new THREE.WebGLRenderer({
        antialias: true,
        });
        this._threejs.outputEncoding = THREE.sRGBEncoding;
        this._threejs.gammaFactor = 2.2;
        this._threejs.shadowMap.enabled = true;
        this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
        this._threejs.setPixelRatio(window.devicePixelRatio);
        this._threejs.setSize(window.innerWidth, window.innerHeight);
        this._threejs.domElement.id = 'threejs';

        document.body.appendChild(this._threejs.domElement);

        window.addEventListener('resize', () => {
        this.#OnWindowResize();
        }, false);

        const fov = 60;
        const aspect = 1920 / 1080;
        const near = 1.0;
        const far = 10000.0;
        this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this._camera.position.set(25, 10, 25);

        this._scene = new THREE.Scene();
        this._scene.background = new THREE.Color(0xFFFFFF);
        this._scene.fog = new THREE.FogExp2(0xeb8000, 0.001);

        let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
        light.position.set(-10, 500, 10);
        light.target.position.set(0, 0, 0);
        light.castShadow = true;
        light.shadow.bias = -0.001;
        light.shadow.mapSize.width = 4096;
        light.shadow.mapSize.height = 4096;
        light.shadow.camera.near = 0.1;
        light.shadow.camera.far = 1000.0;
        light.shadow.camera.left = 100;
        light.shadow.camera.right = -100;
        light.shadow.camera.top = 100;
        light.shadow.camera.bottom = -100;
        this._scene.add(light);

        const geometry = new THREE.BoxGeometry( 5, 5, 5 );
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        const cube = new THREE.Mesh( geometry, material );
        this._scene.add( cube );

        const geometry2 = new THREE.BoxGeometry( 5, 5, 5 );
        const material2 = new THREE.MeshBasicMaterial( { color: 0xff0000} );
        const cube2 = new THREE.Mesh( geometry2, material2 );
        cube2.position.x += 50;
        this._scene.add( cube2 );

        this._controls = new OrbitControls(this._camera, this._threejs.domElement);
        this._controls.minPolarAngle = Math.PI / 4;
        this._controls.maxPolarAngle = Math.PI * 0.44;
        this._controls.minDistance = 10;
        this._controls.maxDistance = 55;
        this._camera.position.set( 0, 20, 50 );
        const axesHelper = new THREE.AxesHelper( 100000 );
        this._scene.add( axesHelper );

        const cameraEntity = new camera_entity.Camera(this._camera, this._controls);
        this._entityManager = new entity_manager.EntityManager();
        this._entityManager.AddEntity(cameraEntity);

        cameraEntity.Broadcast(broadcasts.BroadcastTemplateCamera.FocusOn(cube2));
        cameraEntity.Broadcast(broadcasts.BroadcastTemplateCamera.StopFocus());



        const testPlayer = new player_entity.Player("Geralt", player_options.WitcherSchool.Bear());
        this._entityManager.AddEntity(testPlayer, "Player_1");
        const testGameArea = new game_area_entity.GameArea();
        this._entityManager.AddEntity(testGameArea, "Game_Area");

        this._entityManager.FindEntity("Player_1").FindComponent("PlayerSkills").combat.increaseLevel()
        this._entityManager.FindEntity("Player_1").FindComponent("PlayerSkills").combat.increaseLevel()



        this._previousRAF = null;
        this._RAF();
    }

    #OnWindowResize() {
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();
        this._threejs.setSize(window.innerWidth, window.innerHeight);
    }

    _RAF() {
        requestAnimationFrame((t) => {
            if (this._previousRAF === null) {
                this._previousRAF = t;
            }

            this._RAF();

            this._threejs.render(this._scene, this._camera);
            this._Step(t - this._previousRAF);
            this._previousRAF = t;
        });
    }

    _Step(timeElapsed) {
        const timeElapsedS = Math.min(1.0 / 30.0, timeElapsed * 0.001);

        this._entityManager.Update(timeElapsedS);
        this._controls.update();
    }
}


class DemoBackend {
    constructor() {
        this.#Initialized()
    }

    #Initialized(){

        this._threejs = new THREE.WebGLRenderer({
            antialias: true,
        });
        this._threejs.setPixelRatio(window.devicePixelRatio);
        this._threejs.setSize(window.innerWidth, window.innerHeight);
        this._threejs.domElement.id = 'threejs';

        document.body.appendChild(this._threejs.domElement);

        const entityManager = new entity_manager.EntityManager();
        const player1 = new player_entity.Player("Janik", player_options.WitcherSchool.Cat());
        entityManager.AddEntity(player1, "Player_1");
        const gameArea = new game_area_entity.GameArea();
        entityManager.AddEntity(gameArea, "GameArea");
        gameArea.Broadcast(broadcasts.BroadcastTemplateGame.nextPhase());
        gameArea.FindComponent("UIManager").cardSlot1();
        player1.Broadcast(broadcasts.BroadcastTemplateCards
            .AddCard(cards.CardTemplates
                .getDrehungMountain(new Map([[card_options.Color.Green(), card_options.CardEffect.createCardEffect(0,0,0,false,false)],[card_options.Color.Purple(), card_options.CardEffect.createCardEffect(0,0,0,false,false)]])), "Hand"));
        player1.Broadcast(broadcasts.BroadcastTemplateCards
            .AddCard(cards.CardTemplates
                .getVerchnichtenderSchlag(new Map([[card_options.Color.Green(), card_options.CardEffect.createCardEffect(1,0,0,false,false)],[card_options.Color.Yellow(), card_options.CardEffect.createCardEffect(1,0,0,false,false)]])), "Hand"));
        gameArea.FindComponent("UIManager").SelectArdModron();
        console.log(player1.FindComponent("PlayerSkills").combat);
        gameArea.FindComponent("UIManager").SelectArdModron();
        console.log(player1.FindComponent("PlayerSkills").combat);
    }
}

class DemoFrontend {
    constructor() {
        this.#Initialized()
    }

    #Initialized() {
        const testEntityManager = new entity_manager.EntityManager();
        const testPlayer = new player_entity.Player("Hansi", player_options.WitcherSchool.Bear());
        testEntityManager.AddEntity(testPlayer, "Player_1");
        const testGameArea = new game_area_entity.GameArea();

        testEntityManager.FindEntity("Player_1").FindComponent("PlayerSkills").combat.increaseLevel()
    }
}

let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
  _APP = new DemoThreeJS();
});


