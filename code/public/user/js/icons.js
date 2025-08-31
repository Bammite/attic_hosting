document.addEventListener('DOMContentLoaded', () => {
  // configuration du menu -> icônes Iconify (Material Design Icons)
  const menu = [
    { type: 'opt', label: 'Acceuil', icon: 'mdi:home', id: 'accueil' },
    { type: 'opt', label: 'Boite de réception', icon: 'mdi:mailbox', id: 'BtRcp' },
    {
      type: 'menu', label: 'Mes services', icon: 'mdi:briefcase', DeuxiemeClass: 'MesServicesConteneur', children: [
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
    { type: 'opt', label: 'Parametre', icon: 'mdi:cog', id: 'parametre' }
  ];

  const container = document.querySelector('.tableauDeBord__content');
  if (!container) return;

  // conserve l'entête (logo) si présent
  const header = container.querySelector('.tableauDeBord__header');
  // vide le container puis ré-insère l'entête
  container.innerHTML = '';
  if (header) container.appendChild(header);

  // utilitaires
  const makeIcon = (iconName) => {
    const el = document.createElement('iconify-icon');
    el.setAttribute('icon', iconName);
    el.setAttribute('width', '24');
    el.setAttribute('height', '24');
    el.className = 'iconOption';
    return el;
  };

  const makeOpt = ({ label, icon, id }) => {
    const el = document.createElement('div');
    el.className = 'opt opt--noir';
    if (id) {
      el.dataset.target = id;
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
  menu.forEach(item => {
    const node = item.type === 'menu' ? makeMenu(item) : makeOpt(item);
    container.appendChild(node);
  });

  // optionnel : attacher comportements (ex: toggle defilant)
  container.querySelectorAll('.defilant .textDefil').forEach(t => {
    t.addEventListener('click', () => {
      t.parentElement.classList.toggle('open');
    });
  });
});