// ============ APP CARDS ============
function makeHC(a) {
    const d = document.createElement('div');
    d.className = 'app-hc';
    d.innerHTML =
        '<img src="' + esc(a.img) + '" class="app-hc-logo" onerror="this.style.background=\'#e0e3ec\'" alt="' + esc(a.name) + '">' +
        '<div class="app-hc-name">' + esc(a.name) + '</div>' +
        '<div class="app-hc-cat">' + esc(a.cat) + '</div>' +
        '<button class="app-hc-btn" onclick="event.stopPropagation();openDP(' + a.id + ')">' + DLI + '</button>';
    d.onclick = function() { openDP(a.id); };
    return d;
}

function makeALI(a) {
    return '<div class="ali" onclick="openDP(' + a.id + ')">' +
        '<img src="' + esc(a.img) + '" class="ali-logo" onerror="this.style.background=\'#e0e3ec\'" alt="' + esc(a.name) + '">' +
        '<div class="ali-info">' +
        '<div class="ali-name">' + esc(a.name) + '</div>' +
        '<div class="ali-dev">Nyxora Store &middot; ' + esc(a.cat) + '</div>' +
        '<div class="ali-meta"><span class="ali-rat">&#9733; ' + esc(a.rt) + '</span><span class="ali-sz">' + esc(a.sz) + '</span></div>' +
        '</div>' +
        '<button class="ali-btn" onclick="event.stopPropagation();openDP(' + a.id + ')">' + DLI + '</button>' +
        '</div>';
}

// ============ SEARCH HOME ============
function renderSrchHome() {
    let h = '';
    if (srchHist.length) {
        h += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;"><div style="font-size:15px;font-weight:900;">Recent Searches</div><div style="font-size:11px;font-weight:800;color:var(--red);cursor:pointer;background:var(--reds);padding:4px 11px;border-radius:9px;" onclick="clearHist()">Clear All</div></div>' +
            '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:18px;">' +
            srchHist.map(function(q) {
                return '<div style="display:flex;align-items:center;gap:6px;background:var(--sur);box-shadow:var(--neu-sm);border-radius:18px;padding:6px 12px;cursor:pointer;" onclick="tapHist(\'' + esc(q) + '\')">' +
                    '<svg style="width:11px;height:11px;stroke:var(--txt2);fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' +
                    '<span style="font-size:11px;font-weight:700;">' + esc(q) + '</span>' +
                    '<span style="font-size:14px;color:var(--txt2);cursor:pointer;line-height:1;" onclick="event.stopPropagation();removeHist(\'' + esc(q) + '\')">&#215;</span>' +
                    '</div>';
            }).join('') +
            '</div>';
    }
    h += '<div style="font-size:15px;font-weight:900;margin-bottom:10px;">Trending Now</div>' +
        '<div style="display:flex;flex-direction:column;gap:7px;">' +
        [{ n: 'CapCut Pro', id: 2 }, { n: 'Picsart Pro', id: 1 }, { n: 'Minecraft', id: 31 },
        { n: 'Netflix Premium', id: 29 }, { n: 'KineMaster Pro', id: 8 },
        { n: 'Alight Motion Pro', id: 13 }, { n: 'Lightroom Mobile', id: 28 },
        { n: 'InShot Pro', id: 19 }
        ].map(function(t, i) {
            const a = APPS[t.id];
            if (!a) return '';
            return '<div style="display:flex;align-items:center;gap:10px;background:var(--glass);border:1.5px solid rgba(255,255,255,.85);box-shadow:var(--neu-sm);border-radius:14px;padding:9px 12px;cursor:pointer;" onclick="tapHist(\'' + esc(t.n) + '\')">' +
                '<span style="font-size:12px;font-weight:900;color:' + (i < 3 ? 'var(--red)' : 'var(--txt2)') + ';width:16px;text-align:center;flex-shrink:0;">' + (i + 1) + '</span>' +
                '<img src="' + esc(a.img) + '" style="width:34px;height:34px;border-radius:9px;object-fit:cover;flex-shrink:0;border:2px solid #fff;box-shadow:2px 2px 0 rgba(0,0,0,.08);" onerror="this.style.background=\'#e0e3ec\'" alt="' + esc(t.n) + '">' +
                '<div style="flex:1;min-width:0;"><div style="font-size:12px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + esc(t.n) + '</div>' +
                '<div style="font-size:9px;color:var(--txt2);font-weight:600;">' + esc(a.cat) + '</div></div>' +
                '<svg style="width:13px;height:13px;stroke:var(--txt2);fill:none;stroke-width:2.5;" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>' +
                '</div>';
        }).join('') + '</div>';
    document.getElementById('srch-home').innerHTML = h;
}

// ============ COMMENTS ============
function cRender(id) {
    const stored = (cDB[id] || []);
    let all = stored.slice();
    if (all.length === 0) all = DEFAULT_COMMENTS.slice();
    return all.map(function(cm) {
        return '<div class="cmt-box">' +
            '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">' +
            '<div style="display:flex;align-items:center;gap:8px;">' +
            '<div class="cmt-avatar">' + esc((cm.name[0] || '?').toUpperCase()) + '</div>' +
            '<div><div style="font-size:12px;font-weight:800;">' + esc(cm.name) + '</div><div style="font-size:9px;color:var(--txt2);font-weight:600;">' + esc(cm.date) + '</div></div>' +
            '</div>' +
            '<div style="color:var(--ylw);font-size:11px;">' + '★'.repeat(cm.stars) + '☆'.repeat(5 - cm.stars) + '</div>' +
            '</div>' +
            '<div style="font-size:12px;color:var(--txt);font-weight:500;line-height:1.6;">' + esc(cm.text) + '</div>' +
            '</div>';
    }).join('');
}

function cSection(id, rt, cnt) {
    const bars = [75, 60, 30, 15, 10];
    let h = '<div style="background:var(--glass);border:1.5px solid rgba(255,255,255,.9);box-shadow:var(--neu);border-radius:18px;padding:14px;margin-bottom:10px;display:flex;align-items:center;gap:12px;">' +
        '<div style="text-align:center;flex-shrink:0;"><div style="font-size:32px;font-weight:900;line-height:1;">' + esc(rt) + '</div>' +
        '<div style="color:var(--ylw);font-size:12px;margin:3px 0;">&#9733;&#9733;&#9733;&#9733;&#9733;</div>' +
        '<div style="font-size:9px;color:var(--txt2);font-weight:700;">' + esc(cnt) + ' reviews</div></div>' +
        '<div style="flex:1;">';
    [5, 4, 3, 2, 1].forEach(function(s) {
        h += '<div style="display:flex;align-items:center;gap:5px;margin-bottom:4px;"><span style="font-size:9px;font-weight:700;color:var(--txt2);width:7px;">' + s + '</span>' +
            '<svg width="9" height="9" viewBox="0 0 24 24" fill="var(--ylw)" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' +
            '<div style="flex:1;height:5px;background:var(--bg);border-radius:3px;overflow:hidden;">' +
            '<div style="height:100%;background:linear-gradient(90deg,var(--ylw),#ff9500);border-radius:3px;width:' + bars[5 - s] + '%;"></div>' +
            '</div></div>';
    });
    h += '</div></div>' +
        '<div style="background:var(--glass);border:1.5px solid rgba(255,255,255,.9);box-shadow:var(--neu);border-radius:18px;padding:14px;margin-bottom:10px;">' +
        '<div style="font-size:13px;font-weight:800;margin-bottom:8px;">Write a Review</div>' +
        '<div style="display:flex;gap:6px;margin-bottom:10px;">';
    for (let s = 1; s <= 5; s++) {
        h += '<span class="star-pick" onclick="cPick(' + id + ',' + s + ')" id="cs-' + id + '-' + s + '">&#9733;</span>';
    }
    h += '</div>' +
        '<div style="background:var(--bg);box-shadow:var(--neu-in);border-radius:12px;padding:10px;margin-bottom:10px;">' +
        '<textarea id="ct-' + id + '" placeholder="Share your experience..." class="review-textarea"></textarea>' +
        '</div>' +
        '<button onclick="cSubmit(' + id + ')" style="width:100%;background:linear-gradient(145deg,#e8192c,#bb0019);color:#fff;border:none;border-radius:13px;padding:12px;font-family:\'Plus Jakarta Sans\',sans-serif;font-size:13px;font-weight:800;cursor:pointer;box-shadow:0 4px 0 #7a0011;">Submit Review</button>' +
        '</div>' +
        '<div id="clist-' + id + '">' + cRender(id) + '</div>';
    return h;
}

// ============ FAV BUTTON UPDATE ============
function updateFavButton(btn, id) {
    if (!btn) return;
    const isFav = favs.has(id);
    btn.style.color = isFav ? 'var(--red)' : 'var(--txt2)';
    const path = btn.querySelector('path');
    if (path) {
        path.style.fill = isFav ? 'var(--red)' : 'none';
    }
      }
