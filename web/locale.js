var Locale = (function(){
    var LANG_CODE_LENGTH = 2;

    var locales = {};

    var quantity = {
        ZERO: "zero",
        ONE: "one",
        TWO: "two",
        FEW: "few",
        MANY: "many",
        OTHER: "other"
    };

    var Locale = function(code){
        // try to get full match
        if (locales[code]){
            return locales[code];
        }
        //try to find by lang part only
        var lang = code.substr(code, LANG_CODE_LENGTH);
        if (locales[lang]){
            return locales[lang];
        }
        // nothing found, return mock
        return {
            name: code,
            localName: code,
            code: code,
            pluralForms: [quantity.ONE, quantity.OTHER], // this is valid for most languages
            plural: function(n){
                return n>1;       // most common forms is "n>0" and "n!=1"
            }
        };
    };

    Locale.all = function(){
        return locales;
    };

    Locale.allCodes = function(){
        var keys;
        if (Object.keys){
            keys = Object.keys(locales);
        } else {
            keys = [];
            for (var code in locales){
                keys.push(code);
            }
        }
        return keys;
    };

    locales.ru = {
        name: "Russian",
        localName: "Русский",
        code: "ru_RU",
        pluralForms: [quantity.ZERO, quantity.ONE, quantity.FEW, quantity.OTHER],
        plural: function(n){
            return ( n%10==1 && n%100!=11 ?
                0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2
            );
        }
    };

    locales.en = {
        name: "English",
        localName: "English",
        code: "en_US",
        pluralForms: [quantity.ZERO, quantity.ONE, quantity.OTHER],
        plural: function(n){
            return n != 1;
        }
    };

    locales.es = {
        name: "Spanish",
        localName: "Español",
        code: "es_ES",
        pluralForms: [quantity.ZERO, quantity.ONE, quantity.OTHER],
        plural: function(n){
            return n != 1;
        }
    };

    locales.de = {
        name: "Deutch",
        localName: "Deutch",
        code: "de_DE",
        pluralForms: [quantity.ZERO, quantity.ONE, quantity.OTHER],
        plural: function(n) {
            return n != 1;
        }
    };

    locales.fr = {
        name: "French",
        localName: "Français",
        code: "fr_FR",
        pluralForms: [quantity.ZERO, quantity.ONE, quantity.OTHER],
        plural: function(n){
            return n > 1;
        }
    };

    locales.it = {
        name: "Italian",
        localName: "Italiano",
        code: "it_IT",
        pluralForms: [quantity.ZERO, quantity.ONE, quantity.OTHER],
        plural: function(n){
            return n != 1;
        }
    };

    locales.tr = {
        name: "Turkish",
        localName: "Türk",
        code: "tr_TR",
        pluralForms: [quantity.ZERO, quantity.ONE, quantity.OTHER],
        plural: function(n){
            return n > 1;
        }
    };

    locales.ko = {
        name: "Korean",
        localName: "한국의",
        code: "ko_KR",
        pluralForms: [quantity.ZERO, quantity.OTHER],
        plural: function(n){
            return 0;
        }
    };

    locales.sv = {
        name: "Swedish",
        localName: "Svenska",
        code: "sv_SE",
        pluralForms: [quantity.ZERO, quantity.ONE, quantity.OTHER],
        plural: function(n){
            return n != 1;
        }
    };

    locales.pt = {
        name: "Portuguese",
        localName: "Português",
        code: "pt_PT",
        pluralForms: [quantity.ZERO, quantity.ONE, quantity.OTHER],
        plural: function(n){
            return n != 1;
        }
    };

    locales.et = {
        name: "Estonian",
        localName: "Eesti",
        code: "et_EE",
        pluralForms: [quantity.ZERO, quantity.ONE, quantity.OTHER],
        plural: function(n){
            return n != 1;
        }
    };

    locales.lt = {
        name: "Lithuanian",
        localName: "Lietuvos",
        code: "lt_LT",
        pluralForms: [quantity.ZERO, quantity.ONE, quantity.FEW, quantity.OTHER],
        plural: function(n){
            return ( n%10==1 && n%100!=11 ?
                0 : n%10>=2 && (n%100<10 || n%100>=20) ? 1 : 2
            );
        }
    };

    locales.el = {
        name: "Greek",
        localName: "ελληνικά",
        code: "el_GR",
        pluralForms: [quantity.ZERO, quantity.ONE, quantity.OTHER],
        plural: function(n){
            return n!=1;
        }
    };

    locales.pl = {
        name: "Polish",
        localName: "Polski",
        code: "pl_PL",
        pluralForms: [quantity.ZERO, quantity.ONE, quantity.FEW, quantity.OTHER],
        plural: function(n){
            return ( n==1 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2);
        }
    };

    locales.id = {
        name: "Indonesian",
        localName: "Indonesia",
        code: "id_ID",
        pluralForms: [quantity.ZERO, quantity.ONE],
        plural: function(n){
            return 0;
        }
    };

    locales.sr = {
        name: "Serbian",
        localName: "Српски",
        code: "sr_RS",
        pluralForms: [quantity.ZERO, quantity.ONE, quantity.FEW, quantity.OTHER],
        plural: function(n){
            return ( n%10==1 && n%100!=11 ?
                0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2
            );
        }
    };

    locales.ro = {
        name: "Romanian",
        localName: "Român",
        code: "ro_RO",
        pluralForms: [quantity.ZERO, quantity.ONE, quantity.FEW, quantity.OTHER],
        plural: function(n){
            return (n==1 ? 0 : (n===0 || (n%100 > 0 && n%100 < 20)) ? 1 : 2);
        }
    };

    locales.hu = {
        name: "Hungarian",
        localName: "Magyar",
        code: "hu_HU",
        pluralForms: [quantity.ZERO, quantity.ONE, quantity.OTHER],
        plural: function(n){
            return n!=1;
        }
    };

    locales.be = {
        name: "Belarusian",
        localName: "Беларускі",
        code: "be_BE",
        pluralForms: [quantity.ZERO, quantity.ONE, quantity.FEW, quantity.OTHER],
        plural: function(n){
            return ( n%10==1 && n%100!=11 ?
                0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2
            );
        }
    };

    locales.uk = {
        name: "Ukrainian",
        localName: "Українська",
        code: "uk_UA",
        pluralForms: [quantity.ZERO, quantity.ONE, quantity.FEW, quantity.OTHER],
        plural: function(n){
            return ( n%10==1 && n%100!=11 ?
                0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2
            );
        }
    };

    locales.cs = {
        name: "Czech",
        localName: "Česká",
        code: "cs_CZ",
        pluralForms: [quantity.ZERO, quantity.ONE, quantity.FEW, quantity.OTHER],
        plural: function(n){
            return (n==1) ? 0 : (n>=2 && n<=4) ? 1 : 2;
        }
    };

    locales.zh = {
        name: "Chinese",
        localName: "中国的",
        code: "zh_CN",
        pluralForms: [quantity.ZERO, quantity.OTHER],
        plural: function(n){
            return 0;
        }
    };

    return Locale;
})();
