

// Données globales pour stocker les champs du formulaire
let formFields = [];
let selectedFieldId = null;
let draggedFieldId = null; // Déclarer la variable globalement

// Éléments DOM
const dropZone = document.getElementById('drop-zone');
const previewForm = document.getElementById('preview-form');
const resetButton = document.getElementById('reset-form');
const saveButton = document.getElementById('save-form');
const addFieldBtn = document.getElementById('add-field-btn');
const addFieldEmptyBtn = document.getElementById('add-field-empty-btn');
const fieldsModal = document.getElementById('fields-modal');
const closeModal = document.getElementById('close-modal');
const fieldTypes = document.querySelectorAll('.field-type');

// Éléments de la modale de propriétés
const propertiesModal = document.getElementById('properties-modal');
const closePropertiesModal = document.getElementById('close-properties-modal');
const propertiesModalBody = document.getElementById('properties-modal-body');

// Éléments du panneau de propriétés (Desktop)
const propertiesForm = document.getElementById('properties-form');
const noSelectionMessage = document.getElementById('no-selection-message');
const fieldLabelInput = document.getElementById('field-label');
const fieldPlaceholderInput = document.getElementById('field-placeholder');
const fieldRequiredCheckbox = document.getElementById('field-required');
const fieldHelpTextarea = document.getElementById('field-help');
const optionsGroup = document.getElementById('options-group');
const optionsList = document.getElementById('options-list');
const addOptionButton = document.getElementById('add-option');

// Écouteurs d'événements pour les boutons d'ajout de champ
addFieldBtn.addEventListener('click', () => {
    fieldsModal.style.display = 'flex';
});

addFieldEmptyBtn.addEventListener('click', () => {
    fieldsModal.style.display = 'flex';
});

closeModal.addEventListener('click', () => {
    fieldsModal.style.display = 'none';
});

closePropertiesModal.addEventListener('click', () => {
    propertiesModal.style.display = 'none';
});

// Fermer la modale en cliquant en dehors
fieldsModal.addEventListener('click', (e) => {
    if (e.target === fieldsModal) fieldsModal.style.display = 'none';
});

propertiesModal.addEventListener('click', (e) => {
    if (e.target === propertiesModal) propertiesModal.style.display = 'none';
});

// Écouteurs d'événements pour les types de champs dans la modal
fieldTypes.forEach(type => {
    type.addEventListener('click', () => {
        addFieldToWorkspace(type.dataset.type);
        fieldsModal.style.display = 'none';
    });
});

// --- LOGIQUE DESKTOP (> 1050px) ---
// Clic sur les champs de la sidebar pour les ajouter
document.querySelectorAll('.sidebar .field-item').forEach(item => {
    item.addEventListener('click', () => {
        addFieldToWorkspace(item.dataset.type);
    });
});

// Écouteurs pour le panneau de propriétés
if (fieldLabelInput) {
    fieldLabelInput.addEventListener('input', (e) => {
        if (!selectedFieldId) return;
        updateFieldProperty(selectedFieldId, 'label', e.target.value);
    });
}

if (fieldPlaceholderInput) {
    fieldPlaceholderInput.addEventListener('input', (e) => {
        if (!selectedFieldId) return;
        updateFieldProperty(selectedFieldId, 'placeholder', e.target.value);
    });
}

if (fieldRequiredCheckbox) {
    fieldRequiredCheckbox.addEventListener('change', (e) => {
        if (!selectedFieldId) return;
        updateFieldProperty(selectedFieldId, 'required', e.target.checked);
    });
}

if (fieldHelpTextarea) {
    fieldHelpTextarea.addEventListener('input', (e) => {
        if (!selectedFieldId) return;
        updateFieldProperty(selectedFieldId, 'help', e.target.value);
    });
}

// Écouteurs d'événements pour les boutons d'action
resetButton.addEventListener('click', resetForm);
saveButton.addEventListener('click', saveForm);

// Fonction pour ajouter un champ à la zone de travail
function addFieldToWorkspace(type) {
    const fieldId = 'field_' + Date.now();
    const fieldData = {
        id: fieldId,
        type: type,
        label: getDefaultLabel(type),
        placeholder: '',
        required: false,
        help: '',
        options: type === 'select' || type === 'checkbox' || type === 'radio' ? ['Option 1'] : []
    };

    formFields.push(fieldData);
    renderWorkspace();
    renderPreview();
    selectField(fieldId);
}

// Fonction pour obtenir un label par défaut basé sur le type de champ
function getDefaultLabel(type) {
    const labels = {
        text: 'Champ texte',
        textarea: 'Zone de texte',
        email: 'Adresse email',
        number: 'Nombre',
        select: 'Liste déroulante',
        checkbox: 'Cases à cocher',
        radio: 'Boutons radio',
        date: 'Date',
        file: 'Téléversement de fichier'
    };
    return labels[type] || 'Nouveau champ';
}

// Fonction pour rendre la zone de travail
function renderWorkspace() {
    // Supprimer le message vide s'il existe
    const emptyMessage = dropZone.querySelector('.empty-message');
    if (emptyMessage && formFields.length > 0) {
        emptyMessage.remove();
    }

    // Vider la zone de travail
    dropZone.innerHTML = '';

    // Si aucun champ, afficher le message vide
    if (formFields.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'empty-message';
        emptyMsg.innerHTML = `
            <p>Commencez par ajouter votre premier champ</p>
            <button class="btn-primary add-field-btn" id="add-field-empty-btn" style="margin-top: 15px;">Ajouter un champ</button>
        `;
        dropZone.appendChild(emptyMsg);
        
        // Réattacher l'événement au bouton
        document.getElementById('add-field-empty-btn').addEventListener('click', () => {
            fieldsModal.style.display = 'flex';
        });
        return;
    }

    // Ajouter chaque champ
    formFields.forEach(field => {
        const fieldElement = document.createElement('div');
        fieldElement.className = `form-field ${selectedFieldId === field.id ? 'selected' : ''}`;
        fieldElement.setAttribute('data-field-id', field.id);
        fieldElement.setAttribute('draggable', 'true'); // Rendre les champs déplaçables

        // Contenu du champ
        fieldElement.innerHTML = `
            <div class="field-header">
                <input type="text" class="field-label-input" value="${field.label}" placeholder="Label du champ">
                <div class="field-actions">
                    <button class="btn btn-delete" title="Supprimer">
                        <span>🗑️</span>
                    </button>
                </div>
            </div>
            <div class="field-content">
                ${renderFieldContent(field)}
            </div>
            <div class="field-footer">
                <div class="field-settings">
                    <div class="setting-item">
                        <input type="checkbox" id="required-${field.id}" ${field.required ? 'checked' : ''}>
                        <label for="required-${field.id}">Obligatoire</label>
                    </div>
                </div>
                <button class="btn settings-btn" title="Options">
                    <span>⚙️</span>
                </button>
            </div>
        `;

        // Gestionnaire d'événements pour le label
        const labelInput = fieldElement.querySelector('.field-label-input');
        labelInput.addEventListener('input', (e) => {
            updateFieldProperty(field.id, 'label', e.target.value);
        });

        // Gestionnaire d'événements pour le placeholder
        const placeholderInput = fieldElement.querySelector('.field-placeholder-input');
        if (placeholderInput) {
            placeholderInput.addEventListener('input', (e) => {
                updateFieldProperty(field.id, 'placeholder', e.target.value);
            });
        }

        // Gestionnaire d'événements pour les options
        const optionInputs = fieldElement.querySelectorAll('.option-input');
        optionInputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                updateFieldOption(field.id, index, e.target.value);
            });
        });

        // Gestionnaire d'événements pour le bouton de suppression
        const deleteButton = fieldElement.querySelector('.btn-delete');
        deleteButton.addEventListener('click', () => {
            deleteField(field.id);
        });

        // Gestionnaire d'événements pour le bouton obligatoire
        const requiredCheckbox = fieldElement.querySelector(`#required-${field.id}`);
        requiredCheckbox.addEventListener('change', (e) => {
            updateFieldProperty(field.id, 'required', e.target.checked);
        });

        // Gestionnaire d'événements pour le bouton de paramètres (modale)
        const settingsButton = fieldElement.querySelector('.settings-btn');
        settingsButton.addEventListener('click', () => openPropertiesModal(field.id));

        // Gestionnaire d'événements pour la sélection du champ
        fieldElement.addEventListener('click', (e) => {
            // Pour la vue mobile, la sélection est implicite. Pour le bureau, elle est explicite.
            const isMobile = window.innerWidth < 1050;
            if (!isMobile && !e.target.closest('.btn') && !e.target.classList.contains('field-label-input') && !e.target.classList.contains('field-placeholder-input') && !e.target.classList.contains('option-input') && !e.target.matches('input[type="checkbox"], input[type="radio"]')) {
                selectField(field.id);
            }
        });

        // Gestionnaire d'événements pour le début du glisser-déposer
        fieldElement.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', field.id); // Transférer l'ID du champ
            e.dataTransfer.effectAllowed = 'move';
            draggedFieldId = field.id;
            setTimeout(() => fieldElement.classList.add('dragging'), 0); // Ajouter la classe après un court délai
        });

        // Gestionnaire d'événements pour la fin du glisser-déposer
        fieldElement.addEventListener('dragend', () => {
            fieldElement.classList.remove('dragging');
            draggedFieldId = null;
            // Supprimer les classes de survol de tous les champs
            document.querySelectorAll('.form-field').forEach(f => {
                f.classList.remove('drag-over-top', 'drag-over-bottom');
            });
        });

        // Gestionnaire d'événements pour le survol pendant le glisser-déposer
        fieldElement.addEventListener('dragover', (e) => {
            e.preventDefault(); // Autoriser le dépôt
            if (draggedFieldId && draggedFieldId !== field.id) {
                const rect = fieldElement.getBoundingClientRect();
                const mouseY = e.clientY;
                const middleY = rect.top + rect.height / 2;

                // Ajouter une classe pour indiquer si on dépose au-dessus ou en dessous
                if (mouseY < middleY) {
                    fieldElement.classList.remove('drag-over-bottom');
                    fieldElement.classList.add('drag-over-top');
                } else {
                    fieldElement.classList.remove('drag-over-top');
                    fieldElement.classList.add('drag-over-bottom');
                }
            }
        });

        // Gestionnaire d'événements pour quitter le survol
        fieldElement.addEventListener('dragleave', () => {
            fieldElement.classList.remove('drag-over-top', 'drag-over-bottom');
        });

        // Gestionnaire d'événements pour le dépôt
        fieldElement.addEventListener('drop', (e) => {
            e.preventDefault();
            fieldElement.classList.remove('drag-over-top', 'drag-over-bottom');
            if (draggedFieldId && draggedFieldId !== field.id) {
                const rect = fieldElement.getBoundingClientRect();
                const mouseY = e.clientY;
                const middleY = rect.top + rect.height / 2;
                const position = mouseY < middleY ? 'before' : 'after';
                reorderFields(draggedFieldId, field.id, position);
            }
        });

        dropZone.appendChild(fieldElement);
    });
}

// Fonction pour réorganiser les champs
function reorderFields(draggedId, targetId, position) { // position: 'before' or 'after'
    const draggedIndex = formFields.findIndex(f => f.id === draggedId);
    const targetIndex = formFields.findIndex(f => f.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const [draggedItem] = formFields.splice(draggedIndex, 1); // Supprimer l'élément glissé

    let newTargetIndex = targetIndex;
    // Si l'élément glissé était initialement avant la cible,
    // le supprimer décale l'index de la cible de 1.
    if (draggedIndex < targetIndex) {
        newTargetIndex--;
    }

    // Insérer l'élément glissé à la position correcte par rapport à la cible
    if (position === 'after') {
        newTargetIndex++;
    }

    formFields.splice(newTargetIndex, 0, draggedItem);
    renderWorkspace();
    renderPreview();
}

// Fonction pour ouvrir et peupler la modale de propriétés
function openPropertiesModal(fieldId) {
    const field = formFields.find(f => f.id === fieldId);
    if (!field) return;

    selectField(fieldId);

    let optionsHtml = '';
    if (['select', 'checkbox', 'radio'].includes(field.type)) {
        const optionsListHtml = field.options.map((option, index) => `
            <div class="option-item" style="display: flex; gap: 10px; margin-bottom: 10px;">
                <input type="text" value="${option}" placeholder="Option ${index + 1}" data-index="${index}" class="modal-option-input" style="flex: 1;">
                <button type="button" class="btn btn-delete modal-option-delete" data-index="${index}" title="Supprimer l'option"><span>🗑️</span></button>
            </div>
        `).join('');

        optionsHtml = `
            <div class="form-group">
                <label>Options</label>
                <div class="options-list">${optionsListHtml}</div>
                <button type="button" class="btn-add modal-option-add">Ajouter une option</button>
            </div>
        `;
    }

    propertiesModalBody.innerHTML = `
        <div class="form-group">
            <label for="modal-field-label">Label</label>
            <input type="text" id="modal-field-label" placeholder="Label du champ" value="${field.label}">
        </div>
        <div class="form-group">
            <label for="modal-field-placeholder">Placeholder</label>
            <input type="text" id="modal-field-placeholder" placeholder="Texte indicatif" value="${field.placeholder}">
        </div>
        <div class="form-group">
            <div class="checkbox-group">
                <input type="checkbox" id="modal-field-required" ${field.required ? 'checked' : ''}>
                <label for="modal-field-required">Ce champ est obligatoire</label>
            </div>
        </div>
        ${optionsHtml}
        <div class="form-group">
            <label for="modal-field-help">Aide contextuelle</label>
            <textarea id="modal-field-help" placeholder="Description d'aide" rows="3">${field.help}</textarea>
        </div>
    `;

    // Attacher les écouteurs d'événements pour la modale
    propertiesModalBody.querySelector('#modal-field-label').addEventListener('input', (e) => updateFieldProperty(fieldId, 'label', e.target.value));
    propertiesModalBody.querySelector('#modal-field-placeholder').addEventListener('input', (e) => updateFieldProperty(fieldId, 'placeholder', e.target.value));
    propertiesModalBody.querySelector('#modal-field-required').addEventListener('change', (e) => updateFieldProperty(fieldId, 'required', e.target.checked));
    propertiesModalBody.querySelector('#modal-field-help').addEventListener('input', (e) => updateFieldProperty(fieldId, 'help', e.target.value));

    if (['select', 'checkbox', 'radio'].includes(field.type)) {
        propertiesModalBody.querySelector('.modal-option-add').addEventListener('click', () => {
            field.options.push(`Option ${field.options.length + 1}`);
            openPropertiesModal(fieldId); // Re-render modal content
            renderWorkspace();
            renderPreview();
        });

        propertiesModalBody.querySelectorAll('.modal-option-input').forEach(input => {
            input.addEventListener('input', (e) => {
                updateFieldOption(fieldId, parseInt(e.target.dataset.index), e.target.value);
            });
        });

        propertiesModalBody.querySelectorAll('.modal-option-delete').forEach(button => {
            button.addEventListener('click', (e) => {
                if (field.options.length > 1) {
                    field.options.splice(parseInt(e.currentTarget.dataset.index), 1);
                    openPropertiesModal(fieldId); // Re-render modal content
                    renderWorkspace();
                    renderPreview();
                } else {
                    alert('Un champ doit avoir au moins une option.');
                }
            });
        });
    }

    propertiesModal.style.display = 'flex';
}

// Fonction pour afficher et peupler le formulaire de propriétés (Desktop)
function showPropertiesForm(fieldId) {
    const field = formFields.find(f => f.id === fieldId);
    if (!field) {
        propertiesForm.style.display = 'none';
        noSelectionMessage.style.display = 'block';
        return;
    }

    propertiesForm.style.display = 'block';
    noSelectionMessage.style.display = 'none';

    // Remplir les champs
    fieldLabelInput.value = field.label || '';
    fieldPlaceholderInput.value = field.placeholder || '';
    fieldRequiredCheckbox.checked = field.required;
    fieldHelpTextarea.value = field.help || '';

    // Gérer la visibilité du groupe d'options
    if (['select', 'checkbox', 'radio'].includes(field.type)) {
        optionsGroup.style.display = 'block';
        renderOptionsEditor(field);
    } else {
        optionsGroup.style.display = 'none';
    }
}

// Fonction pour rendre l'éditeur d'options dans le panneau de propriétés
function renderOptionsEditor(field) {
    optionsList.innerHTML = '';
    field.options.forEach((option, index) => {
        const optionItem = document.createElement('div');
        optionItem.className = 'option-item';
        optionItem.style.display = 'flex';
        optionItem.style.gap = '10px';
        optionItem.style.marginBottom = '10px';

        const input = document.createElement('input');
        input.type = 'text';
        input.value = option;
        input.placeholder = `Option ${index + 1}`;
        input.style.flex = '1';
        input.addEventListener('input', (e) => {
            updateFieldOption(field.id, index, e.target.value);
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-delete';
        deleteBtn.innerHTML = '<span>🗑️</span>';
        deleteBtn.title = 'Supprimer l\'option';
        deleteBtn.addEventListener('click', () => {
            if (field.options.length > 1) {
                field.options.splice(index, 1);
                renderOptionsEditor(field); // Re-render
                renderWorkspace();
                renderPreview();
            } else {
                alert('Un champ doit avoir au moins une option.');
            }
        });

        optionItem.appendChild(input);
        optionItem.appendChild(deleteBtn);
        optionsList.appendChild(optionItem);
    });
}

// Listener pour le bouton "Ajouter une option"
if (addOptionButton) {
    addOptionButton.addEventListener('click', () => {
        if (!selectedFieldId) return;
        const field = formFields.find(f => f.id === selectedFieldId);
        if (field) {
            field.options.push(`Option ${field.options.length + 1}`);
            renderOptionsEditor(field);
            renderWorkspace();
            renderPreview();
        }
    });
}

// Fonction pour rendre le contenu du champ selon son type
function renderFieldContent(field) {
    switch (field.type) {
        case 'text':
        case 'email':
        case 'number':
        case 'date':
            return `
                <input type="${field.type}" class="field-placeholder-input" placeholder="${field.placeholder || 'Texte indicatif'}" value="${field.placeholder}">
            `;
        case 'textarea':
            return `
                <textarea class="field-placeholder-input" placeholder="${field.placeholder || 'Texte indicatif'}">${field.placeholder}</textarea>
            `;
        case 'select':
            return `
                <select>
                    ${field.options.map(option => `<option>${option}</option>`).join('')}
                </select>
                <div class="field-options">
                    ${field.options.map((option, index) => `
                        <div class="option-item">
                            <input type="text" class="option-input" value="${option}" placeholder="Option ${index + 1}">
                        </div>
                    `).join('')}
                </div>
            `;
        case 'checkbox':
            return `
                <div class="field-options">
                    ${field.options.map((option, index) => `
                        <div class="option-item">
                            <input type="checkbox">
                            <input type="text" class="option-input" value="${option}" placeholder="Option ${index + 1}">
                        </div>
                    `).join('')}
                </div>
            `;
        case 'radio':
            return `
                <div class="field-options">
                    ${field.options.map((option, index) => `
                        <div class="option-item">
                            <input type="radio" name="radio-${field.id}">
                            <input type="text" class="option-input" value="${option}" placeholder="Option ${index + 1}">
                        </div>
                    `).join('')}
                </div>
            `;
        case 'file':
            return `
                <input type="file">
            `;
        default:
            return `
                <input type="text" class="field-placeholder-input" placeholder="${field.placeholder || 'Texte indicatif'}" value="${field.placeholder}">
            `;
    }
}

// Fonction pour mettre à jour une propriété d'un champ
function updateFieldProperty(fieldId, property, value) {
    const field = formFields.find(f => f.id === fieldId);
    if (field) {
        field[property] = value;
        renderPreview();
        renderWorkspace(); // Mettre à jour la workspace pour refléter les changements
    }
}

// Fonction pour mettre à jour une option d'un champ
function updateFieldOption(fieldId, index, value) {
    const field = formFields.find(f => f.id === fieldId);
    if (field && field.options[index] !== undefined) {
        field.options[index] = value;
        renderPreview();
        renderWorkspace();
    }
}

// Fonction pour supprimer un champ
function deleteField(fieldId) {
    formFields = formFields.filter(field => field.id !== fieldId);
    if (selectedFieldId === fieldId) {
        selectedFieldId = null;
        if (window.innerWidth >= 1050) showPropertiesForm(null);
    }
    renderWorkspace();
    renderPreview();
}

// Fonction pour sélectionner un champ
function selectField(fieldId) {
    selectedFieldId = fieldId;
    renderWorkspace();
    if (window.innerWidth >= 1050) showPropertiesForm(fieldId);
}

// Fonction pour rendre l'aperçu du formulaire
function renderPreview() {
    previewForm.innerHTML = '';

    if (formFields.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'empty-message';
        emptyMsg.textContent = 'Aucun champ ajouté au formulaire';
        previewForm.appendChild(emptyMsg);
        return;
    }

    formFields.forEach(field => {
        const fieldElement = document.createElement('div');
        fieldElement.className = 'preview-field';

        const label = document.createElement('label');
        label.textContent = field.label + (field.required ? ' *' : '');
        fieldElement.appendChild(label);

        let inputElement;
        switch (field.type) {
            case 'text':
            case 'email':
            case 'number':
            case 'date':
                inputElement = document.createElement('input');
                inputElement.type = field.type;
                inputElement.placeholder = field.placeholder;
                if (field.required) inputElement.required = true;
                break;

            case 'textarea':
                inputElement = document.createElement('textarea');
                inputElement.placeholder = field.placeholder;
                if (field.required) inputElement.required = true;
                break;

            case 'select':
                inputElement = document.createElement('select');
                if (field.required) inputElement.required = true;
                field.options.forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option;
                    optionElement.textContent = option;
                    inputElement.appendChild(optionElement);
                });
                break;

            case 'checkbox':
                field.options.forEach(option => {
                    const checkboxContainer = document.createElement('div');
                    checkboxContainer.style.marginBottom = '5px';
                    
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.id = `preview-${field.id}-${option}`;
                    
                    const checkboxLabel = document.createElement('label');
                    checkboxLabel.htmlFor = `preview-${field.id}-${option}`;
                    checkboxLabel.textContent = option;
                    checkboxLabel.style.marginLeft = '5px';
                    
                    checkboxContainer.appendChild(checkbox);
                    checkboxContainer.appendChild(checkboxLabel);
                    fieldElement.appendChild(checkboxContainer);
                });
                break;

            case 'radio':
                field.options.forEach(option => {
                    const radioContainer = document.createElement('div');
                    radioContainer.style.marginBottom = '5px';
                    
                    const radio = document.createElement('input');
                    radio.type = 'radio';
                    radio.name = `preview-${field.id}`;
                    radio.id = `preview-${field.id}-${option}`;
                    
                    const radioLabel = document.createElement('label');
                    radioLabel.htmlFor = `preview-${field.id}-${option}`;
                    radioLabel.textContent = option;
                    radioLabel.style.marginLeft = '5px';
                    
                    radioContainer.appendChild(radio);
                    radioContainer.appendChild(radioLabel);
                    fieldElement.appendChild(radioContainer);
                });
                break;

            case 'file':
                inputElement = document.createElement('input');
                inputElement.type = 'file';
                if (field.required) inputElement.required = true;
                break;

            default:
                inputElement = document.createElement('input');
                inputElement.type = 'text';
                inputElement.placeholder = field.placeholder;
                if (field.required) inputElement.required = true;
        }

        if (inputElement) {
            fieldElement.appendChild(inputElement);
        }

        if (field.help) {
            const helpText = document.createElement('small');
            helpText.textContent = field.help;
            helpText.style.display = 'block';
            helpText.style.marginTop = '5px';
            helpText.style.color = '#718096';
            fieldElement.appendChild(helpText);
        }

        previewForm.appendChild(fieldElement);
    });
}

// Fonction pour réinitialiser le formulaire
function resetForm() {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser le formulaire ? Tous les champs seront supprimés.')) {
        formFields = [];
        selectedFieldId = null;
        renderWorkspace();
        renderPreview();
        if (window.innerWidth >= 1050) showPropertiesForm(null);
    }
}

// Fonction pour sauvegarder le formulaire (affiche le JSON dans la console)
function saveForm() {
    const formData = {
        fields: formFields.map(field => ({
            type: field.type,
            label: field.label,
            placeholder: field.placeholder,
            required: field.required,
            help: field.help,
            options: field.options
        }))
    };

    console.log('Formulaire sauvegardé :', JSON.stringify(formData, null, 2));
    alert('Formulaire sauvegardé ! Vérifiez la console pour voir le JSON généré.');
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    renderWorkspace();
    renderPreview();
    if (window.innerWidth >= 1050) showPropertiesForm(null);
});
