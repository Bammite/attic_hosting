/**
 * Gère l'affichage d'une animation de chargement.
 */

/**
 * Affiche une animation de chargement dans un conteneur spécifié.
 * @param {HTMLElement} container L'élément où l'animation doit être affichée.
 */
function showLoader(container) {
    container.innerHTML = '<div class="loader"></div>';
    container.style.display = 'flex';
}

/**
 * Masque l'animation de chargement et le conteneur.
 * @param {HTMLElement} container L'élément contenant l'animation.
 */
function hideLoader(container) {
    container.innerHTML = '';
    container.style.display = 'none';
}