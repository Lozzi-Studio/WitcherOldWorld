import { controls_component } from "../GameArea/controls-component";
import { entity } from "../Interfaces/entity";


export const player_menu_overlay = (() => {

    class PlayerMenuOverlay extends entity.Entity{

        constructor() {
            super();
        }

        InitComponents() {
            this.AddComponent(new controls_component.Controls());
        }
    }

    return {
        PlayerMenuOverlay : PlayerMenuOverlay
    }
}) ();