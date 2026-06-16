

export const player_options = (() => {

    class WitcherSchool{
        #name;
        #ability;
        #homeTown;
        #color;
        #imagePath;
        static Cat() {return new WitcherSchool("Katzenschule");}
        static Viper() {return new WitcherSchool("Vipernschule");}
        static Bear() {return new WitcherSchool("Baerenschule");}
        static Wolf() {return new WitcherSchool("Wolfsschule");}
        static Griffin() {return new WitcherSchool("Greifenschule");}

        /**
         * An enum class to determine Witcherschool
         * Use static function constructor instead of default constructor!
         * @param {string} name 
         */
        constructor(name){
            this.#name = name
            this.#ability = WitcherSchool.getAbilityFromName(name);
            this.#homeTown = WitcherSchool.getHomeTownFromName(name);
            this.#color = WitcherSchool.getColorFromName(name);
            this.#imagePath = WitcherSchool.getImagePathFromName(name);
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

        get imagePath() {
            return this.#imagePath;
        }

        /**
         * Get ability string from witcher school
         * @param {string} name 
         * @returns {string}
         */
        static getAbilityFromName(name) {
            switch(name) {
                case "Vipernschule":
                    return {
                        "name": "Vergiftete Waffe",
                        "info": "Super toller Infotext zu der Fähigkeit Vergiftete Waffe, der unter Umständen auch mal sehr lang werden kann, so lang dass ich hier auf jeden Fall ein paar Zeilen Platz brauche",
                        "bonus": "Anzahl an super tollen Sachen der Vipernschule"
                    };
                case "Katzenschule":
                    return {
                        "name": "Schnelligkeit",
                        "info": "Super toller Infotext zu der Fähigkeit Schnelligkeit, der unter Umständen auch mal sehr lang werden kann, so lang dass ich hier auf jeden Fall ein paar Zeilen Platz brauche",
                        "bonus": "Anzahl an super tollen Sachen der Katzenschule"
                    };
                case "Baerenschule":
                    return {
                        "name": "Ruestung",
                        "info": "Super toller Infotext zu der Fähigkeit Ruestung, der unter Umständen auch mal sehr lang werden kann, so lang dass ich hier auf jeden Fall ein paar Zeilen Platz brauche",
                        "bonus": "Anzahl an super tollen Sachen der Baerenschule"
                    };
                case "Wolfsschule":
                    return {
                        "name": "Schwertkunst",
                        "info": "1x pro Kampf\: In deinem ersten Zug darfst du Karten von deinem Deck ziehen (und ggf. in beliebiger Reihenfolge zurücklegen)",
                        "bonus": "Anzahl Karten die du ansehen / ziehen darfst"
                    };
                case "Greifenschule":
                    return {
                        "name": "Magie",
                        "info": "Super toller Infotext zu der Fähigkeit Magie, der unter Umständen auch mal sehr lang werden kann, so lang dass ich hier auf jeden Fall ein paar Zeilen Platz brauche",
                        "bonus": "Anzahl an super tollen Sachen der Greifenschule"
                    };
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

        /**
         * Get image from name
         * @param {string} name 
         * @returns {string}
         */
        static getImagePathFromName(name){
            let path = "./resources/assets/school-icons/"
            switch(name) {
                case "Vipernschule":
                    return path + "viper.png";
                case "Katzenschule":
                    return path + "cat.png";
                case "Wolfsschule":
                    return path + "wolf.png";
                case "Baerenschule":
                    return path + "bear.png";
                case "Greifenschule":
                    return path + "griffin.png";
            }
        }
    }

    return {
        WitcherSchool : WitcherSchool
    }

}) ();