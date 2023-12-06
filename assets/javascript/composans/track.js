import { createElement } from "../fonctions/dom.js"
import { addHistoryTrack } from "../_app.js"

export default class Track {

    #distance = 0
    #positions = []
    #title
    #watchId
    #status // 1: started - 2: ended
    #date

    // --- UI

    // Buttons
    #btnStart
    #btnPause
    #btnEnd
    #btnReset
    #btnCancel

    // Elements
    #tBodyPositionHistory

    // Values
    #valueDistance
    #valueLatitude
    #valueLongitude

    // Const
    #PauseText = "Pause"

    constructor(title) {
        if (title == "") {
            this.#title = "Sans nom"
        } else {
            this.#title = title
        }

        this.#status = 1

        let newDate = new Date()
        this.#date = newDate.getFullYear() +"/" + newDate.getMonth() +"/"+ newDate.getDate() 
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

    end() {
        console.log("Voyage terminé !")
        navigator.geolocation.clearWatch(this.#watchId)
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
                <!-- Button trigger modal -->
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                    Launch static backdrop modal
                </button>
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
                            <h5 id="valueDistance" class="card-title">En attente ...</h5>
                        </div>
                    </div>
                </section>

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
                                        <th>Latitude</th>
                                        <th>Longitude</th>
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
        <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
            aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="staticBackdropLabel">Modal title</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        ...
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary">Understood</button>
                    </div>
                </div>
            </div>
        </div>
        `

        // -------------------
        //  Init UI elements
        // -------------------

        // Buttons
        this.#btnStart = element.querySelector("#btnStart")
        this.#btnPause = element.querySelector("#btnPause")
        this.#btnEnd = element.querySelector("#btnEnd")
        this.#btnReset = element.querySelector("#btnReset")
        this.#btnCancel = element.querySelector("#btnCancel")

        // Elements
        this.#tBodyPositionHistory = element.querySelector("#positionHistory").querySelector("tbody")

        // Values
        this.#valueDistance = element.querySelector("#valueDistance")
        this.#valueLatitude = element.querySelector("#valueLatitude")
        this.#valueLongitude = element.querySelector("#valueLongitude")

        // -------------------
        //  Event listeners
        // -------------------

        // Start voyage
        this.#btnStart.addEventListener('click', () => {
            // Hide start button
            this.#btnStart.hidden = true

            // Display stop button
            this.#btnPause.hidden = false

            // Call geolocation API
            this.#watchId = navigator.geolocation.watchPosition(position => {
                const { latitude, longitude } = position.coords

                this.appendPosition(position);

                this.addHistoryEntry(latitude, longitude)
            });
        })

        // Pause voyage
        this.#btnPause.addEventListener("click", () => {
            // Clear previous watch
            navigator.geolocation.clearWatch(this.#watchId)

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

            document.querySelector("#voyage").hidden = true
        })

        // Reset Track
        // Reset datas positions
        this.#btnReset.addEventListener("click", () => {
            if (confirm("Êtes-vous sûr de vouloir réinitialiser ce voyage ?")) {
                // Clear watch position
                navigator.geolocation.clearWatch(this.#watchId)

                // Reset positions
                this.resetPositions()

                // Reset buttons
                this.resetButtons()

                // Reset history table
                this.resetHistoryTable()

                // Reset distance totale
                this.resetDistance()
            }
        })

        // Cancel
        this.#btnCancel.addEventListener("click", () => {
            // Clear watch position
            navigator.geolocation.clearWatch(this.#watchId)

            document.querySelector("#voyage").hidden = true
        })
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
        this.updateDistance()
    }

    resetPositions() {
        this.#positions = []
    }

    updateDistance() {

        let distanceToDisplay = this.#distance
        let unit = "km"

        // if(distance < 1) {
        //     distanceToDisplay = convertKmToM(distance);
        //     unit = "m";
        // }

        // distanceTotaleValue.innerHTML = (Math.round((distanceToDisplay + Number.EPSILON) * 100) / 100) + unit;
        this.#valueDistance.innerHTML = distanceToDisplay + unit
    }

    appendPosition(position) {
        // Calculate distance from last position if available
        let lastPos = this.#positions[this.#positions.length - 1]
        if (lastPos) {
            this.#distance += this.calculateDistance(lastPos.coords, position.coords)
        }

        // Add new coordinates to array
        this.#positions.push(position)

        this.updateDistance();

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

    addHistoryEntry(latitude, longitude) {

        let newRow = this.#tBodyPositionHistory.insertRow(0);

        let newCellTimestamp = newRow.insertCell()
        let newCellLatitude = newRow.insertCell()
        let newCellLongitude = newRow.insertCell()

        let newDate = new Date()
        let displayDate = newDate.getDate() + "/" + newDate.getMonth() + "/" + newDate.getFullYear() + " - " + newDate.getHours() + "h" + newDate.getMinutes() + "m" + newDate.getSeconds() + "s" + newDate.getMilliseconds() + "ms"
        let newTextTimestamp = createElement('span', {
            class: 'badge bg-secondary',
        })
        newTextTimestamp.innerHTML = displayDate;
        newCellTimestamp.appendChild(newTextTimestamp)

        let newTextLatitude = document.createTextNode(latitude)
        newCellLatitude.appendChild(newTextLatitude)

        let newTextLongitude = document.createTextNode(longitude)
        newCellLongitude.appendChild(newTextLongitude)
    }

}