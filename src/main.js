import * as THREE from 'three';
import { entity_manager } from './Interfaces/entity-manager.js';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { player_entity } from './Players/player-entity.js';
import { player_options } from './Players/player-options.js';
import { game_area_entity } from './GameArea/game-area-entity.js';
import { broadcasts } from './Interfaces/broadcasts.js';
import { cards } from './Cards/card-templates.js';
import { card_options } from './Cards/card-options.js';
import { card } from './Cards/card.js';
import { camera_entity } from './Camera/camera_entity.js';
import {GLTFLoader} from 'three/examples/jsm/Addons.js';
import {AmbientLight, DirectionalLight, HemisphereLight} from 'three';import { test } from 'vitest';
import { game_manager } from './GameArea/game-manager.js';

import { town_entity } from './Town/town-entity.js';
import { town_options } from './Town/town-options.js';
import { Vector3 } from 'three';
import { region } from './GameArea/region.js';
import { player_skills } from './Players/player-skills.js';
import { player_figure } from './Players/player-figure.js';
import { scene_manager } from './Interfaces/scene-manager.js';
import { game } from './Scenes/game.js';
import { main_menu } from './Scenes/main-menu.js';
import { player_menu } from './Scenes/player-menu.js';
import { placeholder } from './Scenes/placeholder.js';

//architecture style inspired by simondev (youtube)
//https://github.com/simondevyoutube/Quick_3D_RPG


class DemoGame{
    #sceneManager;

    /**
     * Game Demo
     */
    constructor() {
        this.#Initialized()
    }

    /**
     * Initialize all Scenes and start first scene
     */
    #Initialized(){
 
        this.#sceneManager = new scene_manager.SceneManager();
        this.#sceneManager.AddScene(new placeholder.Placeholder());
        this.#sceneManager.AddScene(new game.GameScene());
        this.#sceneManager.AddScene(new main_menu.MainMenu());
        this.#sceneManager.AddScene(new player_menu.PlayerMenu());
        //this.#sceneManager.SwitchScene("Placeholder");
        this.#sceneManager.SwitchScene("GameScene");
    }
}

let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
  _APP = new DemoGame();
});


