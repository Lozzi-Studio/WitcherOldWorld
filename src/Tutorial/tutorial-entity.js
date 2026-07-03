import { entity } from "../Interfaces/entity";
import { glossar_component } from "./glossar-component";
import { tutorial_component } from "./tutorial-component";


export const tutorial_entity = (() => {

    class TutorialEntity extends entity.Entity{

        constructor() {
            super();
        }

        InitComponents() {
            this.AddComponent(new tutorial_component.TutorialComponent());
        }
    }

    return {
        TutorialEntity : TutorialEntity
    }
}) ();