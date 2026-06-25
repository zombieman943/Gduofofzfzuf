// ============ NAVIGATION ============
function goPage(id) {
    const active = document.querySelector('.page.active');
    prevPg = active ? active.id : 'pg-home';
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const pg = document.getElementById(id);
    if (pg) { pg.classList.add('active'); pg.scrollTop = 0; }

    const map = {
        'pg-home': 'bn-home',
        'pg-cats': 'bn-cats',
        'pg-top': 'bn-top',
        'pg-search': 'bn-search',
        'pg-settings': 'bn-profile',
        'pg-offers': 'bn-home',
        'pg-blog': 'bn-home',
        'pg-dl': 'bn-home',
        'pg-latest': 'bn-home',
        'pg-detail': 'bn-home'
    };
    document.querySelectorAll('.bn').forEach(b => b.classList.remove('active'));
    const target = map[id] || 'bn-home';
    const el = document.getElementById(target);
    if (el) el.classList.add('active');
}

// ============ DETAIL PAGE ============
function openDP(id) {
    const a = APPS[id];
    if (!a) return;
    currentDetailId = id;
    document.getElementById('dp-title').textContent = a.name;
    const back = document.getElementById('dp-back');
    back.onclick = function() { goPage(prevPg || 'pg-home'); };

    const favBtn = document.getElementById('dp-fav');
    updateFavButton(favBtn, id);

    favBtn.onclick = function(e) {
        e.stopPropagation();
        favs.has(id) ? favs.delete(id) : favs.add(id);
        updateFavButton(favBtn, id);
        if (document.getElementById('pg-settings').classList.contains('active')) buildSettings();
        renderMyDL();
    };

    const isDownloaded = downloads.has(id);
    const dlBtn = isDownloaded ?
        '<a href="' + esc(a.apk) + '" class="dp-dlbtn" onclick="dlApp(' + id + '); return false;">&#11015; Open / Re-download</a>' :
        '<a href="' + esc(a.apk) + '" class="dp-dlbtn" onclick="dlApp(' + id + '); return false;">&#11015; Download APK</a>';

    const rel = APPS.filter(x => x.cat === a.cat && x.id !== id).slice(0, 6);

    document.getElementById('dp-body').innerHTML =
        '<div class="dp-hero">' +
        '<div style="display:flex;gap:12px;margin-bottom:12px;">' +
        '<img src="' + esc(a.img) + '" class="dp-logo" onerror="this.style.background=\'#e0e3ec\'" alt="' + esc(a.name) + '">' +
        '<div style="flex:1;">' +
        '<div class="dp-name">' + esc(a.name) + '</div>' +
        '<div class="dp-dev">Nyxora Store</div>' +
        '<div style="display:flex;align-items:center;gap:5px;margin-top:3px;">' +
        '<span style="color:var(--ylw);font-size:12px;font-weight:800;">&#9733; ' + esc(a.rt) + '</span>' +
        '<span style="font-size:11px;color:var(--txt2);font-weight:600;">(' + esc(a.cnt) + ')</span>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="dp-stats">' +
        '<div class="dp-st"><div class="dp-stv">&#9733; ' + esc(a.rt) + '</div><div class="dp-stl">Rating</div></div>' +
        '<div class="dp-st"><div class="dp-stv">' + esc(a.cnt) + '</div><div class="dp-stl">Downloads</div></div>' +
        '<div class="dp-st"><div class="dp-stv">' + esc(a.sz) + '</div><div class="dp-stl">Size</div></div>' +
        '<div class="dp-st"><div class="dp-stv">' + esc(a.ver) + '</div><div class="dp-stl">Version</div></div>' +
        '</div>' +
        dlBtn +
        '<div style="display:flex;align-items:center;justify-content:center;gap:5px;margin-top:8px;font-size:10px;color:var(--txt2);font-weight:700;">' +
        '<svg style="width:10px;height:10px;stroke:currentColor;fill:none;stroke-width:2.5;" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' +
        'Safe &amp; Secure &middot; Verified APK' +
        '</div>' +
        '</div>' +
        '<div class="sec-hdr"><div class="sec-title">Screenshots</div></div>' +
        '<div class="dp-screenshots"><div class="dp-ss">&#128247;</div><div class="dp-ss">&#127912;</div><div class="dp-ss">&#128640;</div><div class="dp-ss">&#127910;</div></div>' +
        '<div class="sec-hdr"><div class="sec-title">About this app</div></div>' +
        '<div class="card3d" style="margin:0 14px 14px;padding:14px;font-size:12px;line-height:1.7;font-weight:500;">' + esc(a.about) + '</div>' +
        '<div class="sec-hdr"><div class="sec-title">Key Features</div></div>' +
        '<div style="padding:0 14px;display:flex;flex-direction:column;gap:7px;">' +
        a.feats.map(function(f) {
            return '<div class="dp-feat card3d"><div class="dp-feat-ic"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div>' + esc(f) + '</div>';
        }).join('') +
        '</div>' +
        '<div class="sec-hdr"><div class="sec-title">Tags</div></div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:6px;padding:0 14px 14px;">' +
        [a.cat, 'Android', 'APK', 'Free', 'Premium'].map(function(t) {
            return '<span style="background:var(--reds);color:var(--red);border-radius:18px;padding:5px 12px;font-size:11px;font-weight:700;">' + esc(t) + '</span>';
        }).join('') +
        '</div>' +
        (rel.length ?
            '<div class="sec-hdr"><div class="sec-title">Related Apps</div></div><div class="h-scroll">' +
            rel.map(function(r) {
                return '<div class="app-hc" onclick="openDP(' + r.id + ')"><img src="' + esc(r.img) + '" class="app-hc-logo" onerror="this.style.background=\'#e0e3ec\'" alt="' + esc(r.name) + '"><div class="app-hc-name">' + esc(r.name) + '</div><div class="app-hc-cat">' + esc(r.cat) + '</div><button class="app-hc-btn" onclick="event.stopPropagation();openDP(' + r.id + ')">' + DLI + '</button></div>';
            }).join('') + '</div>' :
            '') +
        '<div style="padding:0 14px 14px;">' + dlBtn + '</div>' +
        '<div class="sec-hdr"><div class="sec-title">User Reviews</div></div>' +
        '<div style="padding:0 14px 80px;" id="cmt-' + a.id + '"></div>';

    const cmtEl = document.getElementById('cmt-' + a.id);
    if (cmtEl) cmtEl.innerHTML = cSection(a.id, a.rt, a.cnt);
    goPage('pg-detail');
}

// ============ DOWNLOAD ============
function dlApp(id) {
    downloads.add(id);
    if (currentDetailId === id) openDP(id);
    renderMyDL();
    if (document.getElementById('pg-settings').classList.contains('active')) buildSettings();
}

// ============ SEARCH ============
function onSrch(q) {
    const clear = document.getElementById('si-x');
    if (clear) {
        if (q) { clear.classList.add('visible'); } else { clear.classList.remove('visible'); }
    }
    const home = document.getElementById('srch-home');
    const res = document.getElementById('srch-res');
    if (!q) {
        home.style.display = 'block';
        res.style.display = 'none';
        renderSrchHome();
        return;
    }
    home.style.display = 'none';
    res.style.display = 'block';
    const filtered = APPS.filter(function(a) {
        return (sCat === 'All' || a.cat === sCat) &&
            (a.name.toLowerCase().includes(q.toLowerCase()) ||
                a.desc.toLowerCase().includes(q.toLowerCase()));
    });
    res.innerHTML =
        '<div style="font-size:11px;font-weight:700;color:var(--txt2);padding:4px 0 6px;">' + filtered.length +
        ' results for "' + esc(q) + '"</div>' +
        (filtered.length ? filtered.map(makeALI).join('') :
            '<div class="empty-st"><div class="empty-ic"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div><div style="font-size:15px;font-weight:900;">No Results</div><div style="font-size:12px;color:var(--txt2);font-weight:600;">Try a different keyword</div></div>'
        );
    if (q.length > 1) saveHist(q);
}

function clearSrch() {
    document.getElementById('si').value = '';
    onSrch('');
}

function setSCat(el, cat) {
    sCat = cat;
    document.querySelectorAll('.tag-chip').forEach(b => b.classList.remove('act'));
    el.classList.add('act');
    const q = document.getElementById('si').value;
    if (q) {
        onSrch(q);
    } else {
        const home = document.getElementById('srch-home');
        const res = document.getElementById('srch-res');
        home.style.display = 'none';
        res.style.display = 'block';
        const filtered = APPS.filter(a => sCat === 'All' || a.cat === sCat);
        res.innerHTML = '<div style="font-size:11px;font-weight:700;color:var(--txt2);padding:4px 0 6px;">' +
            filtered.length + ' apps in "' + esc(cat) + '"</div>' +
            (filtered.length ? filtered.map(makeALI).join('') :
                '<div class="empty-st"><div class="empty-ic"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div><div style="font-size:15px;font-weight:900;">No Apps</div><div style="font-size:12px;color:var(--txt2);font-weight:600;">This category is empty</div></div>'
            );
    }
}

function saveHist(q) {
    srchHist = srchHist.filter(x => x !== q);
    srchHist.unshift(q);
    srchHist = srchHist.slice(0, 8);
    try { localStorage.setItem('nx_h', JSON.stringify(srchHist)); } catch (_) {}
    renderSrchHome();
}

function clearHist() {
    srchHist = [];
    try { localStorage.setItem('nx_h', '[]'); } catch (_) {}
    renderSrchHome();
}

function removeHist(q) {
    srchHist = srchHist.filter(x => x !== q);
    try { localStorage.setItem('nx_h', JSON.stringify(srchHist)); } catch (_) {}
    renderSrchHome();
}

function tapHist(q) {
    document.getElementById('si').value = q;
    onSrch(q);
}

function filterAndGo(cat) {
    sCat = cat;
    goPage('pg-search');
    document.getElementById('si').value = '';
    document.querySelectorAll('.tag-chip').forEach(b => {
        b.classList.remove('act');
        if (b.textContent === cat) b.classList.add('act');
    });
    const home = document.getElementById('srch-home');
    const res = document.getElementById('srch-res');
    home.style.display = 'none';
    res.style.display = 'block';
    const filtered = APPS.filter(a => a.cat === cat);
    res.innerHTML = '<div style="font-size:11px;font-weight:700;color:var(--txt2);padding:4px 0 6px;">' +
        filtered.length + ' apps in "' + esc(cat) + '"</div>' +
        (filtered.length ? filtered.map(makeALI).join('') :
            '<div class="empty-st"><div class="empty-ic"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div><div style="font-size:15px;font-weight:900;">No Apps</div><div style="font-size:12px;color:var(--txt2);font-weight:600;">This category is empty</div></div>'
        );
}

// ============ TOP CHARTS ============
function renderChart() {
    let sorted = [];
    if (chartMode === 0) {
        sorted = APPS.slice(0, 10);
    } else if (chartMode === 1) {
        sorted = APPS.slice().sort((a, b) => parseFloat(b.rt) - parseFloat(a.rt)).slice(0, 10);
    } else {
        sorted = APPS.slice().sort((a, b) => parseInt(b.cnt.replace(/[^0-9]/g, '')) - parseInt(a.cnt.replace(/[^0-9]/g, ''))).slice(0, 10);
    }
    document.getElementById('chart-list').innerHTML = sorted.map(function(a, i) {
        return '<div class="ali" onclick="openDP(' + a.id + ')" style="margin-bottom:10px;">' +
            '<div class="chart-num ' + (i < 3 ? 'top' : '') + '">' + (i + 1) + '</div>' +
            '<img src="' + esc(a.img) + '" class="ali-logo" onerror="this.style.background=\'#e0e3ec\'" alt="' + esc(a.name) + '">' +
            '<div class="ali-info"><div class="ali-name">' + esc(a.name) + '</div><div class="ali-dev">' + esc(a.cat) + '</div>' +
            '<div class="ali-meta"><span class="ali-rat">&#9733; ' + esc(a.rt) + '</span><span class="ali-sz">' + esc(a.sz) + '</span></div></div>' +
            '<button class="ali-btn" onclick="event.stopPropagation();openDP(' + a.id + ')">' + DLI + '</button>' +
            '</div>';
    }).join('');
}

function setChart(el, mode) {
    chartMode = mode;
    document.querySelectorAll('.chart-tab').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    renderChart();
}

// ============ DOWNLOADS TAB ============
function renderMyDL() {
    const body = document.getElementById('dl-body');
    if (!body) return;
    if (downloads.size === 0) {
        body.innerHTML =
            '<div class="empty-st"><div class="empty-ic"><svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></div><div style="font-size:15px;font-weight:900;">No Downloads Yet</div><div style="font-size:12px;color:var(--txt2);font-weight:600;">Apps you download will appear here.</div></div>';
        return;
    }
    body.innerHTML = [...downloads].map(function(id) {
        const a = APPS[id];
        if (!a) return '';
        return '<div class="ali" onclick="openDP(' + a.id + ')" style="margin-bottom:10px;">' +
            '<img src="' + esc(a.img) + '" class="ali-logo" onerror="this.style.background=\'#e0e3ec\'" alt="' + esc(a.name) + '">' +
            '<div class="ali-info"><div class="ali-name">' + esc(a.name) + '</div><div class="ali-dev">' + esc(a.ver) + ' &middot; ' + esc(a.sz) + '</div>' +
            '<div class="ali-meta"><span class="ali-rat">&#9733; ' + esc(a.rt) + '</span></div></div>' +
            '<button class="open-btn" onclick="event.stopPropagation();window.open(\'' + esc(a.apk) + '\')">Open</button>' +
            '</div>';
    }).join('');
}

function setDlTab(el, i) {
    document.querySelectorAll('.chart-tab').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    if (i === 1) {
        document.getElementById('dl-body').innerHTML =
            '<div class="empty-st"><div class="empty-ic"><svg viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.28-4.79"/></svg></div><div style="font-size:15px;font-weight:900;">All Up to Date</div><div style="font-size:12px;color:var(--txt2);font-weight:600;">No updates available.</div></div>';
    } else { renderMyDL(); }
}

// ============ COMMENTS HANDLERS ============
function cPick(id, s) {
    cSt[id] = s;
    for (let i = 1; i <= 5; i++) {
        const el = document.getElementById('cs-' + id + '-' + i);
        if (el) el.style.color = i <= s ? '#ff9500' : '#ddd';
    }
}

function cSubmit(id) {
    const ta = document.getElementById('ct-' + id);
    if (!ta || !ta.value.trim()) { alert('Please write something!'); return; }
    const e = {
        name: user.guest ? 'Anonymous' : user.name,
        stars: cSt[id] || 5,
        text: ta.value.trim(),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    if (!cDB[id]) cDB[id] = [];
    cDB[id].unshift(e);
    try { localStorage.setItem('nx_c', JSON.stringify(cDB)); } catch (_) {}
    const el = document.getElementById('clist-' + id);
    if (el) el.innerHTML = cRender(id);
    ta.value = '';
    cSt[id] = 0;
    for (let i = 1; i <= 5; i++) {
        const se = document.getElementById('cs-' + id + '-' + i);
        if (se) se.style.color = '#ddd';
    }
}

// ============ PROFILE / SETTINGS ============
function buildSettings() {
    const body = document.getElementById('settings-body');
    if (!body) return;
    if (user.guest) {
        body.innerHTML = '<div style="padding:8px 0 16px;">' +
            '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">' +
            '<div style="width:40px;height:40px;border-radius:12px;background:linear-gradient(145deg,#ff4040,#cc0000);box-shadow:0 4px 0 #880000;display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;">' +
            '<img src="https://i.postimg.cc/sxNpKzNC/Picsart-26-05-25-09-41-18-423.png" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display=\'none\'">' +
            '</div>' +
            '<div>' +
            '<div style="font-size:15px;font-weight:900;background:linear-gradient(135deg,#e8192c,#ff5555);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">NYXORA</div>' +
            '<div style="font-size:8px;font-weight:700;color:var(--txt2);letter-spacing:1.8px;">STORE</div>' +
            '</div>' +
            '</div>' +
            '<div style="font-size:11px;color:var(--txt2);font-weight:600;margin-bottom:14px;">Login to save favorites &amp; track downloads</div>' +
            '<div style="display:flex;background:var(--bg);box-shadow:var(--neu-in);border-radius:14px;padding:3px;margin-bottom:12px;">' +
            '<button id="pt1" onclick="pTab(1)" style="flex:1;background:linear-gradient(145deg,#e8192c,#bb0019);color:#fff;border:none;border-radius:11px;padding:9px;font-family:\'Plus Jakarta Sans\',sans-serif;font-size:12px;font-weight:800;cursor:pointer;box-shadow:0 3px 0 #7a0011;">Login</button>' +
            '<button id="pt2" onclick="pTab(2)" style="flex:1;background:transparent;color:var(--txt2);border:none;border-radius:11px;padding:9px;font-family:\'Plus Jakarta Sans\',sans-serif;font-size:12px;font-weight:800;cursor:pointer;">Sign Up</button>' +
            '</div>' +
            '<div style="background:var(--glass);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1.5px solid rgba(255,255,255,.9);box-shadow:var(--neu);border-radius:20px;padding:16px;margin-bottom:12px;">' +
            '<div id="pfl">' +
            '<div style="background:var(--bg);box-shadow:var(--neu-in);border-radius:12px;display:flex;align-items:center;margin-bottom:10px;overflow:hidden;">' +
            '<div style="padding:10px;"><svg style="width:14px;height:14px;stroke:var(--red);fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>' +
            '<input type="email" id="pe" placeholder="Email Address" style="flex:1;border:none;background:transparent;padding:10px 6px;font-family:\'Plus Jakarta Sans\',sans-serif;font-size:13px;font-weight:600;color:var(--txt);outline:none;">' +
            '</div>' +
            '<div style="background:var(--bg);box-shadow:var(--neu-in);border-radius:12px;display:flex;align-items:center;margin-bottom:12px;overflow:hidden;">' +
            '<div style="padding:10px;"><svg style="width:14px;height:14px;stroke:var(--red);fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>' +
            '<input type="password" id="pp" placeholder="Password" style="flex:1;border:none;background:transparent;padding:10px 6px;font-family:\'Plus Jakarta Sans\',sans-serif;font-size:13px;font-weight:600;color:var(--txt);outline:none;">' +
            '</div>' +
            '<button onclick="pLogin()" style="width:100%;background:linear-gradient(145deg,#e8192c,#bb0019);color:#fff;border:none;border-radius:13px;padding:13px;font-family:\'Plus Jakarta Sans\',sans-serif;font-size:14px;font-weight:900;cursor:pointer;box-shadow:0 4px 0 #7a0011;">Login</button>' +
            '</div>' +
            '<div id="pfs" style="display:none;">' +
            '<div style="background:var(--bg);box-shadow:var(--neu-in);border-radius:12px;display:flex;align-items:center;margin-bottom:10px;overflow:hidden;">' +
            '<div style="padding:10px;"><svg style="width:14px;height:14px;stroke:var(--red);fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>' +
            '<input type="text" id="pn" placeholder="Full Name" style="flex:1;border:none;background:transparent;padding:10px 6px;font-family:\'Plus Jakarta Sans\',sans-serif;font-size:13px;font-weight:600;color:var(--txt);outline:none;">' +
            '</div>' +
            '<div style="background:var(--bg);box-shadow:var(--neu-in);border-radius:12px;display:flex;align-items:center;margin-bottom:10px;overflow:hidden;">' +
            '<div style="padding:10px;"><svg style="width:14px;height:14px;stroke:var(--red);fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>' +
            '<input type="email" id="pe2" placeholder="Email" style="flex:1;border:none;background:transparent;padding:10px 6px;font-family:\'Plus Jakarta Sans\',sans-serif;font-size:13px;font-weight:600;color:var(--txt);outline:none;">' +
            '</div>' +
            '<div style="background:var(--bg);box-shadow:var(--neu-in);border-radius:12px;display:flex;align-items:center;margin-bottom:12px;overflow:hidden;">' +
            '<div style="padding:10px;"><svg style="width:14px;height:14px;stroke:var(--red);fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>' +
            '<input type="password" id="pp2" placeholder="Password" style="flex:1;border:none;background:transparent;padding:10px 6px;font-family:\'Plus Jakarta Sans\',sans-serif;font-size:13px;font-weight:600;color:var(--txt);outline:none;">' +
            '</div>' +
            '<button onclick="pSignup()" style="width:100%;background:linear-gradient(145deg,#e8192c,#bb0019);color:#fff;border:none;border-radius:13px;padding:13px;font-family:\'Plus Jakarta Sans\',sans-serif;font-size:14px;font-weight:900;cursor:pointer;box-shadow:0 4px 0 #7a0011;">Create Account</button>' +
            '</div>' +
            '</div>' +
            '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">' +
            '<div style="flex:1;height:1px;background:var(--sd);"></div>' +
            '<span style="font-size:9px;font-weight:800;color:var(--txt2);letter-spacing:0.8px;">OR SIGN IN WITH</span>' +
            '<div style="flex:1;height:1px;background:var(--sd);"></div>' +
            '</div>' +
            '<div style="display:flex;gap:8px;">' +
            '<button onclick="sLogin(\'Google\')" style="flex:1;background:var(--sur);box-shadow:var(--neu);border:none;border-radius:13px;padding:10px;display:flex;align-items:center;justify-content:center;gap:5px;cursor:pointer;font-family:\'Plus Jakarta Sans\',sans-serif;font-size:11px;font-weight:800;color:var(--txt);">' +
            '<svg width="14" height="14" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>Google' +
            '</button>' +
            '<button onclick="sLogin(\'Facebook\')" style="flex:1;background:var(--sur);box-shadow:var(--neu);border:none;border-radius:13px;padding:10px;display:flex;align-items:center;justify-content:center;gap:5px;cursor:pointer;font-family:\'Plus Jakarta Sans\',sans-serif;font-size:11px;font-weight:800;color:var(--txt);">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>Facebook' +
            '</button>' +
            '<button onclick="sLogin(\'Apple\')" style="flex:1;background:var(--sur);box-shadow:var(--neu);border:none;border-radius:13px;padding:10px;display:flex;align-items:center;justify-content:center;gap:5px;cursor:pointer;font-family:\'Plus Jakarta Sans\',sans-serif;font-size:11px;font-weight:800;color:var(--txt);">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="var(--txt)"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>Apple' +
            '</button>' +
            '</div>' +
            '</div>';
        return;
    }
    body.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;padding:16px 0 12px;">' +
        '<div style="width:72px;height:72px;border-radius:20px;background:linear-gradient(145deg,#e8192c,#bb0019);box-shadow:0 5px 0 #7a0011,var(--neu);display:flex;align-items:center;justify-content:center;margin-bottom:10px;">' +
        '<svg style="width:34px;height:34px;stroke:#fff;fill:none;stroke-width:2;" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>' +
        '</div>' +
        '<div style="font-size:17px;font-weight:900;">' + esc(user.name) + '</div>' +
        '<div style="font-size:11px;color:var(--txt2);font-weight:600;margin-top:1px;">' + esc(user.email) + '</div>' +
        '</div>' +
        '<div class="set-card">' +
        '<div class="set-row"><div class="set-ic" style="background:rgba(0,122,255,.1);color:var(--blu);"><svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></div><div class="set-lbl">Downloads</div><div class="set-val">' + downloads.size + ' apps</div><svg style="width:13px;height:13px;stroke:var(--txt2);fill:none;stroke-width:2.5;" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg></div>' +
        '<div class="set-row"><div class="set-ic" style="background:rgba(232,25,44,.1);color:var(--red);"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div><div class="set-lbl">Favorites</div><div class="set-val">' + favs.size + ' apps</div><svg style="width:13px;height:13px;stroke:var(--txt2);fill:none;stroke-width:2.5;" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg></div>' +
        '<div class="set-row"><div class="set-ic" style="background:rgba(100,100,120,.1);color:var(--txt2);"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg></div><div class="set-lbl">Theme</div><div class="set-val">Light</div><svg style="width:13px;height:13px;stroke:var(--txt2);fill:none;stroke-width:2.5;" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg></div>' +
        '</div>' +
        '<div class="set-card">' +
        '<div class="set-row"><div class="set-ic" style="background:rgba(52,199,89,.1);color:var(--grn);"><svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div><div class="set-lbl">Contact Us</div><div class="set-val">We are here</div><svg style="width:13px;height:13px;stroke:var(--txt2);fill:none;stroke-width:2.5;" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg></div>' +
        '<div class="set-row" onclick="doLogout()"><div class="set-ic" style="background:rgba(232,25,44,.1);color:var(--red);"><svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></div><div class="set-lbl" style="color:var(--red);">Logout</div><svg style="width:13px;height:13px;stroke:var(--red);fill:none;stroke-width:2.5;" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg></div>' +
        '</div>';
}

function pTab(n) {
    document.getElementById('pfl').style.display = n === 1 ? 'block' : 'none';
    document.getElementById('pfs').style.display = n === 2 ? 'block' : 'none';
    const on = 'flex:1;background:linear-gradient(145deg,#e8192c,#bb0019);color:#fff;border:none;border-radius:11px;padding:9px;font-family:\'Plus Jakarta Sans\',sans-serif;font-size:12px;font-weight:800;cursor:pointer;box-shadow:0 3px 0 #7a0011;';
    const off = 'flex:1;background:transparent;color:var(--txt2);border:none;border-radius:11px;padding:9px;font-family:\'Plus Jakarta Sans\',sans-serif;font-size:12px;font-weight:800;cursor:pointer;';
    document.getElementById('pt1').style.cssText = n === 1 ? on : off;
    document.getElementById('pt2').style.cssText = n === 2 ? on : off;
}

function pLogin() {
    const e = document.getElementById('pe').value.trim();
    const p = document.getElementById('pp').value.trim();
    if (!e || !p) { alert('Please fill all fields'); return; }
    user = { name: e.split('@')[0] || 'User', email: e, guest: false };
    buildSettings();
}

function pSignup() {
    const n = document.getElementById('pn').value.trim();
    const e = document.getElementById('pe2').value.trim();
    const p = document.getElementById('pp2').value.trim();
    if (!n || !e || !p) { alert('Please fill all fields'); return; }
    user = { name: n, email: e, guest: false };
    buildSettings();
}

function sLogin(p) {
    user = { name: p + ' User', email: '', guest: false };
    buildSettings();
}

function doLogout() {
    user = { name: 'Guest', email: '', guest: true };
    favs = new Set();
    downloads = new Set();
    buildSettings();
    goPage('pg-home');
}

// ============ INITIALIZATION ============
(function init() {
    if (!APPS || !APPS.length) { console.error('APPS not loaded'); return; }

    // Home rows
    const pop = document.getElementById('home-pop');
    if (pop) APPS.slice(0, 8).forEach(a => pop.appendChild(makeHC(a)));

    const latEl = document.getElementById('home-latest');
    if (latEl) APPS.slice(0, 8).reverse().forEach(a => latEl.appendChild(makeHC(a)));

    const catRows = [
        { cat: 'Games', id: 'home-games' },
        { cat: 'Editors', id: 'home-editors' },
        { cat: 'Tools', id: 'home-tools' },
        { cat: 'Streaming', id: 'home-streaming' }
    ];
    catRows.forEach(function(row) {
        const el = document.getElementById(row.id);
        if (!el) return;
        APPS.filter(a => a.cat === row.cat).forEach(a => el.appendChild(makeHC(a)));
    });

    // Categories page
    const cats = [
        { name: 'Games', desc: 'Best games for your device', bg: 'linear-gradient(145deg,#ff4040,#cc0000)', sh: '#880000', ic: '<svg viewBox="0 0 24 24"><line x1="6" y1="12" x2="18" y2="12"/><line x1="12" y1="6" x2="12" y2="18"/><rect x="2" y="6" width="20" height="12" rx="3"/></svg>' },
        { name: 'Editors', desc: 'Edit photos & videos like a pro', bg: 'linear-gradient(145deg,#448aff,#1565c0)', sh: '#0d47a1', ic: '<svg viewBox="0 0 24 24"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg>' },
        { name: 'Tools', desc: 'Useful tools for daily life', bg: 'linear-gradient(145deg,#66bb6a,#2e7d32)', sh: '#1b5e20', ic: '<svg viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>' },
        { name: 'Streaming', desc: 'Movies, music & more', bg: 'linear-gradient(145deg,#ffa726,#e65100)', sh: '#bf360c', ic: '<svg viewBox="0 0 24 24"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>' }
    ];
    const cnt = { Games: 0, Editors: 0, Tools: 0, Streaming: 0 };
    APPS.forEach(a => { if (cnt[a.cat] !== undefined) cnt[a.cat]++; });
    document.getElementById('cats-list').innerHTML = cats.map(function(c) {
        return '<div class="cat-list-item" onclick="filterAndGo(\'' + c.name + '\')">' +
            '<div class="cat-list-ic" style="background:' + c.bg + ';box-shadow:0 4px 0 ' + c.sh + ';">' + c.ic + '</div>' +
            '<div style="flex:1;"><div style="font-size:14px;font-weight:800;margin-bottom:2px;">' + c.name + '</div>' +
            '<div style="font-size:11px;color:var(--txt2);font-weight:600;">' + c.desc + ' &middot; ' + cnt[c.name] + ' apps</div></div>' +
            '<svg style="width:15px;height:15px;stroke:var(--txt2);fill:none;stroke-width:2.5;" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>' +
            '</div>';
    }).join('');

    // Top Charts
    renderChart();

    // Latest
    document.getElementById('latest-list').innerHTML = APPS.slice().reverse().map(makeALI).join('');

    // Offers
    document.getElementById('offers-list').innerHTML = APPS.slice(0, 5).map(function(a) {
        return '<div class="offer-item">' +
            '<img src="' + esc(a.img) + '" style="width:42px;height:42px;border-radius:11px;object-fit:cover;border:2px solid #fff;box-shadow:0 3px 0 rgba(0,0,0,0.1);" onerror="this.style.background=\'#e0e3ec\'" alt="' + esc(a.name) + '">' +
            '<div style="flex:1;min-width:0;"><div style="font-size:12px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + esc(a.name) + '</div>' +
            '<div style="font-size:10px;color:var(--txt2);font-weight:600;">' + esc(a.desc) + '</div></div>' +
            '<span style="background:var(--reds);color:var(--red);border-radius:9px;padding:4px 9px;font-size:11px;font-weight:800;white-space:nowrap;flex-shrink:0;">50% OFF</span>' +
            '<button class="claim-btn" onclick="openDP(' + a.id + ')">View</button>' +
            '</div>';
    }).join('');

    // Search
    renderSrchHome();

    // Downloads
    renderMyDL();

    // Settings
    buildSettings();
})();
