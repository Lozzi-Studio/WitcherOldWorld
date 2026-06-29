import { component } from "../../Interfaces/component";
import { broadcasts } from "../../Interfaces/broadcasts";
import { ui_manager } from "./ui-manager";
import { card } from "../../Cards/card";

export const card_select_ui = (() => {

    class CardSelectUI extends component.Component {
        #selection;

        constructor(){
            super();

            let openCardsButton = document.getElementById("debug-open-card-selection-button");
            this.HandleOpenCardsClick = () => {
                if (openCardsButton.classList.contains("button--inactive") == false) {
                    let handCards = this.FindComponent("GameManager").currentPlayer.FindComponent("Carddeck").hand;
                    this.GetCardSelectionFromPlayerPrompt(handCards, 2);
                }
            };
        }

        InitComponent(){
            this._RegisterHandler('card.updateCardSelectionUI', (msg) => {this.#UpdateCardSelection(msg)});
            document.getElementById("debug-open-card-selection-button").addEventListener("click", this.HandleOpenCardsClick);
        }

        async GetCardSelectionFromPlayerPrompt(cards, selectableCards) {
            const selection = await this.FindComponent("CardSelectUI").PromptCardSelection(cards, selectableCards);
            console.log("Selected: ", selection);
        }

        /**
         * 
         * @param {Array} cards 
         * @param {int} selectableCards 
         */
        PromptCardSelection(cards, selectableCards) {
            return new Promise((resolve) => {
                let handWindow = document.getElementById("hand-window");
                const handCards = document.querySelectorAll('#hand-window > div:not(:last-child)');
                handCards.forEach(el => {
                    el.style.marginRight = '-120px';
                });

                const cardSelectWindow = document.createElement("div");
                document.getElementById("game-ui").appendChild(cardSelectWindow);
                cardSelectWindow.id = "card-select-window";
                cardSelectWindow.classList.add(
                    "container", "container--col", "container--neutral", "position-center", "borders--all", "borders--neutral"
                );
                
                let header = document.createElement("div");
                header.classList.add(
                    "font-size-large", "--fancy-font"
                )
                header.innerHTML = `Wähle ${selectableCards} Karten aus`
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
                    cardDIV.classList.add("container", "container--col", "card");
                    this.FindComponent("UIManager").UpdateCardContent(card, cardDIV);
                    cardDIV.addEventListener("click", () => this.FindComponent("UIManager").SelectCard(index, card, "CardSelect", selectableCards));
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
                cancelButton.id = "cancel-button";
                cancelButton.innerHTML = "Abbrechen";
                cancelButton.addEventListener("click", onCancel);
                buttonsContainer.appendChild(cancelButton);

                let confirmButton = document.createElement("div");
                confirmButton.classList.add(
                    "textbox", "textbox--fill", "button", "button--inactive"
                );
                confirmButton.id = "confirm-button";
                confirmButton.innerHTML = "Fortfahren";
                confirmButton.addEventListener("click", onConfirm);
                buttonsContainer.appendChild(confirmButton);
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
            }
            else {
                let cardSelectWindow = document.getElementById("card-select-window");
                for (let [i, child] of Array.from(cardSelectWindow.children).entries()) {
                    document.getElementById(`window-card-${i}`).classList.remove("card--selected");
                }
            }
            this.#selection = msg.selection;
            this.#UpdateConfirmButton();
        }

        /**
         * sets button state based on card selection
         */
        #UpdateConfirmButton() {
            if (this.#selection.length > 0) {
                this.FindComponent("UIManager").UpdateButtonState("confirm-button", true);
            } else {
                this.FindComponent("UIManager").UpdateButtonState("confirm-button", false);
            }
        }
    }
    return {
        CardSelectUI : CardSelectUI
    }
})();