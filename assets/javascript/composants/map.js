// import { map } from "../_app";

export default class Map {

    #map
    #mapId
    #originCoords = {
        latitude: 0,
        longitude: 0
    }
    #zoom = 2

    constructor(mapId, position, zoom) {
        this.#mapId = mapId
        this.#originCoords = position.coords
        this.#zoom = zoom
    }

    displayMap() {
        this.#map = L.map(this.#mapId, {
            center: [this.#originCoords.latitude, this.#originCoords.longitude],
            zoom: this.#zoom
        });

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.#map);
    }

    addMarker(position) {
        let marker = L.marker([position.coords.latitude, position.coords.longitude]).addTo(this.#map)
        marker.bindPopup(position.coords.latitude +"<br>"+ position.coords.longitude)
    }
}