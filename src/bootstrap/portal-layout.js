/** GCG Portal Layout Fixes
 * Portal (playgardencitygames.com/kingdomsofcamelot):
 *  - main ocupa el 100% del ancho y alto disponible (se elimina el max-width).
 *  - el footer queda oculto, sin ocupar espacio.
 *  - el header se puede desplegar/replegar con un botón.
 */

GM_addStyle("body.pbp-portal main {max-width:none !important; width:100% !important; margin-left:0 !important; margin-right:0 !important;} \
body.pbp-portal .site-footer {display:none !important;} \
body.pbp-portal.pbp-portal-header-hidden header.hero {display:none !important;} \
body.pbp-portal.pbp-portal-header-hidden main {min-height:100vh !important;} \
body.pbp-portal .pbp-header-toggle {display:inline-flex; align-items:center; justify-content:center; width:36px; height:36px; flex-shrink:0; background:none; border:1px solid var(--border); border-radius:6px; color:var(--text-muted); cursor:pointer; padding:0; transition:color .2s,border-color .2s;} \
body.pbp-portal .pbp-header-toggle:hover {color:var(--primary); border-color:var(--primary);} \
body.pbp-portal .pbp-header-restore {position:fixed; top:8px; left:50%; transform:translateX(-50%); z-index:1001; display:none; align-items:center; justify-content:center; width:36px; height:36px; border-radius:50%; background:var(--surface); border:1px solid var(--border); box-shadow:var(--glass-shadow); color:var(--text-main); cursor:pointer; padding:0; transition:color .2s,border-color .2s;} \
body.pbp-portal .pbp-header-restore:hover {color:var(--primary); border-color:var(--primary);} \
body.pbp-portal.pbp-portal-header-hidden .pbp-header-restore {display:inline-flex;}");

function InitPortalLayout() {
	if (document.URL.search(/playgardencitygames\.com\/kingdomsofcamelot/i) < 0) return;
	var body = document.body;
	if (!body || body.classList.contains('pbp-portal')) return;
	body.classList.add('pbp-portal');

	// Footer: oculto del todo, sin ocupar espacio
	var footer = document.querySelector('footer.site-footer');
	if (footer) footer.style.display = 'none';

	var inner = document.querySelector('header.hero .hero-inner');
	if (!inner) return;

	// Botón de colapso del header (dentro del propio header)
	if (!document.getElementById('pbp-header-toggle')) {
		var toggle = document.createElement('button');
		toggle.type = 'button';
		toggle.id = 'pbp-header-toggle';
		toggle.className = 'pbp-header-toggle';
		toggle.title = 'Collapse header';
		toggle.setAttribute('aria-label', 'Collapse header');
		toggle.setAttribute('aria-expanded', 'true');
		toggle.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 15 12 9 18 15"></polyline></svg>';
		toggle.addEventListener('click', function () {
			body.classList.add('pbp-portal-header-hidden');
		});
		inner.appendChild(toggle);
	}

	// Botón flotante para volver a mostrar el header cuando está colapsado
	if (!document.getElementById('pbp-header-restore')) {
		var restore = document.createElement('button');
		restore.type = 'button';
		restore.id = 'pbp-header-restore';
		restore.className = 'pbp-header-restore';
		restore.title = 'Show header';
		restore.setAttribute('aria-label', 'Show header');
		restore.setAttribute('aria-expanded', 'false');
		restore.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>';
		restore.addEventListener('click', function () {
			body.classList.remove('pbp-portal-header-hidden');
		});
		document.body.appendChild(restore);
	}
}

InitPortalLayout();