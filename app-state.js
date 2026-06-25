// ============ STATE ============
let favs = new Set();
let downloads = new Set();
let prevPg = 'pg-home';
let sCat = 'All';
let cDB = {};
let cSt = {};
let srchHist = [];
let chartMode = 0;
let currentDetailId = -1;

// User
let user = { name: 'Guest', email: '', guest: true };

// Default dummy comments (display only)
const DEFAULT_COMMENTS = [
    { name: 'Rahul M.', stars: 5, text: 'Amazing app! Works perfectly.', date: 'May 28, 2024' },
    { name: 'Sarah K.', stars: 4, text: 'Great features, highly recommended!', date: 'May 25, 2024' },
    { name: 'Ahmed R.', stars: 5, text: 'Best app. No bugs at all!', date: 'May 20, 2024' }
];

// ============ LOAD FROM STORAGE ============
try { const h = JSON.parse(localStorage.getItem('nx_h') || '[]'); srchHist = h; } catch (_) {}
try { const c = JSON.parse(localStorage.getItem('nx_c') || '{}'); cDB = c; } catch (_) {}

// ============ XSS ESCAPE ============
function esc(s) {
    if (!s) return '';
    return String(s).replace(/[&<>"]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        if (m === '"') return '&quot;';
        return m;
    });
}

// ============ CONSTANTS ============
const DLI = '<svg style="width:13px;height:13px;stroke:currentColor;fill:none;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>';
