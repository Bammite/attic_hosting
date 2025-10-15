document.addEventListener('DOMContentLoaded', () => {
    const userList = document.getElementById('user-list');
    const addUserForm = document.getElementById('add-user-form');

    const API_URL = '/api/admin/users';

    /**
     * Affiche une notification simple.
     */
    const notify = (message, isError = false) => {
        alert(message); // Simple alerte, peut être remplacée par une plus belle notification.
        if (isError) console.error(message);
    };

    /**
     * Récupère et affiche la liste des utilisateurs.
     */
    const fetchUsers = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Impossible de charger les utilisateurs.');
            }
            const users = await response.json();
            renderUsers(users);
        } catch (error) {
            notify(error.message, true);
        }
    };

    /**
     * Affiche les utilisateurs dans le tableau.
     */
    const renderUsers = (users) => {
        userList.innerHTML = '';
        if (users.length === 0) {
            userList.innerHTML = '<tr><td colspan="7">Aucun utilisateur trouvé.</td></tr>';
            return;
        }
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>${user.developpeur ? 'Oui' : 'Non'}</td>
                <td>${user.etudiant ? 'Oui' : 'Non'}</td>
                <td>${new Date(user.created_at).toLocaleDateString()}</td>
                <td>
                    <button class="btn-danger" data-id="${user.id}" title="Supprimer l'utilisateur">&#128465;</button>
                </td>
            `;
            userList.appendChild(row);
        });
    };

    /**
     * Gère la soumission du formulaire d'ajout.
     */
    addUserForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userData = {
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            role: document.getElementById('role').value,
            developpeur: document.getElementById('developpeur').checked,
            etudiant: document.getElementById('etudiant').checked,
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message);

            notify('Utilisateur ajouté avec succès !');
            addUserForm.reset();
            fetchUsers(); // Rafraîchir la liste
        } catch (error) {
            notify(error.message, true);
        }
    });

    /**
     * Gère la suppression d'un utilisateur (délégation d'événement).
     */
    userList.addEventListener('click', async (e) => {
        if (e.target.matches('.btn-danger')) {
            const userId = e.target.dataset.id;
            if (confirm(`Voulez-vous vraiment supprimer cet utilisateur (ID: ${userId}) ?`)) {
                try {
                    const response = await fetch(`${API_URL}/${userId}`, { method: 'DELETE' });
                    const result = await response.json();
                    if (!response.ok) throw new Error(result.message);

                    notify('Utilisateur supprimé !');
                    fetchUsers(); // Rafraîchir la liste
                } catch (error) {
                    notify(error.message, true);
                }
            }
        }
    });

    // Chargement initial des utilisateurs
    fetchUsers();
});
