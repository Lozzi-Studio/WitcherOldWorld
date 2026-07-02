import { component } from "../Interfaces/component";


export const glossar_component = (() => {


    class GlossarComponent extends component.Component{

        constructor(){
            super();
        }

        InitComponent() {

        }

        #InitGlossar() {
            let glossar = document.createElement("div");
            glossar.id = "glossar";
            glossar.classList.add(
                "container",  "container--row", "container--neutral", "container--justify", "borders--all"
            )
            glossar.style.padding = "15px";
        }

        #CloseGlossar(){

        }
    }

    return {
        GlossarComponent : GlossarComponent
    }
}) ();