

export const player_options = (() => {

    class WitcherSchool{
        #name;
        #ability;
        #homeTown;
        static Cat() {return new WitcherSchool("Katzenschule");}
        static Viper() {return new WitcherSchool("Vipernschule");}
        static Bear() {return new WitcherSchool("Baerenschule");}
        static Wolf() {return new WitcherSchool("Wolfsschule");}
        static Griffin() {return new WitcherSchool("Greifenschule");}

        /**
         * Use static function constructor instead of default constructor!
         * @param {string} name 
         */
        constructor(name){
            this.#name = name
            this.#ability = WitcherSchool.getAbilityFromName(name);
            this.#homeTown = WitcherSchool.getHomeTownFromName(name);
        }

        get name() {
            return this.#name;
        }

        get ability() {
            return this.#ability;
        }

        get homeTown() {
            return this.#homeTown;
        }

        /**
         * 
         * @param {string} name 
         * @returns {string}
         */
        static getAbilityFromName(name) {
            switch(name) {
                case "Vipernschule":
                    return "Vergiftete Waffe";
                case "Katzenschule":
                    return "Schnelligkeit";
                case "Baerenschule":
                    return "Ruestung";
                case "Wolfsschule":
                    return "Schwertkunst";
                case "Greifenschule":
                    return "Magie";
            }
        }

        /**
         * 
         * @param {string} name 
         * @returns {town_components.Town}
         */
        static getHomeTownFromName(name) {
            //implement as town_components
            switch(name) {
                case "Vipernschule":
                    return "Gorthur Guaed";
                case "Katzenschule":
                    return "Stygga";
                case "Baerenschule":
                    return "Haern Caduch";
                case "Wolfsschule":
                    return "Kaer Morhen";
                case "Greifenschule":
                    return "Kaer Seren";
                }
        }
    }

    return {
        WitcherSchool : WitcherSchool
    }

}) ();