/* --- 1. LOCATION LOGIC --- */
function getLocation() {
    const userCity = document.getElementById("userCity");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            if(userCity) {
                userCity.innerText = "Lat: " + position.coords.latitude.toFixed(2) + " | Long: " + position.coords.longitude.toFixed(2);
            }
        });
    }
}

/* --- 2. MODAL & EXPERT LIST --- */
function openModal(service, providers) {
    const modal = document.getElementById("infoModal");
    const title = document.getElementById("modalTitle");
    const body = document.getElementById("modalBody");

    if(!modal) return;

    title.innerText = "Available " + service;
    body.innerHTML = ""; 

    providers.forEach(pro => {
        body.innerHTML += `
            <div style="border-bottom: 1px solid #333; padding: 15px 0; text-align: left;">
                <strong style="color: #fff;">👤 ${pro.name}</strong>
                <p style="color: #00ff88; margin: 5px 0;">📍 Area: ${pro.area}</p>
                <p style="color: #ccc; margin: 5px 0;">📞 Phone: ${pro.phone}</p>
                <p style="color: #ffcc00; margin: 5px 0;">⭐ Rating: ${pro.rating}</p>
            </div>`;
    });

    body.innerHTML += `
        <button id="payBtn" onclick="processPayment()" 
            style="width: 100%; margin-top: 20px; padding: 15px; background: #00ff88; 
            color: #121212; font-weight: bold; border-radius: 10px; border: none; cursor: pointer; font-size: 1rem;">
            Proceed to Book & Pay
        </button>`;

    modal.style.display = "block";
}

function closeModal() {
    const modal = document.getElementById("infoModal");
    if(modal) modal.style.display = "none";
}

/* --- 3. PAYMENT & RATING SYSTEM --- */
function processPayment() {
    const payBtn = document.getElementById('payBtn');
    if(!payBtn) return;

    payBtn.innerText = "Processing Payment...";
    payBtn.disabled = true;
    payBtn.style.opacity = "0.6";

    setTimeout(() => {
        const body = document.getElementById("modalBody");
        const title = document.getElementById("modalTitle");

        title.innerText = ""; 
        
        // Success Screen with Rating Feature
        body.innerHTML = `
            <div style="text-align: center; padding: 20px 10px;">
                <div style="font-size: 50px; margin-bottom: 15px;">✅</div>
                <h2 style="color: #00ff88; margin-bottom: 10px;">PAYMENT SUCCESSFUL!</h2>
                <p style="color: #ccc; margin-bottom: 20px;">Professional is on the way!</p>
                
                <div id="ratingSection" style="background: #2a2a2a; padding: 20px; border-radius: 15px;">
                    <p style="color: #fff; margin-bottom: 10px;">Rate your experience:</p>
                    <div style="font-size: 30px; cursor: pointer; margin-bottom: 15px;">
                        <span onclick="setRating(1)" class="star">☆</span>
                        <span onclick="setRating(2)" class="star">☆</span>
                        <span onclick="setRating(3)" class="star">☆</span>
                        <span onclick="setRating(4)" class="star">☆</span>
                        <span onclick="setRating(5)" class="star">☆</span>
                    </div>
                    <button onclick="submitRating()" style="background: #00ff88; border: none; padding: 8px 20px; border-radius: 5px; font-weight: bold; cursor: pointer;">Submit Rating</button>
                </div>
                
                <button onclick="closeModal()" style="margin-top: 25px; color: #aaa; background: transparent; border: none; text-decoration: underline; cursor: pointer;">Skip & Close</button>
            </div>
        `;
    }, 2000);
}

// Rating Logic
let selectedRating = 0;
function setRating(n) {
    selectedRating = n;
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < n) {
            star.innerText = '★';
            star.style.color = '#ffcc00';
        } else {
            star.innerText = '☆';
            star.style.color = '#fff';
        }
    });
}

function submitRating() {
    if(selectedRating === 0) {
        alert("Please select a star rating!");
        return;
    }
    const ratingSection = document.getElementById('ratingSection');
    ratingSection.innerHTML = `
        <p style="color: #00ff88; font-weight: bold; font-size: 1.1rem;">❤️ Thank you for the ${selectedRating} star rating!</p>
    `;
    setTimeout(closeModal, 2000); // Close modal automatically after 2 seconds
}

/* --- 4. LIVE SEARCH --- */
function searchService() {
    let input = document.getElementById('searchInput').value.toLowerCase();
    let cards = document.getElementsByClassName('card');
    for (let i = 0; i < cards.length; i++) {
        let title = cards[i].getElementsByTagName('h3')[0].innerText.toLowerCase();
        cards[i].style.display = title.includes(input) ? "block" : "none";
    }
}

/* --- 5. INITIALIZE --- */
window.onload = function() {
    getLocation();
    // Contact Form Logic (if exists)
    const serviceForm = document.getElementById('serviceForm');
    if (serviceForm) {
        serviceForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('userName').value;
            const formContainer = document.getElementById('formContainer');
            formContainer.style.opacity = "0";
            setTimeout(() => {
                formContainer.style.display = "none";
                document.getElementById('thankYouMsg').style.display = 'block';
                document.getElementById('displayNm').innerText = name;
            }, 500);
        });
    }
};

window.onclick = (e) => { if (e.target == document.getElementById("infoModal")) closeModal(); }