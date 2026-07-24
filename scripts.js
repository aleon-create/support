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
      document.querySelectorAll('.submenu.open').forEach((openSubmenu) => {
        if (openSubmenu !== submenu) {
          openSubmenu.classList.remove('open');
          const siblingTrigger = document.querySelector(`[data-target="${openSubmenu.id}"]`);
          if (siblingTrigger) {
            siblingTrigger.setAttribute('aria-expanded', 'false');
          }
        }
      });

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

  const galleryModal = document.getElementById('galleryModal');
  const galleryModalImg = document.getElementById('galleryModalImg');
  const closeGalleryBtn = document.getElementById('closeGalleryBtn');
  const preview = document.getElementById('imagePreview');
  const previewImg = document.getElementById('imagePreviewImg');

  const thumbnails = document.querySelectorAll('.placeholder-image');
  if (thumbnails.length && preview && previewImg) {
    thumbnails.forEach((thumb) => {
      const img = thumb.querySelector('img');
      if (!img) return;

      thumb.addEventListener('mouseenter', () => {
        previewImg.src = img.src;
        previewImg.alt = img.alt;
        preview.classList.add('show');
        preview.setAttribute('aria-hidden', 'false');
      });

      thumb.addEventListener('mousemove', (event) => {
        preview.style.left = `${event.clientX}px`;
        preview.style.top = `${event.clientY}px`;
      });

      thumb.addEventListener('mouseleave', () => {
        preview.classList.remove('show');
        preview.setAttribute('aria-hidden', 'true');
      });

      thumb.addEventListener('click', () => {
        if (galleryModal && galleryModalImg) {
          galleryModalImg.src = img.src;
          galleryModalImg.alt = img.alt;
          galleryModal.classList.add('show');
          galleryModal.setAttribute('aria-hidden', 'false');
        }
      });
    });
  }

  const closeGallery = () => {
    if (!galleryModal) return;
    galleryModal.classList.remove('show');
    galleryModal.setAttribute('aria-hidden', 'true');
  };

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
