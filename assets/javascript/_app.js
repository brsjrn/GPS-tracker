// -----------
// Geolocation
// -----------

// --- Get UI elements
let getCurrentPositionButton = document.getElementById("getCurrentPositionButton");
let startWatchPositionButton = document.getElementById("startWatchPositionButton");
let stopWatchPositionButton = document.getElementById("stopWatchPositionButton");
let resetPositionButton = document.getElementById("resetPositionButton");
let currentLatitude = document.getElementById("currentLatitudeValue");
let currentLongitude = document.getElementById("currentLongitudeValue");
let historyPositionTBody = document.getElementById('historyPosition').getElementsByTagName('tbody')[0];
let distanceTotaleValue = document.getElementById("distanceTotaleValue");

// --- Variables
let watchId;
let coords = [];
let distance = 0;

// --- Buttons triggers

// Get current position
getCurrentPositionButton.addEventListener("click", function (e) {
    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        updateCurrentPosition(latitude, longitude);

        appendPosition(position);

        // console.log("Position : "+ calculateDistance(position, position));
    });
});

// Start watch position
startWatchPositionButton.addEventListener("click", function (e) {

    console.log("[START] Watch position");

    // Hide start button
    startWatchPositionButton.hidden = true;

    // Display stop button
    stopWatchPositionButton.hidden = false;

    // Call geolocation API
    watchId = navigator.geolocation.watchPosition(position => {
        const { latitude, longitude } = position.coords;

        appendPosition(position);

        updateCurrentPosition(latitude, longitude);

        addHistoryEntry(latitude, longitude);
    });
});

// Stop watch position
stopWatchPositionButton.addEventListener("click", function () {
    console.log("[STOP]");

    // Hide stop button
    stopWatchPositionButton.hidden = true;

    // Display start button
    startWatchPositionButton.hidden = false;

    // Clear watch position
    navigator.geolocation.clearWatch(watchId);

    updateCurrentPosition("stop", "stop");
    addHistoryEntry("stop", "stop", "stop");
});

// Reset datas positions
resetPositionButton.addEventListener("click", function () {
    // Clear watch position
    navigator.geolocation.clearWatch(watchId);

    // Reset buttons
    resetButtons();

    // Update current position
    updateCurrentPosition("", "")

    // Reset history table
    resetHistoryTable();
})

// --- UI datas
function updateDistanceTotale(val) {

    let distanceToDisplay = val;
    let unit = "km";

    if(val < 1) {
        distanceToDisplay = convertKmToM(val);
        unit = "m";
    }

    distanceTotaleValue.innerHTML = distanceToDisplay + unit;
}

function updateCurrentPosition(latitude, longitude) {
    currentLongitude.innerHTML = longitude;
    currentLatitude.innerHTML = latitude;
}

function addHistoryEntry(latitude, longitude) {

    let newRow = historyPositionTBody.insertRow(0);

    let newCellTimestamp = newRow.insertCell();
    let newCellLatitude = newRow.insertCell();
    let newCellLongitude = newRow.insertCell();

    let newDate = new Date();
    let displayDate = newDate.getDate() + "/" + newDate.getMonth() + "/" + newDate.getFullYear() + " - " + newDate.getHours() + "h" + newDate.getMinutes() + "m" + newDate.getSeconds() + "s" + newDate.getMilliseconds() + "ms";
    let newTextTimestamp = document.createTextNode(displayDate);
    newCellTimestamp.appendChild(newTextTimestamp);

    let newTextLatitude = document.createTextNode(latitude);
    newCellLatitude.appendChild(newTextLatitude);

    let newTextLongitude = document.createTextNode(longitude);
    newCellLongitude.appendChild(newTextLongitude);
}

function resetHistoryTable() {
    let new_tbody = document.createElement('tbody');

    // historyPositionTBody.parentNode.replaceChild(new_tbody, historyPositionTBody);
    historyPositionTBody.innerHTML = null;
}

function resetButtons() {
    // Hide start button
    startWatchPositionButton.hidden = false;

    // Display stop button
    stopWatchPositionButton.hidden = true;
}

// --- GPS datas
// Calcule la distance entre 2 positions
function calculateDistance(fromPos, toPos) {
    let radius = 6371;
    let toRad = function (number) {
        return number * Math.PI / 180;
    };

    let latDistance = toRad(toPos.latitude - fromPos.latitude);
    let lonDistance = toRad(toPos.longitude - fromPos.longitude);

    let a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2) +
        Math.cos(toRad(fromPos.latitude)) * Math.cos(toRad(toPos.latitude)) *
        Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);

    return radius * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function appendPosition(position) {
    // Calculate distance from last position if available
    let lastPos = coords[coords.length - 1];
    if (lastPos) {
        distance += calculateDistance(lastPos, position.coords);
    }

    // Add new coordinates to array
    coords.unshift(position.coords);

    updateDistanceTotale(distance);

    // Call custom callback
    // if(watchCallback) {
    //     watchCallback(position, distance, watchID);
    // }
}

// --- Utils
function convertKmToM(val) {
    return (val / 1000);
}