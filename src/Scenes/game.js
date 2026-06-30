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
import { cards } from '../Cards/card-templates';
import { cardshop_entity } from '../CardShop/cardshop-entity';

import data from '../../resources/database/loadingScreen_tooltips.json'
import { notification_entity } from '../notifications/notification-entity';
import { monster_entity } from '../Monster/monster-entity';
import { battle_entity } from '../Battle/battle-entity';


export const game = (() => {

    class GameScene extends scene.Scene{

        /**
         * Main Scene for Game
         */
        constructor() {
            super();
        }

        /**
         * Used to intialize controls
         */
        InitControls() {
            this.#InitCamera();
            this._controls.enabled = true;
            this._controls.minPolarAngle = Math.PI / 6;
            this._controls.maxPolarAngle = Math.PI * 0.38;
            this._controls.minDistance = 10;
            this._controls.maxDistance = 55;
        }   
        
        /**
         * Used to intialize and add any default Entities
         */
        InitSceneEntities() {

            document.getElementById('loading_tip').innerHTML = data["tooltips"][Math.floor(Math.random() * data["tooltips"].length)]
            document.getElementById('game-loading-screen').style.display = 'flex';
            this._entityManager.AddEntity(new notification_entity.NotificationEntity(), "NotificationEntity", true);
            this._scene.background = new THREE.Color(0x3D342C);
            this.#InitShop();
            this.#CacheGameData();

        }

        #CacheGameData(){
            var promises = [];

            for (var card of this._entityManager.FindEntity("Cardshop").FindComponent("Carddeck").hand) {
                let cardName = card.imagePath;
                promises.push(this.#loadTexture(card.imagePath).then(result => { this.CacheData(cardName, result);}));
            }
            for (var card of this._entityManager.FindEntity("Cardshop").FindComponent("Carddeck").deck) {
                let cardName = card.imagePath;
                promises.push(this.#loadTexture(card.imagePath).then(result => {  this.CacheData(cardName, result);}));
            }

            promises.push(this.#loadMusic("resources/sounds/MainMenuTheme.mp3").then(result => {this.CacheData("MainMenuTheme", result)}));
            promises.push(this.#loadMusic("resources/sounds/MainTheme.mp3").then(result => {this.CacheData("MainTheme", result)}));
            promises.push(this.#loadMusic("resources/sounds/Battle_Monster.mp3").then(result => {this.CacheData("BattleMonsterTheme", result)}));
            promises.push(this.#loadMusic("resources/sounds/ChaseTheme.mp3").then(result => {this.CacheData("ChaseTheme", result)}));

            promises.push(this.#loadModel("resources/assets/3D-Assets/provMap.glb").then(result => {  this.CacheData("map", result.scene);}));
            promises.push(this.#loadModel("resources/assets/3D-Assets/bar-table.glb").then(result => {  this.CacheData("table", result.scene);}));

            Promise.all(promises).then(() => {
                setTimeout(() => { this.#startGame();}, 3000);
            });
        }

        #loadTexture(url) {
            return new Promise(resolve => {
                new THREE.TextureLoader().load(url, resolve, resolve, resolve);
            });
        }

        #loadModel(url) {
            return new Promise(resolve => {
                new GLTFLoader().load(url, resolve);
            });
        }

        #loadMusic(url) {
            return new Promise(resolve => {
                new THREE.AudioLoader().load(url, resolve);
            });
        }

        #startGame() {
            this._entityManager.AddEntity(this._parent._currentCamera);
            this._entityManager.FindEntity('Camera').Broadcast(broadcasts.BroadcastTemplateMusic.PlayMainTheme());

            //Keep Order!
            this.#InitTowns();
            this.#InitPlayers();
            this._entityManager.AddEntity(new game_area_entity.GameArea());
            
            this._entityManager.FindEntity("GameArea").Broadcast(broadcasts.BroadcastTemplateGame.StartGame());
            this._entityManager.FindEntity("Cardshop").Broadcast(broadcasts.BroadcastTemplateGame.StartGame());

            this.#InitMap();
            document.getElementById('game-loading-screen').style.display = 'none';
            document.getElementById('game-ui').style.display = 'block';

            this._entityManager.AddEntity(new battle_entity.BattleEntity());
        }
            

        /**
         * Initialize camera entity
         */
        #InitCamera() {
            const fov = 65;
            const aspect = 1920 / 1080;
            const near = 1.0;
            const far = 10000;
            let newCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
            newCamera.position.set(0,50,50);
            newCamera.rotation.x = -Math.PI / 2;
            this._parent.SetCamera(new camera_entity.Camera(newCamera, this._controls));
        }

        #GetPlayersFromSetup() {
            let playerInputFields = [];
            for (let i = 1; i < 6; i++) {
                playerInputFields.push(document.getElementById(`name-player-${i}`));
            }
            
            let witcherSchools = [
                player_options.WitcherSchool.Bear(),
                player_options.WitcherSchool.Cat(),
                player_options.WitcherSchool.Griffin(),
                player_options.WitcherSchool.Viper(),
                player_options.WitcherSchool.Wolf()
            ];

            //Fisher-Yates_shuffle (src:https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)
            for (let i = witcherSchools.length - 1; i >= 1; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [witcherSchools[i], witcherSchools[j]] = [witcherSchools[j], witcherSchools[i]];
            }

            let players = [];
            for (var i = 0; i < playerInputFields.length; i++) {
                let input = playerInputFields[i];
                if (getComputedStyle(input).display != "none") {
                    players.push({name: input.value, witcherschool: witcherSchools[i]});
                }
            }
            return players;
        }

        /**
         * Initialize player entities
         */
        #InitPlayers() {
            let players = this.#GetPlayersFromSetup();
            //Fisher-Yates_shuffle (src:https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)
            for (let i = players.length - 1; i >= 1; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [players[i], players[j]] = [players[j], players[i]];
            }
            let count = 1;
            for (let player of players) {
                let playerEntity = new player_entity.Player(count, player.name, player.witcherschool, count+1);
                this._entityManager.AddEntity(playerEntity, "Player_" + count);
                count += 1;
            }
        }

        /**
         * Initialize town entities
         */
        #InitTowns() {
            const size_x = 2.7;
            const size_y = 0.7;
            const size_z = 2.7;
            this._entityManager.AddEntity(new town_entity.TownEntity(0, "Behelt Nar", town_options.TownAbility.increaseSkillForMoney(), new Vector3(23.6,0,-2.5), region.Region.Joker(), new Vector3(size_x,size_y,size_z), [4,8,11,15], new Vector3(22,0,-5)), "Town_0");
            this._entityManager.AddEntity(new town_entity.TownEntity(1, "Kaer Seren", town_options.TownAbility.increaseSkillForMoney(), new Vector3(-12,0,-19.3), region.Region.River(), new Vector3(size_x,size_y,size_z), [2,6,5,9], new Vector3(-13,0,-22)), "Town_1");
            this._entityManager.AddEntity(new town_entity.TownEntity(2, "Hengfors", town_options.TownAbility.getGeruechte(), new Vector3(5.1,0,-21.6), region.Region.Mountain(), new Vector3(size_x,size_y,size_z),[1,3,6,7], new Vector3(2,0,-22)), "Town_2");
            this._entityManager.AddEntity(new town_entity.TownEntity(3, "Kaer Morhen", town_options.TownAbility.increaseSkillForMoney(), new Vector3(21.8,0,-21.7), region.Region.Mountain(), new Vector3(size_x,size_y,size_z),[2,7,4], new Vector3(19.6,0,-22)), "Town_3");
            this._entityManager.AddEntity(new town_entity.TownEntity(4, "Ban Ard", town_options.TownAbility.increaseSkill(player_skills.Skill.Alchemy()), new Vector3(20,0,-15.4), region.Region.River(), new Vector3(size_x,size_y,size_z),[3,7,8,0], new Vector3(22.3,0,-14.5)), "Town_4");
            this._entityManager.AddEntity(new town_entity.TownEntity(5, "Cidaris", town_options.TownAbility.increaseSkill(player_skills.Skill.Defense()), new Vector3(-12.5,0,-7), region.Region.River(), new Vector3(size_x,size_y,size_z),[1,6,9], new Vector3(-10.6,0,-5.6)), "Town_5");
            this._entityManager.AddEntity(new town_entity.TownEntity(6, "Novigrad", town_options.TownAbility.playWuerfelpoker(), new Vector3(-9.1,0,-12.1), region.Region.Forest(), new Vector3(size_x,size_y,size_z),[1,2,5,7], new Vector3(-7.1,0,-13.9)), "Town_6");
            this._entityManager.AddEntity(new town_entity.TownEntity(7, "Wyzima", town_options.TownAbility.removeShopCards(), new Vector3(-0.8,0,-10.6), region.Region.Forest(), new Vector3(size_x,size_y,size_z),[2,3,4,6,8,9,10,11], new Vector3(1.6,0,-9.5)), "Town_7");
            this._entityManager.AddEntity(new town_entity.TownEntity(8, "Vengerberg", town_options.TownAbility.swapoutCard(), new Vector3(15.7,0,-7.5), region.Region.Forest(), new Vector3(size_x,size_y,size_z),[0,4,7,11], new Vector3(13.9,0,-9.5)), "Town_8");
            this._entityManager.AddEntity(new town_entity.TownEntity(9, "Cintra", town_options.TownAbility.getPotion(), new Vector3(-11.4,0,-0.4), region.Region.Mountain(), new Vector3(size_x,size_y,size_z),[1,5,7,10,12], new Vector3(-9.1,0,-0.5)), "Town_9");
            this._entityManager.AddEntity(new town_entity.TownEntity(10, "Haern Caduch", town_options.TownAbility.increaseSkillForMoney(), new Vector3(-1.3,0,3.4), region.Region.Forest(), new Vector3(size_x,size_y,size_z),[7,9,11,12,14], new Vector3(-3,0,1.4)), "Town_10");
            this._entityManager.AddEntity(new town_entity.TownEntity(11, "Beauclair", town_options.TownAbility.getPotion(), new Vector3(14.4,0,4.6), region.Region.Mountain(), new Vector3(size_x,size_y,size_z),[0,7,8,10,14,15], new Vector3(14.4,0,2.1)), "Town_11");
            this._entityManager.AddEntity(new town_entity.TownEntity(12, "Glenmore", town_options.TownAbility.increaseSkill(player_skills.Skill.Special()), new Vector3(-13.3,0,9.8), region.Region.River(), new Vector3(size_x,size_y,size_z),[9,10,13,14], new Vector3(-10.7,0,10.3)), "Town_12");
            this._entityManager.AddEntity(new town_entity.TownEntity(13, "Doldeth", town_options.TownAbility.getGeruechte(), new Vector3(-15,0,16), region.Region.Mountain(), new Vector3(size_x,size_y,size_z),[12,14,16], new Vector3(-17.6,0,16.2)), "Town_13");
            this._entityManager.AddEntity(new town_entity.TownEntity(14, "Loc Ichaer", town_options.TownAbility.playWuerfelpoker(), new Vector3(3.2,0,13.8), region.Region.River(), new Vector3(size_x,size_y,size_z),[10,11,12,13,15,16,17,18], new Vector3(3.2,0,11)), "Town_14");
            this._entityManager.AddEntity(new town_entity.TownEntity(15, "Gorthur Guaed", town_options.TownAbility.increaseSkillForMoney(), new Vector3(21.7,0,15.1), region.Region.River(), new Vector3(size_x,size_y,size_z),[0,11,14,18], new Vector3(24,0,12.6)), "Town_15");
            this._entityManager.AddEntity(new town_entity.TownEntity(16, "Dhuwod", town_options.TownAbility.getPotion(), new Vector3(-9.9,0,22), region.Region.Forest(), new Vector3(size_x,size_y,size_z),[13,14,18], new Vector3(-7.8,0,23.8)), "Town_16");
            this._entityManager.AddEntity(new town_entity.TownEntity(17, "Stygga", town_options.TownAbility.increaseSkillForMoney() , new Vector3(9.3,0,21.5), region.Region.Forest(), new Vector3(size_x,size_y,size_z),[14,16,18], new Vector3(6.9,0,21.5)), "Town_17");
            this._entityManager.AddEntity(new town_entity.TownEntity(18, "Ard Modron", town_options.TownAbility.increaseSkill(player_skills.Skill.Combat()), new Vector3(18.6,0,22.4), region.Region.Mountain(), new Vector3(size_x,size_y,size_z),[11,14,15,17], new Vector3(15.9,0,23.5)), "Town_18");

        }

        /**
         * Initialize Map and surrounding objects
         */
        #InitMap() {
           this._scene.add(this.GetFromCache("map"));
           this._scene.add(this.GetFromCache("table"));
        }

        /**
         * Intialize Cardshop and surrondings
         */
        #InitShop() {
            const texture = new THREE.TextureLoader().load("resources/assets/textures/wood.jpg");
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(5,2);

            const materialdisplayCardsFront = new THREE.MeshBasicMaterial( { map:  texture, side: THREE.FrontSide} )
            const displayCards = new THREE.Mesh(new THREE.PlaneGeometry(39,10), materialdisplayCardsFront);
            displayCards.rotation.setFromVector3(new THREE.Vector3( - Math.PI /4 ,  0, 0));
            displayCards.position.set(0,5,-33);
            this._scene.add(displayCards);

            texture.repeat.set(5,1);
            const materialdisplayCostFront = new THREE.MeshBasicMaterial( { map:  texture, side: THREE.FrontSide} )
            const displayCost = new THREE.Mesh(new THREE.PlaneGeometry(39,5.2), materialdisplayCostFront);
            displayCost.rotation.setFromVector3(new THREE.Vector3( -Math.PI, Math.PI,0));
            displayCost.position.set(0,0,-29);
            this._scene.add(displayCost);

            const materialdisplayModifierFront = new THREE.MeshBasicMaterial( { map:  texture, side: THREE.FrontSide} )
            const displayModifier = new THREE.Mesh(new THREE.PlaneGeometry(39,5), materialdisplayModifierFront);
            displayModifier.rotation.setFromVector3(new THREE.Vector3( -Math.PI / 2 , 0, 0));
            displayModifier.position.set(0,8,-38.5);
            this._scene.add(displayModifier);
            this._entityManager.AddEntity(new cardshop_entity.Cardshop());
        }
    }

    return {
        GameScene : GameScene
    }
}) ();