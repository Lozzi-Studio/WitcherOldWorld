import * as THREE from 'three'
import { scene } from "../Interfaces/scene";
import { player_entity } from "../Players/player-entity";

import { entity_manager } from "../Interfaces/entity-manager";
import { camera_entity } from "../Camera/camera_entity";
import { game_area_entity } from "../GameArea/game-area-entity";
import { broadcasts } from "../Interfaces/broadcasts";
import { town_entity } from "../Town/town-entity";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { town_options } from "../Town/town-options";
import { player_skills } from "../Players/player-skills";
import { region } from "../GameArea/region";
import { Vector3 } from 'three';
import { player_options } from '../Players/player-options';


export const game = (() => {

    class GameScene extends scene.Scene{
        #players;

        constructor() {
            super();
            this.#players = [{name: "Gernot", witcherschool: player_options.WitcherSchool.Wolf(), money: 2}];
        }

        InitControls() {
            this.#InitCamera();
            this._controls.enabled = true;
            this._controls.minPolarAngle = Math.PI / 4;
            this._controls.maxPolarAngle = Math.PI * 0.44;
            this._controls.minDistance = 10;
            this._controls.maxDistance = 48;
        }   

        InitSceneEntities() {

            this._scene.background = new THREE.Color(0x3D342C);
            this.#InitMap();

            this._entityManager.AddEntity(this._parent._currentCamera);
            this._entityManager.FindEntity('Camera').Broadcast(broadcasts.BroadcastTemplateMusic.PlayMainTheme());
            
            //Keep Order!
            this.#InitTowns();
            this.#InitPlayers();
            this._entityManager.AddEntity(new game_area_entity.GameArea());

            document.getElementById('game-ui').style.display = 'block';
            this._entityManager.FindEntity("GameArea").Broadcast(broadcasts.BroadcastTemplateGame.StartGame());

        }

        #InitCamera() {
            const fov = 60;
            const aspect = 1920 / 1080;
            const near = 1.0;
            const far = 10000.0;
            let newCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
            newCamera.position.set(0,50,50);
            newCamera.rotation.x = -Math.PI / 4;
            this._parent.SetCamera(new camera_entity.Camera(newCamera, this._controls));
        }

        #InitPlayers() {
            let count = 1;
            for (let player of this.#players) {
                let playerEntity = new player_entity.Player(player.name, player.witcherschool, player.money);
                this._entityManager.AddEntity(playerEntity, "Player_" + count);
                count += 1;
            }

        }


        #InitTowns() {
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
        }

        #InitMap() {

            const ambientLight = new THREE.AmbientLight('white', 2.5);
            const directlighting = new THREE.DirectionalLight("orange", 3.5);
            directlighting.position.set(10, 10, 7);

            this._scene.add(ambientLight, directlighting);

            const loader = new GLTFLoader();
            loader.load("resources/assets/provMap.glb", (glb) =>{
                glb.scene.traverse((child) =>{
                    if (child.isMesh){
                        child.material.fog = false;
                    }
                });
            this._scene.add(glb.scene)});
        }

        set players(players) {
            this.#players = players;
        }
    }

    return {
        GameScene : GameScene
    }
}) ();