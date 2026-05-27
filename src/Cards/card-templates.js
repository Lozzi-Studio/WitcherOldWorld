import { card } from "./card";
import { card_options } from "./card-options";
import { region } from "../GameArea/region";

export const cards = (() => {

    class CardTemplates {


        /**
         * Get card template for card Riposte
         * @param {Map<card_options.Color, card_options.CardEffect>} comboOptions 
         * @param {region.Region} region 
         * @returns {object}
         */
        static getRiposte(comboOptions, region){
            return new card.Card(
                "Riposte",
                card_options.Color.Green(),
                comboOptions,
                card_options.CardEffect.createCardEffect(0,1,0,false,false),
                region,
                0
            )
        }

        /**
         * Get card template for card Deckung
         * @param {Map<card_options.Color, card_options.CardEffect>} comboOptions 
         * @param {region.Region} region 
         * @returns {object}
         */
        static getDeckung(comboOptions, region) {
            return new card.Card(
                "Deckung",
                card_options.Color.Green(),
                comboOptions,
                card_options.CardEffect.createCardEffect(0,1,0,false,false),
                region,
                0
            )
        }

        /**
         * Get card template for card Abwehr
         * @param {Map<card_options.Color, card_options.CardEffect>} comboOptions 
         * @param {region.Region} region 
         * @returns {object}
         */
        static getAbwehr(comboOptions, region) {
            return new card.Card(
                "Abwehr",
                card_options.Color.Green(),
                comboOptions,
                card_options.CardEffect.createCardEffect(0,2,0,false,false),
                region,
                1
            )
        }

        /**
         * Get card template for card BlitzschnelleReflexe
         * @param {Map<card_options.Color, card_options.CardEffect>} comboOptions 
         * @returns {object}
         */
        static getBlitzschnelleReflexe(comboOptions) {
            return new card.Card(
                "Blitzschnelle Reflexe",
                card_options.Color.Green(),
                comboOptions,
                card_options.CardEffect.createCardEffect(0,2,0,false,false),
                region.Region.Mountain(),
                2
            )
        }

        /**
         * Get card template for card PraeziserSchnitt
         * @param {Map<card_options.Color, card_options.CardEffect>} comboOptions 
         * @param {region.Region} region 
         * @returns {object}
         */
        static getPraeziserSchnitt(comboOptions, region) {
            return new card.Card(
                "Praeziser Schnitt",
                card_options.Color.Blue(),
                comboOptions,
                card_options.CardEffect.createCardEffect(),
                region,
                0
            )
        }

        /**
         * Get card template for card Drehung with Region Forest
         * @param {Map<card_options.Color, card_options.CardEffect>} comboOptions 
         * @returns {object}
         */
        static getDrehungForest(comboOptions) {
            return new card.Card(
                "Drehung",
                card_options.Color.Blue(),
                comboOptions,
                card_options.CardEffect.createCardEffect(2,0,0,false,false),
                region.Region.Forest(),
                1
            )
        }

        /**
         * Get card template for card Drehung with Region Mountain
         * @param {Map<card_options.Color, card_options.CardEffect>} comboOptions 
         * @returns {object}
         */
        static getDrehungMountain(comboOptions) {
            return new card.Card(
                "Drehung",
                card_options.Color.Blue(),
                comboOptions,
                card_options.CardEffect.createCardEffect(1,0,0,false,false),
                region.Region.Mountain(),
                1
            )
        }

        /**
         * Get card template for card Vernichtender Schlag
         * @param {Map<card_options.Color, card_options.CardEffect>} comboOptions 
         * @returns {object}
         */
        static getVerchnichtenderSchlag(comboOptions) {
            return new card.Card(
                "Vernichtender Schlag",
                card_options.Color.Blue(), 
                comboOptions, 
                card_options.CardEffect.createCardEffect(2,0,0,false,false),
                region.Region.River(),
                2
                )
        }

        /**
         * Get card template for card Schmetterschlag
         * @param {Map<card_options.Color, card_options.CardEffect>} comboOptions 
         * @param {region.Region} region 
         * @returns {object}
         */
        static getSchmetterschlag(comboOptions, region) {
            return new card.Card(
                "Schmetterschlag",
                card_options.Color.Red(),
                comboOptions,
                card_options.CardEffect.createCardEffect(2,0,-1,false,false),
                region,
                0
            )
        }

        /**
         * Get card template for card Praeziser Schlag
         * @param {Map<card_options.Color, card_options.CardEffect>} comboOptions 
         * @param {region.Region} region 
         * @returns {object}
         */
        static getPraeziserSchlag(comboOptions, region) {
            return new card.Card(
                "Praeziser Schlag",
                card_options.Color.Red(),
                comboOptions,
                card_options.CardEffect.createCardEffect(3,0,-3,false,false),
                region,
                1
            )
        }

        /**
         * Get card template for card Wuchtschlag
         * @param {Map<card_options.Color, card_options.CardEffect>} comboOptions 
         * @returns {object}
         */
        static getWuchtschlag(comboOptions) {
            return new card.Card(
                "Wutchschlag",
                card_options.Color.Red(),
                comboOptions,
                card_options.CardEffect.createCardEffect(3,0,-1,false,false),
                region.Region.Mountain(),
                2
            )
        }

        /**
         * Get card template for card Verstaerktes Axii
         * @param {Map<card_options.Color, card_options.CardEffect>} comboOptions 
         * @returns {object}
         */
        static getVerstaerktesAxii(comboOptions) {
            return new card.Card(
                "Verstaerktes Axii",
                card_options.Color.Yellow(),
                comboOptions,
                card_options.CardEffect.createCardEffect(0,0,0,false,true),
                region.Region.River(),
                0
            )
        }

        /**
         * Get card template for card Verstaerktes Yrden
         * @param {Map<card_options.Color, card_options.CardEffect>} comboOptions 
         * @param {region.Region} region 
         * @returns {object}
         */
        static getVerstaerktesYrden(comboOptions, region) {
            return new card.Card(
                "Verstaerktes Yrden",
                card_options.Color.Yellow(),
                comboOptions,
                card_options.CardEffect.createCardEffect(0,0,1,false,false),
                region,
                0
            )
        }

        /**
         * Get card template for card Magiefalle
         * @param {Map<card_options.Color, card_options.CardEffect>} comboOptions 
         * @returns {object}
         */
        static getMagiefalle(comboOptions) {
            return new card.Card(
                "Magiefalle",
                card_options.Color.Yellow(),
                comboOptions,
                card_options.CardEffect.createCardEffect(0,0,0,false,true),
                region.Region.Mountain(),
                1
            )
        }

        /**
         * Get card template for card Verstaerktes Qwen
         * @param {Map<card_options.Color, card_options.CardEffect>} comboOptions 
         * @param {region.Region} region 
         * @returns {object}
         */
        static getVerstaerktesQwen(comboOptions, region) {
            return new card.Card(
                "Verstaerktes Qwen",
                card_options.Color.Yellow(),
                comboOptions,
                card_options.CardEffect.createCardEffect(0,0,2,false,false),
                region,
                1
            )
        }

        /**
         * Get card template for card Explosiver Schild
         * @param {Map<card_options.Color, card_options.CardEffect>} comboOptions 
         * @param {region.Region} region 
         * @returns {object}
         */
        static getExplosiverSchild(comboOptions, region) {
            return new card.Card(
                "Explosiver Schild",
                card_options.Color.Yellow(),
                comboOptions,
                card_options.CardEffect.createCardEffect(0,0,0,false,true),
                region,
                2
            )
        }

        /**
         * Get card template for card Verstaerktes Aard
         * @param {Map<card_options.Color, card_options.CardEffect>} comboOptions 
         * @returns {object}
         */
        static getVerstaerktesAard(comboOptions) {
            return new card.Card(
                "Verstaerktes Aard",
                card_options.Color.Purple(),
                comboOptions,
                card_options.CardEffect.createCardEffect(1,0,0,false,false),
                region.Region.Forest(),
                0
            )
        }

        /**
         * Get card template for card Verstaerktes Igni
         * @returns {object}
         */
        static getVerstaerktesIgni() {
            return new card.Card(
                "Verstaerktes Igni",
                card_options.Color.Purple(),
                new Map([[card_options.Color.Green(), card_options.CardEffect.createCardEffect(0,0,0,false,false)],
                [card_options.Color.Yellow(), card_options.CardEffect.createCardEffect(0,0,0,false,false)],
                [card_options.Color.Blue(), card_options.CardEffect.createCardEffect(0,0,0,false,false)],
                [card_options.Color.Red(), card_options.CardEffect.createCardEffect(0,0,0,false,false)]]),
                card_options.CardEffect.createCardEffect(1,0,1,false,false),
                region.Region.River(),
                0
            )
        }

        /**
         * Get card template for card Ruestung Schmelzen
         * @param {Map<card_options.Color, card_options.CardEffect>} comboOptions 
         * @returns {object}
         */
        static getRuestungSchmelzen(comboOptions) {
            return new card.Card(
                "Ruestung Schmelzen",
                card_options.Color.Purple(),
                comboOptions,
                card_options.CardEffect.createCardEffect(2,0,0,false,false),
                region.Region.Mountain(),
                1
            )
        }

        /**
         * Get card template for card Schockwelle
         * @param {Map<card_options.Color, card_options.CardEffect>} comboOptions 
         * @returns {object}
         */
        static getSchockwelle(comboOptions) {
            return new card.Card(
                "Schockwelle",
                card_options.Color.Purple(),
                comboOptions,
                card_options.CardEffect.createCardEffect(2,0,0,false,false),
                region.Region.Mountain(),
                1
            )
        }

        /**
         * Get card template for card Feuerstrahl
         * @param {Map<card_options.Color, card_options.CardEffect>} comboOptions 
         * @returns {object}
         */
        static getFeuerstrahl(comboOptions) {
            return new card.Card(
                "Feuerstrahl",
                card_options.Color.Purple(),
                comboOptions,
                card_options.CardEffect.createCardEffect(2,0,2,false,false),
                region.Region.Mountain(),
                2
            )
        }

    }

    return {
        CardTemplates : CardTemplates
    }
}) ();