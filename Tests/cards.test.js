import { expect, test, describe } from "vitest";
import { player_entity } from "../src/Players/player-entity";
import { player_options } from "../src/Players/player-options";
import { cards } from "../src/Cards/card-templates";

let player1 = new player_entity.Player("Janik", player_options.WitcherSchool.Cat());
let card = cards.CardTemplates.getVerchnichtenderSchlag();

describe(
    'Init Cards', () => {
        test(
            'Init Carddeck', () => {
                expect(player1.FindComponent('Carddeck').hand).toEqual([]);
                expect(player1.FindComponent('Carddeck').deck).toEqual([]);
                expect(player1.FindComponent('Carddeck').discard).toEqual([]);
            }
        )
    }
)
