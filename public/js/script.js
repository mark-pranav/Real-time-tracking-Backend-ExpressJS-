const socket = io();

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.error(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
}

const map = L.map("map").setView([0, 0], 16);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© Pranav Bobade",
}).addTo(map);

// Marker for the user's position
const markers={};

socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;
  // If a marker for this user already exists, update its position
  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    // Create a new marker for this user and add it to the map
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }
  map.setView([latitude, longitude]);
});


socket.on("user-disconnected" , () => {
        if(markers[id]){
            map.removeLayer(markers[id]);
            delete markers[id];
        }
})