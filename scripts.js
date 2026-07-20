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
});
