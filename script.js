/**
 * =================================================================================
 * CONFIGURACIÓN DE DATOS ESTÁTICOS
 * =================================================================================
 * Para actualizar las tablas y gráficas de "Operaciones Totales" y "Demoras",
 * simplemente modifica los valores dentro de este objeto `staticData`.
 * El código se encargará de formatear los números y redibujar todo automáticamente.
 */
const staticData = {
    // Datos para la sección "Operaciones Totales"
    operacionesTotales: {
        comercial: [
            { periodo: '2022', operaciones: 8996, pasajeros: 912415 },
            { periodo: '2023', operaciones: 23211, pasajeros: 2631261 },
            { periodo: '2024', operaciones: 51734, pasajeros: 6318454 }
        ],
        carga: [
            { periodo: '2022', operaciones: 8, toneladas: 5.19 },
            { periodo: '2023', operaciones: 5578, toneladas: 186319.83 },
            { periodo: '2024', operaciones: 13219, toneladas: 447341.17 }
        ],
        general: [
            { periodo: '2022', operaciones: 458, pasajeros: 1385 },
            { periodo: '2023', operaciones: 2212, pasajeros: 8160 },
            { periodo: '2024', operaciones: 2777, pasajeros: 29637 }
        ]
    },
    // Datos para la sección "Análisis de Demoras"
    demoras: {
        periodo: "Abril 2025",
        causas: [
            { causa: 'Repercusión', demoras: 0 },
            { causa: 'Compañía', demoras: 199 },
            { causa: 'Evento Circunstancial', demoras: 0 },
            { causa: 'Combustible', demoras: 5 },
            { causa: 'Autoridad', demoras: 0 },
            { causa: 'Meteorología', demoras: 2 },
            { causa: 'Aeropuerto', demoras: 0 },
        ]
    }
};


// ---------------------------------------------------------------------------------
// A PARTIR DE AQUÍ COMIENZA LA LÓGICA DE LA APLICACIÓN. NO ES NECESARIO EDITAR.
// ---------------------------------------------------------------------------------

const dashboardData = {
    users: {
        "David Pacheco": { password: "2468", canViewItinerarioMensual: true },
        "Isaac López": { password: "18052003", canViewItinerarioMensual: false },
        "Mauro Hernández": { password: "Mauro123", canViewItinerarioMensual: true },
        "Emily Beltrán": { password: "Emily67", canViewItinerarioMensual: true },
    },
    pdfSections: {
        "itinerario-mensual": { title: "Itinerario Mensual", url: "pdfs/itinerario-mensual.pdf" },
    }
};

let allFlightsData = [];

const passengerAirlines = ["Viva", "Volaris", "Aeromexico", "Mexicana de Aviación", "Aeurus", "Arajet"];
const cargoAirlines = ["MasAir", "China Southerrn", "Lufthansa", "Kalitta Air", "Aerounión", "Emirates Airlines", "Atlas Air", "Silk Way West Airlines", "Cathay Pacific", "United Parcel Service", "Turkish Airlines", "Cargojet Airways", "Air Canada", "Cargolux"];

const airlineColors = {
    "Viva": "#00b200", "Volaris": "#6f2da8", "Aeromexico": "#00008b", "Mexicana de Aviación": "#a52a2a", "Aeurus": "#ff4500", "Arajet": "#00ced1",
    "MasAir": "#4682b4", "China Southerrn": "#c71585", "Lufthansa": "#ffcc00", "Kalitta Air": "#dc143c", "Aerounión": "#2e8b57", "Emirates Airlines": "#d4af37", "Atlas Air": "#808080", "Silk Way West Airlines": "#f4a460", "Cathay Pacific": "#006400", "United Parcel Service": "#5f4b32", "Turkish Airlines": "#e81123", "Cargojet Airways": "#f0e68c", "Air Canada": "#f00", "Cargolux": "#00a0e2"
};

document.addEventListener('DOMContentLoaded', function() {
    // --- RENDERIZADO INICIAL ---
    loadItineraryData();      
    renderDemoras();          
    renderOperacionesTotales(); 
    createPdfSections();

    // --- EVENT LISTENERS ---
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('sidebar-nav').addEventListener('click', handleNavigation);
    document.getElementById('airline-filter').addEventListener('change', applyFilters);
    document.getElementById('claim-filter').addEventListener('input', applyFilters);
    
    document.body.addEventListener('click', function(e) {
        const fullscreenButton = e.target.closest('[data-fullscreen-target]');
        if (fullscreenButton) {
            e.preventDefault();
            const targetElement = document.querySelector(fullscreenButton.dataset.fullscreenTarget);
            if (targetElement) openFullscreen(targetElement);
        }

        if (e.target.closest('.pdf-zoom-btn')) {
            e.preventDefault();
            const container = e.target.closest('.pdf-container');
            const iframe = container.querySelector('iframe');
            if (iframe) openLightbox(iframe.getAttribute('src'));
        }
    });

    const sidebarToggler = document.getElementById('sidebar-toggler');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    if (sidebarToggler) sidebarToggler.addEventListener('click', () => {
        sidebar.classList.toggle('visible');
        overlay.classList.toggle('active');
    });
    if (overlay) overlay.addEventListener('click', () => {
        sidebar.classList.remove('visible');
        overlay.classList.remove('active');
    });

    const lightbox = document.getElementById('pdf-lightbox');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxContent = document.getElementById('lightbox-content');

    function openLightbox(iframeSrc) {
        lightboxContent.innerHTML = `<iframe src="${iframeSrc}"></iframe>`;
        lightbox.classList.remove('hidden');
    }

    function closeLightbox() {
        lightbox.classList.add('hidden');
        lightboxContent.innerHTML = '';
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => { if (e.key === "Escape") closeLightbox(); });

    updateClock();
    updateDate();
    setInterval(updateClock, 1000);
    setInterval(updateDate, 60000);
    checkSession();
});

/* --- LÓGICA DE DATOS Y FILTROS (ITINERARIO) --- */
async function loadItineraryData() {
    try {
        const response = await fetch('data/itinerario.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        allFlightsData = await response.json();
        displaySummaryTable(allFlightsData);
        populateAirlineFilter();
        applyFilters(); 
    } catch (error) {
        console.error("Error al cargar itinerario:", error);
        document.getElementById('passenger-itinerary-container').innerHTML = `<div class="alert alert-danger">Error al cargar datos del itinerario.</div>`;
    }
}

function applyFilters() {
    const selectedAirline = document.getElementById('airline-filter').value;
    const claimFilterValue = document.getElementById('claim-filter').value.trim().toLowerCase();
    let filteredData = allFlightsData;

    if (selectedAirline !== 'all') {
        filteredData = filteredData.filter(flight => flight.aerolinea === selectedAirline);
    }

    let passengerFlights = filteredData.filter(f => passengerAirlines.includes(f.aerolinea));
    let cargoFlights = filteredData.filter(f => cargoAirlines.includes(f.aerolinea));

    if (claimFilterValue !== '') {
        passengerFlights = passengerFlights.filter(flight => 
            flight.banda_reclamo && flight.banda_reclamo.toLowerCase().includes(claimFilterValue)
        );
    }

    displayPassengerTable(passengerFlights);
    displayCargoTable(cargoFlights);
}

/* --- RENDERIZADO DE TABLAS --- */
function displaySummaryTable(flights) {
    const summary = flights.reduce((acc, flight) => {
        const airline = flight.aerolinea;
        if (!acc[airline]) acc[airline] = { llegadas: 0, salidas: 0 };
        if (flight.vuelo_llegada) acc[airline].llegadas++;
        if (flight.vuelo_salida) acc[airline].salidas++;
        return acc;
    }, {});
    const container = document.getElementById('summary-table-container');
    let tableHtml = `<table class="table table-sm table-striped table-hover"><thead class="table-dark"><tr><th>Aerolínea</th><th class="text-center">Llegadas</th><th class="text-center">Salidas</th></tr></thead><tbody>`;
    for (const airline in summary) {
        const color = airlineColors[airline] || '#dee2e6';
        const llegadas = new Intl.NumberFormat('es-MX').format(summary[airline].llegadas);
        const salidas = new Intl.NumberFormat('es-MX').format(summary[airline].salidas);
        tableHtml += `<tr><td><span class="airline-dot" style="background-color: ${color};"></span> ${airline}</td><td class="text-center">${llegadas}</td><td class="text-center">${salidas}</td></tr>`;
    }
    tableHtml += `</tbody></table>`;
    container.innerHTML = tableHtml;
}

function displayPassengerTable(flights) {
    const container = document.getElementById('passenger-itinerary-container');
    if (flights.length === 0) {
        container.innerHTML = `<div class="alert alert-info">No hay vuelos de pasajeros que coincidan con los filtros.</div>`;
        return;
    }
    let tableHtml = `<table class="table table-hover table-sm itinerary-table"><thead class="table-dark"><tr><th>Aerolínea</th><th>Aeronave</th><th>Vuelo Lleg.</th><th>Origen</th><th>Hora Lleg.</th><th>Vuelo Sal.</th><th>Destino</th><th>Hora Sal.</th><th>Banda</th><th>Posición</th></tr></thead><tbody>`;
    flights.forEach(flight => {
        const color = airlineColors[flight.aerolinea] || '#f8f9fa';
        tableHtml += `<tr style="border-left: 4px solid ${color};"><td>${flight.aerolinea}</td><td>${flight.aeronave || '-'}</td><td class="monospace">${flight.vuelo_llegada || '-'}</td><td>${flight.origen || '-'}</td><td class="monospace">${flight.hora_llegada || '-'}</td><td class="monospace">${flight.vuelo_salida || '-'}</td><td>${flight.destino || '-'}</td><td class="monospace">${flight.hora_salida || '-'}</td><td class="text-center">${flight.banda_reclamo || '-'}</td><td>${flight.posicion || '-'}</td></tr>`;
    });
    tableHtml += `</tbody></table>`;
    container.innerHTML = tableHtml;
}

function displayCargoTable(flights) {
    const container = document.getElementById('cargo-itinerary-container');
    if (flights.length === 0) {
        container.innerHTML = `<div class="alert alert-info">No hay vuelos de carga que coincidan con los filtros.</div>`;
        return;
    }
    let tableHtml = `<table class="table table-hover table-sm itinerary-table"><thead class="table-dark"><tr><th>Aerolínea</th><th>Aeronave</th><th>Vuelo Lleg.</th><th>Origen</th><th>Hora Lleg.</th><th>Vuelo Sal.</th><th>Destino</th><th>Hora Sal.</th><th>Posición</th></tr></thead><tbody>`;
    flights.forEach(flight => {
        const color = airlineColors[flight.aerolinea] || '#f8f9fa';
        tableHtml += `<tr style="border-left: 4px solid ${color};"><td>${flight.aerolinea}</td><td>${flight.aeronave || '-'}</td><td class="monospace">${flight.vuelo_llegada || '-'}</td><td>${flight.origen || '-'}</td><td class="monospace">${flight.hora_llegada || '-'}</td><td class="monospace">${flight.vuelo_salida || '-'}</td><td>${flight.destino || '-'}</td><td class="monospace">${flight.hora_salida || '-'}</td><td>${flight.posicion || '-'}</td></tr>`;
    });
    tableHtml += `</tbody></table>`;
    container.innerHTML = tableHtml;
}

function populateAirlineFilter() {
    const filterSelect = document.getElementById('airline-filter');
    filterSelect.innerHTML = '<option value="all" selected>Todas las aerolíneas</option>';
    const passengerGroup = document.createElement('optgroup');
    passengerGroup.label = 'Pasajeros';
    passengerAirlines.sort().forEach(airline => {
        const option = document.createElement('option');
        option.value = airline;
        option.textContent = airline;
        passengerGroup.appendChild(option);
    });
    filterSelect.appendChild(passengerGroup);
    const cargoGroup = document.createElement('optgroup');
    cargoGroup.label = 'Carga';
    cargoAirlines.sort().forEach(airline => {
        const option = document.createElement('option');
        option.value = airline;
        option.textContent = airline;
        cargoGroup.appendChild(option);
    });
    filterSelect.appendChild(cargoGroup);
}

function renderDemoras() {
    const { periodo, causas } = staticData.demoras;
    document.getElementById('demoras-title').textContent = `Análisis de Demoras - ${periodo}`;
    const tbody = document.getElementById('demoras-tbody');
    const tfoot = document.getElementById('demoras-tfoot');
    let totalDemoras = causas.reduce((sum, item) => sum + item.demoras, 0);
    tbody.innerHTML = '';
    causas.forEach(item => {
        const porcentaje = totalDemoras > 0 ? (item.demoras / totalDemoras * 100).toFixed(2) + '%' : '0.00%';
        tbody.innerHTML += `<tr><td>${item.causa}</td><td>${new Intl.NumberFormat('es-MX').format(item.demoras)}</td><td>${porcentaje}</td></tr>`;
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

function populateOpsTable(baseId, data, valueKey) {
    const tbody = document.getElementById(`${baseId}-tbody`);
    const tfoot = document.getElementById(`${baseId}-tfoot`);
    tbody.innerHTML = '';
    let totalOps = 0;
    let totalValue = 0;
    data.forEach(row => {
        totalOps += row.operaciones;
        totalValue += row[valueKey];
        tbody.innerHTML += `<tr><td class="text-start">${row.periodo}</td><td class="text-end">${new Intl.NumberFormat('es-MX').format(row.operaciones)}</td><td class="text-end">${new Intl.NumberFormat('es-MX', {maximumFractionDigits: 2}).format(row[valueKey])}</td></tr>`;
    });
    tfoot.innerHTML = `<tr><td class="text-start">TOTAL (Histórico)</td><td class="text-end">${new Intl.NumberFormat('es-MX').format(totalOps)}</td><td class="text-end">${new Intl.NumberFormat('es-MX', {maximumFractionDigits: 2}).format(totalValue)}</td></tr>`;
}

/* --- LÓGICA DE GRÁFICAS --- */
function renderDelaysChart(causas, totalDemoras) {
    const ctx = document.getElementById('delaysChart');
    if (!ctx) return;
    if (window.myDelaysChart instanceof Chart) window.myDelaysChart.destroy();
    Chart.register(ChartDataLabels);
    const data = {
        labels: causas.map(item => `${item.causa} (${(totalDemoras > 0 ? (item.demoras / totalDemoras * 100) : 0).toFixed(1)}%)`),
        datasets: [{
            data: causas.map(item => item.demoras),
            backgroundColor: ['rgba(0, 0, 139, 0.8)','rgba(255, 193, 7, 0.8)','rgba(200, 200, 200, 0.8)','rgba(23, 162, 184, 0.8)','rgba(150, 150, 150, 0.8)','rgba(108, 117, 125, 0.8)','rgba(50, 50, 50, 0.8)'],
            borderColor: '#fff', borderWidth: 2
        }]
    };
    window.myDelaysChart = new Chart(ctx, {
        type: 'doughnut', data: data,
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' },
                title: { display: true, text: 'Distribución de Causas de Demora', font: { size: 18 }, padding: { top: 10, bottom: 20 } },
                datalabels: {
                    formatter: (value) => {
                        const percentage = totalDemoras > 0 ? (value / totalDemoras * 100) : 0;
                        return percentage < 4 ? null : percentage.toFixed(1) + '%';
                    },
                    color: '#fff', font: { weight: 'bold', size: 14 }
                }
            }
        }
    });
}

function createBarChart(canvasId, labels, data1, data2, label1, label2) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    if (canvas.chart) canvas.chart.destroy();
    const ctx = canvas.getContext('2d');
    const gradient1 = ctx.createLinearGradient(0, 0, 0, 300);
    gradient1.addColorStop(0, 'rgba(54, 162, 235, 0.8)');
    gradient1.addColorStop(1, 'rgba(54, 162, 235, 0.4)');
    const gradient2 = ctx.createLinearGradient(0, 0, 0, 300);
    gradient2.addColorStop(0, 'rgba(75, 192, 192, 0.8)');
    gradient2.addColorStop(1, 'rgba(75, 192, 192, 0.4)');
    canvas.chart = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: label1, data: data1, backgroundColor: gradient1, borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1, borderRadius: 5, hoverBackgroundColor: 'rgba(54, 162, 235, 1)',
            }, {
                label: label2, data: data2, backgroundColor: gradient2, borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1, borderRadius: 5, hoverBackgroundColor: 'rgba(75, 192, 192, 1)',
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: { y: { beginAtZero: true, ticks: { callback: value => new Intl.NumberFormat('es-MX').format(value) } } },
            plugins: {
                legend: { position: 'top' },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            // Formato con comas y hasta 2 decimales para toneladas
                            label += new Intl.NumberFormat('es-MX', {maximumFractionDigits: 2}).format(context.parsed.y);
                            return label;
                        }
                    }
                }
            }
        }
    });
}

/* --- LÓGICA DE NAVEGACIÓN Y SESIÓN --- */
function handleNavigation(e) { const target = e.target.closest('.menu-item'); if (!target) return; e.preventDefault(); const sectionId = target.dataset.section; const action = target.dataset.action; if (action === 'logout') logout(); else showSection(sectionId, target); const sidebar = document.getElementById('sidebar'); const overlay = document.getElementById('sidebar-overlay'); if (sidebar.classList.contains('visible')) { sidebar.classList.remove('visible'); overlay.classList.remove('active'); } }
function handleLogin(e) { e.preventDefault(); const username = document.getElementById('username').value; const password = document.getElementById('password').value; const errorDiv = document.getElementById('login-error'); const user = dashboardData.users[username]; if (user && user.password === password) { sessionStorage.setItem('currentUser', username); showMainApp(); } else { errorDiv.textContent = 'Usuario o contraseña incorrectos'; } }
function checkSession() { if (sessionStorage.getItem('currentUser')) showMainApp(); }
function showMainApp() { const currentUser = sessionStorage.getItem('currentUser'); const user = dashboardData.users[currentUser]; document.getElementById('login-screen').classList.add('hidden'); document.getElementById('main-app').classList.remove('hidden'); document.getElementById('current-user').textContent = `Usuario: ${currentUser}`; document.getElementById('itinerario-mensual-menu').style.display = user.canViewItinerarioMensual ? 'flex' : 'none'; const defaultSection = document.querySelector('.menu-item'); showSection(defaultSection.dataset.section, defaultSection); }
function logout() { sessionStorage.removeItem('currentUser'); document.getElementById('main-app').classList.add('hidden'); document.getElementById('login-screen').classList.remove('hidden'); document.getElementById('login-form').reset(); document.getElementById('login-error').textContent = ''; }
function showSection(sectionId, element) { document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active')); document.getElementById(`${sectionId}-section`).classList.add('active'); document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active')); element.classList.add('active'); }

/* --- UTILIDADES --- */
function updateClock() { const now = new Date(); document.getElementById('formal-clock').textContent = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }); }
function updateDate() { const now = new Date(); const dateString = now.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }); document.getElementById('current-date').textContent = dateString.charAt(0).toUpperCase() + dateString.slice(1); }
function openFullscreen(element) { if (element.requestFullscreen) element.requestFullscreen(); else if (element.mozRequestFullScreen) element.mozRequestFullScreen(); else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen(); else if (element.msRequestFullscreen) element.msRequestFullscreen(); }
function createPdfSections() { for (const [id, data] of Object.entries(dashboardData.pdfSections)) { const container = document.getElementById(`${id}-section`); if (container) container.innerHTML = `<div class="card"><div class="card-header text-center"><h2>${data.title.toUpperCase()}</h2></div><div class="card-body pdf-container"><a href="#" class="pdf-zoom-btn" title="Ampliar PDF"><i class="fas fa-search-plus"></i></a><iframe src="${data.url}" width="100%" height="800px" class="border-0"></iframe></div></div>`; } }