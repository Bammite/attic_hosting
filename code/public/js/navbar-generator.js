document.addEventListener("DOMContentLoaded", function() {
    const navbarPlaceholder = document.getElementById("navbar-placeholder");

    if (navbarPlaceholder) {
        const navbarHTML = `
        <nav class="glass-nav">
            <div class="container">
                <a href="./index.html" class="nav-brand">
                    <picture>
                        <source srcset="assets/images/bammiteLogo.webp" type="image/webp">
                        <source srcset="assets/images/bammiteLogo.png" type="image/png">
                        <img src="assets/images/bammiteLogo.png" alt="Sanarois Logo" class="logo">
                    </picture>
                </a>

                <div class="nav-content-wrapper">
                    <div class="nav-panel main-nav-panel">
                        <ul class="nav-links">
                            <span class="nav-links-left">
                                <li><a href="tarifs.html">Tarifs</a></li>

                                <li class="nav-item-with-dropdown" data-menu="services">
                                    <a>Services <i class="fas fa-chevron-down"></i></a>
                                    <div class="dropdown-panel" id="services-menu">
                                        <div class="dropdown-column">
                                            <h4 class="dropdown-title">Hébergements</h4>
                                            <a href="#" class="dropdown-link">
                                                <i class="fas fa-globe"></i>
                                                <div>
                                                    <span class="link-title">Nom de domaine</span>
                                                    <span class="link-description">Trouvez et enregistrez le nom parfait.</span>
                                                </div>
                                            </a>
                                            <a href="#" class="dropdown-link">
                                                <i class="fas fa-server"></i>
                                                <div>
                                                    <span class="link-title">Hébergement Web</span>
                                                    <span class="link-description">Solutions fiables pour vos sites web.</span>
                                                </div>
                                            </a>
                                            <a href="#" class="dropdown-link">
                                                <i class="fas fa-hdd"></i>
                                                <div>
                                                    <span class="link-title">Hébergement VPS</span>
                                                    <span class="link-description">Un serveur virtuel puissant pour vos projets.</span>
                                                </div>
                                            </a>
                                            <a href="#" class="dropdown-link">
                                                <i class="fas fa-database"></i>
                                                <div>
                                                    <span class="link-title">Base de données</span>
                                                    <span class="link-description">Manager une BDD sécurisée, SQL & NoSQL.</span>
                                                </div>
                                            </a>
                                        </div>
                                        <div class="dropdown-column">
                                            <h4 class="dropdown-title">Création & Développement</h4>
                                            <a href="#" class="dropdown-link">
                                                <i class="fas fa-laptop-code"></i>
                                                <div>
                                                    <span class="link-title">Application Web</span>
                                                    <span class="link-description">Créons ensemble votre application web sur mesure.</span>
                                                </div>
                                            </a>
                                            <a href="#" class="dropdown-link">
                                                <i class="fas fa-mobile-alt"></i>
                                                <div>
                                                    <span class="link-title">Application Mobile</span>
                                                    <span class="link-description">Développez votre app avec nos experts.</span>
                                                </div>
                                            </a>
                                            <a href="#" class="dropdown-link">
                                                <i class="fas fa-cogs"></i>
                                                <div>
                                                    <span class="link-title">Logiciel</span>
                                                    <span class="link-description">Concevez des logiciels personnalisés.</span>
                                                </div>
                                            </a>
                                        </div>
                                        <div class="dropdown-column">
                                            <h4 class="dropdown-title">Cloud</h4>
                                            <a href="#" class="dropdown-link">
                                                <i class="fas fa-cloud"></i>
                                                <div>
                                                    <span class="link-title">API</span>
                                                    <span class="link-description">Des API robustes et évolutives pour vos applications.</span>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                </li>

                                <li class="nav-item-with-dropdown" data-menu="explorer">
                                    <a>Explorer <i class="fas fa-chevron-down"></i></a>
                                    <div class="dropdown-panel" id="explorer-menu">
                                    <div class="dropdown-column">
                                            <h4 class="dropdown-title">Offres populaires</h4>
                                            <a href="#" class="dropdown-link">
                                                <i class="fas fa-shopping-cart"></i>
                                                <div>
                                                    <span class="link-title">E-commerce</span>
                                                    <span class="link-description">Démarrez simplement votre boutique en ligne.</span>
                                                </div>
                                            </a>
                                            <a href="#" class="dropdown-link">
                                                <i class="fas fa-utensils"></i>
                                                <div>
                                                    <span class="link-title">Site pour Restaurant</span>
                                                    <span class="link-description">Avec commande en ligne et réservation.</span>
                                                </div>
                                            </a>
                                            <a href="#" class="dropdown-link">
                                                <i class="fas fa-id-card"></i>
                                                <div>
                                                    <span class="link-title">Site Vitrine</span>
                                                    <span class="link-description">Présentez votre entreprise de manière pro.</span>
                                                </div>
                                            </a>
                                        </div>
                                        <div class="dropdown-column">
                                            <h4 class="dropdown-title">À propos de nous</h4>
                                            <a href="#" class="dropdown-link">
                                                <i class="fas fa-building"></i>
                                                <div>
                                                    <span class="link-title">Qui sommes-nous ?</span>
                                                    <span class="link-description">Découvrez notre mission et notre histoire.</span>
                                                </div>
                                            </a>
                                            <a href="#" class="dropdown-link">
                                                <i class="fas fa-users"></i>
                                                <div>
                                                    <span class="link-title">Nos réseaux sociaux</span>
                                                    <span class="link-description">Suivez-nous pour rester informé.</span>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                </li>
                                
                                <li class="nav-item-with-dropdown" data-menu="support">
                                    <a>Support <i class="fas fa-chevron-down"></i></a>
                                    <div class="dropdown-panel" id="support-menu">
                                        <div class="dropdown-column">
                                            <a href="#" class="dropdown-link">
                                                <i class="fas fa-question-circle"></i><div><span class="link-title">Centre d'aide (FAQ)</span></div>
                                            </a>
                                            <a href="#" class="dropdown-link">
                                                <i class="fas fa-book"></i><div><span class="link-title">Documentation</span></div>
                                            </a>
                                            <a href="#" class="dropdown-link">
                                                <i class="fas fa-headset"></i><div><span class="link-title">Contacter le support</span></div>
                                            </a>
                                        </div>
                                    </div>
                                </li>
                            </span>
                            
                            <li><a href="./user/dashboard.html" class="nav-cta">Espace client</a></li>
                        </ul>
                    </div>
                    
                    <div class="nav-panel sub-nav-panel">
                        <div class="mobile-back-button">
                            <i class="fas fa-chevron-left"></i> <span id="mobile-nav-title">Menu</span>
                        </div>
                        <div class="sub-nav-content">
                        </div>
                    </div>
                </div>

                <div class="mobile-menu-btn">
                    <i class="fas fa-bars"></i>
                </div>

            </div>

            <div class="dropdown-mega-menu">
                <div class="container dropdown-content-container">
                </div>
            </div>
        </nav>
        `;
        navbarPlaceholder.innerHTML = navbarHTML;
    }
});