document.addEventListener('DOMContentLoaded', () => {
  const familyTriggers = document.querySelectorAll('.family-trigger');
  const submenuTriggers = document.querySelectorAll('.submenu-trigger');

  familyTriggers.forEach((button) => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-target');
      const panel = document.getElementById(targetId);
      if (!panel) return;

      const isOpen = panel.classList.contains('open');
      document.querySelectorAll('.family-panel.open').forEach((openPanel) => {
        if (openPanel !== panel) {
          openPanel.classList.remove('open');
          const siblingTrigger = document.querySelector(`[data-target="${openPanel.id}"]`);
          if (siblingTrigger) {
            siblingTrigger.setAttribute('aria-expanded', 'false');
          }
        }
      });

      panel.classList.toggle('open', !isOpen);
      button.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  submenuTriggers.forEach((button) => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-target');
      const submenu = document.getElementById(targetId);
      if (!submenu) return;

      const isOpen = submenu.classList.contains('open');
      const parent = submenu.parentElement;
      if (parent) {
        parent.querySelectorAll(':scope > .submenu.open').forEach((openSubmenu) => {
          if (openSubmenu !== submenu) {
            openSubmenu.classList.remove('open');
            const siblingTrigger = document.querySelector(`[data-target="${openSubmenu.id}"]`);
            if (siblingTrigger) {
              siblingTrigger.setAttribute('aria-expanded', 'false');
            }
          }
        });
      }

      submenu.classList.toggle('open', !isOpen);
      button.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  const firstPanel = document.querySelector('.family-panel');
  if (firstPanel) {
    firstPanel.classList.add('open');
    const firstTrigger = document.querySelector(`[data-target="${firstPanel.id}"]`);
    if (firstTrigger) {
      firstTrigger.setAttribute('aria-expanded', 'true');
    }
  }

  const openHashLock = () => {
    const lockId = decodeURIComponent(window.location.hash.slice(1));
    if (!lockId.startsWith('lock-')) return;

    const modelCard = document.getElementById(lockId);
    if (!modelCard) return;

    modelCard.closest('.family-panel')?.classList.add('open');
    let submenu = modelCard.closest('.submenu');
    while (submenu) {
      submenu.classList.add('open');
      const trigger = document.querySelector(`[data-target="${submenu.id}"]`);
      if (trigger) trigger.setAttribute('aria-expanded', 'true');
      submenu = submenu.parentElement?.closest('.submenu');
    }

    const familyPanel = modelCard.closest('.family-panel');
    if (familyPanel) {
      const familyTrigger = document.querySelector(`[data-target="${familyPanel.id}"]`);
      if (familyTrigger) familyTrigger.setAttribute('aria-expanded', 'true');
    }

    modelCard.classList.remove('lock-highlight');
    void modelCard.offsetWidth;
    modelCard.classList.add('lock-highlight');
    window.setTimeout(() => modelCard.classList.remove('lock-highlight'), 4200);
    modelCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  document.querySelectorAll('.variant-card').forEach((card) => {
    const model = card.querySelector('.variant-info strong')?.textContent.trim();
    if (model) card.id = `lock-${model}`;
  });
  openHashLock();
  window.addEventListener('hashchange', openHashLock);

  const galleryModal = document.getElementById('galleryModal');
  const galleryModalImg = document.getElementById('galleryModalImg');
  const galleryModalTitle = document.getElementById('galleryModalTitle');
  const closeGalleryBtn = document.getElementById('closeGalleryBtn');
  const prevGalleryBtn = document.getElementById('prevGalleryBtn');
  const nextGalleryBtn = document.getElementById('nextGalleryBtn');
  const preview = document.getElementById('imagePreview');
  const previewImg = document.getElementById('imagePreviewImg');

  const galleryCards = Array.from(document.querySelectorAll('.placeholder-image'));
  const galleryItems = galleryCards.map((thumb) => {
    const img = thumb.querySelector('img');
    const card = thumb.closest('.variant-card');
    return {
      src: img?.src || '',
      title: img?.alt || '',
      lockId: card?.id || ''
    };
  });
  let currentGalleryIndex = 0;

  const updateGalleryModal = (index) => {
    const item = galleryItems[index];
    if (!item || !galleryModalImg) return;
    galleryModalImg.src = item.src;
    galleryModalImg.alt = item.title;
    if (galleryModalTitle) {
      galleryModalTitle.textContent = item.title;
      galleryModalTitle.href = item.lockId ? `#${encodeURIComponent(item.lockId)}` : '#';
      galleryModalTitle.setAttribute('aria-label', `Ir al lock ${item.title}`);
    }
    currentGalleryIndex = index;
  };

  const openGallery = (index) => {
    if (!galleryModal || !galleryItems.length) return;
    updateGalleryModal((index + galleryItems.length) % galleryItems.length);
    galleryModal.classList.add('show');
    galleryModal.setAttribute('aria-hidden', 'false');
  };

  const changeGalleryItem = (direction) => {
    if (!galleryModal || !galleryItems.length) return;
    updateGalleryModal((currentGalleryIndex + direction + galleryItems.length) % galleryItems.length);
  };

  galleryCards.forEach((thumb, index) => {
    const img = thumb.querySelector('img');
    if (!img) return;

    if (preview && previewImg) {
      thumb.addEventListener('mouseenter', () => {
        previewImg.src = img.src;
        previewImg.alt = img.alt;
        preview.classList.add('show');
        preview.setAttribute('aria-hidden', 'false');
      });
    }

    thumb.addEventListener('mousemove', (event) => {
      if (preview) {
        preview.style.left = `${event.clientX}px`;
        preview.style.top = `${event.clientY}px`;
      }
    });

    thumb.addEventListener('mouseleave', () => {
      if (preview) {
        preview.classList.remove('show');
        preview.setAttribute('aria-hidden', 'true');
      }
    });

    thumb.addEventListener('click', () => openGallery(index));
  });

  const closeGallery = () => {
    if (!galleryModal) return;
    galleryModal.classList.remove('show');
    galleryModal.setAttribute('aria-hidden', 'true');
  };

  if (galleryModalTitle) {
    galleryModalTitle.addEventListener('click', (event) => {
      event.preventDefault();
      closeGallery();
      const targetHash = galleryModalTitle.getAttribute('href');
      if (!targetHash || targetHash === '#') return;

      if (window.location.hash === targetHash) {
        openHashLock();
        return;
      }

      window.location.hash = targetHash.slice(1);
    });
  }

  if (closeGalleryBtn) {
    closeGalleryBtn.addEventListener('click', closeGallery);
  }

  if (galleryModal) {
    galleryModal.addEventListener('click', (event) => {
      if (event.target === galleryModal) {
        closeGallery();
      }
    });
  }

  if (prevGalleryBtn) {
    prevGalleryBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      changeGalleryItem(-1);
    });
  }

  if (nextGalleryBtn) {
    nextGalleryBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      changeGalleryItem(1);
    });
  }

  const lockSearch = document.getElementById('lockSearch');
  const searchResults = document.getElementById('searchResults');

  if (lockSearch && searchResults) {
    const getLockPath = (card) => {
      const family = card.closest('.family-card')?.querySelector('h2')?.textContent.trim();
      const model = card.querySelector('.variant-info strong')?.textContent.trim();
      const levels = [];
      let submenu = card.closest('.submenu');

      while (submenu) {
        const trigger = card.ownerDocument.querySelector(`[data-target="${submenu.id}"]`);
        if (trigger) {
          levels.unshift(trigger.querySelector('span')?.textContent.trim() || trigger.textContent.trim());
        }
        submenu = submenu.parentElement?.closest('.submenu');
      }

      return ['Yale', family, ...levels, model].filter(Boolean).join('/');
    };

    const loadLockCatalog = fetch('YLManuals.html')
      .then((response) => {
        if (!response.ok) throw new Error('No se pudo cargar el catálogo Yale.');
        return response.text();
      })
      .then((html) => {
        const catalogDocument = new DOMParser().parseFromString(html, 'text/html');
        return Array.from(catalogDocument.querySelectorAll('.variant-card'))
          .filter((card) => card.querySelector('.variant-info strong') && card.querySelector('.variant-link'))
          .map((card) => {
            const model = card.querySelector('.variant-info strong').textContent.trim();
            const description = card.querySelector('.variant-info span')?.textContent.trim() || '';
            return {
              model,
              description,
              path: getLockPath(card),
              href: `YLManuals.html#lock-${encodeURIComponent(model)}`
            };
          });
      });

    const renderSearchResults = (catalog) => {
      const query = lockSearch.value.trim().toLowerCase();
      searchResults.replaceChildren();
      if (!query) return;

      const matches = catalog.filter((lock) => (
        `${lock.model} ${lock.description} ${lock.path}`.toLowerCase().includes(query)
      ));

      if (!matches.length) {
        const emptyMessage = document.createElement('p');
        emptyMessage.className = 'search-empty';
        emptyMessage.textContent = 'No se encontraron cerraduras con esa búsqueda.';
        searchResults.append(emptyMessage);
        return;
      }

      matches.forEach((lock) => {
        const result = document.createElement('a');
        result.className = 'search-result';
        result.href = lock.href;

        const path = document.createElement('span');
        path.className = 'result-path';
        path.textContent = lock.path;

        const model = document.createElement('span');
        model.className = 'result-model';
        model.textContent = lock.model;

        const action = document.createElement('span');
        action.className = 'result-action';
        action.textContent = 'Abrir ↗';

        result.append(path, model, action);
        searchResults.append(result);
      });
    };

    loadLockCatalog
      .then((catalog) => {
        lockSearch.addEventListener('input', () => renderSearchResults(catalog));
      })
      .catch(() => {
        lockSearch.addEventListener('input', () => {
          searchResults.replaceChildren();
          if (!lockSearch.value.trim()) return;
          const errorMessage = document.createElement('p');
          errorMessage.className = 'search-empty';
          errorMessage.textContent = 'No se pudo cargar el catálogo de cerraduras.';
          searchResults.append(errorMessage);
        });
      });
  }
});
