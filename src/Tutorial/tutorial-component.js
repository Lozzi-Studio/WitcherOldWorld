import { component } from "../Interfaces/component";


export const tutorial_component = (() => {

    class TutorialComponent extends component.Component{
        #tutorialContent;
        #tutorialIndex;

        constructor(){
            super();
            this.#tutorialContent = [[
                () => {
                    let element = document.createElement("div");
                    element.innerHTML = "Das Leben als Hexer";
                    element.classList.add("--fancy-font");
                    element.style.textAlign = "center";
                    element.style.fontSize = "30px"
                    return element;
                },
                () => {
                    let element = document.createElement("div");
                    element.style.marginTop = "2vh";
                    element.style.marginBottom = "2vh";
                    element.innerHTML = "In The Witcher Old World übernimmt jeder von euch die Rolle eines Hexers einer bestimmten Schule. Euer Ziel ist es mit dem Jagen von Monstern und dem Verbessern eurer Fähigkeiten Trophäen zu erwerben. Der Spieler der zuerst 4 Trophäen hat gewinnt das Spiel.";
                    return element;
                },
                () => {
                    let img = document.createElement("img");
                    img.src = "./resources/assets/tutorial/spieler.png";
                    img.style.maxWidth = "100%";
                    img.style.height = "auto";
                    img.style.display = "block";
                    img.style.margin = "auto";
                    return img;
                }
            ],[
                 () => {
                    let element = document.createElement("div");
                    element.innerHTML = "Phasen";
                    element.classList.add("--fancy-font");
                    element.style.textAlign = "center";
                    element.style.fontSize = "30px"
                    return element;
                },
                () => {
                    let element = document.createElement("div");
                    element.style.marginTop = "2vh";
                    element.style.marginBottom = "2vh";
                    element.innerHTML = "Das Spiel ist unterteil in 3 verschiedene Phasen pro Zug, die jeder Spieler nacheinander reiherum absolviert.";
                    return element;
                },
                () => {
                    let img = document.createElement("img");
                    img.src = "./resources/assets/tutorial/phasen.png";
                    img.style.maxWidth = "100%";
                    img.style.height = "auto";
                    img.style.display = "block";
                    img.style.margin = "auto";
                    return img;
                }
            ],
            [
                () => {
                    let element = document.createElement("div");
                    element.innerHTML = "Phase 1";
                    element.classList.add("--fancy-font");
                    element.style.textAlign = "center";
                    element.style.fontSize = "30px"
                    return element;
                },
                () => {
                    let element = document.createElement("div");
                    element.style.marginTop = "2vh";
                    element.style.marginBottom = "3vh";
                    element.innerHTML = "In Phase 1 des Spiels kann der Spieler frei herumreisen, um diverse Stadtaktionen auszuführen. Die Reise erfolgt, indem der Spieler eine Stadt durch Klicken auswählt und dann eine Karte passend zu der Region der Stadt abwirft. Dies kann beliebig oft wiederholt werden. Nach einer Bewegung kann der Spieler in der neuen Stadt die Ortsaktion durch den Interaktionsbutton ausführen.";
                    return element;
                },
                () => {
        
                    let img = document.createElement("img");
                    img.src = "./resources/assets/tutorial/phase1.png";
                    img.style.maxWidth = "100%";
                    img.style.height = "auto";
                    img.style.display = "block";
                    img.style.margin = "auto";
                    return img;
                }
            ],[
                () => {
                    let element = document.createElement("div");
                    element.innerHTML = "Phase 2";
                    element.classList.add("--fancy-font");
                    element.style.textAlign = "center";
                    element.style.fontSize = "30px"
                    return element;
                },
                () => {
                    let element = document.createElement("div");
                    element.style.marginTop = "2vh";
                    element.style.marginBottom = "2vh";
                    element.innerHTML = "In Phase 2 kann der Spieler zwischen verschiedenen Hauptaktionen wählen. Nicht jede Hauptaktion ist immer verfügbar.";
                    return element;
                },
                () => {
                    let img = document.createElement("img");
                    img.src = "./resources/assets/tutorial/phase2.png";
                    img.style.maxWidth = "100%";
                    img.style.height = "auto";
                    img.style.display = "block";
                    img.style.margin = "auto";
                    return img;
                }
            ],[
                () => {
                    let element = document.createElement("div");
                    element.innerHTML = "Kampf";
                    element.classList.add("--fancy-font");
                    element.style.textAlign = "center";
                    element.style.fontSize = "30px"
                    return element;
                },
                () => {
                    let element = document.createElement("div");
                    element.style.marginTop = "2vh";
                    element.style.marginBottom = "2vh";
                    element.innerHTML = "Der Kampf gegen Monster wird mit Hilfe deiner Karten bestritten. Abwechselnd greifen der Spieler und das Monster an. Schaden verteilst du mit den Effekten deiner Karten, während deine Verbleibenden Karten deine Lebenspunkte bilden. Du kannst Karten auch als Kombo ausspielen, in dem du Karten mit den passenden farblichen Symbolen verknüpfst, um die Karten zu verstärken. Wenn ein Spieler ein Monster besiegt, wirkt eine Trophäe als Belohnung.";
                    return element;
                },
                () => {
                    let img = document.createElement("img");
                    img.src = "./resources/assets/tutorial/kampf.png";
                    img.style.maxWidth = "100%";
                    img.style.height = "auto";
                    img.style.display = "block";
                    img.style.margin = "auto";
                    return img;
                }
            ],[
                 () => {
                    let element = document.createElement("div");
                    element.innerHTML = "Karten Symbole";
                    element.classList.add("--fancy-font");
                    element.style.textAlign = "center";
                    element.style.fontSize = "30px"
                    return element;
                },
                () => {
                    let element = document.createElement("div");
                    element.style.marginTop = "2vh";
                    element.style.marginBottom = "2vh";
                    element.innerHTML = "Auf den Karten gibt es verschiedene Symbole, welche die Effekte der Karten bestimmen.";
                    return element;
                },
                () => {
                    let img = document.createElement("img");
                    img.src = "./resources/assets/tutorial/kartensymbol.png";
                    img.style.maxWidth = "100%";
                    img.style.height = "auto";
                    
                    return img;
                }
            ],[
                () => {
                    let element = document.createElement("div");
                    element.innerHTML = "Phase 3";
                    element.classList.add("--fancy-font");
                    element.style.textAlign = "center";
                    element.style.fontSize = "30px"
                    return element;
                },
                () => {
                    let element = document.createElement("div");
                    element.style.marginTop = "2vh";
                    element.style.marginBottom = "2vh";
                    element.innerHTML = "In Phase drei kann der Spieler so viele Karten abwerfen, wie er möchte. Anschließend zieht er regulär seine Hand wieder auf drei Karten nach. Daraufhin kann er im Karten-Shop eine neue Karte erwerben, die mit den eigenen Handkarten bezahlt wird.";
                    return element;
                },
                () => {
                    let img = document.createElement("img");
                    img.src = "./resources/assets/tutorial/phase3.png";
                    img.style.maxWidth = "100%";
                    img.style.height = "auto";
                    img.style.display = "block";
                    img.style.margin = "auto";
                    return img;
                }
            ],[
                () => {
                    let element = document.createElement("div");
                    element.innerHTML = "Fragen";
                    element.classList.add("--fancy-font");
                    element.style.textAlign = "center";
                    element.style.fontSize = "30px"
                    return element;
                },
                () => {
                    let element = document.createElement("div");
                    element.style.marginTop = "2vh";
                    element.style.marginBottom = "2vh";
                    element.innerHTML = "Falls es noch Fragen gibt, nutze gerne den inGame Glossar zum Nachschlagen von Details.";
                    return element;
                },
                () => {
                    let img = document.createElement("img");
                    img.src = "./resources/assets/tutorial/glossar.png";
                    img.style.maxWidth = "100%";
                    img.style.height = "auto";
                    img.style.display = "block";
                    img.style.margin = "auto";
                    return img;
                },
                () => {
                    let element = document.createElement("div");
                    element.style.marginTop = "2vh";
                    element.style.marginBottom = "2vh";
                    element.innerHTML = "Ansonsten wünschen wir viel Spaß beim Spielen.";
                    element.style.textAlign = "center";
                    return element;
                }
            ]];
            this.#tutorialIndex = 0;
        }

        InitComponent() {
            this._RegisterHandler('game.loadTutorial', (msg) => {this.#initTutorial(msg)});
            this._RegisterHandler('game.closeTutorial', (msg) => {this.#closeTutorial(msg)});
        }

        #initTutorial() {
            let tutorial = document.createElement("div");
            tutorial.id = "loading_tutorial";
            tutorial.classList.add(
                "container",  "container--row", "container--neutral", "container--justify", "borders--all"
            )
            tutorial.style.padding = "15px";

            let buttonLeftDiv = document.createElement("div");
            let buttonRightDiv = document.createElement("div");
            let buttonLeft = document.createElement("img");
            let buttonRight = document.createElement("img");
            let content = document.createElement("div");
            content.id = "loading_tutorial_content";
            content.classList.add("cotainer--col", "container--justify");
            content.style.overflowY = "auto";
            content.style.overflowX = "hidden";
            buttonLeft.id = "loading_tutorial_left";
            buttonLeft.src = "./resources/assets/tutorial/arrow2.png"
            buttonLeftDiv.addEventListener("click", () => {
                if (this.#tutorialIndex > 0) {
                    this.#tutorialIndex = this.#tutorialIndex - 1
                    if (this.#tutorialIndex == 0) {
                        document.getElementById("loading_tutorial_left").style.visibility  = "hidden";
                    }
                    document.getElementById("loading_tutorial_right").style.visibility = "visible";
                    document.getElementById("loading_tutorial_content").innerHTML = '';
                    this.#tutorialContent[this.#tutorialIndex].forEach((element) => {
                        document.getElementById("loading_tutorial_content").appendChild(element());
                    });
                }
            });
            buttonLeftDiv.classList.add("container--row", "container--justify")
            buttonLeftDiv.style.display = "flex";
            buttonLeftDiv.style.alignItems = "center";
            buttonLeftDiv.style.maxWidth = "3vw";


            buttonRight.id = "loading_tutorial_right";
            buttonRight.src = "./resources/assets/tutorial/arrow.png"
            buttonRightDiv.addEventListener("click", () => {
                if (this.#tutorialIndex < (this.#tutorialContent.length - 1) ) {
                    this.#tutorialIndex = this.#tutorialIndex + 1
                    if (this.#tutorialIndex == (this.#tutorialContent.length - 1)) {
                        document.getElementById("loading_tutorial_right").style.visibility  = "hidden";
                    }
                    document.getElementById("loading_tutorial_left").style.visibility = "visible";
                    document.getElementById("loading_tutorial_content").innerHTML = '';
                    this.#tutorialContent[this.#tutorialIndex].forEach((element) => {
                        document.getElementById("loading_tutorial_content").appendChild(element());
                    });
                }
            });
            buttonRightDiv.classList.add("container--row", "container--justify")
            buttonRightDiv.style.display = "flex";
            buttonRightDiv.style.alignItems = "center";
            buttonRightDiv.style.maxWidth = "3vw";

            buttonLeftDiv.appendChild(buttonLeft);
            buttonRightDiv.appendChild(buttonRight);
            tutorial.appendChild(buttonLeftDiv);
            tutorial.appendChild(content);
            tutorial.appendChild(buttonRightDiv);

            
            document.getElementById("loading_screen_info").appendChild(tutorial)
            document.getElementById("loading_tutorial_left").style.visibility  = "hidden";
            document.getElementById("loading_screen_info").insertBefore(document.getElementById("loading_tutorial"), document.getElementById("loading_tip"));
            this.#tutorialContent[0].forEach((element) => {
                document.getElementById("loading_tutorial_content").appendChild(element());
            });

        }

        #closeTutorial() {

        }
    }

    return {
        TutorialComponent : TutorialComponent
    }
}) ();