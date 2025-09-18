// script.js

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

let allFlightsData = []; // Variable global para guardar los datos de los vuelos

// Paleta de colores para las aerolíneas
const airlineColors = {
    "Viva": "#00b200", // Verde
    "Volaris": "#6f2da8", // Morado
    "Aeromexico": "#00008b", // Azul Oscuro
    "Mexicana de Aviación": "#a52a2a", // Marrón
    "Aeurus": "#ff4500", // NaranjaRojo
    "Arajet": "#00ced1", // Turquesa
    // Carga
    "MasAir": "#4682b4", // Azul Acero
    "China Southerrn": "#c71585", // Rojo Violeta
    "Lufthansa": "#ffcc00", // Amarillo
    "Kalitta Air": "#dc143c", // Carmesí
    "Aerounión": "#2e8b57", // Verde Mar
    "Emirates Airlines": "#d4af37", // Dorado
    "Atlas Air": "#808080", // Gris
    "Silk Way West Airlines": "#f4a460", // Arena
    "Cathay Pacific": "#006400", // Verde Oscuro
    "United Parcel Service": "#5f4b32", // Marrón UPS
    "Turkish Airlines": "#e81123", // Rojo Turquía
    "Cargojet Airways": "#f0e68c", // Caqui
    "Air Canada": "#f00", // Rojo
    "Cargolux": "#00a0e2" // Azul Cargolux
};

document.addEventListener('DOMContentLoaded', function() {
    createPdfSections();
    renderDelaysChart();
    loadItineraryData();

    // Listeners de eventos
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('sidebar-nav').addEventListener('click', handleNavigation);
    document.getElementById('airline-filter').addEventListener('change', applyFilters);
    document.getElementById('claim-filter').addEventListener('input', applyFilters);

    // Lógica para la animación de botones de descarga
    const downloadButtons = document.querySelectorAll('.download-btn');
    downloadButtons.forEach(button => {
        button.addEventListener('click', function() {
            const icon = button.querySelector('i');
            const text = button.querySelector('.btn-text');
            if (!icon || !text) return;

            const originalIconClass = icon.className;
            const originalText = text.textContent;

            icon.className = 'fas fa-spinner fa-spin me-2';
            text.textContent = 'Descargando...';
            button.classList.add('disabled');

            setTimeout(() => {
                icon.className = originalIconClass;
                text.textContent = originalText;
                button.classList.remove('disabled');
            }, 3000);
        });
    });

    // Lógica para el zoom de PDFs (Lightbox)
    const lightbox = document.getElementById('pdf-lightbox');
    const lightboxContent = document.getElementById('lightbox-content');
    const lightboxClose = document.getElementById('lightbox-close');

    function openLightbox(iframeSrc) {
        lightboxContent.innerHTML = `<iframe src="${iframeSrc}"></iframe>`;
        lightbox.classList.remove('hidden');
    }

    function closeLightbox() {
        lightbox.classList.add('hidden');
        lightboxContent.innerHTML = '';
    }
    
    document.body.addEventListener('click', function(e) {
        if (e.target.closest('.pdf-zoom-btn')) {
            e.preventDefault();
            const container = e.target.closest('.pdf-container');
            const iframe = container.querySelector('iframe');
            if (iframe) {
                const iframeSrc = iframe.getAttribute('src');
                openLightbox(iframeSrc);
            }
        }
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape") {
            closeLightbox();
        }
    });


    // Reloj y fecha
    updateClock();
    updateDate();
    setInterval(updateClock, 1000);
    setInterval(updateDate, 60000);

    // Sesión
    checkSession();
});


async function loadItineraryData() {
    try {
        const response = await fetch('data/itinerario.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        allFlightsData = await response.json();
        
        // ORDENAMIENTO ELIMINADO PARA MANTENER EL ORDEN DEL ARCHIVO
        
        displaySummaryTable(allFlightsData);
        displayItineraryTable(allFlightsData);
        populateAirlineFilter(allFlightsData);

    } catch (error) {
        console.error("No se pudo cargar el archivo de itinerario:", error);
        const container = document.getElementById('itinerary-table-container');
        if(container) {
            container.innerHTML = `<div class="alert alert-danger">Error al cargar los datos del itinerario. Verifica que el archivo <code>data/itinerario.json</code> exista y que la página se esté ejecutando desde un servidor local.</div>`;
        }
    }
}

function applyFilters() {
    const selectedAirline = document.getElementById('airline-filter').value;
    const claimFilterValue = document.getElementById('claim-filter').value.trim().toLowerCase();

    let filteredFlights = allFlightsData;

    // Filtrar por aerolínea
    if (selectedAirline !== 'all') {
        filteredFlights = filteredFlights.filter(flight => flight.aerolinea === selectedAirline);
    }

    // Filtrar por banda de reclamo
    if (claimFilterValue !== '') {
        filteredFlights = filteredFlights.filter(flight => 
            flight.banda_reclamo && flight.banda_reclamo.toLowerCase().includes(claimFilterValue)
        );
    }

    displayItineraryTable(filteredFlights);
}

function displaySummaryTable(flights) {
    const summary = flights.reduce((acc, flight) => {
        const airline = flight.aerolinea;
        if (!acc[airline]) {
            acc[airline] = { llegadas: 0, salidas: 0 };
        }
        if (flight.vuelo_llegada) acc[airline].llegadas++;
        if (flight.vuelo_salida) acc[airline].salidas++;
        return acc;
    }, {});

    const container = document.getElementById('summary-table-container');
    let tableHtml = `<table class="table table-sm table-striped table-hover">
                        <thead class="table-dark">
                            <tr>
                                <th>Aerolínea</th>
                                <th class="text-center">Llegadas</th>
                                <th class="text-center">Salidas</th>
                            </tr>
                        </thead>
                        <tbody>`;
    for (const airline in summary) {
        const color = airlineColors[airline] || '#dee2e6';
        tableHtml += `<tr>
                        <td><span class="airline-dot" style="background-color: ${color};"></span> ${airline}</td>
                        <td class="text-center">${summary[airline].llegadas}</td>
                        <td class="text-center">${summary[airline].salidas}</td>
                      </tr>`;
    }
    tableHtml += `</tbody></table>`;
    container.innerHTML = tableHtml;
}

function displayItineraryTable(flights) {
    const container = document.getElementById('itinerary-table-container');
    if (flights.length === 0) {
        container.innerHTML = `<div class="alert alert-info mt-3">No hay vuelos que coincidan con los filtros seleccionados.</div>`;
        return;
    }

    let tableHtml = `<table class="table table-hover table-sm itinerary-table">
                        <thead class="table-dark">
                            <tr>
                                <th>Aerolínea</th>
                                <th>Aeronave</th>
                                <th>Vuelo Lleg.</th>
                                <th>Origen</th>
                                <th>Hora Lleg.</th>
                                <th>Vuelo Sal.</th>
                                <th>Destino</th>
                                <th>Hora Sal.</th>
                                <th>Banda</th>
                                <th>Posición</th>
                            </tr>
                        </thead>
                        <tbody>`;
    flights.forEach(flight => {
        const color = airlineColors[flight.aerolinea] || '#f8f9fa';
        tableHtml += `<tr style="border-left: 4px solid ${color};">
                        <td>${flight.aerolinea}</td>
                        <td>${flight.aeronave || '-'}</td>
                        <td class="monospace">${flight.vuelo_llegada || '-'}</td>
                        <td>${flight.origen || '-'}</td>
                        <td class="monospace">${flight.hora_llegada || '-'}</td>
                        <td class="monospace">${flight.vuelo_salida || '-'}</td>
                        <td>${flight.destino || '-'}</td>
                        <td class="monospace">${flight.hora_salida || '-'}</td>
                        <td class="text-center">${flight.banda_reclamo || '-'}</td>
                        <td>${flight.posicion || '-'}</td>
                      </tr>`;
    });
    tableHtml += `</tbody></table>`;
    container.innerHTML = tableHtml;
}

function populateAirlineFilter(flights) {
    const filterSelect = document.getElementById('airline-filter');
    const airlines = [...new Set(flights.map(flight => flight.aerolinea))]; 
    airlines.sort();
    
    filterSelect.innerHTML = '<option value="all" selected>Filtrar por aerolínea...</option>';

    airlines.forEach(airline => {
        const option = document.createElement('option');
        option.value = airline;
        option.textContent = airline;
        filterSelect.appendChild(option);
    });
}

function handleNavigation(e) {
    const target = e.target.closest('.menu-item');
    if (!target) return;
    
    e.preventDefault();
    const sectionId = target.dataset.section;
    const action = target.dataset.action;

    if (action === 'logout') {
        logout();
    } else {
        showSection(sectionId, target);
    }
}

function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('login-error');
    
    const user = dashboardData.users[username];
    if (user && user.password === password) {
        sessionStorage.setItem('currentUser', username);
        showMainApp();
    } else {
        errorDiv.textContent = 'Usuario o contraseña incorrectos';
    }
}

function checkSession() {
    const currentUser = sessionStorage.getItem('currentUser');
    if (currentUser) {
        showMainApp();
    }
}

function showMainApp() {
    const currentUser = sessionStorage.getItem('currentUser');
    const user = dashboardData.users[currentUser];

    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');
    
    document.getElementById('current-user').textContent = `Usuario: ${currentUser}`;
    
    const itinerarioMenu = document.getElementById('itinerario-mensual-menu');
    if (user.canViewItinerarioMensual) {
        itinerarioMenu.style.display = 'flex';
    } else {
        itinerarioMenu.style.display = 'none';
    }
    
    const defaultSection = document.querySelector('.menu-item');
    showSection(defaultSection.dataset.section, defaultSection);
}

function logout() {
    sessionStorage.removeItem('currentUser');
    document.getElementById('main-app').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('login-form').reset();
    document.getElementById('login-error').textContent = '';
}

function showSection(sectionId, element) {
    document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
    document.getElementById(`${sectionId}-section`).classList.add('active');
    
    document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
    element.classList.add('active');
}

function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    document.getElementById('formal-clock').textContent = timeString;
}

function updateDate() {
    const now = new Date();
    const dateString = now.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    document.getElementById('current-date').textContent = dateString.charAt(0).toUpperCase() + dateString.slice(1);
}

function createPdfSections() {
    for (const [id, data] of Object.entries(dashboardData.pdfSections)) {
        const container = document.getElementById(`${id}-section`);
        if (container) {
            container.innerHTML = `
                <div class="card">
                    <div class="card-header text-center"><h2>${data.title.toUpperCase()}</h2></div>
                    <div class="card-body pdf-container">
                         <a href="#" class="pdf-zoom-btn" title="Ampliar PDF"><i class="fas fa-search-plus"></i></a>
                        <iframe src="${data.url}" width="100%" height="800px" class="border-0"></iframe>
                    </div>
                </div>`;
        }
    }
}

function renderDelaysChart() {
    const ctx = document.getElementById('delaysChart');
    if (!ctx) return;

    Chart.register(ChartDataLabels);

    const dataValues = [199, 5, 2];
    const total = dataValues.reduce((acc, val) => acc + val, 0);

    const data = {
        labels: [ 'Compañía', 'Combustible', 'Meteorología' ],
        datasets: [{
            label: 'Cantidad de Demoras',
            data: dataValues,
            backgroundColor: [ 'rgba(0, 0, 139, 0.7)', 'rgba(255, 193, 7, 0.8)', 'rgba(23, 162, 184, 0.7)' ],
            borderColor: '#fff',
            borderWidth: 2
        }]
    };

    new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right' },
                title: { display: true, text: 'Distribución de Causas de Demora', font: { size: 18 }, padding: { top: 10, bottom: 20 } },
                datalabels: {
                    formatter: (value) => {
                        if (value === 0) return '';
                        return (value / total * 100).toFixed(2) + '%';
                    },
                    color: '#fff',
                    font: { weight: 'bold', size: 14 }
                }
            }
        }
    });
}