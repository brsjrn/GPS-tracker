import { createElement, createModal } from "../fonctions/dom.js"
import { addHistoryTrack } from "../_app.js"
import { aroundDistance, convertKmToM } from "../fonctions/utils.js"
import { fraisKilometriques } from "../_app.js"

import Map from "./map.js"

export default class Track {

    #distance = 0
    #positions = []
    #title
    #watchId
    #status // 0: pause 1: started - 2: ended
    #date

    // --- UI

    // Buttons
    #btnStart
    #btnPause
    #btnEnd
    #btnReset
    #btnCancel
    #btnPosition

    // Elements
    #tBodyPositionHistory
    #map

    // Modals
    // #modalCancel
    // #modalEnd
    // #modalReset

    // Values
    #valueDistance
    #valuePosition
    #valuePositionActuelle

    // Const
    #PauseText = "Pause"
    #attenteText = "En attente ..."
    #distancePrecision = 0.5
    #durationCalibrage = 5 // 10 sec

    // Varialbes
    #lastLatitude
    #lastLongitude
    #isCalibrate = false

    constructor(title) {
        if (title == "") {
            this.#title = "Sans nom"
        } else {
            this.#title = title
        }

        this.#status = 1

        let newDate = new Date()
        this.#date = newDate.getFullYear() + "/" + newDate.getMonth() + "/" + newDate.getDate()

        this.#lastLatitude = 0
        this.#lastLongitude = 0

        this.initMap()
    }

    // Initialise la carte avec un 1er appel de position
    initMap() {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords

            this.#map = new Map('mapTrack', position, 19)
            this.#map.displayMap()
        }, () => { }, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        });
    }

    /**
     * @returns Number
     */
    getDistance() {
        return this.#distance
    }

    /**
     * 
     * @returns String
     */
    getTitle() {
        return this.#title
    }

    getStatus() {
        return this.#status
    }

    getDate() {
        return this.#date
    }

    getPrice() {
        return this.#distance * fraisKilometriques
    }

    clearTrack() {
        navigator.geolocation.clearWatch(this.#watchId)
        this.#status = 0
        this.#isCalibrate = false
    }

    end() {
        this.clearTrack()
        this.#status = 2
        // Update history view
        addHistoryTrack(this)
    }

    /* DOM */

    /**
     * 
     * @param {HTMLElement} element 
     */
    renderTrack(element) {
        element.innerHTML = `
        <div id="track-top" class="bg-light">
            <h1 class="track__title">${this.#title}</h1>
            <div class="track__date fs-5"><span class="badge bg-secondary">${this.#date}</span></div>

            <div id="buttons" class="btn-group" role="group">
                <button id="btnReset" class="btn btn-warning">Reset</button>
                <button id="btnCancel" class="btn btn-secondary">Annuler</button>
                <button id="btnEnd" class="btn btn-danger">Terminer</button>
                <button id="btnPause" class="btn btn-info" hidden>Pause</button>
                <button id="btnStart" class="btn btn-success">Start</button>
                <!-- <button id="btnPosition" class="btn btn-primary">Position actuelle</button> -->
                <!-- Button trigger modal -->
            </div>
        </div>
        

        <div id="resuts">
            <div id="resultColumns">

                <!-- Distance totale -->
                <section id="distanceTotale" class="container">
                    <div class="card">
                        <div class="card-header">
                            Distance totale parcourue
                        </div>
                        <div class="card-body">
                            <h5 id="valueDistance" class="card-title">${this.#attenteText}</h5>
                        </div>
                    </div>
                </section>

                <!-- Map -->
                <div id="mapTrack" class="container"></div>

                <!-- Position actuelle -->
                <!-- <section id="positionActuelle" class="container">
                    <div class="card">
                        <div class="card-header">
                            Position actuelle
                        </div>
                        <div class="card-body">
                            <h5 id="valuePositionActuelle" class="card-title">${this.#attenteText}</h5>
                        </div>
                    </div>
                </section> -->

                <!-- Historique des positions -->
                <section id="positionHistory" class="container">
                    <div class="card">
                        <div class="card-header">
                        Historique des positions
                        </div>
                        <div class="card-body">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Timestamp</th>
                                        <th>Distance</th>
                                        <th>Position</th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
        </div>
        
        <!-- Modal -->
        <!-- <div id="trackModals"></div> -->
        `

        // const modals = element.querySelector("#trackModals")
        // this.#modalCancel = createModal('staticBackdrop', "MA MODALE", "Hello :)")
        // modals.innerHTML = "plop"
        // modals.append(this.#modalCancel)

        // -------------------
        //  Init UI elements
        // -------------------

        // Buttons
        this.#btnStart = element.querySelector("#btnStart")
        this.#btnPause = element.querySelector("#btnPause")
        this.#btnEnd = element.querySelector("#btnEnd")
        this.#btnReset = element.querySelector("#btnReset")
        this.#btnCancel = element.querySelector("#btnCancel")
        this.#btnPosition = element.querySelector("#btnPosition")

        // Elements
        this.#tBodyPositionHistory = element.querySelector("#positionHistory").querySelector("tbody")

        // Values
        this.#valueDistance = element.querySelector("#valueDistance")
        this.#valuePositionActuelle = element.querySelector("#valuePositionActuelle")

        // -------------------
        //  Event listeners
        // -------------------

        // Position actuelle
        // this.#btnPosition.addEventListener('click', () => {

        //     // Call geolocation API
        //     navigator.geolocation.getCurrentPosition(position => {
        //         const { latitude, longitude } = position.coords

        //         this.#valuePositionActuelle.innerHTML = latitude + ", " + longitude
        //     }, this.errorCurrent, {
        //         enableHighAccuracy: true,
        //         timeout: 5000,
        //         maximumAge: 0,
        //     });
        // })

        // Start voyage
        this.#btnStart.addEventListener('click', () => {
            // Hide start button
            this.#btnStart.hidden = true

            // Display stop button
            this.#btnPause.hidden = false

            // Démarre le time de calibrage
            this.startTimer()

            // Call geolocation API
            this.#watchId = navigator.geolocation.watchPosition(position => {
                const { latitude, longitude } = position.coords

                if (this.#isCalibrate) {
                    if ((this.#lastLatitude != latitude) || (this.#lastLongitude != longitude) || (this.#status == 0)) {
                        this.#lastLatitude = latitude
                        this.#lastLongitude = longitude

                        // Change status
                        this.#status = 1

                        this.appendPosition(position);
                    }
                }
            }, this.errorWatch, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
            });
        })

        // Pause voyage
        this.#btnPause.addEventListener("click", () => {
            // Clear previous watch
            this.clearTrack()

            // Hide pause button
            this.#btnPause.hidden = true

            // Display start button
            this.#btnStart.hidden = false

            this.addHistoryEntry(this.#PauseText, this.#PauseText, this.#PauseText)
        });

        // Terminer voyage
        this.#btnEnd.addEventListener("click", () => {
            // End watch
            this.end()

            document.querySelector("#track").hidden = true
        })

        // Reset Track
        // Reset datas positions
        this.#btnReset.addEventListener("click", () => {
            if (confirm("Êtes-vous sûr de vouloir réinitialiser ce voyage ?")) {
                // Reset positions
                this.resetPositions()

                // Reset buttons
                this.resetButtons()

                // Reset history table
                this.resetHistoryTable()

                // Reset distance totale
                this.resetDistance()

                // Reset position actuelle
                this.#valuePositionActuelle.innerHTML = this.#attenteText

                // Reset watch
                this.clearTrack()
            }
        })

        // Cancel
        this.#btnCancel.addEventListener("click", () => {
            // Clear watch position
            this.clearTrack()
            document.querySelector("#track").hidden = true
        })
    }

    // Error function watchPosition
    errorCurrent(err) {
        console.error(`[Current] ERROR(${err.code}): ${err.message}`);
    }

    errorWatch(err) {
        console.error(`[Watch] ERROR(${err.code}): ${err.message}`);
    }

    resetButtons() {
        // Hide start button
        this.#btnStart.hidden = false

        // Display stop button
        this.#btnPause.hidden = true
    }

    resetHistoryTable() {
        this.#tBodyPositionHistory.innerHTML = null
    }

    resetDistance() {
        this.#distance = 0
        this.#valueDistance.innerHTML = this.#attenteText
    }

    resetPositions() {
        this.#positions = []
    }

    updateDistance() {
        let unit = "km"

        let distanceToDisplay = this.#distance

        // Si < 1km alors on affiche en mètres
        if (distanceToDisplay < 1) {
            unit = "m"
            distanceToDisplay = convertKmToM(aroundDistance('m', this.#distance))
        }

        // distanceTotaleValue.innerHTML = (Math.round((distanceToDisplay + Number.EPSILON) * 100) / 100) + unit;
        this.#valueDistance.innerHTML = distanceToDisplay + unit
    }

    appendPosition(position) {
        // Calculate distance from last position if available
        let lastPos = this.#positions[this.#positions.length - 1]
        let lastDistance = 0

        if (lastPos) {
            lastDistance = this.calculateDistance(lastPos.coords, position.coords)
        }

        // On tient compte de la nouvelle distance parcouru si celle-ci est supérieur à la précision en mètre
        if (convertKmToM(aroundDistance('dm', lastDistance)) > this.#distancePrecision) {
            this.#distance += lastDistance
            
            // Add position on map
            this.#map.addMarker(position)

            // Update totale distance
            this.updateDistance();

            // Ajoute à l'historique du voyage
            this.addHistoryEntry(position.coords.latitude, position.coords.longitude, lastDistance)
        }

        this.#positions.push(position)

        return lastDistance

        // Call custom callback
        // if(watchCallback) {
        //     watchCallback(position, distance, watchID);
        // }
    }

    calculateDistance(fromPos, toPos) {
        let radius = 6371
        let toRad = function (number) {
            return number * Math.PI / 180
        }

        let latDistance = toRad(toPos.latitude - fromPos.latitude)
        let lonDistance = toRad(toPos.longitude - fromPos.longitude)

        let a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2) +
            Math.cos(toRad(fromPos.latitude)) * Math.cos(toRad(toPos.latitude)) *
            Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);

        return radius * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))
    }

    addHistoryEntry(latitude, longitude, lastDistance) {

        let newRow = this.#tBodyPositionHistory.insertRow(0);

        let newCellTimestamp = newRow.insertCell()
        let newCellDistance = newRow.insertCell()
        let newCellPosition = newRow.insertCell()

        let newDate = new Date()
        let displayDate = newDate.getDate() + "/" + newDate.getMonth() + "/" + newDate.getFullYear() + "<br />" + newDate.getHours() + "h" + newDate.getMinutes() + "m" + newDate.getSeconds() + "s"
        let newTextTimestamp = createElement('span', {
            class: 'badge bg-secondary',
        })

        newTextTimestamp.innerHTML = displayDate;
        newCellTimestamp.appendChild(newTextTimestamp)

        let newTextDistance = document.createTextNode(convertKmToM(aroundDistance('dm', lastDistance)) + "m")
        newCellDistance.appendChild(newTextDistance)

        let newTextPosition = document.createTextNode(latitude + ", " + longitude)
        newCellPosition.appendChild(newTextPosition)
    }

    startTimer() {
        let timerLeft = this.#durationCalibrage

        this.#valueDistance.innerHTML = "Calibrage GPS en cours ..."
        
        let waitingTimer = setInterval(() => {
            timerLeft -= 1;
            if (timerLeft <= 0) {
                clearInterval(waitingTimer);
                this.#isCalibrate = true

                console.log("GPS calibré !")
            } else {
                console.log("Calibrage GPS en cours ...")
            }
        }, 1000);
    }

}