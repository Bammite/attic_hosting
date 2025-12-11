document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('userToken');
    const loader = document.getElementById('loader-container');
    const profileContent = document.getElementById('profile-details-content');

    if (!token) {
        alert("Vous n'êtes pas connecté. Redirection vers la page de connexion.");
        window.location.href = '/auth.html';
        return;
    }

    const showLoader = () => {
        if (loader) loader.innerHTML = '<div class="loader"></div>';
    };

    const hideLoader = () => {
        if (loader) loader.innerHTML = '';
    };

    const fetchUserProfile = async () => {
        showLoader();
        try {
            const response = await fetch('/api/users/me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 401) {
                localStorage.removeItem('userToken');
                alert("Votre session a expiré. Veuillez vous reconnecter.");
                window.location.href = '/auth.html';
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erreur serveur.');
            }

            const user = await response.json();
            renderProfile(user);

        } catch (error) {
            console.error('Erreur lors de la récupération du profil:', error);
            profileContent.innerHTML = `<p style="text-align: center; color: red;">Impossible de charger les informations du profil.</p>`;
        } finally {
            hideLoader();
            profileContent.style.display = 'block';
        }
    };

    const renderProfile = (user) => {
        profileContent.innerHTML = `
            <div class="detail-item"><span class="label">Nom d'utilisateur:</span> <span class="value">${user.username}</span></div>
            <div class="detail-item"><span class="label">Email:</span> <span class="value">${user.email}</span></div>
            <div class="detail-item"><span class="label">Rôle:</span> <span class="value">${user.role || 'Utilisateur'}</span></div>
        `;
    };

    fetchUserProfile();
});