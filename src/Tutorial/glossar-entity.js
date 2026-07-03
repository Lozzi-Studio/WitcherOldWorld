import { entity } from "../Interfaces/entity";
import { glossar_component } from "./glossar-component";


export const glossar_entity = (() => {

    class GlossarEntity extends entity.Entity{

        constructor() {
            super();
        }

        InitComponents() {
            this.AddComponent(new glossar_component.GlossarComponent());
        }
    }

    return {
        GlossarEntity : GlossarEntity
    }
}) ();