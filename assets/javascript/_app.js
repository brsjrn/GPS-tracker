import Track from "./composans/track.js";

// -----------
// Geolocation
// -----------

// --- Get UI elements
// let getCurrentPositionButton = document.getElementById("getCurrentPositionButton");
// let startWatchPositionButton = document.getElementById("startWatchPositionButton");
// let stopWatchPositionButton = document.getElementById("stopWatchPositionButton");
// let resetPositionButton = document.getElementById("resetPositionButton");
// let currentLatitude = document.getElementById("currentLatitudeValue");
// let currentLongitude = document.getElementById("currentLongitudeValue");
// let historyPositionTBody = document.getElementById('historyPosition').getElementsByTagName('tbody')[0];
// let distanceTotaleValue = document.getElementById("distanceTotaleValue");

// --- Variables
let listTracks = []
/**
 * @type Track
 */
let currentTrack

const voyage = document.querySelector("#track")
const formNewTrack = document.querySelector("#formNewTrack")

// Nouveau voyage
formNewTrack.addEventListener("submit", function (e) {
    e.preventDefault()

    // Clear l'ancien voyage
    if (currentTrack !== undefined) {
        currentTrack.end()
    }

    // Affiche le nouveau voyage
    voyage.hidden = false;

    // Récupère le titre du voyage
    const title = new FormData(e.currentTarget).get('title').toString()
    // Reset form
    e.currentTarget.reset()

    // Crée un nouveau voyage & l'enregistre comme voyage courant
    const track = new Track(title)
    currentTrack = track
    // le rajouter à l'historique des voyages
    listTracks.push(track)
    // Rend la vue voyage
    track.renderTrack(voyage)

    // Met à jour l'historique
    const newHistoryRow = document.querySelector("#history").querySelector("tbody").insertRow(0);

    const newCellTitle = newHistoryRow.insertCell();
    const newCellStatus = newHistoryRow.insertCell();

    newCellTitle.appendChild(document.createTextNode(currentTrack.getTitle()))
    newCellStatus.appendChild(document.createTextNode(currentTrack.getStatus()))
})