window.addEventListener('DOMContentLoaded', function () {

  // ---- Mermaid ----
  if (typeof mermaid !== 'undefined') {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'base',
      themeVariables: {
        primaryColor: '#dbeafe',
        primaryTextColor: '#1e3a5f',
        primaryBorderColor: '#2563eb',
        lineColor: '#2563eb',
        secondaryColor: '#f1f5f9',
        tertiaryColor: '#fff',
        fontFamily: "'Inter', 'Noto Sans Bengali', sans-serif",
        fontSize: '16px',
        labelBackground: '#fff',
      },
      flowchart: {
        curve: 'basis',
        htmlLabels: true,
        nodeSpacing: 60,
        rankSpacing: 70,
        padding: 20,
        useMaxWidth: true,
      },
      sequence: {
        actorMargin: 60,
        messageMargin: 40,
        noteMargin: 20,
        boxMargin: 16,
        useMaxWidth: true,
        width: 160,
        height: 60,
      },
      stateDiagram: {
        nodeSpacing: 40,
        rankSpacing: 50,
        useMaxWidth: true,
      },
    });

    // After mermaid renders SVGs, let CSS take over sizing
    mermaid.mermaidAPI && mermaid.mermaidAPI.setConfig &&
      mermaid.mermaidAPI.setConfig({ useMaxWidth: true });
  }

  // ---- Post-render: make SVGs responsive (fit container, no scroll) ----
  function unlockDiagrams() {
    document.querySelectorAll('.diagram-wrap .mermaid svg').forEach(function (svg) {
      // Capture original dimensions BEFORE removing them
      var w = svg.getAttribute('width');
      var h = svg.getAttribute('height');
      // Ensure viewBox exists (Mermaid sometimes omits it)
      if (w && h && !svg.getAttribute('viewBox')) {
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      }
      // Remove hardcoded dimensions so CSS can scale the SVG to fit
      svg.removeAttribute('width');
      svg.removeAttribute('height');
      svg.style.removeProperty('max-width');
      svg.style.removeProperty('min-width');
      svg.style.width = '100%';
      svg.style.height = 'auto';
    });
  }

  // Run at 500ms, 1s, 2s to catch late renders
  setTimeout(unlockDiagrams, 500);
  setTimeout(unlockDiagrams, 1000);
  setTimeout(unlockDiagrams, 2000);

  // ---- Sidebar toggle (mobile) ----
  var sidebar = document.getElementById('sidebar');
  var toggle  = document.getElementById('sidebarToggle');
  if (toggle && sidebar) {
    toggle.addEventListener('click', function () {
      sidebar.classList.toggle('open');
    });
    document.addEventListener('click', function (e) {
      if (sidebar.classList.contains('open') &&
          !sidebar.contains(e.target) && e.target !== toggle) {
        sidebar.classList.remove('open');
      }
    });
  }

  // ---- Sidebar collapse (desktop minimize/maximize) ----
  if (sidebar) {
    var collapseBtn = document.createElement('button');
    collapseBtn.className = 'sidebar-collapse-btn';
    collapseBtn.innerHTML = '«';
    collapseBtn.title = 'Minimize sidebar';
    collapseBtn.setAttribute('aria-label', 'Minimize sidebar');
    sidebar.appendChild(collapseBtn);

    // Add tooltips & icon spans to nav links for collapsed mode
    sidebar.querySelectorAll('.sidebar-nav li a').forEach(function (link) {
      var text = link.textContent.trim();
      link.setAttribute('data-tip', text);
      // Extract leading emoji if present, otherwise use first char
      var emojiMatch = text.match(/^(\p{Emoji_Presentation}|\p{Extended_Pictographic})\s*/u);
      var icon = emojiMatch ? emojiMatch[0].trim() : text.charAt(0);
      var span = document.createElement('span');
      span.className = 'sidebar-nav-icon';
      span.textContent = icon;
      link.prepend(span);
    });

    collapseBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var isCollapsed = sidebar.classList.toggle('collapsed');
      document.body.classList.toggle('sidebar-collapsed', isCollapsed);
      collapseBtn.innerHTML = isCollapsed ? '»' : '«';
      collapseBtn.title = isCollapsed ? 'Expand sidebar' : 'Minimize sidebar';
      collapseBtn.setAttribute('aria-label', isCollapsed ? 'Expand sidebar' : 'Minimize sidebar');
      // Re-unlock diagrams after layout shift
      setTimeout(function () { unlockDiagrams(); }, 300);
    });
  }

  // ---- Active nav link ----
  var currentFile = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sidebar-nav a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href && href.split('/').pop() === currentFile) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // ---- Diagram expand button & fullscreen modal ----
  (function initDiagramExpand() {
    // Create modal overlay once
    var overlay = document.createElement('div');
    overlay.className = 'diagram-modal-overlay';
    overlay.innerHTML = '<div class="diagram-modal-content"><div class="diagram-modal-toolbar"><button class="diagram-modal-zoom-btn" data-zoom="out" aria-label="Zoom out">−</button><span class="diagram-modal-zoom-level">100%</span><button class="diagram-modal-zoom-btn" data-zoom="in" aria-label="Zoom in">+</button><button class="diagram-modal-zoom-btn reset-btn" data-zoom="reset">Reset</button></div><button class="diagram-modal-close" aria-label="Close">✕</button><div class="diagram-modal-body"></div></div>';
    document.body.appendChild(overlay);

    var modalBody  = overlay.querySelector('.diagram-modal-body');
    var closeBtn   = overlay.querySelector('.diagram-modal-close');
    var modalInner = overlay.querySelector('.diagram-modal-content');
    var zoomLevel  = overlay.querySelector('.diagram-modal-zoom-level');
    var zoomInBtn  = overlay.querySelector('[data-zoom="in"]');
    var zoomOutBtn = overlay.querySelector('[data-zoom="out"]');
    var zoomReset  = overlay.querySelector('[data-zoom="reset"]');
    var currentZoom = 100;
    var ZOOM_STEP = 15;

    function applyZoom() {
      modalBody.style.transform = 'scale(' + (currentZoom / 100) + ')';
      modalBody.style.transformOrigin = 'top left';
      zoomLevel.textContent = currentZoom + '%';
    }

    zoomInBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (currentZoom < 300) { currentZoom += ZOOM_STEP; applyZoom(); }
    });
    zoomOutBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (currentZoom > 40) { currentZoom -= ZOOM_STEP; applyZoom(); }
    });
    zoomReset.addEventListener('click', function (e) {
      e.stopPropagation();
      currentZoom = 100; applyZoom();
    });

    // Expand icon SVG
    var expandIcon = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3 3h7v2H5v5H3V3zm11 0h7v7h-2V5h-5V3zM3 14h2v5h5v2H3v-7zm18 0v7h-7v-2h5v-5h2z"/></svg>';

    // Inject button into every .diagram-wrap
    document.querySelectorAll('.diagram-wrap').forEach(function (wrap) {
      var btn = document.createElement('button');
      btn.className = 'diagram-expand-btn';
      btn.innerHTML = expandIcon + ' View Full';
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        openModal(wrap);
      });
      wrap.appendChild(btn);
    });

    function openModal(wrap) {
      // Clone the mermaid SVG
      var svg = wrap.querySelector('.mermaid svg');
      if (!svg) return;

      var caption = wrap.querySelector('.diagram-caption');
      modalBody.innerHTML = '';
      modalBody.appendChild(svg.cloneNode(true));
      if (caption) {
        var cap = document.createElement('p');
        cap.className = 'diagram-modal-caption';
        cap.textContent = caption.textContent;
        modalBody.appendChild(cap);
      }

      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
      modalBody.innerHTML = '';
      currentZoom = 100;
      applyZoom();
    }

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', function (e) {
      // Close if clicking overlay background (not the modal content)
      if (e.target === overlay) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('active')) closeModal();
    });
  })();
});
