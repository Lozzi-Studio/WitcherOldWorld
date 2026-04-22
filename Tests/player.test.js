import {expect, test, describe} from 'vitest'
import { entity_manager } from '../src/Interfaces/entity-manager'
import { player_entity } from '../src/Players/player-entity'
import { player_options } from '../src/Players/player-options';

const entityManager = new entity_manager.EntityManager();
entityManager.AddEntity(new player_entity.Player("Janik", player_options.WitcherSchool.Cat()), "Player_1");
describe(
    'Init PlayerEntity', () => {
        test(
            'Member Variable Initialized', () => {
                expect(entityManager.FindEntity("Player_1").playerName).toBe("Janik")
                expect(entityManager.FindEntity("Player_1").town).toBe("Stygga");
                expect(entityManager.FindEntity("Player_1").witcherSpecialAbility).toBe("Schnelligkeit");
            }
        )
        test(
            'All Component Initialized', () => {
                expect(entityManager.FindEntity("Player_1").FindComponent("Carddeck")).not.toBe(undefined);
                expect(entityManager.FindEntity("Player_1").FindComponent("PlayerPosition")).not.toBe(undefined);
                expect(entityManager.FindEntity("Player_1").FindComponent("PlayerSkills")).not.toBe(undefined);
                expect(entityManager.FindEntity("Player_1").FindComponent("Shield")).not.toBe(undefined);
            }
        )
    }
);
