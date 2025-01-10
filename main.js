// Sample data (replace with database/API calls in production)
let rooms = [
    { id: 1, name: 'Deluxe Ocean View', price: 4490000, description: 'Bask in luxury with breathtaking ocean views', image: 'room1.jpg' },
    { id: 2, name: 'Executive Cityscape', price: 2985000, description: 'Experience urban elegance', image: 'room2.jpg' },
    { id: 3, name: 'Family Garden Retreat', price: 3735000, description: 'Spacious and inviting', image: 'room3.jpg' }
];

let bookings = [];

// DOM Elements
const loginSection = document.getElementById('loginSection');
const adminDashboard = document.getElementById('adminDashboard');
const consumerSection = document.getElementById('consumerSection');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const adminLoginLink = document.getElementById('adminLoginLink');
const roomSelect = document.getElementById('roomSelect');
const bookingForm = document.querySelector('.booking-form');
const totalPriceField = document.getElementById('totalPrice');  // Menambahkan elemen untuk harga total

// Admin Authentication
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('isAdminLoggedIn', 'true');
        showAdminDashboard();
    } else {
        alert('Invalid credentials');
    }
});

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('isAdminLoggedIn');
    showLoginSection();
});

adminLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    showLoginSection();
});

// Navigation Functions
function showLoginSection() {
    loginSection.style.display = 'flex';
    adminDashboard.style.display = 'none';
    consumerSection.style.display = 'none';
}

function showAdminDashboard() {
    loginSection.style.display = 'none';
    adminDashboard.style.display = 'block';
    consumerSection.style.display = 'none';
    renderRoomList();
}

function showConsumerSection() {
    loginSection.style.display = 'none';
    adminDashboard.style.display = 'none';
    consumerSection.style.display = 'block';
    renderConsumerRooms();
}

// Room Management
function renderRoomList() {
    const roomList = document.querySelector('.room-list');
    roomList.innerHTML = rooms.map(room => `
        <div class="room-item" data-id="${room.id}">
            <div class="room-details">
                <h4>${room.name}</h4>
                <p>Rp${room.price.toLocaleString()}/malam</p>
                <p>${room.description}</p>
            </div>
            <div class="room-actions">
                <button onclick="editRoom(${room.id})">Edit</button>
                <button onclick="deleteRoom(${room.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function editRoom(id) {
    const room = rooms.find(r => r.id === id);
    const newName = prompt('Enter new room name:', room.name);
    if (newName) {
        room.name = newName;
        renderRoomList();
        renderConsumerRooms();
    }
}

function deleteRoom(id) {
    if (confirm('Are you sure you want to delete this room?')) {
        rooms = rooms.filter(r => r.id !== id);
        renderRoomList();
        renderConsumerRooms();
    }
}

// Consumer Section Rendering
function renderConsumerRooms() {
    const roomGrid = document.querySelector('.room-grid');
    roomGrid.innerHTML = rooms.map(room => `
        <div class="room-card">
            <img src="assets/${room.image}" alt="${room.name}">
            <div class="room-card-content">
                <h3>${room.name}</h3>
                <p>${room.description}</p>
                <p class="price">Rp${room.price.toLocaleString()}/malam</p>
                <button onclick="bookRoom(${room.id})">Book Now</button>
            </div>
        </div>
    `).join('');

    // Populate the room selection dropdown for booking
    roomSelect.innerHTML = rooms.map(room => `
        <option value="${room.id}">${room.name} - Rp${room.price.toLocaleString()}/malam</option>
    `).join('');
}

// Booking Form Handling
bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const guestName = document.getElementById('guestName').value;
    const gender = document.getElementById('genderSelect').value;
    const identityNumber = document.getElementById('identityNumber').value;
    const checkInDate = document.getElementById('checkInDate').value;
    const durationStay = parseInt(document.getElementById('durationStay').value);
    const roomId = parseInt(document.getElementById('roomSelect').value);
    const room = rooms.find(r => r.id === roomId);
    const breakfast = document.getElementById('breakfastCheckbox').checked;
    
    // Validasi Identity Number
    if (identityNumber.length !== 16) {
        alert('Identity number must be 16 digits.');
        return;
    }

    // Hitung Total Harga
    const totalPrice = calculateTotalPrice(room, durationStay, breakfast);
    
    // Tampilkan Total Harga di Kolom "Total Price"
    totalPriceField.value = `Rp${totalPrice.toLocaleString()}`;
    console.log('Total Price set to:', totalPrice.toLocaleString());  // Debugging: melihat nilai total yang di-set
    
    // Simpan Booking
    const booking = {
        id: bookings.length + 1,
        guestName,
        gender,
        identityNumber,
        roomName: room.name,
        checkInDate,
        durationStay,
        breakfastIncluded: breakfast,
        totalPrice,
        status: 'Pending'
    };
    
    bookings.push(booking);
    
    // Render ulang room list untuk memperbarui tampilan
    renderConsumerRooms();
});

// Hitung Total Harga dengan Diskon
function calculateTotalPrice(room, durationStay, breakfast) {
    let price = room.price * durationStay;
    
    if (durationStay > 3) {
        price = price * 0.9; // Diskon 10%
    }

    if (breakfast) {
        price += 80000; // Tambahkan harga sarapan (Rp15,000 * 15)
    }
    
    console.log('Calculated Price:', price);  // Debugging: melihat harga yang dihitung
    return price;
}


// Initialize page
function initializePage() {
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (isAdminLoggedIn === 'true') {
        showAdminDashboard();
    } else {
        showConsumerSection();
    }
}

initializePage();
