import { component } from "../Interfaces/component";


export const town_manager = (() =>{
    
    class TownManager extends component.Component{
        #waterTowns;
        #forestTowns;
        #mountainTowns;
        
        /**
         * 
         * @param {Array} townList 
         */
        constructor(townList) {
            this.#waterTowns = [];
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
            switch(town.region.toIdentifier()) {
                    case "Forest":
                        let randomIndex = Math.floor(Math.random * this.#forestTowns.length);
                        let town = this.#forestTowns[randomIndex];
                        this.#forestTowns.splice(randomIndex, 1);
                        return town;
                    case "Mountain":
                        let randomIndex = Math.floor(Math.random * this.#mountainTowns.length);
                        let town = this.#mountainTowns[randomIndex];
                        this.#mountainTowns.splice(randomIndex, 1);
                        return town;
                    case "River":
                        let randomIndex = Math.floor(Math.random * this.#riverTowns.length);
                        let town = this.#riverTowns[randomIndex];
                        this.#riverTowns.splice(randomIndex, 1);
                        return town;
            }
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