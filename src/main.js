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
import { game_manager } from './GameArea/game-manager.js';

import { town_entity } from './Town/town-entity.js';
import { town_options } from './Town/town-options.js';
import { Vector3 } from 'three';
import { region } from './GameArea/region.js';
import { player_skills } from './Players/player-skills.js';

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

        this._entityManager = new entity_manager.EntityManager(this._scene, this._threejs);

        this._entityManager.AddEntity(new town_entity.TownEntity(0, "Behelt Nar", town_options.TownAbility.increaseSkillForMoney(), new Vector3(23.6,0,-2.5), region.Region.Joker(), new Vector3(2.7,2.7,2.7)), "Town_0");
        this._entityManager.AddEntity(new town_entity.TownEntity(1, "Kaer Seren", town_options.TownAbility.increaseSkillForMoney(), new Vector3(-12,0,-19.3), region.Region.River(), new Vector3(2.7,2.7,2.7)), "Town_1");
        this._entityManager.AddEntity(new town_entity.TownEntity(2, "Hengfors", town_options.TownAbility.getGeruechte(), new Vector3(5.1,0,-21.6), region.Region.Mountain(), new Vector3(2.7,2.7,2.7)), "Town_2");
        this._entityManager.AddEntity(new town_entity.TownEntity(3, "Kaer Morhen", town_options.TownAbility.increaseSkillForMoney(), new Vector3(21.8,0,-21.7), region.Region.Mountain(), new Vector3(2.7,2.7,2.7)), "Town_3");
        this._entityManager.AddEntity(new town_entity.TownEntity(4, "Ban Ard", town_options.TownAbility.increaseSkill(player_skills.Skill.Alchemy()), new Vector3(20,0,-15.4), region.Region.River(), new Vector3(2.7,2.7,2.7)), "Town_4");
        this._entityManager.AddEntity(new town_entity.TownEntity(5, "Cidaris", town_options.TownAbility.increaseSkill(player_skills.Skill.Defense()), new Vector3(-12.5,0,-7), region.Region.River(), new Vector3(2.7,2.7,2.7)), "Town_5");
        this._entityManager.AddEntity(new town_entity.TownEntity(6, "Novigrad", town_options.TownAbility.playWuerfelpoker(), new Vector3(-9.1,0,-12.1), region.Region.Forest(), new Vector3(2.7,2.7,2.7)), "Town_6");
        this._entityManager.AddEntity(new town_entity.TownEntity(7, "Wyzima", town_options.TownAbility.removeShopCards(), new Vector3(-0.8,0,-10.6), region.Region.Forest(), new Vector3(2.7,2.7,2.7)), "Town_7");
        this._entityManager.AddEntity(new town_entity.TownEntity(8, "Vengerberg", town_options.TownAbility.swapoutCard(), new Vector3(15.7,0,-7.5), region.Region.Forest(), new Vector3(2.7,2.7,2.7)), "Town_8");
        this._entityManager.AddEntity(new town_entity.TownEntity(9, "Cintra", town_options.TownAbility.getPotion(), new Vector3(-11.4,0,-0.4), region.Region.Mountain(), new Vector3(2.7,2.7,2.7)), "Town_9");
        this._entityManager.AddEntity(new town_entity.TownEntity(10, "Haern Caduch", town_options.TownAbility.increaseSkillForMoney(), new Vector3(-1.3,0,3.4), region.Region.Forest(), new Vector3(2.7,2.7,2.7)), "Town_10");
        this._entityManager.AddEntity(new town_entity.TownEntity(11, "Beauclair", town_options.TownAbility.getPotion(), new Vector3(14.4,0,4.6), region.Region.Mountain(), new Vector3(2.7,2.7,2.7)), "Town_11");
        this._entityManager.AddEntity(new town_entity.TownEntity(12, "Glenmore", town_options.TownAbility.increaseSkill(player_skills.Skill.Special()), new Vector3(-13.3,0,9.8), region.Region.River(), new Vector3(2.7,2.7,2.7)), "Town_12");
        this._entityManager.AddEntity(new town_entity.TownEntity(13, "Doldeth", town_options.TownAbility.getGeruechte(), new Vector3(-15,0,16), region.Region.Mountain(), new Vector3(2.7,2.7,2.7)), "Town_13");
        this._entityManager.AddEntity(new town_entity.TownEntity(14, "Loc Ichaer", town_options.TownAbility.playWuerfelpoker(), new Vector3(3.2,0,13.8), region.Region.River(), new Vector3(2.7,2.7,2.7)), "Town_14");
        this._entityManager.AddEntity(new town_entity.TownEntity(15, "Gorthur Guaed", town_options.TownAbility.increaseSkillForMoney(), new Vector3(21.7,0,15.1), region.Region.River(), new Vector3(2.7,2.7,2.7)), "Town_15");
        this._entityManager.AddEntity(new town_entity.TownEntity(16, "Dhuwod", town_options.TownAbility.getPotion(), new Vector3(-9.9,0,22), region.Region.Forest(), new Vector3(2.7,2.7,2.7)), "Town_16");
        this._entityManager.AddEntity(new town_entity.TownEntity(17, "Stygga", town_options.TownAbility.increaseSkillForMoney() , new Vector3(9.3,0,21.5), region.Region.Forest(), new Vector3(2.7,2.7,2.7)), "Town_17");
        this._entityManager.AddEntity(new town_entity.TownEntity(18, "Ard Modron", town_options.TownAbility.increaseSkill(player_skills.Skill.Combat()), new Vector3(18.6,0,22.4), region.Region.Mountain(), new Vector3(2.7,2.7,2.7)), "Town_18");


        const cameraEntity = new camera_entity.Camera(this._camera, this._controls);
        this._entityManager.AddEntity(cameraEntity, "Camera");

        const player1 = new player_entity.Player("Gernot", player_options.WitcherSchool.Bear(), 2);
        const player2 = new player_entity.Player("Vesemir", player_options.WitcherSchool.Cat(), 3);
        const player3 = new player_entity.Player("Lambert", player_options.WitcherSchool.Griffin(), 4);
        this._entityManager.AddEntity(player1, "Player_1");
        this._entityManager.AddEntity(new game_area_entity.GameArea(this._threejs, this._scene), "GameArea");
        this._entityManager.AddEntity(player2, "Player_2");
        this._entityManager.AddEntity(player3, "Player_3");
        
        this._entityManager.FindEntity("GameArea").Broadcast(broadcasts.BroadcastTemplateGame.StartGame());
        this._entityManager.FindEntity("GameArea").Broadcast(broadcasts.BroadcastTemplateGame.NextTurn(player1));
        for (let i = 0; i < 4; i++) {
            this._entityManager.FindEntity("GameArea").Broadcast(broadcasts.BroadcastTemplateGame.NextPhase());
        }

        this._entityManager.FindEntity("Player_2").Broadcast(broadcasts.BroadcastTemplateSkills.ChangeSkillLevel(player_skills.Skill.Combat(), "Increase", false));
        this._entityManager.FindEntity("Player_2").Broadcast(broadcasts.BroadcastTemplateSkills.ChangeSkillLevel(player_skills.Skill.Combat(), "Increase", false));
        this._entityManager.FindEntity("Player_2").Broadcast(broadcasts.BroadcastTemplateSkills.ChangeSkillLevel(player_skills.Skill.Combat(), "Increase", false));

        this._entityManager.FindEntity("Player_2").Broadcast(broadcasts.BroadcastTemplateSkills.ChangeSkillLevel(player_skills.Skill.Defense(), "Increase", false));
        this._entityManager.FindEntity("Player_2").Broadcast(broadcasts.BroadcastTemplateSkills.ChangeSkillLevel(player_skills.Skill.Defense(), "Increase", false));

        this._entityManager.FindEntity("Player_2").Broadcast(broadcasts.BroadcastTemplateSkills.ChangeSkillLevel(player_skills.Skill.Alchemy(), "Increase", false));

        this._entityManager.FindEntity("Player_2").Broadcast(broadcasts.BroadcastTemplateSkills.ChangeSkillLevel(player_skills.Skill.Special(), "Increase", false));

        this._entityManager.FindEntity("Player_2").Broadcast(broadcasts.BroadcastTemplateSkills.ChangeCurrentShield("Increase", 1));

        this._entityManager.FindEntity("Player_2").Broadcast(broadcasts.BroadcastTemplatePlayer.ChangeMoney(2));
        this._entityManager.FindEntity("Player_2").Broadcast(broadcasts.BroadcastTemplatePlayer.ChangeMoney(-3));
        this._entityManager.FindEntity("Player_2").Broadcast(broadcasts.BroadcastTemplatePlayer.AddTrophy());
        this._entityManager.FindEntity("Player_2").Broadcast(broadcasts.BroadcastTemplatePlayer.AddTrophy());


        cameraEntity.Broadcast(broadcasts.BroadcastTemplateMusic.PlayMainTheme());
        //cameraEntity.Broadcast(broadcasts.BroadcastTemplateMusic.PlayChaseTheme());
        //cameraEntity.Broadcast(broadcasts.BroadcastTemplateMusic.PlayBattleMonsterTheme());
        
        


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


