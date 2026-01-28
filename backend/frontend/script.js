const API_URL = '/api';

// 1. Initial Load
document.addEventListener('DOMContentLoaded', () => switchUI());

function switchUI() {
    const role = document.getElementById('roleSelector').value;
    const adminArea = document.getElementById('adminArea');
    const userIdContainer = document.getElementById('userIdContainer');
    const modeBadge = document.getElementById('modeBadge');
    
    // Reset Filters
    document.getElementById('globalSearch').value = '';
    document.getElementById('globalFilter').value = 'all';

    adminArea.classList.add('hidden');
    userIdContainer.classList.add('hidden');
    
    if (role === 'admin') {
        adminArea.classList.remove('hidden');
        modeBadge.innerText = "Mode: Console Admin";
        modeBadge.className = "mt-4 inline-flex items-center px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] bg-red-50 text-red-600 border border-red-100 shadow-sm";
    } else if (role === 'user') {
        userIdContainer.classList.remove('hidden');
        modeBadge.innerText = "Mode: Member Access";
        modeBadge.className = "mt-4 inline-flex items-center px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm";
    } else {
        modeBadge.innerText = "Mode: Guest Access";
        modeBadge.className = "mt-4 inline-flex items-center px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] bg-slate-100 text-slate-600 border border-slate-200 shadow-sm";
    }
    loadBooks();
}

async function loadBooks() {
    const role = document.getElementById('roleSelector').value;
    const container = document.getElementById('bookContainer');
    
    try {
        const res = await fetch(`${API_URL}/books`);
        const books = await res.json();
        container.innerHTML = '';

        books.forEach(book => {
            const isOutStock = book.stock <= 0;
            let actionBtn = '';
            
            if (role === 'user') {
                actionBtn = `<button onclick="showDetail(${book.id})" ${isOutStock ? 'disabled' : ''} class="btn-primary w-full mt-6 ${isOutStock ? 'opacity-30 cursor-not-allowed grayscale' : ''}">PINJAM</button>`;
            } else if (role === 'admin') {
                actionBtn = `
                    <div class="grid grid-cols-2 gap-3 mt-6">
                        <button onclick="editStock(${book.id}, ${book.stock})" class="btn-primary bg-slate-900 hover:bg-slate-800 py-3 text-xs">UPDATE</button>
                        <button onclick="deleteBook(${book.id})" class="btn-danger py-3">DELETE</button>
                    </div>`;
            } else {
                actionBtn = `<button onclick="showDetail(${book.id})" class="btn-primary bg-slate-900 hover:bg-slate-800 w-full mt-6">VIEW DETAILS</button>`;
            }

            container.innerHTML += `
                <div class="book-card group">
                    <div onclick="showDetail(${book.id})" class="cursor-pointer aspect-square bg-slate-900 rounded-[2rem] flex items-center justify-center mb-6 overflow-hidden relative shadow-xl shadow-slate-200">
                        <div class="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                        <span class="text-blue-500 font-black text-4xl opacity-10 tracking-tighter italic">B.</span>
                    </div>
                    <h3 onclick="showDetail(${book.id})" class="cursor-pointer text-xl font-extrabold leading-tight hover:text-blue-600 transition-colors line-clamp-2 uppercase">${book.title}</h3>
                    <p class="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-widest italic">${book.author}</p>
                    <div class="mt-8 flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Inventory Status</span>
                        <span class="text-sm font-black ${isOutStock ? 'text-red-500' : 'text-blue-600'}">${book.stock} PCS</span>
                    </div>
                    ${actionBtn}
                </div>`;
        });
        filterBooks();
    } catch (e) { container.innerHTML = `<p class="col-span-full text-center text-red-500 font-bold p-10 bg-red-50 rounded-3xl border border-red-100 italic">⚠️ Database Connection Lost. Check Server!</p>`; }
}

function filterBooks() {
    const term = document.getElementById('globalSearch').value.toLowerCase();
    const filter = document.getElementById('globalFilter').value;
    const cards = document.querySelectorAll('#bookContainer > div');

    cards.forEach(card => {
        const title = card.querySelector('h3').innerText.toLowerCase();
        const author = card.querySelector('p').innerText.toLowerCase();
        const stockStr = card.querySelector('.mt-8 span:last-child').innerText;
        const stock = parseInt(stockStr);

        const matchesSearch = title.includes(term) || author.includes(term);
        let matchesFilter = (filter === 'all') || (filter === 'available' && stock > 0) || (filter === 'empty' && stock === 0);
        card.classList.toggle('hidden', !(matchesSearch && matchesFilter));
    });
}

// Modal Detail Logic
async function showDetail(id) {
    const role = document.getElementById('roleSelector').value;
    const modal = document.getElementById('bookModal');
    const actionArea = document.getElementById('modalActionArea');
    const mapContainer = document.getElementById('mapContainer');
    
    mapContainer.classList.add('hidden');
    actionArea.innerHTML = '';

    try {
        const res = await fetch(`${API_URL}/books/${id}`);
        const book = await res.json();
        
        document.getElementById('modalTitle').innerText = book.title;
        document.getElementById('modalAuthor').innerText = book.author;
        
        const s = document.getElementById('modalStock');
        s.innerText = book.stock > 0 ? "STOK TERSEDIA" : "STOK HABIS";
        s.className = `px-5 py-2 rounded-2xl text-[10px] font-black border ${book.stock > 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`;

        if (role === 'user' && book.stock > 0) {
            actionArea.innerHTML = `<button onclick="prepareBorrow(${book.id})" class="btn-primary w-full shadow-2xl shadow-blue-500/20">MULAI PROSES PEMINJAMAN</button>`;
        } else if (role === 'public') {
            actionArea.innerHTML = `<p class="text-xs text-center font-bold text-slate-400 bg-slate-100 p-4 rounded-2xl border border-slate-200">Silakan ganti mode ke 'Member Access' untuk meminjam buku.</p>`;
        }

        modal.classList.remove('hidden');
    } catch (e) { alert("Error Detail!"); }
}

function prepareBorrow(bookId) {
    if (!navigator.geolocation) return alert("Geolocation Error!");
    
    const btn = event.target;
    btn.innerText = "MEMINTA LOKASI...";
    btn.disabled = true;

    navigator.geolocation.getCurrentPosition((pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        document.getElementById('mapContainer').classList.remove('hidden');
        document.getElementById('gmap_canvas').src = `https://maps.google.com/maps?q=${lat},${lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
        document.getElementById('modalActionArea').innerHTML = `
            <button onclick="confirmBorrow(${bookId}, ${lat}, ${lng})" class="btn-primary bg-emerald-600 hover:bg-emerald-700 w-full">KONFIRMASI LOKASI & PINJAM</button>
            <p class="text-[9px] text-center text-slate-400 mt-4 font-bold tracking-widest uppercase">Lokasi direkam: ${lat.toFixed(4)}, ${lng.toFixed(4)}</p>`;
    }, () => {
        alert("GPS Required!");
        btn.disabled = false;
        btn.innerText = "MULAI PROSES PEMINJAMAN";
    });
}

// CRUD Admin Operations
async function confirmBorrow(bookId, lat, lng) {
    const uid = document.getElementById('userIdInput').value;
    const res = await fetch(`${API_URL}/borrow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-role': 'user', 'x-user-id': uid },
        body: JSON.stringify({ bookId, latitude: lat, longitude: lng })
    });
    const r = await res.json();
    alert(r.message); closeModal(); loadBooks();
}

document.getElementById('addBookForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = { title: document.getElementById('title').value, author: document.getElementById('author').value, stock: parseInt(document.getElementById('stock').value) };
    const res = await fetch(`${API_URL}/books`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-user-role': 'admin' }, body: JSON.stringify(payload) });
    if (res.ok) { document.getElementById('addBookForm').reset(); loadBooks(); }
});

async function editStock(id, current) {
    const val = prompt("Update Stok Unit:", current);
    if (val === null || isNaN(val)) return;
    const res = await fetch(`${API_URL}/books/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-user-role': 'admin' }, body: JSON.stringify({ stock: parseInt(val) }) });
    if (res.ok) loadBooks();
}

async function deleteBook(id) {
    if (!confirm("Hapus data dari sistem?")) return;
    const res = await fetch(`${API_URL}/books/${id}`, { method: 'DELETE', headers: { 'x-user-role': 'admin' } });
    if (res.ok) loadBooks();
}

function closeModal() { document.getElementById('bookModal').classList.add('hidden'); }