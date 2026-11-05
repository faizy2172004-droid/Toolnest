/* ToolNest Advanced UX Layer
   Adds accessible drag/drop uploads, file details, keyboard shortcuts,
   share/copy controls, and safer tool-page reset behavior.
*/
(() => {
  'use strict';
  const isToolPage = !!document.querySelector('#toolApp');
  const fmt = n => n < 1024 ? `${n} B` : n < 1048576 ? `${(n/1024).toFixed(1)} KB` : `${(n/1048576).toFixed(2)} MB`;
  const announce = (node, message) => {
    if (!node) return;
    node.textContent = message;
    node.setAttribute('role','status');
    node.setAttribute('aria-live','polite');
  };

  // Make every file picker a keyboard- and drag/drop-friendly upload target.
  document.querySelectorAll('input[type="file"]').forEach(input => {
    const zone = input.closest('.upload-zone') || input.parentElement;
    if (!zone || zone.dataset.advancedDrop === '1') return;
    zone.dataset.advancedDrop = '1';
    zone.classList.add('advanced-drop-zone');
    zone.addEventListener('dragover', e => {
      e.preventDefault();
      zone.classList.add('is-dragging');
    });
    ['dragleave','dragend'].forEach(type => zone.addEventListener(type, () => zone.classList.remove('is-dragging')));
    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.classList.remove('is-dragging');
      const incoming = [...(e.dataTransfer?.files || [])];
      if (!incoming.length) return;
      const accepted = incoming.filter(file => {
        if (!input.accept || input.accept === '*/*') return true;
        return input.accept.split(',').some(rule => {
          rule = rule.trim().toLowerCase();
          return rule.startsWith('.') ? file.name.toLowerCase().endsWith(rule) :
            rule.endsWith('/*') ? file.type.startsWith(rule.slice(0,-1)) : file.type === rule;
        });
      });
      if (!accepted.length) {
        announce(zone.querySelector('.advanced-file-info') || zone, 'That file type is not accepted by this tool.');
        return;
      }
      const transfer = new DataTransfer();
      (input.multiple ? accepted : accepted.slice(0,1)).forEach(f => transfer.items.add(f));
      input.files = transfer.files;
      input.dispatchEvent(new Event('change',{bubbles:true}));
    });
    let info = zone.querySelector('.advanced-file-info');
    if (!info) {
      info = document.createElement('small');
      info.className = 'advanced-file-info';
      info.setAttribute('aria-live','polite');
      zone.appendChild(info);
    }
    input.addEventListener('change', () => {
      const files = [...(input.files || [])];
      info.textContent = files.length ? files.map(f => `${f.name} (${fmt(f.size)})`).join(' • ') : '';
      info.title = files.map(f => f.name).join(', ');
    });
  });

  // Tool-page utility strip.
  if (isToolPage) {
    const workspace = document.querySelector('.workspace');
    if (workspace && !workspace.querySelector('.advanced-toolbar')) {
      const bar = document.createElement('div');
      bar.className = 'advanced-toolbar';
      bar.innerHTML = '<span class="advanced-hint">Tip: You can drag and drop files into upload areas.</span><div class="advanced-actions"><button type="button" class="button button-quiet" data-tn-reset>Reset tool</button><button type="button" class="button button-quiet" data-tn-share>Share tool</button></div>';
      workspace.insertBefore(bar, workspace.firstChild);
      bar.querySelector('[data-tn-reset]').addEventListener('click', () => {
        if (confirm('Reset this tool and clear the current inputs?')) location.reload();
      });
      bar.querySelector('[data-tn-share]').addEventListener('click', async () => {
        const payload = {title:document.title, text:`Try ${document.title}`, url:location.href};
        try {
          if (navigator.share) await navigator.share(payload);
          else if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(location.href);
            announce(bar.querySelector('.advanced-hint'),'Tool link copied to clipboard.');
          } else {
            announce(bar.querySelector('.advanced-hint'),'Copy this page URL from your browser address bar.');
          }
        } catch (e) {
          if (e.name !== 'AbortError') announce(bar.querySelector('.advanced-hint'),'Sharing was not available in this browser.');
        }
      });
    }
  }

  // Ctrl/Cmd + Enter activates the primary action. Escape clears focused search fields.
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && isToolPage) {
      const primary = document.querySelector('#toolApp .button-primary, .workspace .button-primary');
      if (primary && !primary.disabled) { e.preventDefault(); primary.click(); }
    }
  });

  // Add descriptive structured data on individual utility pages.
  if (isToolPage && !document.querySelector('script[data-tn-schema]')) {
    const heading = document.querySelector('.tool-heading h1');
    const description = document.querySelector('meta[name="description"]')?.content || document.querySelector('.tool-heading p')?.textContent || '';
    if (heading) {
      const schema = {
        "@context":"https://schema.org",
        "@type":"WebApplication",
        "name":heading.textContent.trim().replace(/\s+/g,' '),
        "applicationCategory":"UtilitiesApplication",
        "operatingSystem":"Any",
        "description":description,
        "offers":{"@type":"Offer","price":"0","priceCurrency":"USD"}
      };
      const script = document.createElement('script');
      script.type='application/ld+json';
      script.dataset.tnSchema='1';
      script.textContent=JSON.stringify(schema);
      document.head.appendChild(script);
    }
  }
})();
