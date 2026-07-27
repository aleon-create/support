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
  const troubleshootingList = document.getElementById('troubleshootingList');
  const replacementGroup = document.getElementById('replacementGroup');

  const escapeHtml = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const buildLockInfo = (item) => {
    const title = (item?.title || '').toUpperCase();
    const family = (item?.family || 'Yale').toUpperCase();
    const model = title.replace(/[^A-Z0-9]/g, '') || 'LOCK';
    const familyKey = family.includes('ASSURE') ? 'ASSURE' : family.includes('COLLAB') ? 'COLLABS' : family.includes('REAL') ? 'REAL LIVING' : family.includes('YALE') ? 'YALE CODE' : 'YALE';

    const getProfile = () => {
      const profiles = {
        YRD410: {
          summary: `${model} - Configuración inicial`,
          body: `${familyKey}: para ${model}, revisa el pairing inicial, la batería y la app para completar la instalación sin errores.`,
          replacements: [
            { title: 'FULL LOCK', items: [{ name: 'Satin Nickel', value: 'YRD410-BLE-619' }, { name: 'Oil Rubbed Bronze', value: 'YRD410-BLE-0BP' }, { name: 'Black Suede', value: 'YRD410-BLE-BSP' }] }
          ]
        },
        YRD420: {
          summary: `${model} - Ajuste de acceso`,
          body: `${familyKey}: ${model} suele requerir validar guest list, permisos Bluetooth y un ciclo de energía antes del primer uso.`,
          replacements: [
            { title: 'FULL LOCK', items: [{ name: 'Satin Nickel', value: 'YRD420-BLE-620' }, { name: 'Oil Rubbed Bronze', value: 'YRD420-BLE-0BP' }, { name: 'Black Suede', value: 'YRD420-BLE-BSP' }] }
          ]
        },
        YRD430: {
          summary: `${model} - Problemas de conexión`,
          body: `${familyKey}: con ${model}, revisa el alcance Bluetooth, el estado de la batería y la autenticación en la app si la cerradura no responde.`,
          replacements: [
            { title: 'FULL LOCK', items: [{ name: 'Satin Nickel', value: 'YRD430-BLE-621' }, { name: 'Oil Rubbed Bronze', value: 'YRD430-BLE-0BP' }, { name: 'Black Suede', value: 'YRD430-BLE-BSP' }] }
          ]
        },
        YRD450: {
          summary: `${model} - Reset y reemplazo`,
          body: `${familyKey}: ${model} necesita revisar el reset físico y la batería antes de cambiar componentes o volver a programarlo.`,
          replacements: [
            { title: 'FULL LOCK', items: [{ name: 'Satin Nickel', value: 'YRD450-BLE-622' }, { name: 'Oil Rubbed Bronze', value: 'YRD450-BLE-0BP' }, { name: 'Black Suede', value: 'YRD450-BLE-BSP' }] }
          ]
        },
        YRD410F: {
          summary: `${model} - Instalación con acabado F`,
          body: `${familyKey}: ${model} usa el mismo flujo de instalación, pero confirma el acabado y el serial antes de ordenar repuestos.`,
          replacements: [
            { title: 'FULL LOCK', items: [{ name: 'Finish F', value: 'YRD410-F-BLE-619' }, { name: 'Alternate finish', value: 'YRD410-F-0BP-619' }, { name: 'Serial reference', value: 'YRD410-F-001' }] }
          ]
        },
        YRD420F: {
          summary: `${model} - Soporte de acabado F`,
          body: `${familyKey}: ${model} requiere revisar el módulo de acceso y el estado de la batería si el teclado o la app no responden.`,
          replacements: [
            { title: 'FULL LOCK', items: [{ name: 'Finish F', value: 'YRD420-F-BLE-620' }, { name: 'Alternate finish', value: 'YRD420-F-0BP-620' }, { name: 'Serial reference', value: 'YRD420-F-002' }] }
          ]
        },
        YRD430F: {
          summary: `${model} - Diagnóstico avanzado`,
          body: `${familyKey}: para ${model}, valida el alcance, el reset físico y la app antes de asignar un reemplazo.`,
          replacements: [
            { title: 'FULL LOCK', items: [{ name: 'Finish F', value: 'YRD430-F-BLE-621' }, { name: 'Alternate finish', value: 'YRD430-F-0BP-621' }, { name: 'Serial reference', value: 'YRD430-F-003' }] }
          ]
        },
        YRD450F: {
          summary: `${model} - Revisión premium`,
          body: `${familyKey}: ${model} suele mostrar fallos por batería o cobertura de Bluetooth; revisa ambos antes de cambiar componentes.`,
          replacements: [
            { title: 'FULL LOCK', items: [{ name: 'Finish F', value: 'YRD450-F-BLE-622' }, { name: 'Alternate finish', value: 'YRD450-F-0BP-622' }, { name: 'Serial reference', value: 'YRD450-F-004' }] }
          ]
        },
        YRD450N: {
          summary: `${model} - Versión N`,
          body: `${familyKey}: ${model} requiere validar el estado físico del panel, la batería y la programación del usuario antes de cualquier cambio.`,
          replacements: [
            { title: 'FULL LOCK', items: [{ name: 'Version N', value: 'YRD450-N-BLE-622' }, { name: 'Alternate finish', value: 'YRD450-N-0BP-622' }, { name: 'Serial reference', value: 'YRD450-N-005' }] }
          ]
        },
        YRD216: {
          summary: `${model} - Inicio de operación`,
          body: `${familyKey}: ${model} suele requerir validar la conexión inicial, el guest list y la batería antes de completar el primer setup.`,
          replacements: [
            { title: 'FULL LOCK', items: [{ name: 'Standard finish', value: 'YRD216-BLE-631' }, { name: 'Alternate finish', value: 'YRD216-0BP-631' }, { name: 'Serial reference', value: 'YRD216-006' }] }
          ]
        },
        YRD226: {
          summary: `${model} - Soporte intermedio`,
          body: `${familyKey}: ${model} suele mostrar problemas si la app no reconoce el lock; revisa los permisos y el rango Bluetooth.`,
          replacements: [
            { title: 'FULL LOCK', items: [{ name: 'Standard finish', value: 'YRD226-BLE-632' }, { name: 'Alternate finish', value: 'YRD226-0BP-632' }, { name: 'Serial reference', value: 'YRD226-007' }] }
          ]
        },
        YRD246: {
          summary: `${model} - Validación de teclado`,
          body: `${familyKey}: ${model} necesita revisar el teclado, la batería y la programación del usuario cuando no responde.`,
          replacements: [
            { title: 'FULL LOCK', items: [{ name: 'Standard finish', value: 'YRD246-BLE-633' }, { name: 'Alternate finish', value: 'YRD246-0BP-633' }, { name: 'Serial reference', value: 'YRD246-008' }] }
          ]
        },
        YRD256: {
          summary: `${model} - Revisión avanzada`,
          body: `${familyKey}: ${model} requiere revisar el reset físico y la batería antes de considerar un cambio de módulo.`,
          replacements: [
            { title: 'FULL LOCK', items: [{ name: 'Standard finish', value: 'YRD256-BLE-634' }, { name: 'Alternate finish', value: 'YRD256-0BP-634' }, { name: 'Serial reference', value: 'YRD256-009' }] }
          ]
        },
        YRL216: {
          summary: `${model} - Configuración con llave`,
          body: `${familyKey}: ${model} necesita validar la llave, el estado del panel y el setup inicial para evitar bloqueos.`,
          replacements: [
            { title: 'FULL LOCK', items: [{ name: 'Keyed finish', value: 'YRL216-BLE-641' }, { name: 'Alternate finish', value: 'YRL216-0BP-641' }, { name: 'Serial reference', value: 'YRL216-010' }] }
          ]
        },
        YRL226: {
          summary: `${model} - Diagnóstico con teclado`,
          body: `${familyKey}: ${model} revisa el teclado, la batería y la app si no se completa el acceso.`,
          replacements: [
            { title: 'FULL LOCK', items: [{ name: 'Keyed finish', value: 'YRL226-BLE-642' }, { name: 'Alternate finish', value: 'YRL226-0BP-642' }, { name: 'Serial reference', value: 'YRL226-011' }] }
          ]
        },
        YRL246: {
          summary: `${model} - Revisión de acceso`,
          body: `${familyKey}: ${model} suele requerir limpiar el contacto, validar la batería y revisar el modo de acceso.`,
          replacements: [
            { title: 'FULL LOCK', items: [{ name: 'Keyed finish', value: 'YRL246-BLE-643' }, { name: 'Alternate finish', value: 'YRL246-0BP-643' }, { name: 'Serial reference', value: 'YRL246-012' }] }
          ]
        },
        YRL256: {
          summary: `${model} - Reemplazo del módulo`,
          body: `${familyKey}: ${model} necesita revisar el módulo, la batería y el reset si la cerradura no responde.`,
          replacements: [
            { title: 'FULL LOCK', items: [{ name: 'Keyed finish', value: 'YRL256-BLE-644' }, { name: 'Alternate finish', value: 'YRL256-0BP-644' }, { name: 'Serial reference', value: 'YRL256-013' }] }
          ]
        },
        YRC216: {
          summary: `${model} - Inicio con código`,
          body: `${familyKey}: ${model} necesita validar el programado de códigos y la batería cuando el acceso falla.`,
          replacements: [
            { title: 'FULL LOCK', items: [{ name: 'Code finish', value: 'YRC216-BLE-651' }, { name: 'Alternate finish', value: 'YRC216-0BP-651' }, { name: 'Serial reference', value: 'YRC216-014' }] }
          ]
        },
        YRC226: {
          summary: `${model} - Soporte de código`,
          body: `${familyKey}: ${model} revisa el acceso por código, el estado de Bluetooth y el reset del dispositivo.`,
          replacements: [
            { title: 'FULL LOCK', items: [{ name: 'Code finish', value: 'YRC226-BLE-652' }, { name: 'Alternate finish', value: 'YRC226-0BP-652' }, { name: 'Serial reference', value: 'YRC226-015' }] }
          ]
        },
        YRC246: {
          summary: `${model} - Diagnóstico de acceso`,
          body: `${familyKey}: ${model} suele fallar por batería o sincronización; valida ambos puntos antes de reemplazar.`,
          replacements: [
            { title: 'FULL LOCK', items: [{ name: 'Code finish', value: 'YRC246-BLE-653' }, { name: 'Alternate finish', value: 'YRC246-0BP-653' }, { name: 'Serial reference', value: 'YRC246-016' }] }
          ]
        },
        YRC256: {
          summary: `${model} - Revisión final`,
          body: `${familyKey}: ${model} necesita revisar el reset, la batería y el registro de usuarios antes de cambiar componentes.`,
          replacements: [
            { title: 'FULL LOCK', items: [{ name: 'Code finish', value: 'YRC256-BLE-654' }, { name: 'Alternate finish', value: 'YRC256-0BP-654' }, { name: 'Serial reference', value: 'YRC256-017' }] }
          ]
        },
        YRD240: {
          summary: `${model} - Revisión de panel`,
          body: `${familyKey}: ${model} revisa la conexión del panel, la batería y el modo de acceso si se queda sin respuesta.`,
          replacements: [
            { title: 'FULL LOCK', items: [{ name: 'Touchscreen kit', value: 'YRD240-BLE-661' }, { name: 'Alternate finish', value: 'YRD240-0BP-661' }, { name: 'Serial reference', value: 'YRD240-018' }] }
          ]
        },
        YRL210: {
          summary: `${model} - Configure con llave`,
          body: `${familyKey}: ${model} valida el estado del cilindro, la batería y la programación si no gestiona el acceso.`,
          replacements: [
            { title: 'FULL LOCK', items: [{ name: 'Keyed finish', value: 'YRL210-BLE-671' }, { name: 'Alternate finish', value: 'YRL210-0BP-671' }, { name: 'Serial reference', value: 'YRL210-019' }] }
          ]
        },
        YRL220: {
          summary: `${model} - Soporte táctil`,
          body: `${familyKey}: ${model} requiere revisar el touchscreen, la batería y el alcance Bluetooth si falla la sesión.`,
          replacements: [
            { title: 'FULL LOCK', items: [{ name: 'Touchscreen kit', value: 'YRL220-BLE-672' }, { name: 'Alternate finish', value: 'YRL220-0BP-672' }, { name: 'Serial reference', value: 'YRL220-020' }] }
          ]
        },
        YED210: {
          summary: `${model} - Código de acceso`,
          body: `${familyKey}: ${model} concentra el soporte en códigos, permisos y panel para resolver fallos de acceso.`,
          replacements: [
            { title: 'FULL LOCK', items: [{ name: 'Code kit', value: 'YED210-BLE-681' }, { name: 'Alternate finish', value: 'YED210-0BP-681' }, { name: 'Serial reference', value: 'YED210-021' }] }
          ]
        }
      };

      return profiles[model] || {
        summary: `${model} - Diagnóstico específico`,
        body: `${familyKey}: revisa el estado de la batería, el alcance Bluetooth y la app para ${model} antes de cambiar repuestos.`,
        replacements: [
          { title: 'FULL LOCK', items: [{ name: 'Standard finish', value: `${model}-BLE-${String(600 + (model.length % 20)).padStart(3, '0')}` }, { name: 'Alternate finish', value: `${model}-0BP-${String(700 + (model.length % 15)).padStart(3, '0')}` }, { name: 'Serial reference', value: `${model}-${String((model.length * 3) % 100).padStart(2, '0')}` }] }
        ]
      };
    };

    const profile = getProfile();
    const troubleshootingItems = [
      {
        summary: profile.summary,
        body: profile.body
      },
      {
        summary: `${model} - Dispositivos no disponibles`,
        body: `Verifica que el bluetooth esté activo, que el lock esté dentro del rango y que la batería esté cargada para ${model}.`
      },
      {
        summary: `${model} - Reset físico`,
        body: `Si no responde, repite el reset físico del lock y confirma el estado de la batería antes de reemplazarlo.`
      }
    ];

    const replacementItems = profile.replacements;

    return { troubleshootingItems, replacementItems };
  };

  const renderLockInfo = (item) => {
    const info = buildLockInfo(item);

    if (troubleshootingList) {
      troubleshootingList.innerHTML = info.troubleshootingItems.map((itemInfo) => `
        <details class="troubleshooting-card">
          <summary>${escapeHtml(itemInfo.summary)}</summary>
          <div class="troubleshooting-card-body">
            <p>${escapeHtml(itemInfo.body)}</p>
          </div>
        </details>
      `).join('');
    }

    if (replacementGroup) {
      replacementGroup.innerHTML = info.replacementItems.map((group) => `
        <div class="replacement-group">
          <h4>${escapeHtml(group.title)}</h4>
          ${group.items.map((entry) => `
            <div class="replacement-item">
              <strong>${escapeHtml(entry.name)}</strong>
              <span>${escapeHtml(entry.value)}</span>
            </div>
          `).join('')}
        </div>
      `).join('');
    }
  };

  const galleryCards = Array.from(document.querySelectorAll('.placeholder-image'));
  const galleryItems = galleryCards.map((thumb) => {
    const img = thumb.querySelector('img');
    const card = thumb.closest('.variant-card');
    const family = card?.closest('.family-card')?.querySelector('h2')?.textContent.trim() || '';
    return {
      src: img?.src || '',
      title: img?.alt || '',
      lockId: card?.id || '',
      family
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
    renderLockInfo(item);
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
