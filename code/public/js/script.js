// script.js

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    // const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    // const navLinks = document.querySelector('.nav-links');
    
    // if (mobileMenuBtn && navLinks) {
    //     mobileMenuBtn.addEventListener('click', function() {
    //         navLinks.classList.toggle('active');
    //     });

    //     // Fermer le menu lors du clic sur un lien
    //     navLinks.querySelectorAll('a').forEach(link => {
    //         link.addEventListener('click', () => {
    //             navLinks.classList.remove('active');
    //         });
    //     });

    //     // Fermer le menu lors du clic en dehors
    //     document.addEventListener('click', (e) => {
    //         if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
    //             navLinks.classList.remove('active');
    //         }
    //     });
    // }
    
    // Scroll Effect for Navigation
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('.glass-nav');
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
    
    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open et si la largeur de l'ecran est inferieure a 670px
                if (navLinks && window.getComputedStyle(navLinks).display === 'flex' && window.innerWidth <= 670 ) {
                    navLinks.style.display = 'none';
                }
            }
        });
    });
    
    // Typing Animation avec configuration améliorée
    if (typeof Typed !== 'undefined') {
        new Typed('.typing-animation', {
            strings: [
                "Transformez vos idées en services numériques innovants",
                "Développez des solutions digitales puissantes",
                "Créez un avenir numérique au pour votre entreprise",
                "Innovez avec l'agence Bammite"
            ],
            typeSpeed: 50,
            backSpeed: 30,
            loop: true,
            showCursor: true,
            // cursorChar: '|',
            autoInsertCss: false,
            smartBackspace: true
        });
    }
    
    // Initialize Particles.js
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: "#ffffff"
                },
                shape: {
                    type: "circle",
                    stroke: {
                        width: 0,
                        color: "#000000"
                    },
                    polygon: {
                        nb_sides: 5
                    }
                },
                opacity: {
                    value: 0.5,
                    random: false,
                    anim: {
                        enable: false,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: false,
                        speed: 40,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#ffffff",
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: "none",
                    random: false,
                    straight: false,
                    out_mode: "out",
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: {
                        enable: true,
                        mode: "grab"
                    },
                    onclick: {
                        enable: true,
                        mode: "push"
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    bubble: {
                        distance: 400,
                        size: 40,
                        duration: 2,
                        opacity: 8,
                        speed: 10
                    },
                    repulse: {
                        distance: 200,
                        duration: 4
                    },
                    push: {
                        particles_nb: 4
                    },
                    remove: {
                        particles_nb: 2
                    }
                }
            },
            retina_detect: true
        });
    }
    
    // Animation on Scroll
 // Dans script.js, remplacer l'animation on scroll par IntersectionObserver
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.feature-card, .step, .doc-card').forEach(el => {
    observer.observe(el);
});
    
    // Set initial state for animated elements
    const animatedElements = document.querySelectorAll('.feature-card, .step, .doc-card');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // window.addEventListener('scroll', animateOnScroll);
    // animateOnScroll(); // Run once on load
});






