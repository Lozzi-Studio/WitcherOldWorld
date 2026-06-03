import { component } from "../Interfaces/component";
import { broadcasts } from "../Interfaces/broadcasts";

export const player_status = (() => {
    
    class PlayerStatus extends component.Component{
        #statusList;        

        /**
         * A tracker for player status
         */
        constructor() {
            super();
            #statusList = [];
        }

        #AddStatus(){
            //TODO function for adding status
        };

        #GetStatus(statusName){
            //TODO function for getting a specified status
        };
    }
}) ();