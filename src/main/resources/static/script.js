// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Only prevent default if we're on the same page
        if (href.startsWith('#') && !href.includes('index.html')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Navbar Background on Scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Simple validation
        if (name && email && message) {
            // Here you would typically send the form data to a server
            // For now, we'll just show an alert
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        } else {
            alert('Please fill in all fields.');
        }
    });
}

// Intersection Observer for Fade-in Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections and cards
document.querySelectorAll('section, .event-card, .feature-card, .resource-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Active Navigation Link Highlighting
// Set active link based on current page
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    // Remove active class first
    link.classList.remove('active');
    
    // Check if this link matches the current page
    if (linkHref === currentPage || 
        (currentPage === '' && linkHref === 'index.html') ||
        (currentPage === 'index.html' && linkHref === 'index.html')) {
        link.classList.add('active');
    }
    
    // For index.html, also check for hash links
    if (currentPage === 'index.html' || currentPage === '') {
        const hash = window.location.hash;
        if (hash && linkHref === hash) {
            link.classList.add('active');
        }
    }
});

// For index.html, also handle scroll-based active links
if (currentPage === 'index.html' || currentPage === '') {
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            // Only update hash links, not page links
            if (linkHref.startsWith('#')) {
                link.classList.remove('active');
                if (linkHref === `#${current}`) {
                    link.classList.add('active');
                }
            }
        });
    });
}

// Load Events Dynamically
function loadEvents() {
    fetch('/api/public/events')
        .then(response => response.json())
        .then(events => {
            // Separate events into upcoming and past
            const now = new Date();
            const upcomingEvents = events.filter(event => new Date(event.eventDate) >= now && event.category === 'upcoming');
            const pastEvents = events.filter(event => new Date(event.eventDate) < now || event.category === 'past');

            // Populate upcoming events
            const upcomingGrid = document.querySelector('.events-grid');
            if (upcomingGrid) {
                if (upcomingEvents.length === 0) {
                    upcomingGrid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1;">No upcoming events at this time. Check back soon!</p>';
                } else {
                    upcomingGrid.innerHTML = upcomingEvents.map(event => {
                        const eventDate = new Date(event.eventDate);
                        const day = eventDate.getDate();
                        const month = eventDate.toLocaleDateString('en-US', { month: 'short' });

                        return `
                            <div class="event-card">
                                <div class="event-date">
                                    <span class="date-day">${day}</span>
                                    <span class="date-month">${month}</span>
                                </div>
                                <div class="event-content">
                                    <h3>${event.title}</h3>
                                    <p class="event-time">📍 Location: ${event.location} | ${event.time}</p>
                                    <p class="event-description">${event.description}</p>
                                </div>
                            </div>
                        `;
                    }).join('');
                }
            }

            // Populate past events
            const pastGrid = document.querySelector('.past-events-grid');
            if (pastGrid) {
                if (pastEvents.length === 0) {
                    pastGrid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1;">No past events to display.</p>';
                } else {
                    pastGrid.innerHTML = pastEvents.map(event => `
                        <div class="past-event-item">
                            <h4>${event.title}</h4>
                            <p>${event.description}</p>
                            <small>${new Date(event.eventDate).toLocaleDateString()}</small>
                        </div>
                    `).join('');
                }
            }
        })
        .catch(error => {
            console.error('Error loading events:', error);
            const upcomingGrid = document.querySelector('.events-grid');
            if (upcomingGrid) {
                upcomingGrid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1;">Error loading events. Please try again later.</p>';
            }
        });
}

// Load Resources Dynamically
function loadResources() {
    fetch('/api/public/resources')
        .then(response => response.json())
        .then(resources => {
            const resourcesGrid = document.querySelector('.resources-grid');
            if (resourcesGrid) {
                if (resources.length === 0) {
                    resourcesGrid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1;">No resources available at this time. Check back soon!</p>';
                } else {
                    resourcesGrid.innerHTML = resources.map(resource => `
                        <div class="resource-card">
                            <h3>${resource.title}</h3>
                            <p>${resource.description}</p>
                            <p><strong>Category:</strong> ${resource.category}</p>
                            <a href="${resource.link}" target="_blank" class="resource-link">Explore →</a>
                        </div>
                    `).join('');
                }
            }
        })
        .catch(error => {
            console.error('Error loading resources:', error);
            const resourcesGrid = document.querySelector('.resources-grid');
            if (resourcesGrid) {
                resourcesGrid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1;">Error loading resources. Please try again later.</p>';
            }
        });
}

// Load data when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Check which page we're on and load appropriate data
    if (currentPage === 'events.html') {
        loadEvents();
    } else if (currentPage === 'resources.html') {
        loadResources();
    }
});

