import { entity } from "../Interfaces/entity";
import { battle_manager } from "./battle-manager";
import { battle_ui } from "./battle-ui";


export const battle_entity = (() => {

    class BattleEntity extends entity.Entity{


        constructor() {
            super();
        }

        InitComponents() {
            this.AddComponent(new battle_ui.BattleUI());
            this.AddComponent(new battle_manager.BattleManager());
        }
    }

    return {
        BattleEntity : BattleEntity
    }
})();