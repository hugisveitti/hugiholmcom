export const randomInt = (max) => {
    return Math.floor(Math.random() * max);
}

export const getRandomItem = (arr) => {
    return arr[randomInt(arr.length)];
}

export const shuffle = (arr) => {
    const n = arr.length
    for (let i = 0; i < n * 20; i++) {
        let r1 = randomInt(n)
        let r2 = randomInt(n)
        const temp = arr[r1];
        arr[r1] = arr[r2]
        arr[r2] = temp
    }
}

export const itemInArray = (item, arr) => {
    for (let a of arr) {
        if (a === item) return true
    }
    return false
}

export const saveLocalBestScore = (gameType, score) => {
    const key = getKeyFromGameType(gameType)
    const oldBest = getLocalBestScore(gameType)

    if (score > oldBest) {
        window.localStorage.setItem(key, score)
        return true
    }
    return false
}

export const getLocalBestScore = (gameType) => {
    const key = getKeyFromGameType(gameType)

    return window.localStorage.getItem(key) ?? 0
}

const allBirdData = require("../data.json");
const allPlantData = require("../plantdata.json");
const allGeoData = require("../geodata.json");

const copyJson = (j) => {
    return JSON.parse(JSON.stringify(j));
};

/**
 * 
 * @param {"river" | "town" | "lake" | "fjord" | "glacier"} cate 
 * @returns 
 */
export const getGeoQuestionFromCategory = (cate) => {
    console.log("cate", cate)
    switch (cate) {
        case "river":
            return "á"
        case "lake":
            return "stöðuvatn"
        case "glacier":
            return "jökull"
        case "fjord":
            return "fjörður eða flói"
        case "town":
            return "bær"

        default:
            return cate
    }
}

/**
 * 
 * @param {string} str string to capitalize
 */
export const capitalize = (str) => {
    str = str.toLowerCase()
    let f = str.substring(0, 1)
    let rest = str.substring(1)
    return f.toUpperCase() + rest
}

/**
 * 
 * @param {"bird" | "plant" | "geo"} gameType 
 * @returns 
 */
export const getDataFromGameType = (gameType) => {
    switch (gameType) {
        case "bird":
            return copyJson(allBirdData)
        case "plant":
            return copyJson(allPlantData);
        case "geo":
            return copyJson(allGeoData)
        default:
            return copyJson(allGeoData);
    }
}

/**
 * 
 * @param {"bird" | "plant" | "geo"} gameType 
 * @returns 
 */
export const getKeyFromGameType = (gameType) => {
    switch (gameType) {
        case "bird":
            return "bestBirdScore"
        case "plant":
            return "bestPlantScore"
        case "geo":
            return "bestGeoScore"
        default:
            return "óþekktur"
    }
}

/**
 * 
 * @param {"bird" | "plant" | "geo"} gameType 
 * @returns 
 */
export const getTitleFromGameType = (gameType) => {
    switch (gameType) {
        case "bird":
            return "fugla"
        case "plant":
            return "plöntu"
        case "geo":
            return "landafræði"
        default:
            return "óþekktur"
    }
}


const plantCategories = {
    'Tracheophyta': {
        'Magnoliopsida': ['Asteraceae',
            'Lamiaceae',
            'Rosaceae',
            'Ericaceae',
            'Apiaceae',
            'Fabaceae',
            'Brassicaceae',
            'Caryophyllaceae',
            'Plumbaginaceae',
            'Amaranthaceae',
            'Orobanchaceae',
            'Ranunculaceae',
            'Betulaceae',
            'Polygonaceae',
            'Plantaginaceae',
            'Campanulaceae',
            'Diapensiaceae',
            'Droseraceae',
            'Onagraceae',
            'Gentianaceae',
            'Rubiaceae',
            'Geraniaceae',
            'Primulaceae',
            'Araliaceae',
            'Caprifoliaceae',
            'Scrophulariaceae',
            'Linaceae',
            'Menyanthaceae',
            'Boraginaceae',
            'Montiaceae',
            'Haloragaceae',
            'Oxalidaceae',
            'Papaveraceae',
            'Celastraceae',
            'Lentibulariaceae',
            'Salicaceae',
            'Crassulaceae',
            'Saxifragaceae',
            'Urticaceae',
            'Violaceae'],
        'Liliopsida': ['Poaceae',
            'Amaryllidaceae',
            'Cyperaceae',
            'Orchidaceae',
            'Juncaceae',
            'Melanthiaceae',
            'Potamogetonaceae',
            'Ruppiaceae',
            'Typhaceae',
            'Tofieldiaceae',
            'Juncaginaceae',
            'Zosteraceae'],
        'Polypodiopsida': ['Aspleniaceae',
            'Athyriaceae',
            'Blechnaceae',
            'Dryopteridaceae',
            'Pteridaceae',
            'Cystopteridaceae',
            'Hymenophyllaceae',
            'Thelypteridaceae',
            'Polypodiaceae',
            'Woodsiaceae'],
        'Psilotopsida': ['Ophioglossaceae'],
        'Lycopodiopsida': ['Lycopodiaceae', 'Isoetaceae', 'Selaginellaceae'],
        'Equisetopsida': ['Equisetaceae'],
        'Pinopsida': ['Cupressaceae', 'Pinaceae']
    },
    'Bryophyta': {
        'Andreaeopsida': ['Andreaea rupestris'],
        'Bryopsida': ['Aulacomnium palustre',
            'Bartramia ithyphylla',
            'Brachythecium rivulare',
            'Bryum argenteum',
            'Calliergonella cuspidata',
            'Climacium dendroides',
            'Conostomum tetragonum',
            'Dicranoweisia crispula',
            'Distichium capillaceum',
            'Encalypta rhaptocarpa',
            'Fontinalis antipyretica',
            'Grimmia torquata',
            'Homalothecium sericeum',
            'Hylocomium splendens',
            'Hypnum revolutum',
            'Kiaeria falcata',
            'Kiaeria starkei',
            'Lescuraea radicosa',
            'Philonotis fontana',
            'Pohlia cruda',
            'Pohlia wahlenbergii',
            'Racomitrium aciculare',
            'Racomitrium canescens',
            'Racomitrium ericoides',
            'Racomitrium lanuginosum',
            'Rhizomnium magnifolium',
            'Rhytidiadelphus loreus',
            'Rhytidiadelphus squarrosus',
            'Rhytidiadelphus triquetrus',
            'Rhytidium rugosum',
            'Sanionia uncinata',
            'Schistidium maritimum',
            'Scorpidium revolvens',
            'Scorpidium scorpioides',
            'Splachnum vasculosum',
            'Syntrichia ruralis',
            'Timmia austriaca',
            'Tomentypnum nitens',
            'Tortella tortuosa',
            'Tortula subulata'],
        'Polytrichopsida': ['Polytrichum commune',
            'Polytrichum juniperinum',
            'Polytrichum piliferum',
            'Polytrichum sexangulare'],
        'Sphagnopsida': ['Sphagnum teres', 'Sphagnum warnstorfii']
    },
    'Marchantiophyta': {
        'Marchantiopsida': ['Anthelia juratzkana',
            'Gymnomitrion corallioides',
            'Marchantia polymorpha',
            'Preissia quadrata',
            'Ptilidium ciliare',
            'Scapania undulata']
    }
}