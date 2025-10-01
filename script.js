/**
 * =================================================================================
 * CONFIGURACIÓN DE DATOS ESTÁTICOS
 * =================================================================================
 */
const staticData = {
    operacionesTotales: {
        comercial: [ { periodo: '2022', operaciones: 8996, pasajeros: 912415 }, { periodo: '2023', operaciones: 23211, pasajeros: 2631261 }, { periodo: '2024', operaciones: 51734, pasajeros: 6318454 }, { periodo: '2025', operaciones: 39774, pasajeros: 4396262 } ],
        carga: [ { periodo: '2022', operaciones: 8, toneladas: 5.19 }, { periodo: '2023', operaciones: 5578, toneladas: 186319.83 }, { periodo: '2024', operaciones: 13219, toneladas: 447341.17 }, { periodo: '2025', operaciones: 74052, toneladas: 284946 } ],
        general: [ { periodo: '2022', operaciones: 458, pasajeros: 1385 }, { periodo: '2023', operaciones: 2212, pasajeros: 8160 }, { periodo: '2024', operaciones: 2777, pasajeros: 29637 }, { periodo: '2025', operaciones: 2111, pasajeros: 1885 } ]
    },
    demoras: {
        periodo: "Agosto 2025",
        causas: [ { causa: 'Repercusión', demoras: 219 }, { causa: 'Compañía', demoras: 190 }, { causa: 'Evento Circunstancial', demoras: 8 }, { causa: 'Combustible', demoras: 5 }, { causa: 'Autoridad', demoras: 4 }, { causa: 'Meteorología', demoras: 199 }, { causa: 'Aeropuerto', demoras: 4 }, ]
    }
};
const dashboardData = {
    users: {
        "David Pacheco": { password: "2468", canViewItinerarioMensual: true },
        "Isaac López": { password: "18052003", canViewItinerarioMensual: false },
        "Mauro Hernández": { password: "Mauro123", canViewItinerarioMensual: true },
        "Emily Beltrán": { password: "Emily67", canViewItinerarioMensual: true },
        "Director General": { password: "Dirección71", canViewItinerarioMensual: true },
        "Director de Operaciones": { password: "DirecciónNLU", canViewItinerarioMensual: true },
        "Mateos": { password: "2025M", canViewItinerarioMensual: true }
    },
    pdfSections: { "itinerario-mensual": { title: "Itinerario Mensual", url: "pdfs/itinerario_mensual.pdf" } }
};
let allFlightsData = [];
let passengerAirlines = ["Viva", "Volaris", "Aeromexico", "Mexicana de Aviación", "Aeurus", "Arajet"];
let cargoAirlines = ["MasAir", "China Southerrn", "Lufthansa", "Kalitta Air", "Aerounión", "Emirates Airlines", "Atlas Air", "Silk Way West Airlines", "Cathay Pacific", "United Parcel Service", "Turkish Airlines", "Cargojet Airways", "Air Canada", "Cargolux"];
const airlineColors = { "Viva": "#00b200", "Volaris": "#6f2da8", "Aeromexico": "#00008b", "Mexicana de Aviación": "#a52a2a", "Aeurus": "#ff4500", "Arajet": "#00ced1", "MasAir": "#4682b4", "China Southerrn": "#c71585", "Lufthansa": "#ffcc00", "Kalitta Air": "#dc143c", "Aerounión": "#2e8b57", "Emirates Airlines": "#d4af37", "Atlas Air": "#808080", "Silk Way West Airlines": "#f4a460", "Cathay Pacific": "#006400", "United Parcel Service": "#5f4b32", "Turkish Airlines": "#e81123", "Cargojet Airways": "#f0e68c", "Air Canada": "#f00", "Cargolux": "#00a0e2" };
const charts = {};

document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeSidebarState();
    if (document.getElementById('login-screen') && !document.getElementById('login-screen').classList.contains('hidden')) { animateLoginTitle(); }
    loadItineraryData();      
    renderDemoras();          
    renderOperacionesTotales(); 
    createPdfSections();
    setupEventListeners();
    updateClock();
    updateDate();
    setInterval(updateClock, 1000);
    setInterval(updateDate, 60000);
    checkSession();
});

function setupEventListeners() {
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('sidebar-nav').addEventListener('click', handleNavigation);
    document.getElementById('airline-filter').addEventListener('change', applyFilters);
    // search input for banda de reclamo (specific) and a global search box
    const claimInput = document.getElementById('claim-filter'); if (claimInput) claimInput.addEventListener('input', applyFilters);
    const globalSearch = document.getElementById('global-search'); if (globalSearch) globalSearch.addEventListener('input', applyFilters);
    // position select (populated from JSON)
    const posSelect = document.getElementById('position-filter'); if (posSelect) posSelect.addEventListener('change', applyFilters);
    document.getElementById('theme-toggler').addEventListener('click', toggleTheme);
    const clearBtn = document.getElementById('clear-filters'); if (clearBtn) clearBtn.addEventListener('click', clearFilters);
    document.getElementById('sidebar-toggler').addEventListener('click', toggleSidebar);
    setupBodyEventListeners();
    setupLightboxListeners();
}
function animateLoginTitle() {
    const titleElement = document.getElementById('login-title');
    if (!titleElement) return;
        // Mantener el título solicitado
        titleElement.textContent = "OPERACIONES AIFA";
}
function animateCounter(elementId, endValue, duration = 2500, isDecimal = false) {
    const element = document.getElementById(elementId);
    if (!element) return;
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentValue = progress * endValue;
        if (isDecimal) {
            element.textContent = new Intl.NumberFormat('es-MX', {maximumFractionDigits: 2, minimumFractionDigits: 2}).format(currentValue);
        } else {
            element.textContent = new Intl.NumberFormat('es-MX').format(Math.floor(currentValue));
        }
        if (progress < 1) { window.requestAnimationFrame(step); }
    };
    window.requestAnimationFrame(step);
}
function handleLogin(e) {
    e.preventDefault();
    const loginButton = document.getElementById('login-button');
    loginButton.classList.add('loading');
    setTimeout(() => {
        const usernameInput = (document.getElementById('username').value || '').toString();
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('login-error');
        // Buscar usuario por nombre normalizado (insensible a mayúsculas/espacios)
        const normalized = usernameInput.trim().toLowerCase();
        const matchedKey = Object.keys(dashboardData.users).find(k => (k || '').toString().trim().toLowerCase() === normalized);
        const user = matchedKey ? dashboardData.users[matchedKey] : undefined;
        if (user && user.password === password) {
            sessionStorage.setItem('currentUser', matchedKey);
            showMainApp();
        } else {
            errorDiv.textContent = 'Usuario o contraseña incorrectos';
            loginButton.classList.remove('loading');
        }
    }, 500);
}
function updateClock() {
    const clockElement = document.getElementById('formal-clock');
    if (clockElement) {
        const now = new Date();
        clockElement.textContent = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
        const utcElement = document.getElementById('utc-clock');
        if (utcElement) {
            const nowUtc = new Date();
            utcElement.textContent = nowUtc.toLocaleTimeString('es-ES', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'UTC' });
        }
}
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') { document.body.classList.add('dark-mode'); updateThemeIcon(true); }
}
function toggleTheme() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    updateThemeIcon(isDarkMode);
    renderDemoras();
    renderOperacionesTotales();
}
function updateThemeIcon(isDarkMode) {
    const themeToggler = document.getElementById('theme-toggler');
    themeToggler.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}
function initializeSidebarState() {
    const isMobile = window.innerWidth <= 991.98;
    if (!isMobile) {
        const savedState = localStorage.getItem('sidebarState') || 'collapsed';
        if (savedState === 'collapsed') { document.body.classList.add('sidebar-collapsed'); }
    }
}
function toggleSidebar() {
    const isMobile = window.innerWidth <= 991.98;
    if (isMobile) {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        sidebar.classList.toggle('visible');
        overlay.classList.toggle('active');
    } else {
        const isCollapsed = document.body.classList.toggle('sidebar-collapsed');
        localStorage.setItem('sidebarState', isCollapsed ? 'collapsed' : 'expanded');
    }
}
function getChartColors() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    return {
        grid: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        ticks: isDarkMode ? '#bbb' : '#666',
        labels: isDarkMode ? '#e8eaed' : '#343a40',
        tooltip: { backgroundColor: isDarkMode ? '#151d27' : '#fff', titleColor: isDarkMode ? '#e8eaed' : '#333', bodyColor: isDarkMode ? '#e8eaed' : '#333', }
    };
}
async function loadItineraryData() {
    try {
        const response = await fetch('data/itinerario.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        allFlightsData = await response.json();
    displaySummaryTable(allFlightsData);
    populateAirlineFilter();
    populatePositionFilter();
    applyFilters(); 
    } catch (error) {
        console.error("Error al cargar itinerario:", error);
        const passengerContainer = document.getElementById('passenger-itinerary-container');
        if(passengerContainer) { passengerContainer.innerHTML = `<div class="alert alert-danger">Error al cargar datos del itinerario.</div>`; }
    }
}
function applyFilters() {
    const selectedAirlineRaw = document.getElementById('airline-filter').value;
    const selectedAirline = (selectedAirlineRaw || '').toString().trim();
    const claimFilterValue = document.getElementById('claim-filter') ? document.getElementById('claim-filter').value.trim().toLowerCase() : '';
    const globalSearchValue = document.getElementById('global-search') ? document.getElementById('global-search').value.trim().toLowerCase() : '';
    // position is now a select populated from JSON
    const posFilterVal = document.getElementById('position-filter') ? document.getElementById('position-filter').value : 'all';
    let filteredData = allFlightsData;
    if (selectedAirline && selectedAirline !== 'all') { filteredData = filteredData.filter(flight => (flight.aerolinea || '').toString().trim() === selectedAirline); }
    // Prefer categorization via 'categoria' field when available
    let passengerFlights = filteredData.filter(f => (f.categoria && f.categoria.toLowerCase() === 'pasajeros') || passengerAirlines.includes(f.aerolinea));
    let cargoFlights = filteredData.filter(f => (f.categoria && f.categoria.toLowerCase() === 'carga') || cargoAirlines.includes(f.aerolinea));
    if (claimFilterValue !== '') { passengerFlights = passengerFlights.filter(flight => (flight.banda_reclamo || '').toString().toLowerCase().includes(claimFilterValue)); }
    // position filter (select) - applies to both (value 'all' means no filter)
    if (posFilterVal && posFilterVal !== 'all') {
        const posLower = posFilterVal.toString().toLowerCase();
        passengerFlights = passengerFlights.filter(f => (f.posicion || '').toString().toLowerCase() === posLower);
        cargoFlights = cargoFlights.filter(f => (f.posicion || '').toString().toLowerCase() === posLower);
    }
    // global text search across common fields
    // If global search has content, use it to search across airline, origen, destino, vuelo, banda
    if (globalSearchValue !== '') {
        const term = globalSearchValue;
        const matchFn = (f) => {
            return ((f.aerolinea || '').toString().toLowerCase().includes(term)) || ((f.origen || '').toString().toLowerCase().includes(term)) || ((f.destino || '').toString().toLowerCase().includes(term)) || ((f.vuelo_llegada || '').toString().toLowerCase().includes(term)) || ((f.vuelo_salida || '').toString().toLowerCase().includes(term)) || ((f.banda_reclamo || '').toString().toLowerCase().includes(term));
        };
        passengerFlights = passengerFlights.filter(matchFn);
        cargoFlights = cargoFlights.filter(matchFn);
    }
    displayPassengerTable(passengerFlights);
    displayCargoTable(cargoFlights);
    // update summary based on currently visible (filtered) data
    displaySummaryTable(filteredData);
    // Nota: el resumen diario por aerolínea fue removido del UI; no renderizamos conteos aquí.
    // Si se requiere reinstalar, reimplementar renderItinerarioSummary y descomentar la línea siguiente:
    // renderItinerarioSummary(filteredData);
}

// La función renderItinerarioSummary fue removida a petición: el apartado "Itinerario Detallado" mostrará únicamente los PDFs (mapas/grafica).
// Si en el futuro se requiere volver a mostrar un resumen por aerolínea, reimplementar la función aquí.

function populatePositionFilter() {
    const select = document.getElementById('position-filter');
    if (!select) return;
    const posSet = new Set();
    allFlightsData.forEach(f => {
        const p = (f.posicion || '').toString().trim();
        if (p) posSet.add(p);
    });
    const positions = Array.from(posSet).sort((a,b)=>{ return a.localeCompare(b, 'es'); });
    // clear and add default
    select.innerHTML = '<option value="all" selected>Todas las posiciones</option>';
    positions.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.toString().toLowerCase();
        opt.textContent = p;
        select.appendChild(opt);
    });
}

function clearFilters() {
    const airline = document.getElementById('airline-filter'); if (airline) airline.value = 'all';
    const pos = document.getElementById('position-filter'); if (pos) pos.value = 'all';
    const claim = document.getElementById('claim-filter'); if (claim) claim.value = '';
    applyFilters();
    // visual confirmation: temporary highlight and toast
    const btn = document.getElementById('clear-filters');
    if (btn) {
        btn.classList.add('btn-success');
        setTimeout(() => btn.classList.remove('btn-success'), 900);
    }
    const toastEl = document.getElementById('action-toast');
    if (toastEl && typeof bootstrap !== 'undefined' && bootstrap.Toast) {
        try { const t = new bootstrap.Toast(toastEl); t.show(); } catch(e) { /* ignore */ }
    }
}

function viewFlightsForAirline(airline) {
    // set airline filter and re-run
    const select = document.getElementById('airline-filter');
    if (!select) return;
    // ensure option exists
    let exists = Array.from(select.options).find(o => o.value === airline);
    if (!exists) {
        const opt = document.createElement('option'); opt.value = airline; opt.textContent = airline; select.appendChild(opt);
    }
    select.value = airline;
    applyFilters();
    // programmatically switch to interactive tab (itinerario section view already shows tables)
    // scroll passenger table into view
    const passengerEl = document.getElementById('passenger-itinerary-container');
    if (passengerEl) passengerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function displaySummaryTable(flights) {
    const container = document.getElementById('summary-table-container');
    if (!container) return;
    // Normalizar aerolínea vacía a etiqueta legible
    const summary = flights.reduce((acc, flight) => {
        let airline = (flight.aerolinea || '').trim();
        if (!airline) airline = 'Sin aerolínea';
        if (!acc[airline]) acc[airline] = { paxLlegadas: 0, paxSalidas: 0, cargLlegadas: 0, cargSalidas: 0 };
        const cat = (flight.categoria || '').toString().toLowerCase();
        if (cat === 'pasajeros') {
            if (flight.vuelo_llegada) acc[airline].paxLlegadas++;
            if (flight.vuelo_salida) acc[airline].paxSalidas++;
        } else if (cat === 'carga') {
            if (flight.vuelo_llegada) acc[airline].cargLlegadas++;
            if (flight.vuelo_salida) acc[airline].cargSalidas++;
        } else {
            // Unknown category: try to infer from known lists
            if (passengerAirlines.includes(airline)) {
                if (flight.vuelo_llegada) acc[airline].paxLlegadas++;
                if (flight.vuelo_salida) acc[airline].paxSalidas++;
            } else if (cargoAirlines.includes(airline)) {
                if (flight.vuelo_llegada) acc[airline].cargLlegadas++;
                if (flight.vuelo_salida) acc[airline].cargSalidas++;
            } else {
                // default to pasajeros
                if (flight.vuelo_llegada) acc[airline].paxLlegadas++;
                if (flight.vuelo_salida) acc[airline].paxSalidas++;
            }
        }
        return acc;
    }, {});

    // Build a stacked card view: one card per airline with totals (Llegadas/Salidas)
    const airlines = Object.keys(summary).sort((a, b) => {
        const totalA = (summary[a].paxLlegadas || 0) + (summary[a].paxSalidas || 0) + (summary[a].cargLlegadas || 0) + (summary[a].cargSalidas || 0);
        const totalB = (summary[b].paxLlegadas || 0) + (summary[b].paxSalidas || 0) + (summary[b].cargLlegadas || 0) + (summary[b].cargSalidas || 0);
        return totalB - totalA;
    });

    if (airlines.length === 0) {
        container.innerHTML = `<div class="alert alert-info bg-transparent text-body">No se encontraron operaciones.</div>`;
        return;
    }

    let html = `<div class="d-flex flex-column gap-2">`;
    airlines.forEach((airline, index) => {
        const data = summary[airline];
        const arrivals = (data.paxLlegadas || 0) + (data.cargLlegadas || 0);
        const departures = (data.paxSalidas || 0) + (data.cargSalidas || 0);
        const safeId = (airline || 'sin-aerolinea').replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-_]/g, '').toLowerCase();
        const collapseId = `collapse-${safeId}-${index}`;
        const color = airlineColors[airline] || '#ccc';

        html += `
        <div class="card">
            <div class="card-body d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                    <span class="airline-dot me-2" style="background-color: ${color}; width:12px; height:12px; display:inline-block; border-radius:50%;"></span>
                    <strong>${airline}</strong>
                </div>
                <div class="d-flex align-items-center gap-3">
                    <div class="text-center">
                        <div class="fw-bold">${new Intl.NumberFormat('es-MX').format(arrivals)}</div>
                        <small class="text-muted">Llegadas</small>
                    </div>
                    <div class="text-center">
                        <div class="fw-bold">${new Intl.NumberFormat('es-MX').format(departures)}</div>
                        <small class="text-muted">Salidas</small>
                    </div>
                    <button class="btn btn-sm btn-outline-secondary" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="false" aria-controls="${collapseId}">Detalle</button>
                </div>
            </div>
            <div class="collapse" id="${collapseId}">
                <div class="card-body py-2">
                    <table class="table table-sm mb-2">
                        <thead><tr><th></th><th class="text-center">Llegadas</th><th class="text-center">Salidas</th></tr></thead>
                        <tbody>
                            <tr><td>Pasajeros</td><td class="text-center">${new Intl.NumberFormat('es-MX').format(data.paxLlegadas || 0)}</td><td class="text-center">${new Intl.NumberFormat('es-MX').format(data.paxSalidas || 0)}</td></tr>
                            <tr><td>Carga</td><td class="text-center">${new Intl.NumberFormat('es-MX').format(data.cargLlegadas || 0)}</td><td class="text-center">${new Intl.NumberFormat('es-MX').format(data.cargSalidas || 0)}</td></tr>
                        </tbody>
                    </table>
                    <div class="d-flex justify-content-end">
                        <button class="btn btn-sm btn-primary" onclick="viewFlightsForAirline('${airline.replace(/'/g, "\\'")}')">Ver vuelos</button>
                    </div>
                </div>
            </div>
        </div>`;
    });
    html += `</div>`;
    container.innerHTML = html;
}
function displayPassengerTable(flights) {
    const container = document.getElementById('passenger-itinerary-container');
    if (!container) return;
    if (flights.length === 0) { container.innerHTML = `<div class="alert alert-info bg-transparent text-body">No se encontraron vuelos de pasajeros.</div>`; return; }
    let tableHtml = `<table class="table table-hover"><thead><tr><th>Aerolínea</th><th>Vuelo Lleg.</th><th>Fecha Lleg.</th><th>Hora Lleg.</th><th>Origen</th><th>Banda</th><th>Posición</th><th>Vuelo Sal.</th><th>Fecha Sal.</th><th>Hora Sal.</th><th>Destino</th></tr></thead><tbody>`;
    flights.forEach((flight, index) => {
        tableHtml += `<tr class="animated-row" style="--delay: ${index * 0.08}s; --airline-color: ${airlineColors[flight.aerolinea] || '#ccc'};">
            <td>${flight.aerolinea}</td>
            <td>${flight.vuelo_llegada || '-'}</td>
            <td>${flight.fecha_llegada || '-'}</td>
            <td>${flight.hora_llegada || '-'}</td>
            <td>${flight.origen || '-'}</td>
            <td class="text-center">${flight.banda_reclamo || '-'}</td>
            <td>${flight.posicion || '-'}</td>
            <td>${flight.vuelo_salida || '-'}</td>
            <td>${flight.fecha_salida || '-'}</td>
            <td>${flight.hora_salida || '-'}</td>
            <td>${flight.destino || '-'}</td>
        </tr>`;
    });
    tableHtml += `</tbody></table>`;
    container.innerHTML = tableHtml;
}
function displayCargoTable(flights) {
    const container = document.getElementById('cargo-itinerary-container');
    if (!container) return;
    if (flights.length === 0) { container.innerHTML = `<div class="alert alert-info bg-transparent text-body">No se encontraron vuelos de carga.</div>`; return; }
    let tableHtml = `<table class="table table-hover"><thead><tr><th>Aerolínea</th><th>Vuelo Lleg.</th><th>Fecha Lleg.</th><th>Hora Lleg.</th><th>Origen</th><th>Posición</th><th>Vuelo Sal.</th><th>Fecha Sal.</th><th>Hora Sal.</th><th>Destino</th></tr></thead><tbody>`;
    flights.forEach((flight, index) => {
        tableHtml += `<tr class="animated-row" style="--delay: ${index * 0.08}s; --airline-color: ${airlineColors[flight.aerolinea] || '#ccc'};">
            <td>${flight.aerolinea}</td>
            <td>${flight.vuelo_llegada || '-'}</td>
            <td>${flight.fecha_llegada || '-'}</td>
            <td>${flight.hora_llegada || '-'}</td>
            <td>${flight.origen || '-'}</td>
            <td>${flight.posicion || '-'}</td>
            <td>${flight.vuelo_salida || '-'}</td>
            <td>${flight.fecha_salida || '-'}</td>
            <td>${flight.hora_salida || '-'}</td>
            <td>${flight.destino || '-'}</td>
        </tr>`;
    });
    tableHtml += `</tbody></table>`;
    container.innerHTML = tableHtml;
}
function populateAirlineFilter() {
    const filterSelect = document.getElementById('airline-filter');
    if (!filterSelect) return;
    // Collect all unique airline names from the JSON (normalized)
    const airlinesSet = new Set();
    allFlightsData.forEach(f => {
        const raw = (f.aerolinea || '').toString().trim();
        if (raw) airlinesSet.add(raw);
    });
    // Fallback to static lists if JSON empty
    if (airlinesSet.size === 0) {
        passengerAirlines.concat(cargoAirlines).forEach(a => airlinesSet.add(a));
    }

    const airlines = Array.from(airlinesSet).sort((a,b) => a.localeCompare(b, 'es'));

    // Update global passenger/cargo lists conservatively (keep existing classification)
    passengerAirlines = passengerAirlines.filter(a => airlinesSet.has(a));
    cargoAirlines = cargoAirlines.filter(a => airlinesSet.has(a));

    filterSelect.innerHTML = '<option value="all" selected>Todas las aerolíneas</option>';
    // Add all airlines as flat list to avoid missing any entry
    airlines.forEach(airline => {
        const option = document.createElement('option');
        option.value = airline; // exact trimmed name
        option.textContent = airline;
        filterSelect.appendChild(option);
    });
}
function populateOpsTable(baseId, data, valueKey) {
    const tbody = document.getElementById(`${baseId}-tbody`);
    if (!tbody) return;
    tbody.innerHTML = '';
    let totalOps = 0; let totalValue = 0;
    data.forEach(row => { totalOps += row.operaciones; totalValue += row[valueKey]; tbody.innerHTML += `<tr><td class="text-start">${row.periodo}</td><td class="text-end">${new Intl.NumberFormat('es-MX').format(row.operaciones)}</td><td class="text-end">${new Intl.NumberFormat('es-MX', {maximumFractionDigits: 2}).format(row[valueKey])}</td></tr>`; });
    const isDecimal = valueKey === 'toneladas';
    if (baseId === 'comercial-ops') { animateCounter('total-comercial-ops', totalOps, 2500); animateCounter('total-comercial-pax', totalValue, 2500); }
    else if (baseId === 'cargo-ops') { animateCounter('total-cargo-ops', totalOps, 2500); animateCounter('total-cargo-tons', totalValue, 2500, isDecimal); }
    else if (baseId === 'general-ops') { animateCounter('total-general-ops', totalOps, 2500); animateCounter('total-general-pax', totalValue, 2500); }
}
function renderDemoras() {
    const title = document.getElementById('demoras-title');
    if (!title) return;
    const { periodo, causas } = staticData.demoras;
    title.textContent = `Análisis de Demoras - ${periodo}`;
    const tbody = document.getElementById('demoras-tbody');
    const tfoot = document.getElementById('demoras-tfoot');
    let totalDemoras = causas.reduce((sum, item) => sum + item.demoras, 0);
    tbody.innerHTML = '';
    causas.forEach((item, index) => {
        const porcentaje = totalDemoras > 0 ? (item.demoras / totalDemoras * 100).toFixed(2) + '%' : '0.00%';
        const row = document.createElement('tr');
        row.classList.add('fade-in-row');
        row.style.setProperty('--delay', `${index * 0.1}s`);
        row.innerHTML = `<td>${item.causa}</td><td>${new Intl.NumberFormat('es-MX').format(item.demoras)}</td><td>${porcentaje}</td>`;
        tbody.appendChild(row);
    });
    tfoot.innerHTML = `<tr class="table-total-row"><td>Total</td><td>${new Intl.NumberFormat('es-MX').format(totalDemoras)}</td><td>100%</td></tr>`;
    renderDelaysChart(causas, totalDemoras);
}
function renderOperacionesTotales() {
    const { comercial, carga, general } = staticData.operacionesTotales;
    populateOpsTable('comercial-ops', comercial, 'pasajeros');
    createBarChart('commercialOpsChart', comercial.map(d => d.periodo), comercial.map(d => d.operaciones), comercial.map(d => d.pasajeros), 'Operaciones', 'Pasajeros');
    populateOpsTable('cargo-ops', carga, 'toneladas');
    createBarChart('cargoOpsChart', carga.map(d => d.periodo), carga.map(d => d.operaciones), carga.map(d => d.toneladas), 'Operaciones', 'Toneladas');
    populateOpsTable('general-ops', general, 'pasajeros');
    createBarChart('generalOpsChart', general.map(d => d.periodo), general.map(d => d.operaciones), general.map(d => d.pasajeros), 'Operaciones', 'Pasajeros');
}
function renderDelaysChart(causas, totalDemoras) {
    const ctx = document.getElementById('delaysChart');
    if (!ctx) return;
    if (charts.delays) charts.delays.destroy();
    Chart.register(ChartDataLabels);
    const colors = getChartColors();
    const data = {
        labels: causas.map(item => `${item.causa}`),
        datasets: [{ data: causas.map(item => item.demoras), backgroundColor: ['#1e88e5', '#ffc107', '#6c757d', '#17a2b8', '#343a40', '#adb5bd', '#495057'], borderColor: document.body.classList.contains('dark-mode') ? '#1e2a38' : '#fff', borderWidth: 3 }]
    };
    charts.delays = new Chart(ctx, {
        type: 'doughnut', data: data,
        options: {
            animation: { duration: 2000, easing: 'easeInOutQuart' },
            responsive: true, maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { color: colors.labels } },
                title: { display: true, text: 'Distribución de Causas de Demora', font: { size: 16 }, padding: { bottom: 20 }, color: colors.labels },
                datalabels: {
                    formatter: (value) => { const percentage = totalDemoras > 0 ? (value / totalDemoras * 100) : 0; if (percentage < 4) return null; return `${percentage.toFixed(1)}%`; },
                    color: '#fff', font: { weight: 'bold' }
                }
            }
        }
    });
}
function createBarChart(canvasId, labels, data1, data2, label1, label2) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    if (charts[canvasId]) charts[canvasId].destroy();
    const colors = getChartColors();
    const gradient1 = canvas.getContext('2d').createLinearGradient(0, 0, 0, 300);
    gradient1.addColorStop(0, 'rgba(30, 136, 229, 0.8)'); gradient1.addColorStop(1, 'rgba(30, 136, 229, 0.4)');
    const gradient2 = canvas.getContext('2d').createLinearGradient(0, 0, 0, 300);
    gradient2.addColorStop(0, 'rgba(0, 172, 193, 0.8)'); gradient2.addColorStop(1, 'rgba(0, 172, 193, 0.4)');
    charts[canvasId] = new Chart(canvas, {
        type: 'bar',
        data: { labels: labels, datasets: [{ label: label1, data: data1, backgroundColor: gradient1, borderColor: 'rgba(30, 136, 229, 1)', borderWidth: 1, borderRadius: 5 }, { label: label2, data: data2, backgroundColor: gradient2, borderColor: 'rgba(0, 172, 193, 1)', borderWidth: 1, borderRadius: 5 }] },
        options: {
            animation: { duration: 2000, easing: 'easeInOutQuart' },
            responsive: true, maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, ticks: { color: colors.ticks, callback: value => new Intl.NumberFormat('es-MX').format(value) }, grid: { color: colors.grid } },
                x: { ticks: { color: colors.ticks }, grid: { color: 'transparent' } }
            },
            plugins: {
                legend: { position: 'top', labels: { color: colors.labels } },
                tooltip: { backgroundColor: colors.tooltip.backgroundColor, titleColor: colors.tooltip.titleColor, bodyColor: colors.tooltip.bodyColor, callbacks: { label: function(context) { let label = context.dataset.label || ''; if (label) { label += ': '; } label += new Intl.NumberFormat('es-MX', {maximumFractionDigits: 2}).format(context.parsed.y); return label; } } },
                datalabels: { display: true, color: colors.labels, formatter: value => new Intl.NumberFormat('es-MX').format(value), anchor: 'end', align: 'end' }
            }
        }
    });
}
function handleNavigation(e) {
    const target = e.target.closest('.menu-item');
    if (!target) return;
    e.preventDefault();
    const sectionId = target.dataset.section;
    const action = target.dataset.action;
    if (action === 'logout') { logout(); return; }
    showSection(sectionId, target);
    const isMobile = window.innerWidth <= 991.98;
    if (isMobile) {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        sidebar.classList.remove('visible');
        overlay.classList.remove('active');
    } else {
        document.body.classList.add('sidebar-collapsed');
        localStorage.setItem('sidebarState', 'collapsed');
    }
}
function checkSession() { if (sessionStorage.getItem('currentUser')) { showMainApp(); } }
function showMainApp() {
    const currentUser = sessionStorage.getItem('currentUser');
    const user = dashboardData.users[currentUser];
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');
    document.getElementById('current-user').textContent = `Usuario: ${currentUser}`;
    document.getElementById('itinerario-mensual-menu').style.display = user.canViewItinerarioMensual ? 'flex' : 'none';
    const defaultSection = document.querySelector('.menu-item');
    showSection(defaultSection.dataset.section, defaultSection);
}
function logout() {
    sessionStorage.removeItem('currentUser');
    document.getElementById('main-app').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('login-form').reset();
    document.getElementById('login-error').textContent = '';
    animateLoginTitle();
}
function showSection(sectionId, element) {
    document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
    document.getElementById(`${sectionId}-section`).classList.add('active');
    document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
    element.classList.add('active');
    if (sectionId === 'operaciones-totales') { renderOperacionesTotales(); }
    if (sectionId === 'demoras') { renderDemoras(); }
    if (sectionId === 'parte-operaciones') { renderParteOperaciones(); }
}
function updateDate() {
    const now = new Date();
    const dateString = now.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const dateElement = document.getElementById('current-date');
    if(dateElement) dateElement.textContent = dateString.charAt(0).toUpperCase() + dateString.slice(1);
}
function openFullscreen(element) {
    if (element.requestFullscreen) element.requestFullscreen();
    else if (element.mozRequestFullScreen) element.mozRequestFullScreen();
    else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();
    else if (element.msRequestFullscreen) element.msRequestFullscreen();
}
function createPdfSections() {
    for (const [id, data] of Object.entries(dashboardData.pdfSections)) {
        const container = document.getElementById(`${id}-section`);
        if (container) { container.innerHTML = `<div class="card"><div class="card-header text-center"><h2 class="mb-0">${data.title.toUpperCase()}</h2></div><div class="card-body pdf-container"><a href="#" class="pdf-zoom-btn" title="Ampliar PDF"><i class="fas fa-search-plus"></i></a><iframe src="${data.url}" width="100%" height="800px" class="border-0"></iframe></div></div>`; }
    }
}
function openLightbox(iframeSrc) {
    const lightbox = document.getElementById('pdf-lightbox');
    const lightboxContent = document.getElementById('lightbox-content');
    lightboxContent.innerHTML = `<iframe src="${iframeSrc}"></iframe>`;
    lightbox.classList.remove('hidden');
}
function closeLightbox() {
    const lightbox = document.getElementById('pdf-lightbox');
    const lightboxContent = document.getElementById('lightbox-content');
    lightbox.classList.add('hidden');
    lightboxContent.innerHTML = '';
}
function setupBodyEventListeners() {
     document.body.addEventListener('click', function(e) {
        const fullscreenButton = e.target.closest('[data-fullscreen-target]');
        if (fullscreenButton) { e.preventDefault(); const targetElement = document.querySelector(fullscreenButton.dataset.fullscreenTarget); if (targetElement) openFullscreen(targetElement); }
        if (e.target.closest('.pdf-zoom-btn')) { e.preventDefault(); const container = e.target.closest('.pdf-container'); const iframe = container.querySelector('iframe'); if (iframe) openLightbox(iframe.getAttribute('src')); }
    });
}
function setupSidebar() {
    const overlay = document.getElementById('sidebar-overlay');
    if (overlay) {
        overlay.addEventListener('click', () => {
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.remove('visible');
            overlay.classList.remove('active');
        });
    }
}
function setupLightboxListeners() {
    const lightbox = document.getElementById('pdf-lightbox');
    const lightboxClose = document.getElementById('lightbox-close');
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => { if (e.key === "Escape") closeLightbox(); });
}

// -----------------------------
// PARTE DE OPERACIONES (JSON -> Tablas)
// -----------------------------
 
