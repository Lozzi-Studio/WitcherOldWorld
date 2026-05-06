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
import { region_picker } from "./UI/region-picker";
import { town_manager } from "./town_manager";

export const game_area_entity = (() => {

    class GameArea extends entity.Entity {

        constructor() {
            super();
            

        }

        InitComponents() {
            this.AddComponent(new game_manager.GameManager());
            this.AddComponent(new ui_manager.UIManager());
            this.AddComponent(new region_picker.RegionPicker());
            this.AddComponent(new controls_component.Controls());
            this.AddComponent(new town_manager.TownMangaer(this._parent.Filter(e => e._name.includes("Town"))));
        }
    }

    return {
        GameArea : GameArea
    }
}) ();