document.addEventListener('DOMContentLoaded', () => {
  // configuration du menu -> icônes Iconify (Material Design Icons)
  const menu = [
    // Les éléments non gérables sont définis avec manageable: false
    { type: 'opt', label: 'Acceuil', icon: 'mdi:home', id: 'accueil', manageable: false },
    { type: 'opt', label: 'Boite de réception', icon: 'mdi:mailbox', id: 'BtRcp', manageable: false },
    {
      type: 'menu', label: 'Mes services', icon: 'mdi:briefcase', DeuxiemeClass: 'MesServicesConteneur', children: [
        // manageable: true est la valeur par défaut si non spécifié
        // J'ajoute une "Vue d'ensemble" pour conserver l'accès à la page principale des services
        { label: 'Vue d\'ensemble', icon: 'mdi:view-dashboard-outline', id: 'MesServices' },
        { label: 'Mes domaines', icon: 'mdi:web', id: 'MesDomaines' },
        { label: 'Comptes Email', icon: 'mdi:email', id: 'Email' }
      ]
    },
    { type: 'opt', label: 'Rapport', icon: 'mdi:file-chart', id: 'Rapport' },
    { type: 'opt', label: 'Collaborateurs', icon: 'mdi:account-group', id: 'Collaborateurs' },
    { 
      type: 'menu', label: 'Gestion des factures', icon: 'mdi:receipt', children: [
        { label: 'Abonnements', icon: 'mdi:account-multiple', id: 'Abonnements' },
        { label: 'Historique', icon: 'mdi:history', id: 'Historique' }
      ]
    },
    { type: 'opt', label: 'Services auxiliaires', icon: 'mdi:puzzle-outline', id: 'ServicesAuxiliaires' },
    { type: 'opt', label: 'Parametre', icon: 'mdi:cog', id: 'parametre', manageable: false }
  ];

  const container = document.querySelector('.tableauDeBord__content');
  const servicesChecklist = document.getElementById('services-checklist');

  if (!container) return;

  // conserve l'entête (logo) si présent
  const header = container.querySelector('.tableauDeBord__header');
  // vide le container puis ré-insère l'entête
  container.innerHTML = '';
  if (header) container.appendChild(header);

  // --- Logique de gestion de la visibilité des services ---
  const getVisibleServices = () => {
    const config = localStorage.getItem('visibleServices');
    if (config === null) {
      // Par défaut, tous les services gérables sont visibles
      const allManageable = menu.filter(item => item.manageable !== false).map(item => item.label);
      return new Set(allManageable);
    }
    return new Set(JSON.parse(config));
  };
  const visibleServices = getVisibleServices();

  // utilitaires
  const makeIcon = (iconName) => {
    const el = document.createElement('iconify-icon');
    el.setAttribute('icon', iconName);
    el.setAttribute('width', '24');
    el.setAttribute('height', '24');
    el.className = 'iconOption';
    return el;
  };

  const makeOpt = ({ label, icon, id, url }) => {
    const el = document.createElement('div');
    el.className = 'opt opt--noir';
    if (id) {
      el.dataset.target = id;
    }
    // Si une URL est fournie, on l'ajoute en tant que data-attribute
    if (url) {
      el.dataset.url = url;
      // On peut aussi changer le curseur pour indiquer un lien externe
      el.style.cursor = 'pointer';
    }
    el.appendChild(makeIcon(icon));
    const span = document.createElement('span');
    span.textContent = label;
    el.appendChild(span);
    return el;
  };

  const makeMenu = ({ label, icon, DeuxiemeClass, children = [] }) => {
    const wrap = document.createElement('div');
    wrap.className = 'defilant';
    

    const title = document.createElement('span');
    title.className = 'textDefil opt--noir';
    title.appendChild(makeIcon(icon));
    const titleLabel = document.createElement('span');
    titleLabel.textContent = label;
    title.appendChild(titleLabel);
    wrap.appendChild(title);

    const content = document.createElement('div');
    content.className = 'defilant__content';
    if (DeuxiemeClass) {
      content.classList.add(DeuxiemeClass);
    }
    children.forEach(child => {
      const childEl = makeOpt(child);
      content.appendChild(childEl);
    });
    wrap.appendChild(content);
    return wrap;
  };

  // génération
  function renderMenu() {
    // Vider le menu existant (sauf le header)
    const currentHeader = container.querySelector('.tableauDeBord__header');
    container.innerHTML = '';
    if (currentHeader) container.appendChild(currentHeader);

    menu.forEach(item => {
      // Afficher si non gérable ou si présent dans la liste des services visibles
      if (item.manageable === false || visibleServices.has(item.label)) {
        const node = item.type === 'menu' ? makeMenu(item) : makeOpt(item);
        container.appendChild(node);
      }
    });

    // Rattacher les événements après le rendu
    attachMenuBehaviors();
  }

  function populateServicesModal() {
    if (!servicesChecklist) return;
    servicesChecklist.innerHTML = '';
    menu.forEach(item => {
      if (item.manageable !== false) {
        const isVisible = visibleServices.has(item.label);
        const wrapper = document.createElement('div');
        wrapper.className = 'checklist-item';
        wrapper.innerHTML = `
          <label>
            <input type="checkbox" data-service-label="${item.label}" ${isVisible ? 'checked' : ''}>
            ${item.label}
          </label>
        `;
        servicesChecklist.appendChild(wrapper);
      }
    });
  }

  renderMenu();
  populateServicesModal();

  // optionnel : attacher comportements (ex: toggle defilant)
  function attachMenuBehaviors() {
    container.querySelectorAll('.defilant .textDefil').forEach(t => {
      t.addEventListener('click', () => {
        t.parentElement.classList.toggle('open');
      });
    });

    // Il faut aussi ré-attacher le listener pour le bouton de gestion car le header est re-rendu
    const manageBtn = document.getElementById('manage-services-btn');
    const modal = document.getElementById('services-management-modal');
    if (manageBtn && modal) {
      manageBtn.addEventListener('click', () => modal.style.display = 'block');
    }
  }
});