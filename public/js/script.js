const socket = io();
//checking if the browser supports the geolocation sevice
if (navigator.geolocation) {
    //watching the loaction of user
    // to watchPosition we can offer 3 things i.e. action, error and (action on error), settings
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            // emiting the location using socket.io
            socket.emit('send-location', { latitude, longitude });
        },
        (error) => {
            console.error(error);
        }, {
        // enabling HighAccuracy, reching the position of user every 5sec and stop catcing
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    });
}
const map = L.map("map").setView([0, 0], 16);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Naresh Backend Project"
}).addTo(map)
//creating an empty object marker
const markers = {};
socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;
    map.setView([latitude, longitude]);
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
})
socket.on("User-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})