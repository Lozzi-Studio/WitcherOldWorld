import { component } from "../Interfaces/component";


export const town_manager = (() =>{
    
    class TownManager extends component.Component{
        #riverTowns;
        #forestTowns;
        #mountainTowns;
        
        /**
         * A manager to get town ids for regions and blocks not returned ids
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
         * Get a random not blocked town from a region
         * @param {region.Region} region
         * @param {bool} removeFromPool
         */
        GetRandomTownFromRegionPool(region, excludeFromPool = [this.FindComponent('GameManager').currentPlayer.town], removeFromPool = true) {
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
            let isValid = true;
            for (let check of excludeFromPool) {
                if (check === town) {
                    isValid = false;
                }
            }
            if (!(isValid)) {
                town = this.GetRandomTownFromRegionPool(region, excludeFromPool, removeFromPool);
            } else {
                if (removeFromPool){
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
            }
            return town;
        }

        /**
         * Return town to pool
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
        TownManager : TownManager
    }
}) ();