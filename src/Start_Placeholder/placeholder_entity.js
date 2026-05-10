import { entity } from "../Interfaces/entity";
import { backgrounds } from "../Scenes/backgrounds";

export const placeholder_entity = (() => {

    class PlaceholderEntity extends entity.Entity{

        /**
         * A wrapper for placeholder screen
         */
        constructor() {
            super();
        }

        InitComponents() {
            this.AddComponent(new backgrounds.BackgroundPlaceholder());
        }
    }

    return {
        PlaceholderEntity : PlaceholderEntity
    }
}) ();