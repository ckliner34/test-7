// Import Firebase from the internet (CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Your exact Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCD9iPVikuMHjAIYFdaeTH81HR60xpmUh8",
  authDomain: "test-3-trail.firebaseapp.com",
  projectId: "test-3-trail",
  storageBucket: "test-3-trail.firebasestorage.app",
  messagingSenderId: "317689688398",
  appId: "1:317689688398:web:efb9e0a3c41774e2abae1f",
  measurementId: "G-J1770756TD"
};

// Initialize Firebase Backend
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Data: 43 Trails
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

let completedTrails = [];
let userId = null;

// DOM Elements
const trailListElement = document.getElementById('trail-list');
const totalMilesElement = document.getElementById('total-miles');
const completedCountElement = document.getElementById('completed-count');
const progressBarElement = document.getElementById('progress-bar');

// 🌟 RENDER IMMEDIATELY so the screen is never blank while waiting for the cloud
updateStats();
renderTrails();

// 1. Automatically sign the user in invisibly
signInAnonymously(auth).catch((error) => {
    console.error("Authentication Error:", error);
    if (error.code === 'auth/unauthorized-domain') {
        alert("Firebase Error: This domain is not authorized. Please add your GitHub Pages URL to Firebase Auth Authorized Domains.");
    }
});

// 2. Wait for the user to be signed in, then get their cloud data
onAuthStateChanged(auth, async (user) => {
    if (user) {
        userId = user.uid; // Get their invisible ID
        await loadUserDataFromCloud();
    }
});

// 3. Pull data from Firestore
async function loadUserDataFromCloud() {
    try {
        const userDocRef = doc(db, "users", userId);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            completedTrails = docSnap.data().completedTrails || [];
        } else {
            completedTrails = [];
        }
        
        // 🌟 RE-RENDER with the user's saved data once it arrives
        updateStats();
        renderTrails();
    } catch (error) {
        console.error("Error loading data from cloud:", error);
    }
}

// 4. Save data to Firestore
async function saveUserDataToCloud() {
    if (!userId) return; // Don't save if not fully logged in yet
    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, { completedTrails: completedTrails }, { merge: true });
}

// Render the trail list
function renderTrails() {
    trailListElement.innerHTML = '';
    
    trailsData.forEach(trail => {
        const isCompleted = completedTrails.includes(trail.id);
        
        const trailDiv = document.createElement('div');
        trailDiv.className = `trail-item ${isCompleted ? 'completed' : ''}`;
        
        trailDiv.addEventListener('click', (e) => {
            if (e.target.tagName !== 'INPUT') {
                const checkbox = trailDiv.querySelector('input');
                checkbox.click();
            }
        });

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'trail-checkbox';
        checkbox.checked = isCompleted;
        checkbox.addEventListener('change', () => toggleTrail(trail.id, checkbox.checked));

        const infoDiv = document.createElement('div');
        infoDiv.className = 'trail-info';

        const nameSpan = document.createElement('span');
        nameSpan.className = 'trail-name';
        nameSpan.textContent = trail.name;

        const milesSpan = document.createElement('span');
        milesSpan.className = 'trail-miles';
        milesSpan.textContent = `${trail.miles.toFixed(2)} mi`;

        infoDiv.appendChild(nameSpan);
        infoDiv.appendChild(milesSpan);
        trailDiv.appendChild(checkbox);
        trailDiv.appendChild(infoDiv);
        trailListElement.appendChild(trailDiv);
    });
}

// Handle checking/unchecking
function toggleTrail(id, isChecked) {
    if (isChecked) {
        if (!completedTrails.includes(id)) completedTrails.push(id);
    } else {
        completedTrails = completedTrails.filter(trailId => trailId !== id);
    }
    
    // Save to the cloud
    saveUserDataToCloud();
    
    updateStats();
    renderTrails();
}

// Update the top header numbers
function updateStats() {
    let totalMiles = 0;
    
    completedTrails.forEach(id => {
        const trail = trailsData.find(t => t.id === id);
        if (trail) totalMiles += trail.miles;
    });

    totalMilesElement.textContent = totalMiles.toFixed(2);
    completedCountElement.textContent = `${completedTrails.length} / ${trailsData.length}`;
    
    const percentComplete = (completedTrails.length / trailsData.length) * 100;
    progressBarElement.style.width = `${percentComplete}%`;
}
