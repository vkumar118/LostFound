// Initialize the map
function initMap() {
    const map = L.map('map').setView([40.7128, -74.0060], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Add sample markers for lost and found items
    const lostIcon = L.icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
    });
    
    const foundIcon = L.icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
    });
    
    // Add sample markers
    const locations = [
        {lat: 40.7128, lng: -74.0080, type: 'lost', title: 'Lost Wallet', desc: 'Black leather wallet with ID cards', category: 'wallet'},
        {lat: 40.7150, lng: -74.0040, type: 'found', title: 'Found Keys', desc: 'Set of car keys with blue keychain', category: 'keys'},
        {lat: 40.7135, lng: -74.0100, type: 'lost', title: 'Lost Phone', desc: 'iPhone 12 Pro Max with black case', category: 'phone'},
        {lat: 40.7110, lng: -74.0020, type: 'found', title: 'Found Backpack', desc: 'Blue backpack with laptop inside', category: 'other'},
        {lat: 40.7140, lng: -74.0060, type: 'lost', title: 'Lost Watch', desc: 'Silver wristwatch, brand Rolex', category: 'jewelry'},
    ];
    
    locations.forEach(loc => {
        const marker = L.marker([loc.lat, loc.lng], {
            icon: loc.type === 'lost' ? lostIcon : foundIcon
        }).addTo(map);
        
        marker.bindPopup(`
            <b>${loc.title}</b><br>
            <i>Status: ${loc.type === 'lost' ? 'Lost' : 'Found'}</i><br>
            ${loc.desc}<br>
            <button class="btn btn-primary" style="margin-top: 10px; width: 100%;" onclick="viewItemDetail('${loc.title}')">
                ${loc.type === 'lost' ? 'I Found This' : 'This Is Mine'}
            </button>
        `);
    });
    
    // Initialize modal maps
    const foundMap = L.map('found-map').setView([40.7128, -74.0060], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(foundMap);
    
    const lostMap = L.map('lost-map').setView([40.7128, -74.0060], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(lostMap);
}

// Modal functionality
const modals = {
    'report-found-modal': document.getElementById('report-found-modal'),
    'report-lost-modal': document.getElementById('report-lost-modal'),
    'search-modal': document.getElementById('search-modal')
};

// Open modal function
function openModal(modalId) {
    // Close all modals first
    Object.values(modals).forEach(modal => {
        modal.classList.remove('active');
    });
    
    // Open the requested modal
    modals[modalId].classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close modal function
function closeModals() {
    Object.values(modals).forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = 'auto';
}

// Set up event listeners for modals
document.querySelectorAll('.close-modal').forEach(button => {
    button.addEventListener('click', closeModals);
});

// Open modals when buttons are clicked
document.getElementById('report-found-btn').addEventListener('click', () => openModal('report-found-modal'));
document.getElementById('report-found-option').addEventListener('click', () => openModal('report-found-modal'));
document.getElementById('report-lost-btn').addEventListener('click', () => openModal('report-lost-modal'));
document.getElementById('search-lost-btn').addEventListener('click', () => openModal('search-modal'));
document.getElementById('search-nav').addEventListener('click', () => openModal('search-modal'));
document.getElementById('report-nav').addEventListener('click', () => openModal('report-found-modal'));

// QR Code Scanner Simulation
document.getElementById('scan-qr').addEventListener('click', function() {
    alert("QR Code Scanner Activated!\n\nIn a real application, this would open your device's camera to scan QR codes on lost items.");
});

// Form submission handlers
document.getElementById('submit-found').addEventListener('click', function() {
    const form = document.getElementById('found-item-form');
    if (form.checkValidity()) {
        alert('Found item report submitted successfully! We will notify you if the owner is found.');
        closeModals();
    } else {
        alert('Please fill in all required fields.');
    }
});

document.getElementById('submit-lost').addEventListener('click', function() {
    const form = document.getElementById('lost-item-form');
    if (form.checkValidity()) {
        alert('Lost item report submitted successfully! We will notify you if your item is found.');
        closeModals();
    } else {
        alert('Please fill in all required fields.');
    }
});

// Search functionality
document.getElementById('perform-search').addEventListener('click', function() {
    const query = document.getElementById('search-query').value.toLowerCase();
    const category = document.getElementById('search-category').value;
    const location = document.getElementById('search-location').value.toLowerCase();
    
    // Sample data for search results
    const items = [
        {id: 1, title: "Lost Wallet", description: "Black leather wallet with ID cards", category: "wallet", status: "lost", location: "Central Park, NYC", date: "2023-10-15"},
        {id: 2, title: "Found Keys", description: "Set of car keys with blue keychain", category: "keys", status: "found", location: "5th Avenue, NYC", date: "2023-10-18"},
        {id: 3, title: "Lost Phone", description: "iPhone 12 Pro Max with black case", category: "phone", status: "lost", location: "Times Square, NYC", date: "2023-10-12"},
        {id: 4, title: "Found Backpack", description: "Blue backpack with laptop inside", category: "other", status: "found", location: "Grand Central Station", date: "2023-10-17"},
        {id: 5, title: "Lost Watch", description: "Silver wristwatch, brand Rolex", category: "jewelry", status: "lost", location: "Brooklyn Bridge", date: "2023-10-10"}
    ];
    
    // Filter items based on search criteria
    const results = items.filter(item => {
        const matchesQuery = !query || 
            item.title.toLowerCase().includes(query) || 
            item.description.toLowerCase().includes(query);
        
        const matchesCategory = !category || item.category === category;
        const matchesLocation = !location || item.location.toLowerCase().includes(location);
        
        return matchesQuery && matchesCategory && matchesLocation;
    });
    
    // Display results
    displaySearchResults(results);
});

// Display search results
function displaySearchResults(results) {
    const container = document.getElementById('search-results-container');
    container.innerHTML = '';
    
    if (results.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding:2rem; color:var(--gray)">No items match your search criteria.</p>';
        return;
    }
    
    results.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';
        
        // Set a different background for each category
        const categoryColors = {
            wallet: '#FFD700',
            keys: '#FF6B6B',
            phone: '#4A90E2',
            jewelry: '#50E3C2',
            other: '#9B59B6'
        };
        
        const bgColor = categoryColors[item.category] || '#6C757D';
        
        card.innerHTML = `
            <div class="item-image" style="background: linear-gradient(to right, ${bgColor}, ${bgColor}80); display:flex; align-items:center; justify-content:center; color:white;">
                <i class="fas fa-${getCategoryIcon(item.category)} fa-3x"></i>
            </div>
            <div class="item-details">
                <span class="item-status ${item.status === 'found' ? 'status-found' : 'status-lost'}">
                    ${item.status === 'found' ? 'FOUND ITEM' : 'LOST ITEM'}
                </span>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <div class="item-location">
                    <i class="fas fa-map-marker-alt"></i> ${item.location}
                </div>
                <div class="item-location">
                    <i class="fas fa-calendar"></i> ${formatDate(item.date)}
                </div>
                <button class="btn btn-primary" style="width:100%; margin-top:1rem;" onclick="viewItemDetail(${item.id})">
                    View Details
                </button>
            </div>
        `;
        
        container.appendChild(card);
    });
}

// Helper function to get category icon
function getCategoryIcon(category) {
    const icons = {
        wallet: 'wallet',
        keys: 'key',
        phone: 'mobile',
        jewelry: 'gem',
        documents: 'file',
        clothing: 'tshirt',
        electronics: 'laptop'
    };
    return icons[category] || 'question-circle';
}

// Format date for display
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// View item detail
function viewItemDetail(itemId) {
    alert(`Viewing details for item #${itemId}\n\nThis would open a detailed view with contact information in a real application.`);
}

// Initialize the map after page load
window.onload = initMap;

// Filter button functionality
const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Remove active class from all buttons in the same group
        const parent = this.parentElement;
        const siblings = parent.querySelectorAll('.filter-btn');
        siblings.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
    });
});

// Close modals when clicking outside
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function(e) {
        if (e.target === this) {
            closeModals();
        }
    });
});