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

const darkTileLayer = L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution: "&copy; OpenStreetMap Contributors &copy; CARTO",
    maxZoom: 22
});

// ==========================
// Buildings
// ==========================
// FIX: these four `const` declarations used to be wrapped in a stray
// `{ ... }` block. That turns them into block-scoped bindings that vanish
// as soon as the block ends — every later reference to `buildings`,
// `junctions`, `roadGraph`, and `buildingToRoad` (findRoute, dijkstra,
// the editor IIFE, etc.) would throw "ReferenceError: buildings is not
// defined". The wrapping braces have been removed so these stay in
// module/global scope for the rest of the script.

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
        "type": "academic"
    },
    "A Block": {
        "coords": [17.53737329519014, 78.38481725071168],
        "info": "Academic Block A",
        "type": "academic"
    },
    "B Block": {
        "coords": [17.537672527304895, 78.3848494460025],
        "info": "Academic Block B",
        "type": "academic"
    },
    "C Block": {
        "coords": [17.537915493188617, 78.38506401555891],
        "info": "Academic Block C",
        "type": "academic"
    },
    "Canteen": {
        "coords": [17.538365085908858, 78.38479484963928],
        "info": "Student Canteen",
        "type": "canteen"
    },
    "E Block": {
        "coords": [17.5372, 78.38535],
        "info": "CSE Departments",
        "type": "academic"
    },
    "D Block": {
        "coords": [17.53665302604159, 78.3850534160283],
        "info": "Civil, Mechanical & Automobile",
        "type": "academic"
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
        "info": "Mens Basketball Court",
        "type": "sports"
    },
    "Play ground ": {
        "coords": [17.53962050782601, 78.38545280575003],
        "info": "Play ground ",
        "type": "sports"
    },
    "Student Parking": {
        "coords": [17.540203619134296, 78.38584444201008],
        "info": "Student Parking",
        "type": "parking"
    },
    "PEB Block": {
        "coords": [17.540786728566868, 78.38642921396007],
        "info": "PEB Block",
        "type": "academic"
    },
    "Library": {
        "coords": [17.538171246398676, 78.3848816253459],
        "info": "Library",
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

// FIX (confirmed against the campus map images): the green route on the
// map runs continuously Library(J16) -> C Block -> B Block(J17) ->
// A Block(J18) -> Silicon Bhavan(J19) -> PG Block(J20) -> Admin/D
// Block(J22), but the graph was missing the J17<->J18 and J18<->J19
// links, which is exactly why the J19/J20/J21/J22 cluster was
// unreachable from the rest of campus. Both edges are added below.
// J21 still has no edges and isn't referenced by any building or
// visible on the maps, so it's left disconnected as-is.

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
    "J10": ["J3","J9", "J11"],
    "J11": ["J10", "J12"],
    "J12": ["J11", "J13"],
    "J13": ["J12", "J14"],
    "J14": ["J13", "J15"],
    "J15": ["J14", "J16"],
    "J16": ["J15", "J17"],
    "J17": ["J16", "J18"],
    "J18": ["J17", "J19"],
    "J19": ["J18", "J20", "J22"],
    "J20": ["J19","J21"],
    "J21": ["J20"],
    "J22": ["J19"]
};

// FIX: two keys here didn't match the corresponding `buildings` keys, so
// selecting either building as source/destination made
// `buildingToRoad[source]` come back `undefined`, which then crashed
// findRoute() (e.g. `junctions[undefined]` / dijkstra with an undefined
// start node):
//   - "PEB BLock"  -> corrected to "PEB Block"  (matches buildings key)
//   - "Library "   -> corrected to "Library"    (matches buildings key,
//                      no trailing space)
//
// FIX (checked against the campus map images): several buildings were
// pointing at a junction nowhere near their actual pin on the map —
// corrected to the nearest junction shown in the images:
//   - Management Block: J5  -> J4  (J4 sits right on the building; J5 is
//                                    off toward PEB Block)
//   - PG Block:         J16 -> J20 (J16 is by the Library, far away)
//   - Admin Block:      J17 -> J22 (J17 is by B Block; J22 is the
//                                    Admin/D Block/Civil Workshop cluster)
//   - D Block:           J17 -> J22 (same cluster as Admin Block)
//   - B Block:            J18 -> J17 (J17 is the junction right next to
//                                    B Block; J18 belongs to A Block)
//   - Canteen:            J12 -> J16 (J12 is up by the bus stop; Canteen
//                                    sits next to the Library)
//   - Bus Parking:        J10 -> J13 (J10 is the bus-stop cluster; J13
//                                    sits right above the Bus Parking pin)
//   - E Block:            J14 -> J18 (best estimate — E Block sits in the
//                                    same row as A Block/Instrumentation
//                                    Workshop, not near the institute gate
//                                    where J14 is; lower confidence than
//                                    the others, worth a visual double-check)
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
    "Management Block": 18,
    "PEB Block": 18,
    "Canteen": 18,
    "Sports Complex": 18,
    "Bus Parking": 19,
    "Student Parking": 19,
    "Main Gate": 19,
    "Play ground": 19,
    "Mens Basketball Court": 19,
    "Rattaiah Square": 20,
    "Panda Punaiah Square": 20
};

// ==========================
// Add Building Markers
// (no default/Font Awesome icon — the marker is
// just an invisible anchor point; only the name
// label tooltip added further down is visible)
// ==========================

const invisibleMarkerIcon = L.divIcon({
    className: "",
    html: "",
    iconSize: [1, 1],
    iconAnchor: [0, 0]
});

for (let place in buildings) {

    L.marker(buildings[place].coords, {
        icon: invisibleMarkerIcon
    })
        .addTo(map)
        .bindPopup(`<b>${place}</b><br>${buildings[place].info}`);

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
                <span class="route-icon">🧭</span>
                <span class="route-label">Route</span>
                <span class="route-value">${pathForDisplay.join(" ➜ ")}</span>
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
// DARK MODE
// ===========================================

let darkMode = false;

function injectDarkModeStyles() {

    const style = document.createElement("style");

    style.textContent = `
        body.dark-mode {
            background:#0f1115;
        }

        body.dark-mode #gpsPanel {
            background:#1c1f26 !important;
            color:#eee !important;
            box-shadow:0 4px 14px rgba(0,0,0,0.55) !important;
        }

        body.dark-mode #gpsPanel:hover {
            background:#252932 !important;
        }

        body.dark-mode #darkModeToggleBtn {
            background:#1c1f26 !important;
            color:#f2f2f2 !important;
            border:1px solid #333844 !important;
        }

        body.dark-mode select,
        body.dark-mode #source,
        body.dark-mode #destination {
            background:#1c1f26 !important;
            color:#f2f2f2 !important;
            border:1px solid #333844 !important;
        }

        body.dark-mode button {
            background:#242833 !important;
            color:#f2f2f2 !important;
            border:1px solid #333844 !important;
        }

        body.dark-mode button:hover {
            background:#2f3542 !important;
        }

        body.dark-mode #result {
            background:#1c1f26 !important;
            color:#eee !important;
            box-shadow:0 4px 14px rgba(0,0,0,0.5) !important;
        }

        body.dark-mode .route-box {
            background:#20232b !important;
        }

        body.dark-mode .route-detail {
            border-bottom:1px solid #2c2f38 !important;
        }

        body.dark-mode .route-label {
            color:#9aa3b2 !important;
        }

        body.dark-mode .route-value {
            color:#f2f2f2 !important;
        }

        body.dark-mode .leaflet-popup-content-wrapper,
        body.dark-mode .leaflet-popup-tip {
            background:#1c1f26 !important;
            color:#eee !important;
        }

        body.dark-mode .leaflet-control-zoom a {
            background:#1c1f26 !important;
            color:#f2f2f2 !important;
            border-color:#333844 !important;
        }
    `;

    document.head.appendChild(style);

}

function toggleDarkMode() {

    darkMode = !darkMode;

    if (darkMode) {
        map.removeLayer(lightTileLayer);
        darkTileLayer.addTo(map);
        document.body.classList.add("dark-mode");
    } else {
        map.removeLayer(darkTileLayer);
        lightTileLayer.addTo(map);
        document.body.classList.remove("dark-mode");
    }

}

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
                    className: "user-location-icon",
                    html: `<div style="
                        width:16px;height:16px;border-radius:50%;
                        background:#1a73e8;border:3px solid white;
                        box-shadow:0 0 0 2px #1a73e8;
                    "></div>`,
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

    const panel = document.createElement("div");
    panel.id = "gpsPanel";

    panel.style.position = "fixed";
    panel.style.bottom = "20px";
    panel.style.right = "12px";
    panel.style.zIndex = "99999";
    panel.style.background = "white";
    panel.style.borderRadius = "50%";
    panel.style.boxShadow = "0 2px 8px rgba(0,0,0,0.35)";
    panel.style.cursor = "pointer";
    panel.style.fontSize = "22px";
    panel.style.width = "44px";
    panel.style.height = "44px";
    panel.style.display = "flex";
    panel.style.alignItems = "center";
    panel.style.justifyContent = "center";
    panel.title = "Find my location";
    panel.textContent = "📍";

    panel.addEventListener("click", locateUser);

    document.body.appendChild(panel);

}

// ===========================================
// INTERFACE POLISH
// ===========================================

function injectInterfacePolishStyles() {

    const style = document.createElement("style");

    style.textContent = `
        #map {
            border-radius: 10px;
        }

        #source,
        #destination {
            font-size: 16px !important;
            padding: 12px 14px !important;
            min-height: 46px;
            border-radius: 8px;
            box-sizing: border-box;
        }

        #darkModeToggleBtn {
            position: fixed;
            bottom: 20px;
            right: 68px;
            z-index: 99999;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            border: none;
            background: white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.35);
            cursor: pointer;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        #darkModeToggleBtn:hover {
            filter: brightness(0.95);
        }

        #gpsPanel:hover {
            filter: brightness(0.97);
        }
    `;

    document.head.appendChild(style);

}

// ===========================================
// DARK MODE TOGGLE (floating button)
// ===========================================

function buildDarkModeToggle() {

    const btn = document.createElement("button");
    btn.id = "darkModeToggleBtn";
    btn.title = "Toggle dark mode";
    btn.textContent = "🌙";

    btn.addEventListener("click", () => {
        toggleDarkMode();
        btn.textContent = darkMode ? "☀️" : "🌙";
    });

    document.body.appendChild(btn);

}

injectDarkModeStyles();
injectInterfacePolishStyles();
buildGpsPanel();
buildDarkModeToggle();

// ===========================================
// BUILDING NAME LABELS
// (display-only — Leaflet tooltips, shown/hidden
// per building based on buildingZoom thresholds)
// ===========================================

function injectLabelStyles() {
    if (document.getElementById("campusLabelStyles")) return;

    const style = document.createElement("style");
    style.id = "campusLabelStyles";
    style.textContent = `
        .campus-building-label {
            background: white;
            color: #1f2430;
            padding: 4px 10px;
            border-radius: 14px;
            font-size: 12px;
            font-weight: 600;
            white-space: nowrap;
            box-shadow: 0 2px 6px rgba(0,0,0,0.35);
            border: none;
        }
        .campus-building-label::before {
            display: none;
        }
    `;
    document.head.appendChild(style);
}

function bindBuildingTooltips() {
    map.eachLayer(layer => {
        if (!(layer instanceof L.Marker)) return;
        const latlng = layer.getLatLng();
        for (let name in buildings) {
            const b = buildings[name];
            if (Math.abs(latlng.lat - b.coords[0]) < 1e-9 &&
                Math.abs(latlng.lng - b.coords[1]) < 1e-9) {
                layer.bindTooltip(name, {
                    permanent: false,
                    direction: "top",
                    className: "campus-building-label",
                    offset: [0, -28]
                });
                break;
            }
        }
    });
}

function updateLabels() {
    const zoom = map.getZoom();
    map.eachLayer(layer => {
        if (!(layer instanceof L.Marker)) return;
        const tooltip = layer.getTooltip();
        if (!tooltip) return;
        // buildingZoom keys don't carry the trailing spaces some
        // `buildings` names have ("Play ground ", "Rattaiah Square "),
        // so trim before lookup or those two never match.
        const building = tooltip.getContent().trim();
        if (zoom >= buildingZoom[building]) {
            layer.openTooltip();
        } else {
            layer.closeTooltip();
        }
    });
}

injectLabelStyles();
bindBuildingTooltips();
updateLabels();
map.on("zoomend", updateLabels);