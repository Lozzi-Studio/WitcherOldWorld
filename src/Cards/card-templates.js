import { card } from "./card";
import { card_options } from "./card-options";

export const cards = (() => {

    /**
     * @param {Map<card_options.Color, card_options.CardEffect>} comboOptions
     */
    class CardTemplates {



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

        static getBlitzschnelleReflexe(comboOptions) {
            return new card.Card(
                "Blitzschnelle Reflexe",
                card_options.Color.Green(),
                comboOptions,
                card_options.CardEffect.createCardEffect(0,2,0,false,false),
                card_options.Region.Mountain(),
                2
            )
        }

        static getPraeziserSchnitt(comboOptions, region) {
            return new card.Card(
                "Praezischer Schnitt",
                card_options.Color.Blue(),
                comboOptions,
                card_options.CardEffect.createCardEffect(),
                region,
                0
            )
        }

        static getDrehungForest(comboOptions) {
            return new card.Card(
                "Drehung",
                card_options.Color.Blue(),
                comboOptions,
                card_options.CardEffect.createCardEffect(2,0,0,false,false),
                card_options.Region.Mountain(),
                1
            )
        }

        static getDrehungMountain(comboOptions) {
            return new card.Card(
                "Drehung",
                card_options.Color.Blue(),
                comboOptions,
                card_options.CardEffect.createCardEffect(1,0,0,false,false),
                card_options.Region.Forest(),
                1
            )
        }

        static getVerchnichtenderSchlag(comboOptions) {
            return new card.Card(
                "Vernichtender Schlag",
                card_options.Color.Blue(), 
                comboOptions, 
                card_options.CardEffect.createCardEffect(2,0,0,false,false),
                card_options.Region.River(),
                2
                )
        }

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

        static getWuchtschlag(comboOptions) {
            return card.Card(
                "Wutchschlag",
                card_options.Color.Red(),
                comboOptions,
                card_options.CardEffect.createCardEffect(3,0,-1,false,false),
                card_options.Region.Mountain(),
                2
            )
        }

        static getVerstaerktesAxii(comboOptions) {
            return card.Card(
                "Verstaerktes Axii",
                card_options.Color.Yellow(),
                comboOptions,
                card_options.CardEffect.createCardEffect(0,0,0,false,true),
                card_options.Region.River(),
                0
            )
        }

        static getVerstaerktesYrden(comboOptions, region) {
            return card.Card(
                "Verstaerktes Yrden",
                card_options.Color.Yellow(),
                comboOptions,
                card_options.CardEffect.createCardEffect(0,0,1,false,false),
                region,
                0
            )
        }

        static getMagiefalle(comboOptions) {
            return card.Card(
                "Magiefalle",
                card_options.Color.Yellow(),
                comboOptions,
                card_options.CardEffect.createCardEffect(0,0,0,false,true),
                card_options.Region.Mountain(),
                1
            )
        }

        static getVerstaerktesQwen(comboOptions, region) {
            return card.Card(
                "Verstaerktes Qwen",
                card_options.Color.Yellow(),
                comboOptions,
                card_options.CardEffect.createCardEffect(0,0,2,false,false),
                region,
                1
            )
        }

        static getExplosiverSchild(comboOptions, region) {
            return card.Card(
                "Explosiver Schild",
                card_options.Color.Yellow(),
                comboOptions,
                card_options.CardEffect.createCardEffect(0,0,0,false,true),
                region,
                2
            )
        }

        static getVerstaerktesAard(comboOptions) {
            return card.Card(
                "Verstaerktes Aard",
                card_options.Color.Purple(),
                comboOptions,
                card_options.CardEffect.createCardEffect(1,0,0,false,false),
                card_options.Region.Forest(),
                0
            )
        }

        static getVertaerktesIgni() {
            return card.Card(
                "Verstaerktes Igni",
                card_options.Color.Purple(),
                new Map([[card_options.Color.Green, card_options.CardEffect.createCardEffect(0,0,0,false,false)],
                [card_options.Color.Yellow, card_options.CardEffect.createCardEffect(0,0,0,false,false)],
                [card_options.Color.Blue, card_options.CardEffect.createCardEffect(0,0,0,false,false)],
                [card_options.Color.Red, card_options.CardEffect.createCardEffect(0,0,0,false,false)]]),
                card_options.CardEffect.createCardEffect(1,0,1,false,false),
                card_options.Region.River(),
                0
            )
        }

        static getRuestungSchmelzen(comboOptions) {
            return card.Card(
                "Rüstung Schmelzen",
                card_options.Color.Purple(),
                comboOptions,
                card_options.CardEffect.createCardEffectI(2,0,0,false,false),
                card_options.Region.Mountain(),
                1
            )
        }

        static getSchockwelle(comboOptions) {
            return card.Card(
                "Schockwelle",
                card_options.Color.Purple(),
                comboOptions,
                card_options.CardEffect.createCardEffect(2,0,0,false,false),
                card_options.Region.Mountain(),
                1
            )
        }

        static getFeuerstrahl(comboOptions) {
            return card.Card(
                "Feuerstrahl",
                card_options.Color.Purple(),
                comboOptions,
                card_options.CardEffect.createCardEffect(2,0,2,false,false),
                card_options.Region.Mountain(),
                2
            )
        }

    }

    return {
        CardTemplates : CardTemplates
    }
}) ();