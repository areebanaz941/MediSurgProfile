/**
 * Medi Surg International - Main JavaScript File
 * Author: Areeba Naz
 * Version: 1.0
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize AOS animation library
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
    }
    
    // Navbar shrink on scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navbarToggler = document.querySelector('.navbar-toggler');
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            }
        });
    });

    // Active link on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            
            if (window.pageYOffset >= sectionTop - navbarHeight - 50) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    // Initialize the interactive hospital map
    try {
        if (document.getElementById('hospital-map') && typeof L !== 'undefined') {
            // Create map centered on Islamabad, Pakistan
            const hospitalMap = L.map('hospital-map').setView([33.6844, 73.0479], 10);
            
            // Add OSM tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 18
            }).addTo(hospitalMap);
            
            // Create custom icon for map markers with company logo - using a red marker for simplicity
            const hospitalIcon = L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });
            
            // Define hospital locations
            const hospitals = [
                {
                    name: "Shifa International Hospital",
                    location: [33.6800, 73.0802],
                    address: "Sector H-8/4, Islamabad",
                    type: "Major Medical Center"
                },
                {
                    name: "Maroof International Hospital",
                    location: [33.6932, 73.0511],
                    address: "F-10 Markaz, Islamabad",
                    type: "Major Medical Center"
                },
                {
                    name: "PIMS Hospital",
                    location: [33.7016, 73.0522],
                    address: "G-8/3, Islamabad",
                    type: "Government Hospital"
                },
                {
                    name: "Holy Family Hospital",
                    location: [33.6474, 73.0645],
                    address: "Satellite Town, Rawalpindi",
                    type: "Government Hospital"
                },
                {
                    name: "Benazir Bhutto Hospital",
                    location: [33.6339, 73.0691],
                    address: "Murree Road, Rawalpindi",
                    type: "Government Hospital"
                },
                {
                    name: "Ayub Medical Complex",
                    location: [34.1688, 73.2215],
                    address: "Mandian, Abbottabad",
                    type: "Regional Hospital"
                }
            ];
            
            // Add markers for each hospital
            hospitals.forEach(hospital => {
                const marker = L.marker(hospital.location, {icon: hospitalIcon}).addTo(hospitalMap);
                
                const popupContent = `
                    <div class="map-marker-popup">
                        <h4>${hospital.name}</h4>
                        <p><strong>Type:</strong> ${hospital.type}</p>
                        <p><strong>Address:</strong> ${hospital.address}</p>
                    </div>
                `;
                
                marker.bindPopup(popupContent);
            });
            
            // Add company office marker
            const officeIcon = L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });
            
            const officeMarker = L.marker([33.6565, 73.0181], {icon: officeIcon}).addTo(hospitalMap);
            officeMarker.bindPopup(`
                <div class="map-marker-popup">
                    <h4>Medi Surg International</h4>
                    <p><strong>Headquarters</strong></p>
                    <p>Office no 3, 1st floor, Ahmad plaza I-10 markaz, Islamabad.</p>
                    <p>+92-310-0085387</p>
                </div>
            `);
            
            // Draw connections from office to hospitals
            hospitals.forEach(hospital => {
                const latlngs = [
                    [33.6565, 73.0181], // Office location
                    hospital.location
                ];
                
                const polyline = L.polyline(latlngs, {
                    color: '#b23c3c',
                    weight: 2,
                    opacity: 0.7,
                    dashArray: '5, 10'
                }).addTo(hospitalMap);
            });
        } else {
            console.log('Map container not found or Leaflet not loaded');
            
            // Create a simple map alternative if Leaflet isn't available
            const mapContainer = document.getElementById('hospital-map');
            if (mapContainer) {
                mapContainer.innerHTML = `
                    <div class="text-center p-5">
                        <h3>Our Hospital Network</h3>
                        <p>We serve major hospitals in Islamabad, Rawalpindi, and Abbottabad regions.</p>
                        <p>Our headquarters is located at Office no 3, 1st floor, Ahmad plaza I-10 markaz, Islamabad.</p>
                    </div>
                `;
            }
        }
    } catch (error) {
        console.error('Error initializing map:', error);
    }

    // Back to top button
    const backToTopButton = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('active');
        } else {
            backToTopButton.classList.remove('active');
        }
    });
    
    backToTopButton.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const message = document.getElementById('message').value;
            
            // Basic validation
            if (!name || !email || !message) {
                alert('Please fill in all required fields');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // Here you would normally send the data to a server
            // For now, we'll just show a success message
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }

    // Initialize Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});
