import { component } from "../Interfaces/component";


export const glossar_component = (() => {


    class GlossarComponent extends component.Component{
        #data;

        constructor(){
            super();
            this.#data = null;
        }

        InitComponent() {
            this.#data = this._parent.GetFromCache("glossar").ruleset;
            let glossar = document.createElement("div");
            glossar.id = "glossar";
            glossar.classList.add(
                "container",  "container--col", "container--set-colors", "container--justify", "borders--all", "position-center"
            )
            glossar.style.height = "65vh";
            glossar.style.width = "65vw";
            glossar.style.zIndex = this.FindEntity("GameArea").FindComponent("UIManager").uiLayers.get("layer-player-prompted-windows");
            
            let header = document.createElement("div");
            header.classList.add("container", "container--row", "container--justify-between");
            header.id = "glossar-header";

            let title = document.createElement("div");
            title.innerHTML = "Glossar";
            title.classList.add("--fancy-font", "font-size-large");
            title.id = "glossar-title";
            
            let search = document.createElement("div");
            search.id = "glossar-search";
            search.classList.add("container", "container--no-padding", "container--row", "container--no-gap");
            let input = document.createElement("input")
            input.id = "search-glossar-input";
            input.type = "text";
            input.name = "searchGlossar";
            input.placeholder = "Suchen ..."
            input.classList.add("name-input");
            input.style.minWidth = "10vw";

            input.addEventListener("input", (event) => {
                this.#GetEntries(event.target.value)
            })

            search.appendChild(input);
            let cancel = document.createElement("span");
            cancel.classList.add("material-symbols-outlined", "filled", "glyph-button");
            cancel.innerHTML = "close";
            cancel.style.marginLeft = "0.2vw";
            cancel.addEventListener("click", (event)=> {
                input.value = "";
                input.dispatchEvent(new CustomEvent("input"));
            })
            search.appendChild(cancel);
            
            let close = document.createElement("div");
            close.innerHTML = "close";
            close.classList.add("material-symbols-outlined", "filled", "glyph-button");
            close.addEventListener("click", (event) => {
                document.getElementById("glossar").style.display = "none"
                this.FindEntity("Camera").controls.enabled = true;
            })
            let closeDummy = close.cloneNode(true);
            closeDummy.style.visibility = "hidden";
            header.appendChild(closeDummy);
            header.appendChild(title);
            header.appendChild(close);
            glossar.appendChild(header);
            glossar.appendChild(search);
            
            glossar.style.display = "none";

            document.getElementById("game-ui").appendChild(glossar)
            this.#GetEntries();

            document.getElementById("glossar-button").addEventListener("click", (event) => {
                glossar.style.display = "flex";
                this.FindEntity("Camera").controls.enabled = false;
            })

        }

        #GetEntries(filterBy = "") {
            const bodyFontSize = "16px";
            let dataset = this.#data;
            try {
                document.getElementById("glossar").removeChild(document.getElementById("entries-glossar"));
            } catch (e){}
            if (filterBy.length > 0 ) {
                dataset = dataset.filter((data) => data[0].toLowerCase().includes(filterBy.toLowerCase()));
            }
            let entries = document.createElement("ul");
            entries.id = "entries-glossar";
            entries.classList.add("cotainer--col", "container--justify");
            entries.style.position = "relative";
            entries.style.overflowY = "auto";
            entries.style.overflowX = "hidden";
        
            for (let entry of dataset.sort((a, b) => a[0].localeCompare(b[0]))) {
                let glossarEntry = document.createElement("li");
                if (entry[0].includes("Icon")) {
                    let img = document.createElement("img");
                    img.src = "./resources/assets/tutorial/" + entry[0] + ".png";
                    img.style.maxWidth = "100%";
                    img.style.height = "auto";
                    img.style.margin = "auto";
                    glossarEntry.appendChild(img);
                    let space = document.createElement("span");
                    space.innerHTML = " : ";
                    glossarEntry.appendChild(space);
                } else {
                    glossarEntry.innerHTML = "<b>" + entry[0] + ":</b> ";
                }
                glossarEntry.style.fontSize = bodyFontSize;
                glossarEntry.style.marginBottom = "8px";
                let cites = [];
                for (let word of entry[1].split(/[\s]+/)) {
                    let s = "\\b" + word.split(/[,.?!:()]+/)[0] + "\\b";
                    const regex =  new RegExp(s, 'i');
                    let foundEntry = dataset.filter((data) => regex.test(data[0]));
                    if (foundEntry.length > 0) {
                        let span = document.createElement("span");
                        span.addEventListener("click", (event)=> {
                            document.getElementById("search-glossar-input").value = event.target.innerHTML.split(/[,.?!:()]+/)[0];
                            document.getElementById("search-glossar-input").dispatchEvent(new CustomEvent("input"));
                        })
                        span.innerHTML = "<u><b>"+ word +"</b></u> ";
                        span.style.fontSize = bodyFontSize;
                        span.classList.add("glossar-link");
                        glossarEntry.appendChild(span)
                        continue;
                    } 
                    let span = document.createElement("span");
                    span.innerHTML = word +" ";
                    span.style.fontSize = bodyFontSize;
                    glossarEntry.appendChild(span)

                }
                entries.appendChild(glossarEntry);
            }
            document.getElementById("glossar").appendChild(entries);
        }
    }

    return {
        GlossarComponent : GlossarComponent
    }
}) ();