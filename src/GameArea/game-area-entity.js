import { entity } from "../Interfaces/entity";
import { game_manager } from "./game-manager";
import { ui_manager } from "./UI/ui-manager";
import { town_entity } from "../Town/town-entity";
import { town_options } from "../Town/town-options";
import { Vector3 } from "three";
import { card_options } from "../Cards/card-options";
import { player_skills } from "../Players/player-skills";
import { region } from "./region";
import { controls_component } from "./controls-component";
import { broadcasts } from "../Interfaces/broadcasts";

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
            this._parent.AddEntity(new town_entity.TownEntity(0, "Behelt Nar", town_options.TownAbility.increaseSkillForMoney(), new Vector3(23.6,0,-2.5), region.Region.Joker(), new Vector3(2.7,2.7,2.7)), "Town_0");
            this._parent.AddEntity(new town_entity.TownEntity(1, "Kaer Seren", town_options.TownAbility.increaseSkillForMoney(), new Vector3(-12,0,-19.3), region.Region.River(), new Vector3(2.7,2.7,2.7)), "Town_1");
            this._parent.AddEntity(new town_entity.TownEntity(2, "Hengfors", town_options.TownAbility.getGeruechte(), new Vector3(5.1,0,-21.6), region.Region.Mountain(), new Vector3(2.7,2.7,2.7)), "Town_2");
            this._parent.AddEntity(new town_entity.TownEntity(3, "Kaer Morhen", town_options.TownAbility.increaseSkillForMoney(), new Vector3(21.8,0,-21.7), region.Region.Mountain(), new Vector3(2.7,2.7,2.7)), "Town_3");
            this._parent.AddEntity(new town_entity.TownEntity(4, "Ban Ard", town_options.TownAbility.increaseSkill(player_skills.Skill.Alchemy()), new Vector3(20,0,-15.4), region.Region.River(), new Vector3(2.7,2.7,2.7)), "Town_4");
            this._parent.AddEntity(new town_entity.TownEntity(5, "Cidaris", town_options.TownAbility.increaseSkill(player_skills.Skill.Defense()), new Vector3(-12.5,0,-7), region.Region.River(), new Vector3(2.7,2.7,2.7)), "Town_5");
            this._parent.AddEntity(new town_entity.TownEntity(6, "Novigrad", town_options.TownAbility.increaseSkillForMoney(), new Vector3(-9.1,0,-12.1), region.Region.Forest(), new Vector3(2.7,2.7,2.7)), "Town_6");
            this._parent.AddEntity(new town_entity.TownEntity(7, "Wyzima", town_options.TownAbility.removeShopCards(), new Vector3(-0.8,0,-10.6), region.Region.Forest(), new Vector3(2.7,2.7,2.7)), "Town_7");
            this._parent.AddEntity(new town_entity.TownEntity(8, "Vengerberg", town_options.TownAbility.swapoutCard(), new Vector3(15.7,0,-7.5), region.Region.Forest(), new Vector3(2.7,2.7,2.7)), "Town_8");
            this._parent.AddEntity(new town_entity.TownEntity(9, "Cintra", town_options.TownAbility.getPotion(), new Vector3(-11.4,0,-0.4), region.Region.Mountain(), new Vector3(2.7,2.7,2.7)), "Town_9");
            this._parent.AddEntity(new town_entity.TownEntity(10, "Haern Caduch", town_options.TownAbility.increaseSkillForMoney(), new Vector3(-1.3,0,3.4), region.Region.Forest(), new Vector3(2.7,2.7,2.7)), "Town_10");
            this._parent.AddEntity(new town_entity.TownEntity(11, "Beauclair", town_options.TownAbility.getPotion(), new Vector3(14.4,0,4.6), region.Region.Mountain(), new Vector3(2.7,2.7,2.7)), "Town_11");
            this._parent.AddEntity(new town_entity.TownEntity(12, "Glenmore", town_options.TownAbility.increaseSkillForMoney(), new Vector3(-13.3,0,9.8), region.Region.River(), new Vector3(2.7,2.7,2.7)), "Town_12");
            this._parent.AddEntity(new town_entity.TownEntity(13, "Doldeth", town_options.TownAbility.getGeruechte(), new Vector3(-15,0,16), region.Region.Mountain(), new Vector3(2.7,2.7,2.7)), "Town_13");
            this._parent.AddEntity(new town_entity.TownEntity(14, "Loc Ichaer", town_options.TownAbility.playWuerfelpoker(), new Vector3(3.2,0,13.8), region.Region.River(), new Vector3(2.7,2.7,2.7)), "Town_14");
            this._parent.AddEntity(new town_entity.TownEntity(15, "Gorthur Guaed", town_options.TownAbility.increaseSkillForMoney(), new Vector3(21.7,0,15.1), region.Region.River(), new Vector3(2.7,2.7,2.7)), "Town_15");
            this._parent.AddEntity(new town_entity.TownEntity(16, "Dhuwod", town_options.TownAbility.getPotion(), new Vector3(-9.9,0,22), region.Region.Forest(), new Vector3(2.7,2.7,2.7)), "Town_16");
            this._parent.AddEntity(new town_entity.TownEntity(17, "Stygga", town_options.TownAbility.increaseSkill(player_skills.Skill.Combat()), new Vector3(9.3,0,21.5), region.Region.Mountain(), new Vector3(2.7,2.7,2.7)), "Town_17");
            this._parent.AddEntity(new town_entity.TownEntity(18, "Ard Modron", town_options.TownAbility.increaseSkillForMoney(), new Vector3(18.6,0,22.4), region.Region.Mountain(), new Vector3(2.7,2.7,2.7)), "Town_18");

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