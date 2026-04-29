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
            this.AddComponent(new town_component.Town(0, "Behelt Nar", town_options.TownAbility.increaseSkillForMoney(), new Vector3(0,0,0), region.Region.Joker()), "Town_0");
            this.AddComponent(new town_component.Town(1, "Kaer Seren", town_options.TownAbility.increaseSkillForMoney(), new Vector3(0,0,0), region.Region.River()), "Town_1");
            this.AddComponent(new town_component.Town(2, "Hengfors", town_options.TownAbility.getGeruechte(), new Vector3(0,0,0), region.Region.Mountain()), "Town_2");
            this.AddComponent(new town_component.Town(3, "Kaer Morhen", town_options.TownAbility.increaseSkillForMoney(), new Vector3(0,0,0), region.Region.Mountain()), "Town_3");
            this.AddComponent(new town_component.Town(4, "Ban Ard", town_options.TownAbility.increaseSkill(player_skills.Skill.Alchemy()), new Vector3(0,0,0), region.Region.River()), "Town_4");
            this.AddComponent(new town_component.Town(5, "Cidaris", town_options.TownAbility.increaseSkill(player_skills.Skill.Defense()), new Vector3(0,0,0), region.Region.River()), "Town_1");
            this.AddComponent(new town_component.Town(6, "Novigrad", town_options.TownAbility.increaseSkillForMoney(), new Vector3(0,0,0), region.Region.Forest()), "Town_6");
            this.AddComponent(new town_component.Town(7, "Wyzima", town_options.TownAbility.removeShopCards(), new Vector3(0,0,0), region.Region.Forest()), "Town_7");
            this.AddComponent(new town_component.Town(8, "Vengerberg", town_options.TownAbility.swapoutCard(), new Vector3(0,0,0), region.Region.Forest()), "Town_8");
            this.AddComponent(new town_component.Town(9, "Cintra", town_options.TownAbility.getPotion, new Vector3(0,0,0), region.Region.Mountain()), "Town_9");
            this.AddComponent(new town_component.Town(10, "Haern Caduch", town_options.TownAbility.increaseSkillForMoney(), new Vector3(0,0,0), region.Region.Forest()), "Town_10");
            this.AddComponent(new town_component.Town(11, "Beauclair", town_options.TownAbility.getPotion(), new Vector3(0,0,0), region.Region.Mountain()), "Town_11");
            this.AddComponent(new town_component.Town(12, "Glenmore", town_options.TownAbility.increaseSkillForMoney(), new Vector3(0,0,0), region.Region.River()), "Town_1");
            this.AddComponent(new town_component.Town(13, "Doldeth", town_options.TownAbility.getGeruechte(), new Vector3(0,0,0), region.Region.Mountain()), "Town_13");
            this.AddComponent(new town_component.Town(14, "Loc Ichaer", town_options.TownAbility.playWuerfelpoker(), new Vector3(0,0,0), region.Region.River()), "Town_14");
            this.AddComponent(new town_component.Town(15, "Gorthur Guaed", town_options.TownAbility.increaseSkillForMoney(), new Vector3(0,0,0), region.Region.River()), "Town_15");
            this.AddComponent(new town_component.Town(16, "Dhuwod", town_options.TownAbility.getPotion(), new Vector3(0,0,0), region.Region.Forest()), "Town_16");
            this.AddComponent(new town_component.Town(17, "Stygga", town_options.TownAbility.increaseSkill(player_skills.Skill.Combat()), new Vector3(0,0,0), region.Region.Mountain()), "Town_17");
            this.AddComponent(new town_component.Town(18, "Ard Modron", town_options.TownAbility.increaseSkillForMoney(), new Vector3(0,0,0), region.Region.Mountain()), "Town_18");
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