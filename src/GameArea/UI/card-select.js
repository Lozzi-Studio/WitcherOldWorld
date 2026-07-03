import { component } from "../../Interfaces/component";
import { broadcasts } from "../../Interfaces/broadcasts";
import { ui_manager } from "./ui-manager";
import { card } from "../../Cards/card";
import { int } from "three/tsl";

export const card_select_ui = (() => {

    class CardSelectUI extends component.Component {
        #selection;
        #selectionMin;
        #selectionMax;

        constructor(){
            super();

            let openCardsButton = document.getElementById("debug-open-card-selection-button");
            this.HandleOpenCardsClick = () => {
                if (openCardsButton.classList.contains("button--inactive") == false) {
                    let handCards = this.FindComponent("GameManager").currentPlayer.FindComponent("Carddeck").deck;
                    this.GetCardSelectionFromPlayerPrompt(handCards, 2, "Abwerfen", true, "Debug").then((result) => {console.log(result)});
                }
            };
        }

        InitComponent(){
            document.getElementById("debug-open-card-selection-button").addEventListener("click", this.HandleOpenCardsClick);
        }

        async GetCardSelectionFromPlayerPrompt(cards, selectableCards, reason, cancelable = true, topic) {
            this.#selectionMin = selectableCards instanceof Array ? selectableCards[0] : selectableCards;
            this.#selectionMax =  selectableCards instanceof Array ? selectableCards[1] : selectableCards;
            this.#selection = [];
            return await this.PromptCardSelection(cards, selectableCards, reason, cancelable, topic);
        }

        /**
         * 
         * @param {Array} cards 
         * @param {int} selectableCards 
         * @param {string} reason
         * @param {bool} cancelable
         */
        PromptCardSelection(cards, selectableCards, reason, cancelable, topic) {
            if (document.getElementById("card-select-window")) {
                return null;
            }
            return new Promise((resolve) => {
                let handWindow = document.getElementById("hand-window");
                const handCards = document.querySelectorAll('#hand-window > div:not(:last-child)');
                handCards.forEach(el => {
                    el.style.marginRight = '-140px';
                });

                const cardSelectWindow = document.createElement("div");
                document.getElementById("game-ui").appendChild(cardSelectWindow);
                cardSelectWindow.id = "card-select-window";
                cardSelectWindow.classList.add(
                    "container", "container--col", "container--set-colors", "position-center", "borders--all", "borders--neutral"
                );
                
                let header = document.createElement("div");
                header.classList.add(
                    "font-size-large", "--fancy-font"
                )

                if (selectableCards instanceof Array) {
                    header.innerHTML = `${topic}: Wähle ${selectableCards[0]} - ${selectableCards[1]} Karten zum ${reason} aus`
                } 
                else if (selectableCards != 0) {
                    header.innerHTML = `${topic}: Wähle ${selectableCards} Karten zum ${reason} aus`
                }
                else {
                    header.innerHTML = topic;
                }

                header.style.paddingTop = "4px";
                cardSelectWindow.appendChild(header);

                const cardSelect = document.createElement("div");
                cardSelectWindow.appendChild(cardSelect);
                cardSelect.id = "card-select";
                cardSelect.classList.add(
                    "container", "container--row", "container--wrap"
                );

                for (const [index, card] of cards.entries()) {
                    const cardDIV = document.createElement("div");
                    cardDIV.id = `window-card-${index}`;
                    if (selectableCards != 0) {
                        cardDIV.classList.add("container", "container--col", "card", "card--selectable");
                        cardDIV.addEventListener("click", () => { this.#OnCardSelect(index)});
                    } else {
                        cardDIV.classList.add("container", "container--col", "card");
                    }
                    this.FindComponent("UIManager").UpdateCardContent(card, cardDIV);
                    cardSelect.appendChild(cardDIV);
                }
                
                const onCancel = () => {
                    document.getElementById("card-select-window").remove();
                    handCards.forEach(el => {
                        el.style.marginRight = '-100px';
                    });
                    confirmButton.removeEventListener("click", onConfirm);

                    resolve(null);
                }
                
                const onConfirm = () => {
                    document.getElementById("card-select-window").remove();
                    handCards.forEach(el => {
                        el.style.marginRight = '-100px';
                    });
                    confirmButton.removeEventListener("click", onConfirm);
                    
                    let selectedCards = [];
                    this.#selection.forEach(index => {
                        let card = cards[index];
                        selectedCards.push(card);
                    });
                    this.#selection = [];
                    resolve(selectedCards);
                }

                let buttonsContainer = document.createElement("div");
                buttonsContainer.classList.add(
                    "container", "container--row"
                );
                cardSelectWindow.appendChild(buttonsContainer);

                let cancelButton = document.createElement("div");
                cancelButton.classList.add(
                    "textbox", "textbox--fill", "button"
                );
                if (cancelable) {
                    cancelButton.id = "cancel-button";
                    if (selectableCards != 0) {
                            cancelButton.innerHTML = "Abbrechen";
                    } else {
                        cancelButton.innerHTML = "Schlie&szlig;en";
                    }
                    cancelButton.addEventListener("click", onCancel);
                    buttonsContainer.appendChild(cancelButton);
                }

                let confirmButton = document.createElement("div");
                confirmButton.classList.add(
                    "textbox", "textbox--fill", "button", "button--inactive"
                );
                confirmButton.id = "confirm-button";
                confirmButton.innerHTML = "Fortfahren";
                confirmButton.addEventListener("click", onConfirm);
                buttonsContainer.appendChild(confirmButton);
                if (selectableCards != 0) {
                    confirmButton.style.display = "block";
                } else {
                    confirmButton.style.display = "none";
                }
            });
        }

        /**
         * 
         * @param {object} msg 
         */
        #UpdateCardSelection(msg) {
            if (msg.card_slot !== undefined) {
                let cardImage = document.getElementById(`window-card-${msg.card_slot}`);
                if (msg.mode == "Select") {
                    cardImage.classList.add("card--selected");
                }
                else {
                    cardImage.classList.remove("card--selected");
                }
            } else {
                let cardSelectWindow = document.getElementById("card-select-window");
                for (let [i, child] of Array.from(cardSelectWindow.children).entries()) {
                    document.getElementById(`window-card-${i}`).classList.remove("card--selected");
                }
            }
            this.#UpdateConfirmButton();
        }

        /**
         * sets button state based on card selection
         */
        #UpdateConfirmButton() {
            if (this.#selection.length >= this.#selectionMin) {
                this.FindComponent("UIManager").UpdateButtonState("confirm-button", true);
            } else {
                this.FindComponent("UIManager").UpdateButtonState("confirm-button", false);
            }
        }

        /**
         * Add card to selection
         * @param {card} card
         * @param {int} slot
         */
        #OnCardSelect(slot){
            if (this.#selection.includes(slot)){
                this.#selection.splice(this.#selection.indexOf(slot),1);
                this.#UpdateCardSelection({"card_slot": slot, "mode": "Deselect"});
            } else {
                if (this.#selection.length < this.#selectionMax) {
                    this.#selection.push(slot);
                    this.#UpdateCardSelection({"card_slot":slot, "mode":"Select"});
                }
            }
        }
    }
    return {
        CardSelectUI : CardSelectUI
    }
})();