console.log(`Map Token: ${mapToken}`);
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: "mapbox://styles/mapbox/streets-v12", // style URL
    center: coordinates, // starting position [lng, lat]
    zoom: 11 // starting zoom
});

// console.log(coordinates);
console.log(location2);
const marker = new mapboxgl.Marker({ color: "red" })
    .setLngLat(coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<h3>${location2}</h3> <p>Exact location provided after booking</p>`))
    .addTo(map);