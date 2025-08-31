document.addEventListener('DOMContentLoaded', () => {
    // Collection de données illustratives pour les rapports
    const reportsData = [
        {
            id: 'rep-001',
            service: 'Hébergement Mutualisé - Premium',
            period: '30 derniers jours',
            date: '2024-07-15',
            type: 'pdf',
            downloadLink: '#'
        },
        {
            id: 'rep-002',
            service: 'Serveur VPS - VPS Pro',
            period: '90 derniers jours',
            date: '2024-07-01',
            type: 'pdf',
            downloadLink: '#'
        },
        {
            id: 'rep-003',
            service: 'Domaine - mon-super-site.sn',
            period: 'Année en cours',
            date: '2024-06-20',
            type: 'pdf',
            downloadLink: '#'
        }
    ];

    const rapportContainer = document.querySelector('#Rapport .rapport-container');
    if (!rapportContainer) return;

    // Génération de la structure HTML de la section
    rapportContainer.innerHTML = `
        <div class="rapport-actions">
            <h3>Générer un nouveau rapport</h3>
            <form id="generate-report-form">
                <div class="form-group">
                    <label for="report-service">Service</label>
                    <select id="report-service" name="service" required>
                        <option value="" disabled selected>Choisir un service...</option>
                        <option value="Hébergement Mutualisé - Premium">Hébergement Mutualisé - Premium</option>
                        <option value="Serveur VPS - VPS Pro">Serveur VPS - VPS Pro</option>
                        <option value="Domaine - mon-super-site.sn">Domaine - mon-super-site.sn</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="report-period">Période</label>
                    <select id="report-period" name="period" required>
                        <option value="" disabled selected>Choisir une période...</option>
                        <option value="30 derniers jours">30 derniers jours</option>
                        <option value="90 derniers jours">90 derniers jours</option>
                        <option value="Année en cours">Année en cours</option>
                    </select>
                </div>
                <button type="submit" class="btn-generate-report">
                    <iconify-icon icon="mdi:file-document-outline"></iconify-icon>
                    Générer
                </button>
            </form>
        </div>
        <div class="rapport-list-container">
            <h3>Rapports récents</h3>
            <div class="rapport-list"></div>
        </div>
    `;

    const reportList = rapportContainer.querySelector('.rapport-list');
    const reportForm = document.getElementById('generate-report-form');

    // Fonction pour afficher les rapports
    function renderReports() {
        reportList.innerHTML = '';
        if (reportsData.length === 0) {
            reportList.innerHTML = `<p class="no-reports">Aucun rapport généré pour le moment.</p>`;
            return;
        }

        reportsData.sort((a, b) => new Date(b.date) - new Date(a.date)); // Trier par date, le plus récent en premier

        reportsData.forEach(report => {
            const reportItem = document.createElement('div');
            reportItem.className = 'rapport-item';
            reportItem.innerHTML = `
                <div class="rapport-icon"><iconify-icon icon="mdi:file-pdf-box" width="32"></iconify-icon></div>
                <div class="rapport-details">
                    <p class="rapport-title">Rapport d'utilisation - ${report.service}</p>
                    <p class="rapport-meta">Généré le ${new Date(report.date).toLocaleDateString('fr-FR')} | Période: ${report.period}</p>
                </div>
                <div class="rapport-download">
                    <a href="${report.downloadLink}" class="btn-download" download>
                        <iconify-icon icon="mdi:download-outline"></iconify-icon> Télécharger
                    </a>
                </div>
            `;
            reportList.appendChild(reportItem);
        });
    }

    // Gérer la soumission du formulaire pour simuler la génération
    reportForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const service = reportForm.elements.service.value;
        const period = reportForm.elements.period.value;
        if (!service || !period) return;

        reportsData.push({ id: `rep-${Date.now()}`, service, period, date: new Date().toISOString().split('T')[0], type: 'pdf', downloadLink: '#' });
        renderReports();
        reportForm.reset();
    });

    renderReports(); // Affichage initial
});