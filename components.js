/*
================================================================================
Chang Gate AR Tour - Trae 可视化组件库
================================================================================
所有组件脚本汇总

包含组件：
1. 导航栏 (Navbar)
2. 图片展示 (Gallery)
3. 代码片段 (Code Block)
================================================================================
*/

(function() {
  'use strict';

  // ==================== 组件1: 导航栏 ====================

  function initNavbar() {
    const navbars = document.querySelectorAll('[data-component="navbar"]');

    navbars.forEach(navbar => {
      const toggle = navbar.querySelector('.navbar-toggle');
      const menu = navbar.querySelector('.navbar-menu');

      if (toggle && menu) {
        toggle.addEventListener('click', function() {
          toggle.classList.toggle('active');
          menu.classList.toggle('active');
        });

        const links = menu.querySelectorAll('.navbar-link');
        links.forEach(link => {
          link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
              toggle.classList.remove('active');
              menu.classList.remove('active');
            }
          });
        });

        window.addEventListener('resize', () => {
          if (window.innerWidth > 768) {
            toggle.classList.remove('active');
            menu.classList.remove('active');
          }
        });
      }

      const currentPage = window.location.pathname.split('/').pop() || 'index.html';
      const navLinks = navbar.querySelectorAll('.navbar-link');
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
          link.classList.add('active');
        }
      });
    });
  }

  // ==================== 组件2: 图片展示 ====================

  function initGallery() {
    const galleries = document.querySelectorAll('[data-component="gallery"]');

    galleries.forEach(gallery => {
      const mainImg = gallery.querySelector('[data-current]');
      const thumbnails = gallery.querySelectorAll('.gallery-thumbnail');
      const caption = gallery.querySelector('[data-caption]');
      const lightbox = gallery.querySelector('[data-lightbox]');
      const lightboxImg = gallery.querySelector('[data-lightbox-img]');
      const prevBtn = gallery.querySelector('.gallery-arrow.prev');
      const nextBtn = gallery.querySelector('.gallery-arrow.next');
      const lightboxPrev = gallery.querySelector('.lightbox-arrow.lightbox-prev');
      const lightboxNext = gallery.querySelector('.lightbox-arrow.lightbox-next');
      const lightboxClose = gallery.querySelector('.lightbox-close');

      if (!mainImg || thumbnails.length === 0) return;

      const images = Array.from(thumbnails).map(thumb => ({
        src: thumb.querySelector('img').src,
        alt: thumb.querySelector('img').alt,
        caption: thumb.querySelector('img').alt
      }));

      let currentIndex = 0;

      function updateImage(index) {
        if (index < 0) index = images.length - 1;
        if (index >= images.length) index = 0;

        currentIndex = index;
        mainImg.src = images[index].src;
        mainImg.alt = images[index].alt;

        if (caption) {
          caption.textContent = images[index].caption || '';
        }

        thumbnails.forEach((thumb, i) => {
          thumb.classList.toggle('active', i === index);
        });
      }

      if (prevBtn) prevBtn.addEventListener('click', () => updateImage(currentIndex - 1));
      if (nextBtn) nextBtn.addEventListener('click', () => updateImage(currentIndex + 1));

      thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', () => updateImage(index));
      });

      if (mainImg) {
        mainImg.addEventListener('click', () => {
          lightboxImg.src = images[currentIndex].src;
          lightboxImg.alt = images[currentIndex].alt;
          lightbox.classList.add('active');
          document.body.style.overflow = 'hidden';
        });
      }

      if (lightboxPrev) {
        lightboxPrev.addEventListener('click', () => {
          updateImage(currentIndex - 1);
          lightboxImg.src = images[currentIndex].src;
        });
      }

      if (lightboxNext) {
        lightboxNext.addEventListener('click', () => {
          updateImage(currentIndex + 1);
          lightboxImg.src = images[currentIndex].src;
        });
      }

      if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
      }

      if (lightbox) {
        lightbox.addEventListener('click', (e) => {
          if (e.target === lightbox) closeLightbox();
        });
      }

      function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      }

      document.addEventListener('keydown', (e) => {
        if (!lightbox || !lightbox.classList.contains('active')) return;

        if (e.key === 'ArrowLeft') {
          updateImage(currentIndex - 1);
          lightboxImg.src = images[currentIndex].src;
        } else if (e.key === 'ArrowRight') {
          updateImage(currentIndex + 1);
          lightboxImg.src = images[currentIndex].src;
        } else if (e.key === 'Escape') {
          closeLightbox();
        }
      });

      const autoplay = gallery.dataset.autoplay === 'true';
      const interval = parseInt(gallery.dataset.interval) || 4000;
      let autoplayTimer = null;

      if (autoplay) {
        function startAutoplay() {
          autoplayTimer = setInterval(() => {
            updateImage(currentIndex + 1);
          }, interval);
        }

        function stopAutoplay() {
          clearInterval(autoplayTimer);
        }

        gallery.addEventListener('mouseenter', stopAutoplay);
        gallery.addEventListener('mouseleave', startAutoplay);
        startAutoplay();
      }
    });
  }

  // ==================== 组件3: 代码片段 ====================

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function simpleHighlight(code, language) {
    const rules = {
      html: [
        { pattern: /(&lt;!--[\s\S]*?--&gt;)/g, class: 'comment' },
        { pattern: /(&lt;\/?[\w-]+)/g, class: 'tag' },
        { pattern: /([\w-]+)=/g, class: 'attr' },
        { pattern: /"([^"]*)"/g, class: 'string' },
      ],
      css: [
        { pattern: /(\/\*[\s\S]*?\*\/)/g, class: 'comment' },
        { pattern: /([.#][\w-]+)/g, class: 'selector' },
        { pattern: /([\w-]+):/g, class: 'property' },
        { pattern: /(#[0-9a-fA-F]{3,6})/g, class: 'number' },
        { pattern: /"([^"]*)"|'([^']*)'/g, class: 'string' },
      ],
      javascript: [
        { pattern: /(\/\/.*$)/gm, class: 'comment' },
        { pattern: /(\/\*[\s\S]*?\*\/)/g, class: 'comment' },
        { pattern: /\b(const|let|var|function|return|if|else|for|while|class|import|export|from|async|await|new|this|typeof|instanceof)\b/g, class: 'keyword' },
        { pattern: /\b(\d+)\b/g, class: 'number' },
        { pattern: /"([^"]*)"|'([^']*)'|`([^`]*)`/g, class: 'string' },
        { pattern: /\b([\w]+)\(/g, class: 'function' },
      ]
    };

    let result = escapeHtml(code);

    if (rules[language]) {
      rules[language].forEach(rule => {
        result = result.replace(rule.pattern, (match, group) => {
          return `<span class="token ${rule.class}">${group || match}</span>`;
        });
      });
    }

    return result;
  }

  function initCodeBlocks() {
    const codeBlocks = document.querySelectorAll('[data-component="code-block"]');

    codeBlocks.forEach(block => {
      const codeElement = block.querySelector('code');
      const copyBtn = block.querySelector('.code-copy');
      const language = block.dataset.language || 'html';

      if (codeElement) {
        const code = codeElement.textContent;
        codeElement.innerHTML = simpleHighlight(code, language);
      }

      if (copyBtn) {
        copyBtn.addEventListener('click', async function() {
          if (!codeElement) return;
          const code = codeElement.textContent;

          try {
            await navigator.clipboard.writeText(code);
            this.classList.add('copied');
            this.querySelector('.copy-text').textContent = '已复制!';

            setTimeout(() => {
              this.classList.remove('copied');
              this.querySelector('.copy-text').textContent = '复制';
            }, 2000);
          } catch (err) {
            const textarea = document.createElement('textarea');
            textarea.value = code;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);

            this.classList.add('copied');
            this.querySelector('.copy-text').textContent = '已复制!';

            setTimeout(() => {
              this.classList.remove('copied');
              this.querySelector('.copy-text').textContent = '复制';
            }, 2000);
          }
        });
      }
    });
  }

  // ==================== 初始化 ====================

  function init() {
    initNavbar();
    initGallery();
    initCodeBlocks();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
