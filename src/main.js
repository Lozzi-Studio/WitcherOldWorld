import * as THREE from 'three';
import { entity_manager } from './Interfaces/entity-manager.js';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { player_entity } from './Players/player-entity.js';
import { player_options } from './Players/player-options.js';
import { game_area_entity } from './GameArea/game-area-entity.js';
import { broadcasts } from './Interfaces/broadcasts.js';
import { cards } from './Cards/card-templates.js';
import { card_options } from './Cards/card-options.js';

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

        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(10, 10),
            new THREE.MeshStandardMaterial({
                color: 0x8c4e03,
            }));
        plane.castShadow = false;
        plane.receiveShadow = true;
        plane.rotation.x = -Math.PI / 2;
        this._scene.add(plane);
        this._controls = new OrbitControls(this._camera, this._threejs.domElement);
        this._camera.position.set( 0, 20, 100 );
        const axesHelper = new THREE.AxesHelper( 100000 );
        this._scene.add( axesHelper );

        this._entityManager = new entity_manager.EntityManager();

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
        gameArea.FindComponent("UIManager").selectArdModron();
        console.log(player1.FindComponent("PlayerSkills").combat);
        gameArea.FindComponent("UIManager").cardSlot1();
        player1.Broadcast(broadcasts.BroadcastTemplateCards
            .AddCard(cards.CardTemplates
                .getDrehung(new Map([[card_options.Color.Green(), card_options.CardEffect.createCardEffect(0,0,0,false,false)],[card_options.Color.Purple(), card_options.CardEffect.createCardEffect(0,0,0,false,false)]])), "Hand"));
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
  _APP = new DemoBackend();
});


