import { card_options } from "../Cards/card-options";
import { broadcasts } from "../Interfaces/broadcasts";
import { component } from "../Interfaces/component";
import { player_skills } from "../Players/player-skills";
import { status_options } from "../Players/status-options";
import { status_templates } from "../Players/status-templates";


export const battle_manager = (() => {

    class BattleManager extends component.Component {
        #player;
        #monster;
        #playerDrawValues;

        constructor() {
            super();
            this.#player = null;
            this.#monster = null;
            
            this.#playerDrawValues = [1, 2, 3, 4, 4];
        }

        InitComponent() {
            this._RegisterHandler('battle.playCombo', (msg) => {this.#PlayCombo(msg)});
            this._RegisterHandler('battle.startBattle', (msg) => {this.#StartBattle(msg)});
        }

        #StartBattle(msg) {
            this.#player = msg.player;
            this.#monster = msg.monster;
            this.#player.Broadcast(broadcasts.BroadcastTemplateCards.ShuffleDeck(true, false));
            this.#monster.Broadcast(broadcasts.BroadcastTemplateCards.LoadCarddeck("Monster")); 
            this.#monster.Broadcast(broadcasts.BroadcastTemplateCards.ShuffleDeck(true, false));
            let varDiff = this.#monster.FindComponent("Carddeck").deck.length -this.#monster.health;
            for (let i = 0; i < varDiff; i++) {
                this.#monster.Broadcast(broadcasts.BroadcastTemplateCards.DiscardRandomCard());
            }
            this.FindEntity('Camera').Broadcast(broadcasts.BroadcastTemplateMusic.PlayBattleMonsterTheme());
            this.#GetStartingTurn();
        }

        #GetStartingTurn() {
            let amount = 0;
            switch (this.#monster.name.split("_")[1]) {
                case "River":
                    amount = this.#player.FindComponent("PlayerStatus").GetStatusAmount(status_templates.StatusTemplates.riverTracker());
                    if (amount > 0) {
                        this.#player.FindComponent("PlayerStatus").RemovePermanentStatus(status_templates.StatusTemplates.riverTracker());
                        this.#PlayerTurn();
                    } else {
                        this.#MonsterTurn();
                    }
                    break;
                case "Forest":
                    amount = this.#player.FindComponent("PlayerStatus").GetStatusAmount(status_templates.StatusTemplates.forestTracker());
                    if (amount > 0) {
                        this.#player.FindComponent("PlayerStatus").RemovePermanentStatus(status_templates.StatusTemplates.forestTracker());
                        this.#PlayerTurn();
                    } else {
                        this.#MonsterTurn();
                    }
                    break;
                case "Mountain":
                    amount = this.#player.FindComponent("PlayerStatus").GetStatusAmount(status_templates.StatusTemplates.mountainTracker());
                    if (amount > 0) {
                        this.#player.FindComponent("PlayerStatus").RemovePermanentStatus(status_templates.StatusTemplates.mountainTracker());
                        this.#PlayerTurn();
                    } else {
                        this.#MonsterTurn();
                    }
                    break;
                default:
                    this.#PlayerTurn();
            }
        }

        #MonsterTurn() {
            let nextMove = this.#monster.FindComponent("MonsterAi").ChooseNextMove();
            if (nextMove.damage > 0) {
                this.#player.Broadcast(broadcasts.BroadcastTemplateGame.ApplyDamage(nextMove.damage));
            } else if (nextMove.skill != ""){
                if (nextMove.discard) {
                    if (nextMove.level != undefined){
                        this.#player.Broadcast(broadcasts.BroadcastTemplateGame.ApplyDamage(nextMove.level));
                        switch (nextMove.skill) {
                            case "combat":
                                this.#player.Broadcast(broadcasts.BroadcastTemplateSkills.ChangeSkillLevel(player_skills.Skill.Combat(), "Decrease", false));
                                break;
                            case "defense":
                                this.#player.Broadcast(broadcasts.BroadcastTemplateSkills.ChangeSkillLevel(player_skills.Skill.Defense(), "Decrease", false));
                                break;
                            case "alchemy":
                                this.#player.Broadcast(broadcasts.BroadcastTemplateSkills.ChangeSkillLevel(player_skills.Skill.Alchemy(), "Decrease", false));
                                break;
                        }
                    }
                } else {
                    let dmg = 0;
                    switch (nextMove.skill) {
                        case "combat":
                            dmg = this.#player.FindComponent("PlayerSkills").combat;
                            break;
                        case "defense":
                            dmg = this.#player.FindComponent("PlayerSkills").defense;
                            break;
                        case "alchemy":
                            dmg = this.#player.FindComponent("PlayerSkills").alchemy;
                            break;
                        case "special":
                            dmg = this.#player.FindComponent("PlayerSkills").special;
                            break;
                    }
                    this.#player.Broadcast(broadcasts.BroadcastTemplateGame.ApplyDamage(dmg));
                }
            } else if (nextMove.level != undefined){
                if (nextMove.discard) {
                    for (let i = 0; i < nextMove.level; i++) {
                        this.#player.Broadcast(broadcasts.BroadcastTemplateCards.DiscardRandomCard());
                    }
                } else {
                    this.#player.Broadcast(broadcasts.BroadcastTemplateGame.ApplyDamage(nextMove.level));
                }
            } else {
                this.#player.Broadcast(broadcasts.BroadcastTemplateGame.ApplyDamage(2));
            }

            console.log(nextMove);
            
            if (this.#player.FindComponent("Carddeck").hand.length <= 0 && this.#player.FindComponent("Carddeck").deck.length <= 0 ) {
                if (this.#monster.FindComponent("Carddeck").hand.length <= 0 && this.#monster.FindComponent("Carddeck").deck.length <= 1 ) {
                    this.#ResolveDraw();
                } else {
                    this.#ResolveMonsterWin();
                }
            } else {
                this.#PlayerTurn();
            }
        }

        #PlayerTurn() {
            if (this.#player.FindComponent("Carddeck").hand.length <= 0) {
                this.#PlayCombo({})
            } else {
                this.FindEntity("GameArea").Broadcast(broadcasts.BroadcastTemplateBattle.StartPlayerTurn());
            }
        }

        #ResolveMonsterWin(){
            console.log("MonsterWin");
            this.#player.Broadcast(broadcasts.BroadcastTemplateSkills.ChangeCurrentShield("Increase", 5));
            this.#player.Broadcast(broadcasts.BroadcastTemplateCards.ShuffleDeck(true, true));
            let amount = 0;
            switch (this.#monster.name.split("_")[1]) {
                case "River":
                    amount = this.#player.FindComponent("PlayerStatus").GetStatusAmount(status_templates.StatusTemplates.riverTracker());
                    if (amount <= 0) {
                        this.#player.Broadcast(broadcasts.BroadcastTemplatePlayer.AddStatus(status_templates.StatusTemplates.riverTracker(), "permanent"));
                    } 
                    break;
                case "Forest":
                    amount = this.#player.FindComponent("PlayerStatus").GetStatusAmount(status_templates.StatusTemplates.forestTracker());
                    if (amount <= 0) {
                        this.#player.Broadcast(broadcasts.BroadcastTemplatePlayer.AddStatus(status_templates.StatusTemplates.forestTracker(), "permanent"));
                    }
                    break;
                case "Mountain":
                    amount = this.#player.FindComponent("PlayerStatus").GetStatusAmount(status_templates.StatusTemplates.mountainTracker());
                    if (amount <= 0) {
                        this.#player.Broadcast(broadcasts.BroadcastTemplatePlayer.AddStatus(status_templates.StatusTemplates.mountainTracker(), "permanent"));
                    }
                    break;
            }
            let zeroCostCard = this.FindEntity("Cardshop").FindComponent("Carddeck").GetZeroCard();
            if (zeroCostCard != null) {
                this.#player.Broadcast(broadcasts.BroadcastTemplateCards.AddCard(zeroCostCard,"Discard"));
            }
            this.#player.Broadcast(broadcasts.BroadcastTemplatePlayer.AddStatus(status_templates.StatusTemplates.drawLessCards(status_options.Timing.EndOfTurn(), 1), "temporary"));
            this.#EndBattle();
        }

        #ResolvePlayerWin(){
            console.log("PlayerWin");
            this.#player.Broadcast(broadcasts.BroadcastTemplateSkills.ChangeCurrentShield("Increase", 5));
            this.#player.Broadcast(broadcasts.BroadcastTemplateCards.ShuffleDeck(true, true));
            this.#player.Broadcast(broadcasts.BroadcastTemplatePlayer.AddTrophy());
            this.#player.Broadcast(broadcasts.BroadcastTemplatePlayer.ChangeMoney(2));
            tthis.FindEntity("GameArea").Broadcast(broadcasts.BroadcastTemplateGame.CreateNewMonster(this.#monster.rank + 1 <= 3 ? this.#monster.rank : 3, this.#monster.name.split("_")[1], true));
            this.#EndBattle();
        } 
        
        #ResolveDraw(){
            console.log("Draw");
            this.#player.Broadcast(broadcasts.BroadcastTemplateSkills.ChangeCurrentShield("Increase", 5));
            this.#player.Broadcast(broadcasts.BroadcastTemplateCards.ShuffleDeck(true, true));
            this.#player.Broadcast(broadcasts.BroadcastTemplatePlayer.ChangeMoney(2));
            let zeroCostCard = this.FindEntity("Cardshop").FindComponent("Carddeck").GetZeroCard();
            if (zeroCostCard != null) {
                this.#player.Broadcast(broadcasts.BroadcastTemplateCards.AddCard(zeroCostCard,"Discard"));
            }
            this.FindEntity("GameArea").Broadcast(broadcasts.BroadcastTemplateGame.CreateNewMonster(this.#monster.rank, this.#monster.name.split("_")[1], false));
            this.#EndBattle();
        }


        #PlayCombo(msg) {
            console.log(msg);
            if (msg.length > 0) {
                let result = card_options.CardEffect.createCardEffect(0,0,0,false,false);
                let cardsToDiscard = [];
                for (let effect of msg.card.getEffect([])) {
                    if (effect.bonus != null) {
                        result.damage += effect.bonus.damage;
                        result.shield += effect.bonus.shield;
                        result.drawModifier += effect.bonus.drawModifier;
                    }
                    result.damage += effect.effects.damage;
                    result.shield += effect.effects.shield;
                    result.drawModifier += effect.effects.drawModifier;
                    if (!(effect.effects.backtohand || effect.bonus ? effect.bonus.backtohand : false)) {
                       cardsToDiscard.push(effect.card);
                    }
                    if (effect.effects.gettopdiscard || effect.bonus ? effect.bonus.gettopdiscard : false) {
                        this.#player.Broadcast(broadcasts.BroadcastTemplateCards.DrawCard("Discard", 1));
                    }
                }
                for (let card of cardsToDiscard) {
                    this.#player.Broadcast(broadcasts.BroadcastTemplateCards.DiscardCard(card, "Discard"));
                }
                
                this.FindEntity("GameArea").Broadcast(broadcasts.BroadcastTemplateCards.UpdateCardSelectionUI());
                this.#monster.Broadcast(broadcasts.BroadcastTemplateGame.ApplyDamage(result.damage));
                this.#player.Broadcast(broadcasts.BroadcastTemplateSkills.ChangeShield("Increase", this.#player.FindComponent("PlayerSkills").defense, result.shield));
            } else {
                this.#player.Broadcast(broadcasts.BroadcastTemplateCards.DrawCard("BattleDeck", (Math.max(0 ,(this.#playerDrawValues[this.#player.FindComponent("PlayerSkills").combat.level - 1])))));
            }

            if (this.#monster.FindComponent("Carddeck").hand.length <= 0 && this.#monster.FindComponent("Carddeck").deck.length <= 0 ) {
                if (this.#player.FindComponent("Carddeck").hand.length <= 0 && this.#player.FindComponent("Carddeck").deck.length <= 0 ) {
                    this.#ResolveDraw();
                } else {
                    this.#ResolvePlayerWin();
                }
            } else {
                this.#MonsterTurn();
            }
        }

        #EndBattle() {
            this.FindEntity('Camera').Broadcast(broadcasts.BroadcastTemplateMusic.PlayMainTheme());
            this.FindEntity("GameArea").Broadcast(broadcasts.BroadcastTemplateGame.NextPhase());
        }
    }

    return {
        BattleManager : BattleManager
    }
}) ();