document.addEventListener('DOMContentLoaded', function () {
    // Gestion des onglets
    const tabs = document.querySelectorAll('.offer-tab-btn');
    const panels = document.querySelectorAll('.offer-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = document.getElementById(tab.dataset.target);

            // Désactiver tous les onglets et panneaux
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));

            // Activer l'onglet et le panneau cliqués
            tab.classList.add('active');
            target.classList.add('active');
        });
    });

    // Gestion de la FAQ
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Optionnel : fermer les autres questions
            faqItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-answer').style.maxHeight = null;
            });

            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });
});