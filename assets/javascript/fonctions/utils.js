// Arrondi à un certain de degré de précision (mètre, décimètre)
export function aroundDistance(precision, value) {
    switch (precision) {
        case 'm':
            // retourne en mètre
            return Math.round(value * 1000) / 1000
            break
        case 'dm':
            return Math.round(value * 10000) / 10000
            break
        default:
            console.log(`${precision} n'est pas une précision prise en compte.`);
    }
}

// Converti des Kilomètres en Mètres
export function convertKmToM(value) {
    return value * 1000
}