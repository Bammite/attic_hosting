// Fonction pour créer ou mettre à jour un cookie
function setCookie(name, value, days = 7) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
}

// Fonction pour récupérer un cookie
function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(`${name}=`)) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
}

// Fonction pour mettre à jour le cookie avec la dernière section et option
function updateLastSectionCookie(sectionId) {
    setCookie('lastSectionId', sectionId, 7); // Cookie valable 7 jours
}

document.addEventListener('DOMContentLoaded', function() {
    
    // --- Logique pour la modale de gestion des services ---
    const manageBtn = document.getElementById('manage-services-btn');
    const servicesModal = document.getElementById('services-management-modal');
    const closeServicesModal = document.getElementById('close-services-modal');
    const saveServicesConfigBtn = document.getElementById('save-services-config');

    if (manageBtn && servicesModal && closeServicesModal && saveServicesConfigBtn) {
        manageBtn.addEventListener('click', () => {
            servicesModal.style.display = 'block';
        });

        closeServicesModal.addEventListener('click', () => {
            servicesModal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target == servicesModal) {
                servicesModal.style.display = 'none';
            }
        });

        saveServicesConfigBtn.addEventListener('click', () => {
            const checklist = document.getElementById('services-checklist');
            const visibleServices = [];
            checklist.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
                visibleServices.push(checkbox.dataset.serviceLabel);
            });
            localStorage.setItem('visibleServices', JSON.stringify(visibleServices));
            alert('Configuration enregistrée. La page va se recharger.');
            window.location.reload();
        });
    }

    const sections = document.querySelectorAll('.section');
    // On sélectionne toutes les options cliquables qui ont un data-target
    const options = document.querySelectorAll('.tableauDeBord__content .opt[data-target]');
    const tableauDeBord = document.getElementById("tableauDeBord");

    // Fonction pour afficher une section par son ID
    function showSection(sectionId) {
        const targetSection = document.getElementById(sectionId);
        const targetOption = document.querySelector(`.opt[data-target="${sectionId}"]`);

        if (targetSection && targetOption) {
            sections.forEach(section => section.classList.remove('active'));
            options.forEach(option => option.classList.add('opt--noir'));
            
            targetSection.classList.add('active');
            targetOption.classList.remove('opt--noir');
            updateLastSectionCookie(sectionId);
        }
    }

    // Vérifier si un cookie existe pour la dernière section
    const lastSectionId = getCookie('lastSectionId');
    if (lastSectionId) {
        showSection(lastSectionId);
    } else {
        // Afficher la première section par défaut si aucun cookie n'est trouvé
        showSection('accueil'); // 'accueil' est l'ID de la première section
    }

    // Ajouter un événement pour chaque option
    options.forEach(option => {
        option.addEventListener('click', () => {
            const sectionId = option.dataset.target;
            showSection(sectionId);
            // Fermer le menu après avoir sélectionné une option
            tableauDeBord.classList.remove("tableauDeBord--visible");
        });
    });

    // --- Logique pour la recherche dans les services auxiliaires ---
    const searchInput = document.getElementById('aux-service-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            const serviceCards = document.querySelectorAll('.aux-service-card');

            serviceCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();

                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

});

document.addEventListener("DOMContentLoaded", () => {
    const menuBtn = document.getElementById("menuBtn");
    const tableauDeBord = document.getElementById("tableauDeBord");

    menuBtn.addEventListener("click", () => {
        tableauDeBord.classList.toggle("tableauDeBord--visible");
    });
});

///////////////////defilement Creer une entrée

const defilant = document.querySelector('.defilant');
const defilantContent = document.querySelector('.defilant__content');
const defilantText = document.getElementById('textDefil');
let isOpen = false;
const defilantOptions = document.querySelectorAll('.defilant__content .opt');
defilantText.addEventListener('click', () => {
    if (defilantContent.style.height==='0px' || defilantContent.style.height==='') {
        defilantContent.style.height='125px'
    }
    else{
        defilantContent.style.height='0px'
    }
});

// Fonction pour ouvrir une section spécifique
function openSection(sectionName) {
    console.log(`Ouverture de la section : ${sectionName}`);
    const sections = document.querySelectorAll('.section');
    const options = document.querySelectorAll('.tableauDeBord__content .opt');
    const tableauDeBord = document.getElementById("tableauDeBord");

    // Trouver l'index de la section à partir de son ID
    const sectionIndex = Array.from(sections).findIndex(section => section.id === sectionName);
    
    if (sectionIndex !== -1) {
        // Retirer la classe active de toutes les sections
        sections.forEach(section => section.classList.remove('active'));
        options.forEach(option => option.classList.add('opt--noir'));

        // Ajouter la classe active à la section demandée
        sections[sectionIndex].classList.add('active');
        options[sectionIndex].classList.remove('opt--noir');

        // Mettre à jour le cookie avec la nouvelle section
        updateLastSectionCookie(sectionIndex);
        // Fermer le menu après avoir sélectionné une option
        tableauDeBord.classList.remove("tableauDeBord--visible");
    }
}

// Exemple d'utilisation :
// openSection('Facture'); // Pour ouvrir la section Facture
// openSection('Boutique'); // Pour ouvrir la section Boutique
// openSection('Rapport'); // Pour ouvrir la section Rapport









////////////////////////////////  Fiche de paie /////////////////////////////


// Gestion de l'envoi du formulaire de fiche de paie
document.getElementById('FicheDePaie').addEventListener('submit', async (e) => {
    e.preventDefault();

    const FicheData = {
        Idemploye: document.getElementById('idEmployé').value.trim(),
        datePaiement: document.getElementById('datePaiement').value,
        DebutPeriode: document.getElementById('debutPeriode').value,
        FinPeriode: document.getElementById('finPeriode').value,
        typeDePaie: document.getElementById('TypeDePaie').value.trim(),
        modePaiement: document.getElementById('ModePaiement-FicheDePAie').value.trim(),
    };

    try {
        const response = await fetch('/api/AddPaie', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(FicheData)
        });

        const result = await response.json();
        if (response.ok) {
            alert('Paie enregistrée avec succès !');
            document.getElementById('FicheDePaie').reset(); // Réinitialise le formulaire
        } else {
            alert('Erreur : ' + result.message);
        }
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement de la vente :', error);
        alert('Une erreur est survenue.');
    }
});
