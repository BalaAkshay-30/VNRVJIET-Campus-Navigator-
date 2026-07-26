// ===========================================
// VNRVJIET Smart Campus Navigator
// ===========================================

// ==========================
// Create Map
// ==========================

const map = L.map("map").setView([17.538668, 78.385446], 19);

const lightTileLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap Contributors",
    maxZoom: 22
}).addTo(map);

// ==========================
// Buildings
// ==========================

const buildings = {
    "Main Gate": {
        "coords": [17.541547154956778, 78.3867861008402],
        "info": "Main Entrance",
        "type": "gate"
    },
    "Bus Parking": {
        "coords": [17.539150777856058, 78.3863032358324],
        "info": "College Bus Parking",
        "type": "parking"
    },
    "Sports Complex": {
        "coords": [17.54058042393002, 78.38565410940035],
        "info": "Indoor Sports Complex",
        "type": "sports"
    },
    "Management Block": {
        "coords": [17.54110726740397, 78.38602427828117],
        "info": "Management Block",
        "type": "academic"
    },
    "Admin Block": {
        "coords": [17.536506073141094, 78.38491052364165],
        "info": "Administrative Block",
        "type": "academic",
        "departments": ["Examination Branch, Academic Section,\n Administrative Offices, Student Records."]
    },
    "A Block": {
        "coords": [17.53737329519014, 78.38481725071168],
        "info": "Academic Block A",
        "type": "academic",
        "departments": ["Information Technology (IT)", "Electronics & Instrumentation Engineering (EIE)"]
    },
    "B Block": {
        "coords": [17.537672527304895, 78.3848494460025],
        "info": "Academic Block B",
        "type": "academic",
        "departments": ["Electronics & Communication Engineering (ECE)", "Student Service Centre (Ground Floor)"]
    },
    "C Block": {
        "coords": [17.537915493188617, 78.38506401555891],
        "info": "Academic Block C",
        "type": "academic",
        "departments": ["Library, Electrical & Electronics Engineering (EEE), Seminar Halls, Auditorium"]
    },
    "Canteen": {
        "coords": [17.538365085908858, 78.38479484963928],
        "info": "Student Canteen",
        "type": "canteen"
    },
    "E Block": {
        "coords": [17.5372, 78.38535],
        "info": "CSE Departments",
        "type": "academic",
        "departments": ["Computer Science & Engineering (CSE),\n CSE (AI & ML, IOT and Robotics & AI)\n, CSE (Cyber Security, Data Science) and AI & DS,\nComputer Science & Business Systems (CSBS)"]
    },
    "D Block": {
        "coords": [17.53665302604159, 78.3850534160283],
        "info": "D Block",
        "type": "academic",
        "departments": ["Civil Engineering (CE)", "Mechanical Engineering (ME)", "Automobile Engineering (AE)"]
    },
    "PG Block": {
        "coords": [17.536855498746466, 78.38434211839447],
        "info": "Post Graduate Block",
        "type": "academic"
    },
    "Rattaiah Square ": {
        "coords": [17.537450021420497, 78.38472874128101],
        "info": "Hangout place ",
        "type": "other"
    },
    "Panda Punaiah Square": {
        "coords": [17.537956413726477, 78.38505866084803],
        "info": "Hangout spot",
        "type": "other"
    },
    "Mens Basketball Court": {
        "coords": [17.538626486219894, 78.38527324496515],
        "info": "Outdoor basketball court",
        "type": "sports"
    },
    "Play ground ": {
        "coords": [17.53962050782601, 78.38545280575003],
        "info": "Open playground for sports and events",
        "type": "sports"
    },
    "Student Parking": {
        "coords": [17.540203619134296, 78.38584444201008],
        "info": "Parking area for students",
        "type": "parking"
    },
    "PEB Block": {
        "coords": [17.540786728566868, 78.38642921396007],
        "info": "PEB (Physical Education Block) academic building",
        "type": "academic"
    },
    "Library": {
        "coords": [17.538171246398676, 78.3848816253459],
        "info": "Central library",
        "type": "academic"
    }
};

const junctions = {
    "J1": [17.541339998742213, 78.38678332193798],
    "J2": [17.540751776101697, 78.3867135636472],
    "J3": [17.54027352411319, 78.38663041591646],
    "J4": [17.541396263416505, 78.38633269025355],
    "J5": [17.54109447995914, 78.38628709177581],
    "J6": [17.540738988631794, 78.38624963376088],
    "J7": [17.540800368479115, 78.38577748269464],
    "J8": [17.540593211411107, 78.38564600013908],
    "J9": [17.54020958658595, 78.38616636532878],
    "J10": [17.540114959004267, 78.3865580385685],
    "J11": [17.539941048725307, 78.38650711103448],
    "J12": [17.539869438561933, 78.38646958599398],
    "J13": [17.53951905985483, 78.38613697543533],
    "J14": [17.53917891053513, 78.38574794603828],
    "J15": [17.538918043707156, 78.3854234246332],
    "J16": [17.53828122016807, 78.38519812208055],
    "J17": [17.537872015107023, 78.38510691472457],
    "J18": [17.537516517460524, 78.38500499702229],
    "J19": [17.537097933033195, 78.38485864641218],
    "J20": [17.53704166702484, 78.38466819316241],
    "J21": [17.53673646622508, 78.38462680924916],
    "J22": [17.53671430081176, 78.38474866636656]
};

const roadGraph = {
    "J1": ["J2", "J4"],
    "J2": ["J1", "J3"],
    "J3": ["J2", "J10"],
    "J4": ["J1", "J5"],
    "J5": ["J4", "J6"],
    "J6": ["J5", "J7", "J9"],
    "J7": ["J6", "J8"],
    "J8": ["J6", "J9"],
    "J9": ["J3", "J8", "J10"],
    "J10": ["J3", "J9", "J11"],
    "J11": ["J10", "J12"],
    "J12": ["J11", "J13"],
    "J13": ["J12", "J14"],
    "J14": ["J13", "J15"],
    "J15": ["J14", "J16"],
    "J16": ["J15", "J17"],
    "J17": ["J16", "J18"],
    "J18": ["J17", "J19"],
    "J19": ["J18", "J20", "J22"],
    "J20": ["J19", "J21"],
    "J21": ["J20"],
    "J22": ["J19"]
};

const buildingToRoad = {
    "Main Gate": "J1",
    "Sports Complex": "J8",
    "B Block": "J17",
    "PG Block": "J21",
    "D Block": "J22",
    "Bus Parking": "J13",
    "Management Block": "J5",
    "Admin Block": "J22",
    "A Block": "J18",
    "C Block": "J17",
    "Canteen": "J16",
    "E Block": "J18",
    "Rattaiah Square ": "J18",
    "Panda Punaiah Square": "J17",
    "Mens Basketball Court": "J15",
    "Play ground ": "J14",
    "Student Parking": "J9",
    "PEB Block": "J5",
    "Library": "J16"
};

const buildingZoom = {
    "A Block": 17,
    "B Block": 17,
    "C Block": 17,
    "D Block": 17,
    "E Block": 17,
    "Library": 17,
    "Admin Block": 18,
    "Management Block": 17,
    "PEB Block": 17,
    "Canteen": 18,
    "Sports Complex": 17,
    "Bus Parking": 19,
    "Student Parking": 18,
    "Main Gate": 17,
    "Play ground": 18,
    "Mens Basketball Court": 18,
    "Rattaiah Square": 19,
    "Panda Punaiah Square": 19
};

// ==========================
// Building Info Panel
// ==========================

const invisibleMarkerIcon = L.divIcon({
    className: "",
    html: "",
    iconSize: [50, 50],
    iconAnchor: [25, 40]
});

// Small colored dot icon shown for every building, color-coded by type.
function getBuildingMarkerIcon(type) {
    const typeClass = {
        academic: "building-marker-academic",
        parking: "building-marker-parking",
        sports: "building-marker-sports",
        canteen: "building-marker-canteen",
        gate: "building-marker-gate"
    }[type] || "building-marker-other";

    return L.divIcon({
        className: "",
        html: `<div class="building-marker-dot ${typeClass}"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7]
    });
}

const panel = document.getElementById("buildingPanel");
const panelContent = document.getElementById("buildingPanelContent");

// b.departments can be a single string ("dept1\ndept2"), an array of
// strings, or missing entirely — this normalizes all three into one
// flat array of trimmed, non-empty department names.
function getDepartmentList(departments) {
    if (!departments) return [];
    const arr = Array.isArray(departments) ? departments : [departments];
    return arr.flatMap(d => d.split("\n").map(s => s.trim()).filter(Boolean));
}

function openBuildingPanel(place) {

    const b = buildings[place];
    if (!b) return;

    const deptList = getDepartmentList(b.departments);
    let deptHTML = "";
    if (deptList.length) {
        deptHTML = `
            <div class="dept-list">
                <h3>Departments</h3>
                <ul>${deptList.map(d => `<li>${d}</li>`).join("")}</ul>
            </div>
        `;
    }

    panelContent.innerHTML = `
        <h2>${place}</h2>
        <span class="building-type">${b.type}</span>
        <p>${(b.info || "").split("\n").join("<br>")}</p>
        ${deptHTML}
    `;

    panel.classList.add("open");

    // The panel opening can resize/shrink the map container (if it's
    // pushing the map rather than floating over it). Leaflet caches
    // its container size, so it needs to be told to re-measure once
    // the CSS transition finishes, or markers/labels outside the old
    // bounds appear to vanish. Match 300 to your panel's actual
    // transition-duration in CSS.
    setTimeout(() => map.invalidateSize(), 300);

}

document.getElementById("closePanelBtn").addEventListener("click", () => {
    panel.classList.remove("open");
    setTimeout(() => map.invalidateSize(), 300);
});
// To add or edit the info shown for a building, edit its "info" field
// in the `buildings` object above. For departments, use either a
// "dept1\ndept2" string or an array of strings — both work.
//
// Each marker gets an invisible hit area (see invisibleMarkerIcon) AND
// a name tooltip. The tooltip's onclick is embedded directly in its
// HTML content so tapping the visible label text opens the panel too,
// independent of Leaflet's own tooltip show/hide behavior.
//
// A second, non-interactive marker (a small colored dot) is added on
// top purely for visibility — it doesn't affect the tooltip/click
// logic on the invisible marker above it.
for (let place in buildings) {

    const marker = L.marker(buildings[place].coords, {
        icon: invisibleMarkerIcon
    }).addTo(map);

    marker.buildingName = place;

    marker.bindTooltip(
        `<span class="label-text" onclick="openBuildingPanel('${place.replace(/'/g, "\\'")}')">${place.trim()}</span>`,
        {
            permanent: false,
            direction: "top",
            className: "campus-building-label",
            offset: [0, -28],
            interactive: true
        }
    );

    marker.on("click", () => openBuildingPanel(place));

    // Purely visual dot marking the building's exact position.
    L.marker(buildings[place].coords, {
        icon: getBuildingMarkerIcon(buildings[place].type),
        interactive: false
    }).addTo(map);

}

// ==========================
// Populate Dropdowns
// ==========================

const source = document.getElementById("source");
const destination = document.getElementById("destination");

source.innerHTML = "";
destination.innerHTML = "";

for (let place in buildings) {

    source.innerHTML += `<option value="${place}">${place}</option>`;
    destination.innerHTML += `<option value="${place}">${place}</option>`;

}

source.selectedIndex = 0;
destination.selectedIndex = 1;

// ===========================================
// Distance Function (Haversine Formula)
// ===========================================

function getJunctionDistance(j1, j2) {

    const lat1 = junctions[j1][0] * Math.PI / 180;
    const lon1 = junctions[j1][1] * Math.PI / 180;

    const lat2 = junctions[j2][0] * Math.PI / 180;
    const lon2 = junctions[j2][1] * Math.PI / 180;

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
    );

    return 6371000 * c;

}

// ===========================================
// Dijkstra Shortest Path Algorithm
// ===========================================

function dijkstra(start, end) {

    let distances = {};
    let previous = {};
    let unvisited = [];

    for (let place in roadGraph) {
        distances[place] = Infinity;
        previous[place] = null;
        unvisited.push(place);
    }

    distances[start] = 0;

    while (unvisited.length > 0) {

        unvisited.sort((a, b) => distances[a] - distances[b]);

        const current = unvisited.shift();

        if (distances[current] === Infinity) break;

        if (current === end) break;

        roadGraph[current].forEach(neighbour => {

            const newDistance =
                distances[current] +
                getJunctionDistance(current, neighbour);

            if (newDistance < distances[neighbour]) {
                distances[neighbour] = newDistance;
                previous[neighbour] = current;
            }

        });

    }

    let path = [];
    let current = end;

    if (distances[end] !== Infinity) {
        while (current !== null) {
            path.unshift(current);
            current = previous[current];
        }
    }

    return {
        path: path,
        distance: distances[end]
    };

}

// ===========================================
// Validate Road Graph
// Warns in console about one-way / missing links
// that silently cause routes to skip junctions.
// ===========================================

function validateRoadGraph() {
    for (let node in roadGraph) {
        roadGraph[node].forEach(neighbor => {
            if (!roadGraph[neighbor] || !roadGraph[neighbor].includes(node)) {
                console.warn(`Asymmetric edge: ${node} -> ${neighbor} missing reverse link`);
            }
        });
    }
}
validateRoadGraph();

// ===========================================
// Draw Route
// ===========================================

let routeLine = null;
let startMarker = null;
let destMarker = null;

// Pin + text-label icon used for the route's start/destination markers.
function getEndpointIcon(kind, label) {
    return L.divIcon({
        className: "",
        html: `
            <div class="route-endpoint-marker">
                <div class="route-endpoint-pin ${kind}"></div>
                <div class="route-endpoint-label">${label}</div>
            </div>
        `,
        iconSize: [120, 50],
        iconAnchor: [9, 16]
    });
}

function findRoute() {

    const source = document.getElementById("source").value;
    const destination = document.getElementById("destination").value;

    if (source === destination) {
        alert("Please select different locations.");
        return;
    }

    const startRoad = buildingToRoad[source];
    const endRoad = buildingToRoad[destination];

    let coordinates = [];
    coordinates.push(buildings[source].coords);

    let pathForDisplay = [];
    let pathDistance = 0;

    if (startRoad === endRoad) {

        coordinates.push(junctions[startRoad]);
        pathForDisplay = [startRoad];

    } else {

        const result = dijkstra(startRoad, endRoad);

        if (!result.path.length || result.distance === Infinity) {
            alert("No path found between these locations. Check roadGraph connectivity (see console warnings).");
            return;
        }

        result.path.forEach(j => coordinates.push(junctions[j]));
        pathForDisplay = result.path;
        pathDistance = result.distance;

    }

    coordinates.push(buildings[destination].coords);

    if (routeLine) {
        map.removeLayer(routeLine);
    }

    routeLine = L.polyline(coordinates, {
        color: "#0b8f47",
        weight: 6,
        opacity: 0.9
    }).addTo(map);

    if (startMarker) map.removeLayer(startMarker);
    if (destMarker) map.removeLayer(destMarker);

    startMarker = L.marker(buildings[source].coords, {
        icon: getEndpointIcon("start", "Start: " + source),
        interactive: false
    }).addTo(map);

    destMarker = L.marker(buildings[destination].coords, {
        icon: getEndpointIcon("destination", "Destination: " + destination),
        interactive: false
    }).addTo(map);

    map.fitBounds(routeLine.getBounds(), {
        padding: [40, 40]
    });

    const walkingTime = Math.ceil(pathDistance / 80);

    document.getElementById("result").innerHTML = `
        <h2><i class="fa-solid fa-route"></i> Shortest Route</h2>
        <div class="route-box">
            <div class="route-detail">
                <span class="route-icon">📍</span>
                <span class="route-label">Source</span>
                <span class="route-value">${source}</span>
            </div>
            <div class="route-detail">
                <span class="route-icon">🎯</span>
                <span class="route-label">Destination</span>
                <span class="route-value">${destination}</span>
            </div>
            <div class="route-detail">
                <span class="route-icon">📏</span>
                <span class="route-label">Distance</span>
                <span class="route-value">${pathDistance.toFixed(0)} meters</span>
            </div>
            <div class="route-detail">
                <span class="route-icon">⏱</span>
                <span class="route-label">Estimated Walking Time</span>
                <span class="route-value">${walkingTime} minutes</span>
            </div>
        </div>
    `;

}

// ===========================================
// NOTE: Junction markers and building/junction
// editing tools have been removed. The underlying
// `junctions` and `roadGraph` data above is still
// what powers the Dijkstra routing — it's just no
// longer editable from the UI.
// ===========================================

// ===========================================
// GPS LOCATION
// ===========================================

let userLocationMarker = null;

function locateUser() {

    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(

        (position) => {

            const { latitude, longitude } = position.coords;

            if (userLocationMarker) {
                map.removeLayer(userLocationMarker);
            }

            userLocationMarker = L.marker([latitude, longitude], {
                icon: L.divIcon({
                    className: "user-location-dot",
                    html: "",
                    iconSize: [16, 16],
                    iconAnchor: [8, 8]
                })
            }).addTo(map).bindPopup("You are here");

            map.setView([latitude, longitude], 19);

        },

        (error) => {
            alert("Unable to retrieve your location: " + error.message);
        },

        { enableHighAccuracy: true }

    );

}

function buildGpsPanel() {

    const gpsPanel = document.createElement("div");
    gpsPanel.id = "gpsPanel";
    gpsPanel.title = "Find my location";
    gpsPanel.textContent = "📍";

    gpsPanel.addEventListener("click", locateUser);

    document.body.appendChild(gpsPanel);

}

buildGpsPanel();

// ===========================================
// BUILDING NAME LABELS
// (display-only — Leaflet tooltips, shown/hidden
// per building based on buildingZoom thresholds.
// Tooltip binding itself now happens in the marker
// creation loop above, since the onclick needs to
// be baked into the tooltip content at bind time.
// Visual styling for .campus-building-label lives
// in style.css, not here.)
// ===========================================

function updateLabels() {
    const zoom = map.getZoom();
    map.eachLayer(layer => {
        if (!(layer instanceof L.Marker)) return;
        const tooltip = layer.getTooltip();
        if (!tooltip) return;
        // buildingZoom keys don't carry the trailing spaces some
        // `buildings` names have ("Play ground ", "Rattaiah Square "),
        // so trim before lookup or those two never match.
        const building = (layer.buildingName || "").trim();
        if (zoom >= buildingZoom[building]) {
            layer.openTooltip();
        } else {
            layer.closeTooltip();
        }
    });
}

updateLabels();
map.on("zoomend", updateLabels);