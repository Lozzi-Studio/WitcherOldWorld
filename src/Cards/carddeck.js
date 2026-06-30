import { component } from "../Interfaces/component";
import { broadcasts } from "../Interfaces/broadcasts";
import { card } from "../Cards/card";
import { cards } from "../Cards/card-templates";
import { region } from "../GameArea/region";
import { card_options } from "./card-options";
import { player_skills } from "../Players/player-skills";

export const carddeck_component = (() => {

    class Carddeck extends component.Component {
        #cardDeck;
        #cardDiscard;
        #cardHand;
        #cardPotion;
        #cardPotionLimit
        #handLimit;
        #noUiUpdate;

        /**
         * A component to track player cards
         * @param {int} handLimit
         */
        constructor(handLimit = 7) {
            super();
            this.#cardDeck = [];
            this.#cardDiscard = [];
            this.#cardHand = [];
            this.#cardPotion = [];
            this.#cardPotionLimit = 4;
            this.#handLimit = handLimit;
            this.#noUiUpdate = false;
        }

        /**
         * Used to intialize and add any default components/events
         */
        InitComponent() {
            this._RegisterHandler('card.loadDeck', (msg) => this.#LoadStartdeck(msg));
            this._RegisterHandler('card.addCard', (msg) => this.#AddCard(msg));
            this._RegisterHandler('card.drawCard', (msg) => this.#DrawCard(msg));
            this._RegisterHandler('card.discardCard', (msg) => this.#DiscardCard(msg));
            this._RegisterHandler('card.shuffle', (msg) => this.#Shuffle(msg));
            this._RegisterHandler('card.discardRandomPotion', (msg) => this.#DiscardRanomPotion(msg));
            this._RegisterHandler('card.randomDiscard', (msg) => this.#DiscardRandomCard(msg))
            this._RegisterHandler('game.applyDamage', (msg) => this.#ApplyDamage(msg))
        }

        /**
         * Returns the handcard in the given slot
         * @param {int} cardslot 
         * @returns {card.Card}
         */
        GetHandCard(cardslot) {
            return this.#cardHand[cardslot];
        }

        /**
         * Fill the deck with a default configuration of cards
         * @param {object} msg 
         */
        #LoadStartdeck(msg){
            this.#cardDeck = [];
            this.#cardDiscard = [];
            this.#cardHand = [];
            //TODO Create Defaults
            switch (msg.deck) {
                case "Player":
                    switch (msg.school) {
                        case "Greifenschule":
                            this.#cardDeck.push(new card.Card("Greif Stoß", card_options.Color.Green(), undefined, card_options.CardEffect.createCardEffect(0,2,0,false,false), region.Region.Mountain(), 0));
                            this.#cardDeck.push(new card.Card("Greif Stoß", card_options.Color.Green(), undefined, card_options.CardEffect.createCardEffect(0,1,1,false,false), region.Region.River(), 0));
                            this.#cardDeck.push(new card.Card("Greif Spaltschlag", card_options.Color.Red(), undefined, card_options.CardEffect.createCardEffect(1,0,0,false,false), region.Region.Forest(), 0));
                            this.#cardDeck.push(new card.Card("Greif Spaltschlag", card_options.Color.Red(), undefined, card_options.CardEffect.createCardEffect(1,0,0,false,false), region.Region.Mountain(), 0));
                            this.#cardDeck.push(new card.Card("Greif Schneller Hieb", card_options.Color.Red(), undefined, card_options.CardEffect.createCardEffect(1,0,0,false,false), region.Region.Joker(), 0));
                            this.#cardDeck.push(new card.Card("Greif Schneller Hieb", card_options.Color.Red(), undefined, card_options.CardEffect.createCardEffect(1,0,0,false,false), region.Region.River(), 0));
                            this.#cardDeck.push(new card.Card("Greif Aard", card_options.Color.Purple(), new Map([[card_options.Color.Blue(), card_options.CardEffect.createCardEffect(1,0,0,false,false)]]) , card_options.CardEffect.createCardEffect(1,0,0,false,false), region.Region.River(), 0));
                            this.#cardDeck.push(new card.Card("Greif Aard", card_options.Color.Purple(), new Map([[card_options.Color.Red(), card_options.CardEffect.createCardEffect(0,0,1,false,false)]]) , card_options.CardEffect.createCardEffect(1,0,0,false,false), region.Region.Forest(), 0));
                            this.#cardDeck.push(new card.Card("Greif Yrden", card_options.Color.Yellow(), new Map([[card_options.Color.Red(), card_options.CardEffect.createCardEffect(1,0,0,false,false)]]) , card_options.CardEffect.createCardEffect(0,0,2,false,false), region.Region.Forest(), 0));
                            this.#cardDeck.push(new card.Card("Greif Yrden", card_options.Color.Purple(), new Map([[card_options.Color.Red(), card_options.CardEffect.createCardEffect(1,0,0,false,false)]]) , card_options.CardEffect.createCardEffect(0,0,2,false,false), region.Region.Mountain(), 0));
                            break;
                        case "Baerenschule":
                            this.#cardDeck.push(new card.Card("Baer Stoß", card_options.Color.Green(), new Map([[card_options.Color.Red(), card_options.CardEffect.createCardEffect(0,0,0,true,false)]]), card_options.CardEffect.createCardEffect(0,1,0,false,false), region.Region.Mountain(), 0));
                            this.#cardDeck.push(new card.Card("Baer Stoß", card_options.Color.Green(), new Map([[card_options.Color.Purple(), card_options.CardEffect.createCardEffect(0,0,0,false,false)]]), card_options.CardEffect.createCardEffect(0,1,0,false,false), region.Region.Forest(), 0));
                            this.#cardDeck.push(new card.Card("Baer Spaltschlag", card_options.Color.Red(),  new Map([[card_options.Color.Purple(), card_options.CardEffect.createCardEffect(0,0,0,false,false)]]), card_options.CardEffect.createCardEffect(2,0,0,false,false), region.Region.Mountain(), 0));
                            this.#cardDeck.push(new card.Card("Baer Spaltschlag", card_options.Color.Red(), undefined, card_options.CardEffect.createCardEffect(1,0,0,false,false), region.Region.River(), 0));
                            this.#cardDeck.push(new card.Card("Baer Yrden", card_options.Color.Yellow(), new Map([[card_options.Color.Red(), card_options.CardEffect.createCardEffect(1,0,0,false,false)]]), card_options.CardEffect.createCardEffect(0,0,1,false,false), region.Region.River(), 0));
                            this.#cardDeck.push(new card.Card("Baer Yrden", card_options.Color.Yellow(), new Map([[card_options.Color.Purple(), card_options.CardEffect.createCardEffect(1,0,0,false,false)]]), card_options.CardEffect.createCardEffect(0,0,1,false,false), region.Region.Mountain(), 0));
                            this.#cardDeck.push(new card.Card("Baer Schneller Hieb", card_options.Color.Blue(), undefined, card_options.CardEffect.createCardEffect(2,0,0,false,false), region.Region.Forest(), 0));
                            this.#cardDeck.push(new card.Card("Baer Schneller Hieb", card_options.Color.Blue(), undefined, card_options.CardEffect.createCardEffect(1,0,0,false,false), region.Region.Joker(), 0));
                            this.#cardDeck.push(new card.Card("Baer Aard", card_options.Color.Purple(), undefined, card_options.CardEffect.createCardEffect(1,0,0,false,false), region.Region.Forest(), 0));
                            this.#cardDeck.push(new card.Card("Baer Aard", card_options.Color.Purple(), undefined, card_options.CardEffect.createCardEffect(1,0,0,false,false), region.Region.Mountain(), 0));
                            break;
                        case "Katzenschule":
                            this.#cardDeck.push(new card.Card("Katze Schneller Hieb", card_options.Color.Blue(), undefined, card_options.CardEffect.createCardEffect(1,0,0,false,false), region.Region.River(), 0));
                            this.#cardDeck.push(new card.Card("Katze Schneller Hieb", card_options.Color.Blue(), undefined, card_options.CardEffect.createCardEffect(1,0,0,false,false), region.Region.Forest(), 0));
                            this.#cardDeck.push(new card.Card("Katze Axii", card_options.Color.Yellow(), new Map([[card_options.Color.Red(), card_options.CardEffect.createCardEffect(0,0,0,false,false)]]), card_options.CardEffect.createCardEffect(0,0,0,false,true), region.Region.Forest(), 0));
                            this.#cardDeck.push(new card.Card("Katze Spaltschlag", card_options.Color.Red(), undefined, card_options.CardEffect.createCardEffect(2,0,-1,false,false), region.Region.Mountain(), 0));
                            this.#cardDeck.push(new card.Card("Katze Spaltschlag", card_options.Color.Red(), undefined, card_options.CardEffect.createCardEffect(1,0,0,false,false), region.Region.River(), 0));
                            this.#cardDeck.push(new card.Card("Katze Aard", card_options.Color.Purple(), new Map([[card_options.Color.Red(), card_options.CardEffect.createCardEffect(0,0,1,false,false)]]), card_options.CardEffect.createCardEffect(1,0,0,false,false), region.Region.River(), 0));
                            this.#cardDeck.push(new card.Card("Katze Aard", card_options.Color.Purple(), new Map([[card_options.Color.Blue(), card_options.CardEffect.createCardEffect(1,0,0,false,false)]]), card_options.CardEffect.createCardEffect(1,0,0,false,false), region.Region.Mountain(), 0));
                            this.#cardDeck.push(new card.Card("Katze Yrden", card_options.Color.Yellow(), new Map([[card_options.Color.Blue(), card_options.CardEffect.createCardEffect(1,0,0,false,false)]]), card_options.CardEffect.createCardEffect(0,0,1,false,false), region.Region.Mountain(), 0));
                            this.#cardDeck.push(new card.Card("Katze Stoß", card_options.Color.Green(), undefined, card_options.CardEffect.createCardEffect(0,1,0,false,false), region.Region.Joker(), 0));
                            this.#cardDeck.push(new card.Card("Katze Stoß", card_options.Color.Green(), undefined, card_options.CardEffect.createCardEffect(0,1,1,false,false), region.Region.Forest(), 0));
                            break;
                        case "Wolfsschule":
                            this.#cardDeck.push(new card.Card("Wolf Spaltschlag", card_options.Color.Red(), undefined, card_options.CardEffect.createCardEffect(1,0,0,false,false), region.Region.Mountain(), 0));
                            this.#cardDeck.push(new card.Card("Wolf Spaltschlag", card_options.Color.Red(), undefined, card_options.CardEffect.createCardEffect(1,0,0,false,false), region.Region.Forest(), 0));
                            this.#cardDeck.push(new card.Card("Wolf Yrden", card_options.Color.Yellow(), undefined, card_options.CardEffect.createCardEffect(0,0,3,false,false), region.Region.Forest(), 0));
                            this.#cardDeck.push(new card.Card("Wolf Yrden", card_options.Color.Yellow(), new Map([[card_options.Color.Red(), card_options.CardEffect.createCardEffect(1,0,0,false,false)]]), card_options.CardEffect.createCardEffect(0,0,3,false,false), region.Region.River(), 0));
                            this.#cardDeck.push(new card.Card("Wolf Aard", card_options.Color.Purple(), new Map([[card_options.Color.Green(), card_options.CardEffect.createCardEffect(0,0,1,false,false)]]), card_options.CardEffect.createCardEffect(1,0,0,false,false), region.Region.Forest(), 0));
                            this.#cardDeck.push(new card.Card("Wolf Aard", card_options.Color.Purple(), new Map([[card_options.Color.Red(), card_options.CardEffect.createCardEffect(0,1,0,false,false)]]), card_options.CardEffect.createCardEffect(1,0,0,false,false), region.Region.River(), 0));
                            this.#cardDeck.push(new card.Card("Wolf Stoß", card_options.Color.Green(), undefined, card_options.CardEffect.createCardEffect(0,1,1,false,false), region.Region.River(), 0));
                            this.#cardDeck.push(new card.Card("Wolf Stoß", card_options.Color.Green(), undefined, card_options.CardEffect.createCardEffect(0,1,1,false,false), region.Region.Mountain(), 0));
                            this.#cardDeck.push(new card.Card("Wolf Schneller Hieb", card_options.Color.Blue(), new Map([[card_options.Color.Red(), card_options.CardEffect.createCardEffect(0,0,0,false,false)]]), card_options.CardEffect.createCardEffect(1,0,0,false,false), region.Region.Mountain(), 0));
                            this.#cardDeck.push(new card.Card("Wolf Schneller Hieb", card_options.Color.Blue(), undefined, card_options.CardEffect.createCardEffect(1,0,0,false,false), region.Region.Joker(), 0));
                            break;
                        case "Vipernschule":
                            this.#cardDeck.push(new card.Card("Viper Quen", card_options.Color.Yellow(), new Map([[card_options.Color.Purple(), card_options.CardEffect.createCardEffect(1,0,0,false,false)]]), card_options.CardEffect.createCardEffect(0,0,2,false,false), region.Region.River(), 0));
                            this.#cardDeck.push(new card.Card("Viper Yrden", card_options.Color.Yellow(), new Map([[card_options.Color.Blue(), card_options.CardEffect.createCardEffect(2,0,0,false,false)]]), card_options.CardEffect.createCardEffect(0,0,0,false,false), region.Region.Forest(), 0));
                            this.#cardDeck.push(new card.Card("Viper Spaltschlag", card_options.Color.Red(), undefined, card_options.CardEffect.createCardEffect(1,0,0,false,false), region.Region.Joker(), 0));
                            this.#cardDeck.push(new card.Card("Viper Spaltschlag", card_options.Color.Red(), undefined, card_options.CardEffect.createCardEffect(2,0,2,false,false), region.Region.River(), 0));
                            this.#cardDeck.push(new card.Card("Viper Stoß", card_options.Color.Green(), new Map([[card_options.Color.Purple(), card_options.CardEffect.createCardEffect(0,0,1,false,false)]]), card_options.CardEffect.createCardEffect(0,1,0,false,false), region.Region.Mountain(), 0));
                            this.#cardDeck.push(new card.Card("Viper Stoß", card_options.Color.Green(), new Map([[card_options.Color.Blue(), card_options.CardEffect.createCardEffect(0,0,1,false,false)]]), card_options.CardEffect.createCardEffect(0,1,0,false,false), region.Region.Forest(), 0));
                            this.#cardDeck.push(new card.Card("Viper Schneller Hieb", card_options.Color.Blue(), undefined, card_options.CardEffect.createCardEffect(1,0,0,false,false), region.Region.Mountain(), 0));
                            this.#cardDeck.push(new card.Card("Viper Schneller Hieb", card_options.Color.Blue(), undefined, card_options.CardEffect.createCardEffect(1,0,0,false,false), region.Region.Forest(), 0));
                            this.#cardDeck.push(new card.Card("Viper Aard", card_options.Color.Purple(), undefined, card_options.CardEffect.createCardEffect(1,0,0,false,false), region.Region.Mountain(), 0));
                            this.#cardDeck.push(new card.Card("Viper Aard", card_options.Color.Purple(), undefined, card_options.CardEffect.createCardEffect(1,0,0,false,false), region.Region.River(), 0));
                            break;
                        }
                    break;
                case "Shop":
                    this.#noUiUpdate = true;
                    this.#cardDeck.push(cards.CardTemplates.getDeckung(new Map([[card_options.Color.Blue(), card_options.CardEffect.createCardEffect(0,0,0,true,false)], [card_options.Color.Red(), card_options.CardEffect.createCardEffect(0,0,0,true,false)]]),region.Region.Forest()));
                    this.#cardDeck.push(cards.CardTemplates.getDeckung(new Map([[card_options.Color.Purple(), card_options.CardEffect.createCardEffect(0,0,0,true,false)], [card_options.Color.Blue(), card_options.CardEffect.createCardEffect(0,0,0,true,false)]]),region.Region.Forest()));
                    this.#cardDeck.push(cards.CardTemplates.getDeckung(new Map([[card_options.Color.Yellow(), card_options.CardEffect.createCardEffect(0,0,0,true,false)], [card_options.Color.Red(), card_options.CardEffect.createCardEffect(0,0,0,true,false)]]),region.Region.Mountain()));
                    this.#cardDeck.push(cards.CardTemplates.getDeckung(new Map([[card_options.Color.Yellow(), card_options.CardEffect.createCardEffect(0,0,0,true,false)], [card_options.Color.Purple(), card_options.CardEffect.createCardEffect(0,0,0,true,false)]]),region.Region.Mountain()));
                    this.#cardDeck.push(cards.CardTemplates.getRiposte(new Map([[card_options.Color.Blue(), card_options.CardEffect.createCardEffect(1,0,0,false,false)]]),region.Region.River()))
                    this.#cardDeck.push(cards.CardTemplates.getRiposte(new Map([[card_options.Color.Red(), card_options.CardEffect.createCardEffect(1,0,0,false,false)]]),region.Region.River()))
                    this.#cardDeck.push(cards.CardTemplates.getRiposte(new Map([[card_options.Color.Yellow(), card_options.CardEffect.createCardEffect(1,0,0,false,false)]]),region.Region.Forest()))
                    this.#cardDeck.push(cards.CardTemplates.getRiposte(new Map([[card_options.Color.Purple(), card_options.CardEffect.createCardEffect(1,0,0,false,false)]]),region.Region.Forest()))
                    this.#cardDeck.push(cards.CardTemplates.getBlitzschnelleReflexe(new Map([[card_options.Color.Purple(), card_options.CardEffect.createCardEffect(2,0,0,false,false)]])));
                    this.#cardDeck.push(cards.CardTemplates.getBlitzschnelleReflexe(new Map([[card_options.Color.Red(), card_options.CardEffect.createCardEffect(2,0,0,false,false)]])));
                    this.#cardDeck.push(cards.CardTemplates.getBlitzschnelleReflexe(new Map([[card_options.Color.Blue(), card_options.CardEffect.createCardEffect(2,0,0,false,false)]])));
                    this.#cardDeck.push(cards.CardTemplates.getBlitzschnelleReflexe(new Map([[card_options.Color.Yellow(), card_options.CardEffect.createCardEffect(2,0,0,false,false)]])));
                    this.#cardDeck.push(cards.CardTemplates.getAbwehr(new Map([[card_options.Color.Yellow(), card_options.CardEffect.createCardEffect(1,0,0,false,false)]]), region.Region.River()));
                    this.#cardDeck.push(cards.CardTemplates.getAbwehr(new Map([[card_options.Color.Purple(), card_options.CardEffect.createCardEffect(1,0,0,false,false)]]), region.Region.River()));
                    this.#cardDeck.push(cards.CardTemplates.getAbwehr(new Map([[card_options.Color.Purple(), card_options.CardEffect.createCardEffect(0,0,0,true,false)], [card_options.Color.Blue(), card_options.CardEffect.createCardEffect(0,0,0,true,false)]]), region.Region.Forest()));
                    this.#cardDeck.push(cards.CardTemplates.getAbwehr(new Map([[card_options.Color.Blue(), card_options.CardEffect.createCardEffect(0,0,0,true,false)], [card_options.Color.Red(), card_options.CardEffect.createCardEffect(0,0,0,true,false)]]), region.Region.Forest()));
                    this.#cardDeck.push(cards.CardTemplates.getAbwehr(new Map([[card_options.Color.Yellow(), card_options.CardEffect.createCardEffect(0,0,0,true,false)], [card_options.Color.Purple(), card_options.CardEffect.createCardEffect(0,0,0,true,false)]]), region.Region.Forest()));
                    this.#cardDeck.push(cards.CardTemplates.getAbwehr(new Map([[card_options.Color.Yellow(), card_options.CardEffect.createCardEffect(0,0,0,true,false)], [card_options.Color.Red(), card_options.CardEffect.createCardEffect(0,0,0,true,false)]]), region.Region.Forest()));
                    this.#cardDeck.push(cards.CardTemplates.getVerstaerktesAxii(new Map([[card_options.Color.Green(), card_options.CardEffect.createCardEffect(0,0,0,false,false)], [card_options.Color.Blue(), card_options.CardEffect.createCardEffect(0,0,0,false,false)]])));
                    this.#cardDeck.push(cards.CardTemplates.getVerstaerktesAxii(new Map([[card_options.Color.Blue(), card_options.CardEffect.createCardEffect(0,0,0,false,false)], [card_options.Color.Red(), card_options.CardEffect.createCardEffect(0,0,0,false,false)]])));
                    this.#cardDeck.push(cards.CardTemplates.getVerstaerktesAxii(new Map([[card_options.Color.Green(), card_options.CardEffect.createCardEffect(0,0,0,false,false)], [card_options.Color.Red(), card_options.CardEffect.createCardEffect(0,0,0,false,false)]])));
                    this.#cardDeck.push(cards.CardTemplates.getVerstaerktesAxii(new Map([[card_options.Color.Purple(), card_options.CardEffect.createCardEffect(0,0,0,false,false)], [card_options.Color.Red(), card_options.CardEffect.createCardEffect(0,0,0,false,false)]])));
                    this.#cardDeck.push(cards.CardTemplates.getVerstaerktesYrden(new Map([[card_options.Color.Blue(), card_options.CardEffect.createCardEffect(2,0,0,false,false)]]), region.Region.River()));
                    this.#cardDeck.push(cards.CardTemplates.getVerstaerktesYrden(new Map([[card_options.Color.Green(), card_options.CardEffect.createCardEffect(2,0,0,false,false)]]), region.Region.River()));
                    this.#cardDeck.push(cards.CardTemplates.getVerstaerktesYrden(new Map([[card_options.Color.Purple(), card_options.CardEffect.createCardEffect(2,0,0,false,false)]]), region.Region.Forest()));
                    this.#cardDeck.push(cards.CardTemplates.getVerstaerktesYrden(new Map([[card_options.Color.Red(), card_options.CardEffect.createCardEffect(2,0,0,false,false)]]), region.Region.Forest()));
                    this.#cardDeck.push(cards.CardTemplates.getVerstaerktesQuen(new Map([[card_options.Color.Red(), card_options.CardEffect.createCardEffect(2,0,0,false,false)]]), region.Region.River()));
                    this.#cardDeck.push(cards.CardTemplates.getVerstaerktesQuen(new Map([[card_options.Color.Purple(), card_options.CardEffect.createCardEffect(2,0,0,false,false)]]), region.Region.River()));
                    this.#cardDeck.push(cards.CardTemplates.getVerstaerktesQuen(new Map([[card_options.Color.Green(), card_options.CardEffect.createCardEffect(2,0,0,false,false)]]), region.Region.Mountain()));
                    this.#cardDeck.push(cards.CardTemplates.getVerstaerktesQuen(new Map([[card_options.Color.Blue(), card_options.CardEffect.createCardEffect(2,0,0,false,false)]]), region.Region.Mountain()));
                    this.#cardDeck.push(cards.CardTemplates.getMagiefalle(new Map([[card_options.Color.Green(), card_options.CardEffect.createCardEffect(1,0,0,false,false)], [card_options.Color.Red(), card_options.CardEffect.createCardEffect(1,0,0,false,false)]])));
                    this.#cardDeck.push(cards.CardTemplates.getMagiefalle(new Map([[card_options.Color.Purple(), card_options.CardEffect.createCardEffect(1,0,0,false,false)], [card_options.Color.Blue(), card_options.CardEffect.createCardEffect(1,0,0,false,false)]])));
                    this.#cardDeck.push(cards.CardTemplates.getExplosiverSchild(new Map([[card_options.Color.Purple(), card_options.CardEffect.createCardEffect(2,0,0,false,false)]]), region.Region.Forest()));
                    this.#cardDeck.push(cards.CardTemplates.getExplosiverSchild(new Map([[card_options.Color.Green(), card_options.CardEffect.createCardEffect(2,0,0,false,false)]]), region.Region.Forest()));
                    this.#cardDeck.push(cards.CardTemplates.getExplosiverSchild(new Map([[card_options.Color.Blue(), card_options.CardEffect.createCardEffect(2,0,0,false,false)]]), region.Region.River()));
                    this.#cardDeck.push(cards.CardTemplates.getExplosiverSchild(new Map([[card_options.Color.Red(), card_options.CardEffect.createCardEffect(2,0,0,false,false)]]), region.Region.River()));
                    this.#cardDeck.push(cards.CardTemplates.getVerstaerktesAard(new Map([[card_options.Color.Blue(), card_options.CardEffect.createCardEffect(0,1,0,false,false)]])));
                    this.#cardDeck.push(cards.CardTemplates.getVerstaerktesAard(new Map([[card_options.Color.Green(), card_options.CardEffect.createCardEffect(0,1,0,false,false)]])));
                    this.#cardDeck.push(cards.CardTemplates.getVerstaerktesAard(new Map([[card_options.Color.Red(), card_options.CardEffect.createCardEffect(0,1,0,false,false)]])));
                    this.#cardDeck.push(cards.CardTemplates.getVerstaerktesAard(new Map([[card_options.Color.Yellow(), card_options.CardEffect.createCardEffect(0,1,0,false,false)]])));
                    this.#cardDeck.push(cards.CardTemplates.getVerstaerktesIgni());
                    this.#cardDeck.push(cards.CardTemplates.getVerstaerktesIgni());
                    this.#cardDeck.push(cards.CardTemplates.getVerstaerktesIgni());
                    this.#cardDeck.push(cards.CardTemplates.getVerstaerktesIgni());
                    this.#cardDeck.push(cards.CardTemplates.getSchockwelle(new Map([[card_options.Color.Red(), card_options.CardEffect.createCardEffect(0,0,2,false,false)]])));
                    this.#cardDeck.push(cards.CardTemplates.getSchockwelle(new Map([[card_options.Color.Green(), card_options.CardEffect.createCardEffect(0,0,2,false,false)]])));
                    this.#cardDeck.push(cards.CardTemplates.getSchockwelle(new Map([[card_options.Color.Yellow(), card_options.CardEffect.createCardEffect(0,0,2,false,false)]])));
                    this.#cardDeck.push(cards.CardTemplates.getSchockwelle(new Map([[card_options.Color.Blue(), card_options.CardEffect.createCardEffect(0,0,2,false,false)]])));
                    this.#cardDeck.push(cards.CardTemplates.getRuestungSchmelzen(new Map([[card_options.Color.Green(), card_options.CardEffect.createCardEffect(0,1,0,false,false)]])));
                    this.#cardDeck.push(cards.CardTemplates.getRuestungSchmelzen(new Map([[card_options.Color.Yellow(), card_options.CardEffect.createCardEffect(0,1,0,false,false)]])));
                    this.#cardDeck.push(cards.CardTemplates.getFeuerstrahl());
                    this.#cardDeck.push(cards.CardTemplates.getFeuerstrahl());
                    this.#cardDeck.push(cards.CardTemplates.getFeuerstrahl());
                    this.#cardDeck.push(cards.CardTemplates.getFeuerstrahl());
                    this.#cardDeck.push(cards.CardTemplates.getPraeziserSchnitt(new Map([[card_options.Color.Yellow(), card_options.CardEffect.createCardEffect(1,0,0,false,false)]]), region.Region.River()));
                    this.#cardDeck.push(cards.CardTemplates.getPraeziserSchnitt(new Map([[card_options.Color.Yellow(), card_options.CardEffect.createCardEffect(1,0,0,false,false)]]), region.Region.River()));
                    this.#cardDeck.push(cards.CardTemplates.getPraeziserSchnitt(new Map([[card_options.Color.Green(), card_options.CardEffect.createCardEffect(1,0,0,false,false)]]), region.Region.River()));
                    this.#cardDeck.push(cards.CardTemplates.getPraeziserSchnitt(new Map([[card_options.Color.Green(), card_options.CardEffect.createCardEffect(1,0,0,false,false)]]), region.Region.River()));
                    this.#cardDeck.push(cards.CardTemplates.getPraeziserSchnitt(new Map([[card_options.Color.Red(), card_options.CardEffect.createCardEffect(1,0,0,false,false)]]), region.Region.Forest()));
                    this.#cardDeck.push(cards.CardTemplates.getPraeziserSchnitt(new Map([[card_options.Color.Red(), card_options.CardEffect.createCardEffect(1,0,0,false,false)]]), region.Region.Forest()));
                    this.#cardDeck.push(cards.CardTemplates.getPraeziserSchnitt(new Map([[card_options.Color.Purple(), card_options.CardEffect.createCardEffect(1,0,0,false,false)]]), region.Region.Forest()));
                    this.#cardDeck.push(cards.CardTemplates.getPraeziserSchnitt(new Map([[card_options.Color.Purple(), card_options.CardEffect.createCardEffect(1,0,0,false,false)]]), region.Region.Forest()));
                    this.#cardDeck.push(cards.CardTemplates.getDrehungForest(new Map([[card_options.Color.Yellow(), card_options.CardEffect.createCardEffect(2,0,0,false,false)]])));
                    this.#cardDeck.push(cards.CardTemplates.getDrehungForest(new Map([[card_options.Color.Purple(), card_options.CardEffect.createCardEffect(2,0,0,false,false)]])));
                    this.#cardDeck.push(cards.CardTemplates.getDrehungForest(new Map([[card_options.Color.Green(), card_options.CardEffect.createCardEffect(2,0,0,false,false)]])));
                    this.#cardDeck.push(cards.CardTemplates.getDrehungMountain(new Map([[card_options.Color.Purple(), card_options.CardEffect.createCardEffect(0,0,0,false,false)], [card_options.Color.Red(), card_options.CardEffect.createCardEffect(0,0,0,false,false)]])));
                    this.#cardDeck.push(cards.CardTemplates.getDrehungMountain(new Map([[card_options.Color.Green(), card_options.CardEffect.createCardEffect(0,0,0,false,false)], [card_options.Color.Purple(), card_options.CardEffect.createCardEffect(0,0,0,false,false)]])));
                    this.#cardDeck.push(cards.CardTemplates.getDrehungMountain(new Map([[card_options.Color.Green(), card_options.CardEffect.createCardEffect(0,0,0,false,false)], [card_options.Color.Yellow(), card_options.CardEffect.createCardEffect(0,0,0,false,false)]])));
                    this.#cardDeck.push(cards.CardTemplates.getVerchnichtenderSchlag(new Map([[card_options.Color.Green(), card_options.CardEffect.createCardEffect(1,0,0,false,false)], [card_options.Color.Yellow(), card_options.CardEffect.createCardEffect(1,0,0,false,false)]])));
                    this.#cardDeck.push(cards.CardTemplates.getVerchnichtenderSchlag(new Map([[card_options.Color.Yellow(), card_options.CardEffect.createCardEffect(1,0,0,false,false)], [card_options.Color.Purple(), card_options.CardEffect.createCardEffect(1,0,0,false,false)]])));
                    this.#cardDeck.push(cards.CardTemplates.getVerchnichtenderSchlag(new Map([[card_options.Color.Green(), card_options.CardEffect.createCardEffect(1,0,0,false,false)], [card_options.Color.Red(), card_options.CardEffect.createCardEffect(1,0,0,false,false)]])));
                    this.#cardDeck.push(cards.CardTemplates.getVerchnichtenderSchlag(new Map([[card_options.Color.Purple(), card_options.CardEffect.createCardEffect(1,0,0,false,false)], [card_options.Color.Red(), card_options.CardEffect.createCardEffect(1,0,0,false,false)]])));
                    this.#cardDeck.push(cards.CardTemplates.getSchmetterschlag(region.Region.Forest()));
                    this.#cardDeck.push(cards.CardTemplates.getSchmetterschlag(region.Region.Forest()));
                    this.#cardDeck.push(cards.CardTemplates.getSchmetterschlag(region.Region.Forest()));
                    this.#cardDeck.push(cards.CardTemplates.getSchmetterschlag(region.Region.Forest()));
                    this.#cardDeck.push(cards.CardTemplates.getSchmetterschlag(region.Region.River()));
                    this.#cardDeck.push(cards.CardTemplates.getSchmetterschlag(region.Region.River()));
                    this.#cardDeck.push(cards.CardTemplates.getSchmetterschlag(region.Region.River()));
                    this.#cardDeck.push(cards.CardTemplates.getSchmetterschlag(region.Region.River()));
                    this.#cardDeck.push(cards.CardTemplates.getPraeziserSchlag(region.Region.Mountain()));
                    this.#cardDeck.push(cards.CardTemplates.getPraeziserSchlag(region.Region.Mountain()));
                    this.#cardDeck.push(cards.CardTemplates.getPraeziserSchlag(region.Region.Mountain()));
                    this.#cardDeck.push(cards.CardTemplates.getPraeziserSchlag(region.Region.Forest()));
                    this.#cardDeck.push(cards.CardTemplates.getPraeziserSchlag(region.Region.Forest()));
                    this.#cardDeck.push(cards.CardTemplates.getPraeziserSchlag(region.Region.Forest()));
                    this.#cardDeck.push(cards.CardTemplates.getWuchtschlag());
                    this.#cardDeck.push(cards.CardTemplates.getWuchtschlag());
                    this.#cardDeck.push(cards.CardTemplates.getWuchtschlag());
                    this.#cardDeck.push(cards.CardTemplates.getWuchtschlag());
                    break;
                case "Monster":
                    this.#noUiUpdate = true;
                    this.#cardDeck.push({"OptionA": card_options.MonsterEffect.createMonsterEffect(0, "", [1,2,3], true), "OptionB": card_options.MonsterEffect.createMonsterEffect(0, "combat", [], false)});
                    this.#cardDeck.push({"OptionA": card_options.MonsterEffect.createMonsterEffect(0,"", [1,2,3], true), "OptionB": card_options.MonsterEffect.createMonsterEffect(3, "", [], false)});
                    this.#cardDeck.push({"OptionA": card_options.MonsterEffect.createMonsterEffect(5, "", [], false), "OptionB": card_options.MonsterEffect.createMonsterEffect(2, "", [], false)});
                    this.#cardDeck.push({"OptionA": card_options.MonsterEffect.createMonsterEffect(0, "", [1,2,3], true), "OptionB": card_options.MonsterEffect.createMonsterEffect(2, "", [], false)});
                    this.#cardDeck.push({"OptionA": card_options.MonsterEffect.createMonsterEffect(4, "", [], false), "OptionB": card_options.MonsterEffect.createMonsterEffect(0, "combat", [0,1,2], true)});
                    this.#cardDeck.push({"OptionA": card_options.MonsterEffect.createMonsterEffect(0, "", [1,2,3], true), "OptionB": card_options.MonsterEffect.createMonsterEffect(0, "", [3,4,5], false)});
                    this.#cardDeck.push({"OptionA": card_options.MonsterEffect.createMonsterEffect(3, "", [], false), "OptionB": card_options.MonsterEffect.createMonsterEffect(5, "", [], false)});
                    this.#cardDeck.push({"OptionA": card_options.MonsterEffect.createMonsterEffect(2, "", [], false), "OptionB": card_options.MonsterEffect.createMonsterEffect(3, "", [], false)});
                    this.#cardDeck.push({"OptionA": card_options.MonsterEffect.createMonsterEffect(4, "", [], false), "OptionB": card_options.MonsterEffect.createMonsterEffect(0, "special", [], false)});
                    this.#cardDeck.push({"OptionA": card_options.MonsterEffect.createMonsterEffect(0, "defense", [0,1,2], true), "OptionB": card_options.MonsterEffect.createMonsterEffect(0, "", [3,4,5], false)});
                    this.#cardDeck.push({"OptionA": card_options.MonsterEffect.createMonsterEffect(3, "", [], false), "OptionB": card_options.MonsterEffect.createMonsterEffect(0, "defense", [], false)});
                    this.#cardDeck.push({"OptionA": card_options.MonsterEffect.createMonsterEffect(0, "", [1,2,3], true), "OptionB": card_options.MonsterEffect.createMonsterEffect(4, "", [], false)});
                    this.#cardDeck.push({"OptionA": card_options.MonsterEffect.createMonsterEffect(0, "", [1,2,3], true), "OptionB": card_options.MonsterEffect.createMonsterEffect(3, "", [], false)});
                    this.#cardDeck.push({"OptionA": card_options.MonsterEffect.createMonsterEffect(5, "", [], false), "OptionB": card_options.MonsterEffect.createMonsterEffect(0, "alchemy", [], false)});
                    this.#cardDeck.push({"OptionA": card_options.MonsterEffect.createMonsterEffect(4, "", [], false), "OptionB": card_options.MonsterEffect.createMonsterEffect(2, "", [], false)});
                    this.#cardDeck.push({"OptionA": card_options.MonsterEffect.createMonsterEffect(2, "", [], false), "OptionB": card_options.MonsterEffect.createMonsterEffect(0, "alchemy", [0,1,2], true)});
                    this.#cardDeck.push({"OptionA": card_options.MonsterEffect.createMonsterEffect(3, "", [], false), "OptionB": card_options.MonsterEffect.createMonsterEffect(5, "", [], false)});
                    this.#cardDeck.push({"OptionA": card_options.MonsterEffect.createMonsterEffect(3, "", [], false), "OptionB": card_options.MonsterEffect.createMonsterEffect(4, "", [], false)});
                    this.#cardDeck.push({"OptionA": card_options.MonsterEffect.createMonsterEffect(2, "", [], false), "OptionB": card_options.MonsterEffect.createMonsterEffect(4, "", [], false)});
                    this.#cardDeck.push({"OptionA": card_options.MonsterEffect.createMonsterEffect(0,"", [1,2,3], true), "OptionB": card_options.MonsterEffect.createMonsterEffect(4, "", [], false)});
            }
            this.#Shuffle(broadcasts.BroadcastTemplateCards.ShuffleDeck(false))
            this.#Shuffle(broadcasts.BroadcastTemplateCards.ShuffleDeck(false))
        }

        /**
         * Rotate a card from deck to hand, from discard to Hand  
         * @param {object} msg 
         */
        #DrawCard(msg){
            for (let i = 0; i < msg.amount; i++) {
                switch (msg.mode) {
                    case "BattleDeck":
                        if (this.#cardDeck.length > 0) {
                            this.#cardHand.push(this.#cardDeck.pop());
                            if (!this.#noUiUpdate) {
                                this.FindEntity("GameArea").Broadcast(broadcasts.BroadcastTemplatePlayer.UpdateHandCardsUI("draw", msg.card));
                            }
                        }
                        break;
                    case "Deck":
                        if (this.#cardDeck.length == 0) {
                            this.#Shuffle({includeDiscard: true});
                            if (this.#cardDeck.length == 0) { 
                                return;
                            }
                        }
                        let drawnCard = this.#cardDeck.pop();
                        this.#cardHand.push(drawnCard);
                        if (!this.#noUiUpdate) {
                            this.FindEntity("GameArea").Broadcast(broadcasts.BroadcastTemplatePlayer.UpdateHandCardsUI("draw", drawnCard));
                        }
                        break;
                    case "Discard":
                        if (this.#cardDiscard.length != 0) {
                            console.log(this.#cardDiscard)
                            let discardedCard = this.#cardDiscard.pop();
                            console.log(discardedCard)
                            this.#cardHand.push(discardedCard)
                            if (!this.#noUiUpdate) {
                                this.FindEntity("GameArea").Broadcast(broadcasts.BroadcastTemplatePlayer.UpdateHandCardsUI("draw", discardedCard));
                            }
                        }
                        break;
                    case "Potion":
                        if (this.#cardPotion.length < this.#cardPotionLimit) {
                            //TODO Draw Potion
                        }
                }
            }
        }

        /**
         * Add a new card to a destination
         * @param {object} msg 
         */
        #AddCard(msg){
            switch(msg.destination) {
                case "Hand":
                    if (msg.fromDeck) {
                        if (this.#cardHand.length < this.#handLimit) {
                            const cardIndex = this.#cardDeck.indexOf(msg.card);
                            this.#cardHand.push(this.#cardDeck.splice(cardIndex,1)[0]);
                            if (!this.#noUiUpdate) {
                                this.FindEntity("GameArea").Broadcast(broadcasts.BroadcastTemplatePlayer.UpdateHandCardsUI("add", msg.card));
                            }
                        }
                    } else if (msg.fromDiscard){
                        if (this.#cardHand.length < this.#handLimit) {
                            const cardIndex = this.#cardDiscard.indexOf(msg.card);
                            this.#cardHand.push(this.#cardDiscard.splice(cardIndex,1)[0]);
                            if (!this.#noUiUpdate) {
                                this.FindEntity("GameArea").Broadcast(broadcasts.BroadcastTemplatePlayer.UpdateHandCardsUI("add", msg.card));
                            }
                        }
                    } else {
                        if (this.#cardHand.length < this.#handLimit) {
                            this.#cardHand.push(msg.card);
                            if (!this.#noUiUpdate) {
                                this.FindEntity("GameArea").Broadcast(broadcasts.BroadcastTemplatePlayer.UpdateHandCardsUI("add", msg.card));
                            }
                        }
                    }
                    break;
                case "Discard":
                    this.#cardDiscard.push(msg.card);
                    break;
                case "Deck":
                    this.#cardDeck.push(msg.card)
                    this.#Shuffle({includeDiscard: false});
                    break;
            }
        }

        /**
         * Discard a card from hand to discard or delete from carddeck
         * @param {object} msg 
         */
        #DiscardCard(msg){
            switch (msg.mode) {
                case "Discard":
                    if (this.#cardHand.includes(msg.card)) {
                        const cardIndex = this.#cardHand.indexOf(msg.card);
                        this.#cardDiscard.push(msg.card);
                        this.#cardHand.splice(cardIndex,1);
                    }
                    break;
                    case "Delete":
                        if (this.#cardHand.includes(msg.card)) {
                            this.#cardHand.splice(this.#cardHand.indexOf(msg.card),1);
                        } else if (this.#cardDeck.includes(msg.card)) {
                            this.#cardDeck.splice(this.#cardDeck.indexOf(msg.card),1);
                        }  else if (this.#cardDiscard.includes(msg.card)) {
                            this.#cardDiscard.splice(this.#cardDiscard.indexOf(msg.card),1);
                        }
                    break;
            }
            this.FindEntity("GameArea").Broadcast(broadcasts.BroadcastTemplatePlayer.UpdateHandCardsUI("discard", msg.card));
        }

        /**
         * Discard a random card from hand, if not possible topcard from deck
         * @param {object} msg 
         */
        #DiscardRandomCard(msg){
            if (this.#cardHand.length > 0) {
                let index = Math.floor(Math.random() * this.#cardHand.length);
                let discardedCard = this.#cardHand[index];
                this.#cardDiscard.push(discardedCard);
                this.#cardHand.splice(index,1);
                if (!this.#noUiUpdate) {
                    this.FindEntity("GameArea").Broadcast(broadcasts.BroadcastTemplatePlayer.UpdateHandCardsUI("discard", discardedCard));
                }
            } else if (this.#cardDeck.length > 0){
                this.#cardDiscard.push(this.#cardDeck.pop());
            }
        }

        #ApplyDamage(msg) {
            if (!(this.#noUiUpdate)) {
                let currentShield = this.FindComponent("Shield").amount;
                for (let i = 0; (i < currentShield && msg.amount != 0); i++) {
                    msg.amount -= 1;
                    this.Broadcast(broadcasts.BroadcastTemplateSkills.ChangeShield("Decrease", this.FindComponent("PlayerSkills").defense, 1));
                } 
            }
            for (let i = 0; i < msg.amount; i++) {
                if (this.#cardDeck.length > 0) {
                    this.#cardDiscard.push(this.#cardDeck.pop());
                } else if (this.#cardHand.length > 0) {
                    let index = Math.floor(Math.random() * this.#cardHand.length);
                    let discardedCard = this.#cardHand[index];
                    this.#cardDiscard.push(discardedCard);
                    this.#cardHand.splice(index,1);
                    if (!this.#noUiUpdate) {
                        this.FindEntity("GameArea").Broadcast(broadcasts.BroadcastTemplatePlayer.UpdateHandCardsUI("discard", discardedCard));
                    }
                } else {
                    break;
                }
            }
            this.FindEntity("BattleEntity").Broadcast(broadcasts.BroadcastTemplateGame.ApplyDamage(0))
        }

        /**
         * Shuffle up your deck (Optional: Includes discard)
         * @param {object} msg 
         */
        #Shuffle(msg) {
            if (msg.includeHand) {
                let oldHand = this.#cardHand;
                this.#cardDeck = this.#cardDeck.concat(oldHand);
                this.#cardHand = [];
                if (!this.#noUiUpdate) {
                    for (let card of oldHand) {
                        this.FindEntity("GameArea").Broadcast(broadcasts.BroadcastTemplatePlayer.UpdateHandCardsUI("discard", card));
                    }
                }
            }

            if (msg.includeDiscard) {
                this.#cardDeck = this.#cardDeck.concat(this.#cardDiscard);
                this.#cardDiscard = [];
            }
            
            //Fisher-Yates_shuffle (src:https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)
            for (let i = this.#cardDeck.length - 1; i >= 1; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [this.#cardDeck[i], this.#cardDeck[j]] = [this.#cardDeck[j], this.#cardDeck[i]];
            }
        }

        GetZeroCard() {
            if (this.#noUiUpdate) {
                let zeroCardsHand = this.#cardHand.filter(card => card.cost == 0);
                if (zeroCardsHand.length > 0) {
                    this.#cardHand.splice(this.#cardHand.indexOf(zeroCardsHand[0]),1);
                    //triggers cardshop update
                    this.FindEntity("Cardshop").Broadcast(broadcasts.BroadcastTemplateCards.DrawCard())
                    return zeroCardsHand[0];
                } else {
                    let zeroCardsDeck = this.#cardDeck.filter(card => card.cost == 0);
                    if (zeroCardsDeck.length > 0) {
                        this.#cardDeck.splice(this.#cardDeck.indexOf(zeroCardsDeck[0]),1);
                        return zeroCardsDeck[0]
                    }
                }
            }
            return null;
        }

        #DiscardRanomPotion(msg) {
            this.#cardPotion.splice(this.#cardPotion[Math.floor(Math.random() * this.#cardPotion.length)], 1);
        }

        get hand() {
            return this.#cardHand;
        }

        get deck() {
            return this.#cardDeck;
        }

        get discard() {
            return this.#cardDiscard;
        }

        get handLimit() {
            return this.#handLimit;
        }

        get potion(){
            return this.#cardPotion;
        }

    }

    return {
        Carddeck : Carddeck
    }
})();