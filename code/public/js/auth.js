document.addEventListener('DOMContentLoaded', () => {
    const showLoginBtn = document.getElementById('show-login');
    const showSignupBtn = document.getElementById('show-signup');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const goToSignupLink = document.getElementById('go-to-signup');
    const goToLoginLink = document.getElementById('go-to-login');

    // Éléments du formulaire d'inscription pour la logique dynamique
    const isStudentYes = document.getElementById('isStudentYes');
    const isStudentNo = document.getElementById('isStudentNo');
    const establishmentSelectGroup = document.getElementById('establishment-select-group');
    const ugbUfrGroup = document.getElementById('ugb-ufr-group');
    const otherEstablishmentGroup = document.getElementById('other-establishment-name-group');
    const establishmentSelect = document.getElementById('signup-establishment');

    const switchToLogin = () => {
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
        showLoginBtn.classList.add('active');
        showSignupBtn.classList.remove('active');
    };

    const switchToSignup = () => {
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
        showSignupBtn.classList.add('active');
        showLoginBtn.classList.remove('active');
    };

    showLoginBtn.addEventListener('click', switchToLogin);
    goToLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        switchToLogin();
    });

    showSignupBtn.addEventListener('click', switchToSignup);
    goToSignupLink.addEventListener('click', (e) => {
        e.preventDefault();
        switchToSignup();
    });

    // Logique pour les champs dynamiques du formulaire d'inscription
    const toggleStudentFields = () => {
        const isStudent = isStudentYes.checked;
        establishmentSelectGroup.classList.toggle('hidden-field', !isStudent);
        if (!isStudent) {
            ugbUfrGroup.classList.add('hidden-field');
            otherEstablishmentGroup.classList.add('hidden-field');
        }
    };

    isStudentYes.addEventListener('change', toggleStudentFields);
    isStudentNo.addEventListener('change', toggleStudentFields);

    establishmentSelect.addEventListener('change', () => {
        const selectedValue = establishmentSelect.value;
        ugbUfrGroup.classList.toggle('hidden-field', selectedValue !== 'UGB');
        otherEstablishmentGroup.classList.toggle('hidden-field', selectedValue !== 'AUTRE');
    });

    // --- Logique d'API ---

    const handleApiResponse = async (response) => {
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Une erreur est survenue.');
        }
        return data;
    };

    // Gestion de la connexion
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await handleApiResponse(response);
            
            // Sauvegarder le token et rediriger
            localStorage.setItem('userToken', data.token);
            alert('Connexion réussie !');
            window.location.href = './user/dashboard.html'; // Rediriger vers le tableau de bord

        } catch (error) {
            alert(`Erreur de connexion: ${error.message}`);
        }
    });

    // Gestion de l'inscription
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;

        if (password !== confirmPassword) {
            alert('Les mots de passe ne correspondent pas.');
            return;
        }

        const isDeveloperRadio = document.querySelector('input[name="isDeveloper"]:checked');
        const isStudentRadio = document.querySelector('input[name="isStudent"]:checked');

        if (!isDeveloperRadio || !isStudentRadio) {
            alert('Veuillez répondre à toutes les questions de profil.');
            return;
        }

        const formData = {
            username: document.getElementById('signup-username').value,
            email: document.getElementById('signup-email').value,
            password: password,
            isDeveloper: isDeveloperRadio.value === 'yes',
            isStudent: isStudentRadio.value === 'yes',
            // Vous pouvez ajouter les autres champs (établissement, etc.) ici si nécessaire
        };

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(formData),
            });

            const data = await handleApiResponse(response);

            // Sauvegarder le token et rediriger
            localStorage.setItem('userToken', data.token);
            alert('Inscription réussie ! Vous êtes maintenant connecté.');
            window.location.href = './user/dashboard.html'; // Rediriger vers le tableau de bord

        } catch (error) {
            alert(`Erreur d'inscription: ${error.message}`);
        }
    });
});