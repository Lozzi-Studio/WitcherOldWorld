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
            glossar.style.padding = "15px";
            glossar.style.height = "65vh";
            glossar.style.width = "65vw";
            glossar.style.zIndex = "100000000000000000000";
            
            let header = document.createElement("div");
            header.classList.add("container",  "container--row");

            let title = document.createElement("h1");
            title.innerHTML = "Glossar";
            title.classList.add("--fancyfont");
            title.style.marginLeft = "10vw";
            title.style.marginRight = "25vw";
            title.style.textAlign = "center";
            
            let search = document.createElement("div");
            let input = document.createElement("input")
            input.id = "searchGlossar";
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
                document.getElementById("searchGlossar").value = "";
                document.getElementById("searchGlossar").dispatchEvent(new CustomEvent("input"));
            })
            search.appendChild(cancel);

            header.appendChild(search);
            header.appendChild(title);
            header.style.textAlign = "center";

            let close = document.createElement("div");
            close.innerHTML = "close";
            close.classList.add("material-symbols-outlined", "filled", "glyph-button");
            close.addEventListener("click", (event) => {document.getElementById("glossar").style.display = "none"})
            header.appendChild(close);
            glossar.appendChild(header);

            glossar.style.display = "none";

            document.getElementById("game-ui").appendChild(glossar)
            this.#GetEntries();

            document.getElementById("glossar-window").addEventListener("click", (event) => {document.getElementById("glossar").style.display = "flex"})

        }

        #GetEntries(filterBy = "") {
            let dataset = this.#data;
            try {
                document.getElementById("glossar").removeChild(document.getElementById("entries_glossar"));
            } catch (e){}
            if (filterBy.length > 0 ) {
                dataset = dataset.filter((data) => data[0].toLowerCase().includes(filterBy.toLowerCase()));
            }
            let entries = document.createElement("ul");
            entries.id = "entries_glossar";
            entries.classList.add("cotainer--col", "container--justify");
            entries.style.position = "relative";
            entries.style.overflowY = "auto";
            entries.style.overflowX = "hidden";
        
            for (let entry of dataset.sort((a, b) => a[0].localeCompare(b[0]))) {
                let glossaerEntry = document.createElement("li");
                if (entry[0].includes("Icon")) {
                    let img = document.createElement("img");
                    img.src = "./resources/assets/tutorial/" + entry[0] + ".png";
                    img.style.maxWidth = "100%";
                    img.style.height = "auto";
                    img.style.margin = "auto";
                    glossaerEntry.appendChild(img);
                    let space = document.createElement("span");
                    space.innerHTML = " : ";
                    glossaerEntry.appendChild(space);
                } else {
                    glossaerEntry.innerHTML = "<b>" + entry[0] + ":</b> ";
                }
                glossaerEntry.style.fontSize = "23px"
                glossaerEntry.style.margin = "5vh";
                let cites = [];
                for (let word of entry[1].split(/[\s]+/)) {
                    let s = "\\b" + word.split(/[,.?!:()]+/)[0] + "\\b";
                    const regex =  new RegExp(s, 'i');
                    let foundEntry = dataset.filter((data) => regex.test(data[0]));
                    if (foundEntry.length > 0) {
                        let span = document.createElement("span");
                        span.addEventListener("click", (event)=> {
                            document.getElementById("searchGlossar").value = event.target.innerHTML.split(/[,.?!:()]+/)[0];
                            document.getElementById("searchGlossar").dispatchEvent(new CustomEvent("input"));
                        })
                        span.innerHTML = "<u><b>"+ word +"</b></u> ";
                        span.style.fontSize = "23px"
                        glossaerEntry.appendChild(span)
                        continue;
                    } 
                    let span = document.createElement("span");
                    span.innerHTML = word +" ";
                    span.style.fontSize = "23px"
                    glossaerEntry.appendChild(span)

                }
                entries.appendChild(glossaerEntry);
            }
            document.getElementById("glossar").appendChild(entries);
        }
    }

    return {
        GlossarComponent : GlossarComponent
    }
}) ();