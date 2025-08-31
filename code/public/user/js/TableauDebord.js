// Fonction pour créer ou mettre à jour un cookie
function setCookie(name, value, days) {
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
function updateLastSectionCookie(index) {
    setCookie('lastSection', index, 7); // Cookie valable 7 jours
}

document.addEventListener('DOMContentLoaded', function() {
    
    const sections = document.querySelectorAll('.section');
    const options = document.querySelectorAll('.tableauDeBord__content .opt');
    const tableauDeBord = document.getElementById("tableauDeBord");



    // Vérifier si un cookie existe pour la dernière section
    const lastSectionIndex = getCookie('lastSection');
    if (lastSectionIndex !== null && sections[lastSectionIndex] && options[lastSectionIndex]) {
        // Charger la dernière section et option depuis le cookie
        sections.forEach(section => section.classList.remove('active'));
        options.forEach(option => option.classList.add('opt--noir'));
        sections[lastSectionIndex].classList.add('active');
        options[lastSectionIndex].classList.remove('opt--noir');
    } else {
        // Afficher la première section par défaut
        if (sections.length > 0) {
            sections[0].classList.add('active');
            options[0].classList.remove('opt--noir');
        }
    }

    // Ajouter un événement pour chaque option
    options.forEach((option, index) => {
        option.addEventListener('click', () => {
            sections.forEach(section => section.classList.remove('active'));
            options.forEach(option => option.classList.add('opt--noir'));
            sections[index].classList.add('active');
            options[index].classList.remove('opt--noir');

            // Mettre à jour le cookie avec la nouvelle section
            updateLastSectionCookie(index);

            // Fermer le menu après avoir sélectionné une option
            tableauDeBord.classList.remove("tableauDeBord--visible");
        });
    });
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
