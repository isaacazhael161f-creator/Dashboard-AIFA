/**
 * =================================================================================
 * CONFIGURACIÓN DE DATOS ESTÁTICOS
 * =================================================================================
 */
const staticData = {
    operacionesTotales: {
        comercial: [ { periodo: '2022', operaciones: 8996, pasajeros: 912415 }, { periodo: '2023', operaciones: 23211, pasajeros: 2631261 }, { periodo: '2024', operaciones: 51734, pasajeros: 6318454 }, { periodo: '2025', operaciones: 39774, pasajeros: 4396262 } ],
        carga: [ { periodo: '2022', operaciones: 8, toneladas: 5.19 }, { periodo: '2023', operaciones: 5578, toneladas: 186319.83 }, { periodo: '2024', operaciones: 13219, toneladas: 447341.17 }, { periodo: '2025', operaciones: 74052, toneladas: 284946 } ],
        general: [ { periodo: '2022', operaciones: 458, pasajeros: 1385 }, { periodo: '2023', operaciones: 2212, pasajeros: 8160 }, { periodo: '2024', operaciones: 2777, pasajeros: 29637 }, { periodo: '2025', operaciones: 2111, pasajeros: 16443 } ]
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
        "Jefe Mateos": { password: "2025M", canViewItinerarioMensual: true }
    },
    pdfSections: { "itinerario-mensual": { title: "Itinerario Mensual (Octubre)", url: "pdfs/itinerario_mensual.pdf" } }
};
let allFlightsData = [];
let passengerAirlines = ["Viva", "Volaris", "Aeromexico", "Mexicana de Aviación", "Aeurus", "Arajet"];
let cargoAirlines = ["MasAir", "China Southerrn", "Lufthansa", "Kalitta Air", "Aerounión", "Emirates Airlines", "Atlas Air", "Silk Way West Airlines", "Cathay Pacific", "United Parcel Service", "Turkish Airlines", "Cargojet Airways", "Air Canada", "Cargolux"];
const airlineColors = { "Viva": "#00b200", "Volaris": "#6f2da8", "Aeromexico": "#00008b", "Mexicana de Aviación": "#a52a2a", "Aerus": "#ff4500", "Arajet": "#00ced1", "MasAir": "#4682b4", "China Southerrn": "#c71585", "Lufthansa": "#ffcc00", "Kalitta Air": "#dc143c", "Aerounión": "#2e8b57", "Emirates Airlines": "#d4af37", "Atlas Air": "#808080", "Silk Way West Airlines": "#f4a460", "Cathay Pacific": "#006400", "United Parcel Service": "#5f4b32", "Turkish Airlines": "#e81123", "Cargojet Airways": "#f0e68c", "Air Canada": "#f00", "Cargolux": "#00a0e2" };

// ===================== Logos de Aerolíneas =====================
// Mapa flexible: nombre normalizado (minúsculas, sin acentos) -> slug de archivo
// Nota: ahora usamos una lista de candidatos por aerolínea (archivos reales en images/airlines)
const airlineLogoFileMap = {
    // Pasajeros
    'viva': ['logo_viva.png'],
    'viva aerobus': ['logo_viva.png'],
    'volaris': ['logo_volaris.png'],
    'aeromexico': ['logo_aeromexico.jpg','logo_aeromexico.png'],
    'aeroméxico': ['logo_aeromexico.jpg','logo_aeromexico.png'],
    'mexicana de aviacion': ['logo_mexicana_de_aviacion.jpg','logo_mexicana.jpg'],
    'mexicana de aviación': ['logo_mexicana_de_aviacion.jpg','logo_mexicana.jpg'],
    'aerus': ['logo_aerus.png'],
    'aeurus': ['logo_aerus.png'],
    'arajet': ['logo_arajet.png','logo_arajet.jpg'],
    // Carga y otras
    'masair': ['logo_mas.png','logo_masair.png'],
    'mas air': ['logo_mas.png','logo_masair.png'],
    'aerounion': ['loho_aero_union.png','logo_aerounion.png'],
    'aerounión': ['loho_aero_union.png','logo_aerounion.png'],
    'aero union': ['loho_aero_union.png','logo_aerounion.png'],
    'air canada': ['logo_air_canada_.png','logo_air_canada.png'],
    'air canada cargo': ['logo_air_canada_.png','logo_air_canada.png'],
    'air france': ['logo_air_france_.png','logo_air_france.png'],
    'amerijet international': ['logo_amerijet_international.png'],
    'atlas air': ['logo_atlas_air.png','logo_atlas.png'],
    'cargojet airways': ['logo_cargojet.png'],
    'cargojet': ['logo_cargojet.png'],
    'cargolux': ['logo_cargolux.png'],
    'cathay pacific': ['logo_cathay_pacific.png','logo_cathay.png'],
    'conviasa': ['logo_conviasa.png'],
    'copa': ['logo_copa.png'],
    'dhl': ['logo_dhl_guatemala_.png'],
    'dhl guatemala': ['logo_dhl_guatemala_.png'],
    'estafeta': ['logo_estafeta.jpg'],
    'ethiopian airlines': ['logo_ethiopian_airlines.png'],
    'kalitta air': ['logo_kalitta_air.jpg','logo_kalitta.png'],
    'lufthansa': ['logo_lufthansa.png'],
    'lufthansa cargo': ['logo_lufthansa.png'],
    'silk way west airlines': ['logo_silk_way_west_airlines.png','logo_silkway.png'],
    'sun country airlines': ['logo_sun_country_airlines.png'],
    'united parcel service': ['logo_united_parcel_service.png'],
    'ups': ['logo_united_parcel_service.png'],
    'ifl group': ['lofo_ifl_group.png'],
    'china southern': ['logo_china_southern.png'],
    'china southerrn': ['logo_china_southern.png']
};
// Compat: entradas antiguas -> slug "base" sin extensión
const airlineLogoSlugMap = {
    'viva': 'logo_viva',
    'viva aerobus': 'logo_viva',
    'volaris': 'logo_volaris',
    'aeromexico': 'logo_aeromexico',
    'aeroméxico': 'logo_aeromexico',
    'mexicana de aviacion': 'logo_mexicana',
    'mexicana de aviación': 'logo_mexicana',
    'aerus': 'logo_aerus',
    'aeurus': 'logo_aerus',
    'arajet': 'logo_arajet',
    'masair': 'logo_masair',
    'mas air': 'logo_masair',
    'china southern': 'logo_china_southern',
    'china southerrn': 'logo_china_southern', // corrección tipográfica
    'lufthansa': 'logo_lufthansa',
    'lufthansa cargo': 'logo_lufthansa',
    'kalitta air': 'logo_kalitta',
    'aerounion': 'logo_aerounion',
    'aerounión': 'logo_aerounion',
    'emirates': 'logo_emirates',
    'emirates airlines': 'logo_emirates',
    'emirates skycargo': 'logo_emirates',
    'atlas air': 'logo_atlas',
    'silk way west airlines': 'logo_silkway',
    'silk way west': 'logo_silkway',
    'cathay pacific': 'logo_cathay',
    'cathay pacific cargo': 'logo_cathay',
    'united parcel service': 'logo_ups',
    'ups': 'logo_ups',
    'turkish airlines': 'logo_turkish',
    'turkish cargo': 'logo_turkish',
    'cargojet airways': 'logo_cargojet',
    'cargojet': 'logo_cargojet',
    'air canada': 'logo_air_canada',
    'air canada cargo': 'logo_air_canada',
    'cargolux': 'logo_cargolux'
};

// Algunas marcas tienen logos con proporciones que se perciben más pequeños; dales un boost
const BOOST_LOGO_SET = new Set([
    'cathay pacific',
    'atlas air',
    'air canada',
    'air france',
    'mexicana de aviacion',
    'mexicana de aviación',
    'mexicana'
]);

function getLogoSizeClass(airlineName, context = 'table') {
    const key = normalizeAirlineName(airlineName || '');
    // Por defecto usamos grande; si está en la lista, usamos XL
    if (BOOST_LOGO_SET.has(key)) return 'xl';
    // Para consistencia visual, tanto en resumen como en tablas usamos 'lg'
    return 'lg';
}

function normalizeAirlineName(name = ''){
    const s = (name || '').toString().trim().toLowerCase();
    // quitar acentos simples
    return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
function getAirlineLogoCandidates(airline){
    const key = normalizeAirlineName(airline);
    const files = airlineLogoFileMap[key];
    const candidates = [];
    if (Array.isArray(files) && files.length){
        files.forEach(f=>{ candidates.push(`images/airlines/${f}`); });
    } else {
        // Generar a partir del nombre normalizado
        const base = 'logo_' + key.replace(/\s+/g, '_');
        candidates.push(`images/airlines/${base}.png`);
        candidates.push(`images/airlines/${base}.jpg`);
        candidates.push(`images/airlines/${base}.svg`);
        // Variantes comunes: con subrayado final (air_canada_, air_france_)
        candidates.push(`images/airlines/${base}_.png`);
        candidates.push(`images/airlines/${base}_.jpg`);
        // Variaciones conocidas
        if (base.includes('aerounion')) candidates.push('images/airlines/loho_aero_union.png');
        if (base.includes('masair')) candidates.push('images/airlines/logo_mas.png');
        if (base.includes('silk_way_west') && !base.includes('silkway')) candidates.push('images/airlines/logo_silk_way_west_airlines.png');
        if (base.includes('air_canada')) candidates.push('images/airlines/logo_air_canada_.png');
        if (base.includes('air_france')) candidates.push('images/airlines/logo_air_france_.png');
        if (base.includes('ifl_group')) candidates.push('images/airlines/lofo_ifl_group.png');
    }
    // quitar duplicados conservando orden
    return [...new Set(candidates)];
}
function getAirlineLogoPath(airline){
    const cands = getAirlineLogoCandidates(airline);
    return cands.length ? cands[0] : null;
}
// Fallback para logos: si .png falla probamos .svg una vez; si también falla, ocultamos el <img>
function handleLogoError(imgEl){
    try{
        const list = (imgEl.dataset.cands || '').split('|').filter(Boolean);
        let idx = parseInt(imgEl.dataset.candIdx || '0', 10);
        if (list.length && idx < list.length - 1){
            idx += 1;
            imgEl.dataset.candIdx = String(idx);
            imgEl.src = list[idx];
            return;
        }
        // última oportunidad: alternar extensión png<->jpg<->svg en el mismo nombre
        const current = imgEl.getAttribute('src') || '';
        const nextByExt = current.endsWith('.png') ? current.replace(/\.png$/i, '.jpg')
                          : current.endsWith('.jpg') ? current.replace(/\.jpg$/i, '.svg')
                          : null;
        if (nextByExt) { imgEl.src = nextByExt; return; }
        // sin recurso: ocultar img y mantener visible el texto/color
        imgEl.style.display = 'none';
        const cell = imgEl.closest('.airline-cell');
        if (cell) cell.classList.remove('has-logo');
        const row = imgEl.closest('tr');
        if (row) row.style.removeProperty('--airline-color');
        const header = imgEl.closest('.airline-header');
        if (header) header.classList.remove('airline-has-logo');
    }catch(_){ imgEl.style.display = 'none'; }
}
// Marcar celdas/headers cuando el logo carga correctamente para ocultar texto/color
function logoLoaded(imgEl){
    try{
        const cell = imgEl.closest('.airline-cell');
        if (cell) cell.classList.add('has-logo');
        const row = imgEl.closest('tr');
        if (row) row.style.setProperty('--airline-color','transparent');
        const header = imgEl.closest('.airline-header');
        if (header) header.classList.add('airline-has-logo');
    }catch(_){}
}
const charts = {};
let showSMA = false; // estado global para SMA

function calculateTotals() {
    const totalEquipaje = Array.from(document.querySelectorAll('.embarque-equipaje')).reduce((acc, input) => acc + (parseFloat(input.value) || 0), 0);
    const totalCarga = Array.from(document.querySelectorAll('.embarque-carga')).reduce((acc, input) => acc + (parseFloat(input.value) || 0), 0);
    const totalCorreo = Array.from(document.querySelectorAll('.embarque-correo')).reduce((acc, input) => acc + (parseFloat(input.value) || 0), 0);
    const totalPaxNacional = Array.from(document.querySelectorAll('.embarque-pax-nacional')).reduce((acc, input) => acc + (parseFloat(input.value) || 0), 0);
    const totalPaxInternacional = Array.from(document.querySelectorAll('.embarque-pax-internacional')).reduce((acc, input) => acc + (parseFloat(input.value) || 0), 0);
    const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = (typeof val === 'number' && !Number.isInteger(val)) ? val.toFixed(2) : val; };
    setVal('total-equipaje', totalEquipaje.toLocaleString('es-MX'));
    setVal('total-carga', totalCarga.toLocaleString('es-MX'));
    setVal('total-correo', totalCorreo.toLocaleString('es-MX'));
    setVal('total-pax-nacional', totalPaxNacional);
    setVal('total-pax-internacional', totalPaxInternacional);
}

// Manifiestos feature removed: registry and form handling deleted per request

// wire up calculateTotals when editing tabla
document.addEventListener('input', (e) => {
    if (e.target && e.target.closest && e.target.closest('#tabla-embarque')) {
        calculateTotals();
    }
});


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

    // Respect URL hash to open a specific section (e.g. #manifiestos)
    if (location.hash && location.hash.length > 1) {
        const sectionId = location.hash.replace('#', '');
        // find matching menu item
        const menuItem = Array.from(document.querySelectorAll('.menu-item')).find(mi => mi.dataset && mi.dataset.section === sectionId);
        if (menuItem) {
            // trigger navigation handler
            showSection(sectionId, menuItem);
            // mark menu item active
            document.querySelectorAll('.menu-item').forEach(i=>i.classList.remove('active'));
            menuItem.classList.add('active');
        }
    }
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
    // quick access header button removed

    // manifest menu removed
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
    showGlobalLoader('Verificando credenciales...');
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
        hideGlobalLoader();
    }, 700);
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
    // Mostrar/ocultar tablas según categoría si hay filtro de aerolínea específico
    const passContainer = document.getElementById('passenger-itinerary-container');
    const cargoContainer = document.getElementById('cargo-itinerary-container');
    const passBlock = document.getElementById('passenger-itinerary-scroll')?.closest('.itinerary-horizontal');
    const cargoBlock = document.getElementById('cargo-itinerary-scroll')?.closest('.itinerary-horizontal');
    const isSpecificAirline = !!selectedAirline && selectedAirline !== 'all';
    if (isSpecificAirline) {
        const isPassengerAirline = passengerAirlines.includes(selectedAirline) || (filteredData.some(f=> (f.aerolinea||'')===selectedAirline && (f.categoria||'').toLowerCase()==='pasajeros'));
        const isCargoAirline = cargoAirlines.includes(selectedAirline) || (filteredData.some(f=> (f.aerolinea||'')===selectedAirline && (f.categoria||'').toLowerCase()==='carga'));
        // Si es de pasajeros, ocultar bloque de carga
        if (isPassengerAirline && !isCargoAirline) {
            if (cargoBlock) cargoBlock.style.display = 'none';
            if (passBlock) passBlock.style.display = '';
        }
        // Si es de carga, ocultar bloque de pasajeros
        else if (isCargoAirline && !isPassengerAirline) {
            if (passBlock) passBlock.style.display = 'none';
            if (cargoBlock) cargoBlock.style.display = '';
        } else {
            // aerolínea mixta o datos mezclados: mostrar ambos
            if (passBlock) passBlock.style.display = '';
            if (cargoBlock) cargoBlock.style.display = '';
        }
    } else {
        if (passBlock) passBlock.style.display = '';
        if (cargoBlock) cargoBlock.style.display = '';
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
    const cands = getAirlineLogoCandidates(airline);
    const logoPath = cands[0];
    const dataCands = cands.join('|');
    const sizeClass = getLogoSizeClass(airline, 'summary');
    const logoHtml = logoPath ? `<img class="airline-logo ${sizeClass} me-2" src="${logoPath}" alt="Logo ${airline}" data-cands="${dataCands}" data-cand-idx="0" onerror="handleLogoError(this)" onload="logoLoaded(this)">` : '';

        html += `
        <div class="card">
            <div class="card-body d-flex justify-content-between align-items-center">
                <div class="airline-header d-flex align-items-center">${logoHtml}<strong class="airline-name">${airline}</strong></div>
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
        const airlineName = flight.aerolinea || '-';
    const cands = getAirlineLogoCandidates(airlineName);
    const logoPath = cands[0];
    const dataCands = cands.join('|');
    const sizeClass = getLogoSizeClass(airlineName, 'table');
    const logoHtml = logoPath ? `<img class="airline-logo ${sizeClass}" src="${logoPath}" alt="Logo ${airlineName}" data-cands="${dataCands}" data-cand-idx="0" onerror="handleLogoError(this)" onload="logoLoaded(this)">` : '';
        const rowColor = (airlineColors[flight.aerolinea] || '#ccc');
        tableHtml += `<tr class="animated-row" style="--delay: ${index * 0.08}s; --airline-color: ${rowColor};">
            <td><div class="airline-cell">${logoHtml}<span class="airline-name">${airlineName}</span></div></td>
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
    container.innerHTML = `<div class="table-responsive vertical-scroll">${tableHtml}</div>`;
    // After rendering, ensure the table can overflow horizontally on small screens.
    try {
        const area = document.getElementById('passenger-itinerary-scroll');
        const table = container.querySelector('table');
        if (table && area) {
            // let layout settle then measure
            requestAnimationFrame(() => {
                // temporarily let table size to content
                table.style.width = 'auto';
                const needed = table.scrollWidth;
                // if needed width exceeds visible area, enforce min-width to trigger overflow
                if (needed > area.clientWidth) {
                    table.style.minWidth = needed + 'px';
                } else {
                    // on touch devices, slightly increase minWidth to allow panning
                    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
                    if (isTouch) {
                        const forced = Math.round(area.clientWidth * 1.2);
                        table.style.minWidth = forced + 'px';
                    } else {
                        table.style.minWidth = '';
                        table.style.width = '';
                    }
                }
                // refresh controls
                try { updateScrollControlsFor('passenger-itinerary-scroll'); } catch(e) {}
            });
        } else {
            setTimeout(() => { try { updateScrollControlsFor('passenger-itinerary-scroll'); } catch(e) {} }, 80);
        }
    } catch(e) { /* ignore */ }
}
function displayCargoTable(flights) {
    const container = document.getElementById('cargo-itinerary-container');
    if (!container) return;
    if (flights.length === 0) { container.innerHTML = `<div class="alert alert-info bg-transparent text-body">No se encontraron vuelos de carga.</div>`; return; }
    let tableHtml = `<table class="table table-hover"><thead><tr><th>Aerolínea</th><th>Vuelo Lleg.</th><th>Fecha Lleg.</th><th>Hora Lleg.</th><th>Origen</th><th>Posición</th><th>Vuelo Sal.</th><th>Fecha Sal.</th><th>Hora Sal.</th><th>Destino</th></tr></thead><tbody>`;
    flights.forEach((flight, index) => {
        const airlineName = flight.aerolinea || '-';
    const cands = getAirlineLogoCandidates(airlineName);
    const logoPath = cands[0];
    const dataCands = cands.join('|');
    const sizeClass = getLogoSizeClass(airlineName, 'table');
    const logoHtml = logoPath ? `<img class="airline-logo ${sizeClass}" src="${logoPath}" alt="Logo ${airlineName}" data-cands="${dataCands}" data-cand-idx="0" onerror="handleLogoError(this)" onload="logoLoaded(this)">` : '';
        const rowColor = (airlineColors[flight.aerolinea] || '#ccc');
        tableHtml += `<tr class="animated-row" style="--delay: ${index * 0.08}s; --airline-color: ${rowColor};">
            <td><div class="airline-cell">${logoHtml}<span class="airline-name">${airlineName}</span></div></td>
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
    container.innerHTML = `<div class="table-responsive vertical-scroll">${tableHtml}</div>`;
    // After rendering, ensure the table can overflow horizontally on small screens.
    try {
        const area = document.getElementById('cargo-itinerary-scroll');
        const table = container.querySelector('table');
        if (table && area) {
            requestAnimationFrame(() => {
                table.style.width = 'auto';
                const needed = table.scrollWidth;
                if (needed > area.clientWidth) {
                    table.style.minWidth = needed + 'px';
                } else {
                    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
                    if (isTouch) {
                        const forced = Math.round(area.clientWidth * 1.2);
                        table.style.minWidth = forced + 'px';
                    } else {
                        table.style.minWidth = '';
                        table.style.width = '';
                    }
                }
                try { updateScrollControlsFor('cargo-itinerary-scroll'); } catch(e) {}
            });
        } else {
            setTimeout(() => { try { updateScrollControlsFor('cargo-itinerary-scroll'); } catch(e) {} }, 80);
        }
    } catch(e) { /* ignore */ }
}

/* Horizontal scroll controls: synchronize buttons and range inputs with scroll areas */
function updateScrollControlsFor(scrollAreaId) {
    const area = document.getElementById(scrollAreaId);
    if (!area) return;

    const range = document.querySelector(`.scroll-range[data-target="${scrollAreaId}"]`);
    if (!range) return;

    // Avoid re-binding events multiple times
    if (area._scrollControlsInitialized) {
        // still refresh visibility and values
        refreshRange();
        return;
    }

    function refreshRange() {
        // measure after layout
        window.requestAnimationFrame(() => {
            const max = Math.max(0, area.scrollWidth - area.clientWidth);
            range.max = max;
            range.value = area.scrollLeft;
            // show or hide controls depending on whether overflow exists
            const control = range.closest('.h-scroll-controls');
            if (control) {
                control.style.display = (max === 0 ? 'none' : 'flex');
            } else {
                // fallback: find container with matching range
                const controls = document.querySelectorAll('.h-scroll-controls');
                const targetControls = Array.from(controls).find(c => c.querySelector(`.scroll-range[data-target="${scrollAreaId}"]`));
                if (targetControls) targetControls.style.display = (max === 0 ? 'none' : 'flex');
            }
        });
    }

    // initialize
    refreshRange();
    // also refresh after a small timeout in case fonts/images change layout
    setTimeout(refreshRange, 250);

    // sync scrolling -> range
    const onAreaScroll = () => { range.value = area.scrollLeft; };
    area.addEventListener('scroll', onAreaScroll);

    // sync range -> scrolling
    const onRangeInput = () => { area.scrollLeft = parseInt(range.value, 10); };
    range.addEventListener('input', onRangeInput);

    // left/right buttons
    const leftBtn = document.querySelector(`.scroll-left[data-target="${scrollAreaId}"]`);
    const rightBtn = document.querySelector(`.scroll-right[data-target="${scrollAreaId}"]`);
    const step = Math.max(80, Math.round(area.clientWidth / 2));
    if (leftBtn) leftBtn.addEventListener('click', () => { area.scrollBy({ left: -step, behavior: 'smooth' }); });
    if (rightBtn) rightBtn.addEventListener('click', () => { area.scrollBy({ left: step, behavior: 'smooth' }); });

    // refresh on resize
    let resizeTimeout;
    const onResize = () => { clearTimeout(resizeTimeout); resizeTimeout = setTimeout(refreshRange, 150); };
    window.addEventListener('resize', onResize);

    // mark initialized to avoid duplicate bindings
    area._scrollControlsInitialized = true;
    area._scrollControlsCleanup = () => {
        area.removeEventListener('scroll', onAreaScroll);
        range.removeEventListener('input', onRangeInput);
        window.removeEventListener('resize', onResize);
    };
}

// ensure we refresh both scroll controls after full load (in case images/fonts changed widths)
window.addEventListener('load', () => {
    setTimeout(() => {
        try { updateScrollControlsFor('passenger-itinerary-scroll'); } catch(e) {}
        try { updateScrollControlsFor('cargo-itinerary-scroll'); } catch(e) {}
    }, 350);
});
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
    const labels = comercial.map(d=>d.periodo);

    // Crear series individuales
    createSimpleLine('commercialOpsChart', 'Operaciones de Aviación Comercial', labels, comercial.map(d=>d.operaciones), '#1e88e5');
    createSimpleLine('commercialPaxChart', 'Pasajeros de Aviación Comercial', labels, comercial.map(d=>d.pasajeros), '#0d47a1');
    createSimpleLine('cargoOpsChart', 'Operaciones Carga', labels, carga.map(d=>d.operaciones), '#fb8c00');
    createSimpleLine('cargoTonsChart', 'Toneladas Carga', labels, carga.map(d=>d.toneladas), '#ef6c00', true);
    createSimpleLine('generalOpsChart', 'Operaciones de Aviación General', labels, general.map(d=>d.operaciones), '#2e7d32');
    createSimpleLine('generalPaxChart', 'Pasajeros de Aviación General', labels, general.map(d=>d.pasajeros), '#1b5e20');

}

// Listener para toggle SMA
document.addEventListener('change', (e)=>{
    if(e.target && e.target.id === 'toggle-sma') {
        showSMA = e.target.checked;
        // volver a renderizar las operaciones totales (recrea charts con SMA)
        renderOperacionesTotales();
    }
});

// ===== Nuevas funciones de visualización separada =====
function createSimpleLine(canvasId, title, labels, data, color, isDecimal=false){
    const canvas = document.getElementById(canvasId); if(!canvas) return;
    if(charts[canvasId]) charts[canvasId].destroy();
    const colors = getChartColors();
    const last = data[data.length-1];
    const prev = data[data.length-2] || last;
    // Ya no mostramos delta en el título (se verá sólo en tooltip)
    // Animación lenta del icono viajero
    let phase=0; const start=performance.now(); const period=18000; const pathCache={};
    const iconKind = canvasId.includes('Cargo')||canvasId.includes('Tons')? 'cargo' : (canvasId.includes('Pax')? 'person':'plane');
    function computePath(meta){
        if(pathCache.meta===meta) return pathCache.val;
        const pts=meta.data; const cum=[0]; let total=0; for(let i=1;i<pts.length;i++){ const dx=pts[i].x-pts[i-1].x, dy=pts[i].y-pts[i-1].y; const d=Math.hypot(dx,dy); total+=d; cum.push(total);} pathCache.meta=meta; pathCache.val={cum,total}; return pathCache.val;
    }
    // Crear gradiente vertical suave
    let gradientFill;
    try {
        const ctx = canvas.getContext('2d');
        gradientFill = ctx.createLinearGradient(0,0,0,canvas.height||300);
        gradientFill.addColorStop(0, hexToRgba(color,0.35));
        gradientFill.addColorStop(0.55, hexToRgba(color,0.12));
        gradientFill.addColorStop(1, hexToRgba(color,0.04));
    } catch(_) { gradientFill = hexToRgba(color,0.18); }

    const baseDs = {
        label:title,
        data,
        borderColor:color,
        backgroundColor:gradientFill,
        fill:true,
        tension:0.32,
        pointRadius:(ctx)=> ctx.dataIndex === data.length-1 ? 6 : 0,
        pointHoverRadius:7,
        pointBackgroundColor:'#fff',
        pointBorderColor:color,
        pointBorderWidth:2,
        borderWidth:3
    };
    let smaDs=null;
    if(showSMA && data.length>=5){
        const periodSMA=3; const out=[]; for(let i=0;i<data.length;i++){ if(i<periodSMA-1){ out.push(null); } else { let sum=0; for(let j=i-periodSMA+1;j<=i;j++) sum+=data[j]; out.push(sum/periodSMA); } }
        smaDs={ label:'SMA', data:out, borderColor:hexToRgba(color,0.65), borderDash:[6,4], fill:false, pointRadius:0, tension:0.18, borderWidth:1.5 };
    }
    charts[canvasId] = new Chart(canvas, {
        type:'line',
        data:{ labels, datasets: smaDs ? [baseDs, smaDs] : [baseDs] },
        options:{
            responsive:true,
            maintainAspectRatio:false,
            interaction:{ mode:'nearest', intersect:false },
            animation:{
                duration:1400,
                easing:'easeInOutQuart'
            },
            plugins:{
                legend:{ display:false },
                title:{ display:true, text:`${title}`.trim(), color: colors.labels, font:{weight:'600'} },
                tooltip:{
                    enabled:true,
                    intersect:false,
                    mode:'index',
                    backgroundColor: colors.tooltip.backgroundColor,
                    titleColor: colors.tooltip.titleColor,
                    bodyColor: colors.tooltip.bodyColor,
                    callbacks:{
                        label:(ctx)=>{
                            const v = ctx.parsed.y;
                            const val = isDecimal? new Intl.NumberFormat('es-MX',{maximumFractionDigits:2}).format(v) : new Intl.NumberFormat('es-MX').format(v);
                            let diff='';
                            if(ctx.dataIndex>0){
                                const prevV = ctx.dataset.data[ctx.dataIndex-1];
                                if(typeof prevV==='number'){
                                    const d=((v-prevV)/(prevV||1))*100; diff = ` (Δ ${d>=0?'+':''}${d.toFixed(1)}%)`;
                                }
                            }
                            return ` ${val}${diff}`;
                        }
                    }
                },
                // Desactivar datalabels globales (plugin ChartDataLabels) para esta serie
                datalabels: { display:false }
            },
            scales:{
                x:{
                    ticks:{ color: colors.ticks, font:{ size:13, weight:'600' } },
                    grid:{ color: hexToRgba('#8898aa',0.12) }
                },
                y:{
                    ticks:{ color: colors.ticks, font:{ size:13, weight:'600' }, callback:(val)=> isDecimal? Number(val).toFixed(2): new Intl.NumberFormat('es-MX').format(val) },
                    grid:{ color: hexToRgba('#8898aa',0.10) }
                }
            }
        },
        plugins:[
            // Línea vertical (crosshair) al hacer hover
            { id:'crosshair', afterDraw(chart, args, opts){
                const actives = chart.getActiveElements(); if(!actives || !actives.length) return; const ctx=chart.ctx; const {x} = actives[0].element; const top=chart.chartArea.top; const bottom=chart.chartArea.bottom; ctx.save(); ctx.strokeStyle=hexToRgba(color,0.35); ctx.setLineDash([4,4]); ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x, bottom); ctx.stroke(); ctx.restore();
            }},
                // Burbujas para todos los puntos (cada año) y último sin año
                { id:'allValueBubbles', afterDatasetsDraw(chart){
                    const meta = chart.getDatasetMeta(0); if(!meta || !meta.data.length) return; const ctx=chart.ctx; ctx.save();
                    const len = meta.data.length;
                    for(let i=0;i<len;i++){
                        const el = meta.data[i]; if(!el) continue;
                        const rawVal = data[i]; if(typeof rawVal !== 'number') continue;
                        const formatted = isDecimal? new Intl.NumberFormat('es-MX',{maximumFractionDigits:2}).format(rawVal) : new Intl.NumberFormat('es-MX').format(rawVal);
                        // Ahora todos los puntos (incluido el último) muestran Año + Valor en dos líneas.
                        const year = labels[i];
                        const line1 = year;
                        const line2 = formatted;
                        // Colores representativos (sin verde/rojo diferenciador)
                        const diffColor = color;
                        ctx.font='600 12px "Roboto", system-ui';
                        const paddingX=9; const paddingY=5; const radius=10;
                        const textWidth1 = ctx.measureText(line1).width;
                        const textWidth2 = ctx.measureText(line2).width;
                        const contentWidth = Math.max(textWidth1, textWidth2);
                        const lines = 2;
                        const lineHeight = 14; // px
                        const h = paddingY*2 + lineHeight*lines + (lines>1?2:0);
                        const w = contentWidth + paddingX*2;
                        // Posicionar (hacia la derecha para evitar tapar el punto; ajustar si se sale del canvas)
                        let x = el.x + 12;
                        let y = el.y - h/2 - 4;
                        // Recolocar si se sale por la derecha
                        if (x + w > chart.width - 2) x = el.x - w - 12;
                        if (x < 2) x = 2;
                        if (y < chart.chartArea.top + 2) y = chart.chartArea.top + 2;
                        if (y + h > chart.chartArea.bottom - 2) y = chart.chartArea.bottom - h - 2;
                        // Caja con borde en modo oscuro para contraste
                        const isLast = i === len-1;
                        const baseFill = isLast ? diffColor : hexToRgba(diffColor,0.9);
                        ctx.fillStyle = baseFill;
                        ctx.beginPath();
                        ctx.moveTo(x+radius,y); ctx.lineTo(x+w-radius,y); ctx.quadraticCurveTo(x+w,y,x+w,y+radius);
                        ctx.lineTo(x+w,y+h-radius); ctx.quadraticCurveTo(x+w,y+h,x+w-radius,y+h);
                        ctx.lineTo(x+radius,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-radius);
                        ctx.lineTo(x,y+radius); ctx.quadraticCurveTo(x,y,x+radius,y); ctx.fill();
                        if(document.body.classList.contains('dark-mode')){
                            ctx.strokeStyle = 'rgba(255,255,255,0.35)';
                            ctx.lineWidth = 1;
                            ctx.stroke();
                        }
                        // Texto
                        ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillStyle='#fff';
                        const cx = x + w/2; let ty = y + paddingY + lineHeight/2;
                        ctx.font='600 11px "Roboto", system-ui';
                        ctx.fillStyle='rgba(255,255,255,0.85)';
                        ctx.fillText(line1, cx, ty);
                        ctx.font='600 12px "Roboto", system-ui';
                        ctx.fillStyle='#fff';
                        ty += lineHeight + 2;
                        ctx.fillText(line2, cx, ty);
                    }
                    ctx.restore();
                }},
            // Sombra para la línea principal
            { id:'lineShadow', beforeDatasetsDraw(chart){ const ctx=chart.ctx; const meta=chart.getDatasetMeta(0); if(!meta) return; ctx.save(); ctx.shadowColor=hexToRgba(color,0.45); ctx.shadowBlur=12; ctx.shadowOffsetY=4; }, afterDatasetsDraw(chart){ chart.ctx.restore(); } },
            // Animación de icono viajero como antes
            { id:'travel-icon-single', afterDatasetsDraw(chart){
                const ctx=chart.ctx; const meta=chart.getDatasetMeta(0); if(!meta || !meta.data.length) return;
                const elapsed=(performance.now()-start)%period; phase=elapsed/period;
                const {cum,total}=computePath(meta); if(total<=0) return;
                const dist=phase*total; let seg=cum.findIndex(c=>c>dist)-1; if(seg<0) seg=cum.length-2;
                const segLen=cum[seg+1]-cum[seg]; const t=segLen===0?0:(dist-cum[seg])/segLen; const p0=meta.data[seg]; const p1=meta.data[seg+1]||p0;
                const x=p0.x+(p1.x-p0.x)*t; const y=p0.y+(p1.y-p0.y)*t; drawUnifiedIcon(ctx, iconKind, x, y-18, iconKind==='plane'?26:20, '#0d2d56');
            }},
            // Redibujado continuo solo para el icono (minimizar costo)
            { id:'loop-redraw', afterDraw(){ const c=charts[canvasId]; if(c && !c._destroyed) requestAnimationFrame(()=>c.draw()); }}
        ]
    });
}

// ==================== FILTROS DE SECCIÓN Y AÑOS ====================
function getSelectedYears(){
    const yearBoxes = document.querySelectorAll('#ops-years-filters input[type="checkbox"][data-year]');
    const years = [];
    yearBoxes.forEach(cb=>{ if(cb.checked) years.push(cb.getAttribute('data-year')); });
    return years.length ? years : null; // si ninguno marcado devolvemos null para evitar borrar todo
}

function renderOperacionesTotalesFiltered(){
    const { comercial, carga, general } = staticData.operacionesTotales;
    let labels = comercial.map(d=>d.periodo);
    const selectedYears = getSelectedYears();
    if(selectedYears){
        labels = labels.filter(l=> selectedYears.includes(l));
    }
    function filterData(arr, key){
        return arr.filter(d=> !selectedYears || selectedYears.includes(d.periodo)).map(d=> d[key]);
    }
    // Mostrar / ocultar grupos por secciones
    const secCom = document.getElementById('filter-section-comercial');
    const secCar = document.getElementById('filter-section-carga');
    const secGen = document.getElementById('filter-section-general');
    const gCom = document.getElementById('commercial-group'); if(gCom) gCom.style.display = secCom && !secCom.checked ? 'none':'flex';
    const gCar = document.getElementById('cargo-group'); if(gCar) gCar.style.display = secCar && !secCar.checked ? 'none':'flex';
    const gGen = document.getElementById('general-group'); if(gGen) gGen.style.display = secGen && !secGen.checked ? 'none':'flex';

    if(secCom && secCom.checked){
        createSimpleLine('commercialOpsChart', 'Operaciones Comerciales', labels, filterData(comercial,'operaciones'), '#1e88e5');
        createSimpleLine('commercialPaxChart', 'Pasajeros Comerciales', labels, filterData(comercial,'pasajeros'), '#0d47a1');
    } else { if(charts['commercialOpsChart']) charts['commercialOpsChart'].destroy(); if(charts['commercialPaxChart']) charts['commercialPaxChart'].destroy(); }
    if(secCar && secCar.checked){
        createSimpleLine('cargoOpsChart', 'Operaciones Carga', labels, filterData(carga,'operaciones'), '#fb8c00');
        createSimpleLine('cargoTonsChart', 'Toneladas Carga', labels, filterData(carga,'toneladas'), '#ef6c00', true);
    } else { if(charts['cargoOpsChart']) charts['cargoOpsChart'].destroy(); if(charts['cargoTonsChart']) charts['cargoTonsChart'].destroy(); }
    if(secGen && secGen.checked){
        createSimpleLine('generalOpsChart', 'Operaciones Generales', labels, filterData(general,'operaciones'), '#2e7d32');
        createSimpleLine('generalPaxChart', 'Pasajeros Generales', labels, filterData(general,'pasajeros'), '#1b5e20');
    } else { if(charts['generalOpsChart']) charts['generalOpsChart'].destroy(); if(charts['generalPaxChart']) charts['generalPaxChart'].destroy(); }
}

// Reemplazar llamada anterior por versión filtrada
const origRenderOps = renderOperacionesTotales;
renderOperacionesTotales = function(){ renderOperacionesTotalesFiltered(); };

// Listeners para filtros (delegados tras DOMContentLoaded ya ejecutado en flujo principal)
document.addEventListener('change',(e)=>{
    if(e.target && (
        e.target.id.startsWith('filter-year-') ||
        e.target.id.startsWith('filter-section-')
    )){
        renderOperacionesTotales();
    }
});

// Eliminado createComparisonMini (se removieron comparativos globales)

// Helper unified icon including new cargo icon (estilizado contenedor)
function drawUnifiedIcon(ctx, kind, x, y, size, color){
    ctx.save(); ctx.translate(x,y); ctx.lineJoin='round';
    if(kind==='plane') {
        ctx.save();
        ctx.font = `${Math.round(size*1.15)}px 'Segoe UI Symbol','Segoe UI Emoji',system-ui,sans-serif`;
        ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillStyle=color; ctx.fillText('✈',0,0);
        ctx.restore();
    } else if(kind==='person') {
        const scale=size/44; ctx.scale(scale, scale); ctx.fillStyle=color; ctx.beginPath(); ctx.arc(0,-18,6,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.roundRect?ctx.roundRect(-5,-12,10,22,3):ctx.rect(-5,-12,10,22); ctx.fill(); ctx.beginPath(); ctx.moveTo(-5,-4); ctx.lineTo(-14,10); ctx.lineTo(-9,12); ctx.lineTo(-2,-2); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(5,-4); ctx.lineTo(12,8); ctx.lineTo(7,10); ctx.lineTo(1,-2); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(-2,10); ctx.lineTo(-8,28); ctx.lineTo(-4,28); ctx.lineTo(1,12); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(2,10); ctx.lineTo(7,28); ctx.lineTo(3,28); ctx.lineTo(-1,12); ctx.closePath(); ctx.fill();
    } else if(kind==='cargo') {
        const scale=size/54; ctx.scale(scale, scale); ctx.fillStyle=color; ctx.beginPath(); ctx.roundRect?ctx.roundRect(-42,-20,84,40,6):ctx.rect(-42,-20,84,40); ctx.fill(); ctx.strokeStyle='rgba(255,255,255,0.85)'; ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(-21,-20); ctx.lineTo(-21,20); ctx.moveTo(0,-20); ctx.lineTo(0,20); ctx.moveTo(21,-20); ctx.lineTo(21,20); ctx.stroke();
    }
    ctx.restore();
}

// render a single section chart with two straight series and dual axes
function createSectionChart(canvasId, labels, primaryData, secondaryData, opts = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    if (charts[canvasId]) charts[canvasId].destroy();
    const colors = getChartColors();

    // Deltas
    let deltaOps = '', arrowOps = '';
    let deltaSec = '', arrowSec = '';
    if (primaryData.length >= 2) {
        const last = primaryData[primaryData.length-1];
        const prev = primaryData[primaryData.length-2] || 1;
        if (typeof last === 'number' && typeof prev === 'number') {
            const d = ((last - prev) / (prev || 1)) * 100;
            const sign = d >= 0 ? '+' : '';
            deltaOps = `${sign}${d.toFixed(1)}%`;
            arrowOps = d > 0 ? '▲' : (d < 0 ? '▼' : '▶');
        }
    }
    if (secondaryData.length >= 2) {
        const lastS = secondaryData[secondaryData.length-1];
        const prevS = secondaryData[secondaryData.length-2] || 1;
        if (typeof lastS === 'number' && typeof prevS === 'number') {
            const d2 = ((lastS - prevS) / (prevS || 1)) * 100;
            const sign2 = d2 >= 0 ? '+' : '';
            deltaSec = `${sign2}${d2.toFixed(1)}%`;
            arrowSec = d2 > 0 ? '▲' : (d2 < 0 ? '▼' : '▶');
        }
    }

    // Animación continua para iconos viajeros
    const travelPeriod = 18000; // ms por ciclo (ralentizado)
    const travelStart = performance.now();

    charts[canvasId] = new Chart(canvas, {
        type: 'line',
        data: {
            labels,
            datasets: [
                { label: 'Operaciones', data: primaryData, borderColor: opts.colorPrimary, backgroundColor: hexToRgba(opts.colorPrimary,0.18), fill: true, tension: 0, pointRadius: 0, borderWidth: 2, yAxisID: 'y' },
                { label: opts.section === 'Carga' ? 'Toneladas' : 'Pasajeros', data: secondaryData, borderColor: opts.colorSecondary, backgroundColor: hexToRgba(opts.colorSecondary,0.15), fill: true, tension: 0, pointRadius: 0, borderDash:[6,3], borderWidth: 2, yAxisID: 'y1' }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            animation: { duration: 900, easing: 'easeInOutCubic' },
            plugins: {
                legend: { 
                    labels: { 
                        color: colors.labels,
                        filter: (item) => item.datasetIndex !== 0 // oculta "Operaciones"
                    }
                },
                title: { display: true, text: `${opts.section} — Ops ${arrowOps} ${deltaOps} | ${opts.section === 'Carga' ? 'Tonel.' : 'Pax'} ${arrowSec} ${deltaSec}`.trim(), color: colors.labels },
                tooltip: { enabled:true, intersect:false, mode:'nearest' }
            },
            scales: {
                x: { ticks: { color: '#0d2d56', font:{ size:14, weight:'700' }, autoSkip: true, maxRotation: 0 }, grid: { color: colors.grid } },
                y: { type: 'linear', position: 'left', ticks: { color: '#0d2d56', font:{ size:14, weight:'700' }, callback: v => new Intl.NumberFormat('es-MX').format(v) }, grid: { display:false } },
                y1: { type: 'linear', position: 'right', ticks: { color: '#0d2d56', font:{ size:14, weight:'700' }, callback: v => opts.isDecimalSecondary ? new Intl.NumberFormat('es-MX',{maximumFractionDigits:2}).format(v) : new Intl.NumberFormat('es-MX').format(v) }, grid: { drawOnChartArea: false } }
            }
        },
        plugins: [
            {
                id: 'moving-icons-labels',
                afterDatasetsDraw(chart) {
                    let ctx;
                    try {
                        ctx = chart.ctx;
                        const metaOps = chart.getDatasetMeta(0);
                        const metaSec = chart.getDatasetMeta(1);
                        if (!metaOps || !metaSec || !metaOps.data || !metaSec.data) return;
                        // ===== Traveling icons (sin estela) usando drawUnifiedIcon mejorado =====
                        function computePath(meta){
                            const pts = meta.data; const cum=[0]; let total=0;
                            for(let i=1;i<pts.length;i++){ const dx=pts[i].x-pts[i-1].x, dy=pts[i].y-pts[i-1].y; const d=Math.hypot(dx,dy); total+=d; cum.push(total);} return {cum,total};
                        }
                        function drawTravel(meta, kind){
                            const pts=meta.data; if(!pts||pts.length<2) return; const {cum,total}=computePath(meta); if(total<=0) return;
                            const elapsed=(performance.now()-travelStart)%travelPeriod; const dist=(elapsed/travelPeriod)*total; let seg=cum.findIndex(c=>c>dist)-1; if(seg<0) seg=cum.length-2;
                            const segLen=cum[seg+1]-cum[seg]; const t=segLen===0?0:(dist-cum[seg])/segLen; const p0=pts[seg]; const p1=pts[seg+1]||p0;
                            const x=p0.x+(p1.x-p0.x)*t; const y=p0.y+(p1.y-p0.y)*t; drawUnifiedIcon(ctx, kind, x, y-16, kind==='plane'?26:20, '#0d2d56');
                        }
                        drawTravel(metaOps,'plane');
                        drawTravel(metaSec, opts.section === 'Carga' ? 'cargo' : 'person');
                        // (Tooltips persistentes eliminados a petición del usuario)
                    } catch(err){ /* ignore drawing error */ }
                }
            }
        ]
    });

    // Bucle continuo para redibujar iconos viajeros
    function loopTravel(){
        const chart = charts[canvasId];
        if (chart && !chart._destroyed) { chart.draw(); }
        requestAnimationFrame(loopTravel);
    }
    requestAnimationFrame(loopTravel);

    // Tooltip persistente al hacer click fuera de puntos: enfoca último
    canvas.addEventListener('click', (ev) => {
        const chart = charts[canvasId]; if (!chart) return;
        const points = chart.getElementsAtEventForMode(ev, 'nearest', { intersect: true }, true);
        if (points && points.length) return;
        const last = labels.length -1;
        chart.setActiveElements(chart.data.datasets.map((ds,i)=>({datasetIndex:i,index:last})));
        chart.tooltip.setActiveElements(chart.getActiveElements(), {x:0,y:0});
        chart.update();
    });

    // Botones export
    try {
        const container = canvas.closest('.chart-container');
        if (container && !container.querySelector('.export-controls')) {
            const btns = document.createElement('div'); btns.className='export-controls mt-2';
            btns.innerHTML = `<button class="btn btn-sm btn-outline-primary me-2" data-export="png">Exportar PNG</button><button class="btn btn-sm btn-outline-secondary me-2" data-export="pdf">Exportar PDF</button><button class="btn btn-sm btn-outline-success" data-export="pdf-all">PDF Todas</button>`;
            container.appendChild(btns);
            btns.addEventListener('click', (e)=>{
                const action = e.target.getAttribute('data-export'); if(!action) return;
                if(action==='png'){
                    const url = canvas.toDataURL('image/png'); const a=document.createElement('a'); a.href=url; a.download=`${canvasId}.png`; a.click();
                } else if (action==='pdf'){
                    const { jsPDF } = window.jspdf || window.jspdf || {};
                    if (!jsPDF) { alert('jsPDF no está disponible.'); return; }
                    const url = canvas.toDataURL('image/png');
                    const pdf = new jsPDF({ orientation:'landscape'});
                    const imgProps = pdf.getImageProperties(url);
                    const pdfW = pdf.internal.pageSize.getWidth();
                    const pdfH = (imgProps.height * pdfW) / imgProps.width;
                    pdf.addImage(url,'PNG',0,10,pdfW,pdfH);
                    pdf.save(`${canvasId}.pdf`);
                } else if (action==='pdf-all') {
                    exportAllChartsPDF();
                }
            });
        }
    } catch(err) { /* ignore */ }
}

// Exportar todas las gráficas en un solo PDF (una página por gráfica)
function exportAllChartsPDF() {
    const { jsPDF } = window.jspdf || window.jspdf || {};
    if (!jsPDF) { alert('jsPDF no está disponible.'); return; }
    const ids = ['commercialChart','cargoChart','generalChart'];
    const pdf = new jsPDF({ orientation: 'landscape' });
    let first = true;
    ids.forEach(id => {
        const canvas = document.getElementById(id);
        if (!canvas) return;
        const url = canvas.toDataURL('image/png');
        if (!first) pdf.addPage('landscape');
        const imgProps = pdf.getImageProperties(url);
        const pdfW = pdf.internal.pageSize.getWidth();
        const pdfH = (imgProps.height * pdfW) / imgProps.width;
        pdf.addImage(url, 'PNG', 0, 10, pdfW, pdfH);
        first = false;
    });
    pdf.save('todas_las_graficas.pdf');
}

// Create a multi-series straight-line comparison chart with icons at last datapoint
function createComparisonChart(canvasId, labels, seriesList, title, opts = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    if (charts[canvasId]) charts[canvasId].destroy();
    const ctx = canvas.getContext('2d');
    const colors = getChartColors();
    const datasets = seriesList.map(s => ({
        label: `${opts.icon || ''} ${s.label}`,
        data: s.data,
        borderColor: s.color,
        backgroundColor: hexToRgba(s.color, 0.06),
        fill: false,
        tension: 0, // straight lines (no smoothing)
        pointRadius: function(context) { return context.dataIndex === labels.length - 1 ? 6 : 0; },
        pointHoverRadius: 8,
        borderWidth: 2
    }));

    charts[canvasId] = new Chart(canvas, {
        type: 'line',
        data: { labels, datasets },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { color: colors.labels, generateLabels: undefined } },
                title: { display: true, text: title, color: colors.labels }
            },
            interaction: { mode: 'index', intersect: false },
            scales: {
                x: { ticks: { color: colors.ticks, autoSkip: true, maxRotation: 0 }, grid: { color: colors.grid } },
                y: { ticks: { color: colors.ticks, callback: v => opts.isDecimal ? new Intl.NumberFormat('es-MX', { maximumFractionDigits: 2 }).format(v) : new Intl.NumberFormat('es-MX').format(v) }, grid: { color: colors.grid } }
            },
            // draw icons (emoji) at last datapoint for each series to identify type
            plugins: [
                {
                    id: 'drawIconsAtLast',
                    afterDatasetsDraw: function(chart) {
                        const ctx = chart.ctx;
                        chart.data.datasets.forEach((dataset, dsIdx) => {
                            const meta = chart.getDatasetMeta(dsIdx);
                            if (!meta.data || meta.data.length === 0) return;
                            const point = meta.data[meta.data.length - 1];
                            if (!point) return;
                            const x = point.x, y = point.y;
                            ctx.save();
                            ctx.font = '16px serif';
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'middle';
                            // choose icon based on chart title if provided
                            const icon = (opts && opts.icon) ? opts.icon : '';
                            if (icon) ctx.fillText(icon, x + 8, y - 2);
                            ctx.restore();
                        });
                    }
                }
            ]
        }
    });
}

// Create a single-series trend chart (line) with optional SMA overlay
function createSingleTrendChart(canvasId, labels, dataSeries, label, opts = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    if (charts[canvasId]) charts[canvasId].destroy();
    const ctx = canvas.getContext('2d');
    const color = opts.primaryColor || '#1e88e5';
    const sma = (function(arr, w = opts.smaWindow || 3){ const out=[]; for (let i=0;i<arr.length;i++){ const s=Math.max(0,i-w+1); const slice=arr.slice(s,i+1).filter(v=>typeof v==='number'); out.push(slice.length?slice.reduce((a,b)=>a+b,0)/slice.length:null);} return out;})(dataSeries);
    const grad = ctx.createLinearGradient(0,0,0,canvas.height || 300); grad.addColorStop(0, hexToRgba(color,0.3)); grad.addColorStop(1, hexToRgba(color,0.03));
    charts[canvasId] = new Chart(canvas, {
        type: 'line', data: { labels, datasets: [{ label, data: dataSeries, borderColor: color, backgroundColor: grad, fill: true, tension: 0.25, pointRadius: function(ctx){ return ctx.dataIndex === labels.length-1 ? 6 : 0; }, pointHoverRadius: 7, borderWidth: 2 }, { label: `SMA (${opts.smaWindow||3})`, data: sma, borderColor: hexToRgba(color,0.85), backgroundColor: 'transparent', fill:false, pointRadius:0, borderDash:[4,4], borderWidth:1.2 }] },
        options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ labels:{ color: getChartColors().labels } }, title:{ display:true, text: label, color: getChartColors().labels } }, interaction:{ mode:'index', intersect:false }, scales:{ x:{ ticks:{ color: getChartColors().ticks, autoSkip:true, maxRotation:0 } , grid:{ color: getChartColors().grid } }, y:{ ticks:{ color: getChartColors().ticks, callback: v => opts.isDecimal ? new Intl.NumberFormat('es-MX',{maximumFractionDigits:2}).format(v) : new Intl.NumberFormat('es-MX').format(v) }, grid:{ color: getChartColors().grid } } } }
    });
}

/**
 * Create a trend (line) chart with two series and dual axes.
 * - canvasId: id of canvas element
 * - labels: array of labels (periodos)
 * - primaryData: usually 'Operaciones' (left axis)
 * - secondaryData: 'Pasajeros' or 'Toneladas' (right axis)
 * - labelPrimary, labelSecondary: dataset labels
 * - opts: { primaryColor, secondaryColor, isDecimalSecondary }
 */
function createTrendChart(canvasId, labels, primaryData, secondaryData, labelPrimary, labelSecondary, opts = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    if (charts[canvasId]) charts[canvasId].destroy();
    const colors = getChartColors();
    const ctx = canvas.getContext('2d');
    const pColor = opts.primaryColor || '#1e88e5';
    const sColor = opts.secondaryColor || '#26a69a';
    // gradients for fills
    const gradPrimary = ctx.createLinearGradient(0, 0, 0, canvas.height || 300);
    gradPrimary.addColorStop(0, hexToRgba(pColor, 0.35));
    gradPrimary.addColorStop(1, hexToRgba(pColor, 0.05));
    const gradSecondary = ctx.createLinearGradient(0, 0, 0, canvas.height || 300);
    gradSecondary.addColorStop(0, hexToRgba(sColor, 0.25));
    gradSecondary.addColorStop(1, hexToRgba(sColor, 0.03));

    // compute a 3-point simple moving average (SMA) for the primary data to show a smoothed trend
    function movingAverage(arr, window = 3) {
        const out = [];
        for (let i = 0; i < arr.length; i++) {
            const start = Math.max(0, i - window + 1);
            const slice = arr.slice(start, i + 1).filter(v => typeof v === 'number' && !isNaN(v));
            const sum = slice.reduce((a,b) => a + b, 0);
            out.push(slice.length ? (sum / slice.length) : null);
        }
        return out;
    }
    const smaPrimary = movingAverage(primaryData, opts.smaWindow || 3);

    // calculate delta percent between last two points for quick indicator
    let deltaText = '';
    if (primaryData.length >= 2 && typeof primaryData[primaryData.length-1] === 'number' && typeof primaryData[primaryData.length-2] === 'number') {
        const last = primaryData[primaryData.length-1];
        const prev = primaryData[primaryData.length-2] || 1;
        const delta = ((last - prev) / (prev || 1)) * 100;
        const sign = delta >= 0 ? '+' : '';
        deltaText = ` (Δ ${sign}${delta.toFixed(1)}%)`;
    }

    charts[canvasId] = new Chart(canvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: labelPrimary,
                    data: primaryData,
                    borderColor: pColor,
                    backgroundColor: gradPrimary,
                    yAxisID: 'y',
                    tension: 0.25,
                    fill: true,
                    // reduce point clutter: only show marker on the last point
                    pointRadius: function(ctx) { return ctx.dataIndex === labels.length - 1 ? 6 : 0; },
                    pointHoverRadius: 7,
                    pointBackgroundColor: pColor,
                    borderWidth: 2
                },
                {
                    label: labelSecondary,
                    data: secondaryData,
                    borderColor: sColor,
                    backgroundColor: gradSecondary,
                    yAxisID: 'y1',
                    tension: 0.25,
                    fill: false,
                    pointRadius: function(ctx) { return ctx.dataIndex === labels.length - 1 ? 5 : 0; },
                    pointHoverRadius: 6,
                    pointBackgroundColor: sColor,
                    borderDash: [6,3],
                    borderWidth: 2
                }
                ,
                {
                    label: `Promedio móvil (${opts.smaWindow || 3})`,
                    data: smaPrimary,
                    borderColor: hexToRgba(pColor, 0.9),
                    backgroundColor: 'transparent',
                    yAxisID: 'y',
                    tension: 0.3,
                    fill: false,
                    pointRadius: 0,
                    borderWidth: 1.5,
                    borderDash: [4,4]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 1600, easing: 'easeInOutCubic' },
            interaction: { mode: 'index', intersect: false },
            stacked: false,
            plugins: {
                legend: { position: 'top', labels: { color: colors.labels } },
                title: { display: true, text: `${labelPrimary}${deltaText}`, color: colors.labels, font: { size: 14 }, padding: { bottom: 6 } },
                subtitle: { display: false },
                tooltip: {
                    backgroundColor: colors.tooltip.backgroundColor,
                    titleColor: colors.tooltip.titleColor,
                    bodyColor: colors.tooltip.bodyColor,
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const val = context.parsed.y;
                            if (context.dataset.yAxisID === 'y1' && opts.isDecimalSecondary) {
                                return `${label}: ${new Intl.NumberFormat('es-MX', { maximumFractionDigits: 2 }).format(val)}`;
                            }
                            return `${label}: ${new Intl.NumberFormat('es-MX').format(val)}`;
                        }
                    }
                }
            },
            layout: { padding: { left: 8, right: 20, top: 8, bottom: 4 } },
            scales: {
                x: { ticks: { color: colors.ticks, autoSkip: true, maxRotation: 0, sampleSize: 10 }, grid: { color: colors.grid } },
                y: { type: 'linear', display: true, position: 'left', ticks: { color: colors.ticks, callback: v => new Intl.NumberFormat('es-MX').format(v) }, grid: { color: colors.grid } },
                y1: { type: 'linear', display: true, position: 'right', ticks: { color: colors.ticks, callback: v => opts.isDecimalSecondary ? new Intl.NumberFormat('es-MX', { maximumFractionDigits: 2 }).format(v) : new Intl.NumberFormat('es-MX').format(v) }, grid: { drawOnChartArea: false } }
            }
        }
    });
}

// small helper to convert hex to rgba
function hexToRgba(hex, alpha) {
    const h = hex.replace('#','');
    const bigint = parseInt(h, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
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
    navigateWithLoader(sectionId, target);
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
    // Manifiestos menu removed
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
    // Debounce: if showSection was called very recently, ignore subsequent calls (prevents immediate overwrites)
    if (!window._lastShowAt) window._lastShowAt = 0;
    const now = Date.now();
    if (now - window._lastShowAt < 500) { console.log(`showSection: llamada ignorada (debounce) para '${sectionId}'`); return; }
    window._lastShowAt = now;

    // Defensive: ensure sections are hidden via class and style, then show the requested one
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => { section.classList.remove('active'); section.style.display = 'none'; });
    const target = document.getElementById(`${sectionId}-section`);
    if (!target) {
        console.warn(`showSection: sección '${sectionId}-section' no encontrada`);
        return;
    }
    target.classList.add('active');
    target.style.display = 'block';
    // menu active state
    document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
    if (element && element.classList) element.classList.add('active');
    console.log(`showSection: abierto '${sectionId}'`);
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

// ================= Loader Global =================
function showGlobalLoader(text='Cargando...') {
    const el = document.getElementById('global-loader'); if(!el) return; const t = document.getElementById('global-loader-text'); if(t) t.textContent = text; el.dataset.startedAt = Date.now(); el.classList.remove('hidden');
}
function hideGlobalLoader() {
    const el = document.getElementById('global-loader'); if(!el) return; const minVisible = 300; const started = parseInt(el.dataset.startedAt || '0',10); const elapsed = Date.now()-started; const delay = elapsed < minVisible ? (minVisible - elapsed) : 0; setTimeout(()=>{ el.classList.add('hidden'); }, delay);
}

// Navegación con loader (simula carga y permite animaciones / futura petición async)
let navigationInProgress = false;
function navigateWithLoader(sectionId, element){
    if(navigationInProgress) return; navigationInProgress = true;
    const sectionLabels = {
        'inicio':'Cargando inicio...',
        'itinerario':'Cargando itinerario...',
        'parte-operaciones':'Cargando resumen de operaciones...',
        'puntualidad-agosto':'Cargando puntualidad...',
        'demoras':'Calculando demoras...',
        'operaciones-totales':'Generando visualizaciones...',
        'itinerario-mensual':'Abriendo itinerario mensual...',
        'comparativa':'Preparando comparativa...'
    };
    showGlobalLoader(sectionLabels[sectionId] || 'Cargando...');
    // Pequeño retardo para permitir mostrar loader antes de render pesado
    requestAnimationFrame(()=>{
        setTimeout(()=>{
            try { showSection(sectionId, element); } catch(err){ console.error('Error mostrando sección', err); }
            hideGlobalLoader();
            setTimeout(()=>{ navigationInProgress = false; }, 120);
        }, 200);
    });
}

// -----------------------------
// PARTE DE OPERACIONES (JSON -> Tablas)
// -----------------------------
 
