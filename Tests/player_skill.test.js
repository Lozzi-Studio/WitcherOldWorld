import { expect, test, describe } from "vitest";
import { player_skills } from "../src/Players/player-skills";
import { player_options } from "../src/Players/player-options";
import { player_entity } from "../src/Players/player-entity";
import { broadcasts } from "../src/Interfaces/broadcasts";


const playerSkills = new player_skills.PlayerSkills();
const skill = player_skills.Skill.Combat();
const shield = new player_skills.Shield();
let player1 = new player_entity.Player("Janik", player_options.WitcherSchool.Cat());

describe(
    'Init Playerskill', () => {
        test(
            'Member Variable Initialized', () => {
                expect(playerSkills.combat).toEqual(player_skills.Skill.Combat());
                expect(playerSkills.defense).toEqual(player_skills.Skill.Defense());
                expect(playerSkills.alchemy).toEqual(player_skills.Skill.Alchemy());
                expect(playerSkills.special).toEqual(player_skills.Skill.Special());
                expect(playerSkills.witcher).toEqual(player_skills.Skill.Witcher());
            }
        )
        test(
            'Skill Initialized', () => {
                expect(skill.level).toBe(1);
                expect(skill.toIdentifier()).toBe("Combat");
            }
        )
        test(
            'Shield Initialized', () => {
                expect(shield.amount).toBe(0);
                expect(shield.maxAmount).toBe(1);
            }
        )
    }
)

describe(
    'Increase PlayerSkill', () => {
        test(
            'Increase Level', () => {
                player1 = new player_entity.Player("Janik", player_options.WitcherSchool.Cat());
                player1.Broadcast(broadcasts.BroadcastTemplateSkills.ChangeSkillLevel(player_skills.Skill.Combat(), "Increase"));
                expect(player1.FindComponent('PlayerSkills').combat.level).toBe(2);
            }
        )
        test(
            'Increase Shield', () => {
                player1 = new player_entity.Player("Janik", player_options.WitcherSchool.Cat());
                player1.Broadcast(broadcasts.BroadcastTemplateSkills.ChangeSkillLevel(player_skills.Skill.Defense(), "Increase"));
                expect(player1.FindComponent('PlayerSkills').defense.level).toBe(2);
                expect(player1.FindComponent('Shield').amount).toBe(1);
                expect(player1.FindComponent('Shield').maxAmount).toBe(2);
            }
        )
        test(
            'Increase Shield - EdgeCase', () => {
                player1 = new player_entity.Player("Janik", player_options.WitcherSchool.Cat());
                player1.Broadcast(broadcasts.BroadcastTemplateSkills.ChangeCurrentShield("Increase", 1));
                expect(player1.FindComponent('Shield').amount).toBe(1);
                expect(player1.FindComponent('Shield').maxAmount).toBe(1);
                player1.Broadcast(broadcasts.BroadcastTemplateSkills.ChangeCurrentShield("Increase", 1));
                expect(player1.FindComponent('Shield').amount).toBe(1);
                expect(player1.FindComponent('Shield').maxAmount).toBe(1);
            }
        )
        test(
            'Increase Witcher', () => {
                player1 = new player_entity.Player("Janik", player_options.WitcherSchool.Cat());
                expect(player1.FindComponent('PlayerSkills').witcher.level).toBe(1);
                player1.Broadcast(broadcasts.BroadcastTemplateSkills.ChangeSkillLevel(player_skills.Skill.Combat(), "Increase"));
                expect(player1.FindComponent('PlayerSkills').witcher.level).toBe(1);
                player1.Broadcast(broadcasts.BroadcastTemplateSkills.ChangeSkillLevel(player_skills.Skill.Defense(), "Increase"));
                expect(player1.FindComponent('PlayerSkills').witcher.level).toBe(1);
                player1.Broadcast(broadcasts.BroadcastTemplateSkills.ChangeSkillLevel(player_skills.Skill.Alchemy(), "Increase"));
                expect(player1.FindComponent('PlayerSkills').witcher.level).toBe(1);
                player1.Broadcast(broadcasts.BroadcastTemplateSkills.ChangeSkillLevel(player_skills.Skill.Special(), "Increase"));
                expect(player1.FindComponent('PlayerSkills').witcher.level).toBe(2);
            }
        )

        //TODO ALCHEMY POTION TEST
    }
)

describe(
    'Decrease PlayerSkill', () => {

        test(
            'Decrease Level', () => {
                player1 = new player_entity.Player("Janik", player_options.WitcherSchool.Cat());
                player1.Broadcast(broadcasts.BroadcastTemplateSkills.ChangeSkillLevel(player_skills.Skill.Combat(), "Increase"));
                expect(player1.FindComponent('PlayerSkills').defense.level).toBe(1);
                player1.Broadcast(broadcasts.BroadcastTemplateSkills.ChangeSkillLevel(player_skills.Skill.Combat(), "Decrease"));
                expect(player1.FindComponent('PlayerSkills').combat.level).toBe(1);
            }
        )

        test(
            'Decrease Shield', () => {
                player1 = new player_entity.Player("Janik", player_options.WitcherSchool.Cat());
                player1.Broadcast(broadcasts.BroadcastTemplateSkills.ChangeSkillLevel(player_skills.Skill.Defense(), "Increase"));
                player1.Broadcast(broadcasts.BroadcastTemplateSkills.ChangeSkillLevel(player_skills.Skill.Defense(), "Decrease"));
                expect(player1.FindComponent('PlayerSkills').defense.level).toBe(1);
                expect(player1.FindComponent('Shield').amount).toBe(1);
                expect(player1.FindComponent('Shield').maxAmount).toBe(1);
                player1.Broadcast(broadcasts.BroadcastTemplateSkills.ChangeCurrentShield("Decrease", 1));
                expect(player1.FindComponent('Shield').amount).toBe(0);
                expect(player1.FindComponent('Shield').maxAmount).toBe(1);
            }
        )
        test(
            'Decrease Shield - EdgeCase', () => {
                player1 = new player_entity.Player("Janik", player_options.WitcherSchool.Cat());
                player1.Broadcast(broadcasts.BroadcastTemplateSkills.ChangeCurrentShield("Decrease", 1));
                expect(player1.FindComponent('Shield').amount).toBe(0);
                expect(player1.FindComponent('Shield').maxAmount).toBe(1);
            }
        )
    }
)