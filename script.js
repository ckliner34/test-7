// Data: 43 Trails in and around the Fox Cities with approximate mileages
const trailsData = [
    { id: 1, name: "Loop the Lake", miles: 3.5 },
    { id: 2, name: "CE Trail", miles: 5.8 },
    { id: 3, name: "CB Trail", miles: 7.3 },
    { id: 4, name: "Newberry Trail", miles: 2.0 },
    { id: 5, name: "Fox Trot Trail", miles: 2.0 },
    { id: 6, name: "Apple Creek Trail", miles: 5.0 },
    { id: 7, name: "Highview Trail", miles: 1.5 },
    { id: 8, name: "Providence Trail", miles: 1.2 },
    { id: 9, name: "North Island Trail", miles: 1.0 },
    { id: 10, name: "Lawe St. Trestle Trail", miles: 0.5 },
    { id: 11, name: "Fox Valley Tech Nature Trail", miles: 2.0 },
    { id: 12, name: "Highway 150 Trail", miles: 1.7 },
    { id: 13, name: "Friendship Trail", miles: 10.0 },
    { id: 14, name: "Wiouwash State Trail (Local Segment)", miles: 5.9 },
    { id: 15, name: "Newton Blackmour State Trail", miles: 24.0 },
    { id: 16, name: "Old Stone Bridge Trail", miles: 1.5 },
    { id: 17, name: "Kaukauna Locks Trail", miles: 1.3 },
    { id: 18, name: "Konkapot Creek Trail", miles: 1.25 },
    { id: 19, name: "Paper Trail Loop", miles: 42.0 },
    { id: 20, name: "Heckrodt Wetland Reserve Boardwalks", miles: 3.0 },
    { id: 21, name: "Bubolz Nature Preserve Trails", miles: 8.5 },
    { id: 22, name: "1000 Islands Environmental Center", miles: 2.5 },
    { id: 23, name: "Plamann Park Trails", miles: 3.0 },
    { id: 24, name: "Carter Woods Park Trail", miles: 0.8 },
    { id: 25, name: "Erb Park Trail", miles: 1.0 },
    { id: 26, name: "Appleton City Park Loop", miles: 0.5 },
    { id: 27, name: "Doyle Park Trail", miles: 1.2 },
    { id: 28, name: "Clayton Park Trail", miles: 1.0 },
    { id: 29, name: "Black Otter Park Trail", miles: 1.5 },
    { id: 30, name: "High Cliff State Park - Red Bird Trail", miles: 3.4 },
    { id: 31, name: "Loop the Locks", miles: 13.1 },
    { id: 32, name: "Heritage Parkway Trail (Little Chute)", miles: 2.5 },
    { id: 33, name: "Butterfly Pond Trail", miles: 1.0 },
    { id: 34, name: "Riverview Gardens Trails", miles: 2.0 },
    { id: 35, name: "Bruce B. Purdy Nature Preserve", miles: 2.5 },
    { id: 36, name: "Doty Island Loop", miles: 5.0 },
    { id: 37, name: "Hwy 114 & Jefferson Park Trail", miles: 1.0 },
    { id: 38, name: "Fox Wisconsin Heritage Water Trail", miles: 15.0 },
    { id: 39, name: "Nelson Family Heritage Crossing", miles: 1.1 },
    { id: 40, name: "Tellulah Park Trail", miles: 1.5 },
    { id: 41, name: "Appleton Memorial Park Trails", miles: 1.7 },
    { id: 42, name: "Palisades Park Trail", miles: 0.6 },
    { id: 43, name: "Shattuck Park Trail", miles: 0.5 }
];

// Initialize state from local storage or create empty array
let completedTrails = JSON.parse(localStorage.getItem('foxCitiesCompletedTrails')) || [];

// DOM Elements
const trailListElement = document.getElementById('trail-list');
const totalMilesElement = document.getElementById('total-miles');
const completedCountElement = document.getElementById('completed-count');
const progressBarElement = document.getElementById('progress-bar');

// Function to render the trail list
function renderTrails() {
    trailListElement.innerHTML = '';
    
    trailsData.forEach(trail => {
        const isCompleted = completedTrails.includes(trail.id);
        
        // Create container
        const trailDiv = document.createElement('div');
        trailDiv.className = `trail-item ${isCompleted ? 'completed' : ''}`;
        
        // Allow clicking the whole box to check the box
        trailDiv.addEventListener('click', (e) => {
            if (e.target.tagName !== 'INPUT') {
                const checkbox = trailDiv.querySelector('input');
                checkbox.click();
            }
        });

        // Checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'trail-checkbox';
        checkbox.checked = isCompleted;
        checkbox.addEventListener('change', () => toggleTrail(trail.id, checkbox.checked));

        // Info container
        const infoDiv = document.createElement('div');
        infoDiv.className = 'trail-info';

        // Trail Name
        const nameSpan = document.createElement('span');
        nameSpan.className = 'trail-name';
        nameSpan.textContent = trail.name;

        // Trail Miles
        const milesSpan = document.createElement('span');
        milesSpan.className = 'trail-miles';
        milesSpan.textContent = `${trail.miles.toFixed(2)} mi`;

        // Assemble
        infoDiv.appendChild(nameSpan);
        infoDiv.appendChild(milesSpan);
        trailDiv.appendChild(checkbox);
        trailDiv.appendChild(infoDiv);
        trailListElement.appendChild(trailDiv);
    });
}

// Function to handle checking/unchecking a trail
function toggleTrail(id, isChecked) {
    if (isChecked) {
        if (!completedTrails.includes(id)) completedTrails.push(id);
    } else {
        completedTrails = completedTrails.filter(trailId => trailId !== id);
    }
    
    // Save to local storage
    localStorage.setItem('foxCitiesCompletedTrails', JSON.stringify(completedTrails));
    
    // Re-calculate math and re-render
    updateStats();
    renderTrails();
}

// Function to update the top header numbers
function updateStats() {
    let totalMiles = 0;
    
    // Calculate total miles based on completed IDs
    completedTrails.forEach(id => {
        const trail = trailsData.find(t => t.id === id);
        if (trail) totalMiles += trail.miles;
    });

    // Update Text
    totalMilesElement.textContent = totalMiles.toFixed(2);
    completedCountElement.textContent = `${completedTrails.length} / ${trailsData.length}`;
    
    // Update Progress Bar
    const percentComplete = (completedTrails.length / trailsData.length) * 100;
    progressBarElement.style.width = `${percentComplete}%`;
}

// Initial Load
updateStats();
renderTrails();