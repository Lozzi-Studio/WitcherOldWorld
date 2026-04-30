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
import {GLTFLoader} from 'three/examples/jsm/Addons.js';
import {AmbientLight, DirectionalLight, HemisphereLight} from 'three';import { test } from 'vitest';

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
        this._scene.background = new THREE.Color(0x3D342C);
        this._scene.fog = new THREE.FogExp2(0xeb8000, 1);

        const ambientLight = new AmbientLight('white', 0.5);
        const directlighting = new DirectionalLight("orange", 2);
        directlighting.position.set(5, 10, 7);

        this._scene.add(ambientLight, directlighting);

        const loader = new GLTFLoader();
        loader.load("resources/assets/provMap.glb", (glb) =>{
            glb.scene.traverse((child) =>{
                if (child.isMesh){
                child.material.fog = false;
                }
            });
        this._scene.add(glb.scene)});


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

        console.log(this._entityManager.Filter(x => x.name.includes("Player")));



        const testPlayer = new player_entity.Player("Player 1", player_options.WitcherSchool.Bear());
        this._entityManager.AddEntity(testPlayer, "Player_1");
        const testGameArea = new game_area_entity.GameArea();
        this._entityManager.AddEntity(testGameArea, "Game_Area");
        testGameArea.Broadcast(broadcasts.BroadcastTemplateGame.NextTurn(testPlayer));

        this._entityManager.FindEntity("Player_1").FindComponent("PlayerSkills").combat.increaseLevel();
        this._entityManager.FindEntity("Player_1").FindComponent("PlayerSkills").combat.increaseLevel();
        this._entityManager.FindEntity("Player_1").FindComponent("PlayerSkills").combat.increaseLevel();
        this._entityManager.FindEntity("Player_1").FindComponent("PlayerSkills").combat.increaseLevel();

        this._entityManager.FindEntity("Player_1").FindComponent("PlayerSkills").defense.increaseLevel();
        this._entityManager.FindEntity("Player_1").FindComponent("PlayerSkills").defense.increaseLevel();
        this._entityManager.FindEntity("Player_1").FindComponent("PlayerSkills").defense.increaseLevel();

        this._entityManager.FindEntity("Player_1").FindComponent("PlayerSkills").alchemy.increaseLevel();
        this._entityManager.FindEntity("Player_1").FindComponent("PlayerSkills").alchemy.increaseLevel();

        this._entityManager.FindEntity("Player_1").FindComponent("PlayerSkills").special.increaseLevel();



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
        gameArea.FindComponent("UIManager").selectArdModron();
        console.log(player1.FindComponent("PlayerSkills").combat);
        gameArea.FindComponent("UIManager").selectArdModron();
        console.log(player1.FindComponent("PlayerSkills").combat);
    }
}

let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
  _APP = new DemoThreeJS();
});


