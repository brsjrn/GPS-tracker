export default class Track {

    #distance = 0
    #positions = []
    #title
    #watchId
    #status

    // --- UI

    // Buttons
    #btnStart
    #btnPause
    #btnEnd
    #btnReset

    // Elements
    #tBodyPositionHistory

    // Values
    #valueDistance
    #valueLatitude
    #valueLongitude

    // Const
    #PauseText = "Pause"

    constructor(title) {
        let currentDate = new Date();
        let titlePrefix = "[" + currentDate.getFullYear() + "/" + currentDate.getMonth() + "/" + currentDate.getDate() + "] ";

        if (title == "") {
            this.#title = titlePrefix + "Sans nom"
        } else {
            this.#title = titlePrefix + title
        }

        this.#status = 1

        // Création de l'interface
        // this.#btnStart = createElement(div, {
        //     id: "buttonStartWatch"
        // })
        // this.#btnStart.innerHTML = "Start"

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

    end() {
        navigator.geolocation.clearWatch(this.#watchId)
        this.#status = 2
    }

    displayDistanceValue() {
        console.log("Dostance : " + distance);
    }

    /* DOM */

    /**
     * 
     * @param {HTMLElement} element 
     */
    renderTrack(element) {
        element.innerHTML = `<h2 class="title">${this.#title}</h2>
        <div id="buttons">
            <button id="btnReset">Reset</button>
            <button id="btnEnd">Terminer</button>
            <button id="btnStart">Start</button>
            <button id="btnPause" hidden>Pause</button>
        </div>

        <div id="resuts">
            <h2>Résultats</h2>
            <div id="resultColumns">

                <!-- Distance totale -->
                <section id="distanceTotale">
                    <h3>Distance totale parcourue</h3>
                    <div id="valueDistance">-</div>
                </section>

                <!-- Historique des positions -->
                <section id="positionHistory">
                    <h3>Historique des positions</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>Latitude</th>
                                <th>Longitude</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </section>
            </div>
        </div>`

        // -------------------
        //  Init UI elements
        // -------------------

        // Buttons
        this.#btnStart = element.querySelector("#btnStart")
        this.#btnPause = element.querySelector("#btnPause")
        this.#btnEnd = element.querySelector("#btnEnd")
        this.#btnReset = element.querySelector("#btnReset")

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
            console.log("[START] Watch position");

            // Hide start button
            this.#btnStart.hidden = true;

            // Display stop button
            this.#btnPause.hidden = false;

            // Call geolocation API
            this.#watchId = navigator.geolocation.watchPosition(position => {
                const { latitude, longitude } = position.coords;

                this.appendPosition(position);

                this.addHistoryEntry(latitude, longitude);
            });
        })

        // Pause voyage
        this.#btnPause.addEventListener("click", () => {
            console.log("[Pause]");

            // Hide pause button
            this.#btnPause.hidden = true;

            // Display start button
            this.#btnStart.hidden = false;

            this.addHistoryEntry(this.#PauseText, this.#PauseText, this.#PauseText);
        });

        // Terminer voyage
        this.#btnEnd.addEventListener("click", () => {
            console.log("[END]")

            // End watch
            this.end()

            document.querySelector("#voyage").hidden = true
        })

        // Reset Track
        // Reset datas positions
        this.#btnReset.addEventListener("click", () => {
            if (confirm("Êtes-vous sûr de vouloir réinitialiser ce voyage ?")) {
                // Clear watch position
                navigator.geolocation.clearWatch(this.#watchId);

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
    }

    resetButtons() {
        // Hide start button
        this.#btnStart.hidden = false;

        // Display stop button
        this.#btnPause.hidden = true;
    }

    resetHistoryTable() {
        this.#tBodyPositionHistory.innerHTML = null;
    }

    resetDistance() {
        this.#distance = 0;
        this.updateDistance();
    }

    resetPositions() {
        this.#positions = []
    }

    updateDistance() {

        let distanceToDisplay = this.#distance;
        let unit = "km";

        // if(distance < 1) {
        //     distanceToDisplay = convertKmToM(distance);
        //     unit = "m";
        // }

        // distanceTotaleValue.innerHTML = (Math.round((distanceToDisplay + Number.EPSILON) * 100) / 100) + unit;
        this.#valueDistance.innerHTML = distanceToDisplay + unit;
    }

    appendPosition(position) {
        console.log(this.#positions)

        // Calculate distance from last position if available
        let lastPos = this.#positions[this.#positions.length - 1];
        if (lastPos) {
            this.#distance += this.calculateDistance(lastPos.coords, position.coords);
        }

        // Add new coordinates to array
        this.#positions.push(position);

        this.updateDistance();

        // Call custom callback
        // if(watchCallback) {
        //     watchCallback(position, distance, watchID);
        // }
    }

    calculateDistance(fromPos, toPos) {
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

    addHistoryEntry(latitude, longitude) {

        let newRow = this.#tBodyPositionHistory.insertRow(0);

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

}