

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
                        "info": "Ein Mal pro Kampf: Nachdem du deinem\
                                Gegner Schaden zugefügt hast und er\
                                dadurch 1 oder mehrere Karten abgelegt\
                                hat, darfst du diese Spezialisierung\
                                aktivieren, um den Gegner zu vergiften.\
                                In den nächsten Runden bekommt dein\
                                Gegner 1 Schaden nach seinem Zug.",
                        "levelInfo": "Anzahl an Runden / Schaden",
                        "value": [[1,1], [2,1], [3,1], [4,1], [4,1]]
                        
                    };
                case "Katzenschule":
                    return {
                        "name": "Schnelligkeit",
                        "info": "Ein Mal pro Kampf, in deinem ersten\
                                Kampfzug: Du darfst diese Spezialisierung\
                                aktivieren, um Karten von deinem Deck\
                                anzusehen und manche davon auf die\
                                Hand zu nehmen. Die anderen legst du\
                                in beliebiger Reihenfolge zurück.",
                        "levelInfo": "Anzahl Karten die du ansehen / ziehen darfst",
                        "value": [[1,1], [3,1], [3,2], [3,3], [3,3]]
                    };
                case "Baerenschule":
                    return {
                        "name": "Ruestung",
                        "info": "Ein Mal pro Kampf: Falls in deinem\
                                Kampfzug dein Schildwert 0 ist, wird diese\
                                Spezialisierung automatisch aktiviert:\
                                Ziehe Karten von deinem Deck. Ab Stufe\
                                2 erhöhst du auch deinen Schildwert.",
                        "levelInfo": "Anzahl Schilde die du bekommst / Karten die du ziehst",
                        "value": [[0,1], [1,1], [1,2], [2,2], [2,2]]
                    };
                case "Wolfsschule":
                    return {
                        "name": "Schwertkunst",
                        "info": "Ein Mal pro Kampf: Wenn du eine Kombo\
                                aus 3 oder mehr Karten spielst, darfst du\
                                diese Spezialisierung aktivieren, um zusätz-\
                                lichen Schaden zuzufügen. Ab Stufe 2 ziehst\
                                du auch Karten von deinem Deck.",
                        "levelInfo": "Schaden den du machst / Karten die du ziehst",
                        "value": [[1,0], [1,1], [1,2], [2,2], [2,2]]
                    };
                case "Greifenschule":
                    return {
                        "name": "Magie",
                        "info": "Ein Mal pro Kampf: Du darfst diese Spezia-\
                                lisierung aktivieren, um 1 Karte von deinem\
                                Ablagestapel auf die Hand zu nehmen.\
                                Stufe 1–2: Oberste Karte nehmen, Karten ablegen\
                                Stufe 3: Oberste Karte nehmen\
                                Stufe 4–5: Beliebige Karte nehmen",
                        "levelInfo": "Mehr Kontrolle über deine Karten.",
                        "value": [[1,2], [1,1], [1,0], [-1,0], [-1,0]]
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