document.addEventListener("DOMContentLoaded", function() {
    const footerPlaceholder = document.getElementById("footer-placeholder");

    if (footerPlaceholder) {
        const footerHTML = `
        <footer class="main-footer">
            <div class="container">
                <div class="footer-grid">
                    <div class="footer-col">
                        <img src="assets/svg/logoAttic.svg" alt="Sanarois Logo" class="footer-logo" loading="lazy">
                        <p>Bammite est une entreprise spécialisée dans les solutions d'hébergement web et cloud, offrant des services performants, sécurisés et évolutifs pour tous vos projets numériques.</p>
                    </div>
                    
                    <div class="footer-col">
                        <h4>Services</h4>
                        <ul>
                            <li><a href="tarifs.html#hebergement">Hébergement Web</a></li>
                            <li><a href="tarifs.html#vps">Serveurs VPS</a></li>
                            <li><a href="tarifs.html#domaines">Noms de domaine</a></li>
                            <li><a href="tarifs.html#api-chatbot">API</a></li>
                        </ul>
                    </div>
                    
                    <div class="footer-col">
                        <h4>Support</h4>
                        <ul>
                            <li><a href="#">Contacter le support</a></li>
                            <li><a href="#">Centre d'aide (FAQ)</a></li>
                            <li><a href="#">Documentation</a></li>
                        </ul>
                    </div>
                    
                    <div class="footer-col">
                        <h4>Suivez-nous</h4>
                        <ul class="contact-info" style="margin-bottom: 20px;">
                            <li><i class="fas fa-envelope"></i> contact@sanarois.sn</li>
                            <li><i class="fas fa-phone"></i> +221 33 123 45 67</li>
                        </ul>
                        <div class="social-links">
                            <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                            <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
                            <a href="#" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                            <a href="#" aria-label="GitHub"><i class="fab fa-github"></i></a>
                        </div>
                    </div>
                </div>
                
                <div class="footer-bottom">
                    <div class="copyright">&copy; 2025 Sanarois Services. Tous droits réservés.</div>
                    <div class="legal-links">
                        <a href="#">Conditions d'utilisation</a>
                        <a href="#">Politique de confidentialité</a>
                    </div>
                </div>
            </div>
        </footer>
        `;
        footerPlaceholder.innerHTML = footerHTML;

        // Correction pour le style du logo dans le footer
        const footerLogo = footerPlaceholder.querySelector('.footer-logo');
        
    }
});