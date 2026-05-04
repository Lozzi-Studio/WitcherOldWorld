

export const player_options = (() => {

    class WitcherSchool{
        #name;
        #ability;
        #homeTown;
        #color;
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
            this.#color = WitcherSchool.getColorFromName(name);
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

        get color() {
            return this.#color;
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
                case "Wolfschule":
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
                case "Wolfschule":
                    return "Kaer Morhen";
                case "Greifenschule":
                    return "Kaer Seren";
                }
        }

        static getColorFromName(name){
            switch(name) {
                case "VipernSchule":
                    return 0x7ED321;
                case "Katzenschule":
                    return 0xF5A623;
                case "Wolfenschule":
                    return 0x9B9B9B;
                case "Baerenschule":
                    return 0xF5A623;
                case "Greifenschule":
                    return 0xD0021B;
            }
        }
    }

    return {
        WitcherSchool : WitcherSchool
    }

}) ();