

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
         * An enum class to determin Witcherschool
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
         * Get ability string from witcher school
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
         * Get town string from witcher school
         * @param {string} name 
         * @returns {string}
         */
        static getHomeTownFromName(name) {
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

        /**
         * Get color string from witcher school
         * @param {string} name 
         * @returns {string}
         */
        static getColorFromName(name){
            switch(name) {
                case "Vipernschule":
                    return 0x7ED321;
                case "Katzenschule":
                    return 0x1e1fa7;
                case "Wolfsschule":
                    return 0x583b06;
                case "Baerenschule":
                    return 0xc73510;
                case "Greifenschule":
                    return 0xd2c415;
            }
        }
    }

    return {
        WitcherSchool : WitcherSchool
    }

}) ();