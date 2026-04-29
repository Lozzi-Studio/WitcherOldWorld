import { entity } from "../Interfaces/entity";
import { game_manager } from "./game-manager";
import { ui_manager } from "./ui-manager";
import { town_component } from "../Town/town-component";
import { town_options } from "../Town/town-options";
import { Vector3 } from "three";
import { card_options } from "../Cards/card-options";
import { player_skills } from "../Players/player-skills";
import { region } from "./region";
import { controls_component } from "./controls-component";

export const game_area_entity = (() => {

    class GameArea extends entity.Entity {
        #renderer;
        #scene;

        constructor(renderer, scene) {
            super();
            this.#renderer = renderer;
            this.#scene = scene;
        }

        InitComponents() {
            this.AddComponent(new game_manager.GameManager());
            this.AddComponent(new ui_manager.UIManager());
            this.AddComponent(new controls_component.Controls());

            this.#loadTowns();
        }

        #loadTowns() {
            this.AddComponent(new town_component.Town(18, "Ard Modron", town_options.TownAbility.increaseSkill(player_skills.Skill.Combat()), new Vector3(0,0,0), region.Region.Mountain()), "Town_18");
            this.AddComponent(new town_component.Town(17, "Stygga", town_options.TownAbility.increaseSkill(player_skills.Skill.Combat()), new Vector3(0,0,0), region.Region.Mountain()), "Town_17");
        }

        get renderer() {
            return this.#renderer;
        }

        get scene() {
            return this.#scene;
        }
    }

    return {
        GameArea : GameArea
    }
}) ();