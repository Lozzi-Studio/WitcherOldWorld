import { entity } from "../Interfaces/entity";
import { battle_manager } from "./battle-manager";
import { battle_ui } from "./battle-ui";


export const battle_entity = (() => {

    class BattleEntity extends entity.Entity{
        #player;
        #monster;

        constructor(player, monster) {
            super();
            this.#player = player;
            this.#monster = monster;
        }

        InitComponents() {
            this.AddComponent(new battle_manager.BattleManager(this.#player, this.#monster));
            this.AddComponent(new battle_ui.BattleUI());
        }
    }

    return {
        BattleEntity : BattleEntity
    }
})();