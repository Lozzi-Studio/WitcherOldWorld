import { component } from "../Interfaces/component";


export const town_manager = (() =>{
    
    class TownManager extends component.Component{
        #riverTowns;
        #forestTowns;
        #mountainTowns;
        
        /**
         * 
         * @param {Array} townList 
         */
        constructor(townList) {
            super();
            this.#riverTowns = [];
            this.#forestTowns = [];
            this.#mountainTowns = [];

            for (let town of townList) {
                this.ReturnToPool(town);
            }
        } 

        /**
         * 
         * @param {region.Region} region 
         */
        GetRandomTownFromRegionPool(region) {
            let randomIndex = 0;
            let town = null;
            switch(region.toIdentifier()) {
                case "Forest":
                    randomIndex = Math.floor(Math.random() * this.#forestTowns.length);
                    town = this.#forestTowns[randomIndex];
                    break;
                case "Mountain":
                    randomIndex = Math.floor(Math.random() * this.#mountainTowns.length);
                    town = this.#mountainTowns[randomIndex];
                    break;
                case "River":
                    randomIndex = Math.floor(Math.random() * this.#riverTowns.length);
                    town = this.#riverTowns[randomIndex];
                    break;
            }

            if (town == this.FindComponent('GameManager').currentPlayer.town) {
                town = this.GetRandomTownFromRegionPool(region);
            } else {
                 switch(region.toIdentifier()) {
                    case "Forest":
                        this.#forestTowns.splice(randomIndex, 1);
                        break;
                    case "Mountain":
                        this.#mountainTowns.splice(randomIndex, 1);
                        break;
                    case "River":
                        this.#riverTowns.splice(randomIndex, 1);
                        break;
                }
            }
            return town;
        }

        /**
         * 
         * @param {town_entity.TownEntity} town 
         */
        ReturnToPool(town) {
            switch(town.region.toIdentifier()) {
                case "Forest":
                    this.#forestTowns.push(town);
                    break;
                case "Mountain":
                    this.#mountainTowns.push(town);
                    break;
                case "River":
                    this.#riverTowns.push(town);
                    break;
            }
        }

    }

    return {
        TownMangaer : TownManager
    }
}) ();