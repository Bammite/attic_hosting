// auth.js
document.addEventListener('DOMContentLoaded', function() {
    const showLoginBtn = document.getElementById('show-login');
    const showSignupBtn = document.getElementById('show-signup');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const goToSignupLink = document.getElementById('go-to-signup');
    const goToLoginLink = document.getElementById('go-to-login');

    const isStudentYesRadio = document.getElementById('isStudentYes');
    const isStudentNoRadio = document.getElementById('isStudentNo');
    
    const establishmentSelectGroup = document.getElementById('establishment-select-group');
    const establishmentSelect = document.getElementById('signup-establishment');
    const ugbUfrGroup = document.getElementById('ugb-ufr-group');
    const ugbUfrSelect = document.getElementById('signup-ugb-ufr');
    const otherEstablishmentNameGroup = document.getElementById('other-establishment-name-group');
    const otherEstablishmentNameInput = document.getElementById('signup-other-establishment-name');

    function showForm(formToShow, btnToActivate) {
        // Hide all forms
        loginForm.classList.remove('active');
        signupForm.classList.remove('active');

        // Deactivate all buttons
        showLoginBtn.classList.remove('active');
        showSignupBtn.classList.remove('active');

        // Show the target form and activate button
        formToShow.classList.add('active');
        btnToActivate.classList.add('active');
    }

    if (showLoginBtn && showSignupBtn && loginForm && signupForm) {
        showLoginBtn.addEventListener('click', () => {
            showForm(loginForm, showLoginBtn);
        });

        showSignupBtn.addEventListener('click', () => {
            showForm(signupForm, showSignupBtn);
        });

        goToSignupLink.addEventListener('click', (e) => { e.preventDefault(); showForm(signupForm, showSignupBtn); });
        goToLoginLink.addEventListener('click', (e) => { e.preventDefault(); showForm(loginForm, showLoginBtn); });

        // Logic to show/hide student-specific fields
        if (isStudentYesRadio && isStudentNoRadio && establishmentSelectGroup && ugbUfrGroup && otherEstablishmentNameGroup) {
            
            function resetStudentFields() {
                establishmentSelectGroup.classList.add('hidden-field');
                if(establishmentSelect) establishmentSelect.required = false;
                
                ugbUfrGroup.classList.add('hidden-field');
                if(ugbUfrSelect) ugbUfrSelect.required = false;
                
                otherEstablishmentNameGroup.classList.add('hidden-field');
                if(otherEstablishmentNameInput) otherEstablishmentNameInput.required = false;
            }

            isStudentYesRadio.addEventListener('change', function() {
                if (this.checked) {
                    establishmentSelectGroup.classList.remove('hidden-field');
                    if(establishmentSelect) establishmentSelect.required = true;
                    // Trigger change on establishmentSelect in case a value is already selected (e.g. browser autofill)
                    if(establishmentSelect) establishmentSelect.dispatchEvent(new Event('change'));
                }
            });

            isStudentNoRadio.addEventListener('change', function() {
                if (this.checked) {
                    resetStudentFields();
                }
            });

            if (establishmentSelect) {
                establishmentSelect.addEventListener('change', function() {
                    const selectedValue = this.value;

                    // Hide all conditional fields first
                    ugbUfrGroup.classList.add('hidden-field');
                    if(ugbUfrSelect) ugbUfrSelect.required = false;
                    otherEstablishmentNameGroup.classList.add('hidden-field');
                    if(otherEstablishmentNameInput) otherEstablishmentNameInput.required = false;

                    if (selectedValue === 'UGB') {
                        ugbUfrGroup.classList.remove('hidden-field');
                        if(ugbUfrSelect) ugbUfrSelect.required = true;
                    } else if (selectedValue === 'AUTRE_PUBLIC' || selectedValue === 'PRIVE' || selectedValue === 'AUTRE') {
                        otherEstablishmentNameGroup.classList.remove('hidden-field');
                        if(otherEstablishmentNameInput) otherEstablishmentNameInput.required = true;
                    }
                });
            }
            
            // Initial check in case the form is pre-filled or user navigates back
            if (isStudentYesRadio.checked) {
                establishmentSelectGroup.classList.remove('hidden-field');
                if(establishmentSelect) establishmentSelect.required = true;
                if(establishmentSelect) establishmentSelect.dispatchEvent(new Event('change'));
            }
        }
    }
});