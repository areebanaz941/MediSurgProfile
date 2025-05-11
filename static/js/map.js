/**
 * Medi Surg International - Hospital Map
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Map script loaded');
    initializeMap();
});

function initializeMap() {
    console.log('Initializing map...');
    const mapContainer = document.getElementById('hospital-map');
    
    if (!mapContainer) {
        console.error('Map container not found!');
        return;
    }
    
    if (typeof L === 'undefined') {
        console.error('Leaflet library not loaded!');
        mapContainer.innerHTML = '<div class="text-center p-5"><h3>Map loading error</h3><p>Please refresh the page to try again.</p></div>';
        return;
    }
    
    try {
        // Initialize the map
        const map = L.map('hospital-map').setView([33.6844, 73.0479], 7);
        
        // Add the tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18
        }).addTo(map);
        
        // Define hospital locations by region
        const hospitalData = {
            islamabad: [
                { name: "Shifa International Hospital", location: [33.6800, 73.0802], type: "Major Medical Center" },
                { name: "Maroof International Hospital", location: [33.6932, 73.0511], type: "Major Medical Center" },
                { name: "Islamic International Dental Hospital", location: [33.7035, 73.0408], type: "Specialized Hospital" },
                { name: "Heart International Hospital", location: [33.6905, 73.0300], type: "Specialized Hospital" },
                { name: "Ali Medical Centre", location: [33.7112, 73.0549], type: "Medical Center" },
                { name: "PIMS Islamabad", location: [33.7016, 73.0522], type: "Government Hospital" },
                { name: "Dr. Akbar Khan Niazi Teaching Hospital", location: [33.7496, 73.1760], type: "Teaching Hospital" },
                { name: "IDC Islamabad", location: [33.6939, 73.0285], type: "Diagnostic Center" }
            ],
            rawalpindi: [
                { name: "Behria International Hospital", location: [33.5651, 73.0888], type: "Major Medical Center" },
                { name: "Safari Hospital", location: [33.6176, 73.0601], type: "Private Hospital" },
                { name: "Maryum International Hospital", location: [33.6048, 73.0677], type: "Private Hospital" },
                { name: "Kulsoom International Hospital", location: [33.6242, 73.0711], type: "Private Hospital" },
                { name: "Tehmar Diagnosis Centre", location: [33.6014, 73.0499], type: "Diagnostic Center" },
                { name: "Razi Hospital PWD", location: [33.6299, 73.0778], type: "Private Hospital" },
                { name: "Benazir Bhutto Hospital", location: [33.6339, 73.0691], type: "Government Hospital" },
                { name: "Holy Family Hospital", location: [33.6474, 73.0645], type: "Teaching Hospital" },
                { name: "RIC", location: [33.6128, 73.0781], type: "Specialized Center" }
            ],
            abbottabad: [
                { name: "Mahida Hospital", location: [34.1672, 73.2252], type: "Private Hospital" },
                { name: "Gillani Hospital", location: [34.1691, 73.2211], type: "Private Hospital" },
                { name: "Green Valley Hospital", location: [34.1713, 73.2196], type: "Private Hospital" },
                { name: "Jinnah International Hospital", location: [34.1702, 73.2230], type: "Private Hospital" }
            ],
            lahore: [
                { name: "Behria International Hospital Lahore", location: [31.4730, 74.4107], type: "Major Medical Center" }
            ]
        };
        
        // Office location
        const officeLocation = [33.6565, 73.0181];
        
        // Create a marker for headquarters
        const headquartersIcon = L.icon({
            iconUrl: '/static/img/logo.png',
            iconSize: [30, 30],
            iconAnchor: [15, 15],
            popupAnchor: [0, -15]
        });
        
        const headquartersMarker = L.marker(officeLocation, { icon: headquartersIcon }).addTo(map);
        headquartersMarker.bindPopup(`
            <div class="map-marker-popup">
                <h4>Medi Surg International</h4>
                <p><strong>Headquarters</strong></p>
                <p>Office no 3, 1st floor, Ahmad plaza I-10 markaz, Islamabad.</p>
                <p>+92-310-0085387</p>
            </div>
        `);
        
        // Create marker clusters for each region
        const clusters = {};
        const regionColors = {
            islamabad: 'red',
            rawalpindi: 'darkred',
            abbottabad: 'orange',
            lahore: 'blue'
        };
        
        // Create marker clusters for each region
        const clusterGroups = {};
        
        // Define custom cluster icon
        const createClusterIcon = function(cluster) {
            return L.divIcon({
                html: `<div class="custom-cluster-icon" style="background-image: url('/static/img/logo.png');">
                       <span>${cluster.getChildCount()}</span>
                       </div>`,
                className: 'marker-cluster',
                iconSize: L.point(40, 40)
            });
        };
        
        // Initialize marker cluster group for each region
        Object.keys(hospitalData).forEach(region => {
            clusterGroups[region] = L.markerClusterGroup({
                maxClusterRadius: 40,
                iconCreateFunction: createClusterIcon
            });
        });
        
        // Add all hospital markers to their respective cluster groups
        Object.keys(hospitalData).forEach(region => {
            hospitalData[region].forEach(hospital => {
                const hospitalIcon = L.icon({
                    iconUrl: '/static/img/logo.png',
                    iconSize: [25, 25],
                    iconAnchor: [12, 12],
                    popupAnchor: [0, -12]
                });
                
                const marker = L.marker(hospital.location, { icon: hospitalIcon });
                marker.bindPopup(`
                    <div class="map-marker-popup">
                        <h4>${hospital.name}</h4>
                        <p><strong>Type:</strong> ${hospital.type}</p>
                        <p><strong>Region:</strong> ${region.charAt(0).toUpperCase() + region.slice(1)}</p>
                    </div>
                `);
                
                // Add marker to the cluster group
                clusterGroups[region].addLayer(marker);
                
                // Draw line from headquarters to this hospital
                L.polyline([officeLocation, hospital.location], {
                    color: '#b23c3c',
                    weight: 1,
                    opacity: 0.3,
                    dashArray: '5, 10'
                }).addTo(map);
            });
            
            // Add the cluster group to the map
            map.addLayer(clusterGroups[region]);
        });
        
        console.log('Map initialization complete');
    } catch (error) {
        console.error('Error in map initialization:', error);
        mapContainer.innerHTML = `
            <div class="text-center p-5">
                <h3>Map Error</h3>
                <p>There was an error loading the map. Please refresh the page to try again.</p>
                <p>Error details: ${error.message}</p>
            </div>
        `;
    }
}