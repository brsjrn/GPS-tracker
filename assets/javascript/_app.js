import { createElement, createModal } from "./fonctions/dom.js";
import Track from "./composants/track.js";
import Map from "./composants/map.js";

// -----------
// Geolocation
// -----------

// --- Variables

// Globals
export let listTracks = []

// var newMap
// navigator.geolocation.getCurrentPosition(position => {
//     const { latitude, longitude } = position.coords

//     newMap = new Map('mapTest', position, 19)
//     newMap.displayMap()
//     newMap.addMarker(position)

//     watchGPS()
// }, () => {}, {
//     enableHighAccuracy: true,
//     timeout: 5000,
//     maximumAge: 0,
// });

// function watchGPS() {
//     navigator.geolocation.watchPosition(position => {
//         console.log("Watch position")
//         newMap.addMarker(position)
//     }, () => {}, {
//         enableHighAccuracy: true,
//         timeout: 5000,
//         maximumAge: 0,
//     });
// }

/**
 * @type Track
 */
let currentTrack

const voyage = document.querySelector("#track")
const formNewTrack = document.querySelector("#formNewTrack")

// const modals = document.querySelector("#modals")
// let newModal = createModal('staticBackdrop', "MA MODALE", "Hello :)")
// modals.append(newModal)

// Nouveau voyage
formNewTrack.addEventListener("submit", function (e) {
    e.preventDefault()

    // Affiche le nouveau voyage
    voyage.hidden = false;

    // Récupère le titre du voyage
    const title = new FormData(e.currentTarget).get('title').toString()
    // Reset form
    e.currentTarget.reset()

    // Crée un nouveau voyage & l'enregistre comme voyage courant
    const track = new Track(title)
    currentTrack = track

    // Rend la vue voyage
    track.renderTrack(voyage)
})

export function addHistoryTrack(track) {
    // le rajouter à l'historique des voyages
    listTracks.push(track)

    // Ajoute une ligne au tableau d'historique
    const newHistoryRow = document.querySelector("#history").querySelector("tbody").insertRow(0);

    const newCellDate = newHistoryRow.insertCell();
    const newCellTitle = newHistoryRow.insertCell();
    const newCellStatus = newHistoryRow.insertCell();

    let newDateBadge = createElement('span', {
        class: 'badge bg-secondary',
    })
    newDateBadge.innerHTML = track.getDate();
    newCellDate.appendChild(newDateBadge)

    newCellTitle.appendChild(document.createTextNode(track.getTitle()))
    newCellStatus.appendChild(document.createTextNode(track.getDistance()))
}